"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "@/lib/auth/AuthProvider";
import { auth } from "@/lib/firebase/client";
import { LoginAdmin, RecusaAdmin } from "@/components/admin/LoginAdmin";
import { IconeMesa } from "@/components/admin/iconesMesa";

const MENU = [
  { href: "/admin", label: "Início", icone: "inicio" },
  { href: "/admin/noticias", label: "Notícias", icone: "noticias" },
  { href: "/admin/cronograma", label: "Cronograma", icone: "cronograma" },
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
      <aside className="fundo-roxo-poligonal text-white md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-titulo text-xl font-bold uppercase leading-none">Crescer</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-dourado">Mesa</p>
          </div>
          <button
            type="button"
            onClick={sair}
            className="text-sm font-medium text-white/75 underline md:hidden"
          >
            Sair
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible md:px-3">
          {MENU.map((item) => {
            const on = ativo(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 font-titulo text-sm font-bold uppercase transition-colors duration-150 motion-reduce:transition-none md:gap-3 md:border-b-0 md:border-l-[3px] md:px-4 md:py-2.5 ${
                  on
                    ? "border-dourado text-dourado"
                    : "border-transparent text-white/75 hover:text-white"
                }`}
              >
                <IconeMesa nome={item.icone} className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-white/15 px-5 py-4 md:block">
          <p className="truncate text-sm text-white/70">{user.email}</p>
          <button
            type="button"
            onClick={sair}
            className="mt-3 text-sm font-medium text-white/80 underline"
          >
            Sair
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10">{children}</main>
    </div>
  );
}
