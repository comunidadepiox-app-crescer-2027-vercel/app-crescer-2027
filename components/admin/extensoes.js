import { Extension, Node, mergeAttributes } from "@tiptap/core";

export const Recuo = Extension.create({
  name: "recuo",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          indent: {
            default: 0,
            parseHTML: (el) => Number(el.getAttribute("data-indent") || 0),
            renderHTML: (attrs) => {
              const nivel = Number(attrs.indent) || 0;
              if (!nivel) return {};
              return { "data-indent": String(nivel) };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      aumentarRecuo:
        () =>
        ({ editor, commands }) => {
          if (editor.isActive("listItem")) return commands.sinkListItem("listItem");
          const tipo = editor.isActive("heading") ? "heading" : "paragraph";
          const atual = Number(editor.getAttributes(tipo).indent) || 0;
          if (atual >= 6) return true;
          return commands.updateAttributes(tipo, { indent: atual + 1 });
        },
      diminuirRecuo:
        () =>
        ({ editor, commands }) => {
          if (editor.isActive("listItem")) return commands.liftListItem("listItem");
          const tipo = editor.isActive("heading") ? "heading" : "paragraph";
          const atual = Number(editor.getAttributes(tipo).indent) || 0;
          if (atual <= 0) return true;
          return commands.updateAttributes(tipo, { indent: atual - 1 });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        this.editor.commands.aumentarRecuo();
        return true;
      },
      "Shift-Tab": () => {
        this.editor.commands.diminuirRecuo();
        return true;
      },
    };
  },
});

export const VideoArtigo = Node.create({
  name: "videoArtigo",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video",
        getAttrs: (el) => ({ src: el.getAttribute("src") }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes(HTMLAttributes, { controls: "true" })];
  },

  addCommands() {
    return {
      setVideo:
        (src) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { src } }),
    };
  },
});

export const BotaoArtigo = Node.create({
  name: "botaoArtigo",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      href: { default: "" },
      label: { default: "Saiba mais" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "a.artigo-botao",
        getAttrs: (el) => ({
          href: el.getAttribute("href"),
          label: el.textContent,
        }),
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "a",
      { class: "artigo-botao", href: node.attrs.href || "#" },
      node.attrs.label || "Saiba mais",
    ];
  },

  addCommands() {
    return {
      setBotao:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
