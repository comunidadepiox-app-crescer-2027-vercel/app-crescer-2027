import Link from "next/link";

const ATALHOS = [
  {
    href: "/admin/noticias",
    titulo: "Notícias",
    descricao: "Escrever, pré-visualizar e publicar as novidades do encontro.",
  },
  {
    href: "/admin/cronograma",
    titulo: "Cronograma",
    descricao: "Manter a programação por dia, espaço e horário.",
  },
  {
    href: "/admin/anuncios",
    titulo: "Anúncios",
    descricao: "Publicar o cartaz que aparece na Home do app.",
  },
];

export default function AdminIndexPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold uppercase">Mesa de trabalho</h1>
      <p className="mt-2 max-w-prose text-texto/80">
        Área da equipe de comunicação da Comunidade de São Pio X.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ATALHOS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="border border-linha bg-superficie p-5"
          >
            <h2 className="font-titulo text-xl font-bold uppercase text-titulo">{a.titulo}</h2>
            <p className="mt-1 text-sm text-texto/70">{a.descricao}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
