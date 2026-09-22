"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listAllNews } from "@/lib/admin/news";
import { formataDataFirestore } from "@/lib/news/format";
import {
  CabecalhoMesa,
  classeBotaoPrimario,
  classeLinha,
} from "@/components/admin/CabecalhoMesa";

function meta(noticia) {
  const data = noticia.published ? formataDataFirestore(noticia.publishedAt) : "";
  return [noticia.authorName, data].filter(Boolean).join(", ");
}

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState(null);

  useEffect(() => {
    listAllNews().then(setNoticias).catch(() => setNoticias([]));
  }, []);

  return (
    <div className="max-w-4xl">
      <CabecalhoMesa
        titulo="Notícias"
        frase="Rascunhos e textos no ar. A linha abre a edição."
        acao={
          <Link href="/admin/noticias/nova" className={classeBotaoPrimario}>
            Nova notícia
          </Link>
        }
      />

      {noticias === null ? (
        <p className="mt-6 text-sm text-texto/60">Carregando...</p>
      ) : noticias.length === 0 ? (
        <p className="mt-6 rounded-[14px] border border-linha bg-superficie px-5 py-8 text-texto/70">
          Nenhuma notícia ainda. Crie a primeira.
        </p>
      ) : (
        <ul className="mt-6 overflow-hidden rounded-[14px] border border-linha bg-superficie">
          {noticias.map((n) => (
            <li key={n.id} className="border-b border-linha last:border-b-0">
              <Link
                href={`/admin/noticias/${n.id}`}
                className={`flex items-center gap-4 px-4 py-3 ${classeLinha}`}
              >
                {n.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={n.coverUrl}
                    alt=""
                    className="h-16 w-24 shrink-0 border border-linha object-cover"
                  />
                ) : (
                  <span className="h-16 w-24 shrink-0 border border-linha bg-creme" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{n.title || "Sem título"}</p>
                  {meta(n) ? <p className="truncate text-sm text-texto/60">{meta(n)}</p> : null}
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold uppercase ${
                    n.published ? "text-verde" : "text-texto/50"
                  }`}
                >
                  {n.published ? "No ar" : "Rascunho"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
