"use client";

import { useEffect, useState } from "react";
import { listPublishedNews } from "@/lib/news/queries";
import { NewsListItem } from "@/components/news/NewsList";

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    listPublishedNews(50)
      .then(setNoticias)
      .catch((err) => {
        console.error("Erro ao carregar notícias:", err);
        setErro(true);
        setNoticias([]);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold uppercase">Notícias</h1>
      <p className="mt-2 max-w-prose text-texto/80">
        As novidades do Crescer e da Comunidade de São Pio X.
      </p>

      {noticias === null ? (
        <p className="mt-6 text-sm text-texto/60">Carregando notícias...</p>
      ) : erro ? (
        <p className="mt-6 text-sm font-medium text-vermelho">
          Não foi possível carregar as notícias agora. Tente de novo em instantes.
        </p>
      ) : noticias.length === 0 ? (
        <p className="mt-6 text-texto/70">
          Ainda não há notícias publicadas. Volte em breve.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((n) => (
            <NewsListItem key={n.id} noticia={n} />
          ))}
        </div>
      )}
    </div>
  );
}
