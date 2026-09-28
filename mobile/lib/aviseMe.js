// Avise-me: o fiel marca um item da programação e recebe push 30, 15, 10, 5 e
// 1 minuto antes do horário. Não existe localização, nem rota, nem hora de
// sair: o que o app precisa é do token de notificação e de um documento na
// subcoleção `lembretes` do próprio uid.
//
// O job que envia os avisos é `jobs/aviso-saida`, com o Admin SDK.

import { useEffect, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { AVISO_PUSH, MOTIVO, MOTIVO_SEM_RECURSO, ativarNotificacao } from "./notificacoes";

const CHAVE = "crescer.aviso.avisoMostrado";

export function observarLembretes(uid, onData, onError) {
  if (!db || !uid) {
    onData(new Set());
    return () => {};
  }
  return onSnapshot(
    collection(db, "users", uid, "lembretes"),
    (snap) => onData(new Set(snap.docs.map((d) => d.id))),
    (err) => onError?.(err)
  );
}

export async function desmarcarLembrete(uid, itemId) {
  if (!db) return;
  await deleteDoc(doc(db, "users", uid, "lembretes", itemId));
}

// O lembrete é gravado mesmo sem token, porque a pessoa pode ativar o aviso
// depois e a marcação continua valendo. O que muda é a honestidade do app: sem
// token, o retorno diz que o push não ficou pronto, e o app não pode deixar
// ninguém achando que o aviso vai chegar.
export async function marcarLembrete(uid, itemId) {
  if (!db) return { ok: false, motivo: MOTIVO.ERRO };

  const aviso = await ativarNotificacao(uid);

  if (!aviso.ok) {
    const jaMostrou = await AsyncStorage.getItem(CHAVE);
    if (!jaMostrou) {
      await AsyncStorage.setItem(CHAVE, "visto");
      Alert.alert(
        aviso.motivo === MOTIVO_SEM_RECURSO ? "Aviso indisponível aqui" : "Sem aviso no celular",
        `${AVISO_PUSH[aviso.motivo] || AVISO_PUSH[MOTIVO.ERRO]} O item ficou marcado.`
      );
    }
  }

  await setDoc(doc(db, "users", uid, "lembretes", itemId), {
    itemId,
    createdAt: serverTimestamp(),
  });
  return { ok: true, push: aviso.ok, motivo: aviso.motivo };
}

export function useAviseMe(uid) {
  const [ids, setIds] = useState(() => new Set());
  const [ocupado, setOcupado] = useState(null);

  useEffect(() => {
    if (!uid) {
      setIds(new Set());
      return undefined;
    }
    return observarLembretes(uid, setIds);
  }, [uid]);

  async function alternar(item) {
    if (!uid || ocupado) return;
    setOcupado(item.id);
    try {
      if (ids.has(item.id)) await desmarcarLembrete(uid, item.id);
      else await marcarLembrete(uid, item.id);
    } catch {
      Alert.alert("Não foi possível salvar", "Tente de novo em instantes.");
    } finally {
      setOcupado(null);
    }
  }

  return { ids, ocupado, alternar };
}
