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
- Todas as telas do fiel: Home, Notícias (lista e detalhe), Agenda (cronograma), Benfeitor da Fé, Conta, Galeria e Sobre
- Splash de abertura com o vídeo oficial da logo sobre `#3e1c7a` (mesmo tom do fundo do vídeo no aparelho), wordmark branco e, no rodapé, as logos da Diocese de Campina Grande e da Comunidade de São Pio X
- Mesmo Firestore e as mesmas regras de leitura do fiel, e o token de notificação em `deviceTokens`
- Pedido único para ativar notificação quando a programação publicada do dia do recorte muda
- Identidade visual completa: paleta 000, fontes oficiais (convertidas para TTF), ícones da marca
- Sessão anônima automática via Firebase Anonymous Auth, persistida com AsyncStorage

### Não entra

- Área administrativa (continua na web, spec 007)
- Login, cadastro, Google, recuperação de senha e logout do fiel
- Modo offline e publicação nas lojas
- Push remoto dentro do Expo Go (no SDK 57 isso pede build de desenvolvimento)
- Pagamentos

## Fluxos

1. Fiel abre o app, vê a splash com o vídeo da logo e a sessão anônima é criada ou restaurada automaticamente.
2. Na Home vê destaque da edição, até 4 notícias e a programação do dia do recorte (calendário Recife: dia 5 até acabar o 5, depois o 6). Home, Notícias e Agenda escutam o Firestore.
3. Benfeitor: mesmo formulário e validações da web, grava em `benefactorLeads`. Máscara de celular e CPF. Se já cadastrou, abre a confirmação.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Pasta | `mobile/` (expo-router: `app/index` login, `app/(tabs)/{home,noticias,agenda,benfeitor,conta}`, `app/noticia/[id]`, `app/galeria`, `app/sobre`, `app/terco-restauracao`). A barra mostra Home, Notícias, Agenda e Benfeitor, com o círculo de menu no centro. Conta fica fora da barra e abre pela engrenagem do header. A folha abre o Terço da Restauração das Famílias e a coleção Arte Piedosa da Devotum no navegador; Voluntário, Fornecedor e Spotify continuam sem rota e Mapa do Evento fica indisponível |
| Coleções Firestore | `users`, `news`, `programItems`, `benefactorLeads`, `deviceTokens` |
| Papel necessário | `fiel` |

## Dados

Persistência de sessão via AsyncStorage (token do Firebase Auth no aparelho). Também no aparelho: a resposta ao pedido de notificação. O token Expo, quando a pessoa aceita, vai para `deviceTokens`.

## Regras de negócio

- Cadastro anônimo sempre cria `role: 'fiel'` (mesma regra da web; rules do Firestore continuam valendo)
- O app não oferece login, cadastro, Google, recuperação de senha ou logout
- O mesmo UID anônimo é usado por dados, localização, Quero ir e notificações
- Datas e recorte "hoje" seguem `lib/event/edition` (timezone America/Recife): antes do evento e no dia 5 mostra 5/02; depois da meia-noite do dia 5 mostra 6/02, e assim até 9/02

## Critérios de aceite

- [ ] `npx expo start` abre sem erro de bundle e o app roda no Expo Go
- [ ] Splash mostra o vídeo da logo sobre o mesmo roxo da tela, as logos da diocese e de São Pio X no rodapé, e libera quando a sessão resolve
- [ ] Sessão anônima é criada automaticamente e persiste ao reabrir
- [ ] Home abre diretamente, sem tela de login ou cadastro
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
