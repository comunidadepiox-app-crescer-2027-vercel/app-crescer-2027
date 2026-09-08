# WebApp Crescer

Aplicativo do Crescer, o Encontro da Família Católica, promovido pela Comunidade de São Pio X em Campina Grande/PB. O fiel entra com e-mail ou Google, acompanha notícias e o cronograma do dia e pode se cadastrar como Benfeitor da Fé. A equipe de comunicação publica o conteúdo pela área administrativa.

Este projeto usa **Spec-Driven Development**. Antes de mudar qualquer funcionalidade, leia [Specs/README.md](Specs/README.md) e a spec correspondente.

## Stack

- Next.js (App Router) em JavaScript/JSX
- Tailwind CSS com os tokens do evento (ver [Specs/DESIGN.md](Specs/DESIGN.md))
- Firebase Auth (e-mail/senha e Google) e Cloud Firestore
- Cloudinary para as capas de notícia (upload assinado no servidor)

## Como rodar

1. `npm install`
2. Copie `.env.example` para `.env.local` e preencha com as chaves do seu projeto Firebase e do Cloudinary.
3. No console do Firebase, habilite Authentication (E-mail/senha e Google) e o Cloud Firestore, e publique o conteúdo de [`firestore.rules`](firestore.rules).
4. A lista de notícias e a programação **não** dependem de índice composto: filtram `published` e ordenam no client. O índice de `news` em [`firestore.indexes.json`](firestore.indexes.json) é opcional.
5. `npm run dev` e abra http://localhost:3000.

## Área administrativa (notícias e cronograma)

O CMS **não** fica no app do celular. É o site: com o Next rodando (`npm run dev`), abra [http://localhost:3000/admin](http://localhost:3000/admin).

O login da mesa é só e-mail e senha. O e-mail já vem preenchido como `admin@crecer.com`. Cadastre essa conta no Firebase Authentication (E-mail/senha) com a senha que vocês combinarem.

O cadastro no Auth **não** torna a pessoa admin. Depois do primeiro login:

1. Abra o console do Firebase, Firestore, coleção `users`.
2. Localize o documento do uid (o e-mail está no documento).
3. Troque o campo `role` de `fiel` para `admin`.
4. Recarregue `/admin`.

Atalhos da mesa: Notícias, Cronograma, Destaques e Benfeitores.

## Estrutura

- `app/` rotas (App Router): `/` início, grupo `(app)` autenticado, `admin/` restrito
- `lib/` Firebase, auth, queries e validações
- `components/` navegação e listas compartilhadas
- `Specs/` documentação SDD: visão, design, questões abertas e uma pasta por funcionalidade
- `firestore.rules` regras de segurança do Firestore
- `mobile/` app nativo do fiel (Expo / React Native). Como rodar: [mobile/README.md](mobile/README.md)
