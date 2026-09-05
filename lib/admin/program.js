import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function listItemsByDateAdmin(date) {
  const q = query(
    collection(db, "programItems"),
    where("date", "==", date),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
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
