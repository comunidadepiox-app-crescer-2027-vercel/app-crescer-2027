# Tasks: 017-voluntariado Voluntariado no app

Uma task = uma mudança verificável. Proibido agrupar "implementar a tela inteira".

Marcar `[x]` só depois de conferir o critério. Se o comportamento mudar no código, atualizar este arquivo.

## Especificação

- [x] **T1 — Spec, plan e decisões**
  - Faz: registrar rotas, fluxo, URL oficial, equipes, comportamento do card Outros, uso do WebView, tratamento de dados e limites da entrega.
  - Verifica: `spec.md` e `plan.md` descrevem o que entra e o que não entra, inclusive a diferença entre WebView e iframe.
  - Fora: qualquer código de produção.

## Implementação

- [x] **T2 — URL oficial do formulário**
  - Faz: adicionar `LINK_INSCRICAO_SERVOS` em `mobile/lib/links.js` com `https://form.jotform.com/262908510287057` e ajustar o comentário do arquivo para o uso em WebView.
  - Verifica: a URL aparece uma vez só e é exatamente a do formulário oficial.
  - Fora: abrir o link externo como fluxo principal.

- [x] **T3 — Componente do WebView**
  - Faz: `mobile/components/FormularioJotform.jsx` com carregamento, erro, nova tentativa, abertura externa de esquemas que não são HTTP(S), cookies e storage, e voltar do Android.
  - Verifica: o componente compila no bundle; o formulário rola, o teclado funciona, `mailto:` e `tel:` abrem fora do WebView e o voltar físico usa o histórico do WebView quando existe, saindo da tela quando não existe. O teste visual em aparelho fica pendente.
  - Fora: formulário nativo, leitura de campos e injeção de scripts no conteúdo.

- [x] **T4 — Tela de equipes**
  - Faz: `mobile/app/voluntario/index.jsx` autenticada, com `Voltar` para `/home`, texto de apoio e cards Food Park e Outros.
  - Verifica: Food Park abre `/voluntario/food-park`; Outros não responde ao toque, não tem seta e não parece botão; a barra inferior não aparece.
  - Fora: outros formulários e conteúdo administrativo.

- [x] **T5 — Tela do Food Park**
  - Faz: `mobile/app/voluntario/food-park.jsx` autenticada, com `Voltar` para `/voluntario` e o formulário embutido.
  - Verifica: o bundle inclui a rota; o erro tem nova tentativa e opção de abrir no navegador. O carregamento real do JotForm em aparelho fica pendente.
  - Fora: campos próprios, cópia local dos dados e gravação no Firestore.

- [x] **T6 — Atalho na folha central**
  - Faz: trocar `url` por `rota: "/voluntario"` no item Seja Voluntário de `mobile/components/MenuAtalhos.jsx`.
  - Verifica: o toque fecha a folha e abre a tela interna; nenhum navegador abre.
  - Fora: alterar os demais atalhos e a ordem da grade.

- [x] **T7 — Upload de foto no iOS**
  - Faz: acrescentar `NSCameraUsageDescription` e `NSPhotoLibraryUsageDescription` em `mobile/app.json`.
  - Verifica: o seletor de foto do formulário abre e permite anexar uma imagem. O teste visual em aparelho fica pendente.
  - Fora: câmera customizada, `expo-camera` e upload próprio.

- [x] **T8 — Sincronia das specs**
  - Faz: incluir a 017 no `Specs/README.md`, acrescentar as rotas na superfície da 008 e atualizar o comportamento do atalho Voluntário na 002 (spec, plan e tasks).
  - Verifica: nenhum documento afirma que Voluntário não navega.
  - Fora: reescrever specs que não mudaram.

## Validação final

- [ ] Aceite de `spec.md` conferido item a item (depende do teste em aparelho)
- [x] Nenhuma rota ou botão sem destino
- [x] Copy sem travessão
- [x] Nenhum dado do formulário no Firestore ou no app
- [x] `npx expo export --platform android` conclui
- [ ] Fluxo testado em aparelho físico, incluindo o seletor de foto
- [x] `spec.md`, `plan.md` e este arquivo refletem o que foi entregue
