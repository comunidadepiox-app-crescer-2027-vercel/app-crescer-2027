import { destinoBenfeitor } from "@/lib/server/emailBenfeitor";
import { salvarConfiguracaoBenfeitor } from "@/lib/server/firestoreRest";
import { tokenDoHeader, verificaAdmin } from "@/lib/server/verificaAdmin";

export async function GET(request) {
  const uid = await verificaAdmin(tokenDoHeader(request));
  if (!uid) return Response.json({ error: "Acesso restrito à equipe." }, { status: 403 });

  try {
    return Response.json({ email: await destinoBenfeitor() });
  } catch {
    return Response.json({ error: "Não foi possível ler o endereço." }, { status: 502 });
  }
}

export async function PUT(request) {
  const uid = await verificaAdmin(tokenDoHeader(request));
  if (!uid) return Response.json({ error: "Acesso restrito à equipe." }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Informe um endereço de e-mail válido." }, { status: 400 });
  }

  try {
    await salvarConfiguracaoBenfeitor(email, uid);
    return Response.json({ email });
  } catch {
    return Response.json({ error: "Não foi possível salvar o endereço." }, { status: 502 });
  }
}
