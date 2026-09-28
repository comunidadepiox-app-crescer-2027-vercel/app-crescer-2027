# Spec: 001-autenticacao Autenticação anônima do fiel

- Status: `in-progress` (implementação iniciada; validação end-to-end aguarda Firebase configurado)
- Complexidade: `alta`
- Personas: `fiel` e `admin`
- Depende de: [000-fundacao-e-identidade](../000-fundacao-e-identidade/)

> **Superfície web administrativa preservada.** O site Next.js continua sendo somente a mesa administrativa (`/admin`). O app do fiel usa Firebase Anonymous Auth, sem tela de login ou cadastro.

## Problema

O fiel não deve precisar criar credenciais para usar o aplicativo. Cada instalação precisa de uma sessão técnica persistente para acessar rotas, dados e integrações que dependem de um `uid`.

## Escopo

### Entra

- Autenticação anônima automática no primeiro uso
- Persistência da sessão anônima com Firebase Auth e AsyncStorage
- Criação idempotente de `users/{uid}` com `role: "fiel"`
- Proteção das rotas internas
- Redirecionamento da rota inicial para `/home`
- Retry quando o Anonymous Auth falhar
- Manutenção do login protegido da mesa administrativa

### Não entra

- Login e cadastro do fiel
- E-mail, senha, Google e recuperação de senha no app do fiel
- Logout do fiel
- Migração ou exclusão de dados preexistentes
- Alteração da autorização da mesa administrativa

## Fluxos

1. Primeiro uso: o app inicia uma sessão anônima e cria `users/{uid}`.
2. Reabertura: a sessão anônima persistida é restaurada e o app abre em `/home`.
3. Falha de autenticação: a splash permanece até uma ação de retry concluir.
4. Sessão antiga de e-mail ou Google: a sessão é encerrada e substituída por uma sessão anônima, sem apagar os dados antigos.
5. Rota interna: espera a sessão anônima antes de renderizar o conteúdo.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota inicial | `/` |
| Coleção Firestore | `users` |
| Sessão | Firebase Anonymous Auth persistido em AsyncStorage |
| Papel | `fiel` no app; `admin` apenas na mesa web |

## Dados

Coleção `users/{uid}`:

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `displayName` | string | não | Nome escolhido no app. Em 28/09/2026 nenhuma tela o edita |
| `email` | string | não | Não preenchido no app do fiel |
| `role` | `'fiel'` \| `'admin'` | sim | Criado como `fiel`; nunca promovido pelo client |
| `createdAt` | timestamp | sim | |
| `origem` | object | não | Coordenada do antigo aviso de saída. Retirada em 28/09/2026, junto com a localização. Documento antigo pode ter o campo; nada mais o escreve |

## Regras de negócio

- O app do fiel sempre inicia uma sessão anônima automaticamente.
- O `uid` da sessão anônima é a identidade técnica das integrações do aparelho.
- O cliente não altera `role`, não acessa outro `uid` e não altera `email`.
- A sessão antiga de e-mail ou Google é encerrada localmente, sem migração ou exclusão dos dados existentes.
- O login admin da web continua separado e protegido.
- Não existe tela de login, cadastro, Google, recuperação ou logout no app do fiel.

## Critérios de aceite

- [ ] O primeiro uso cria uma sessão anônima e abre `/home`
- [ ] A reabertura restaura a mesma sessão anônima
- [ ] Não existe tela de login ou cadastro no app do fiel
- [ ] Falha de autenticação oferece retry e não libera rotas indevidamente
- [ ] `users/{uid}` existe com `role: "fiel"`
- [ ] News, Agenda, a campanha do Benfeitor, o Avise-me e o push continuam usando o UID anônimo
- [ ] A mesa administrativa continua protegida por login e `role == admin`

## Referências

- Specs 005, 006, 007, 008, 010 e 011
- Firebase Anonymous Auth
