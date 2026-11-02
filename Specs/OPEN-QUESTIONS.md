# Questões em aberto

Itens que o SDD registra, mas que ainda não têm decisão final. Não bloqueiam a criação das specs. Bloqueiam só a implementação da parte que depende da resposta.

## Visual

- [x] PDFs no repositório (`Site Crescer.pdf`, `Site Ben Feitor da Fé.pdf`): renderizados e conferidos em 04/09/2026; paleta corrigida em [DESIGN.md](DESIGN.md) (roxo profundo + laranja + dourado, e não o azul-marinho anterior). Print do Instagram segue de fora, sem pendência: os dois PDFs e o site cobriram a extração.
- [x] Nome da fonte oficial: Geometric Slabserif 703 Condensed (500/700) + Outfit no corpo, ver [DESIGN.md](DESIGN.md)
- [x] Hex extraídos do site e registrados em [DESIGN.md](DESIGN.md)

## Produto

- [x] Edição do app: 30º Crescer (30 anos), 5 a 9/02/2027, constante em `lib/event/edition.js`. Datas confirmadas pelo responsável em 07/09/2026.
- [x] Datas do recorte “hoje no evento”: as da constante acima, timezone `America/Recife`
- [ ] Gating: o SDD assume app inteiro atrás do login. Reabrir só se o produto quiser Home pública.

## Operação

- [x] Primeiro admin: promoção manual no console do Firebase. Abrir Firestore, coleção `users`, documento do uid desejado, trocar `role` de `fiel` para `admin`. O client nunca grava `admin` (as rules recusam) e o Route Handler de upload revalida o papel a cada chamada.
- [x] Google no app nativo: no Expo Go o OAuth é recusado pelo Google (Error 400 `invalid_request`, política contra custom scheme). O fiel usa e-mail/senha no Go; Google fica para o development build.
- [ ] Projeto Firebase, domínios autorizados do Google OAuth (web) e variáveis de ambiente (preencher `.env.local` a partir de `.env.example` e publicar `firestore.rules` no console)
- [ ] Publicar `firestore.indexes.json` com o índice composto de `testimonials` (`pasta` + `createdAt`) e as rules da spec 013. Sem isso a aba da mesa dá `failed-precondition`
- [ ] `EXPO_PUBLIC_API_BASE` no `mobile/.env` com a URL pública do site, sem barra no fim, para o app falar com a rota de testemunhos. Sem ela a tela avisa que o serviço está fora do ar
- [ ] `FIREBASE_SERVICE_ACCOUNT` configurada no servidor para leads e configuração Benfeitor; o envio de testemunhos usa o token Firebase do fiel
- [ ] **Development build do app, para o aviso com o app fechado.** O Expo Go não tem push remoto no Android desde o SDK 53, então a ativação de aviso e a contagem regressiva do Avise-me só funcionam no aplicativo instalado. O perfil `development` do `mobile/eas.json` já existe. Sem isso, o botão sempre recusa com o motivo `expo-go` e nada chega no aparelho
- [ ] `FIREBASE_SERVICE_ACCOUNT` no secret do workflow **Avisos da programação**, que é o mesmo secret, e sem `TOMTOM_API_KEY`, que saiu em 28/09/2026
- [ ] Aviso LGPD antes dos formulários de voluntariado e de fornecedores do Food Park: os JotForms oficiais já apresentam termo e avisos de privacidade; confirmar com a comunidade se o app precisa de uma frase própria antes do WebView
- [ ] Conta Cloudinary (pasta `news/` usada pelo upload assinado)
- [x] Destino do lead Benfeitor nesta entrega: só Firestore; a confirmação mostra o link do WhatsApp oficial `(83) 98897-7017` sem envio automático
- [ ] Endereço do Participar para o site oficial do evento. A constante `LINK_PARTICIPAR` em `mobile/lib/links.js` está vazia e o toque avisa que o endereço entra em breve
- [ ] Texto final da página de informação do app (`mobile/lib/sobreApp.js`). Hoje há texto provisório e um marcador indicando o arquivo e o formato da troca但
- [ ] Texto final da política de privacidade / aviso LGPD (o app usa um aviso curto alinhado ao site oficial; validar com a comunidade). O formulário de testemunho tem aviso próprio e registra o uid anônimo, que também é dado pessoal. Com a retirada da IA, a equipe da mesa passa a ler o texto do testemunho na íntegra, e isso precisa estar no aviso ao titular
- [x] Texto da página de informação do app (`mobile/lib/sobreApp.js`): o texto de apresentação e o aviso de privacidade chegaram da comunidade em 28/09/2026 e já estão no arquivo. Ajustar se a comunidade pedir mudança de redação

## Conteúdo inicial

- [ ] Quem alimenta a primeira carga de notícias e da programação
- [ ] Se a galeria da primeira versão usa fotos Cloudinary próprias ou só aponta para as galerias do site oficial

## Decisões já tomadas

| Tema | Decisão |
|---|---|
| Stack | Next.js App Router, JSX, Tailwind, Firebase Auth + Firestore, Cloudinary |
| CMS | Área admin no próprio app |
| Auth no início | Sem sessão, o fiel não entra nas páginas internas |
| Benfeitor | Formulário de lead, sem gateway de pagamento |
| Caravanas | Link para o fluxo oficial, não é produto nesta fase |
| Instituto Crescer | Fora. Não usar brandbook de `crescer.org.br` |
| Benfeitor da Fé | O formulário voltou ao app em 01/10/2026 e cada envio também chega por e-mail na comissão. O endereço da comissão foi informado e está na constante `DESTINO` de `lib/server/emailBenfeitor.js`, que não é versionada em spec por ser dado pessoal. Falta a `RESEND_API_KEY` para o envio sair |
| Quero ir | Virou **Avise-me**: sem localização, sem trânsito e sem hora de sair. Avisos em 30, 15, 10, 5 e 1 minuto, com cron de 5 em 5 e tolerância de 5 |
| Testemunhos | Fila com pastas `aguardando` e `encerrados`, texto original lido pela equipe e decisão humana, sem IA e sem resumo automático |
| Voluntariado | Seja Voluntário abre `/voluntario` com o JotForm oficial de inscrição de servos em WebView, sem tela de escolha de equipe. A página de Fornecedor tem fluxo próprio na 018. Corrigido em 27/10/2026 |
| Fornecedor Food Park | O card Food Park da página `/fornecedor` abre `/fornecedor/food-park` com o JotForm oficial de fornecedores em WebView. O card Outros permanece informativo. Decidido em 27/10/2026 |
