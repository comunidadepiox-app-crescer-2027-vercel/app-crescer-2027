# Tasks: 007-admin-cms Área administrativa

## Checklist

- [x] **T1 — Promoção do admin**
  - Faz: implementar a decisão de OPEN-QUESTIONS (claim, allowlist ou doc manual) e documentar o procedimento.
  - Verifica: um e-mail de teste vira admin sem o client gravar `role: admin`.
  - Fora: telas de CRUD.

- [x] **T2 — Guard e rules de escrita**
  - Faz: `app/admin/layout.jsx` + rules `isAdmin()`.
  - Verifica: fiel recebe recusa; write de notícia pelo fiel falha.
  - Fora: formulários.

- [x] **T3 — CRUD notícias**
  - Faz: criar, editar, publicar, despublicar.
  - Verifica: item publicado aparece em `/noticias`.
  - Fora: cronograma.

- [x] **T4 — Upload Cloudinary**
  - Faz: capa via Handler ou preset; grava `coverUrl` e `coverPublicId`.
  - Verifica: secret não vai ao client; imagem renderiza no detalhe.
  - Fora: galeria completa.

- [x] **T5 — CRUD programação**
  - Faz: criar/editar/remover `programItems`. Lista sem índice composto (lê a coleção e filtra o dia no client). Dias do encontro nas abas (5–9/02/2027).
  - Verifica: item do dia aparece no cronograma e na Home; erro de lista não some como vazio.
  - Fora: import site.

- [x] **T6 — Destaques e leads**
  - Faz: `siteContent` + lista de leads com mudança de status.
  - Verifica: fiel não abre `/admin/leads` com dados; Home lê destaque se existir.
  - Fora: export CSV.

- [x] **T7 — Login da mesa**
  - Faz: sem sessão, `/admin` mostra e-mail/senha com `admin@crecer.com` preenchido; fiel vê recusa; admin vê a mesa. Sem Google e sem cadastro nesta tela.
  - Verifica: conta sem `role: admin` não entra no CMS; sair volta ao formulário.
  - Fora: promoção automática.

## Validação final

- [ ] Aceite de `spec.md`
- [ ] Sem métricas fictícias
- [ ] LGPD dos leads respeitado
- [ ] Docs atualizados
