"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { HeaderNav, BottomNav, AppFooter } from "@/components/nav/AppNav";

export default function AppLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [loading, user, router]);

  // A splash de abertura cobre a tela enquanto a sessão carrega
  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-10 pt-6">
        {children}
      </main>
      <AppFooter />
      <BottomNav />
    </div>
  );
}
