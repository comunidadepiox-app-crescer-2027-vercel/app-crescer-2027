"use client";

import { useEffect, useMemo, useState } from "react";
import { observarProgramaPublicado, itensDoDia, agrupaPorEspaco } from "@/lib/program/queries";
import { nomeDoEspaco } from "@/lib/program/spaces";
import {
  EDICAO,
  resolveDiaRecorte,
  formataDataCurta,
  formataDataLonga,
  diasDaEdicao,
} from "@/lib/event/edition";

export default function CronogramaPage() {
  const dias = useMemo(diasDaEdicao, []);
  const [dia, setDia] = useState(() => resolveDiaRecorte().date);
  const [todos, setTodos] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    return observarProgramaPublicado(
      (lista) => {
        setErro(false);
        setTodos(lista);
      },
      (err) => {
        console.error("Erro ao carregar programação:", err);
        setErro(true);
        setTodos([]);
      }
    );
  }, []);

  const itens = todos ? itensDoDia(todos, dia) : null;

  const grupos = itens ? agrupaPorEspaco(itens) : null;

  return (
    <div>
      <h1 className="text-3xl font-bold uppercase">Cronograma</h1>
      <p className="mt-2 max-w-prose text-texto/80">
        {EDICAO.nome}, {EDICAO.local}.
      </p>

      <div className="mt-6 flex gap-4 overflow-x-auto border-b border-linha">
        {dias.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDia(d)}
            className={`shrink-0 pb-2 font-titulo text-lg font-bold uppercase ${
              dia === d
                ? "border-b-2 border-destaque text-titulo"
                : "text-texto/60"
            }`}
          >
            {formataDataCurta(d)}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm capitalize text-texto/70">{formataDataLonga(dia)}</p>

      {itens === null ? (
        <p className="mt-6 text-sm text-texto/60">Carregando programação...</p>
      ) : erro ? (
        <p className="mt-6 text-sm font-medium text-vermelho">
          Não foi possível carregar a programação agora. Tente de novo em instantes.
        </p>
      ) : itens.length === 0 ? (
        <p className="mt-6 text-texto/70">
          A programação deste dia ainda não foi publicada.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {[...grupos.entries()].map(([espaco, doEspaco]) => (
            <section
              key={espaco}
              className="overflow-hidden rounded-[14px] border border-linha bg-superficie"
            >
              <div className="bg-roxo-botao px-4 py-2.5">
                <h2 className="font-titulo text-xl font-bold uppercase text-white">
                  {nomeDoEspaco(espaco)}
                </h2>
                {doEspaco[0]?.location && (
                  <p className="text-sm text-white/75">Local: {doEspaco[0].location}</p>
                )}
              </div>
              <ul className="divide-y divide-linha px-4">
                {doEspaco.map((item) => (
                  <li key={item.id} className="flex gap-4 py-3">
                    <span className="w-14 shrink-0 font-semibold text-destaque">
                      {item.time}
                    </span>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      {item.guest && (
                        <p className="text-sm text-texto/70">{item.guest}</p>
                      )}
                      {item.notes && (
                        <p className="mt-1 text-sm text-texto/60">{item.notes}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <p className="mt-10 border-t border-linha pt-4 text-sm text-texto/60">
        Os horários e os convidados podem ser alterados sem aviso prévio.
      </p>
    </div>
  );
}
