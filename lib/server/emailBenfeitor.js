// Aviso por e-mail do cadastro de Benfeitor da Fé, para a comissão.
//
// Transporte Resend por fetch direto, sem SDK e sem dependência nova no
// package.json, no mesmo formato de app/api/notify-programa, que já chama uma
// API externa do mesmo jeito.
//
// Nada deste arquivo entra no bundle do app. A chave e o destino vivem no
// servidor, e o corpo do pedido do cliente nunca aponta o e-mail para outro
// lugar.
//
// O destino pode ser alterado pela mesa em /admin/benfeitor. A constante e
// EMAIL_BENFEITOR_DESTINO servem como fallback antes da primeira configuração.

import { lerConfiguracaoBenfeitor } from "@/lib/server/firestoreRest";

const DESTINO = "heltonpierre@gmail.com";
  
export const REMETENTE_PADRAO = "Crescer <onboarding@resend.dev>";

// Um e-mail só, e o destino nunca vem do corpo da requisição: quem chama é a
// rota do servidor, com o endereço daqui.
export async function destinoBenfeitor() {
  let configurado = null;
  try {
    configurado = await lerConfiguracaoBenfeitor();
  } catch {
    // A indisponibilidade do Firestore não deve impedir o envio pelo destino de fallback.
  }
  return String(configurado || process.env.EMAIL_BENFEITOR_DESTINO || DESTINO).trim();
}

function remetente() {
  return String(process.env.EMAIL_BENFEITOR_REMETENTE || "").trim() || REMETENTE_PADRAO;
}

function digitos(valor) {
  return String(valor || "").replace(/\D/g, "");
}

function formataCelular(valor) {
  const d = digitos(valor).slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function formataCpf(valor) {
  const d = digitos(valor).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function dataDeBrasilia(quando) {
  const data = quando instanceof Date && !Number.isNaN(quando.getTime()) ? quando : new Date();
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(data);
  } catch {
    return data.toISOString().slice(0, 16).replace("T", " ");
  }
}

// Texto puro com quebras de linha, sem HTML e sem tabela. A comissão lê no
// celular, e o assunto já diz de onde veio o cadastro.
//
// O CPF entra porque é o dado que a equipe usa para concluir o cadastro de
// Benfeitor, e o titular autorizou esse uso na caixa de consentimento.
export function corpoEmailBenfeitor(lead) {
  return [
    "Novo cadastro de Benfeitor da Fé pelo aplicativo Crescer.",
    "",
    `Nome: ${String(lead?.nome || "").trim()}`,
    `E-mail: ${String(lead?.email || "").trim()}`,
    `Celular: ${formataCelular(lead?.celular)}`,
    `CPF: ${formataCpf(lead?.cpf)}`,
    `Recebido em: ${dataDeBrasilia(lead?.criadoEm)}`,
    "",
    "Responda este e-mail para falar com a pessoa: o endereço acima é o contato",
    "informado por ela no formulário.",
    "",
    "Este cadastro é um interesse. Nenhum pagamento foi feito no aplicativo.",
    "O mesmo cadastro está na mesa da equipe, em /admin/leads.",
  ].join("\n");
}

export function assuntoEmailBenfeitor(lead) {
  const nome = String(lead?.nome || "").trim();
  return nome
    ? `Novo Benfeitor da Fé: ${nome}`
    : "Novo Benfeitor da Fé pelo aplicativo";
}

// Devolve true só quando o Resend aceitou. Sem chave, sem destino, com a chave
// errada ou com a rede caída, devolve false: quem chamou grava o lead de
// qualquer forma e só usa isso para trocar a frase da confirmação. O e-mail é
// a segunda via do cadastro, nunca a fonte dele.
export async function enviaEmailBenfeitor(lead) {
  const destino = await destinoBenfeitor();
  const chave = String(process.env.RESEND_API_KEY || "").trim();
  if (!destino || !chave) return false;

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: remetente(),
        to: [destino],
        subject: assuntoEmailBenfeitor(lead),
        text: corpoEmailBenfeitor(lead),
        reply_to: String(lead?.email || "").trim() || undefined,
      }),
    });
    return resposta.ok;
  } catch {
    return false;
  }
}


