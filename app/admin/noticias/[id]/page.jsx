"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
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
import {
  CabecalhoMesa,
  classeBotaoPerigo,
  classeBotaoPrimario,
  classeBotaoSecundario,
} from "@/components/admin/CabecalhoMesa";

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

function ZonaArquivo({ rotulo, vazio, url, classeImagem, enviando, onArquivo }) {
  function soltar(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) onArquivo(file);
  }

  return (
    <div>
      <span className="text-sm font-medium">{rotulo}</span>
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={soltar}
        className="mt-1 flex cursor-pointer flex-col gap-2 border border-dashed border-linha bg-fundo p-3 transition-colors duration-150 hover:bg-creme motion-reduce:transition-none"
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className={classeImagem} />
        ) : (
          <p className="text-sm text-texto/60">{vazio}</p>
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            onArquivo(file);
          }}
        />
        {enviando && <p className="text-sm text-texto/60">Enviando...</p>}
      </label>
    </div>
  );
}

export default function AdminNoticiaEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const criando = id === "nova";

  const [form, setForm] = useState(criando ? VAZIA : null);
  const [tinhaPublishedAt, setTinhaPublishedAt] = useState(false);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [envio, setEnvio] = useState("");
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

  async function enviarArquivo(file, folder, urlCampo, idCampo, marca) {
    if (!file) return;
    setErro("");
    setEnvio(marca);
    try {
      const { url, publicId } = await uploadMedia(file, { folder, resource: "image" });
      setForm((f) => ({ ...f, [urlCampo]: url, [idCampo]: publicId }));
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnvio("");
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
    <div className="max-w-6xl">
      <Link href="/admin/noticias" className="text-sm font-semibold text-titulo underline">
        Notícias
      </Link>
      <div className="mt-3">
        <CabecalhoMesa
          titulo={criando ? "Nova notícia" : "Editar notícia"}
          frase="Escreva na folha. Autor, capa e publicação ficam na coluna ao lado."
        />
      </div>

      <form onSubmit={salvar} className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 rounded-[14px] border border-linha bg-superficie">
          <label className="block">
            <span className="sr-only">Título</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => atualiza("title", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              placeholder="Título da notícia"
              className="w-full bg-transparent px-6 pt-8 font-titulo text-3xl font-bold uppercase leading-tight text-titulo outline-none placeholder:text-titulo/30 sm:px-8"
            />
          </label>
          <div className="mt-4">
            <EditorNoticia
              key={String(id)}
              inicial={form.body}
              onChange={(html) => atualiza("body", html)}
            />
          </div>
        </div>

        <aside className="flex flex-col gap-5 rounded-[14px] border border-linha bg-superficie p-5 xl:sticky xl:top-4">
          <div>
            <p className="font-titulo text-sm font-bold uppercase text-titulo">Quem escreveu</p>
            <label className="mt-3 flex flex-col gap-1">
              <span className="text-sm font-medium">Nome</span>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => atualiza("authorName", e.target.value)}
                className="rounded-[10px] border border-linha bg-superficie px-3 py-2 outline-none focus:border-titulo"
              />
            </label>
            <div className="mt-3">
              <ZonaArquivo
                rotulo="Foto"
                vazio="Solte a foto ou clique para escolher."
                url={form.authorPhotoUrl}
                classeImagem="h-14 w-14 border border-linha object-cover"
                enviando={envio === "autor"}
                onArquivo={(file) =>
                  enviarArquivo(file, "authors", "authorPhotoUrl", "authorPhotoPublicId", "autor")
                }
              />
            </div>
          </div>

          <ZonaArquivo
            rotulo="Capa"
            vazio="Solte a capa ou clique para escolher."
            url={form.coverUrl}
            classeImagem="aspect-[16/9] w-full border border-linha object-cover"
            enviando={envio === "capa"}
            onArquivo={(file) => enviarArquivo(file, "news", "coverUrl", "coverPublicId", "capa")}
          />

          <label className="flex items-start gap-3 border border-linha bg-fundo px-3 py-3">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => atualiza("published", e.target.checked)}
              className="mt-1 h-4 w-4 accent-titulo"
            />
            <span>
              <span className="block text-sm font-medium">Publicada</span>
              <span className="block text-sm text-texto/60">Visível para os fiéis no app.</span>
            </span>
          </label>

          {erro && <p className="text-sm font-medium text-vermelho">{erro}</p>}

          <div className="flex flex-col gap-2">
            <button type="submit" disabled={ocupado} className={classeBotaoPrimario}>
              Salvar
            </button>
            <button type="button" onClick={() => setPrevia(true)} className={classeBotaoSecundario}>
              Pré-visualizar
            </button>
            {!criando && (
              <button type="button" onClick={excluir} disabled={ocupado} className={classeBotaoPerigo}>
                Excluir
              </button>
            )}
          </div>
        </aside>
      </form>

      {previa && <PreviaNoticia noticia={form} onFechar={() => setPrevia(false)} />}
    </div>
  );
}
