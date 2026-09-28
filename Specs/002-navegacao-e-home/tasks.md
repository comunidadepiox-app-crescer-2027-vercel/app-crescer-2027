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
  - Faz: barra Home, Notícias, círculo, Agenda, Benfeitor. Conta só pela engrenagem do header. Folha com Terço da Restauração das Famílias, Fornecedor, Voluntário e Spotify.
  - Verifica: aba ativa dourada; na Conta nenhuma aba dourada; a folha fecha no círculo, no fundo e no arraste; Terço e Fornecedor abrem suas rotas; os demais atalhos não navegam.
  - Fora: rotas de Voluntário e Spotify.

- [x] **T9 — Loja e Mapa do Evento na folha de atalhos**
  - Faz: adicionar Loja com abertura externa da coleção Arte Piedosa da Devotum e Mapa do Evento em estado indisponível.
  - Verifica: Loja abre `https://usedevotum.com.br/colecao-arte-piedosa/`; Mapa do Evento fica visualmente apagado, anuncia estado desativado e não responde ao toque; a grade acomoda os seis atalhos.
  - Fora: rota interna, WebView ou conteúdo de mapa.

- [x] **T10 — Grade da folha sem buraco no meio**
  - Faz: `justifyContent: "flex-start"` e `width: "33%"` no item, no `MenuAtalhos.jsx`.
  - Verifica: a linha cheia continua distribuída em três colunas e a linha parcial empacota pela esquerda, com os itens encostados e sem vão no meio. `npx expo export --platform android` conclui.
  - Fora: número de colunas, ordem dos atalhos e o desenho do círculo de pelo.

## Validação final

- [ ] Aceite de `spec.md`
- [ ] Nav coberta ponta a ponta
- [ ] Copy sem travessão
- [ ] Docs atualizados
