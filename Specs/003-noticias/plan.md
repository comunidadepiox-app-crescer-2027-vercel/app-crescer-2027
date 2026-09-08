# Plan: 003-noticias Notícias

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

Coleção `news` + queries em `lib/news/`. Páginas de lista e detalhe no grupo `(app)`. Regras Firestore: autenticado lê publicado; admin lê e escreve tudo (detalhe na 007, mas a regra de leitura do fiel nasce aqui).

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `lib/news/queries.js` | listar publicadas, obter por id |
| `app/(app)/noticias/page.jsx` | lista |
| `app/(app)/noticias/[id]/page.jsx` | detalhe |
| `components/news/NewsList.jsx` | item da lista |
| `firestore.rules` | leitura fiel = `published` |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `news` | autenticado se `published`; admin todos | só admin (007) | `published`; ordem `publishedAt` no client; lista com `onSnapshot` |

## Cloudinary

Exibir `coverUrl`. Transformações de tamanho (ex.: `c_fill,w_1200`) só se o cloud name existir.

## Ordem de entrega

1. Contrato e regras de leitura.
2. Queries.
3. Lista + detalhe + vazios.
4. Ligar seção da Home à mesma query.

## Riscos

| Risco | Mitigação |
|---|---|
| HTML inseguro no `body` | Texto simples na v1; se HTML, sanitizar |
| Sem índice composto | Criar índice `published` + `publishedAt` |

## Fora deste plan

Upload, editor admin, import do site.
