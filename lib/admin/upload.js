import { auth } from "@/lib/firebase/client";

// Envia a imagem ao Route Handler, que valida o admin e assina o upload no Cloudinary.
export async function uploadCover(file) {
  const idToken = await auth.currentUser.getIdToken();
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
    body,
  });
  if (!res.ok) {
    const info = await res.json().catch(() => ({}));
    throw new Error(info.error || "Falha no upload da imagem.");
  }
  return res.json(); // { url, publicId }
}
