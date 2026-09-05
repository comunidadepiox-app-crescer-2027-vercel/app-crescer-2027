# Tasks: 002-navegacao-e-home Navegação e Home

## Checklist

- [x] **T1 — Edição do evento**
  - Faz: `lib/event/edition.js` com nome, início e fim (timezone Recife).
  - Verifica: constante documentada; OPEN-QUESTIONS continua listando a pendência oficial.
  - Fora: UI.

- [x] **T2 — Rotas-casca**
  - Faz: `/home`, `/galeria`, `/sobre` (e placeholders se 003–006 ainda não tiverem página).
  - Verifica: cada href da nav resolve 200 autenticado.
  - Fora: conteúdo rico.

- [x] **T3 — AppNav**
  - Faz: nav persistente, item ativo sem pílula, labels reais.
  - Verifica: os sete destinos; nenhum botão morto.
  - Fora: CMS.

- [x] **T4 — Home, seção notícias**
  - Faz: lista das últimas publicadas ou estado vazio (“Ainda não há notícias.”).
  - Verifica: card aponta para `/noticias/[id]` só se o id existir.
  - Fora: editor admin.

- [x] **T5 — Home, seção do dia**
  - Faz: recorte pela regra da spec; aviso antes/depois do evento.
  - Verifica: sem número hero; horários alinhados à esquerda.
  - Fora: seletor completo de espaços.

- [x] **T6 — Sobre e caravanas**
  - Faz: texto institucional curto + link oficial de caravanas.
  - Verifica: link externo explícito; sem travessão.
  - Fora: CRUD de caravana.

## Validação final

- [ ] Aceite de `spec.md`
- [ ] Nav coberta ponta a ponta
- [ ] Copy sem travessão
- [ ] Docs atualizados
