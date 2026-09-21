export function corpoEhHtml(body) {
  return /<\/?[a-z][^>]*>/i.test(String(body || ""));
}

function semScript(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

export function htmlDoArtigo(body) {
  const conteudo = semScript(body);
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { margin: 0; color: #111c2d; font-family: sans-serif; font-size: 16px; line-height: 1.5; }
  p, ul, ol, blockquote, h2, h3 { margin: 0.8rem 0; }
  h2 { font-size: 1.35rem; text-transform: uppercase; color: #310073; }
  h3 { font-size: 1.15rem; color: #310073; }
  ul { padding-left: 1.25rem; }
  ol { padding-left: 1.25rem; }
  a { color: #d68130; }
  img, video { display: block; width: 100%; height: auto; margin: 1rem 0; }
  a.artigo-botao {
    display: inline-block; margin: 0.8rem 0; background: #310073; color: #fff;
    padding: 0.7rem 1.1rem; text-decoration: none; text-transform: uppercase; font-weight: 700;
  }
  blockquote { border-left: 3px solid #d68130; padding-left: 1rem; }
  [data-indent="1"] { margin-left: 1.5rem; }
  [data-indent="2"] { margin-left: 3rem; }
  [data-indent="3"] { margin-left: 4.5rem; }
  [data-indent="4"] { margin-left: 6rem; }
  [data-indent="5"] { margin-left: 7.5rem; }
  [data-indent="6"] { margin-left: 9rem; }
</style>
</head>
<body>${conteudo}</body>
</html>`;
}
