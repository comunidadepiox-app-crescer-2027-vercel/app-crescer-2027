# Spec: 003-noticias Notícias

- Status: `in-progress` (implementada; validação com dados reais aguarda Firebase configurado)
- Complexidade: `media`
- Personas: `fiel` (leitura); escrita é 007
- Depende de: [001-autenticacao](../001-autenticacao/), [002-navegacao-e-home](../002-navegacao-e-home/)

## Problema

O fiel precisa ler as novidades da comunidade no próprio app, no mesmo tom do site oficial, sem ir ao WordPress.

## Escopo

### Entra

- `/noticias` lista só itens `published == true`, mais recentes primeiro
- `/noticias/[id]` mostra título, data, capa, autor (nome e foto) e corpo
- Capa via URL Cloudinary gravada no documento
- Estado vazio e estado “não encontrada”
- Home (002) consome as últimas 4 publicadas com a mesma escuta

### Não entra

- Formulário de publicação (007)
- Comentários, like, compartilhamento social embutido
- Categorias ou tags nesta versão
- Importação automática do WordPress

## Fluxos

1. Nav Notícias → lista.
2. Abre uma notícia → detalhe.
3. Notícia inexistente ou não publicada → mensagem e volta à lista (fiel nunca vê rascunho).

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rotas | `/noticias`, `/noticias/[id]` |
| Coleção | `news` |
| Cloudinary | `news/` (upload na 007; aqui só exibe) |
| Papel | autenticado |

## Dados

Coleção `news/{id}`

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `title` | string | sim | |
| `body` | string | sim | texto simples antigo, ou HTML sanitizado do editor (007) |
| `authorName` | string | não | byline |
| `authorPhotoUrl` | string | não | URL Cloudinary |
| `authorPhotoPublicId` | string | não | para o admin substituir depois |
| `coverUrl` | string | não | URL Cloudinary |
| `coverPublicId` | string | não | para o admin substituir depois |
| `published` | bool | sim | |
| `publishedAt` | timestamp | se publicado | |
| `createdAt` | timestamp | sim | |
| `updatedAt` | timestamp | sim | |
| `authorUid` | string | sim | admin que publicou |

## Regras de negócio

- Fiel só lê `published == true`.
- Data exibida em português, formato curto (ex.: 16 de junho de 2026), sem travessão.
- Corpo antigo, sem tag HTML, continua em parágrafos separados por linha em branco.
- Corpo HTML só entra na tela depois de sanitizar (tags de texto, lista, link, imagem, vídeo e botão). Script não passa.

## Critérios de aceite

- [ ] Lista mostra só publicadas, ordem decrescente de `publishedAt`
- [ ] Detalhe renderiza capa, título, data, autor (quando houver) e corpo
- [ ] Rascunho não abre para `fiel`
- [ ] Estado vazio existe
- [ ] Cards não são pílulas nem grade de três iguais obrigatória

## Anti-slop

Lista editorial (título + data + recorte), não “blog cards” genéricos com overlay gradiente.

## Referências

- Novidades do site: https://encontrodafamiliacatolica.com.br/
