"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createProgramItem,
  deleteProgramItem,
  listProgramItemsAdmin,
  updateProgramItem,
} from "@/lib/admin/program";
import { ordenaItensPrograma } from "@/lib/program/ordenar";
import { ESPACOS, nomeDoEspaco } from "@/lib/program/spaces";
import {
  EDICAO,
  resolveDiaRecorte,
  formataDataCurta,
  diasDaEdicao,
} from "@/lib/event/edition";
import { avisarMudancaPrograma, mudouDiaPublicado } from "@/lib/admin/notificar";
import {
  CabecalhoMesa,
  classeBotaoNeutro,
  classeBotaoPrimario,
  classeLinha,
} from "@/components/admin/CabecalhoMesa";

const NOVO = {
  time: "",
  title: "",
  guest: "",
  location: "Centro de Convenções",
  space: "palco-principal",
  order: 0,
  notes: "",
  published: true,
};

function mensagemErro(err) {
  if (err?.code === "permission-denied") {
    return "Sem permissão para gravar. Confira se o documento users desta conta tem role admin e se as regras do Firestore estão publicadas.";
  }
  return err?.message || "Não foi possível concluir.";
}

export default function AdminCronogramaPage() {
  const dias = useMemo(diasDaEdicao, []);
  const [dia, setDia] = useState(() => resolveDiaRecorte().date);
  const [todos, setTodos] = useState(null);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(NOVO);
  const [erro, setErro] = useState("");
  const [erroLista, setErroLista] = useState("");
  const [ocupado, setOcupado] = useState(false);

  const itens = todos ? ordenaItensPrograma(todos.filter((item) => item.date === dia)) : null;
  const datasFora = todos
    ? [...new Set(todos.map((item) => item.date).filter((d) => d && !dias.includes(d)))].sort()
    : [];

  async function carregar() {
    setErroLista("");
    try {
      const lista = await listProgramItemsAdmin();
      setTodos(lista);
    } catch (err) {
      console.error("Erro ao listar programação:", err);
      setErroLista(mensagemErro(err));
      setTodos([]);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirNovo() {
    const alvo = dias.includes(dia) ? dia : dias[0];
    const qtd = todos ? todos.filter((item) => item.date === alvo).length : 0;
    setDia(alvo);
    setForm({ ...NOVO, order: qtd + 1 });
    setEditando("novo");
    setErro("");
  }

  function abrirEdicao(item) {
    setForm({
      time: item.time,
      title: item.title,
      guest: item.guest || "",
      location: item.location || "",
      space: item.space,
      order: item.order,
      notes: item.notes || "",
      published: Boolean(item.published),
    });
    setEditando(item.id);
    setErro("");
    if (item.date && item.date !== dia) setDia(item.date);
  }

  function atualiza(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    if (!/^\d{2}:\d{2}$/.test(form.time)) {
      setErro("Horário no formato HH:mm, por exemplo 14:00.");
      return;
    }
    if (!form.title.trim()) {
      setErro("O título é obrigatório.");
      return;
    }
    setOcupado(true);
    const dados = { ...form, date: dia, order: Number(form.order) || 0 };
    const antes = editando === "novo" ? null : todos?.find((item) => item.id === editando);
    try {
      if (editando === "novo") await createProgramItem(dados);
      else await updateProgramItem(editando, dados);
      setEditando(null);
      await carregar();
      if (mudouDiaPublicado(antes, dados)) {
        try {
          await avisarMudancaPrograma();
        } catch {
          setErroLista("Item salvo. O aviso nos celulares não saiu.");
        }
      }
    } catch (err) {
      console.error("Erro ao salvar programação:", err);
      setErro(mensagemErro(err));
    } finally {
      setOcupado(false);
    }
  }

  async function excluir(id) {
    if (!confirm("Excluir este item da programação?")) return;
    const item = todos?.find((atual) => atual.id === id);
    try {
      await deleteProgramItem(id);
      await carregar();
      if (item && mudouDiaPublicado(item, { ...item, published: false })) {
        try {
          await avisarMudancaPrograma();
        } catch {
          setErroLista("Item excluído. O aviso nos celulares não saiu.");
        }
      }
    } catch (err) {
      setErroLista(mensagemErro(err));
    }
  }

  return (
    <div>
      <CabecalhoMesa
        titulo="Cronograma"
        frase={`${EDICAO.nome}. Os fiéis só veem o dia correspondente em Home, Cronograma e no app.`}
        acao={
          <button type="button" onClick={abrirNovo} className={classeBotaoPrimario}>
            Novo item
          </button>
        }
      />

      <div className="mt-6 flex gap-4 overflow-x-auto border-b border-linha">
        {[...dias, ...datasFora].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDia(d)}
            className={`shrink-0 pb-2 font-titulo text-lg font-bold uppercase transition-colors duration-150 motion-reduce:transition-none ${
              dia === d ? "border-b-2 border-destaque text-titulo" : "text-texto/60 hover:text-titulo"
            }`}
          >
            {formataDataCurta(d)}
          </button>
        ))}
      </div>

      {datasFora.length > 0 && (
        <p className="mt-4 text-sm text-texto/80">
          Há itens gravados fora de 5 a 9 de fevereiro de 2027. O app do fiel não mostra
          essas datas. Abra o item, escolha um dia do encontro nas abas e salve de novo.
        </p>
      )}

      {editando !== null && (
        <form
          onSubmit={salvar}
          className="mt-6 flex flex-col gap-3 rounded-[14px] border border-linha bg-superficie p-5"
        >
          <h2 className="font-titulo text-lg font-bold uppercase text-titulo">
            {editando === "novo" ? "Novo item" : "Editar item"} de {formataDataCurta(dia)}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Horário (HH:mm)</span>
              <input
                type="text"
                value={form.time}
                onChange={(e) => atualiza("time", e.target.value)}
                placeholder="14:00"
                className="rounded-[10px] border border-linha px-3 py-2 outline-none focus:border-titulo"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Espaço</span>
              <select
                value={form.space}
                onChange={(e) => atualiza("space", e.target.value)}
                className="rounded-[10px] border border-linha bg-superficie px-3 py-2 outline-none focus:border-titulo"
              >
                {ESPACOS.map((esp) => (
                  <option key={esp.slug} value={esp.slug}>
                    {esp.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Título</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => atualiza("title", e.target.value)}
              className="rounded-[10px] border border-linha px-3 py-2 outline-none focus:border-titulo"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Convidado (opcional)</span>
              <input
                type="text"
                value={form.guest}
                onChange={(e) => atualiza("guest", e.target.value)}
                className="rounded-[10px] border border-linha px-3 py-2 outline-none focus:border-titulo"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Local</span>
              <input
                type="text"
                value={form.location}
                onChange={(e) => atualiza("location", e.target.value)}
                className="rounded-[10px] border border-linha px-3 py-2 outline-none focus:border-titulo"
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Ordem no dia</span>
              <input
                type="number"
                value={form.order}
                onChange={(e) => atualiza("order", e.target.value)}
                className="rounded-[10px] border border-linha px-3 py-2 outline-none focus:border-titulo"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Observações (opcional)</span>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => atualiza("notes", e.target.value)}
                className="rounded-[10px] border border-linha px-3 py-2 outline-none focus:border-titulo"
              />
            </label>
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => atualiza("published", e.target.checked)}
              className="h-4 w-4 accent-titulo"
            />
            <span className="text-sm font-medium">Publicado</span>
          </label>

          {erro && <p className="text-sm font-medium text-vermelho">{erro}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={ocupado} className={classeBotaoPrimario}>
              Salvar
            </button>
            <button type="button" onClick={() => setEditando(null)} className={classeBotaoNeutro}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {todos === null ? (
        <p className="mt-6 text-sm text-texto/60">Carregando...</p>
      ) : erroLista ? (
        <p className="mt-6 text-sm font-medium text-vermelho">{erroLista}</p>
      ) : itens.length === 0 ? (
        <p className="mt-6 rounded-[14px] border border-linha bg-superficie px-5 py-8 text-texto/70">
          Nenhum item em {formataDataCurta(dia)}. Use o botão Novo item.
        </p>
      ) : (
        <ul className="mt-6 overflow-hidden rounded-[14px] border border-linha bg-superficie">
          {itens.map((item) => (
            <li key={item.id} className={`flex items-center gap-4 border-b border-linha px-4 py-3 last:border-b-0 ${classeLinha}`}>
              <span className="w-14 shrink-0 font-semibold text-destaque">{item.time}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.title}</p>
                <p className="text-sm text-texto/60">
                  {nomeDoEspaco(item.space)}
                  {item.guest ? `, ${item.guest}` : ""}
                  {!item.published ? " (não publicado)" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => abrirEdicao(item)}
                className="text-sm font-semibold text-titulo transition-colors duration-150 hover:text-destaque motion-reduce:transition-none"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => excluir(item.id)}
                className="text-sm font-semibold text-vermelho transition-colors duration-150 hover:text-titulo motion-reduce:transition-none"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
