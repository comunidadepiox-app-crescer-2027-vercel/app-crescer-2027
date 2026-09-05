"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";

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

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/");
    else if (!isAdmin) router.replace("/home");
  }, [loading, user, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-texto/60">
          {loading ? "Carregando..." : "Esta área é restrita à equipe de comunicação."}
        </p>
      </div>
    );
  }

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
          <Link href="/home" className="ml-auto text-sm font-medium text-texto/60 underline">
            Voltar ao app
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
