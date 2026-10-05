import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./firebase";

function ordenaItensPrograma(itens) {
  return [...itens].sort((a, b) => {
    const ordem = (Number(a.order) || 0) - (Number(b.order) || 0);
    if (ordem !== 0) return ordem;
    return String(a.time || "").localeCompare(String(b.time || ""));
  });
}

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

// Espaços oficiais do encontro, conforme a página de programação do site.
export const ESPACOS = [
  { slug: "palco-principal", nome: "Palco Principal" },
  { slug: "palco-musical", nome: "Palco Musical e Cultural" },
  { slug: "autografos", nome: "Espaço para Autógrafos" },
  { slug: "palestras", nome: "Palestras Formativas" },
  { slug: "criancas", nome: "Espaço para Crianças" },
  { slug: "jovens", nome: "Espaço para Jovens" },
  { slug: "estandes", nome: "Estandes" },
  { slug: "auditorio-shaolin", nome: "CONAFAM - Audítório do Espaço Cultural Shaolin" },
];

export function nomeDoEspaco(slug) {
  return ESPACOS.find((e) => e.slug === slug)?.nome || slug;
}
