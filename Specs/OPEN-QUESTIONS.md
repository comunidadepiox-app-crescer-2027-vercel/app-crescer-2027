# Questões em aberto

Itens que o SDD registra, mas que ainda não têm decisão final. Não bloqueiam a criação das specs. Bloqueiam só a implementação da parte que depende da resposta.

## Visual

- [x] PDFs no repositório (`Site Crescer.pdf`, `Site Ben Feitor da Fé.pdf`): renderizados e conferidos em 04/09/2026; paleta corrigida em [DESIGN.md](DESIGN.md) (roxo profundo + laranja + dourado, e não o azul-marinho anterior). Print do Instagram segue de fora, sem pendência: os dois PDFs e o site cobriram a extração.
- [x] Nome da fonte oficial: Geometric Slabserif 703 Condensed (500/700) + Outfit no corpo, ver [DESIGN.md](DESIGN.md)
- [x] Hex extraídos do site e registrados em [DESIGN.md](DESIGN.md)

## Produto

- [x] Edição do app: 30º Crescer, 13 a 17/02/2026, constante em `lib/event/edition.js`. Trocar quando a comunidade definir 2027.
- [x] Datas do recorte “hoje no evento”: as da constante acima, timezone `America/Recife`
- [ ] Gating: o SDD assume app inteiro atrás do login. Reabrir só se o produto quiser Home pública.

## Operação

- [x] Primeiro admin: promoção manual no console do Firebase. Abrir Firestore, coleção `users`, documento do uid desejado, trocar `role` de `fiel` para `admin`. O client nunca grava `admin` (as rules recusam) e o Route Handler de upload revalida o papel a cada chamada.
- [ ] Projeto Firebase, domínios autorizados do Google OAuth e variáveis de ambiente (preencher `.env.local` a partir de `.env.example` e publicar `firestore.rules` no console)
- [ ] Conta Cloudinary (pasta `news/` usada pelo upload assinado)
- [x] Destino do lead Benfeitor nesta entrega: só Firestore; a confirmação mostra o link do WhatsApp oficial `(83) 98897-7017` sem envio automático
- [ ] Texto final da política de privacidade / aviso LGPD (o app usa um aviso curto alinhado ao site oficial; validar com a comunidade)

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
