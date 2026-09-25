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
- [x] **T10 — Benfeitor**
  - Faz: campanha + formulário com máscara de celular/CPF e LGPD; confirmação se já houver lead do uid.
  - Verifica: lead gravado com status novo; reabrir a aba mostra a confirmação.
- [x] **T11 — Conta, Galeria e Sobre**
  - Faz: editar nome, sair; links oficiais; institucional.
  - Verifica: sair volta ao login.
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
