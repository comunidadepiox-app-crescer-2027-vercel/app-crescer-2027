import { resolveDiaRecorte } from "@/lib/event/edition";
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
    if (!res.ok) throw new Error("Não foi possível ler os aparelhos.");
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
  if (!uid) {
    return Response.json({ error: "Acesso restrito à equipe." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  if (body.date !== resolveDiaRecorte().date) {
    return Response.json({ error: "Fora do dia do recorte." }, { status: 400 });
  }

  let tokens = [];
  try {
    tokens = await listarTokens(idToken);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 502 });
  }

  const usuariosNotificados = new Set();
  const mensagens = tokens.map(({ token, silenciado }) => ({
    to: token,
    title: "Crescer",
    body: "A programação de hoje mudou. Abra a Agenda para ver os horários.",
    ...(silenciado ? { channelId: "aviso-silencioso" } : { sound: "default", channelId: "programa" }),
  }));

  for (let i = 0; i < mensagens.length; i += 100) {
    const lote = mensagens.slice(i, i + 100);
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lote),
    });
    if (!res.ok) {
      return Response.json({ error: "O serviço de notificação recusou o envio." }, { status: 502 });
    }
    const data = await res.json();
    const tickets = Array.isArray(data.data) ? data.data : data.data ? [data.data] : [];
    for (let j = 0; j < tickets.length; j++) {
      if (tickets[j]?.status === "ok" && tokens[i + j]?.uid) usuariosNotificados.add(tokens[i + j].uid);
    }
  }

  const caixas = await Promise.allSettled([...usuariosNotificados].map((userId) => criarDocumento(`users/${userId}/notifications`, {
    title: "Crescer", body: "A programação de hoje mudou. Abra a Agenda para ver os horários.", lida: false,
  }, ["createdAt"], { idToken } )));

  return Response.json({
    sent: tokens.length,
    aviso: caixas.some((item) => item.status === "rejected")
      ? "O push saiu, mas parte da caixa de notificações não foi gravada. Confira se as regras do Firestore estão publicadas."
      : undefined,
  });
}
