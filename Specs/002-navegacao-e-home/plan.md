# Plan: 002-navegacao-e-home Navegação e Home

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

Completar `app/(app)/layout.jsx` com header + nav (mobile first: barra inferior com os destinos principais; Galeria e Sobre no menu do header ou no overflow da barra, sem esconder destino). Home em `app/(app)/home/page.jsx` lê notícias publicadas e itens do dia. Enquanto 003/004 não estiverem no Firestore, a Home aceita estado vazio verdadeiro, não mock de mentira.

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
| `news` | autenticado, `published == true` | não nesta spec | `published`, `publishedAt` desc, limit 3–5 |
| `programItems` | autenticado | não | `date == hoje` (+ `space`, `order`) |
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

## Fora deste plan

CMS, detalhe da notícia, grade completa do cronograma, formulário Benfeitor.
