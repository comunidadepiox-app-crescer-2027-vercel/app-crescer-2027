"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  IconeCasa,
  IconeJornal,
  IconeCalendario,
  IconeCoracaoChama,
  IconePessoa,
} from "@/components/nav/icones";

const LINKS_DESKTOP = [
  { href: "/home", label: "Home" },
  { href: "/noticias", label: "Notícias" },
  { href: "/cronograma", label: "Cronograma" },
  { href: "/galeria", label: "Galeria" },
  { href: "/sobre", label: "Sobre" },
  { href: "/configuracao", label: "Conta" },
];

const LINKS_MOBILE = [
  { href: "/home", label: "Home", Icone: IconeCasa },
  { href: "/noticias", label: "Notícias", Icone: IconeJornal },
  { href: "/cronograma", label: "Agenda", Icone: IconeCalendario },
  { href: "/benfeitor", label: "Benfeitor", Icone: IconeCoracaoChama },
  { href: "/configuracao", label: "Conta", Icone: IconePessoa },
];

function ativo(pathname, href) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function HeaderNav() {
  const pathname = usePathname();
  return (
    <header className="bg-laranja">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/home" className="shrink-0">
          <Image
            src="/brand/logo-crescer-branca.png"
            alt="Crescer, o Encontro da Família Católica"
            width={190}
            height={40}
            priority
            className="h-9 w-auto md:h-10"
          />
        </Link>
        <nav className="flex items-center gap-5">
          <div className="hidden items-center gap-5 md:flex">
            {LINKS_DESKTOP.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-titulo text-base font-bold uppercase ${
                  ativo(pathname, item.href)
                    ? "border-b-2 border-amarelo text-white"
                    : "text-white/85 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/benfeitor"
            className="rounded-[10px] bg-roxo-botao px-4 py-2 font-titulo text-sm font-bold uppercase text-white"
          >
            <span className="hidden sm:inline">INSCREVA-SE</span>
            <span className="sm:hidden">INSCREVA-SE</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 bg-roxo-botao md:hidden">
      <div className="mx-auto flex max-w-5xl">
        {LINKS_MOBILE.map(({ href, label, Icone }) => {
          const atual = ativo(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 pb-2.5 pt-2 text-[11px] font-semibold uppercase ${
                atual ? "text-dourado" : "text-white/75"
              }`}
            >
              <Icone className={`h-6 w-6 ${atual ? "text-dourado" : "text-white/85"}`} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppFooter() {
  return (
    <footer className="fundo-roxo-poligonal mt-12 pb-24 pt-10 text-center md:pb-10">
      <Image
        src="/brand/simbolo-crescer.png"
        alt=""
        width={56}
        height={56}
        className="mx-auto h-14 w-14"
      />
      <p className="mt-4 font-titulo text-lg font-bold uppercase text-white">
        Centro de Convenções de Campina Grande
      </p>
      <p className="mt-1 text-sm text-white/80">
        Alça Leste – Nova Brasília / Mirante, Campina Grande - PB.
      </p>
    </footer>
  );
}
