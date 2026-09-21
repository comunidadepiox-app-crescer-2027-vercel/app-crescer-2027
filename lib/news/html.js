import DOMPurify from "isomorphic-dompurify";

const TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "span",
  "video",
];

let gancho = false;

function prepara() {
  if (gancho) return;
  gancho = true;
  DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
    if (data.attrName === "style") {
      const partes = String(data.attrValue || "")
        .split(";")
        .map((s) => s.trim())
        .filter((s) =>
          /^(color\s*:\s*#[0-9a-f]{3,8}|text-align\s*:\s*(left|center|right|justify))$/i.test(s)
        );
      data.attrValue = partes.join("; ");
      if (!data.attrValue) data.keepAttr = false;
    }
    if (data.attrName === "class" && data.attrValue !== "artigo-botao") {
      data.keepAttr = false;
    }
  });
}

export function corpoEhHtml(body) {
  return /<\/?[a-z][^>]*>/i.test(String(body || ""));
}

export function sanitizaArtigo(html) {
  prepara();
  return DOMPurify.sanitize(String(html || ""), {
    ALLOWED_TAGS: TAGS,
    ALLOWED_ATTR: ["href", "src", "alt", "controls", "style", "class", "target", "rel", "data-indent"],
  });
}

export function artigoTemConteudo(html) {
  const limpo = sanitizaArtigo(html);
  if (/<(img|video|a)\b/i.test(limpo)) return true;
  return limpo.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim().length > 0;
}

function escapa(texto) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function corpoParaEditor(body) {
  const texto = String(body || "");
  if (!texto.trim()) return "<p></p>";
  if (corpoEhHtml(texto)) return texto;
  return texto
    .split(/\n{2,}|\r\n\r\n/)
    .filter((p) => p.trim())
    .map((p) => `<p>${escapa(p.trim()).replace(/\n/g, "<br>")}</p>`)
    .join("");
}
