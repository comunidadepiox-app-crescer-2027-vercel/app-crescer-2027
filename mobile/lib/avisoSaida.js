import { useEffect, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { ativarNotificacao } from "./notificacoes";

const CHAVE = "crescer.origem.explicado";
const CHAVE_BUILD = "crescer.aviso.build";
const CHAVE_PUSH = "crescer.aviso.push";

function explicar() {
  return new Promise((resolve) => {
    Alert.alert(
      "Hora de sair",
      "Se você permitir a localização, o Crescer calcula a hora de chamar o carro até o Centro de Convenções e avisa mesmo com o app fechado. A coordenada fica só para esse aviso e você pode apagá-la em Conta.",
      [
        { text: "Agora não", style: "cancel", onPress: () => resolve(false) },
        { text: "Continuar", onPress: () => resolve(true) },
      ]
    );
  });
}

export function observarQueroIr(uid, onData, onError) {
  if (!db || !uid) {
    onData(new Set());
    return () => {};
  }
  return onSnapshot(
    collection(db, "users", uid, "queroIr"),
    (snap) => onData(new Set(snap.docs.map((d) => d.id))),
    (err) => onError?.(err)
  );
}

async function gravarOrigem(uid, coords) {
  await updateDoc(doc(db, "users", uid), {
    origem: {
      lat: coords.latitude,
      lng: coords.longitude,
      updatedAt: serverTimestamp(),
    },
  });
}

export async function atualizarOrigemSePermitida(uid) {
  if (!db || !uid) return { ok: false };
  const atual = await Location.getForegroundPermissionsAsync();
  if (atual.status !== "granted") return { ok: false, motivo: "negado" };
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  await gravarOrigem(uid, pos.coords);
  return { ok: true };
}

export async function apagarOrigem(uid) {
  await updateDoc(doc(db, "users", uid), { origem: deleteField() });
}

async function marcar(uid, itemId) {
  await setDoc(doc(db, "users", uid, "queroIr", itemId), {
    itemId,
    createdAt: serverTimestamp(),
  });
}

export async function desmarcarQueroIr(uid, itemId) {
  if (!db) return;
  await deleteDoc(doc(db, "users", uid, "queroIr", itemId));
}

export async function marcarQueroIr(uid, itemId) {
  if (!db) return { ok: false };

  const visto = await AsyncStorage.getItem(CHAVE);
  if (!visto) {
    const seguiu = await explicar();
    if (!seguiu) return { ok: false };
    await AsyncStorage.setItem(CHAVE, "visto");
  }

  const aviso = await ativarNotificacao(uid);
  if (aviso.motivo === "build" && !(await AsyncStorage.getItem(CHAVE_BUILD))) {
    await AsyncStorage.setItem(CHAVE_BUILD, "visto");
    Alert.alert(
      "Aviso no aplicativo instalado",
      "O Expo Go não recebe este push. O item fica marcado e o aviso chega no aplicativo instalado."
    );
  }
  if (aviso.motivo === "negado" && !(await AsyncStorage.getItem(CHAVE_PUSH))) {
    await AsyncStorage.setItem(CHAVE_PUSH, "visto");
    Alert.alert(
      "Sem notificação",
      "O item ficou marcado. Sem a permissão de aviso, o celular não recebe a hora de sair."
    );
  }

  const pedido = await Location.requestForegroundPermissionsAsync();
  if (pedido.status === "granted") {
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    await gravarOrigem(uid, pos.coords);
  } else {
    Alert.alert(
      "Sem localização",
      "O item ficou marcado. Sem a localização, o Crescer não calcula a hora de sair."
    );
  }

  await marcar(uid, itemId);
  return { ok: true };
}

export function useQueroIr(uid) {
  const [ids, setIds] = useState(() => new Set());
  const [ocupado, setOcupado] = useState(null);

  useEffect(() => observarQueroIr(uid, setIds), [uid]);

  async function alternar(item) {
    if (!uid || ocupado) return;
    setOcupado(item.id);
    try {
      if (ids.has(item.id)) await desmarcarQueroIr(uid, item.id);
      else await marcarQueroIr(uid, item.id);
    } catch {
      Alert.alert("Não foi possível salvar", "Tente de novo em instantes.");
    } finally {
      setOcupado(null);
    }
  }

  return { ids, ocupado, alternar };
}
