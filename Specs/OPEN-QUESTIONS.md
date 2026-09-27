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
- [ ] Chave gratuita do Groq em `GROQ_API_KEY` (https://console.groq.com/keys), para o filtro e o resumo de testemunho. Sem a chave o testemunho é gravado como `revisao` e o resumo não sai
- [ ] `EXPO_PUBLIC_API_BASE` no `mobile/.env` com a URL pública do site, sem barra no fim, para o app falar com a rota de testemunhos. Sem ela a tela avisa que o serviço está fora do ar
- [ ] `FIREBASE_SERVICE_ACCOUNT` presente em `.env`, porque a gravação de `testimonials` passa pelo Admin SDK na rota do servidor
- [ ] Conta Cloudinary (pasta `news/` usada pelo upload assinado)
- [x] Destino do lead Benfeitor nesta entrega: só Firestore; a confirmação mostra o link do WhatsApp oficial `(83) 98897-7017` sem envio automático
- [ ] Texto final da política de privacidade / aviso LGPD (o app usa um aviso curto alinhado ao site oficial; validar com a comunidade). O formulário de testemunho tem aviso próprio e registra o uid anônimo, que também é dado pessoal

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
| Testemunhos | Fila com pastas `aguardando` e `encerrados`, resumo pela IA, texto original guardado e nunca exibido na mesa |
