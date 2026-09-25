import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signInAnonymously, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  error: null,
  retry: async () => {},
});

export async function ensureUserDoc(user) {
  if (!db) throw new Error("Firebase Firestore não configurado");

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const data = {
      displayName: user.displayName || "",
      role: "fiel",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
      ...(user.email ? { email: user.email } : {}),
    };
    await setDoc(ref, data);
    return data;
  }
  return snap.data();
}

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });
  const iniciando = useRef(false);

  const iniciarAnonimo = useCallback(async () => {
    if (!auth || iniciando.current) return;
    iniciando.current = true;
    setState((atual) => ({ ...atual, loading: true, error: null }));
    try {
      const resultado = await signInAnonymously(auth);
      const profile = await ensureUserDoc(resultado.user);
      setState({ user: resultado.user, profile, loading: false, error: null });
    } catch (error) {
      setState({
        user: null,
        profile: null,
        loading: false,
        error: error?.message || "Não foi possível iniciar a sessão anônima.",
      });
    } finally {
      iniciando.current = false;
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      setState({
        user: null,
        profile: null,
        loading: false,
        error: "O Firebase ainda não foi configurado neste ambiente.",
      });
      return undefined;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await iniciarAnonimo();
        return;
      }
      if (!user.isAnonymous) {
        try {
          await signOut(auth);
        } finally {
          await iniciarAnonimo();
        }
        return;
      }
      try {
        const profile = await ensureUserDoc(user);
        setState({ user, profile, loading: false, error: null });
      } catch (error) {
        setState({
          user,
          profile: null,
          loading: false,
          error: error?.message || "Não foi possível carregar o perfil anônimo.",
        });
      }
    });

    return unsub;
  }, [iniciarAnonimo]);

  return <AuthContext.Provider value={{ ...state, retry: iniciarAnonimo }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
