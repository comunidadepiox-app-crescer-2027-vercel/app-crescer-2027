# Tasks: 003-noticias Notícias

## Checklist

- [x] **T1 — Contrato e regras de leitura**
  - Faz: documentar campos; fiel lê só `published == true`.
  - Verifica: rascunho inacessível no client fiel.
  - Fora: formulário admin.

- [x] **T2 — Queries**
  - Faz: `listPublishedNews` e `getPublishedNewsById`.
  - Verifica: ordem por `publishedAt` desc.
  - Fora: UI.

- [x] **T3 — Lista**
  - Faz: `/noticias` com estado vazio.
  - Verifica: cada item navega para o detalhe real.
  - Fora: editor.

- [x] **T4 — Detalhe**
  - Faz: `/noticias/[id]` com capa, título, data, corpo.
  - Verifica: id inválido ou rascunho vira estado “não encontrada”.
  - Fora: comentários.

- [x] **T5 — Home consome a query**
  - Faz: seção de notícias da 002 usa `listPublishedNews` com limit.
  - Verifica: mesma fonte, sem mock paralelo.
  - Fora: destaques manuais (007).

## Validação final

- [ ] Aceite de `spec.md`
- [ ] Copy sem travessão
- [ ] Docs atualizados
