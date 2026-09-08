"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { observarNoticiasPublicadas } from "@/lib/news/queries";
import { observarProgramaPublicado, itensDoDia, agrupaPorEspaco } from "@/lib/program/queries";
import { nomeDoEspaco } from "@/lib/program/spaces";
import { EDICAO, resolveDiaRecorte, formataDataCurta } from "@/lib/event/edition";
import { NewsListItem } from "@/components/news/NewsList";

export default function HomePage() {
  const [noticias, setNoticias] = useState(null);
  const [programa, setPrograma] = useState(null);
  const [erroNoticias, setErroNoticias] = useState(false);
  const [erroPrograma, setErroPrograma] = useState(false);
  const recorte = resolveDiaRecorte();

  useEffect(() => {
    const pararNoticias = observarNoticiasPublicadas(
      (lista) => {
        setErroNoticias(false);
        setNoticias(lista);
      },
      (err) => {
        console.error("Erro ao carregar notícias:", err);
        setErroNoticias(true);
        setNoticias([]);
      },
      4
    );
    const pararPrograma = observarProgramaPublicado(
      (todos) => {
        setErroPrograma(false);
        setPrograma(itensDoDia(todos, recorte.date));
      },
      (err) => {
        console.error("Erro ao carregar programação:", err);
        setErroPrograma(true);
        setPrograma([]);
      }
    );
    return () => {
      pararNoticias();
      pararPrograma();
    };
  }, [recorte.date]);

  const grupos = programa ? agrupaPorEspaco(programa) : null;

  return (
    <div className="flex flex-col gap-12">
      <section className="fundo-roxo-poligonal grid overflow-hidden rounded-[14px] md:grid-cols-2">
        <div className="flex flex-col justify-center p-6 md:p-8">
          <p className="font-titulo text-lg font-bold uppercase text-amarelo">
            {EDICAO.nome}
          </p>
          <h1 className="mt-2 font-titulo text-3xl font-bold uppercase leading-tight text-[#fff] md:text-4xl">
            Volte pra casa, ame sua família, encontre a paz.
          </h1>
          <p className="mt-3 text-sm text-white/85">
            De {formataDataCurta(EDICAO.inicio)} a {formataDataCurta(EDICAO.fim)},{" "}
            {EDICAO.local}.
          </p>
          <Link
            href="/cronograma"
            className="mt-5 inline-block self-start rounded-[10px] bg-destaque px-5 py-2.5 font-titulo text-base font-bold uppercase text-white"
          >
            Ver a programação
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

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold uppercase">Notícias</h2>
          <Link href="/noticias" className="text-sm font-semibold text-destaque underline">
            Ver todas
          </Link>
        </div>
        {noticias === null ? (
          <p className="mt-4 text-sm text-texto/60">Carregando notícias...</p>
        ) : erroNoticias ? (
          <p className="mt-4 text-sm font-medium text-vermelho">
            Não foi possível carregar as notícias agora. Tente de novo em instantes.
          </p>
        ) : noticias.length === 0 ? (
          <p className="mt-4 text-sm text-texto/70">
            Ainda não há notícias publicadas. Volte em breve.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {noticias.map((n) => (
              <NewsListItem key={n.id} noticia={n} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold uppercase">
            {recorte.posicao === "durante" ? "Hoje no evento" : "Programação"}
          </h2>
          <Link href="/cronograma" className="text-sm font-semibold text-destaque underline">
            Cronograma completo
          </Link>
        </div>
        <p className="mt-1 text-sm text-texto/70">
          Programação de {formataDataCurta(recorte.date)}.
        </p>

        {recorte.posicao === "antes" && (
          <p className="mt-2 text-sm text-texto/70">
            O {EDICAO.nome} começa em {formataDataCurta(EDICAO.inicio)}. Até lá a Home
            mostra o primeiro dia, {formataDataCurta(EDICAO.inicio)}.
          </p>
        )}
        {recorte.posicao === "depois" && (
          <p className="mt-2 text-sm text-texto/70">
            O {EDICAO.nome} já aconteceu. Esta é a programação da última jornada,
            de {formataDataCurta(EDICAO.fim)}.
          </p>
        )}

        {programa === null ? (
          <p className="mt-4 text-sm text-texto/60">Carregando programação...</p>
        ) : erroPrograma ? (
          <p className="mt-4 text-sm font-medium text-vermelho">
            Não foi possível carregar a programação agora. Tente de novo em instantes.
          </p>
        ) : programa.length === 0 ? (
          <p className="mt-4 text-sm text-texto/70">
            A programação de {formataDataCurta(recorte.date)} ainda não foi publicada.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-6">
            {[...grupos.entries()].map(([espaco, itens]) => (
              <div key={espaco} className="overflow-hidden rounded-[14px] border border-linha bg-superficie">
                <h3 className="bg-roxo-botao px-4 py-2.5 font-titulo text-lg font-bold uppercase text-white">
                  {nomeDoEspaco(espaco)}
                </h3>
                <ul className="divide-y divide-linha px-4">
                  {itens.map((item) => (
                    <li key={item.id} className="flex gap-4 py-3">
                      <span className="w-14 shrink-0 font-semibold text-destaque">
                        {item.time}
                      </span>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        {item.guest && (
                          <p className="text-sm text-texto/70">{item.guest}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="fundo-laranja-poligonal rounded-[14px] p-6 md:p-8">
        <h2 className="font-titulo text-2xl font-bold uppercase text-white md:text-3xl">
          Seja um Benfeitor da Fé
        </h2>
        <p className="mt-2 max-w-prose text-sm text-white/90">
          Realizar um evento como o Crescer é um grande desafio. Contribua com a
          Comunidade de São Pio X e ajude a levar o encontro a milhares de famílias.
        </p>
        <Link
          href="/benfeitor"
          className="mt-5 inline-block rounded-[10px] bg-roxo-botao px-5 py-2.5 font-titulo text-base font-bold uppercase text-white"
        >
          Quero ser Benfeitor da Fé
        </Link>
      </section>
    </div>
  );
}
