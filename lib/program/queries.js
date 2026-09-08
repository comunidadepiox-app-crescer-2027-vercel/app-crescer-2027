import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { ordenaItensPrograma } from "@/lib/program/ordenar";

export async function listProgramItemsByDate(date) {
  const q = query(collection(db, "programItems"), where("published", "==", true));
  const snap = await getDocs(q);
  const doDia = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((item) => item.date === date);
  return ordenaItensPrograma(doDia);
}

export function agrupaPorEspaco(itens) {
  const grupos = new Map();
  for (const item of itens) {
    if (!grupos.has(item.space)) grupos.set(item.space, []);
    grupos.get(item.space).push(item);
  }
  return grupos;
}
