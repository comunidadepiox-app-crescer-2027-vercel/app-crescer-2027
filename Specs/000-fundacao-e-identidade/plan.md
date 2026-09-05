# Plan: 000-fundacao-e-identidade Fundação e identidade

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

Extrair a identidade antes de gerar UI. Só então `create-next-app` (App Router, JS, Tailwind, sem TypeScript). Tokens viram CSS variables no global. Uma rota `/` mínima prova o sistema visual e será substituída pela tela de início na spec 001.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `app/layout.jsx` | Fonte, metadata, CSS global |
| `app/page.jsx` | Placeholder técnico de identidade |
| `app/globals.css` | Variáveis `--crescer-*` e resets |
| `lib/firebase/client.js` | Stub vazio ou comentário; cliente real na spec 001 |
| `.env.example` | Nomes das variáveis públicas |
| `Specs/DESIGN.md` | Tokens extraídos |

## Firestore

Nenhuma coleção nesta spec.

## Cloudinary

Nenhuma pasta nesta spec. Só reservar o nome da variável `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` no `.env.example`.

## Ordem de entrega

1. Colocar referências visuais no repo (ou documentar o caminho) e extrair tokens.
2. Atualizar `DESIGN.md`.
3. Scaffold Next.js + Tailwind em JSX.
4. Aplicar tokens e fonte.
5. Página técnica de prova.
6. `.env.example` e `.gitignore` (`.env.local` fora do git).

## Riscos

| Risco | Mitigação |
|---|---|
| PDFs ainda não estão no workspace | Bloquear a UI até existirem; não chutar paleta |
| Fonte do site sem licença web clara | Self-host só com origem documentada; fallback web-safe registrado |
| `create-next-app` puxar TypeScript | Recusar TS; manter `.jsx` |

## Fora deste plan

Login, nav, Firestore rules, CMS.
