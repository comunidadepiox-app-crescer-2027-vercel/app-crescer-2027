import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

// Push remoto não existe no Expo Go no Android desde o SDK 53. A referência do
// SDK 57 é explícita: notificação local continua funcionando, push remoto pede
// development build. E o import de expo-notifications estoura o app no Expo Go,
// então ele só acontece depois desta checagem.
const expoGo = Constants.appOwnership === "expo";

// Motivos da recusa, para a tela falar a verdade em vez de dizer "não deu".
export const MOTIVO = {
  EXPO_GO: "expo-go",
  NAVEGADOR: "navegador",
  NEGADO: "negado",
  SEM_TOKEN: "sem-token",
  ERRO: "erro",
};

// Uma frase por motivo, no idioma do fiel. Sem travessão e sem jargão.
export const AVISO_PUSH = {
  [MOTIVO.EXPO_GO]:
    "No Expo Go o aviso com o app fechado não é possível. Ele só funciona no aplicativo instalado, que precisa ser uma vez na mão do aparelho.",
  [MOTIVO.NAVEGADOR]:
    "O aviso com o app fechado só existe no aplicativo do celular, não no navegador.",
  [MOTIVO.NEGADO]:
    "Sem a permissão de aviso, o celular não recebe a contagem regressiva. Dá para liberar nas configurações do sistema.",
  [MOTIVO.SEM_TOKEN]:
    "O aparelho não devolveu um token de aviso. Tente de novo em instantes.",
  [MOTIVO.ERRO]:
    "Não foi possível falar com o serviço de aviso agora. Tente de novo em instantes.",
};

// Recusa que não adianta repetir. O Expo Go nunca vai ter push, então insistir
// no botão só frustra a pessoa.
export const MOTIVO_SEM_RECURSO = MOTIVO.EXPO_GO;

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

export async function garantirCanalAviso(Notifications) {
  const modulo = Notifications || (await notificacoes());
  if (!modulo || Platform.OS !== "android") return;
  await modulo.setNotificationChannelAsync("programa", {
    name: "Programação",
    importance: modulo.AndroidImportance.DEFAULT,
  });
  await modulo.setNotificationChannelAsync("aviso", {
    name: "Avise-me",
    importance: modulo.AndroidImportance.HIGH,
  });
}

function registraDetalhe(motivo, detalhe) {
  if (__DEV__ && detalhe) console.warn(`Crescer: push recusado (${motivo}). ${detalhe}`);
  return { ok: false, motivo, detalhe };
}

export async function ativarNotificacao(uid) {
  if (Platform.OS === "web") return { ok: false, motivo: MOTIVO.NAVEGADOR };

  const Notifications = await notificacoes();
  if (!Notifications) return { ok: false, motivo: MOTIVO.EXPO_GO };

  // No Android 13 o sistema só mostra o pedido de permissão depois que existe um
  // canal de notificação. A ordem importa: pedir permissão antes do canal
  // devolve a permissão sem granted e o aviso nunca chega. Esta é a ordem da
  // referência do SDK 57.
  await garantirCanalAviso(Notifications);

  const atual = await Notifications.getPermissionsAsync();
  let status = atual.status;
  if (status !== "granted") {
    const pedido = await Notifications.requestPermissionsAsync();
    status = pedido.status;
  }
  if (status !== "granted") return { ok: false, motivo: MOTIVO.NEGADO };

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return { ok: false, motivo: MOTIVO.SEM_TOKEN };

  // O token é pedido ao serviço do Expo, e essa chamada falha por rede ou por
  // credencial do projeto. Sem o try, a tela só conseguia dizer "não deu" e o
  // motivo real se perdia.
  let token;
  try {
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } catch (erro) {
    return registraDetalhe(MOTIVO.ERRO, erro?.message || String(erro));
  }
  if (!token) return { ok: false, motivo: MOTIVO.SEM_TOKEN };

  await gravarToken(uid, token);
  await AsyncStorage.setItem(CHAVE, "aceito");
  return { ok: true };
}
