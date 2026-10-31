# Plan: 018-fornecedor-food-park Formulário de fornecedores do Food Park

- Spec: [spec.md](spec.md)
- Status: `in-progress`

## Abordagem

Reusar o `FormularioJotform` da 017, que já resolve WebView, carregamento, erro, links externos e voltar do Android. A página `/fornecedor` passa de arquivo para pasta (`app/fornecedor/index.jsx`), permitindo a rota aninhada `app/fornecedor/food-park.jsx` sem conflito de caminho. O card Food Park vira `Pressable` e abre a nova rota; Outros permanece estático e perde a seta, que não representa ação.

A URL `https://form.jotform.com/262965480631665` fica em `mobile/lib/links.js`. O HTML do iframe não é copiado: `onload`, `frameborder`, `scrolling`, `allowtransparency` e `jotformEmbedHandler` são específicos do navegador e não têm efeito útil no WebView. A página oficial do JotForm cuida da navegação e do redimensionamento.

Não há mudança nativa nova. As descrições de câmera e fotos do iOS já entraram na 017 e cobrem o seletor de arquivo do WebView.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/lib/links.js` | constante `LINK_INSCRICAO_FORNECEDORES_FOOD_PARK` com a URL oficial |
| `mobile/app/fornecedor/index.jsx` | tela autenticada de fornecedores, com Food Park acionável e Outros estático |
| `mobile/app/fornecedor/food-park.jsx` | tela autenticada com `Voltar` para `/fornecedor` e o formulário |
| `mobile/components/FormularioJotform.jsx` | componente reusado, sem alteração |
| `Specs/018-fornecedor-food-park/spec.md` | contrato da feature |
| `Specs/018-fornecedor-food-park/plan.md` | este plano |
| `Specs/018-fornecedor-food-park/tasks.md` | checklist de implementação |
| `Specs/012-fornecedores/spec.md` | atualizar a navegação do card Food Park |
| `Specs/008-app-react-native/spec.md` | incluir a rota aninhada |
| `Specs/README.md` | incluir a 018 no mapa e na ordem |
| `Specs/OPEN-QUESTIONS.md` | registrar a decisão e ampliar a dúvida de LGPD |

## Firestore

Nenhuma coleção nova, nenhuma leitura e nenhuma escrita. O formulário não passa pelo Firestore.

## Cloudinary

Não.

## Ordem de entrega

1. Constante do formulário em `mobile/lib/links.js`.
2. Página de fornecedores movida para `app/fornecedor/index.jsx`, com Food Park acionável.
3. Rota `app/fornecedor/food-park.jsx` com cabeçalho e componente.
4. Sincronia das specs 012, 008, README, OPEN-QUESTIONS e da nova 018.
5. `npx expo export --platform android` e teste no Expo Go/aparelho.

## Riscos

| Risco | Mitigação |
|---|---|
| Conflito entre `fornecedor.jsx` e a pasta `fornecedor/` | mover a página para `app/fornecedor/index.jsx`, mantendo a rota `/fornecedor` |
| O JotForm não carregar no WebView por cookie, storage ou user-agent | reusar o componente da 017, que já habilita JavaScript, storage e cookies; testar o fluxo completo |
| O upload de arquivo do formulário não abrir no aparelho | testar o seletor nativo; as descrições de câmera e fotos do iOS já existem desde a 017 |
| Links de e-mail ou telefone do formulário travarem dentro do WebView | o componente da 017 intercepta esquemas que não são HTTP(S) e abre com `Linking` |
| O voltar físico do Android sair da tela no meio do formulário | o componente da 017 usa `BackHandler` e `goBack()` enquanto houver histórico |
| O card Outros parecer acionável | renderizar como card estático, sem seta e sem `onPress` |
| A página ser confundida com a de voluntário | o cabeçalho e o endereço são outros; a tela tem só o formulário de fornecedores |
| O formulário exigir dado pessoal e o app parecer responsável pela coleta | a tela não armazena nem registra nada; o termo e os avisos de privacidade são os do JotForm oficial |

## Fora deste plan

Formulário para Outros, formulário nativo, gravação de inscrições no Firestore, alteração do JotForm, upload próprio, câmera customizada, notificações de status e login próprio.
