import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import {
  dentroDaJanela,
  dentroDoRelogio,
  idAviso,
  inicioDoItemMs,
  marcosPendentes,
  textoAviso,
} from "./calculo.js";

const EXPO_PUSH = "https://exp.host/--/api/v2/push/send";

// Lotes de 100 na API do Expo e de 30 na leitura de token, que é onde o
// Firestore começa a reclamar de índice e de cota.
const LOTE_PUSH = 100;
const LOTE_UIDS = 30;

function carregarEnvLocal() {
  const caminho = resolve(dirname(fileURLToPath(import.meta.url)), "../../.env");
  if (!existsSync(caminho)) return;
  for (const bruto of readFileSync(caminho, "utf8").split(/\r?\n/)) {
    const linha = bruto.trim();
    if (!linha || linha.startsWith("#")) continue;
    const eq = linha.indexOf("=");
    if (eq === -1) continue;
    const chave = linha.slice(0, eq).trim();
    if (process.env[chave]) continue;
    let valor = linha.slice(eq + 1).trim();
    if (valor.startsWith("'") && valor.endsWith("'")) valor = valor.slice(1, -1);
    process.env[chave] = valor;
  }
}

carregarEnvLocal();

function firestore() {
  if (!getApps().length) {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!json) throw new Error("FIREBASE_SERVICE_ACCOUNT ausente.");
    initializeApp({ credential: cert(JSON.parse(json)) });
  }
  return getFirestore();
}

async function enviarPush(tokens, corpo) {
  for (let i = 0; i < tokens.length; i += LOTE_PUSH) {
    const lote = tokens.slice(i, i + LOTE_PUSH).map((to) => ({
      to,
      title: "Crescer",
      body: corpo,
      sound: "default",
      channelId: "aviso",
    }));
    const res = await fetch(EXPO_PUSH, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lote),
    });
    if (!res.ok) throw new Error("O serviço de notificação recusou o envio.");
  }
}

// Reserva os marcos vencidos de uma pessoa e de um item.
//
// A leitura acontece dentro da transação, e não antes, porque a trava é o
// próprio documento. Sem a releitura, duas execuções do GitHub Actions que se
// cruzassem mandariam o mesmo aviso duas vezes. A escrita sai da lista para
// `marcos` antes do push; se o push falhar, `desfazerMarcos` devolve o marco
// para a execução seguinte tentar de novo.
async function reservarMarcos(db, uid, itemId, agoraMs, inicioMs) {
  const ref = db.collection("lembreteAvisos").doc(idAviso(uid, itemId));
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data() || {};
    const pendentes = marcosPendentes({ agoraMs, inicioMs, enviados: data.marcos || [] });
    if (!pendentes.length) return [];

    const marcos = [...new Set([...(data.marcos || []), ...pendentes])].sort((a, b) => b - a);
    tx.set(
      ref,
      { uid, itemId, marcos, atualizadoEm: FieldValue.serverTimestamp() },
      { merge: true }
    );
    return pendentes;
  });
}

async function desfazerMarcos(db, uid, itemId, perdidos) {
  if (!perdidos.length) return;
  const ref = db.collection("lembreteAvisos").doc(idAviso(uid, itemId));
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const atuais = snap.data()?.marcos || [];
    const marcos = atuais.filter((marco) => !perdidos.includes(marco)).sort((a, b) => b - a);
    tx.set(ref, { marcos, atualizadoEm: FieldValue.serverTimestamp() }, { merge: true });
  });
}

// Itens publicados que começam dentro da janela do maior marco.
async function itensDaJanela(db, agoraMs) {
  const publicados = await db.collection("programItems").where("published", "==", true).get();
  const itens = new Map();
  publicados.forEach((docSnap) => {
    const item = { id: docSnap.id, ...docSnap.data() };
    const inicio = inicioDoItemMs(item.date, item.time);
    if (inicio != null && dentroDaJanela(agoraMs, inicio)) itens.set(item.id, { ...item, inicio });
  });
  return itens;
}

// Um par por pessoa marcada e por item na janela. O uid vem do caminho do
// documento, porque o job lê com o Admin SDK e não tem sessão.
async function montarPares(db, itens) {
  if (!itens.size) return [];
  const marcas = await db.collectionGroup("lembretes").get();
  const pares = [];
  marcas.forEach((docSnap) => {
    const itemId = docSnap.get("itemId") || docSnap.id;
    const item = itens.get(itemId);
    if (!item) return;
    const uid = docSnap.ref.parent.parent?.id;
    if (uid) pares.push({ uid, item });
  });
  return pares;
}

async function buscarTokens(db, uids) {
  const tokens = new Map();
  for (let i = 0; i < uids.length; i += LOTE_UIDS) {
    const lote = uids.slice(i, i + LOTE_UIDS);
    const snaps = await db.collection("deviceTokens").where("uid", "in", lote).get();
    snaps.forEach((snap) => {
      const uid = snap.get("uid");
      const token = snap.get("token");
      if (!uid || !token) return;
      const lista = tokens.get(uid) || [];
      lista.push(token);
      tokens.set(uid, lista);
    });
  }
  return tokens;
}

async function processar(db, par, agoraMs) {
  const pendentes = await reservarMarcos(db, par.uid, par.item.id, agoraMs, par.item.inicio);
  if (!pendentes.length) return 0;

  const tokens = par.tokens || [];
  if (!tokens.length) {
    // Sem token o aviso não tem para onde ir. O marco fica registrado como
    // enviado, porque repetir a mesma tentativa a cada 5 minutos não ajuda
    // ninguém, e a pessoa pode ativar o aviso depois pela tela do app.
    return 0;
  }

  const titulo = par.item.title || "a programação";
  const perdidos = [];
  for (const marco of pendentes) {
    try {
      await enviarPush(tokens, textoAviso(marco, titulo));
    } catch {
      perdidos.push(marco);
    }
  }
  await desfazerMarcos(db, par.uid, par.item.id, perdidos);
  return pendentes.length - perdidos.length;
}

async function main() {
  const agoraMs = Date.now();
  const forcar = process.env.LEMBRETE_FORCAR === "1";
  if (!forcar && !dentroDoRelogio(agoraMs)) {
    console.log("Fora da janela do encontro.");
    return;
  }

  const db = firestore();
  const itens = await itensDaJanela(db, agoraMs);
  const pares = await montarPares(db, itens);
  if (!pares.length) {
    console.log("Nenhum Avise-me na janela de avisos.");
    return;
  }

  const tokens = await buscarTokens(db, [...new Set(pares.map((p) => p.uid))]);
  const prontos = pares.map((p) => ({ ...p, tokens: tokens.get(p.uid) || [] }));

  let enviados = 0;
  for (const par of prontos) {
    try {
      enviados += await processar(db, par, agoraMs);
    } catch (err) {
      console.error(`Falha no item ${par.item.id}.`, err?.message || err);
    }
  }

  console.log(
    `Conferido: ${prontos.length} lembrete(s) marcado(s), ${enviados} aviso(s) enviado(s).`
  );
}

const executadoDireto = process.argv[1]?.replace(/\\/g, "/").endsWith("executar.js");
if (executadoDireto) {
  main().catch((err) => {
    console.error(err?.message || "Falha no aviso do Avise-me.");
    process.exitCode = 1;
  });
}
