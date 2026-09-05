# Tasks: 000-fundacao-e-identidade Fundação e identidade

Uma task = uma mudança verificável. Proibido agrupar “implementar a tela inteira”.

## Checklist

- [x] **T1 — Reunir referências visuais**
  - Faz: Copiar PDFs/print para o repo (ex.: `Specs/referencias/`) ou registrar o caminho real.
  - Verifica: Os três materiais do brief estão acessíveis à extração.
  - Fora: Desenhar tela.

- [x] **T2 — Extrair tokens**
  - Faz: Anotar família, pesos, hex e ritmos em [DESIGN.md](../DESIGN.md).
  - Verifica: Nenhum token inventado; Instituto Crescer não aparece.
  - Fora: CSS de produção.

- [x] **T3 — Scaffold Next.js**
  - Faz: App Router, JSX, Tailwind, sem TypeScript.
  - Verifica: `npm run dev` sobe; arquivos `.jsx`.
  - Fora: Rotas de produto.

- [x] **T4 — Fonte e CSS variables**
  - Faz: Ligar a fonte oficial e `--crescer-*` em `globals.css` + `layout.jsx`.
  - Verifica: DevTools mostra a família do site, não Inter/Poppins.
  - Fora: Componentes de nav.

- [x] **T5 — Página técnica de prova**
  - Faz: Título, parágrafo, link e botão usando os tokens.
  - Verifica: Sem travessão, pílula, gradiente ou número hero.
  - Fora: Copy de produto final.

- [x] **T6 — Ambiente de exemplo**
  - Faz: `.env.example` e `.gitignore` para `.env.local`.
  - Verifica: Nenhuma chave secreta no git.
  - Fora: Inicializar Firebase no client.

## Validação final

- [x] Critérios de aceite de `spec.md` passaram
- [x] Nenhuma rota de produto criada nesta spec (a página técnica foi substituída pela tela de início na 001, como previsto)
- [x] `DESIGN.md` deixou de ser só placeholder
- [x] Docs desta pasta batem com o que foi entregue

Nota de validação: os tokens vieram do CSS ao vivo do site oficial (fontes Geometric Slabserif e Outfit baixadas/ligadas, hex das variáveis Bricks). Em 04/09/2026 os PDFs `Site Crescer.pdf` e `Site Ben Feitor da Fé.pdf` chegaram ao repositório, foram renderizados e as cores amostradas por região: a paleta foi corrigida para o roxo profundo `#3a1075` + laranja `#d68130` + dourado `#f8d99b` (o azul-marinho `#1c305b` estava errado). Assets oficiais em `public/brand/`, splash animada e redesign das telas entregues juntos; detalhes em DESIGN.md.
