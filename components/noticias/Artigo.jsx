import { corpoEhHtml, sanitizaArtigo } from "@/lib/news/html";

export function Byline({ nome, fotoUrl }) {
  if (!nome && !fotoUrl) return null;
  return (
    <div className="mt-4 flex items-center gap-3">
      {fotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fotoUrl} alt="" className="h-11 w-11 border border-linha object-cover" />
      ) : null}
      {nome ? <p className="text-sm font-medium">{nome}</p> : null}
    </div>
  );
}

export function ArtigoCorpo({ body }) {
  const texto = String(body || "");
  if (!corpoEhHtml(texto)) {
    const paragrafos = texto.split(/\n{2,}|\r\n\r\n/).filter((p) => p.trim());
    return (
      <div className="mt-6 flex flex-col gap-4 leading-relaxed">
        {paragrafos.map((paragrafo, i) => (
          <p key={i}>{paragrafo.trim()}</p>
        ))}
      </div>
    );
  }

  return (
    <div
      className="artigo mt-6"
      dangerouslySetInnerHTML={{ __html: sanitizaArtigo(texto) }}
    />
  );
}
