"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  ROTULO_STATUS,
  contaTestemunhos,
  listaTestemunhos,
  marcaLido,
  naoAceita,
} from "@/lib/admin/testimonials";
import { formataDataFirestore } from "@/lib/news/format";
import {
  CabecalhoMesa,
  classeBotaoPerigo,
  classeBotaoPrimario,
} from "@/components/admin/CabecalhoMesa";
import { PaginacaoMesa } from "@/components/admin/PaginacaoMesa";

const TAMANHO = 5;

// Uma aba por pasta. "aguardando" é o que ainda exige decisão e é a fila de
// leitura no palco. "encerrados" é o histórico, para conferir depois do evento.
const ABAS = [
  { pasta: "aguardando", rotulo: "Aguardando" },
  { pasta: "encerrados", rotulo: "Encerrados" },
];
function dataCurta(timestamp) {
  if (!timestamp?.toDate) return "Sem data";
  const completo = formataDataFirestore(timestamp);
  if (!completo) return "Sem data";
  const hora = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Recife",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp.toDate());
  return `${completo}, ${hora}`;
}

export default function AdminTestemunhosPage() {
  const { profile } = useAuth();
  const adminUid = profile?.uid || null;

  const [pasta, setPasta] = useState("aguardando");
  const [pagina, setPagina] = useState(1);
  const [linha, setLinha] = useState(undefined);
  const [total, setTotal] = useState(0);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState("");

  // Um cursor por página. Guardar o último documento de cada página é o que
  // permite voltar sem recarregar e sem repetir nem pular item.
  const cursores = useRef({});

  const carregar = useCallback(async () => {
    setErro("");
    setLinha(undefined);
    try {
      const [paginaAtual, quantos] = await Promise.all([
        listaTestemunhos({
          pasta,
          tamanho: TAMANHO,
          cursor: cursores.current[pagina - 1] || null,
        }),
        pagina === 1 ? contaTestemunhos(pasta) : Promise.resolve(null),
      ]);
      if (quantos !== null) setTotal(quantos);
      cursores.current[pagina] = paginaAtual.proximoCursor;
      setLinha(paginaAtual.itens);
    } catch (err) {
      console.error("Erro ao ler testemunhos:", err);
      setErro(
        err?.code === "failed-precondition"
          ? "O índice de testimonials ainda não foi publicado no Firebase."
          : "Não foi possível carregar os testemunhos."
      );
      setLinha([]);
    }
  }, [pasta, pagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function trocarAba(nova) {
    if (nova === pasta) return;
    cursores.current = {};
    setPagina(1);
    setTotal(0);
    setPasta(nova);
  }

  async function decidir(id, status) {
    setErro("");
    setOcupado(id);
    try {
      if (status === "lido") await marcaLido(id, adminUid);
      else await naoAceita(id, adminUid);
      // Sai da aba sem recarregar a página. A contagem cai junto, porque o
      // item deixou de estar em "aguardando".
      const sobraram = (linha || []).filter((t) => t.id !== id);
      setLinha(sobraram);
      setTotal((atual) => (pasta === "aguardando" ? Math.max(0, atual - 1) : atual));
      // Se esvaziou a última página, volta uma. Sem isso o apresentador fica
      // numa página vazia com o total ainda apontando para ela.
      if (sobraram.length === 0 && pagina > 1) {
        cursores.current = {};
        setPagina(1);
      }
    } catch (err) {
      console.error("Erro ao decidir testemunho:", err);
      setErro("Não foi possível registrar a decisão. Tente de novo.");
    } finally {
      setOcupado("");
    }
  }

  const totalPaginas = Math.max(1, Math.ceil(total / TAMANHO));

  return (
    <div className="max-w-3xl">
      <CabecalhoMesa
        titulo="Testemunhos"
        frase="Fila de leitura do encontro. O mais antigo vem primeiro. Leia o texto da pessoa, decida e o item sai da fila."
      />

      <div className="mt-6 flex gap-4 overflow-x-auto border-b border-linha">
        {ABAS.map((aba) => {
          const on = pasta === aba.pasta;
          return (
            <button
              key={aba.pasta}
              type="button"
              onClick={() => trocarAba(aba.pasta)}
              aria-current={on ? "page" : undefined}
              className={`shrink-0 pb-2 font-titulo text-lg font-bold uppercase transition-colors duration-150 motion-reduce:transition-none ${
                on ? "border-b-2 border-destaque text-titulo" : "text-texto/60 hover:text-titulo"
              }`}
            >
              {aba.rotulo}
            </button>
          );
        })}
      </div>

      {erro ? <p className="mt-4 text-sm font-medium text-vermelho">{erro}</p> : null}

      {linha === undefined ? (
        <p className="mt-6 text-sm text-texto/60">Carregando...</p>
      ) : linha.length === 0 ? (
        <p className="mt-6 rounded-[14px] border border-linha bg-superficie px-5 py-8 text-texto/70">
          {pasta === "aguardando"
            ? "Nenhum testemunho na fila agora."
            : "Nada foi decidido ainda nesta edição."}
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {linha.map((t) => (
            <CartaoTestemunho
              key={t.id}
              testemunho={t}
              pasta={pasta}
              ocupado={ocupado === t.id}
              onLer={() => decidir(t.id, "lido")}
              onRecusar={() => decidir(t.id, "nao_aceito")}
            />
          ))}
        </ul>
      )}

      <PaginacaoMesa
        pagina={pagina}
        totalPaginas={totalPaginas}
        rotulo="fila de testemunhos"
        onAnterior={() => setPagina((p) => Math.max(1, p - 1))}
        onProxima={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
      />
    </div>
  );
}

// Uma coluna, cartão por linha, alvos grandes. Não existe resumo automático
// desde 28/09/2026: a mesa mostra o texto que a pessoa escreveu, e a equipe é
// que decide o que pode ser lido no palco.
function CartaoTestemunho({ testemunho, pasta, ocupado, onLer, onRecusar }) {
  const nome = testemunho.anonimo || !testemunho.nome ? "Anônimo" : testemunho.nome;
  const decidido = pasta === "encerrados";

  return (
    <li className="rounded-[14px] border border-linha bg-superficie p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-titulo text-lg font-bold uppercase text-titulo">{nome}</p>
        <p className="text-sm text-destaque">{dataCurta(testemunho.createdAt)}</p>
      </div>

      <p className="mt-1 font-titulo text-xs font-bold uppercase text-texto/50">
        {ROTULO_STATUS[testemunho.status] || testemunho.status}
      </p>

      <p className="mt-4 whitespace-pre-line text-[15px] leading-6 text-texto">
        {testemunho.texto || "Sem texto."}
      </p>

      {decidido ? (
        <p className="mt-5 font-titulo text-xs font-bold uppercase text-texto/50">
          Decisão registrada
        </p>
      ) : (
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onLer}
            disabled={ocupado}
            className={`${classeBotaoPrimario} min-h-11`}
          >
            Testemunho lido
          </button>
          <button
            type="button"
            onClick={onRecusar}
            disabled={ocupado}
            className={`${classeBotaoPerigo} min-h-11`}
          >
            Não aceitar
          </button>
        </div>
      )}
    </li>
  );
}
