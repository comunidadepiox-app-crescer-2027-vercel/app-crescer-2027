// Envio do testemunho. O app não grava nada: ele fala com a rota do servidor,
// que valida a sessão e grava no Firestore pelo Admin SDK. Não existe IA no
// caminho, e o texto chega na mesa como a pessoa escreveu. A base vem de
// EXPO_PUBLIC_API_BASE, porque o app roda no aparelho e a mesa roda na web.

import { auth } from "./firebase";
import { LIMITE_TEXTO, nomeNormalizado } from "./testemunhos";

const BASE = (process.env.EXPO_PUBLIC_API_BASE || "").replace(/\/+$/, "");

export function apiConfigurada() {
  return Boolean(BASE);
}

function soEspaco(valor) {
  return String(valor ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function mensagemDoServidor(corpo, padrao) {
  return soEspaco(corpo?.error) || padrao;
}

async function tokenDaSessao() {
  if (!auth?.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken();
  } catch {
    return null;
  }
}

// Devolve o ok ou o erro, e o id do documento gravado. A tela de confirmação
// só precisa saber que o texto entrou na fila.
export async function enviaTestemunho({ nome, anonimo, texto, autorizouUsoPublico }) {
  const padrao = "Não foi possível enviar agora. Tente novamente em instantes.";
  if (!BASE) {
    return {
      ok: false,
      erro:
        "Este aplicativo foi montado sem o endereço do servidor. " +
        "Reconecte no Expo e abra o aplicativo de novo.",
    };
  }
  const token = await tokenDaSessao();
  if (!token) {
    return { ok: false, erro: "A sessão do aplicativo não respondeu. Tente novamente em instantes." };
  }

  let resposta;
  try {
    resposta = await fetch(`${BASE}/api/testemunhos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome: nomeNormalizado({ nome, anonimo }),
        anonimo,
        texto: soEspaco(texto).slice(0, LIMITE_TEXTO),
        autorizouUsoPublico,
      }),
    });
  } catch {
    return { ok: false, erro: "Não foi possível falar com o servidor agora. Tente novamente em instantes." };
  }

  let corpo = null;
  try {
    corpo = await resposta.json();
  } catch {
    corpo = null;
  }

  if (!resposta.ok) {
    return { ok: false, erro: mensagemDoServidor(corpo, padrao) };
  }
  return {
    ok: true,
    id: corpo?.id || null,
  };
}
