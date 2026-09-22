import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";

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
