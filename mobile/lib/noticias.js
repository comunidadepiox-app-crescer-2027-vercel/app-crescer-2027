import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit as fbLimit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export async function listPublishedNews(max = 20) {
  const q = query(
    collection(db, "news"),
    where("published", "==", true),
    orderBy("publishedAt", "desc"),
    fbLimit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
