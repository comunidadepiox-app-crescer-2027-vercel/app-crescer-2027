import crypto from "crypto";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { tokenDoHeader, verificaAdmin } from "@/lib/server/verificaAdmin";

const PASTAS = new Set(["news", "authors"]);
const LIMITE_IMAGEM = 8 * 1024 * 1024;
const LIMITE_VIDEO = 80 * 1024 * 1024;

export async function POST(request) {
  const env = process.env.NODE_ENV === "development"
    ? process.env
    : getCloudflareContext().env;
  const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const cloudinaryKey = env.CLOUDINARY_API_KEY;
  const cloudinarySecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !cloudinaryKey || !cloudinarySecret) {
    return Response.json(
      { error: "Cloudinary não configurado no servidor." },
      { status: 500 }
    );
  }

  const uid = await verificaAdmin(tokenDoHeader(request));
  if (!uid) {
    return Response.json({ error: "Acesso restrito à equipe." }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return Response.json({ error: "Arquivo ausente." }, { status: 400 });
  }

  const pasta = String(form.get("folder") || "news");
  const recurso = form.get("resource") === "video" ? "video" : "image";
  if (!PASTAS.has(pasta)) {
    return Response.json({ error: "Pasta de upload inválida." }, { status: 400 });
  }
  if (recurso === "video" && pasta !== "news") {
    return Response.json({ error: "Vídeo só entra no texto da notícia." }, { status: 400 });
  }
  const limite = recurso === "video" ? LIMITE_VIDEO : LIMITE_IMAGEM;
  if (file.size > limite) {
    return Response.json(
      { error: recurso === "video" ? "O vídeo passa de 80 MB." : "A imagem passa de 8 MB." },
      { status: 400 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `folder=${pasta}&timestamp=${timestamp}${cloudinarySecret}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  const upload = new FormData();
  upload.append("file", file);
  upload.append("api_key", cloudinaryKey);
  upload.append("timestamp", String(timestamp));
  upload.append("folder", pasta);
  upload.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${recurso}/upload`,
    { method: "POST", body: upload }
  );
  if (!res.ok) {
    return Response.json({ error: "O Cloudinary recusou o upload." }, { status: 502 });
  }
  const data = await res.json();
  return Response.json({ url: data.secure_url, publicId: data.public_id });
}
