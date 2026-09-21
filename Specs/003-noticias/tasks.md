# Tasks: 003-noticias Notícias

## Checklist

- [x] **T1 — Contrato e regras de leitura**
  - Faz: documentar campos; fiel lê só `published == true`.
  - Verifica: rascunho inacessível no client fiel.
  - Fora: formulário admin.

- [x] **T2 — Queries**
  - Faz: `observarNoticiasPublicadas` (sem índice composto) e `getPublishedNewsById`.
  - Verifica: ordem por `publishedAt` desc no client.
  - Fora: UI.

- [x] **T3 — Lista**
  - Faz: `/noticias` com estado vazio.
  - Verifica: cada item navega para o detalhe real.
  - Fora: editor.

- [x] **T4 — Detalhe**
  - Faz: `/noticias/[id]` com capa, título, data, corpo.
  - Verifica: id inválido ou rascunho vira estado “não encontrada”.
  - Fora: comentários.

- [x] **T6 — Corpo rico**
  - Faz: detalhe no site e no app renderiza HTML sanitizado, autor e texto antigo em parágrafos.
  - Verifica: script não aparece; notícia sem tag continua legível.
  - Fora: editor (007).

- [x] **T5 — Home consome a query**
  - Faz: seção de notícias da 002 usa `observarNoticiasPublicadas` com limite 4.
  - Verifica: mesma fonte, sem mock paralelo.
  - Fora: destaques manuais (007).

## Validação final

- [ ] Aceite de `spec.md`
- [ ] Copy sem travessão
- [ ] Docs atualizados
