# Plan: 006-configuracao Configuração

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

Página simples no grupo `(app)`. Lê `user` do AuthProvider. Update via `updateProfile` + `updateDoc`. Sign-out no mesmo módulo de auth da 001.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `app/(app)/configuracao/page.jsx` | tela |
| `lib/auth/updateProfile.js` | nome no Auth + Firestore |
| `lib/auth/signOut.js` | encerrar sessão |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `users` | próprio uid | `displayName` do próprio uid | doc id |

`role` continua imutável pelo client (regra da 001).

## Cloudinary

Não.

## Ordem de entrega

1. Página somente leitura (e-mail, nome, role oculta).
2. Salvar nome.
3. Sair.
4. Atalho admin + texto de privacidade.

## Riscos

| Risco | Mitigação |
|---|---|
| Auth e Firestore dessincronizados | escrever nos dois no mesmo fluxo; erro visível |
| Fiel vê `/admin` | link condicional a `role`; a rota em si é da 007 |

## Fora deste plan

Delete account, troca de senha avançada (reset já está na 001).
