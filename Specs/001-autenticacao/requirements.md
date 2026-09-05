# Requirements: 001-autenticacao Autenticação e tela de início

## Funcionais

- **RF-01** O fiel cria conta com e-mail e senha.
- **RF-02** O fiel entra com e-mail e senha.
- **RF-03** O fiel entra com Google.
- **RF-04** O primeiro acesso cria `users/{uid}` com `role: fiel`.
- **RF-05** Rotas internas exigem sessão.
- **RF-06** `/` com sessão redireciona para `/home`.
- **RF-07** O fiel pode pedir e-mail de redefinição de senha.

## Não funcionais

- **RNF-01** Identidade da spec 000 / DESIGN.md
- **RNF-02** Firebase Auth no client; sem backend próprio nesta fase
- **RNF-03** Formulários usáveis no mobile (toque, teclado e-mail)
- **RNF-04** Senha nunca aparece em log ou Firestore

## Papéis

| Ação | `fiel` | `admin` | Sem sessão |
|---|---|---|---|
| Ver `/` | redirect `/home` | redirect `/home` | sim |
| Criar conta | n/a | n/a | sim |
| Entrar | n/a (já está) | n/a | sim |
| Ver `/home` | sim | sim | não |

## LGPD

- Dados: e-mail; nome e foto se o Google enviar
- Finalidade: conta e identificação no app
- Aviso: texto curto na tela de cadastro
- Onde: Firebase Auth + Firestore `users`
- Quem lê: o próprio usuário; admin na spec 007 se necessário

## Dependências

- Spec 000 `validated` (ou pelo menos tokens e scaffold prontos)
- Projeto Firebase com e-mail/senha e Google habilitados
- Domínio autorizado no OAuth

## Fora

Perfil editável, CMS, recuperação além do e-mail do Firebase.
