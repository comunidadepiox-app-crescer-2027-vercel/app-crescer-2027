import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import {
  DESTINO,
  LIMITE_CHAMADAS,
  classificarTransito,
  decidirEnvio,
  dentroDaJanela,
  dentroDoRelogio,
  envioTravado,
  formatarHora,
  horaDeSairMs,
  idAlerta,
  inicioDoItemMs,
  lerResumo,
  limiteAtingido,
  mesRecife,
  minutosDeViagem,
  origemFresca,
  rotaPrecisaRecalcular,
  textoAviso,
  textoSemLocal,
} from "./calculo.js";
import { consultarRota } from "./tomtom.js";

const EXPO_PUSH = "https://exp.host/--/api/v2/push/send";

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

async function reservarChamada(db, mes) {
  const ref = db.collection("mapsUsage").doc(mes);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const count = snap.exists ? Number(snap.get("count")) || 0 : 0;
    if (limiteAtingido(count, LIMITE_CHAMADAS)) return false;
    tx.set(
      ref,
      { count: count + 1, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );
    return true;
  });
}

async function travarEnvio(db, id, agoraMs) {
  const ref = db.collection("trafficAlerts").doc(id);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data() || {};
    if (data.sentAt || data.status === "enviado") return false;
    const enviandoEm = data.enviandoEm?.toMillis?.() ?? null;
    if (envioTravado(data.status, enviandoEm, agoraMs)) return false;
    const inicio = inicioDoItemMs(data.itemDate, data.itemTime);
    const decisao = decidirEnvio({
      agoraMs,
      inicioMs: inicio,
      sairMs: data.sairMs ?? null,
      enviado: false,
    });
    if (decisao !== "enviar") return false;
    tx.set(
      ref,
      { status: "enviando", enviandoEm: FieldValue.serverTimestamp() },
      { merge: true }
    );
    return true;
  });
}

async function enviarPush(tokens, body) {
  for (let i = 0; i < tokens.length; i += 100) {
    const lote = tokens.slice(i, i + 100).map((to) => ({
      to,
      title: "Crescer",
      body,
      sound: "default",
      channelId: "saida",
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

async function emFila(itens, n, fn) {
  if (!itens.length) return;
  let cursor = 0;
  async function trabalhador() {
    while (cursor < itens.length) {
      const atual = itens[cursor];
      cursor += 1;
      await fn(atual);
    }
  }
  const vagas = Math.min(n, itens.length);
  await Promise.all(Array.from({ length: vagas }, trabalhador));
}

function millis(valor) {
  if (!valor) return null;
  if (typeof valor.toMillis === "function") return valor.toMillis();
  if (typeof valor === "number") return valor;
  return null;
}

async function montarPares(db, agoraMs) {
  const publicados = await db.collection("programItems").where("published", "==", true).get();
  const itens = new Map();
  publicados.forEach((docSnap) => {
    const item = { id: docSnap.id, ...docSnap.data() };
    const inicio = inicioDoItemMs(item.date, item.time);
    if (inicio != null && dentroDaJanela(agoraMs, inicio)) itens.set(item.id, item);
  });
  if (!itens.size) return [];

  const marcas = await db.collectionGroup("queroIr").get();
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

async function carregarContexto(db, pares) {
  const uids = [...new Set(pares.map((p) => p.uid))];
  const usuarios = new Map();
  for (let i = 0; i < uids.length; i += 100) {
    const refs = uids.slice(i, i + 100).map((uid) => db.collection("users").doc(uid));
    const snaps = await db.getAll(...refs);
    snaps.forEach((snap) => {
      if (snap.exists) usuarios.set(snap.id, snap.data());
    });
  }

  const tokens = new Map();
  for (let i = 0; i < uids.length; i += 30) {
    const lote = uids.slice(i, i + 30);
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

  const alertas = new Map();
  for (let i = 0; i < pares.length; i += 100) {
    const refs = pares.slice(i, i + 100).map((p) => db.collection("trafficAlerts").doc(idAlerta(p.uid, p.item.id)));
    const snaps = await db.getAll(...refs);
    snaps.forEach((snap) => {
      if (snap.exists) alertas.set(snap.id, snap.data());
    });
  }

  return pares.map((p) => ({
    ...p,
    user: usuarios.get(p.uid) || null,
    tokens: tokens.get(p.uid) || [],
    alerta: alertas.get(idAlerta(p.uid, p.item.id)) || {},
  }));
}

async function processar(db, par, agoraMs, mes, apiKey) {
  const id = idAlerta(par.uid, par.item.id);
  const ref = db.collection("trafficAlerts").doc(id);
  const alerta = par.alerta;
  const titulo = par.item.title || "programação";

  const origem = par.user?.origem;
  const coordenadaOk =
    typeof origem?.lat === "number" && typeof origem?.lng === "number";
  if (!coordenadaOk || !origemFresca(millis(origem?.updatedAt), agoraMs)) {
    if (!alerta.nudgeEm && par.tokens.length) {
      await enviarPush(par.tokens, textoSemLocal(titulo));
      await ref.set(
        {
          uid: par.uid,
          itemId: par.item.id,
          nudgeEm: FieldValue.serverTimestamp(),
          status: "pedido-local",
        },
        { merge: true }
      );
    }
    return;
  }

  if (alerta.sentAt || alerta.status === "enviado") return;

  const itemMudou = alerta.itemDate !== par.item.date || alerta.itemTime !== par.item.time;
  let eta = alerta.etaMinutos;
  let nivel = alerta.nivel;
  let sairMs = alerta.sairMs ?? null;
  const inicio = inicioDoItemMs(par.item.date, par.item.time);

  if (rotaPrecisaRecalcular(millis(alerta.calculadoEm), agoraMs, itemMudou || eta == null)) {
    const liberado = await reservarChamada(db, mes);
    if (!liberado) {
      if (eta == null) return;
    } else {
      const corpo = await consultarRota({
          origem: { lat: origem.lat, lng: origem.lng },
        destino: DESTINO,
        apiKey,
      });
      const resumo = lerResumo(corpo);
      if (!resumo) return;
      nivel = classificarTransito(resumo.travel, resumo.delay);
      eta = minutosDeViagem(resumo.travel);
      sairMs = horaDeSairMs(inicio, eta);
      if (!nivel || sairMs == null) return;
      await ref.set(
        {
          uid: par.uid,
          itemId: par.item.id,
          itemDate: par.item.date,
          itemTime: par.item.time,
          etaMinutos: eta,
          nivel,
          sairMs,
          sairAs: formatarHora(sairMs),
          calculadoEm: FieldValue.serverTimestamp(),
          status: "calculado",
        },
        { merge: true }
      );
    }
  }

  if (sairMs == null || !nivel) return;
  const travado = envioTravado(alerta.status, millis(alerta.enviandoEm), agoraMs);
  const decisao = decidirEnvio({
    agoraMs,
    inicioMs: inicio,
    sairMs,
    enviado: Boolean(alerta.sentAt) || travado,
  });
  if (decisao !== "enviar" || !par.tokens.length) return;

  const ganhou = await travarEnvio(db, id, agoraMs);
  if (!ganhou) return;
  try {
    await enviarPush(par.tokens, textoAviso({ titulo, nivel, hora: formatarHora(sairMs) }));
    await ref.set(
      { status: "enviado", sentAt: FieldValue.serverTimestamp(), sairAs: formatarHora(sairMs) },
      { merge: true }
    );
  } catch (err) {
    await ref.set({ status: "calculado", enviandoEm: FieldValue.delete() }, { merge: true });
    throw err;
  }
}

async function main() {
  const agoraMs = Date.now();
  const forcar = process.env.AVISO_SAIDA_FORCAR === "1";
  if (!forcar && !dentroDoRelogio(agoraMs)) {
    console.log("Fora da janela do encontro.");
    return;
  }
  const apiKey = process.env.TOMTOM_API_KEY;
  if (!apiKey) throw new Error("TOMTOM_API_KEY ausente.");

  const db = firestore();
  const pares = await montarPares(db, agoraMs);
  if (!pares.length) {
    console.log("Nenhum Quero ir na janela de 70 minutos.");
    return;
  }
  const prontos = await carregarContexto(db, pares);
  const mes = mesRecife(agoraMs);
  let falhas = 0;
  await emFila(prontos, 2, async (par) => {
    try {
      await processar(db, par, agoraMs, mes, apiKey);
    } catch {
      falhas += 1;
      console.error(`Falha no item ${par.item.id}.`);
    }
  });
  if (falhas) throw new Error(`${falhas} aviso(s) falharam.`);
  console.log(`Conferido: ${prontos.length} marca(s).`);
}

const executadoDireto = process.argv[1]?.replace(/\\/g, "/").endsWith("executar.js");
if (executadoDireto) {
  main().catch((err) => {
    console.error(err?.message || "Falha no aviso de saída.");
    process.exitCode = 1;
  });
}
