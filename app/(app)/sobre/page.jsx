import { EDICAO } from "@/lib/event/edition";

export default function SobrePage() {
  return (
    <div className="max-w-prose">
      <h1 className="text-3xl font-bold uppercase">Sobre o Crescer</h1>

      <p className="mt-4 leading-relaxed">
        O Crescer nasceu em Campina Grande como resposta autêntica para os fiéis
        católicos no período do carnaval. O nome vem da Segunda Carta de São
        Pedro: crescer na graça e no conhecimento do Senhor (2 Pd 3, 18).
      </p>
      <p className="mt-4 leading-relaxed">
        Em 2009 o evento assumiu a temática da família e, desde 2012, intitula-se
        o Encontro da Família Católica. Hoje é considerado o maior encontro de
        famílias católicas do Brasil, promovido pela Comunidade de São Pio X e
        recebendo caravanas de todo o país.
      </p>
      <p className="mt-4 leading-relaxed">
        A edição atual é o {EDICAO.nome}, realizado no {EDICAO.local}. A
        comunidade já convoca as famílias para o Crescer 2027.
      </p>

      <h2 className="mt-10 text-2xl font-bold uppercase">Caravanas</h2>
      <p className="mt-3 leading-relaxed">
        Venha em caravana. Encontre responsáveis que organizam viagens e
        peregrinações para o encontro perto de você, ou inscreva a sua caravana
        no site oficial.
      </p>
      <a
        href="https://encontrodafamiliacatolica.com.br/"
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block rounded-[10px] bg-titulo px-5 py-2.5 font-titulo font-bold uppercase text-white"
      >
        Caravanas no site oficial
      </a>

      <h2 className="mt-10 text-2xl font-bold uppercase">Comunidade de São Pio X</h2>
      <ul className="mt-3 flex flex-col gap-1 text-texto/85">
        <li>Rua Afonso Pena, 61, Centro, Campina Grande, PB</li>
        <li>Telefones: (83) 3341-7017 e (83) 3088-7017</li>
        <li>WhatsApp: (83) 98897-7017</li>
        <li>E-mail: contato@piox.org.br</li>
      </ul>
      <p className="mt-4 text-sm text-texto/60">
        Mantenedora: Associação Carismática Católica São Pio X. CNPJ
        02.868.732/0001-23.
      </p>
    </div>
  );
}
