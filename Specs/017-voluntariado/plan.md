# Plan: 017-voluntariado Voluntariado no app

- Spec: [spec.md](spec.md)
- Status: `in-progress`

## Abordagem

Duas telas internas no Expo Router, fora do grupo `(tabs)`, no mesmo padrão de `/fornecedor` e da página de notícia: cabeçalho laranja com `Voltar` e conteúdo em uma coluna sobre `CORES.fundo`. A primeira tela reaproveita o desenho dos cards de `/fornecedor` e lista Food Park e Outros. A segunda é uma casca fina em volta do JotForm oficial.

React Native não tem `iframe`. O formulário entra em `react-native-webview`, que já é dependência do app e já é usado em `CorpoNoticia`. A URL `https://form.jotform.com/262908510287057` é carregada diretamente. O script `jotformEmbedHandler` do trecho HTML é específico de navegador e não é necessário no WebView; a própria página do JotForm cuida da navegação e do redimensionamento do conteúdo. Carregar a URL direta também evita depender de `X-Frame-Options` e de altura fixa de iframe.

O WebView fica com JavaScript, DOM storage e cookies habilitados, porque o formulário usa sessão, verificação de e-mail e upload de foto. Links de outros esquemas (`mailto:`, `tel:`, `whatsapp:`) saem para o aplicativo correspondente. O botão físico do Android volta uma etapa do formulário antes de sair da tela. Se o carregamento falhar, a tela mostra uma mensagem curta, tenta de novo e oferece abrir no navegador, sem tela em branco.

O endereço do formulário fica em `mobile/lib/links.js`, junto dos demais endereços externos. A lista de equipes fica local na tela. Outros é um card informativo, sem `onPress` e sem seta, para não prometer um destino que ainda não existe.

O envio de foto do formulário usa o seletor nativo do WebView. No iOS, o `app.json` ganha as descrições de uso de câmera e fotos. No Android, o seletor do sistema é o caminho principal e a captura pela câmera é validada em aparelho físico, sem declarar permissões que o app não usa em outros fluxos.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/lib/links.js` | constante `LINK_INSCRICAO_SERVOS` com a URL oficial |
| `mobile/app/voluntario/index.jsx` | tela autenticada de escolha de equipe, cards Food Park e Outros |
| `mobile/app/voluntario/food-park.jsx` | tela autenticada com `Voltar` para `/voluntario` e o formulário |
| `mobile/components/FormularioJotform.jsx` | WebView com carregamento, erro, navegação externa e voltar do Android |
| `mobile/components/MenuAtalhos.jsx` | trocar o item Seja Voluntário de `url` para `rota: "/voluntario"` |
| `mobile/app.json` | descrições de câmera e fotos no iOS, para o upload do formulário |
| `Specs/017-voluntariado/spec.md` | contrato da feature |
| `Specs/017-voluntariado/plan.md` | este plano |
| `Specs/017-voluntariado/tasks.md` | checklist de implementação |
| `Specs/README.md` | incluir a 017 no mapa e na ordem |
| `Specs/008-app-react-native/spec.md` | incluir as rotas e tirar Voluntário da lista sem rota |
| `Specs/002-navegacao-e-home/spec.md` | atualizar o comportamento do atalho Voluntário |
| `Specs/002-navegacao-e-home/plan.md` | atualizar a descrição da folha central |

## Firestore

Nenhuma coleção nova, nenhuma leitura e nenhuma escrita. O formulário não passa pelo Firestore.

## Cloudinary

Não.

## Ordem de entrega

1. Constante do formulário em `mobile/lib/links.js`, com o comentário do arquivo ajustado para incluir o uso em WebView.
2. Componente `FormularioJotform` com WebView, carregamento, erro, links externos e voltar do Android.
3. Rota `/voluntario` com os cards Food Park e Outros.
4. Rota `/voluntario/food-park` com o cabeçalho e o componente.
5. Atalho da folha central apontando para `/voluntario`.
6. Configuração de permissões de foto no iOS, se o teste em aparelho exigir.
7. Sincronia das specs 002, 008, README e da nova 017.
8. `npx expo export --platform android` e teste no Expo Go/aparelho.

## Riscos

| Risco | Mitigação |
|---|---|
| O JotForm não carregar no WebView por cookie, storage ou user-agent | habilitar `javaScriptEnabled`, `domStorageEnabled`, `sharedCookiesEnabled` e `thirdPartyCookiesEnabled`; testar o fluxo completo no aparelho |
| O upload de foto do formulário não abrir no aparelho | testar o seletor nativo; adicionar as descrições de câmera e fotos no iOS; no Android, usar o seletor do sistema e validar a câmera em aparelho físico |
| Links de e-mail ou telefone do formulário travarem dentro do WebView | interceptar esquemas que não são HTTP(S) e abrir com `Linking` |
| O voltar físico do Android sair da tela no meio do formulário | `BackHandler` chama `webView.goBack()` enquanto houver histórico |
| O card Outros parecer um botão sem ação | renderizar como card estático, sem seta e com texto de que outras equipes serão divulgadas |
| O formulário ser confundido com um formulário do app | a tela não replica campos nem grava dados; o WebView carrega a página oficial e a submissão vai direto para o JotForm |
| O bundle quebrar por rota aninhada | usar `mobile/app/voluntario/index.jsx` e `food-park.jsx`, sem conflito de arquivo e pasta |
| A barra inferior aparecer na tela do formulário | manter as rotas fora de `(tabs)`, como `/fornecedor` |
| A nova tela ser confundida com uma quinta aba | não alterar `BarraAbas`; a entrada é pela folha central, como as demais páginas internas |
| O formulário exigir dado pessoal e o app parecer responsável pela coleta | a tela não armazena nem registra nada; o termo e os avisos de privacidade são os do JotForm oficial |

## Fora deste plan

Formulário nativo, gravação de inscrições no Firestore, outras equipes com formulário, alteração do JotForm, upload próprio, câmera customizada, notificações de status e login próprio.
