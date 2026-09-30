# Plan: 007-admin-cms Área administrativa

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

Grupo `app/admin/` com layout que lê `role` do AuthProvider. Sem sessão, o layout mostra login e-mail/senha (e-mail pré-preenchido `crescer-admin@crescer.app`); fiel autenticado vê recusa; só `role == admin` vê a mesa, com barra lateral. Regras Firestore são a barreira real. Upload: Route Handler `app/api/upload/route.js` assina imagem ou vídeo nas pastas `news/` e `authors/`.

O primeiro admin **não** nasce pela UI. Implementar o mecanismo escolhido em OPEN-QUESTIONS (allowlist no Handler, custom claim, ou doc manual) como task explícita.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `app/admin/layout.jsx` | guard `admin`; barra lateral; login se sem sessão |
| `components/admin/LoginAdmin.jsx` | formulário e recusa |
| `lib/admin/login.js` | e-mail pré-preenchido `crescer-admin@crescer.app` |
| `components/admin/EditorNoticia.jsx` | editor TipTap: barra agrupada, menu na seleção, menu no parágrafo vazio, colar ou soltar imagem |
| `components/admin/CabecalhoMesa.jsx` | título, frase e ação das abas |
| `components/admin/iconesMesa.jsx` | ícones de linha da barra e do editor |
| `components/noticias/Artigo.jsx` | corpo sanitizado, usado na prévia da mesa |
| `app/api/notify-programa/route.js` | push da programação do dia |
| `app/admin/page.jsx` | índice |
| `app/admin/noticias/page.jsx` | lista + criar |
| `app/admin/noticias/[id]/page.jsx` | editar |
| `app/admin/cronograma/page.jsx` | lista/filtro por data |
| `app/admin/destaques/page.jsx` | `siteContent` |
| `app/admin/leads/page.jsx` | leads + status |
| `app/admin/doacao/page.jsx` | percentual da oferta (spec 014) |
| `lib/admin/doacao.js` | leitura e gravação de `siteContent/doacao` |
| `app/api/upload/route.js` | assinatura Cloudinary (se secret) |
| `lib/admin/news.js` | writes |
| `lib/admin/program.js` | writes |
| `firestore.rules` | writes admin |

Como o client em JSX não deve confiar só no campo `users.role` (o fiel poderia tentar mentir), a regra precisa de Custom Claim `admin: true` **ou** de um lookup que o client não consiga forjar. Plan padrão: **Custom Claim** `admin` emitida fora da UI; o doc `users.role` espelha a claim para a interface. Até a claim existir, allowlist de e-mail numa env `ADMIN_EMAILS` só em Route Handlers, nunca no client.

## Firestore

| Coleção | Leitura | Escrita |
|---|---|---|
| `news` | fiel: publicados; admin: todos | só admin |
| `programItems` | fiel: publicados; admin: todos | só admin |
| `siteContent` | autenticado | só admin |
| `benefactorLeads` | admin: todos; fiel: próprio uid | create fiel; update status admin |
| `users` | próprio; admin pode ler | próprio sem `role`; admin não precisa editar outros nesta v1 |

## Cloudinary

Pastas `news/` e `authors/`. Imagem ou vídeo, conforme o campo do formulário.

## Ordem de entrega

1. Decidir e documentar promoção do admin.
2. Guard de rota + rules de write.
3. CRUD notícias + upload.
4. CRUD programação.
5. Destaques.
6. Leads e status.

## Riscos

| Risco | Mitigação |
|---|---|
| `role` só no documento, forjável | claim ou allowlist server-side |
| Secret Cloudinary no client | Route Handler |
| Admin único perde acesso | pelo menos dois e-mails na allowlist quando existir |

## Mesa e editor (revisão visual)

A barra lateral usa o roxo institucional e o padrão poligonal. O início lê `news` e `programItems` só para uma linha de estado em cada faixa. Notícias e cronograma ocupam a faixa larga, uma abaixo da outra. Sem gráfico e sem número hero.

O editor acrescenta `@tiptap/extension-placeholder`. `BubbleMenu` e `FloatingMenu` vêm de `@tiptap/react`. O HTML gravado continua o de `lib/news/html.js`.

## Fora deste plan

Analytics, gestão de papéis em massa, tabela e destaque no editor. Destaques e leads saem do menu.
