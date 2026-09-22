import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa apenas no browser e apenas com as chaves preenchidas, para o
// SSR não quebrar enquanto o .env.local não existe.
const isBrowser = typeof window !== "undefined";
export const firebaseConfigurado = Boolean(firebaseConfig.apiKey);

if (isBrowser && !firebaseConfigurado) {
  console.warn(
    "Firebase não configurado. Copie .env.example para .env.local e preencha as chaves do projeto."
  );
}

const app =
  isBrowser && firebaseConfigurado
    ? getApps().length
      ? getApps()[0]
      : initializeApp(firebaseConfig)
    : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
