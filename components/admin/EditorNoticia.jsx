"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { BotaoArtigo, Recuo, VideoArtigo } from "@/components/admin/extensoes";
import { uploadMedia } from "@/lib/admin/upload";

const CORES = [
  { nome: "Texto", valor: "#111c2d" },
  { nome: "Roxo", valor: "#310073" },
  { nome: "Laranja", valor: "#d68130" },
  { nome: "Verde", valor: "#00a584" },
];

function BotaoFerramenta({ ativo, children, ...props }) {
  return (
    <button
      type="button"
      className={`px-2 py-1 text-sm font-semibold ${
        ativo ? "bg-creme text-titulo" : "text-texto/80"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function EditorNoticia({ inicial, onChange }) {
  const imagemRef = useRef(null);
  const videoRef = useRef(null);
  const [painel, setPainel] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [botaoRotulo, setBotaoRotulo] = useState("");
  const [botaoUrl, setBotaoUrl] = useState("");
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image,
      Recuo,
      VideoArtigo,
      BotaoArtigo,
    ],
    content: inicial,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class: "artigo min-h-[320px] px-4 py-4 outline-none",
      },
    },
  });

  if (!editor) {
    return <p className="text-sm text-texto/60">Carregando o editor...</p>;
  }

  function urlOk(valor) {
    try {
      const u = new URL(valor);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  async function enviar(file, resource, aoPronto) {
    if (!file) return;
    setErro("");
    setOcupado(true);
    try {
      const { url } = await uploadMedia(file, { folder: "news", resource });
      aoPronto(url);
    } catch (err) {
      setErro(err.message);
    } finally {
      setOcupado(false);
    }
  }

  function aplicarLink() {
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().unsetLink().run();
      setPainel(null);
      return;
    }
    if (!urlOk(url)) {
      setErro("O link precisa começar com http:// ou https://.");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setPainel(null);
    setErro("");
  }

  function aplicarBotao() {
    const url = botaoUrl.trim();
    const rotulo = botaoRotulo.trim();
    if (!rotulo || !urlOk(url)) {
      setErro("O botão precisa de um rótulo e de um link http ou https.");
      return;
    }
    editor.chain().focus().setBotao({ href: url, label: rotulo }).run();
    setPainel(null);
    setBotaoRotulo("");
    setBotaoUrl("");
    setErro("");
  }

  return (
    <div className="border border-linha bg-superficie">
      <div className="sticky top-0 z-10 flex flex-wrap gap-1 border-b border-linha bg-superficie px-2 py-2">
        <BotaoFerramenta onClick={() => editor.chain().focus().toggleBold().run()} ativo={editor.isActive("bold")}>
          Negrito
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => editor.chain().focus().toggleItalic().run()} ativo={editor.isActive("italic")}>
          Itálico
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => editor.chain().focus().toggleUnderline().run()} ativo={editor.isActive("underline")}>
          Sublinhado
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} ativo={editor.isActive("heading", { level: 2 })}>
          Título
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} ativo={editor.isActive("heading", { level: 3 })}>
          Subtítulo
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => editor.chain().focus().toggleBulletList().run()} ativo={editor.isActive("bulletList")}>
          Lista
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => editor.chain().focus().toggleOrderedList().run()} ativo={editor.isActive("orderedList")}>
          Numerada
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => editor.chain().focus().toggleBlockquote().run()} ativo={editor.isActive("blockquote")}>
          Citação
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => editor.chain().focus().setTextAlign("left").run()} ativo={editor.isActive({ textAlign: "left" })}>
          Esquerda
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => editor.chain().focus().setTextAlign("center").run()} ativo={editor.isActive({ textAlign: "center" })}>
          Centro
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => editor.chain().focus().setTextAlign("right").run()} ativo={editor.isActive({ textAlign: "right" })}>
          Direita
        </BotaoFerramenta>
        {CORES.map((cor) => (
          <button
            key={cor.valor}
            type="button"
            title={cor.nome}
            onClick={() => editor.chain().focus().setColor(cor.valor).run()}
            className="h-7 w-7 border border-linha"
            style={{ backgroundColor: cor.valor }}
          />
        ))}
        <BotaoFerramenta
          onClick={() => {
            setLinkUrl(editor.getAttributes("link").href || "");
            setPainel(painel === "link" ? null : "link");
            setErro("");
          }}
          ativo={editor.isActive("link") || painel === "link"}
        >
          Link
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => imagemRef.current?.click()} ativo={false}>
          Imagem
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => videoRef.current?.click()} ativo={false}>
          Vídeo
        </BotaoFerramenta>
        <BotaoFerramenta
          onClick={() => {
            setPainel(painel === "botao" ? null : "botao");
            setErro("");
          }}
          ativo={painel === "botao"}
        >
          Botão
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => editor.chain().focus().undo().run()} ativo={false}>
          Desfazer
        </BotaoFerramenta>
        <BotaoFerramenta onClick={() => editor.chain().focus().redo().run()} ativo={false}>
          Refazer
        </BotaoFerramenta>
      </div>

      {painel === "link" && (
        <div className="flex flex-wrap items-end gap-2 border-b border-linha px-3 py-3">
          <label className="flex min-w-[16rem] flex-1 flex-col gap-1">
            <span className="text-sm font-medium">Link do trecho selecionado</span>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://"
              className="border border-linha px-3 py-2 outline-none focus:border-titulo"
            />
          </label>
          <button type="button" onClick={aplicarLink} className="bg-titulo px-4 py-2 text-sm font-semibold uppercase text-white">
            Aplicar
          </button>
        </div>
      )}

      {painel === "botao" && (
        <div className="flex flex-wrap items-end gap-2 border-b border-linha px-3 py-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Rótulo</span>
            <input
              type="text"
              value={botaoRotulo}
              onChange={(e) => setBotaoRotulo(e.target.value)}
              className="border border-linha px-3 py-2 outline-none focus:border-titulo"
            />
          </label>
          <label className="flex min-w-[16rem] flex-1 flex-col gap-1">
            <span className="text-sm font-medium">Link do botão</span>
            <input
              type="url"
              value={botaoUrl}
              onChange={(e) => setBotaoUrl(e.target.value)}
              placeholder="https://"
              className="border border-linha px-3 py-2 outline-none focus:border-titulo"
            />
          </label>
          <button type="button" onClick={aplicarBotao} className="bg-titulo px-4 py-2 text-sm font-semibold uppercase text-white">
            Inserir
          </button>
        </div>
      )}

      <input
        ref={imagemRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          enviar(file, "image", (url) => editor.chain().focus().setImage({ src: url }).run());
        }}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          enviar(file, "video", (url) => editor.chain().focus().setVideo(url).run());
        }}
      />

      <EditorContent editor={editor} />
      {ocupado && <p className="px-4 pb-3 text-sm text-texto/60">Enviando arquivo...</p>}
      {erro && <p className="px-4 pb-3 text-sm font-medium text-vermelho">{erro}</p>}
    </div>
  );
}
