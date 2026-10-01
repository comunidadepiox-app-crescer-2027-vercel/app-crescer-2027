// Envio do cadastro de Benfeitor da Fé. O app não grava nada: ele fala com a
// rota do servidor pelo token da sessão, que valida tudo de novo, grava em
// benefactorLeads pelo Admin SDK e dispara o e-mail para a comissão. É o mesmo
// caminho de testimonials.
//
// A chave e o endereço da comissão vivem no servidor, então nada disso entra no
// bundle. A base vem de EXPO_PUBLIC_API_BASE, porque o app roda no aparelho e a
// mesa roda na web.

import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { auth, db } from "./firebase";
import { LIMITE_NOME, somenteDigitos } from "./benfeitor";

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

// Reabrir a aba depois do envio abre a confirmação, sem o formulário de novo.
// A leitura é do próprio uid, e a rule permite porque a query é filtrada pelo
// mesmo uid da sessão.
export async function jaTemLead(uid) {
  if (!db || !uid) return false;
  try {
    const consulta = query(
      collection(db, "benefactorLeads"),
      where("uid", "==", uid),
      limit(1)
    );
    const snap = await getDocs(consulta);
    return !snap.empty;
  } catch {
    // Sem rede, a tela mostra o formulário. A trava por uid continua existindo
    // no servidor, então o reenvio não duplica nada.
    return false;
  }
}

// Devolve o ok ou o erro, o id do documento e se o e-mail da commission saiu.
// emailEnviado false não é erro: o lead está gravado em /admin/leads, e a
// tela troca a frase da confirmação em vez de mostrar erro.
export async function enviaLeadBenfeitor({ name, email, phone, cpf, lgpdConsent }) {
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
    resposta = await fetch(`${BASE}/api/lead-benfeitor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: soEspaco(name).slice(0, LIMITE_NOME),
        email: soEspaco(email).toLowerCase(),
        phone: somenteDigitos(phone),
        cpf: somenteDigitos(cpf),
        lgpdConsent: lgpdConsent === true,
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
    jaEnviado: corpo?.jaEnviado === true,
    emailEnviado: corpo?.emailEnviado === true,
  };
}
