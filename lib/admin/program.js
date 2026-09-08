import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function listProgramItemsAdmin() {
  const snap = await getDocs(collection(db, "programItems"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createProgramItem(dados) {
  return addDoc(collection(db, "programItems"), dados);
}

export async function updateProgramItem(id, dados) {
  return updateDoc(doc(db, "programItems", id), dados);
}

export async function deleteProgramItem(id) {
  return deleteDoc(doc(db, "programItems", id));
}
