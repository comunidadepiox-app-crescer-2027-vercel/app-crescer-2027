"use client";

import { IconeMesa } from "./iconesMesa";

// Navegação entre as páginas da fila de testemunhos. Mesmo desenho das setas
// do Terço no app: seta desabilitada nas pontas, contador no meio e alvo de
// toque de 44 px, que é o mínimo confortável no celular na hora do evento.
export function PaginacaoMesa({ pagina, totalPaginas, onAnterior, onProxima, rotulo = "fila" }) {
  if (totalPaginas <= 1) return null;

  const primeira = pagina <= 1;
  const ultima = pagina >= totalPaginas;

  return (
    <nav
      aria-label={`Paginação da ${rotulo}`}
      className="mt-6 flex items-center justify-between gap-3 border-t border-linha pt-4"
    >
      <Seta
        nome="volta"
        rotulo="Página anterior"
        desabilitada={primeira}
        onPress={onAnterior}
      />
      <p aria-live="polite" className="font-titulo text-sm font-bold uppercase text-texto/70">
        Página {pagina} de {totalPaginas}
      </p>
      <Seta
        nome="avanca"
        rotulo="Próxima página"
        desabilitada={ultima}
        onPress={onProxima}
      />
    </nav>
  );
}

function Seta({ nome, rotulo, desabilitada, onPress }) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={desabilitada}
      aria-label={rotulo}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-titulo text-titulo transition-colors duration-150 hover:bg-creme disabled:pointer-events-none disabled:border-linha disabled:text-texto/30 motion-reduce:transition-none"
    >
      <IconeMesa nome={nome} className="h-5 w-5" />
    </button>
  );
}
