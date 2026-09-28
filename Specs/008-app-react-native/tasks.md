# Tasks: 008-app-react-native

- [x] **T1 — Scaffold Expo em `mobile/`**
  - Faz: create-expo-app template blank (JS) + dependências via expo install.
  - Verifica: `mobile/package.json` com expo-router, firebase, expo-video, react-native-svg.
- [x] **T2 — Fontes e assets da marca**
  - Faz: converter Geometric Slabserif woff2→TTF; copiar vídeo da splash, logos e foto para `mobile/assets/brand`.
  - Verifica: TTFs válidos carregando no expo-font; assets no bundle.
- [x] **T3 — Tema e ícones**
  - Faz: `mobile/lib/tema.js` com a paleta 000; ícones da marca em react-native-svg.
  - Verifica: cores hex idênticas ao DESIGN.md.
- [x] **T4 — Firebase e AuthProvider**
  - Faz: client com initializeAuth+AsyncStorage; port do AuthProvider e errors; env EXPO_PUBLIC_*.
  - Verifica: sessão persiste ao recarregar o app.
- [x] **T5 — Splash com vídeo**
  - Faz: abertura com `splash-crescer.mp4` sobre `#3e1c7a` (fundo da tela igual ao do vídeo no aparelho), wordmark, logos da diocese e de São Pio X no rodapé; segura até sessão resolver.
  - Verifica: vídeo roda, marcas visíveis embaixo, libera para login/Home.
- [x] **T6 — Login**
  - Faz: e-mail/senha (entrar, criar, esqueci a senha) + Google via expo-auth-session no build nativo. No Expo Go o botão Google mostra o bloqueio OAuth em vez de abrir o browser.
  - Verifica: cria doc `users` com role fiel; erros traduzidos; Expo Go não dispara o fluxo Google.
- [x] **T7 — Abas e Home**
  - Faz: tab bar roxa com ícones da marca; Home com hero da edição, até 4 notícias e programação do dia do recorte, em `onSnapshot`.
  - Verifica: recorte "hoje" igual à web; publicar no admin atualiza sem matar o app.
- [x] **T8 — Notícias e detalhe**
  - Faz: lista com capa e data em `onSnapshot`; detalhe com parágrafos.
  - Verifica: só `published == true`.
- [x] **T9 — Agenda**
  - Faz: abas de dias da edição, grupos por espaço, escuta ao vivo.
  - Verifica: dias 05–09/02/2027.
- [x] **T10 — Benfeitor** (formulário arquivado em 28/09/2026, ver a spec 005)
  - Estado: a tela e a lib foram movidas para `mobile/_arquivo/benfeitor/`, com README do que falta para recriá-las. A aba virou link externo para o site da campanha.
  - Fora: pagamento e qualquer reativação do formulário no app.
- [x] **T11 — Conta, Galeria e Sobre** (Conta substituída em 28/09/2026, ver a spec 006)
  - Estado: editar nome e sair saíram com a tela de Configuração. Galeria e Sobre continuam, e o `Voltar` das duas aponta para `/sobre-o-app`.
  - Fora: edição de conta.
- [x] **T13 — Anúncios na Home** (retirada com a spec 009)
  - Faz: a pilha saiu da Home; o app não lê `announcements`.
  - Verifica: a Home abre sem cartaz.
  - Fora: apagar documentos já gravados no Firestore.

- [x] **T14 — Aviso da programação**
  - Faz: pedido único para ativar notificação; token em `deviceTokens`. A mudança do dia do recorte chega só pelo push.
  - Verifica: "Agora não" não repete o pedido. Não há faixa na Home nem na Agenda.
  - Fora: push dentro do Expo Go.

- [x] **T12 — Validação e docs**
  - Faz: bundle sem erro, README do mobile (como rodar no Expo Go), sync das specs.
  - Verifica: `npx expo export --platform android` gerou o bundle (1458 módulos) sem erro. Teste no Expo Go fica com o responsável.

- [x] **T15 — Terço da Restauração das Famílias**
  - Faz: rota autenticada com as onze etapas de oração e navegação inferior; atalho correspondente na folha central.
  - Verifica: a navegação respeita início e fim e o bundle Expo abre a rota.
  - Fora: progresso persistido, áudio e rotas dos demais atalhos.

- [x] **T16 — Loja e Mapa do Evento**
  - Faz: incluir os atalhos Loja e Mapa do Evento na folha central.
  - Verifica: Loja abre a coleção Arte Piedosa da Devotum no navegador; Mapa anuncia e mantém estado indisponível.
  - Fora: catálogo nativo, WebView e rota de mapa.

- [x] **T17 — Página de Fornecedor**
  - Faz: criar a rota autenticada `/fornecedor` com os cards Food Park e Outros, usando as imagens locais e reserving URLs futuras.
  - Verifica: o atalho Fornecedor abre a página, os cards são visuais e o retorno leva à Home.
  - Fora: links externos, CMS e detalhes individuais.

- [x] **T18 — Benfeitor como link externo** (28/09/2026, spec 005)
  - Faz: `mobile/lib/links.js` com `LINK_BENFEITOR`, item de link externo na `BarraAbas` e `Tabs.Screen` de `benfeitor` removida; tela e lib arquivadas em `mobile/_arquivo/benfeitor/`.
  - Verifica: a aba abre `https://benfeitordafe.comunidadepiox.org.br/crescer`; nenhuma rota `/benfeitor` no bundle; `/admin/leads` e `benefactorLeads` sem alteração.
  - Fora: apagar leads já gravados.

- [x] **T19 — PARTICIPAR e ícone de informação** (28/09/2026, specs 002 e 006)
  - Faz: botão **PARTICIPAR** no header e atalho Participar na folha central, com `LINK_PARTICIPAR` reservado no código; `IconeEngrenagem` trocada por `IconeInfo`; `conta.jsx` removido e `/sobre-o-app` criada com o texto em `mobile/lib/sobreApp.js`.
  - Verifica: o ícone de informação abre `/sobre-o-app`; Galeria e Sobre voltam para ela; o Participar avisa enquanto a constante estiver vazia.
  - Fora: o endereço de participação, que a comunidade ainda não informou.

- [x] **T20 — Avise-me sem localização** (28/09/2026, spec 010)
  - Faz: `Avise-me` e `Cancelar aviso` no `ProgramaLista`, `useAviseMe` em `lib/avisoSaida.js`, subcoleção `lembretes`, `expo-location` fora do `app.json` e do `package.json`.
  - Verifica: o app não pede permissão de localização em nenhum fluxo e o canal Android é `aviso`.
  - Fora: o job, que é a spec 010.

- [x] **T21 — Testemunhos sem IA** (28/09/2026, spec 013)
  - Faz: a confirmação do envio tem uma mensagem só e o texto de "Como funciona" não promete resumo automático.
  - Verifica: nenhum `resultado.status` na tela e o bundle do app conclui.
  - Fora: a mesa, que é a spec 013.

- [x] **T22 — Ativação de aviso sem tela morta** (28/09/2026)
  - Faz: motivos nomeados (`expo-go`, `navegador`, `negado`, `sem-token`, `erro`) com uma frase cada, canal Android criado antes do pedido de permissão, `getExpoPushTokenAsync` dentro de `try`, e o cartão do pedido passa a ter botão "Entendi" quando o ambiente não tem push. `marcarLembrete` devolve `push` e `motivo` em vez de dizer que deu certo sem token. `expo-device` sai do projeto, porque a checagem de `isDevice` barrava emulador e simulador, que a referência do SDK 57 diz que suportam push.
  - Verifica: no Expo Go o toque mostra o motivo e o cartão fecha; `npx expo export --platform android` conclui sem erro.
  - Fora: fazer o push chegar de verdade, que exige development build (spec 010).
