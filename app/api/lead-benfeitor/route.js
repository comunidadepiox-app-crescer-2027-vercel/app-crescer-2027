import { tokenDoHeader, verificaUsuario } from "@/lib/server/verificaAdmin";
import { enviaEmailBenfeitor } from "@/lib/server/emailBenfeitor";
import { atualizarAvisoLead, criarDocumento, existeDocumentoComUid } from "@/lib/server/firestoreRest";

const LIMITE_NOME = 120;

// A service account grava via REST porque o Admin SDK usa geração de código bloqueada no Workers.
function soEspaco(valor) {
  return String(valor ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function digitos(valor) {
  return String(valor ?? "").replace(/\D/g, "");
}

function emailValido(email) {
  const limpo = soEspaco(email).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpo) && limpo.length <= 254 ? limpo : null;
}

function celularValido(telefone) {
  const d = digitos(telefone);
  return d.length === 10 || d.length === 11 ? d : null;
}

// Mesma conta do app. O CPF não é dado de cadastro, é o documento que a equipe
// usa para concluir o Benfeitor, então a validação é por algoritmo e não só
// pelo tamanho.
function cpfValido(cpf) {
  const d = digitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return null;
  const digito = (fim) => {
    let soma = 0;
    for (let i = 0; i < fim; i++) soma += Number(d[i]) * (fim + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  if (digito(9) !== Number(d[9]) || digito(10) !== Number(d[10])) return null;
  return d;
}

function mensagemDeErro(codigo) {
  if (codigo === "sessao") return "Sessão inválida.";
  if (codigo === "nome") return "Informe seu nome completo.";
  if (codigo === "email") return "Informe um e-mail válido.";
  if (codigo === "celular") return "Informe um celular com DDD, por exemplo (83) 98897-7017.";
  if (codigo === "cpf") return "Este CPF não é válido. Confira os números.";
  if (codigo === "consentimento") return "É preciso autorizar o uso dos dados para continuar.";
  if (codigo === "indisponivel") {
    return "O serviço de cadastro está fora do ar agora. Tente novamente em instantes.";
  }
  return "Não foi possível enviar agora. Tente novamente em instantes.";
}

// Uma sessão envia uma vez. O uid sobrevive ao fechar o app, então a trava pega
// a reinstalação também. O índice de uid é automático, sem composto.
export async function POST(request) {
  const uid = await verificaUsuario(tokenDoHeader(request));
  if (!uid) {
    return Response.json({ error: mensagemDeErro("sessao") }, { status: 401 });
  }

  const corpo = await request.json().catch(() => ({}));

  // Sem consentimento, nada é gravado e nenhum e-mail sai. A caixa é do
  // titular, e o CPF e o telefone são dados de LGPD.
  if (corpo?.lgpdConsent !== true) {
    return Response.json({ error: mensagemDeErro("consentimento") }, { status: 400 });
  }

  const nome = soEspaco(corpo?.name).slice(0, LIMITE_NOME);
  if (!nome) {
    return Response.json({ error: mensagemDeErro("nome") }, { status: 400 });
  }

  const email = emailValido(corpo?.email);
  if (!email) {
    return Response.json({ error: mensagemDeErro("email") }, { status: 400 });
  }

  const celular = celularValido(corpo?.phone);
  if (!celular) {
    return Response.json({ error: mensagemDeErro("celular") }, { status: 400 });
  }

  const cpf = cpfValido(corpo?.cpf);
  if (!cpf) {
    return Response.json({ error: mensagemDeErro("cpf") }, { status: 400 });
  }

  // Reenvio não duplica: a resposta é de sucesso, porque para o fiel o cadastro
  // já existe. A tela abre a confirmação e não mostra erro.
  let jaGravado;
  try {
    jaGravado = await existeDocumentoComUid("benefactorLeads", uid);
  } catch (erro) {
    console.error("Crescer: não foi possível ler os leads do uid.", erro?.message || erro);
    return Response.json({ error: mensagemDeErro("indisponivel") }, { status: 500 });
  }
  if (jaGravado) {
    return Response.json({ ok: true, id: null, jaEnviado: true, emailEnviado: false });
  }

  const criadoEm = new Date();

  // O documento é montado inteiro aqui. status, uid e origem do corpo da
  // requisição são ignorados de propósito.
  const documento = {
    name: nome,
    email,
    phone: celular,
    cpf,
    lgpdConsent: true,
    uid,
    status: "novo",
    origem: "app",
    emailAvisado: false,
    emailAvisadoEm: null,
  };

  let id;
  try {
    id = await criarDocumento("benefactorLeads", documento, ["lgpdConsentAt", "createdAt"]);
  } catch {
    return Response.json({ error: mensagemDeErro("indisponivel") }, { status: 500 });
  }

  // O lead está na mesa. O e-mail vem depois e é a segunda via: se falhar, ou
  // se a chave e o destino ainda não existirem, o cadastro continua valendo e
  // a resposta diz que o e-mail não saiu, para a tela trocar a frase.
  let emailEnviado = false;
  try {
    emailEnviado = await enviaEmailBenfeitor({
      nome,
      email,
      celular,
      cpf,
      criadoEm,
    });
  } catch {
    emailEnviado = false;
  }

  try {
    await atualizarAvisoLead(id, emailEnviado);
  } catch {
    // A gravação do lead já deu certo. Falhar só a anotagem do aviso não pode
    // devolver erro para o fiel, porque o cadastro está feito.
  }

  return Response.json({ ok: true, id, jaEnviado: false, emailEnviado });
}
