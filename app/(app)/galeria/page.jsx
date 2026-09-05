const GALERIAS_OFICIAIS = [
  {
    titulo: "Galerias do site oficial",
    descricao:
      "As fotos de todas as edições do encontro ficam nas galerias do site oficial do Crescer, organizadas por dia.",
    href: "https://encontrodafamiliacatolica.com.br/galerias/",
    acao: "Abrir galerias oficiais",
  },
  {
    titulo: "Instagram do Crescer",
    descricao:
      "Acompanhe os registros do encontro e os avisos da comunidade também pelo Instagram oficial.",
    href: "https://www.instagram.com/encontrodafamiliacatolica/",
    acao: "Abrir o Instagram",
  },
];

export default function GaleriaPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold uppercase">Galeria</h1>
      <p className="mt-2 max-w-prose text-texto/80">
        Reviva os momentos do encontro. As fotos oficiais são publicadas pela
        equipe de comunicação da Comunidade de São Pio X.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {GALERIAS_OFICIAIS.map((g) => (
          <article
            key={g.href}
            className="rounded-[10px] border border-linha bg-superficie p-6"
          >
            <h2 className="font-titulo text-xl font-bold uppercase text-titulo">
              {g.titulo}
            </h2>
            <p className="mt-2 max-w-prose text-texto/80">{g.descricao}</p>
            <a
              href={g.href}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block rounded-[10px] bg-titulo px-5 py-2.5 font-titulo font-bold uppercase text-white"
            >
              {g.acao}
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
