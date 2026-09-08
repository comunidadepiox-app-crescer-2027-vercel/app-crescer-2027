import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./firebase";

function millisPublished(item) {
  const t = item.publishedAt;
  if (!t) return 0;
  if (typeof t.toMillis === "function") return t.toMillis();
  if (typeof t.seconds === "number") return t.seconds * 1000;
  return 0;
}

export function ordenaNoticias(itens) {
  return [...itens].sort((a, b) => millisPublished(b) - millisPublished(a));
}

function daSnapshot(snap, max) {
  const lista = ordenaNoticias(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  return typeof max === "number" ? lista.slice(0, max) : lista;
}

export function observarNoticiasPublicadas(onData, onError, max) {
  if (!db) {
    onError?.(new Error("Firebase não configurado"));
    return () => {};
  }
  const q = query(collection(db, "news"), where("published", "==", true));
  return onSnapshot(
    q,
    (snap) => onData(daSnapshot(snap, max)),
    (err) => onError?.(err)
  );
}

export async function getPublishedNewsById(id) {
  const snap = await getDoc(doc(db, "news", id));
  if (!snap.exists() || snap.data().published !== true) return null;
  return { id: snap.id, ...snap.data() };
}

export function formataDataFirestore(timestamp) {
  if (!timestamp?.toDate) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Recife",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(timestamp.toDate());
}
