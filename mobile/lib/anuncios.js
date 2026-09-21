import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";

const CHAVE = "crescer.anuncios.vistoEm";

export function hojeFortaleza() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Fortaleza",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function observarAnunciosAtivos(onData, onError) {
  if (!db) {
    onError?.(new Error("Firebase não configurado"));
    return () => {};
  }
  const q = query(
    collection(db, "announcements"),
    where("active", "==", true),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => onError?.(err)
  );
}

export async function diaJaVisto() {
  const salvo = await AsyncStorage.getItem(CHAVE);
  return salvo === hojeFortaleza();
}

export async function marcarDiaVisto() {
  await AsyncStorage.setItem(CHAVE, hojeFortaleza());
}
