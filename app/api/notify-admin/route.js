import { tokenDoHeader, verificaAdmin } from "@/lib/server/verificaAdmin";

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
      if (token) tokens.push(token);
    }
    pageToken = data.nextPageToken || "";
  } while (pageToken);
  return [...new Set(tokens)];
}

export async function POST(request) {
  const uid = await verificaAdmin(tokenDoHeader(request));
  if (!uid) return Response.json({ error: "Acesso restrito \u00e0 equipe." }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const message = typeof body.body === "string" ? body.body.trim() : "";
  if (!title || title.length > 50 || !message || message.length > 200) {
    return Response.json({ error: "Informe um t\u00edtulo (at\u00e9 50 caracteres) e uma mensagem (at\u00e9 200)." }, { status: 400 });
  }

  let tokens;
  try {
    tokens = await listarTokens(tokenDoHeader(request));
  } catch (error) {
    return Response.json({ error: error.message }, { status: 502 });
  }
  if (!tokens.length) return Response.json({ sent: 0 });

  let sent = 0;
  for (let i = 0; i < tokens.length; i += 100) {
    const messages = tokens.slice(i, i + 100).map((to) => ({
      to,
      title,
      body: message,
      sound: "default",
      channelId: "aviso",
    }));
    try {
      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(messages),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      sent += (data.data || []).filter((ticket) => ticket.status === "ok").length;
    } catch {
      return Response.json({ error: "O servi\u00e7o de notifica\u00e7\u00e3o falhou durante o envio.", sent }, { status: 502 });
    }
  }

  return Response.json({ sent, total: tokens.length });
}
