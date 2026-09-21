# Spec: 008-app-react-native — App do fiel em React Native (Expo)

- Status: `in-progress` (bundle validado; aceite no Expo Go pendente do responsável)
- Complexidade: `alta`
- Personas: `fiel`
- Depende de: 000 a 006 validadas na web; mesmo projeto Firebase (auth, Firestore, regras e índices já publicados)

## Problema

O fiel só acessa o Crescer pelo navegador. A comunidade quer um aplicativo instalável nas lojas, com login nativo do Google (o fluxo web em navegador de celular é instável) e a mesma experiência visual do evento.

## Escopo

### Entra

- Projeto Expo (React Native, JavaScript) em `mobile/`, usando expo-router
- Todas as telas do fiel: início/login, Home, Notícias (lista e detalhe), Agenda (cronograma), Benfeitor da Fé, Conta, Galeria e Sobre
- Splash de abertura com o vídeo oficial da logo sobre `#3e1c7a` (mesmo tom do fundo do vídeo no aparelho), wordmark branco e, no rodapé, as logos da Diocese de Campina Grande e da Comunidade de São Pio X
- Mesmo Firestore e as mesmas regras de leitura do fiel, mais `announcements` (spec 009) e o token de notificação em `deviceTokens`
- Na Home, pilha de anúncios ativos na primeira abertura do dia (fuso America/Fortaleza)
- Faixa quando a programação publicada do dia do recorte muda, e um pedido único para ativar notificação
- Identidade visual completa: paleta 000, fontes oficiais (convertidas para TTF), ícones da marca
- Login e-mail/senha; login Google via `expo-auth-session` **só em build nativo** (dev/produção). No Expo Go o botão explica o bloqueio da política OAuth do Google

### Não entra

- Área administrativa (continua na web, spec 007)
- Modo offline e publicação nas lojas
- Push remoto dentro do Expo Go (no SDK 57 isso pede build de desenvolvimento; a faixa na tela funciona no Expo Go)
- Pagamentos

## Fluxos

1. Fiel abre o app, vê a splash com o vídeo da logo, cai no login (ou direto na Home se a sessão persiste).
2. Na Home vê destaque da edição, até 4 notícias e a programação do dia do recorte (calendário Recife: dia 5 até acabar o 5, depois o 6). Home, Notícias e Agenda escutam o Firestore.
3. Benfeitor: mesmo formulário e validações da web, grava em `benefactorLeads`. Máscara de celular e CPF. Se já cadastrou, abre a confirmação.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Pasta | `mobile/` (expo-router: `app/index` login, `app/(tabs)/{home,noticias,agenda,benfeitor,conta}`, `app/noticia/[id]`, `app/galeria`, `app/sobre`) |
| Coleções Firestore | `users`, `news`, `programItems`, `benefactorLeads`, `announcements`, `deviceTokens` |
| Papel necessário | `fiel` |

## Dados

Persistência de sessão via AsyncStorage (token do Firebase Auth no aparelho). Também no aparelho: o dia em que a pilha de anúncios apareceu, a impressão da programação do recorte e a resposta ao pedido de notificação. O token Expo, quando a pessoa aceita, vai para `deviceTokens`.

## Regras de negócio

- Cadastro sempre cria `role: 'fiel'` (mesma regra da web; rules do Firestore continuam valendo)
- Sem Google client ID configurado (`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`), o botão Google explica a pendência em vez de falhar mudo
- No Expo Go (`Constants.appOwnership === 'expo'`), o botão Google **não** abre o fluxo OAuth: o Google recusa o redirect `host.exp.exponent` (Error 400 invalid_request). O fiel entra com e-mail e senha
- Datas e recorte "hoje" seguem `lib/event/edition` (timezone America/Recife): antes do evento e no dia 5 mostra 5/02; depois da meia-noite do dia 5 mostra 6/02, e assim até 9/02

## Critérios de aceite

- [ ] `npx expo start` abre sem erro de bundle e o app roda no Expo Go
- [ ] Splash mostra o vídeo da logo sobre o mesmo roxo da tela, as logos da diocese e de São Pio X no rodapé, e libera quando a sessão resolve
- [ ] Login e-mail/senha cria/entra e persiste sessão ao reabrir o app
- [ ] Home, Notícias, detalhe, Agenda, Benfeitor, Conta, Galeria e Sobre funcionais
- [ ] Formulário Benfeitor grava lead com as mesmas validações da web
- [ ] Identidade: roxo #3a1075, laranja #d68130, dourado, Geometric Slabserif nos títulos

## Anti-slop

- Sem pílulas/chips arredondados na navegação; abas seguem o roxo institucional com dourado no ativo
- Sem gradientes de fundo; padrão poligonal só como o SVG oficial
- Texto à esquerda; fotografia real do evento

## Referências

- Specs irmãs: 001 a 006 (comportamento das telas), DESIGN.md (identidade)
- Site oficial: encontrodafamiliacatolica.com.br
