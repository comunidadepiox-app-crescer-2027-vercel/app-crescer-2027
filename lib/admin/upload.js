import { auth } from "@/lib/firebase/client";

// Envia o arquivo ao Route Handler, que valida o admin e assina o upload no Cloudinary.
export async function uploadMedia(file, { folder = "news", resource = "image" } = {}) {
  const idToken = await auth.currentUser.getIdToken();
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);
  body.append("resource", resource);
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
    body,
  });
  if (!res.ok) {
    const info = await res.json().catch(() => ({}));
    throw new Error(info.error || "Falha no upload.");
  }
  return res.json();
}

export function uploadCover(file) {
  return uploadMedia(file, { folder: "news", resource: "image" });
}
