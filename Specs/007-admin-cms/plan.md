# Plan: 007-admin-cms Área administrativa

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

Grupo `app/admin/` com layout que lê `role` do AuthProvider e redireciona o fiel. Regras Firestore são a barreira real. Upload: Route Handler `app/api/upload/route.js` se houver secret; senão unsigned preset só de `news/` documentado no `.env.example`.

O primeiro admin **não** nasce pela UI. Implementar o mecanismo escolhido em OPEN-QUESTIONS (allowlist no Handler, custom claim, ou doc manual) como task explícita.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `app/admin/layout.jsx` | guard `admin` |
| `app/admin/page.jsx` | índice |
| `app/admin/noticias/page.jsx` | lista + criar |
| `app/admin/noticias/[id]/page.jsx` | editar |
| `app/admin/cronograma/page.jsx` | lista/filtro por data |
| `app/admin/destaques/page.jsx` | `siteContent` |
| `app/admin/leads/page.jsx` | leads + status |
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
| `benefactorLeads` | só admin | create fiel; update status admin |
| `users` | próprio; admin pode ler | próprio sem `role`; admin não precisa editar outros nesta v1 |

## Cloudinary

Pastas `news/` e `site/`. Public ID estável por notícia.

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

## Fora deste plan

Analytics, gestão de papéis em massa, editor rico.
