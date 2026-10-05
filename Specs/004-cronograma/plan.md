# Plan: 004-cronograma Cronograma

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

Uma coleção plana `programItems` filtrada por `published` no Firestore e recortada por `date` no client, agrupada por `space`. Dias da edição vêm de `edition.js`. A Home escuta a mesma coleção e mostra o dia do recorte.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `lib/program/spaces.js` | enum e rótulos oficiais |
| `lib/program/queries.js` | por data; publicados |
| `lib/program/day.js` | resolver “hoje / primeiro / último” |
| `app/(app)/cronograma/page.jsx` | página |
| `components/program/DaySwitcher.jsx` | troca de dia (não pílula) |
| `components/program/SpaceSection.jsx` | bloco de um espaço |
| `mobile/lib/programa.js` | espelho do enum, porque o app Expo não importa `lib/` do site |
| `firestore.rules` | leitura autenticada de publicados |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `programItems` | autenticado se `published` | admin (007) | `published`; o recorte por `date` e a ordem são no client |

## Cloudinary

Não.

## Ordem de entrega

1. Enum de espaços e labels.
2. Queries e resolvedor de dia.
3. Página `/cronograma`.
4. Ligar seção da Home.
5. Aviso de alteração.

## Riscos

| Risco | Mitigação |
|---|---|
| Edição 2026 vs 2027 | `edition.js` isolado; itens carregam a própria `date` |
| Muitos itens no Palco Principal | lista simples, sem accordion decorativo obrigatório |

## Fora deste plan

Editor admin, notificações.
