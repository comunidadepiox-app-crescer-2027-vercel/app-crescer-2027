"use client";

import { useEffect, useState } from "react";
import {
  createAnnouncement,
  deleteAnnouncement,
  listAnnouncements,
  updateAnnouncement,
} from "@/lib/admin/announcements";
import { uploadMedia } from "@/lib/admin/upload";

const VAZIO = { imageUrl: "", imagePublicId: "", linkUrl: "", active: true };

function linkValido(valor) {
  const texto = valor.trim();
  if (!texto) return true;
  try {
    const url = new URL(texto);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function AdminAnunciosPage() {
  const [lista, setLista] = useState(null);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VAZIO);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function carregar() {
    try {
      setLista(await listAnnouncements());
    } catch {
      setLista([]);
      setErro("Não foi possível carregar os anúncios.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirNovo() {
    setForm(VAZIO);
    setEditando("novo");
    setErro("");
  }

  function abrirEdicao(item) {
    setForm({
      imageUrl: item.imageUrl || "",
      imagePublicId: item.imagePublicId || "",
      linkUrl: item.linkUrl || "",
      active: Boolean(item.active),
    });
    setEditando(item.id);
    setErro("");
  }

  async function trocarImagem(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErro("");
    setOcupado(true);
    try {
      const { url, publicId } = await uploadMedia(file, {
        folder: "announcements",
        resource: "image",
      });
      setForm((f) => ({ ...f, imageUrl: url, imagePublicId: publicId }));
    } catch (err) {
      setErro(err.message);
    } finally {
      setOcupado(false);
    }
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    if (!form.imageUrl) {
      setErro("Envie a imagem vertical do anúncio.");
      return;
    }
    if (!linkValido(form.linkUrl)) {
      setErro("O link precisa começar com http:// ou https://, ou ficar vazio.");
      return;
    }
    setOcupado(true);
    const dados = {
      imageUrl: form.imageUrl,
      imagePublicId: form.imagePublicId,
      linkUrl: form.linkUrl.trim(),
      active: Boolean(form.active),
    };
    try {
      if (editando === "novo") await createAnnouncement(dados);
      else await updateAnnouncement(editando, dados);
      setEditando(null);
      await carregar();
    } catch (err) {
      console.error("Erro ao salvar anúncio:", err);
      if (err?.code === "permission-denied") {
        setErro(
          "Sem permissão para gravar. Publique as regras do Firestore: a coleção announcements ainda não está liberada para o admin."
        );
      } else {
        setErro(err?.message || "Não foi possível salvar.");
      }
    } finally {
      setOcupado(false);
    }
  }

  async function alternar(item) {
    try {
      await updateAnnouncement(item.id, { active: !item.active });
      await carregar();
    } catch {
      setErro("Não foi possível atualizar o anúncio.");
    }
  }

  async function excluir(id) {
    if (!confirm("Excluir este anúncio?")) return;
    try {
      await deleteAnnouncement(id);
      if (editando === id) setEditando(null);
      await carregar();
    } catch {
      setErro("Não foi possível excluir.");
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold uppercase">Anúncios</h1>
        <button
          type="button"
          onClick={abrirNovo}
          className="bg-titulo px-5 py-2.5 font-titulo font-bold uppercase text-white"
        >
          Novo anúncio
        </button>
      </div>
      <p className="mt-2 max-w-prose text-sm text-texto/70">
        O cartaz aparece na Home do app na primeira abertura do dia. O mais recente fica na frente.
      </p>

      {editando !== null && (
        <form onSubmit={salvar} className="mt-6 grid gap-6 border border-linha bg-superficie p-5 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="flex flex-col gap-4">
            <h2 className="font-titulo text-lg font-bold uppercase text-titulo">
              {editando === "novo" ? "Novo anúncio" : "Editar anúncio"}
            </h2>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Imagem vertical</span>
              <input type="file" accept="image/*" onChange={trocarImagem} className="text-sm" />
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Link ao tocar na imagem (opcional)</span>
              <input
                type="url"
                value={form.linkUrl}
                onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
                placeholder="https://"
                className="border border-linha px-3 py-2 outline-none focus:border-titulo"
              />
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="h-4 w-4 accent-titulo"
              />
              <span className="text-sm font-medium">Ativo</span>
            </label>
            {erro && <p className="text-sm font-medium text-vermelho">{erro}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={ocupado}
                className="bg-titulo px-5 py-2.5 font-titulo font-bold uppercase text-white disabled:opacity-60"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setEditando(null)}
                className="border border-linha px-5 py-2.5 font-titulo font-bold uppercase text-texto/70"
              >
                Cancelar
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-texto/50">Celular</p>
            <div className="mt-2 flex h-[390px] items-center justify-center border border-linha bg-creme p-3">
              {form.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
              ) : (
                <p className="text-sm text-texto/60">A imagem vertical aparece aqui.</p>
              )}
            </div>
          </div>
        </form>
      )}

      {erro && editando === null && <p className="mt-4 text-sm font-medium text-vermelho">{erro}</p>}

      {lista === null ? (
        <p className="mt-6 text-sm text-texto/60">Carregando...</p>
      ) : lista.length === 0 ? (
        <p className="mt-6 text-texto/70">Nenhum anúncio ainda.</p>
      ) : (
        <ul className="mt-6 divide-y divide-linha border-y border-linha">
          {lista.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt="" className="h-16 w-10 border border-linha object-cover" />
              ) : (
                <div className="h-16 w-10 border border-linha bg-creme" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{item.linkUrl || "Sem link"}</p>
                <p className={`text-sm font-semibold uppercase ${item.active ? "text-verde" : "text-texto/50"}`}>
                  {item.active ? "Ativo" : "Pausado"}
                </p>
              </div>
              <button type="button" onClick={() => alternar(item)} className="text-sm font-semibold text-destaque underline">
                {item.active ? "Pausar" : "Ativar"}
              </button>
              <button type="button" onClick={() => abrirEdicao(item)} className="text-sm font-semibold text-destaque underline">
                Editar
              </button>
              <button type="button" onClick={() => excluir(item.id)} className="text-sm font-semibold text-vermelho underline">
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
