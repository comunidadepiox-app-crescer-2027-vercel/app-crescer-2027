import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

import { tokenDoHeader, verificaUsuario } from "@/lib/server/verificaAdmin";
import { filtraTestemunho, textoLimpo } from "@/lib/server/iaTestemunho";

const LIMITE_NOME = 60;
const LIMITE_TEXTO = 2000;
const MINIMO_TEXTO = 20;

// Firestore pelo Admin SDK, com a service account. É a única via de escrita
// em testimonials, porque as rules rejeitam qualquer escrita do client.
function firestoreAdmin() {
  if (!getApps().length) {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!json) return null;
    initializeApp({ credential: cert(JSON.parse(json)) });
  }
  return getFirestore();
}

function agora() {
  return FieldValue.serverTimestamp();
}

function soEspaco(valor) {
  return String(valor ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function mensagemDeErro(codigo) {
  if (codigo === "vazio") return "Escreva o seu testemunho antes de enviar.";
  if (codigo === "curto") return "Escreva um pouco mais, com pelo menos 20 letras.";
  if (codigo === "longo") return `O texto passa de ${LIMITE_TEXTO} caracteres.`;
  if (codigo === "nome") return `O nome passa de ${LIMITE_NOME} caracteres.`;
  if (codigo === "indisponivel") {
    return "O serviço de testemunhos está fora do ar agora. Tente novamente em instantes.";
  }
  return "Não foi possível enviar agora. Tente novamente em instantes.";
}

// Uma sessão anônima envia uma vez. O uid sobrevive ao fechar o app, então a
// trava pega a reinstallação também. O limite é do Firestore: o índice de
// uid é automático, sem composto.
async function jaEnviou(db, uid) {
  const snap = await db.collection("testimonials").where("uid", "==", uid).limit(1).get();
  return !snap.empty;
}

export async function POST(request) {
  const uid = await verificaUsuario(tokenDoHeader(request));
  if (!uid) {
    return Response.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const corpo = await request.json().catch(() => ({}));
  const texto = textoLimpo(corpo?.texto);
  if (!texto) {
    return Response.json({ error: mensagemDeErro("vazio") }, { status: 400 });
  }
  if (texto.length < MINIMO_TEXTO) {
    return Response.json({ error: mensagemDeErro("curto") }, { status: 400 });
  }
  if (texto.length > LIMITE_TEXTO) {
    return Response.json({ error: mensagemDeErro("longo") }, { status: 400 });
  }

  const anonimo = corpo?.anonimo === true;
  let nome = soEspaco(corpo?.nome).slice(0, LIMITE_NOME);
  if (anonimo) nome = "";
  if (!anonimo && !nome) {
    return Response.json({ error: "Escreva o nome ou marque a opção de anônimo." }, { status: 400 });
  }

  const db = firestoreAdmin();
  if (!db) {
    return Response.json({ error: mensagemDeErro("indisponivel") }, { status: 500 });
  }

  if (await jaEnviou(db, uid)) {
    return Response.json({ error: "Você já enviou um testemunho nesta edição." }, { status: 429 });
  }

  // A IA não tem poder de decidir o que entra no evento. Ela recusa, suaviza e
  // resume. Chave fora, cota estourada ou resposta torta caem em revisao, e o
  // texto não se perde.
  let status = "revisao";
  let resumo = "";
  let motivoRecusa = null;
  let moderacao = "fallback";

  const decisao = await filtraTestemunho(texto);
  if (decisao) {
    moderacao = "groq";
    if (decisao.aprovado) {
      status = "novo";
      resumo = decisao.resumo;
    } else {
      status = "recusado_ia";
      motivoRecusa = decisao.motivo;
    }
  }

  const documento = {
    nome,
    anonimo,
    texto,
    resumo,
    status,
    pasta: "aguardando",
    motivoRecusa,
    uid,
    origem: "app",
    moderacao,
    lidoAt: null,
    decididoAt: null,
    decididoPor: null,
    createdAt: agora(),
    updatedAt: agora(),
  };

  try {
    const ref = await db.collection("testimonials").add(documento);
    return Response.json({
      ok: true,
      id: ref.id,
      status,
      mensagem: mensagemPorStatus(status),
    });
  } catch {
    return Response.json({ error: mensagemDeErro("indisponivel") }, { status: 500 });
  }
}

function mensagemPorStatus(status) {
  if (status === "recusado_ia") {
    return "Recebemos o seu texto, mas ele não entra na fila de leitura. A equipe avalia com cuidado.";
  }
  if (status === "revisao") {
    return "Recebemos o seu texto. A equipe vai avaliar com cuidado.";
  }
  return "Recebemos o seu testemunho. Obrigado por compartilhar.";
}
