import { deleteField, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const REF = () => doc(db, "siteContent", "doacao");

export function percentValido(valor) {
  if (typeof valor !== "number" || !Number.isFinite(valor) || !Number.isInteger(valor)) {
    return null;
  }
  if (valor < 0 || valor > 100) return null;
  return valor;
}

export async function getDoacao() {
  const snap = await getDoc(REF());
  if (!snap.exists()) return { percent: null };
  return { percent: percentValido(snap.data().percent) };
}

export async function salvarPercentualDoacao({ percent, uid }) {
  const valido = percentValido(percent);
  await setDoc(
    REF(),
    {
      percent: valido === null ? deleteField() : valido,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    },
    { merge: true }
  );
}
