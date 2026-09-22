# Tasks: 009-anuncios Anúncios na Home

## Checklist

- [x] **T1 — Rules e índice**
  - Faz: `announcements` com leitura do ativo e escrita admin; índice `active` + `createdAt`.
  - Verifica: fiel não lê inativo.
  - Fora: tela.

- [x] **T2 — Mesa**
  - Faz: `/admin/anuncios` com upload, link, ativo, lista e prévia vertical.
  - Verifica: salvar sem imagem falha na tela; item aparece na lista.
  - Fora: app.

- [x] **T3 — Pilha no app**
  - Faz: Home mostra os ativos em toda entrada no app, mais novo na frente, X revela o de trás, toque abre o link.
  - Verifica: voltar do segundo plano mostra de novo; trocar de aba não mostra; inativo fica de fora.
  - Fora: Home do site.

## Validação final

- [ ] Critérios de aceite de `spec.md`
- [ ] Copy sem travessão
- [ ] `spec.md`, `plan.md` e este arquivo refletem o que foi entregue
