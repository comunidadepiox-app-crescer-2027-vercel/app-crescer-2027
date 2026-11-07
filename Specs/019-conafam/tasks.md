# Tasks: 019-conafam Página do CONAFAM

Uma task = uma mudança verificável. Proibido agrupar "implementar a tela inteira".

Marcar `[x]` só depois de conferir o critério. Se o comportamento mudar no código, atualizar este arquivo.

## Especificação

- [x] **T1 — Spec, plan e decisões**
  - Faz: registrar rota, fluxo, textos, endereços oficiais e limites da entrega.
  - Verifica: `spec.md` e `plan.md` descrevem o que entra e o que não entra, inclusive a troca do link direto pela página.
  - Fora: qualquer código de produção.

## Implementação

- [x] **T2 — Endereços oficiais do CONAFAM**
  - Faz: adicionar `LINK_CONAFAM_SITE` e `LINK_CONAFAM_INGRESSO` em `mobile/lib/links.js` com os endereços oficiais.
  - Verifica: os dois endereços aparecem uma vez só e são exatamente os informados pela comunidade.
  - Fora: abrir qualquer um deles como fluxo principal dentro do app.

- [x] **T3 — Atalho do menu central**
  - Faz: trocar o item CONAFAM de `url` para `rota: "/conafam"`, mantendo o ícone oficial.
  - Verifica: o toque fecha a folha e abre `/conafam`; o menu não abre mais o endereço de ingressos diretamente.
  - Fora: alterar o desenho da grade ou os outros atalhos.

- [x] **T4 — Tela do CONAFAM**
  - Faz: criar `mobile/app/conafam.jsx` autenticada, com `Voltar` para `/home`, cabeçalho "CONAFAM", logo oficial, apresentação, bloco "Para quem é" e os cards Site Oficial e Adquira já seu ingresso.
  - Verifica: a logo aparece sem distorção; os textos são os fornecidos; cada card abre o endereço correspondente com `abreLinkExterno`.
  - Fora: formulário próprio, WebView, checkout, gravação no Firestore e barra inferior.

- [x] **T5 — Sincronia das specs**
  - Faz: incluir a 019 no `Specs/README.md`, atualizar a folha central na 002, acrescentar a rota na superfície da 008 e registrar a decisão em `OPEN-QUESTIONS.md`.
  - Verifica: nenhum documento afirma que o CONAFAM abre link externo diretamente ou que a folha não tem o atalho.
  - Fora: reescrever specs que não mudaram.

## Validação final

- [ ] Aceite de `spec.md` conferido item a item (depende do teste em aparelho)
- [x] Nenhuma rota ou botão sem destino
- [x] Copy sem travessão
- [x] Nenhum dado pessoal coletado ou gravado
- [x] `npx expo export --platform android` conclui
- [ ] Fluxo testado em aparelho físico, incluindo a abertura dos dois links
- [x] `spec.md`, `plan.md` e este arquivo refletem o que foi entregue
