# Spec: 002-navegacao-e-home Navegação e Home

- Status: `in-progress` (implementada; seções com dados reais aguardam Firebase configurado)
- Complexidade: `alta`
- Personas: `fiel`
- Depende de: [001-autenticacao](../001-autenticacao/); consome recortes de [003-noticias](../003-noticias/) e [004-cronograma](../004-cronograma/)

> **Superfície web retirada.** O site Next.js é só a mesa administrativa (`/admin`). Home e navegação do fiel desta spec vivem no app Expo, spec [008](../008-app-react-native/spec.md).

> **O que mudou em 28/09/2026.** A barra inferior continua com quatro posições, mas Benfeitor deixou de ser rota e virou link externo para o site da campanha, ver [005](005-benfeitor-da-fe/spec.md). O header trocou INSCREVA-SE por **PARTICIPAR** e a engrenagem pelo ícone de informação, que abre a página do app, ver [006](006-sobre-o-app/spec.md). A folha central ganhou o atalho **Participar**. O destino do Participar é o site oficial do evento, e o endereço ainda não foi informado pela comunidade: o app tem a constante vazia e um aviso honesto enquanto isso. A folha ganhou também o atalho **Congresso**, visivelmente indisponível enquanto o destino não existir.

> **O que mudou em 01/10/2026.** Benfeitor voltou a ser aba de verdade e o item de link externo saiu da barra. O link externo no lugar da tela quebrava o app num link que fingia ser página. O CTA da Home abre `/benfeitor` em vez do site da campanha.

> **O que mudou em 29/09/2026.** O botão do header passou a ser **COLABORE** e abre a oferta pelo PIX, ver [014](014-doacao/spec.md). **Participar** saiu do header e permanece na folha. A folha ganhou o atalho **Colabore**, logo depois de Participar.

> **O que mudou em 01/10/2026.** A folha ganhou o atalho **Liturgia Diária**, logo depois do Terço da Restauração das Famílias. Ele abre `/liturgia` e mostra o texto do dia buscado de uma API pública, no mesmo desenho do Terço, ver [015](015-liturgia-diaria/spec.md).

## Problema

Depois do login, o fiel precisa de um ponto de chegada que mostre o dia do evento, as notícias recentes e um caminho fixo para as outras páginas.

## Escopo

### Entra

- Shell autenticado com navegação persistente
- Barra inferior: Home, Notícias, círculo de menu, Programação, Benfeitor da Fé
- Benfeitor da Fé é aba de novo: abre a tela da campanha dentro do app (005)
- Header com o botão **COLABORE**, que abre `/colabore` (spec 014), e, à direita dele, o ícone de informação, que abre `/sobre-o-app` (spec 006)
- Folha do círculo: Terço da Restauração das Famílias abre sua rota própria (011); Liturgia Diária abre `/liturgia`, logo depois do Terço, com o texto do dia vindo de API pública (015); Loja e Participar abrem endereço externo no navegador; Colabore abre `/colabore` (014); Fornecedor abre a página visual `/fornecedor` (012); Testemunhos abre o formulário de envio do fiel (013); Voluntário abre o formulário oficial de inscrição de servos (017); Spotify segue só com ícone e rótulo nesta entrega; Mapa do Evento aparece indisponível, sem ação
- Destinos extras (prompt: “outras que forem importantes”): Galeria, Sobre, Liturgia Diária
- `/home` com:
  - seção de notícias (até 4 publicadas, capa + título + data; escuta ao vivo)
  - seção de cronograma do dia do recorte (todos os espaços e horários daquela data; escuta ao vivo)
- Páginas-casca de `/galeria` e `/sobre` (conteúdo institucional mínimo; galeria completa pode listar álbuns depois)
- Estado vazio honesto quando não houver notícia ou quando a data estiver fora do evento

### Não entra

- CRUD de notícia ou programação (007)
- Detalhe completo da notícia (003 implementa; a Home só aponta)
- Programação completa por abas de espaço (004)
- Página de campanha do Benfeitor no app (005 arquivou a tela)
- Destino de Santo Terço e Spotify; Voluntário passou a ter rota na spec 017
- O endereço do Participar, que a comunidade ainda não informou

## Fluxos

1. Fiel autenticado cai em `/home`.
2. Toca uma notícia → `/noticias/[id]`.
3. Toca “ver cronograma” ou um horário → `/cronograma` (com âncora do dia, se já existir na 004).
4. A barra leva a Home, Notícias, Programação e Benfeitor por rota. O item ativo fica dourado, sem pílula.
5. Toca no ícone de informação → `/sobre-o-app`. Nenhuma aba fica ativa, porque a página está fora do grupo de abas.
6. O círculo abre a folha por cima da tela. Fecha ao tocar de novo no círculo, no fundo escuro ou ao arrastar para baixo. O Terço, a Liturgia Diária, o Colabore, o Fornecedor, o Voluntário, o Fale Conosco e os Testemunhos abrem suas rotas; Loja e Participar abrem endereço externo; Spotify não navega. Mapa do Evento fica visivelmente indisponível e não responde ao toque.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rotas | `/home`, `/galeria`, `/sobre`, `/sobre-o-app`, `/fale-conosco` |
| Coleções lidas | `news`, `programItems` (e/ou `programDays`), `siteContent` |
| Cloudinary | URLs de capa já gravadas na notícia |
| Papel | `fiel` ou `admin` autenticado |

## Dados

Esta spec **lê**, não cria contrato novo. Contratos oficiais: 003, 004 e `siteContent` (textos da Home/Sobre, criado na 007; até lá, copy estática fiel ao site).

Regra de recorte do dia (calendário civil em `America/Recife`, meia-noite a meia-noite):

- Antes de 5/02/2027: Home mostra a programação do dia **5** (primeiro dia) + aviso de que o encontro ainda não começou.
- No dia 5: continua o dia 5 até o dia acabar.
- No dia 6: passa a ser o dia 6; o mesmo para 7, 8 e 9.
- Depois de 9/02/2027: mostra o último dia + aviso da última jornada.

A Home lista até 4 notícias publicadas (as mais recentes) e **toda** a programação do dia do recorte. Home, Notícias e Cronograma escutam o Firestore (`onSnapshot`): o que o admin publica aparece sem recarregar o app.

Datas da edição: constante em `lib/event/edition.js` (5 a 9 de fevereiro de 2027).

## Regras de negócio

- Nav sempre visível nas rotas do grupo `(app)`.
- Nenhum item da barra sem destino. Na folha, Terço, Liturgia Diária, Loja, Participar, Colabore, Fornecedor, Voluntário e Testemunhos são acionáveis nesta entrega; Congresso e Mapa do Evento são exceções deliberadas, expostas como controles desativados enquanto seus destinos não estiverem disponíveis.
- Benfeitor é link externo e não é `Tabs.Screen`. Um item de link não fica ativo dourado, porque não existe rota para ele.
- O destino do Participar vive em `mobile/lib/links.js`. Enquanto a constante estiver vazia, o toque mostra um aviso curto de que o endereço entra em breve, em vez de não fazer nada nem abrir uma página em branco.
- Home não inventa estatística ("milhares de famílias").
- Link de Caravanas no Sobre ou rodapé da Home aponta para o site oficial, não abre produto interno.

## Critérios de aceite

- [ ] Os destinos da nav existem e abrem página real ou site real
- [ ] Home mostra bloco de notícias e bloco do dia
- [ ] Fora das datas do evento, o aviso existe e não é um número hero
- [ ] Sem sessão, `/home` redireciona (spec 001)
- [ ] Item ativo da barra é dourado, sem pílula. O círculo laranja do centro é o controle do menu
- [ ] A barra mostra Home, Notícias, Programação e Benfeitor, com o círculo no meio
- [ ] Benfeitor abre o site da campanha no navegador e não pisca em branco ao toque
- [ ] O header mostra **COLABORE**, que abre `/colabore`, e, à direita, o ícone de informação, que abre `/sobre-o-app`
- [ ] A folha lista Terço, Liturgia Diária, Participar, Colabore, Congresso, Loja, Voluntário, Testemunhos, Fornecedor, Spotify e Mapa do Evento, e fecha no círculo, no fundo ou no arraste
- [ ] Voluntário abre `/voluntario` com o formulário oficial de inscrição de servos, sem sair do app
- [ ] Liturgia Diária aparece logo depois do Terço, com ícone de linha, e abre `/liturgia` fechando a folha
- [ ] Congresso aparece indisponível, com a mesma semântica do Mapa do Evento, e não responde ao toque
- [ ] A grade da folha é de três colunas empacotadas pela esquerda: a linha cheia fica distribuída e a linha com sobras não abre vão no meio, com um item encostado no outro
- [ ] Loja e Participar abrem endereço externo; com o Participar sem endereço, o toque avisa em vez de falhar em silêncio
- [ ] Colabore na folha fecha o menu e abre `/colabore`
- [ ] Mapa do Evento tem aparência e semântica de indisponível e não responde ao toque

## Anti-slop

Home não é bento de três cards iguais, nem hero com gradiente e CTA órfão. Tipografia à esquerda, foto real se houver, seções empilhadas como um jornal do evento.

## Referências

- Site: https://encontrodafamiliacatolica.com.br/
- Programação: https://encontrodafamiliacatolica.com.br/programacao/
