# Plan: 009-anuncios Anúncios na Home

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

Coleção `announcements` escrita só pelo admin. O app escuta os ativos, ordena por `createdAt` e mostra a pilha sempre que o app fica ativo.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `app/admin/anuncios/page.jsx` | lista, formulário e prévia do celular |
| `lib/admin/announcements.js` | writes |
| `mobile/lib/anuncios.js` | escuta dos ativos |
| `mobile/components/PilhaAnuncios.jsx` | pilha na Home |
| `firestore.rules` | leitura do ativo; escrita admin |
| `firestore.indexes.json` | `active` + `createdAt` desc |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `announcements` | fiel se `active == true`; admin todos | só admin | `where active == true` + `orderBy createdAt desc` |

## Cloudinary

Pasta `announcements/`, só imagem, pelo Route Handler já usado na capa.

## Ordem de entrega

1. Rules e índice.
2. CRUD na mesa.
3. Pilha na Home do app.

## Riscos

| Risco | Mitigação |
|---|---|
| Índice composto ausente | Declarar em `firestore.indexes.json` |
| Trocar de aba reabre a pilha | Só recolocar a fila quando o app fica ativo |

## Fora deste plan

Home do site, agendamento por data.
