import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function listAllNews() {
  const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getNewsById(id) {
  const snap = await getDoc(doc(db, "news", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createNews({ authorUid, ...dados }) {
  return addDoc(collection(db, "news"), {
    ...dados,
    authorUid,
    publishedAt: dados.published ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateNews(id, dados, jaTinhaPublishedAt) {
  const patch = { ...dados, updatedAt: serverTimestamp() };
  if (dados.published && !jaTinhaPublishedAt) {
    patch.publishedAt = serverTimestamp();
  }
  return updateDoc(doc(db, "news", id), patch);
}

export async function deleteNews(id) {
  return deleteDoc(doc(db, "news", id));
}
