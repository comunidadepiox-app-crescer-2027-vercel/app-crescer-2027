"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

const AuthContext = createContext({ user: null, profile: null, loading: true });

export async function ensureUserDoc(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: user.displayName || "",
      email: user.email,
      role: "fiel",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
    });
    return { role: "fiel", displayName: user.displayName || "", email: user.email };
  }
  return snap.data();
}

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, profile: null, loading: true });

  useEffect(() => {
    if (!auth) {
      setState({ user: null, profile: null, loading: false });
      return;
    }
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, profile: null, loading: false });
        return;
      }
      try {
        const profile = await ensureUserDoc(user);
        setState({ user, profile, loading: false });
      } catch {
        setState({ user, profile: null, loading: false });
      }
    });
    return unsub;
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
