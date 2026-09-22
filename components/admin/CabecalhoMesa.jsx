export const classeBotaoPrimario =
  "inline-flex items-center justify-center rounded-[10px] bg-titulo px-5 py-2.5 font-titulo font-bold uppercase text-white transition-colors duration-150 hover:bg-roxo disabled:opacity-60 motion-reduce:transition-none";

export const classeBotaoSecundario =
  "inline-flex items-center justify-center rounded-[10px] border border-titulo px-5 py-2.5 font-titulo font-bold uppercase text-titulo transition-colors duration-150 hover:bg-creme disabled:opacity-60 motion-reduce:transition-none";

export const classeBotaoNeutro =
  "inline-flex items-center justify-center rounded-[10px] border border-linha px-5 py-2.5 font-titulo font-bold uppercase text-texto/70 transition-colors duration-150 hover:bg-creme disabled:opacity-60 motion-reduce:transition-none";

export const classeBotaoPerigo =
  "inline-flex items-center justify-center rounded-[10px] border border-vermelho px-5 py-2.5 font-titulo font-bold uppercase text-vermelho transition-colors duration-150 hover:bg-creme disabled:opacity-60 motion-reduce:transition-none";

export const classeLinha =
  "transition-colors duration-150 hover:bg-creme motion-reduce:transition-none";

export function CabecalhoMesa({ titulo, frase, acao }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold uppercase">{titulo}</h1>
        {frase ? <p className="mt-1 max-w-prose text-sm text-texto/70">{frase}</p> : null}
      </div>
      {acao ? <div className="shrink-0">{acao}</div> : null}
    </header>
  );
}
