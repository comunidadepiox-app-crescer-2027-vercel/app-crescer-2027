"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listAllNews } from "@/lib/admin/news";
import { formataDataFirestore } from "@/lib/news/format";

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState(null);

  useEffect(() => {
    listAllNews().then(setNoticias).catch(() => setNoticias([]));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold uppercase">Notícias</h1>
        <Link
          href="/admin/noticias/nova"
          className="rounded-[10px] bg-titulo px-5 py-2.5 font-titulo font-bold uppercase text-white"
        >
          Nova notícia
        </Link>
      </div>

      {noticias === null ? (
        <p className="mt-6 text-sm text-texto/60">Carregando...</p>
      ) : noticias.length === 0 ? (
        <p className="mt-6 text-texto/70">Nenhuma notícia ainda. Crie a primeira.</p>
      ) : (
        <ul className="mt-6 divide-y divide-linha border-y border-linha">
          {noticias.map((n) => (
            <li key={n.id}>
              <Link
                href={`/admin/noticias/${n.id}`}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{n.title}</p>
                  <p className="text-sm text-texto/60">
                    {n.published
                      ? `Publicada em ${formataDataFirestore(n.publishedAt)}`
                      : "Rascunho"}
                  </p>
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
