"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  createNews,
  deleteNews,
  getNewsById,
  updateNews,
} from "@/lib/admin/news";
import { uploadMedia } from "@/lib/admin/upload";
import { artigoTemConteudo, corpoParaEditor, sanitizaArtigo } from "@/lib/news/html";
import { PreviaNoticia } from "@/components/admin/PreviaNoticia";

const EditorNoticia = dynamic(() => import("@/components/admin/EditorNoticia"), { ssr: false });

const VAZIA = {
  title: "",
  body: "<p></p>",
  coverUrl: "",
  coverPublicId: "",
  authorName: "",
  authorPhotoUrl: "",
  authorPhotoPublicId: "",
  published: false,
};

export default function AdminNoticiaEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const criando = id === "nova";

  const [form, setForm] = useState(criando ? VAZIA : null);
  const [tinhaPublishedAt, setTinhaPublishedAt] = useState(false);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [previa, setPrevia] = useState(false);

  useEffect(() => {
    if (criando) {
      setForm(VAZIA);
      setTinhaPublishedAt(false);
      return;
    }
    setForm(null);
    getNewsById(id).then((n) => {
      if (!n) {
        setErro("Notícia não encontrada.");
        setForm(VAZIA);
        return;
      }
      setTinhaPublishedAt(Boolean(n.publishedAt));
      setForm({
        title: n.title || "",
        body: corpoParaEditor(n.body),
        coverUrl: n.coverUrl || "",
        coverPublicId: n.coverPublicId || "",
        authorName: n.authorName || "",
        authorPhotoUrl: n.authorPhotoUrl || "",
        authorPhotoPublicId: n.authorPhotoPublicId || "",
        published: Boolean(n.published),
      });
    });
  }, [id, criando]);

  if (!form) return <p className="text-sm text-texto/60">Carregando...</p>;

  function atualiza(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function enviarArquivo(file, folder, urlCampo, idCampo) {
    if (!file) return;
    setErro("");
    setOcupado(true);
    try {
      const { url, publicId } = await uploadMedia(file, { folder, resource: "image" });
      setForm((f) => ({ ...f, [urlCampo]: url, [idCampo]: publicId }));
    } catch (err) {
      setErro(err.message);
    } finally {
      setOcupado(false);
    }
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    const body = sanitizaArtigo(form.body);
    if (!form.title.trim() || !artigoTemConteudo(body)) {
      setErro("Título e texto são obrigatórios.");
      return;
    }
    setOcupado(true);
    const dados = { ...form, body };
    try {
      if (criando) {
        await createNews({ authorUid: user.uid, ...dados });
      } else {
        await updateNews(id, dados, tinhaPublishedAt);
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
    <div className="max-w-4xl">
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
            className="border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Quem escreveu</span>
            <input
              type="text"
              value={form.authorName}
              onChange={(e) => atualiza("authorName", e.target.value)}
              className="border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
            />
          </label>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Foto de quem escreveu</span>
            <div className="flex items-center gap-3">
              {form.authorPhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.authorPhotoUrl} alt="" className="h-12 w-12 border border-linha object-cover" />
              ) : (
                <p className="text-sm text-texto/60">Sem foto.</p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  enviarArquivo(
                    e.target.files?.[0],
                    "authors",
                    "authorPhotoUrl",
                    "authorPhotoPublicId"
                  )
                }
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Texto</span>
          <EditorNoticia
            key={String(id)}
            inicial={form.body}
            onChange={(html) => atualiza("body", html)}
          />
          <p className="text-sm text-texto/60">
            Tab recua o parágrafo ou a lista. Shift+Tab volta. Negrito, itálico e sublinhado também saem com Ctrl+B, Ctrl+I e Ctrl+U.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Capa</span>
          {form.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.coverUrl}
              alt=""
              className="w-full max-w-sm border border-linha object-cover"
            />
          ) : (
            <p className="text-sm text-texto/60">Sem capa por enquanto.</p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              enviarArquivo(e.target.files?.[0], "news", "coverUrl", "coverPublicId")
            }
            className="text-sm"
          />
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

        <div className="mt-2 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={ocupado}
            className="bg-titulo px-6 py-3 font-titulo font-bold uppercase text-white disabled:opacity-60"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => setPrevia(true)}
            className="border border-titulo px-6 py-3 font-titulo font-bold uppercase text-titulo"
          >
            Pré-visualizar
          </button>
          {!criando && (
            <button
              type="button"
              onClick={excluir}
              disabled={ocupado}
              className="border border-vermelho px-6 py-3 font-titulo font-bold uppercase text-vermelho disabled:opacity-60"
            >
              Excluir
            </button>
          )}
        </div>
      </form>

      {previa && <PreviaNoticia noticia={form} onFechar={() => setPrevia(false)} />}
    </div>
  );
}
