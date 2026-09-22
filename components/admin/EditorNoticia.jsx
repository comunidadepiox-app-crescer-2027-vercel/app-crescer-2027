"use client";

import { useEffect, useRef, useState } from "react";
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { BotaoArtigo, Recuo, VideoArtigo } from "@/components/admin/extensoes";
import { IconeMesa } from "@/components/admin/iconesMesa";
import { uploadMedia } from "@/lib/admin/upload";

const CORES = [
  { nome: "Texto", valor: "#111c2d" },
  { nome: "Roxo", valor: "#310073" },
  { nome: "Laranja", valor: "#d68130" },
  { nome: "Verde", valor: "#00a584" },
];

const TIPPY = {
  duration: 0,
  animation: false,
  arrow: false,
  maxWidth: "none",
  appendTo: () => document.body,
};

function arquivoImagem(data) {
  if (!data) return null;
  const solto = Array.from(data.files || []).find((file) => file.type.startsWith("image/"));
  if (solto) return solto;
  const item = Array.from(data.items || []).find(
    (entry) => entry.kind === "file" && entry.type.startsWith("image/")
  );
  return item?.getAsFile() || null;
}

function BotaoIcone({ ativo, rotulo, onClick, children, disabled, pressionavel = true }) {
  return (
    <button
      type="button"
      title={rotulo}
      aria-label={rotulo}
      aria-pressed={pressionavel ? Boolean(ativo) : undefined}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`grid h-9 min-w-9 shrink-0 place-items-center px-1.5 transition-colors duration-150 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-titulo disabled:opacity-40 ${
        ativo ? "bg-creme text-titulo" : "text-texto/80 hover:bg-creme"
      }`}
    >
      {children}
    </button>
  );
}

function Letra({ children, className = "" }) {
  return <span className={`font-titulo text-sm font-bold leading-none ${className}`}>{children}</span>;
}

function Divisor() {
  return <span className="mx-1 h-6 w-px shrink-0 bg-linha" aria-hidden="true" />;
}

export default function EditorNoticia({ inicial, onChange }) {
  const imagemRef = useRef(null);
  const videoRef = useRef(null);
  const linkRef = useRef(null);
  const rotuloRef = useRef(null);
  const editorRef = useRef(null);
  const inserirRef = useRef(async () => {});
  const [painel, setPainel] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [botaoRotulo, setBotaoRotulo] = useState("");
  const [botaoUrl, setBotaoUrl] = useState("");
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  inserirRef.current = async (file, pos) => {
    const ed = editorRef.current;
    if (!file || !ed) return;
    setErro("");
    setOcupado(true);
    try {
      const { url } = await uploadMedia(file, { folder: "news", resource: "image" });
      const imagem = { type: "image", attrs: { src: url } };
      if (typeof pos === "number") ed.chain().focus().insertContentAt(pos, imagem).run();
      else ed.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      setErro(err.message || "Não foi possível inserir a imagem.");
    } finally {
      setOcupado(false);
    }
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        horizontalRule: false,
        codeBlock: false,
        code: false,
        strike: false,
      }),
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
      Placeholder.configure({ placeholder: "Escreva a notícia..." }),
      Recuo,
      VideoArtigo,
      BotaoArtigo,
    ],
    content: inicial,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class: "artigo editor-folha min-h-[28rem] px-6 py-6 outline-none sm:px-8",
      },
      handlePaste(_view, event) {
        const file = arquivoImagem(event.clipboardData);
        if (!file) return false;
        event.preventDefault();
        inserirRef.current(file, null);
        return true;
      },
      handleDrop(view, event, _slice, moved) {
        if (moved) return false;
        const file = arquivoImagem(event.dataTransfer);
        if (!file) return false;
        event.preventDefault();
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        inserirRef.current(file, coords?.pos ?? null);
        return true;
      },
      handleDOMEvents: {
        dragover(_view, event) {
          const tipos = Array.from(event.dataTransfer?.types || []);
          if (tipos.includes("Files")) event.preventDefault();
        },
      },
    },
  });

  editorRef.current = editor;

  useEffect(() => {
    if (painel === "link") linkRef.current?.focus();
    if (painel === "botao") rotuloRef.current?.focus();
  }, [painel]);

  if (!editor) {
    return <p className="px-6 py-6 text-sm text-texto/60">Carregando o editor...</p>;
  }

  function urlOk(valor) {
    try {
      const u = new URL(valor);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  function abrirLink() {
    setLinkUrl(editor.getAttributes("link").href || "");
    setPainel((atual) => (atual === "link" ? null : "link"));
    setErro("");
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

  async function enviarVideo(file) {
    if (!file) return;
    setErro("");
    setOcupado(true);
    try {
      const { url } = await uploadMedia(file, { folder: "news", resource: "video" });
      editor.chain().focus().setVideo(url).run();
    } catch (err) {
      setErro(err.message || "Não foi possível enviar o vídeo.");
    } finally {
      setOcupado(false);
    }
  }

  function escolherImagem() {
    imagemRef.current?.click();
  }

  const menuFlutuante = (
    <>
      <BotaoIcone rotulo="Imagem" pressionavel={false} disabled={ocupado} onClick={escolherImagem}>
        <IconeMesa nome="imagem" />
      </BotaoIcone>
      <BotaoIcone
        rotulo="Vídeo"
        pressionavel={false}
        disabled={ocupado}
        onClick={() => videoRef.current?.click()}
      >
        <IconeMesa nome="video" />
      </BotaoIcone>
      <BotaoIcone
        rotulo="Botão"
        ativo={painel === "botao"}
        onClick={() => {
          setPainel((atual) => (atual === "botao" ? null : "botao"));
          setErro("");
        }}
      >
        <IconeMesa nome="botao" />
      </BotaoIcone>
      <BotaoIcone
        rotulo="Título"
        ativo={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Letra>H2</Letra>
      </BotaoIcone>
    </>
  );

  return (
    <div>
      <BubbleMenu editor={editor} updateDelay={0} tippyOptions={{ ...TIPPY, placement: "top" }} className="flex border border-linha bg-superficie">
        <BotaoIcone rotulo="Negrito" ativo={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Letra>B</Letra>
        </BotaoIcone>
        <BotaoIcone rotulo="Itálico" ativo={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Letra className="italic">I</Letra>
        </BotaoIcone>
        <BotaoIcone rotulo="Sublinhado" ativo={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <Letra className="underline">U</Letra>
        </BotaoIcone>
        <BotaoIcone rotulo="Link" ativo={editor.isActive("link") || painel === "link"} onClick={abrirLink}>
          <IconeMesa nome="link" />
        </BotaoIcone>
        {CORES.map((cor) => (
          <button
            key={cor.valor}
            type="button"
            title={cor.nome}
            aria-label={cor.nome}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setColor(cor.valor).run()}
            className="m-1.5 h-5 w-5 border border-linha"
            style={{ backgroundColor: cor.valor }}
          />
        ))}
      </BubbleMenu>

      <FloatingMenu
        editor={editor}
        tippyOptions={{ ...TIPPY, placement: "bottom-start" }}
        className="flex border border-linha bg-superficie"
        shouldShow={({ state, view, editor: ed }) => {
          if (!ed.isEditable || !view.hasFocus()) return false;
          const { selection } = state;
          const { $anchor, empty } = selection;
          return (
            empty &&
            $anchor.depth === 1 &&
            $anchor.parent.type.name === "paragraph" &&
            $anchor.parent.content.size === 0
          );
        }}
      >
        {menuFlutuante}
      </FloatingMenu>

      <div className="sticky top-0 z-20 border-y border-linha bg-superficie">
        <div className="flex flex-nowrap items-center gap-0.5 overflow-x-auto px-2 py-1.5">
          <BotaoIcone rotulo="Negrito" ativo={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Letra>B</Letra>
          </BotaoIcone>
          <BotaoIcone rotulo="Itálico" ativo={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Letra className="italic">I</Letra>
          </BotaoIcone>
          <BotaoIcone rotulo="Sublinhado" ativo={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <Letra className="underline">U</Letra>
          </BotaoIcone>
          <Divisor />
          <BotaoIcone rotulo="Título" ativo={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Letra>H2</Letra>
          </BotaoIcone>
          <BotaoIcone rotulo="Subtítulo" ativo={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Letra>H3</Letra>
          </BotaoIcone>
          <BotaoIcone rotulo="Citação" ativo={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Letra>"</Letra>
          </BotaoIcone>
          <BotaoIcone rotulo="Lista" ativo={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <IconeMesa nome="lista" />
          </BotaoIcone>
          <BotaoIcone rotulo="Numerada" ativo={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <IconeMesa nome="numerada" />
          </BotaoIcone>
          <Divisor />
          <BotaoIcone rotulo="Esquerda" ativo={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
            <IconeMesa nome="esquerda" />
          </BotaoIcone>
          <BotaoIcone rotulo="Centro" ativo={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
            <IconeMesa nome="centro" />
          </BotaoIcone>
          <BotaoIcone rotulo="Direita" ativo={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
            <IconeMesa nome="direita" />
          </BotaoIcone>
          <Divisor />
          <BotaoIcone rotulo="Aumentar recuo" pressionavel={false} onClick={() => editor.chain().focus().aumentarRecuo().run()}>
            <IconeMesa nome="recuoMais" />
          </BotaoIcone>
          <BotaoIcone rotulo="Diminuir recuo" pressionavel={false} onClick={() => editor.chain().focus().diminuirRecuo().run()}>
            <IconeMesa nome="recuoMenos" />
          </BotaoIcone>
          <Divisor />
          <BotaoIcone
            rotulo="Cor"
            ativo={painel === "cor"}
            onClick={() => {
              setPainel((atual) => (atual === "cor" ? null : "cor"));
              setErro("");
            }}
          >
            <span className="flex flex-col items-center leading-none">
              <Letra>A</Letra>
              <span className="mt-0.5 h-0.5 w-3.5" style={{ backgroundColor: editor.getAttributes("textStyle").color || "#111c2d" }} />
            </span>
          </BotaoIcone>
          <Divisor />
          <BotaoIcone rotulo="Link" ativo={editor.isActive("link") || painel === "link"} onClick={abrirLink}>
            <IconeMesa nome="link" />
          </BotaoIcone>
          <BotaoIcone rotulo="Imagem" pressionavel={false} disabled={ocupado} onClick={escolherImagem}>
            <IconeMesa nome="imagem" />
          </BotaoIcone>
          <BotaoIcone rotulo="Vídeo" pressionavel={false} disabled={ocupado} onClick={() => videoRef.current?.click()}>
            <IconeMesa nome="video" />
          </BotaoIcone>
          <BotaoIcone
            rotulo="Botão"
            ativo={painel === "botao"}
            onClick={() => {
              setPainel((atual) => (atual === "botao" ? null : "botao"));
              setErro("");
            }}
          >
            <IconeMesa nome="botao" />
          </BotaoIcone>
          <Divisor />
          <BotaoIcone rotulo="Desfazer" pressionavel={false} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <IconeMesa nome="desfazer" />
          </BotaoIcone>
          <BotaoIcone rotulo="Refazer" pressionavel={false} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <IconeMesa nome="refazer" />
          </BotaoIcone>
        </div>

        {painel === "cor" && (
          <div className="absolute left-3 top-full z-30 mt-1 flex items-center gap-2 border border-linha bg-superficie p-2">
            {CORES.map((cor) => (
              <button
                key={cor.valor}
                type="button"
                title={cor.nome}
                aria-label={cor.nome}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.chain().focus().setColor(cor.valor).run();
                  setPainel(null);
                }}
                className="h-7 w-7 border border-linha"
                style={{ backgroundColor: cor.valor }}
              />
            ))}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setPainel(null);
              }}
              className="px-2 py-1 text-sm font-medium text-texto/70"
            >
              Padrão
            </button>
          </div>
        )}

        {painel === "link" && (
          <div className="absolute left-3 top-full z-30 mt-1 w-[min(22rem,calc(100%-1.5rem))] border border-linha bg-superficie p-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Link do trecho selecionado</span>
              <input
                ref={linkRef}
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    aplicarLink();
                  }
                }}
                placeholder="https://"
                className="border border-linha px-3 py-2 outline-none focus:border-titulo"
              />
            </label>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={aplicarLink} className="bg-titulo px-4 py-2 font-titulo text-sm font-bold uppercase text-white">
                Aplicar
              </button>
              <button type="button" onClick={() => setPainel(null)} className="px-3 py-2 text-sm font-medium text-texto/70">
                Fechar
              </button>
            </div>
          </div>
        )}

        {painel === "botao" && (
          <div className="absolute left-3 top-full z-30 mt-1 w-[min(24rem,calc(100%-1.5rem))] border border-linha bg-superficie p-3">
            <div className="flex flex-col gap-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Rótulo</span>
                <input
                  ref={rotuloRef}
                  type="text"
                  value={botaoRotulo}
                  onChange={(e) => setBotaoRotulo(e.target.value)}
                  className="border border-linha px-3 py-2 outline-none focus:border-titulo"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Link do botão</span>
                <input
                  type="url"
                  value={botaoUrl}
                  onChange={(e) => setBotaoUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      aplicarBotao();
                    }
                  }}
                  placeholder="https://"
                  className="border border-linha px-3 py-2 outline-none focus:border-titulo"
                />
              </label>
            </div>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={aplicarBotao} className="bg-titulo px-4 py-2 font-titulo text-sm font-bold uppercase text-white">
                Inserir
              </button>
              <button type="button" onClick={() => setPainel(null)} className="px-3 py-2 text-sm font-medium text-texto/70">
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>

      <input
        ref={imagemRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) inserirRef.current(file, null);
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
          enviarVideo(file);
        }}
      />

      <EditorContent editor={editor} />
      <p className="border-t border-linha px-6 py-3 text-sm text-texto/60 sm:px-8">
        Tab recua o parágrafo. Shift+Tab volta. Cole ou solte uma imagem no texto. Negrito, itálico e sublinhado também saem com Ctrl+B, Ctrl+I e Ctrl+U.
      </p>
      {ocupado && <p className="px-6 pb-3 text-sm text-texto/60 sm:px-8">Enviando arquivo...</p>}
      {erro && <p className="px-6 pb-3 text-sm font-medium text-vermelho sm:px-8">{erro}</p>}
    </div>
  );
}
