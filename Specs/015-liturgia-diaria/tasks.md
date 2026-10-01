# Tasks: 015-liturgia-diaria Liturgia Diária

Uma task = uma mudança verificável. Proibido agrupar “implementar a tela inteira”.

Marcar `[x]` só depois de conferir o critério. Se o comportamento mudar no código, atualizar este arquivo.

## Checklist

- [x] **T1 — Contrato da funcionalidade**
  - Faz: registrar rota, API lida, ordem das etapas, limites de escopo e tratamento de campo ausente.
  - Verifica: a spec descreve o comportamento antes do código e não cria coleção nem permissão Firebase.
  - Fora: implementação visual.

- [x] **T2 — Leitura da liturgia**
  - Faz: `mobile/lib/liturgia.js` com a URL, a data de hoje em `America/Recife`, a busca e a normalização pura em etapas.
  - Verifica: nenhuma etapa nasce de campo ausente; a API é chamada uma vez por abertura; a data vai no caminho da URL.
  - Fora: a tela.

- [x] **T3 — Barra de etapas compartilhada**
  - Faz: extrair setas, contador e área segura do Terço para `mobile/components/BarraEtapas.jsx`, com o Terço passando a usá-la.
  - Verifica: as onze etapas do Terço continuam na mesma ordem, com os mesmos limites e o mesmo visual.
  - Fora: mudar conteúdo ou rota do Terço.

- [x] **T4 — Tela da liturgia**
  - Faz: `/liturgia` autenticada, com carregamento, falha com tentar de novo, etapa por seção da API e retorno ao topo a cada troca.
  - Verifica: a tela não mostra texto da API que não seja liturgia, nem aviso de campo ausente.
  - Fora: gesto e atalho.

- [x] **T5 — Navegação por gesto**
  - Faz: arrastar na horizontal avança e volta, sem capturar a rolagem vertical.
  - Verifica: gesto vertical continua rolando o texto; gesto claramente horizontal troca de etapa e volta ao topo.
  - Fora: gesto na barra inferior.

- [x] **T6 — Atalho da folha central**
  - Faz: Liturgia Diária entra em `ITENS` logo depois do Terço, com ícone de linha e rota `/liturgia`.
  - Verifica: a folha fecha antes de abrir a rota e a grade continua em três colunas empacotadas pela esquerda.
  - Fora: alterar os outros atalhos.

- [x] **T7 — Sincronia das specs**
  - Faz: registrar o atalho na 002, a rota na 008 e a nova pasta no mapa do `Specs/README.md`.
  - Verifica: os três arquivos citam a Liturgia Diária com o mesmo nome e a mesma rota.
  - Fora: reescrever spec antiga.

- [x] **T8 — Validação do bundle**
  - Faz: exportar o bundle do Expo e conferir que as duas telas usam a barra compartilhada.
  - Verifica: export termina sem erro.
  - Fora: teste manual no Expo Go.

## Validação final

- [x] Todos os critérios de aceite de `spec.md` passaram
- [x] Nenhuma rota ou botão sem destino
- [x] Copy sem travessão
- [x] Se houve dado pessoal, fluxo LGPD conferido (nenhum dado do fiel é lido ou enviado)
- [x] `spec.md`, `plan.md` e este arquivo refletem o que foi entregue

## Como foi verificado

- `mobile/lib/liturgia.js` exercitado em Node contra a API real, em dia comum (01/10/2026), domingo com segunda leitura (04/10/2026), Quarta-feira de Cinzas (18/02/2026), Sábado Santo (04/04/2026) e Santo Estêvão (27/12/2026): ordem das etapas, ausência de segunda leitura, salmo com refrão, forma longa e breve na mesma seção, `extras` ignorados, versão do versículo separada e os casos degenerados `null`, `{}` e string.
- `expo export --platform android` terminou sem erro com as duas telas usando `BarraEtapas`.