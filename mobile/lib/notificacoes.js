import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import Constants from "expo-constants";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const CHAVE = "crescer.notificacao.pedido";

// O import de expo-notifications quebra o Expo Go no Android (SDK 53+).
// Só carrega no build de desenvolvimento.
const expoGo =
  Constants.appOwnership === "expo" || Constants.executionEnvironment === "storeClient";

let modulo = null;

async function notificacoes() {
  if (expoGo) return null;
  if (modulo) return modulo;
  modulo = await import("expo-notifications");
  modulo.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  return modulo;
}

export async function lerPedido() {
  return AsyncStorage.getItem(CHAVE);
}

export async function adiarPedido() {
  await AsyncStorage.setItem(CHAVE, "depois");
}

async function gravarToken(uid, token) {
  if (!db) return;
  const q = query(collection(db, "deviceTokens"), where("uid", "==", uid));
  const snap = await getDocs(q);
  const existente = snap.docs.find((d) => d.data().token === token);
  const dados = {
    uid,
    token,
    platform: Platform.OS,
    updatedAt: serverTimestamp(),
  };
  if (existente) await updateDoc(existente.ref, dados);
  else await addDoc(collection(db, "deviceTokens"), dados);
}

export async function ativarNotificacao(uid) {
  const Notifications = await notificacoes();
  if (!Notifications) return { ok: false, motivo: "build" };

  const atual = await Notifications.getPermissionsAsync();
  let status = atual.status;
  if (status !== "granted") {
    const pedido = await Notifications.requestPermissionsAsync();
    status = pedido.status;
  }
  if (status !== "granted") return { ok: false, motivo: "negado" };

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("programa", {
      name: "Programação",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId || !Device.isDevice) {
    return { ok: false, motivo: "build" };
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  await gravarToken(uid, token.data);
  await AsyncStorage.setItem(CHAVE, "aceito");
  return { ok: true };
}
