"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/lib/auth/AuthProvider";
import { auth } from "@/lib/firebase/client";
import { LoginAdmin, RecusaAdmin } from "@/components/admin/LoginAdmin";

const MENU = [
  { href: "/admin", label: "Início" },
  { href: "/admin/noticias", label: "Notícias" },
  { href: "/admin/cronograma", label: "Cronograma" },
  { href: "/admin/destaques", label: "Destaques" },
  { href: "/admin/leads", label: "Benfeitores" },
];

export default function AdminLayout({ children }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = profile?.role === "admin";

  async function sair() {
    if (auth) await signOut(auth);
    router.replace("/admin");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-texto/60">Carregando...</p>
      </div>
    );
  }

  if (!user) return <LoginAdmin />;

  if (!isAdmin) return <RecusaAdmin onSair={sair} />;

  return (
    <div className="min-h-screen">
      <header className="border-b border-linha bg-superficie">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <span className="font-titulo text-lg font-bold uppercase text-titulo">
            Crescer Admin
          </span>
          <nav className="flex flex-wrap gap-4">
            {MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold uppercase ${
                  pathname === item.href
                    ? "text-destaque underline"
                    : "text-texto/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Link href="/home" className="text-sm font-medium text-texto/60 underline">
              Voltar ao app
            </Link>
            <button
              type="button"
              onClick={sair}
              className="text-sm font-medium text-texto/60 underline"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
