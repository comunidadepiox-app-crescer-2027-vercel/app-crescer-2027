import { auth } from "@/lib/firebase/client";
import { resolveDiaRecorte } from "@/lib/event/edition";

const CAMPOS = ["time", "title", "guest", "location", "space", "order", "notes", "published", "date"];

function contaNoDia(item, recorte) {
  return Boolean(item && item.published && item.date === recorte);
}

export function mudouDiaPublicado(antes, depois) {
  const recorte = resolveDiaRecorte().date;
  const antesConta = contaNoDia(antes, recorte);
  const depoisConta = contaNoDia(depois, recorte);
  if (!antesConta && !depoisConta) return false;
  if (!antes) return depoisConta;
  return CAMPOS.some((campo) => String(antes[campo] ?? "") !== String(depois[campo] ?? ""));
}

export async function avisarMudancaPrograma() {
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch("/api/notify-programa", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date: resolveDiaRecorte().date }),
  });
  if (!res.ok) {
    const info = await res.json().catch(() => ({}));
    throw new Error(info.error || "Falha ao avisar.");
  }
}
