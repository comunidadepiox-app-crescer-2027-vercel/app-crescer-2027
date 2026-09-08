import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigurado = Boolean(firebaseConfig.apiKey);

if (!firebaseConfigurado) {
  console.warn(
    "Firebase não configurado. Copie mobile/.env.example para mobile/.env e preencha as chaves."
  );
}

const app = firebaseConfigurado
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

function authDoApp(instancia) {
  try {
    return initializeAuth(instancia, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Hot reload: o Auth já foi inicializado nesta sessão.
    return getAuth(instancia);
  }
}

export const auth = app ? authDoApp(app) : null;
export const db = app ? getFirestore(app) : null;
export { GoogleAuthProvider };
