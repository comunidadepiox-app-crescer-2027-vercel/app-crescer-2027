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
  - Verifica: item publicado aparece no app nativo.
  - Fora: cronograma.

- [x] **T4 — Upload Cloudinary**
  - Faz: capa via Handler ou preset; grava `coverUrl` e `coverPublicId`.
  - Verifica: secret não vai ao client; imagem renderiza no detalhe.
  - Fora: galeria completa.

- [x] **T5 — CRUD programação**
  - Faz: criar/editar/remover `programItems`. Lista sem índice composto (lê a coleção e filtra o dia no client). Dias do encontro nas abas (5–9/02/2027).
  - Verifica: item do dia aparece na agenda e na Home do app; erro de lista não some como vazio.
  - Fora: import site.

- [x] **T6 — Destaques e leads**
  - Faz: `siteContent` + lista de leads com mudança de status.
  - Verifica: fiel não abre `/admin/leads` com dados; a Home do app lê destaque se existir.
  - Fora: export CSV.

- [x] **T7 — Login da mesa**
  - Faz: sem sessão, `/admin` mostra e-mail/senha com `crescer-admin@crescer.app` preenchido; fiel vê recusa; admin vê a mesa. Sem Google e sem cadastro nesta tela.
  - Verifica: conta sem `role: admin` não entra no CMS; sair volta ao formulário.
  - Fora: promoção automática.

- [x] **T8 — Mesa lateral**
  - Faz: barra com Início, Notícias e Cronograma. Destaques e Benfeitores saem do menu e da mesa.
  - Verifica: as três entradas navegam; as duas retiradas não aparecem.
  - Fora: apagar as páginas de destaques e leads.

- [x] **T9 — Editor e prévia**
  - Faz: TipTap com recuo, mídia, botão, autor e pré-visualização do rascunho sem gravar.
  - Verifica: Tab não tira o foco; prévia não publica.
  - Fora: biblioteca de mídia.

- [x] **T10 — Aviso da programação**
  - Faz: ao salvar mudança publicada do dia do recorte, a mesa chama o envio do push.
  - Verifica: rascunho de outro dia não chama a rota.
  - Fora: lembrete de cada horário.

- [ ] **T11 — Editor de escrita**
  - Faz: barra agrupada por ícones, menu na seleção, menu no parágrafo vazio, botões de recuo, placeholder e colar ou soltar imagem. A edição fica em folha mais coluna de autor, capa e publicação.
  - Verifica: Tab não tira o foco; a seleção abre formato; parágrafo vazio oferece imagem, vídeo, botão e título; colar imagem entra no texto; prévia não publica.
  - Fora: tabela, destaque, código e biblioteca de mídia.

- [ ] **T12 — Casca da mesa**
  - Faz: barra roxa com item ativo em dourado, cabeçalho comum, início com estado real de notícias e cronograma, e lista de notícias com capa.
  - Verifica: as três entradas navegam; o início não mostra número hero nem gráfico; falha de leitura esconde a linha de estado e mantém a faixa.
  - Fora: métricas inventadas e as rotas de destaques e leads.

## Validação final

- [ ] Aceite de `spec.md`
- [ ] Sem métricas fictícias
- [ ] LGPD dos leads respeitado
- [ ] Docs atualizados
