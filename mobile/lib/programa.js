import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

function ordenaItensPrograma(itens) {
  return [...itens].sort((a, b) => {
    const ordem = (Number(a.order) || 0) - (Number(b.order) || 0);
    if (ordem !== 0) return ordem;
    return String(a.time || "").localeCompare(String(b.time || ""));
  });
}

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

// Espaços oficiais do encontro, conforme a página de programação do site.
export const ESPACOS = [
  { slug: "palco-principal", nome: "Palco Principal" },
  { slug: "palco-musical", nome: "Palco Musical e Cultural" },
  { slug: "autografos", nome: "Espaço para Autógrafos" },
  { slug: "palestras", nome: "Palestras Formativas" },
  { slug: "criancas", nome: "Espaço para Crianças" },
  { slug: "jovens", nome: "Espaço para Jovens" },
];

export function nomeDoEspaco(slug) {
  return ESPACOS.find((e) => e.slug === slug)?.nome || slug;
}
