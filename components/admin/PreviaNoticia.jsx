"use client";

import { ArtigoCorpo, Byline } from "@/components/noticias/Artigo";
import { classeBotaoNeutro } from "@/components/admin/CabecalhoMesa";

function Miolo({ noticia }) {
  return (
    <article>
      <p className="text-sm text-texto/60">Pré-visualização. Isto ainda não foi salvo.</p>
      <h1 className="mt-1 text-3xl font-bold uppercase leading-tight">{noticia.title || "Sem título"}</h1>
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
    </article>
  );
}

export function PreviaNoticia({ noticia, onFechar }) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-fundo">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-linha bg-superficie px-5 py-3">
        <p className="font-titulo text-lg font-bold uppercase text-titulo">Pré-visualização</p>
        <button
          type="button"
          onClick={onFechar}
          className={classeBotaoNeutro}
        >
          Fechar
        </button>
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-8 lg:grid-cols-[minmax(0,42rem)_280px]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase text-texto/50">Site</p>
          <Miolo noticia={noticia} />
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase text-texto/50">Celular</p>
          <div className="h-[36rem] overflow-hidden border border-linha bg-superficie">
            <div className="w-[24rem] origin-top-left scale-[0.72] p-4">
              <Miolo noticia={noticia} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
