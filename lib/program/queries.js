import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { ordenaItensPrograma } from "@/lib/program/ordenar";

export function itensDoDia(itens, date) {
  return ordenaItensPrograma((itens || []).filter((item) => item.date === date));
}

export function observarProgramaPublicado(onData, onError) {
  if (!db) {
    onError?.(new Error("Firebase não configurado"));
    return () => {};
  }
  const q = query(collection(db, "programItems"), where("published", "==", true));
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => onError?.(err)
  );
}

export function agrupaPorEspaco(itens) {
  const grupos = new Map();
  for (const item of itens) {
    if (!grupos.has(item.space)) grupos.set(item.space, []);
    grupos.get(item.space).push(item);
  }
  return grupos;
}
