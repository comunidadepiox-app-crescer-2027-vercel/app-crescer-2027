import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function listProgramItemsByDate(date) {
  const q = query(
    collection(db, "programItems"),
    where("published", "==", true),
    where("date", "==", date),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function agrupaPorEspaco(itens) {
  const grupos = new Map();
  for (const item of itens) {
    if (!grupos.has(item.space)) grupos.set(item.space, []);
    grupos.get(item.space).push(item);
  }
  return grupos;
}
