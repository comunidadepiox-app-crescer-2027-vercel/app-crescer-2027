# Plan: 002-navegacao-e-home Navegação e Home

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

Completar `app/(app)/layout.jsx` com header + nav (mobile first: barra inferior com os destinos principais; Galeria e Sobre no menu do header ou no overflow da barra, sem esconder destino). Home em `app/(app)/home/page.jsx` escuta notícias publicadas (até 4) e a programação do dia do recorte. Enquanto 003/004 não tiverem dados, a Home aceita estado vazio verdadeiro, não mock.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `app/(app)/layout.jsx` | shell + nav |
| `components/nav/AppNav.jsx` | destinos e estado ativo |
| `app/(app)/home/page.jsx` | seções Notícias e Hoje |
| `app/(app)/galeria/page.jsx` | casca da galeria |
| `app/(app)/sobre/page.jsx` | histórico curto + dados da comunidade |
| `lib/event/edition.js` | datas e nome da edição |
| `lib/news/queries.js` | últimas publicadas (pode nascer vazio e a 003 preenche) |
| `lib/program/queries.js` | itens do dia (a 004 preenche) |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `news` | autenticado, `published == true` | não nesta spec | `published`; ordem e limite (4 na Home) no client; `onSnapshot` |
| `programItems` | autenticado se publicado | não | `published`; recorte `date` no client; `onSnapshot` |
| `siteContent` | autenticado | não | doc `home` / `about` se existir |

## Cloudinary

Só consumir `coverUrl` já salvo.

## Ordem de entrega

1. `edition.js` com constante explícita.
2. Nav com sete destinos e páginas-casca.
3. Home: seções e estados vazios.
4. Ligar queries quando 003/004 existirem (não bloquear a nav).
5. Sobre com texto fiel ao histórico oficial (sem travessão).

## Riscos

| Risco | Mitigação |
|---|---|
| 003/004 ainda não validadas | Home funciona vazia; sem fake data |
| Muitos itens na nav mobile | Primários na barra; Galeria/Sobre no header |
| Timezone de Campina Grande | Avaliar datas em `America/Recife` |

## App (barra atual)

No Expo, a barra é Home, Notícias, círculo de menu, Programação e Benfeitor (`mobile/components/BarraAbas.jsx`). O header mostra **COLABORE** e o ícone de informação. A folha (`mobile/components/MenuAtalhos.jsx`) abre o Terço, a Liturgia Diária, Participar, Colabore, a coleção Arte Piedosa da Devotum, a página visual de Fornecedor e a escolha de equipe de Voluntário com o formulário do Food Park (017). Spotify continua informativo. Mapa do Evento ocupa um atalho desativado, até que exista destino aprovado.

## Atalhos externos e indisponíveis

- Loja usa `Linking.openURL` para abrir `https://usedevotum.com.br/colecao-arte-piedosa/` fora do app.
- Mapa do Evento não recebe `onPress`; usa baixa opacidade e estado de acessibilidade `disabled`, sem sugerir que haja um mapa disponível.
- A grade passa a comportar seis itens sem reduzir a área de toque dos atalhos acionáveis.

## Fora deste plan

CMS, detalhe da notícia, grade completa do cronograma, formulário Benfeitor.
