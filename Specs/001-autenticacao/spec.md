# Spec: 001-autenticacao Autenticação e tela de início

- Status: `in-progress` (implementada; validação end-to-end aguarda o `.env.local` com as chaves do Firebase)
- Complexidade: `alta`
- Personas: `fiel` (o admin também entra por aqui)
- Depende de: [000-fundacao-e-identidade](../000-fundacao-e-identidade/)

## Problema

O fiel precisa entrar no WebApp com e-mail ou Google antes de ver Home, notícias e cronograma. Sem sessão, o produto não abre as páginas internas.

## Escopo

### Entra

- Tela de início em `/` com login e cadastro
- E-mail + senha (criar conta e entrar)
- Google Sign-In
- Criação do documento `users/{uid}` no primeiro acesso (`role: fiel`, nome, e-mail, `createdAt`)
- Proteção das rotas internas: sem sessão, redireciona para `/`
- Com sessão, `/` redireciona para `/home`
- Mensagens de erro legíveis (credencial inválida, e-mail em uso)

### Não entra

- Recuperação de senha avançada além do reset nativo do Firebase (pode ser um link “Esqueci a senha” usando `sendPasswordResetEmail`)
- Edição de perfil (spec 006)
- Promoção a admin (spec 007 / OPEN-QUESTIONS)
- Captcha customizado

## Fluxos

1. Fiel novo: cadastro com e-mail e senha → documento `users` → `/home`.
2. Fiel existente: login e-mail/senha → `/home`.
3. Fiel com Google: popup/redirect → documento `users` se for o primeiro uid → `/home`.
4. Sessão inválida em rota interna → `/`.
5. Sessão válida em `/` → `/home`.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota App Router | `/` |
| Coleção Firestore | `users` |
| Pasta Cloudinary | nenhuma |
| Papel necessário | sem sessão na tela; autenticado depois |

## Dados

Coleção `users/{uid}`

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `displayName` | string | não | Google pode trazer; cadastro e-mail pode ficar vazio até a 006 |
| `email` | string | sim | (LGPD) |
| `role` | `'fiel'` \| `'admin'` | sim | default `fiel`; nunca `admin` pelo client no cadastro |
| `createdAt` | timestamp | sim | |
| `photoURL` | string | não | só se o Google enviar |

## Regras de negócio

- Cadastro pelo client sempre grava `role: fiel`.
- Não existe atalho para virar admin nesta spec.
- Senha mínima: 6 caracteres (limite do Firebase Auth), comunicada no formulário.
- A tela de início usa a identidade da spec 000, não um card centralizado de SaaS.

## Critérios de aceite

- [ ] Dá para criar conta com e-mail e senha e cair em `/home`
- [ ] Dá para entrar com Google e cair em `/home`
- [ ] Documento `users/{uid}` existe após o primeiro login
- [ ] Sem sessão, `/home` (e demais internas) voltam para `/`
- [ ] Logado, `/` não mostra o formulário de novo
- [ ] Botões têm destino real (entrar, criar conta, Google, esqueci a senha)
- [ ] Copy sem travessão; layout alinhado à esquerda, logo como único centro possível

## Anti-slop

Proibido hero “Bem-vindo à jornada”, pílulas “Entrar com”, gradiente no fundo, três social buttons inventados. Só e-mail e Google.

## Referências

- Specs irmãs: 000, 002, 006, 007
- Firebase Auth: e-mail/senha + Google provider
