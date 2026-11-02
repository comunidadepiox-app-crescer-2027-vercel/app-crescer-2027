import { tokenDoHeader, verificaUsuario } from "@/lib/server/verificaAdmin";
import { criarDocumento } from "@/lib/server/firestoreRest";

const LIMITE_NOME = 60;
const LIMITE_TEXTO = 2000;
const MINIMO_TEXTO = 20;

// O Route Handler grava com o token Firebase da pessoa; as rules limitam a escrita ao próprio envio.
function soEspaco(valor) {
  return String(valor ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

// O texto vai como a pessoa escreveu, só com quebra de linha limpa e espaço
// nas pontas. Não há resumo, filtro nem suavização: quem decide é a equipe,
// lendo o original na mesa.
function textoLimpo(valor) {
  return String(valor ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\n{3,}/g, "\n\n")
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

// Uma sessão anônima envia uma vez. O uid vira o id do documento e a precondição
// exists:false impede duplicatas sem precisar ler o texto enviado.
export async function POST(request) {
  const idToken = tokenDoHeader(request);
  const uid = await verificaUsuario(idToken);
  if (!uid) {
    return Response.json({ error: "Sessão inválida." }, { status: 401 });
  }

  const corpo = await request.json().catch(() => ({}));
  if (corpo?.autorizouUsoPublico !== true) {
    return Response.json({ error: "Marque a autorização para enviar seu testemunho." }, { status: 400 });
  }
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

  // Nada é recusado na entrada. Depreciação, ansiedade, perda, abuso e
  // adoecimento mental chegam inteiros, e a decisão é da equipe na mesa.
  const documento = {
    nome,
    anonimo,
    texto,
    autorizouUsoPublico: true,
    status: "novo",
    pasta: "aguardando",
    uid,
    origem: "app",
    lidoAt: null,
    decididoAt: null,
    decididoPor: null,
  };

  try {
    const id = await criarDocumento("testimonials", documento, ["createdAt", "updatedAt"], {
      id: uid,
      idToken,
    });
    return Response.json({ ok: true, id });
  } catch (erro) {
    if (erro?.code === "ALREADY_EXISTS" || erro?.code === "FAILED_PRECONDITION") {
      return Response.json({ error: "Você já enviou um testemunho nesta edição." }, { status: 429 });
    }
    console.error("Crescer: não foi possível gravar o testemunho.", erro?.code || erro?.message || erro);
    return Response.json({ error: mensagemDeErro("indisponivel") }, { status: 500 });
  }
}
