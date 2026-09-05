# Requirements: 003-noticias Notícias

## Funcionais

- **RF-01** Lista autenticada de notícias publicadas.
- **RF-02** Detalhe autenticado de notícia publicada.
- **RF-03** Fiel não lê rascunho.
- **RF-04** Home reutiliza a listagem limitada.

## Não funcionais

- **RNF-01** Identidade editorial, sem overlay gradiente
- **RNF-02** Imagens via Cloudinary URL
- **RNF-03** Datas em português, timezone Recife

## Papéis

| Ação | `fiel` | `admin` | Sem sessão |
|---|---|---|---|
| Listar publicadas | sim | sim | não |
| Ver rascunho | não | sim (007) | não |
| Publicar | não | 007 | não |

## LGPD

Não coleta do fiel. `authorUid` é dado operacional do admin.

## Dependências

- 001, 002
- 007 para popular conteúdo (pode haver seed manual no console)

## Fora

CMS, categorias, sync WordPress.
