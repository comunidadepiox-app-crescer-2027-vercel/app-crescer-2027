import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function listAnnouncements() {
  const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createAnnouncement(dados) {
  return addDoc(collection(db, "announcements"), {
    ...dados,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateAnnouncement(id, dados) {
  return updateDoc(doc(db, "announcements", id), {
    ...dados,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAnnouncement(id) {
  return deleteDoc(doc(db, "announcements", id));
}
