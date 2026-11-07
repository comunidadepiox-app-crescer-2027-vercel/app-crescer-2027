import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const FUSO = "America/Recife";
const EXPO = "https://exp.host/--/api/v2/push/send";

function carregarEnvLocal() {
  const caminho = resolve(dirname(fileURLToPath(import.meta.url)), "../../.env");
  if (!existsSync(caminho)) return;
  for (const linha of readFileSync(caminho, "utf8").split(/\r?\n/)) {
    const eq = linha.indexOf("=");
    if (eq < 1 || linha.trim().startsWith("#")) continue;
    const chave = linha.slice(0, eq).trim();
    if (process.env[chave]) continue;
    process.env[chave] = linha.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
  }
}

function firestore() {
  if (!getApps().length) {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) throw new Error("FIREBASE_SERVICE_ACCOUNT ausente.");
    initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  }
  return getFirestore();
}

function dataHoraLocal(date = new Date()) {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const valor = Object.fromEntries(partes.map(({ type, value }) => [type, value]));
  return { date: `${valor.year}-${valor.month}-${valor.day}`, time: `${valor.hour}:${valor.minute}` };
}

async function tokensAtivos(db) {
  const snap = await db.collection("deviceTokens").get();
  return [...new Map(snap.docs.map((d) => ({ token: d.get("token"), uid: d.get("uid"), silenciado: d.get("silenciado") === true })).filter((d) => d.token).map((d) => [d.token, d])).values()];
}

async function disparar(tokens, title, body) {
  let sent = 0;
  let total = 0;
  const failures = {};
  const usuariosNotificados = new Set();
  for (let i = 0; i < tokens.length; i += 100) {
    const lote = tokens.slice(i, i + 100);
    total += lote.length;
    const res = await fetch(EXPO, {
      method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(lote.map(({ token, silenciado }) => ({ to: token, title, body, ...(silenciado ? { channelId: "aviso-silencioso" } : { sound: "default", channelId: "aviso" }) }))),
    });
    const data = await res.json();
    if (!res.ok) throw new Error("O serviço Expo recusou o envio.");
    for (const [index, ticket] of (Array.isArray(data.data) ? data.data : [data.data]).filter(Boolean).entries()) {
      if (ticket.status === "ok") {
        sent++;
        if (lote[index]?.uid) usuariosNotificados.add(lote[index].uid);
      }
      else {
        const code = ticket.details?.error || "Erro sem código";
        failures[code] = (failures[code] || 0) + 1;
      }
    }
  }
  return { sent, total, failures, usuariosNotificados: [...usuariosNotificados] };
}

async function executarEnvio(db, schedule, date, time, statusDepois) {
  const runId = `${schedule.id}_${date}_${time.replace(":", "")}`;
  const runRef = db.collection("notificationRuns").doc(runId);
  const historyRef = db.collection("notificationHistory").doc(runId);
  const reservado = await db.runTransaction(async (tx) => {
    const snap = await tx.get(runRef);
    if (snap.exists) return false;
    tx.create(runRef, { scheduleId: schedule.id, status: "processando", createdAt: FieldValue.serverTimestamp() });
    tx.create(historyRef, {
      title: schedule.title, body: schedule.body, type: schedule.type,
      status: "processando", sent: 0, total: 0,
      sentAt: FieldValue.serverTimestamp(), scheduleId: schedule.id,
    });
    return true;
  });
  if (!reservado) {
    if (statusDepois) await db.collection("notificationSchedules").doc(schedule.id).update({ status: statusDepois, updatedAt: FieldValue.serverTimestamp() });
    return;
  }

  try {
    const resultado = await disparar(await tokensAtivos(db), schedule.title, schedule.body);
    const status = Object.keys(resultado.failures).length ? (resultado.sent ? "parcial" : "falha") : "aceita";
    const usuariosNotificados = resultado.usuariosNotificados;
    delete resultado.usuariosNotificados;
    await Promise.all(usuariosNotificados.map((uid) => db.collection("users").doc(uid).collection("notifications").add({
      title: schedule.title, body: schedule.body, lida: false, createdAt: FieldValue.serverTimestamp(),
    })));
    await Promise.all([
      historyRef.update({ ...resultado, failures: JSON.stringify(resultado.failures), status }),
      runRef.update({ status, finishedAt: FieldValue.serverTimestamp() }),
    ]);
  } catch (error) {
    await Promise.all([
      historyRef.update({ status: "falha", error: error.message || "Falha no envio." }),
      runRef.update({ status: "falha", finishedAt: FieldValue.serverTimestamp() }),
    ]);
  }
  if (statusDepois) await db.collection("notificationSchedules").doc(schedule.id).update({ status: statusDepois, updatedAt: FieldValue.serverTimestamp() });
}

async function main() {
  carregarEnvLocal();
  const db = firestore();
  const agora = dataHoraLocal();
  const snapshot = await db.collection("notificationSchedules").where("status", "in", ["ativa", "agendada"]).get();
  for (const doc of snapshot.docs) {
    const item = { id: doc.id, ...doc.data() };
    if (item.type === "agendada") {
      if (`${item.date} ${item.time}` <= `${agora.date} ${agora.time}`) await executarEnvio(db, item, item.date, item.time, "concluida");
      continue;
    }
    if (item.type !== "recorrente") continue;
    if (item.endDate && agora.date > item.endDate) {
      await doc.ref.update({ status: "concluida", updatedAt: FieldValue.serverTimestamp() });
      continue;
    }
    if (agora.date < item.date) continue;
    for (const time of item.times || [item.time]) {
      if (time <= agora.time) await executarEnvio(db, item, agora.date, time);
    }
  }
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("notificacoes.js")) {
  main().catch((error) => { console.error(error?.message || "Falha no job de notificações."); process.exitCode = 1; });
}
