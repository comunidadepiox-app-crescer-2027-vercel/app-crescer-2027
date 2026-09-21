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
  { href: "/admin/anuncios", label: "Anúncios" },
];

function ativo(pathname, href) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-linha bg-superficie md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-4 px-5 py-4 md:block">
          <div>
            <p className="font-titulo text-lg font-bold uppercase text-titulo">Crescer</p>
            <p className="text-xs font-semibold uppercase text-texto/50">Mesa</p>
          </div>
          <button
            type="button"
            onClick={sair}
            className="text-sm font-medium text-texto/60 underline md:hidden"
          >
            Sair
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
          {MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 px-3 py-2 text-sm font-semibold uppercase ${
                ativo(pathname, item.href) ? "bg-creme text-titulo" : "text-texto/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto hidden border-t border-linha px-5 py-4 md:block">
          <p className="truncate text-sm text-texto/60">{user.email}</p>
          <Link href="/home" className="mt-3 block text-sm font-medium text-texto/60 underline">
            Voltar ao app
          </Link>
          <button
            type="button"
            onClick={sair}
            className="mt-2 text-sm font-medium text-texto/60 underline"
          >
            Sair
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10">{children}</main>
    </div>
  );
}
