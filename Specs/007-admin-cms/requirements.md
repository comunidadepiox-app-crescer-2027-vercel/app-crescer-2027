# Requirements: 007-admin-cms Área administrativa

## Funcionais

- **RF-01** Só `admin` entra em `/admin/*`.
- **RF-02** Admin publica e edita notícias com capa.
- **RF-03** Admin mantém a programação.
- **RF-04** Admin edita textos de destaque.
- **RF-05** Admin vê leads e atualiza `status`.
- **RF-06** Writes são recusados pelas rules se não for admin.

## Não funcionais

- **RNF-01** UI de mesa de trabalho, sem dashboard vanity
- **RNF-02** Secret Cloudinary só no servidor
- **RNF-03** Autorização real no Firestore, não só na UI

## Papéis

| Ação | `fiel` | `admin` | Sem sessão |
|---|---|---|---|
| Abrir `/admin` | não | sim | não |
| Escrever `news` / `programItems` | não | sim | não |
| Ler leads | não | sim | não |

## LGPD

- Leads: admin é operador interno; não expor CPF em log de console
- Sem download em massa nesta versão
- Conta admin também é dado pessoal (e-mail)

## Dependências

- 001 (sessão e `users`)
- 003, 004, 005 (contratos)
- OPEN-QUESTIONS: primeiro admin, Cloudinary, Firebase

## Fora

User management, WYSIWYG, analytics.
