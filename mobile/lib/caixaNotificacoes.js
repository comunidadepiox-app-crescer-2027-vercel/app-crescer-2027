import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export function observarNotificacoes(uid, receber, falhar) {
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, "users", uid, "notifications"), orderBy("createdAt", "desc")),
    (snapshot) => receber(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    (erro) => {
      if (__DEV__) console.warn("Crescer: falha ao carregar notificações.", erro?.code || erro?.message || erro);
      falhar(erro);
    }
  );
}

export async function lerSilencio(uid) {
  const aparelhos = await getDocs(query(collection(db, "deviceTokens"), where("uid", "==", uid)));
  return aparelhos.docs.some((aparelho) => aparelho.data().silenciado === true);
}

export function marcarNotificacaoLida(uid, id) {
  return updateDoc(doc(db, "users", uid, "notifications", id), { lida: true, lidaAt: serverTimestamp() });
}

export async function silenciarAvisos(uid, silenciado) {
  const aparelhos = await getDocs(query(collection(db, "deviceTokens"), where("uid", "==", uid)));
  await Promise.all(aparelhos.docs.map((aparelho) => updateDoc(aparelho.ref, { silenciado })));
}
