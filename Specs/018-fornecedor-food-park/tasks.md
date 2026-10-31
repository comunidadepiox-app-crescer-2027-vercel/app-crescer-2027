# Tasks: 018-fornecedor-food-park Formulário de fornecedores do Food Park

Uma task = uma mudança verificável. Proibido agrupar "implementar a tela inteira".

Marcar `[x]` só depois de conferir o critério. Se o comportamento mudar no código, atualizar este arquivo.

## Especificação

- [x] **T1 — Spec, plan e decisões**
  - Faz: registrar rota, fluxo, URL oficial, reuso do componente, tratamento de dados e limites da entrega.
  - Verifica: `spec.md` e `plan.md` descrevem o que entra e o que não entra, inclusive a página de fornecedores e o card Outros.
  - Fora: qualquer código de produção.

## Implementação

- [x] **T2 — URL oficial do formulário**
  - Faz: adicionar `LINK_INSCRICAO_FORNECEDORES_FOOD_PARK` em `mobile/lib/links.js` com `https://form.jotform.com/262965480631665` e ajustar o comentário do arquivo.
  - Verifica: a URL aparece uma vez só e é exatamente a do formulário oficial.
  - Fora: abrir o link externo como fluxo principal.

- [x] **T3 — Card Food Park acionável**
  - Faz: mover a página de fornecedores para `mobile/app/fornecedor/index.jsx`, trocar o card Food Park por `Pressable` com `router.push` e manter Outros estático, sem seta.
  - Verifica: o toque no card ou na seta abre `/fornecedor/food-park`; Outros não responde ao toque; a barra inferior não aparece.
  - Fora: alterar o desenho dos cards, os ícones ou o menu central.

- [x] **T4 — Tela do formulário Food Park**
  - Faz: `mobile/app/fornecedor/food-park.jsx` autenticada, com `Voltar` para `/fornecedor`, cabeçalho "Food Park" e o formulário embutido.
  - Verifica: a tela tem somente cabeçalho e formulário; o erro tem nova tentativa e opção de abrir no navegador. O carregamento real do JotForm em aparelho fica pendente.
  - Fora: campos próprios, cópia local dos dados e gravação no Firestore.

- [x] **T5 — Sincronia das specs**
  - Faz: incluir a 018 no `Specs/README.md`, atualizar a navegação do card Food Park na 012, acrescentar a rota na superfície da 008 e registrar a decisão em `OPEN-QUESTIONS.md`.
  - Verifica: nenhum documento afirma que Food Park não navega ou que a página de Fornecedor tem apenas cards sem ação.
  - Fora: reescrever specs que não mudaram.

## Validação final

- [ ] Aceite de `spec.md` conferido item a item (depende do teste em aparelho)
- [x] Nenhuma rota ou botão sem destino
- [x] Copy sem travessão
- [x] Nenhum dado do formulário no Firestore ou no app
- [x] `npx expo export --platform android` conclui
- [ ] Fluxo testado em aparelho físico, incluindo o seletor de arquivo ou foto, se existir
- [x] `spec.md`, `plan.md` e este arquivo refletem o que foi entregue
