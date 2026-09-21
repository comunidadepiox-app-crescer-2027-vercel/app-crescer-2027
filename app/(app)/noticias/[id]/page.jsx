"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPublishedNewsById } from "@/lib/news/queries";
import { formataDataFirestore } from "@/lib/news/format";
import { ArtigoCorpo, Byline } from "@/components/noticias/Artigo";

export default function NoticiaDetalhePage() {
  const { id } = useParams();
  const [estado, setEstado] = useState({ carregando: true, noticia: null });

  useEffect(() => {
    getPublishedNewsById(id)
      .then((noticia) => setEstado({ carregando: false, noticia }))
      .catch(() => setEstado({ carregando: false, noticia: null }));
  }, [id]);

  if (estado.carregando) {
    return <p className="text-sm text-texto/60">Carregando notícia...</p>;
  }

  if (!estado.noticia) {
    return (
      <div className="max-w-prose">
        <h1 className="text-2xl font-bold uppercase">Notícia não encontrada</h1>
        <p className="mt-3 text-texto/80">
          Esta notícia não existe ou não está mais publicada.
        </p>
        <Link
          href="/noticias"
          className="mt-6 inline-block rounded-[10px] bg-titulo px-5 py-2.5 font-titulo font-bold uppercase text-white"
        >
          Voltar para as notícias
        </Link>
      </div>
    );
  }

  const { noticia } = estado;

  return (
    <article className="max-w-prose">
      <p className="text-sm text-texto/60">{formataDataFirestore(noticia.publishedAt)}</p>
      <h1 className="mt-1 text-3xl font-bold uppercase leading-tight">{noticia.title}</h1>
      <Byline nome={noticia.authorName} fotoUrl={noticia.authorPhotoUrl} />
      {noticia.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={noticia.coverUrl}
          alt=""
          className="mt-5 w-full border border-linha object-cover"
        />
      ) : null}
      <ArtigoCorpo body={noticia.body} />
      <Link
        href="/noticias"
        className="mt-8 inline-block text-sm font-semibold text-destaque underline"
      >
        Voltar para as notícias
      </Link>
    </article>
  );
}
