# Spec: 008-app-react-native — App do fiel em React Native (Expo)

- Status: `in-progress` (bundle validado; aceite no Expo Go pendente do responsável)
- Complexidade: `alta`
- Personas: `fiel`
- Depende de: 000 a 006 validadas na web; mesmo projeto Firebase (auth, Firestore, regras e índices já publicados)

## Problema

O fiel acessa o Crescer pelo app instalado sem criar credenciais. A sessão anônima do Firebase fornece a identidade técnica necessária às rotas e integrações, mantendo a experiência visual do evento.

## Escopo

### Entra

- Projeto Expo (React Native, JavaScript) em `mobile/`, usando expo-router
- Todas as telas do fiel: Home, Notícias (lista e detalhe), Agenda (cronograma), Sobre o app, Galeria e Sobre
- Benfeitor da Fé não é tela: a aba da barra inferior abre o site da campanha, ver [005](005-benfeitor-da-fe/spec.md)
- Botão **COLABORE** no header, abrindo a oferta pelo PIX, ver [014](014-doacao/spec.md). O atalho Participar permanece na folha central, com o endereço do site oficial reservado no código e ainda vazio, ver [002](002-navegacao-e-home/spec.md)
- Splash de abertura com o vídeo oficial da logo sobre `#3e1c7a` (mesmo tom do fundo do vídeo no aparelho), wordmark branco e, no rodapé, as logos da Diocese de Campina Grande e da Comunidade de São Pio X
- Mesmo Firestore e as mesmas regras de leitura do fiel, e o token de notificação em `deviceTokens`
- Pedido único para ativar notificação quando a programação publicada do dia do recorte muda
- Ativação de aviso com motivo honesto: em ambiente sem push, o app diz qual é o motivo e deixa a pessoa sair, em vez de insistir num botão que nunca vai funcionar
- Identidade visual completa: paleta 000, fontes oficiais (convertidas para TTF), ícones da marca
- Sessão anônima automática via Firebase Anonymous Auth, persistida com AsyncStorage

### Não entra

- Área administrativa (continua na web, spec 007)
- Login, cadastro, Google, recuperação de senha e logout do fiel
- Modo offline e publicação nas lojas
- Push remoto dentro do Expo Go (no SDK 57 isso pede build de desenvolvimento)
- Pagamentos
- Tela de configuração, edição de nome e qualquer ajuste de conta (spec 006)
- Localização do fiel (spec 010)

## Fluxos

1. Fiel abre o app, vê a splash com o vídeo da logo e a sessão anônima é criada ou restaurada automaticamente.
2. Na Home vê destaque da edição, até 4 notícias e a programação do dia do recorte (calendário Recife: dia 5 até acabar o 5, depois o 6). Home, Notícias e Agenda escutam o Firestore.
3. Benfeitor: toca na aba e o navegador abre a campanha da Comunidade de São Pio X. O app não pede nenhum dado nesse caminho.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Pasta | `mobile/` (expo-router: `app/index` login, `app/(tabs)/{home,noticias,agenda}`, `app/noticia/[id]`, `app/galeria`, `app/sobre`, `app/sobre-o-app`, `app/terco-restauracao`, `app/fornecedor`, `app/testemunhos`, `app/colabore`). A barra mostra Home, Notícias, Agenda e Benfeitor, com o círculo de menu no centro. Benfeitor é link externo e não é `Tabs.Screen`. Sobre o app fica fora da barra e abre pelo ícone de informação do header. A folha abre o Terço da Restauração das Famílias, a coleção Arte Piedosa da Devotum e o Participar no navegador, a oferta Colabore, a página visual de Fornecedor e o formulário de Testemunhos; Voluntário e Spotify continuam sem rota e Mapa do Evento fica indisponível |
| Coleções Firestore | `users`, `news`, `programItems`, `lembretes` (subcoleção do uid), `deviceTokens` |
| Papel necessário | `fiel` |

## Dados

Persistência de sessão via AsyncStorage (token do Firebase Auth no aparelho). Também no aparelho: a resposta ao pedido de notificação. O token Expo, quando a pessoa aceita, vai para `deviceTokens`.

## Regras de negócio

- Cadastro anônimo sempre cria `role: 'fiel'` (mesma regra da web; rules do Firestore continuam valendo)
- O app não oferece login, cadastro, Google, recuperação de senha ou logout
- O mesmo UID anônimo é usado por dados, lembretes e notificações
- Endereços externos vivem em `mobile/lib/links.js`, e nenhum item de link fica sem destino: com a constante vazia, o toque avisa
- Datas e recorte "hoje" seguem `lib/event/edition` (timezone America/Recife): antes do evento e no dia 5 mostra 5/02; depois da meia-noite do dia 5 mostra 6/02, e assim até 9/02

## Critérios de aceite

- [ ] `npx expo start` abre sem erro de bundle e o app roda no Expo Go
- [ ] Splash mostra o vídeo da logo sobre o mesmo roxo da tela, as logos da diocese e de São Pio X no rodapé, e libera quando a sessão resolve
- [ ] Sessão anônima é criada automaticamente e persiste ao reabrir
- [ ] Home abre diretamente, sem tela de login ou cadastro
- [ ] Home, Notícias, detalhe, Agenda, Sobre o app, Galeria, Sobre, Testemunhos e Colabore funcionais
- [ ] A aba Benfeitor abre o site da campanha e o header mostra **COLABORE** com o ícone de informação ao lado
- [ ] Identidade: roxo #3a1075, laranja #d68130, dourado, Geometric Slabserif nos títulos

## Anti-slop

- Sem pílulas/chips arredondados na navegação; abas seguem o roxo institucional com dourado no ativo
- Sem gradientes de fundo; padrão poligonal só como o SVG oficial
- Texto à esquerda; fotografia real do evento

## Referências

- Specs irmãs: 001 a 006 (comportamento das telas), DESIGN.md (identidade)
- Site oficial: encontrodafamiliacatolica.com.br
