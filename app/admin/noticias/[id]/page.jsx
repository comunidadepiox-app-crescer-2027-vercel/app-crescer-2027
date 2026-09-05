"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  createNews,
  deleteNews,
  getNewsById,
  updateNews,
} from "@/lib/admin/news";
import { uploadCover } from "@/lib/admin/upload";

const VAZIA = { title: "", body: "", coverUrl: "", coverPublicId: "", published: false };

export default function AdminNoticiaEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const criando = id === "nova";

  const [form, setForm] = useState(criando ? VAZIA : null);
  const [tinhaPublishedAt, setTinhaPublishedAt] = useState(false);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    if (criando) return;
    getNewsById(id).then((n) => {
      if (!n) {
        setErro("Notícia não encontrada.");
        setForm(VAZIA);
        return;
      }
      setTinhaPublishedAt(Boolean(n.publishedAt));
      setForm({
        title: n.title || "",
        body: n.body || "",
        coverUrl: n.coverUrl || "",
        coverPublicId: n.coverPublicId || "",
        published: Boolean(n.published),
      });
    });
  }, [id, criando]);

  if (!form) return <p className="text-sm text-texto/60">Carregando...</p>;

  function atualiza(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function trocarCapa(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErro("");
    setOcupado(true);
    try {
      const { url, publicId } = await uploadCover(file);
      setForm((f) => ({ ...f, coverUrl: url, coverPublicId: publicId }));
    } catch (err) {
      setErro(err.message);
    } finally {
      setOcupado(false);
    }
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    if (!form.title.trim() || !form.body.trim()) {
      setErro("Título e texto são obrigatórios.");
      return;
    }
    setOcupado(true);
    try {
      if (criando) {
        await createNews({ authorUid: user.uid, ...form });
      } else {
        await updateNews(id, form, tinhaPublishedAt);
      }
      router.push("/admin/noticias");
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
      setOcupado(false);
    }
  }

  async function excluir() {
    if (!confirm("Excluir esta notícia? Esta ação não pode ser desfeita.")) return;
    setOcupado(true);
    try {
      await deleteNews(id);
      router.push("/admin/noticias");
    } catch {
      setErro("Não foi possível excluir.");
      setOcupado(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold uppercase">
        {criando ? "Nova notícia" : "Editar notícia"}
      </h1>

      <form onSubmit={salvar} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Título</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => atualiza("title", e.target.value)}
            className="rounded-[10px] border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            Texto <span className="text-texto/60">(separe parágrafos com linha em branco)</span>
          </span>
          <textarea
            rows={10}
            value={form.body}
            onChange={(e) => atualiza("body", e.target.value)}
            className="rounded-[10px] border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Capa</span>
          {form.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.coverUrl}
              alt=""
              className="w-full max-w-sm rounded-[10px] border border-linha object-cover"
            />
          ) : (
            <p className="text-sm text-texto/60">Sem capa por enquanto.</p>
          )}
          <input type="file" accept="image/*" onChange={trocarCapa} className="text-sm" />
        </div>

        <label className="mt-2 flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => atualiza("published", e.target.checked)}
            className="h-4 w-4 accent-titulo"
          />
          <span className="text-sm font-medium">Publicada (visível para os fiéis)</span>
        </label>

        {erro && <p className="text-sm font-medium text-vermelho">{erro}</p>}

        <div className="mt-2 flex gap-3">
          <button
            type="submit"
            disabled={ocupado}
            className="rounded-[10px] bg-titulo px-6 py-3 font-titulo font-bold uppercase text-white disabled:opacity-60"
          >
            Salvar
          </button>
          {!criando && (
            <button
              type="button"
              onClick={excluir}
              disabled={ocupado}
              className="rounded-[10px] border border-vermelho px-6 py-3 font-titulo font-bold uppercase text-vermelho disabled:opacity-60"
            >
              Excluir
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
