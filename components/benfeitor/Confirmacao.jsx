"use client";

import Image from "next/image";
import Link from "next/link";
import { IconeCoracaoChama } from "@/components/nav/icones";
import { hrefWhatsappCadastro, WHATSAPP_ROTULO } from "@/lib/benfeitor/submit";

const PASSOS = [
  "A equipe da Comunidade de São Pio X entra em contato no WhatsApp que você informou.",
  "Vocês combinam a contribuição mensal. O pagamento é por boleto ou Pix, fora deste aplicativo.",
  "Nada foi cobrado agora. Este foi só o cadastro de interesse.",
];

export function ConfirmacaoBenfeitor() {
  return (
    <div>
      <section className="fundo-roxo-poligonal grid overflow-hidden rounded-[14px] md:grid-cols-2">
        <div className="flex flex-col justify-center p-6 md:p-8">
          <IconeCoracaoChama className="h-12 w-12 text-dourado" />
          <p className="mt-4 font-titulo text-lg font-bold uppercase text-amarelo">
            Benfeitor da Fé
          </p>
          <h1 className="mt-2 font-titulo text-3xl font-bold uppercase leading-tight text-white md:text-4xl">
            Cadastro recebido
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 md:text-base">
            Obrigado por querer sustentar esta missão. A Comunidade de São Pio X
            recebeu seus dados e vai falar com você para concluir o cadastro.
          </p>
          <a
            href={hrefWhatsappCadastro()}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block self-start rounded-[10px] bg-destaque px-5 py-2.5 font-titulo text-base font-bold uppercase text-white"
          >
            Falar no WhatsApp
          </a>
          <Link
            href="/home"
            className="mt-4 self-start text-sm font-semibold text-amarelo underline"
          >
            Voltar à Home
          </Link>
        </div>
        <div className="relative min-h-52 md:min-h-full">
          <Image
            src="/brand/foto-evento.webp"
            alt="Fiéis com velas acesas durante o Crescer"
            fill
            sizes="(min-width: 768px) 32rem, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <div className="mt-8 max-w-prose">
        <h2 className="text-2xl font-bold uppercase">O que acontece agora</h2>
        <ol className="mt-5 flex flex-col gap-4">
          {PASSOS.map((texto, i) => (
            <li key={texto} className="flex gap-4">
              <span className="w-8 shrink-0 font-titulo text-xl font-bold text-destaque">
                {i + 1}
              </span>
              <p className="pt-0.5 leading-relaxed text-texto/85">{texto}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 border-t border-linha pt-4 text-sm text-texto/70">
          Canal oficial da comunidade: {WHATSAPP_ROTULO}. Este aplicativo não
          processa pagamentos.
        </p>
      </div>
    </div>
  );
}
