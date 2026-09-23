# Tasks: 009-anuncios Anúncios na Home

A feature saiu do produto. O código da pilha, da mesa e da coleção foi removido. As tasks abaixo registram o que existiu.

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

- [x] **T4 — Retirada**
  - Faz: apagar a pilha na Home, o CRUD da mesa, a pasta de upload, o match das rules e o índice.
  - Verifica: app e mesa não leem `announcements`.
  - Fora: apagar documentos já gravados no Firestore.

## Validação final

- [x] A feature não faz mais parte do produto
- [x] `spec.md`, `plan.md` e este arquivo registram a retirada
