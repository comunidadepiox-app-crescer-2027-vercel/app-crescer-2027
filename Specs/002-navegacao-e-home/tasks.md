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

- [x] **T7 — Escuta ao vivo**
  - Faz: Home, Notícias e Cronograma com `onSnapshot` de publicados; Home fatia 4 notícias e o dia do recorte.
  - Verifica: publicar no admin atualiza a Home sem recarregar; virada de dia é calendário Recife (5 até acabar o 5, depois 6).
  - Fora: detalhe da notícia.

- [ ] **T8 — Barra e folha de atalhos**
  - Faz: barra Home, Notícias, círculo, Agenda, Benfeitor. Conta só pela engrenagem do header. Folha com Santo Terço, Voluntário, Fornecedor e Spotify, sem destino.
  - Verifica: aba ativa dourada; na Conta nenhuma aba dourada; a folha fecha no círculo, no fundo e no arraste; os atalhos não navegam.
  - Fora: rota dos quatro atalhos.

## Validação final

- [ ] Aceite de `spec.md`
- [ ] Nav coberta ponta a ponta
- [ ] Copy sem travessão
- [ ] Docs atualizados
