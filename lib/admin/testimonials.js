import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

// Pastas da mesa. Aguardando é o que a equipe ainda precisa decidir, e é a
// fila de leitura no palco. Encerrados é o histórico, para conferir depois do
// encontro.
//
// Pasta é campo denormalizado, escrito pelo servidor no envio e reescrito a
// cada decisão. Existe para a consulta ser um where simples em orderBy: com
// where "in" o Firestore pediria um índice composto para cada status, e a mesa
// precisa funcionar no celular do evento com o 4G ruim.
export const PASTAS = ["aguardando", "encerrados"];

// Não há mais filtro automático. `novo` é o estado de entrada, e os dois
// estados que saem vêm de uma decisão humana na mesa.
export const ROTULO_STATUS = {
  novo: "Na fila",
  lido: "Lido",
  nao_aceito: "Não aceito",
};

function base(pasta) {
  if (!PASTAS.includes(pasta)) throw new Error("Pasta desconhecida.");
  return query(collection(db, "testimonials"), where("pasta", "==", pasta));
}

// Mais antigos primeiro, sempre: quem chegou antes entra na fila antes.
// Traz uma linha a mais para o chamador saber se existe página seguinte
// sem precisar contar o todo.
export async function listaTestemunhos({ pasta, tamanho = 5, cursor = null }) {
  const consulta = query(
    base(pasta),
    orderBy("createdAt", "asc"),
    ...(cursor ? [startAfter(cursor)] : []),
    limit(tamanho + 1)
  );
  const snap = await getDocs(consulta);
  const docs = snap.docs;
  const temProxima = docs.length > tamanho;
  const visiveis = temProxima ? docs.slice(0, tamanho) : docs;
  return {
    itens: visiveis.map((d) => ({ id: d.id, ...d.data() })),
    proximoCursor: temProxima ? visiveis[visiveis.length - 1] : null,
    temProxima,
  };
}

export async function contaTestemunhos(pasta) {
  const contagem = await getCountFromServer(base(pasta));
  return contagem.data().count;
}

async function decide(id, status, pasta, adminUid, campos) {
  await updateDoc(doc(db, "testimonials", id), {
    status,
    pasta,
    decididoAt: serverTimestamp(),
    decididoPor: adminUid,
    updatedAt: serverTimestamp(),
    ...campos,
  });
}

export function marcaLido(id, adminUid) {
  return decide(id, "lido", "encerrados", adminUid, { lidoAt: serverTimestamp() });
}

export function naoAceita(id, adminUid) {
  return decide(id, "nao_aceito", "encerrados", adminUid, { lidoAt: null });
}
