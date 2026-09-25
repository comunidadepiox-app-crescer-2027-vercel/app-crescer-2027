# Plan: 001-autenticacao Autenticação anônima do fiel

- Spec: [spec.md](spec.md)
- Status: `in-progress`

## Abordagem

O app Expo usará `signInAnonymously` uma vez por instalação. O `AuthProvider` restaura a sessão persistida, encerra sessões antigas de e-mail ou Google sem apagar dados, cria `users/{uid}` como `fiel` e libera a navegação quando o estado estiver pronto. O UID anônimo continuará sendo usado pelas integrações existentes.

A mesa web não será alterada: seu AuthProvider, login e autorização por `role: "admin"` permanecem.

## Arquivos previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/lib/firebase.js` | Firebase Auth e Firestore do app do fiel |
| `mobile/lib/authProvider.jsx` | restauração, autenticação anônima e perfil local do Firebase |
| `mobile/app/index.jsx` | inicialização e retry, sem formulário de login |
| `mobile/app/_layout.jsx` | splash e carregamento do AuthProvider |
| `mobile/app/(tabs)/_layout.jsx` | guard para sessão anônima |
| `mobile/app/(tabs)/conta.jsx` | nome escolhido e privacidade, sem e-mail/logout |
| `firestore.rules` | manter autenticação e isolamento por UID |
| `mobile/lib/errosAuth.js` | remover erros sem uso, se necessário |

## Firestore

O Anonymous Auth continua sendo `signedIn`. O documento `users/{uid}` mantém `role: "fiel"` e pode ser atualizado somente com `displayName` e `origem`. As subcoleções `queroIr`, tokens e leads continuam vinculadas ao UID da sessão.

## Ordem de entrega

1. Atualizar specs e tarefas.
2. Alterar AuthProvider para sessão anônima e retry.
3. Remover a tela de login/cadastro do fiel.
4. Alterar rota inicial e guards.
5. Adaptar Conta para nome e privacidade.
6. Remover dependências de OAuth sem uso.
7. Validar regras, integrações e builds.

## Riscos

| Risco | Mitigação |
|---|---|
| Firebase sem Anonymous Auth habilitado | Documentar a configuração e falhar com retry explícito |
| Sessão antiga restaurada do AsyncStorage | Encerrar apenas credenciais não anônimas, sem apagar dados |
| Loss de UID ao limpar dados do app | Aceitar como limitação de sessão anônima e documentar |
| Regras antigas pressupõem e-mail | Validar que UID anônimo é aceito e que isolamento permanece |

## Fora deste plan

Login/cadastro/Google/reset/logout do fiel, migração de dados antigos, mudanças no CMS admin.
