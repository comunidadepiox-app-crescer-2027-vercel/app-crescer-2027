# Spec: 009-anuncios Anúncios na Home

- Status: `in-progress`
- Complexidade: `media`
- Personas: `admin` (publica); `fiel` (vê no app)
- Depende de: [007-admin-cms](../007-admin-cms/), [008-app-react-native](../008-app-react-native/)

## Problema

A equipe precisa mostrar um cartaz vertical na Home do app, com link opcional, sem publicar uma notícia para isso.

## Escopo

### Entra

- `/admin/anuncios`: criar, editar, ativar, desativar e excluir
- Imagem vertical no Cloudinary e URL opcional
- Pré-visualização no formato do celular, na mesa
- No app, na primeira abertura da Home de cada dia (America/Fortaleza), pilha com todos os anúncios ativos
- O mais recente fica na frente; o X tira só esse; o de trás já está visível
- Toque na imagem abre o link, se houver

### Não entra

- O mesmo modal na Home do site
- Data de início e fim
- Mais de um link por anúncio

## Fluxos

1. Admin envia a imagem, cola o link se quiser, deixa ativo e salva.
2. Fiel abre a Home pela primeira vez no dia e vê a pilha.
3. Fecha o da frente; o próximo aparece. No mesmo dia, reabrir a Home não mostra de novo.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota | `/admin/anuncios` |
| Tela | Home do app (`mobile/app/(tabs)/home`) |
| Coleção | `announcements` |
| Cloudinary | `announcements/` |
| Papel | admin escreve; fiel autenticado lê os ativos |

## Dados

Coleção `announcements/{id}`

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `imageUrl` | string | sim | URL Cloudinary |
| `imagePublicId` | string | sim | |
| `linkUrl` | string | não | http ou https |
| `active` | bool | sim | |
| `createdAt` | timestamp | sim | o mais novo fica na frente |
| `updatedAt` | timestamp | sim | |

## Regras de negócio

- Fiel só lê `active == true`.
- Ordem: `createdAt` decrescente.
- O dia visto fica no aparelho. Fechar o app no meio da pilha não reabre no mesmo dia.
- Sem imagem, o admin não salva.

## Critérios de aceite

- [ ] Admin publica anúncio e vê a miniatura na lista
- [ ] App mostra a pilha só na primeira Home do dia
- [ ] X revela o anúncio de trás
- [ ] Toque abre o link quando existe
- [ ] Anúncio inativo não entra na pilha

## Anti-slop

Cartaz com a imagem enviada, botão X e nada de carrossel com bolinhas nem texto de marketing por cima da arte.

## Referências

- Specs 007 e 008
