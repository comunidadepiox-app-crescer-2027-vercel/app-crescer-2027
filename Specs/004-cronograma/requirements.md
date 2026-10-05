# Requirements: 004-cronograma Cronograma

## Funcionais

- **RF-01** Fiel vê a programação por dia e por espaço.
- **RF-02** Os oito espaços do site oficial existem no enum.
- **RF-03** A Home reutiliza o recorte do dia.
- **RF-04** Existe aviso de que horários podem mudar.

## Não funcionais

- **RNF-01** Sem pílulas de categoria
- **RNF-02** Datas/horários em Recife
- **RNF-03** Lista legível em uma coluna no mobile

## Papéis

| Ação | `fiel` | `admin` | Sem sessão |
|---|---|---|---|
| Ver publicados | sim | sim | não |
| Criar/editar item | não | 007 | não |

## LGPD

Não coleta.

## Dependências

- 001, 002
- 007 para cadastro; seed manual possível no console

## Fora

Push, mapa, import WordPress.
