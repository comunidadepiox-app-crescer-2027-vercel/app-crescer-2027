# Plan: 001-autenticacao Autenticação e tela de início

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

Cliente Firebase no browser (`lib/firebase/client.js`). Contexto ou hook de sessão (`AuthProvider`) no `layout` autenticável. A rota `/` vira a tela de início e substitui o placeholder da spec 000. Middleware ou guard client-side protege o grupo de rotas internas. Preferir um `app/(app)/` group para Home e irmãs, e deixar `/` fora.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `lib/firebase/client.js` | `initializeApp`, Auth, Firestore |
| `lib/auth/AuthProvider.jsx` | estado do usuário e `role` |
| `lib/auth/guards.js` | redirect sem sessão / com sessão |
| `app/page.jsx` | tela de início (login + cadastro) |
| `app/(app)/layout.jsx` | shell autenticado (nav entra na 002; aqui só exige sessão) |
| `firestore.rules` | `users`: o uid escreve o próprio doc, sem aceitar `role: admin` vindo do client |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `users` | o próprio uid; admin lê todos (007) | create/update do próprio perfil, `role` imutável pelo client | `users/{uid}` |

Regras de segurança a prever:

- `request.auth.uid == userId` para create/update
- No create, `role == 'fiel'`
- Update não pode alterar `role`

## Cloudinary

Não usa.

## Ordem de entrega

1. Cliente Firebase + env.
2. Regras `users`.
3. AuthProvider e guards.
4. Formulário de início (login/cadastro e-mail).
5. Google.
6. Reset de senha.
7. Remover placeholder da spec 000.

## Riscos

| Risco | Mitigação |
|---|---|
| Domínio não autorizado no Google Cloud | Documentar em OPEN-QUESTIONS; testar em localhost |
| Usuário cria `admin` pelo DevTools | Regra Firestore recusa |
| Popup do Google bloqueado no mobile | Ter fallback `signInWithRedirect` |

## Fora deste plan

UI da Home, nav completa, perfil editável.
