"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listAllNews } from "@/lib/admin/news";
import { listProgramItemsAdmin } from "@/lib/admin/program";
import { formataDataCurta, resolveDiaRecorte } from "@/lib/event/edition";
import { CabecalhoMesa } from "@/components/admin/CabecalhoMesa";

function linhaNoticias(lista) {
  const rascunho = lista.find((n) => !n.published);
  if (!rascunho) return "Nada por publicar.";
  return `Rascunho: ${rascunho.title || "Sem título"}`;
}

function linhaPrograma(lista) {
  const dia = resolveDiaRecorte().date;
  const tem = lista.some((item) => item.date === dia);
  const quando = formataDataCurta(dia);
  return tem ? `${quando}: há programação.` : `${quando}: ainda sem item.`;
}

function Faixa({ href, kicker, titulo, descricao, estado, larga = false }) {
  return (
    <Link
      href={href}
      className="relative flex overflow-hidden rounded-[14px] border border-linha bg-superficie transition-colors duration-150 hover:bg-creme motion-reduce:transition-none"
    >
      {larga ? <span className="absolute inset-y-0 left-0 w-1 bg-destaque" aria-hidden="true" /> : null}
      <span className={larga ? "block flex-1 py-6 pl-7 pr-6 md:py-8 md:pl-9 md:pr-8" : "block flex-1 p-6"}>
        <p className="font-titulo text-sm font-bold uppercase text-destaque">{kicker}</p>
        <h2 className="mt-2 font-titulo text-2xl font-bold uppercase text-titulo md:text-3xl">{titulo}</h2>
        <p className="mt-2 max-w-prose text-sm text-texto/80">{descricao}</p>
        {estado ? <p className="mt-4 text-sm font-medium text-titulo">{estado}</p> : null}
        <p className="mt-4 font-titulo text-sm font-bold uppercase text-titulo">Abrir</p>
      </span>
    </Link>
  );
}

export default function AdminIndexPage() {
  const [noticias, setNoticias] = useState(undefined);
  const [programa, setPrograma] = useState(undefined);

  useEffect(() => {
    listAllNews()
      .then(setNoticias)
      .catch(() => setNoticias(null));
    listProgramItemsAdmin()
      .then(setPrograma)
      .catch(() => setPrograma(null));
  }, []);

  return (
    <div className="max-w-5xl">
      <CabecalhoMesa
        titulo="Mesa de trabalho"
        frase="Área da equipe de comunicação da Comunidade de São Pio X."
      />

      <div className="mt-8">
        <Faixa
          href="/admin/noticias"
          kicker="Escrever"
          titulo="Notícias"
          descricao="Escrever, pré-visualizar e publicar as novidades do encontro."
          estado={Array.isArray(noticias) ? linhaNoticias(noticias) : null}
          larga
        />
      </div>

      <div className="mt-4">
        <Faixa
          href="/admin/cronograma"
          kicker="O dia"
          titulo="Cronograma"
          descricao="Manter a programação por dia, espaço e horário."
          estado={Array.isArray(programa) ? linhaPrograma(programa) : null}
          larga
        />
      </div>
    </div>
  );
}
