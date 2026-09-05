# Requirements: 006-configuracao Configuração

## Funcionais

- **RF-01** Fiel vê e-mail e edita o nome.
- **RF-02** Fiel sai da sessão.
- **RF-03** Admin vê entrada para o CMS.
- **RF-04** Texto de privacidade lista conta e lead Benfeitor.

## Não funcionais

- **RNF-01** Tela sóbria, uma coluna
- **RNF-02** `role` não editável

## Papéis

| Ação | `fiel` | `admin` | Sem sessão |
|---|---|---|---|
| Ver configuração | sim | sim | não |
| Ver link admin | não | sim | não |

## LGPD

- Dados exibidos: e-mail, nome
- Finalidade: gestão da própria conta
- Onde: Auth + `users`
- Exclusão: processo manual até decisão em OPEN-QUESTIONS

## Dependências

- 001, 002
- 007 para o destino `/admin` (o link pode aparecer antes se a rota-casca existir)

## Fora

Temas, push, delete automático.
