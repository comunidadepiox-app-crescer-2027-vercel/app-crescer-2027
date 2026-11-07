import { tokenDoHeader, verificaAdmin } from "@/lib/server/verificaAdmin";
import { criarDocumento } from "@/lib/server/firestoreRest";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

async function listarTokens(idToken) {
  const tokens = [];
  let pageToken = "";
  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/deviceTokens`
    );
    url.searchParams.set("pageSize", "300");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` } });
    if (res.status === 404) return tokens;
    if (!res.ok) throw new Error("N\u00e3o foi poss\u00edvel ler os aparelhos.");
    const data = await res.json();
    for (const documento of data.documents || []) {
      const token = documento.fields?.token?.stringValue;
      if (token) tokens.push({ token, uid: documento.fields?.uid?.stringValue, silenciado: documento.fields?.silenciado?.booleanValue === true });
    }
    pageToken = data.nextPageToken || "";
  } while (pageToken);
  return [...new Map(tokens.map((item) => [item.token, item])).values()];
}

export async function POST(request) {
  const idToken = tokenDoHeader(request);
  const uid = await verificaAdmin(idToken);
  if (!uid) return Response.json({ error: "Acesso restrito \u00e0 equipe." }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const message = typeof body.body === "string" ? body.body.trim() : "";
  if (!title || title.length > 50 || !message || message.length > 200) {
    return Response.json({ error: "Informe um t\u00edtulo (at\u00e9 50 caracteres) e uma mensagem (at\u00e9 200)." }, { status: 400 });
  }

  let sent = 0;
  let total = 0;
  const failures = {};
  const usuariosNotificados = new Set();
  let falha;
  try {
    const tokens = await listarTokens(idToken);
    total = tokens.length;
    for (let i = 0; i < tokens.length; i += 100) {
      const lote = tokens.slice(i, i + 100);
      const messages = lote.map(({ token, silenciado }) => ({ to: token, title, body: message, ...(silenciado ? { channelId: "aviso-silencioso" } : { sound: "default", channelId: "aviso" }) }));
      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(messages),
      });
      const data = await res.json();
      if (!res.ok) {
        const codes = [...new Set((data.errors || []).map((error) => error.code).filter(Boolean))];
        throw new Error(`O Expo recusou o envio${codes.length ? `: ${codes.join(", ")}` : "."}`);
      }
      const tickets = Array.isArray(data.data) ? data.data : data.data ? [data.data] : [];
      sent += tickets.filter((ticket) => ticket.status === "ok").length;
      for (const [index, ticket] of tickets.entries()) {
        if (ticket.status === "ok" && lote[index]?.uid) usuariosNotificados.add(lote[index].uid);
        if (ticket.status !== "error") continue;
        const code = ticket.details?.error || "Erro sem código";
        failures[code] = (failures[code] || 0) + 1;
      }
    }
  } catch (error) {
    falha = error.message || "O serviço de notificação falhou durante o envio.";
  }

  const status = falha
    ? (sent ? "parcial" : "falha")
    : Object.keys(failures).length ? (sent ? "parcial" : "falha") : "aceita";
  let aviso;
  try {
    await criarDocumento("notificationHistory", {
      title, body: message, type: "imediata", status,
      sent, total, failures: JSON.stringify(failures), createdBy: uid,
    }, ["sentAt"], { idToken });
  } catch {
    aviso = "O push saiu, mas o hist\u00f3rico n\u00e3o foi gravado. Confira se as regras do Firestore est\u00e3o publicadas.";
  }
  const caixas = await Promise.allSettled([...usuariosNotificados].map((userId) => criarDocumento(`users/${userId}/notifications`, {
    title, body: message, lida: false,
  }, ["createdAt"], { idToken })));
  if (caixas.some((item) => item.status === "rejected")) {
    aviso = "O push saiu, mas parte da caixa de notifica\u00e7\u00f5es n\u00e3o foi gravada. Confira se as regras do Firestore est\u00e3o publicadas.";
  }
  return falha
    ? Response.json({ error: falha, sent, total, failures, aviso }, { status: 502 })
    : Response.json({ sent, total, failures, aviso });
}
