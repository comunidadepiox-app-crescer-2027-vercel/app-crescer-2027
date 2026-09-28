# Requirements: 001-autenticacao Autenticação anônima do fiel

## Funcionais

- **RF-01** O primeiro uso inicia uma sessão Firebase Anonymous Auth sem interação.
- **RF-02** A sessão anônima persiste no aparelho e mantém o mesmo `uid`.
- **RF-03** O primeiro acesso cria `users/{uid}` com `role: "fiel"`.
- **RF-04** As rotas internas esperam a sessão anônima.
- **RF-05** A rota inicial redireciona para `/home` quando a sessão está pronta.
- **RF-06** Falha de autenticação apresenta retry.
- **RF-07** A mesa administrativa continua usando login por e-mail e senha.

## Não funcionais

- **RNF-01** Identidade da spec 000 / DESIGN.md
- **RNF-02** Firebase Auth no client, sem backend de autenticação próprio
- **RNF-03** Nenhuma credencial, senha ou token de usuário é salvo pelo app do fiel
- **RNF-04** O UID anônimo não é apresentado como identidade verificável da pessoa

## Papéis

| Ação | `fiel` anônimo | `admin` web | Sem sessão |
|---|---|---|---|
| Abrir o app do fiel | sim | sim | autentica anonimamente |
| Ver rotas internas | sim | sim | aguarda autenticação |
| Criar conta | não existe | não existe | não existe |
| Entrar no app do fiel | não existe | não existe | não existe |
| Abrir mesa admin | não | sim | redireciona para login |

## LGPD

- Dados do app: nome escolhido, o que a pessoa escreveu nos formulários do próprio app, o lembrete de Avise-me e o token do aparelho
- A localização saiu em 28/09/2026, junto com o aviso de saída. O app não pede mais permissão de GPS
- O e-mail não é coletado pelo app do fiel
- O UID anônimo identifica a instalação para integrar as funcionalidades, não uma pessoa de forma verificável
- O Firebase Auth e o Firestore continuam sendo os locais de armazenamento

## Dependências

- Firebase com Anonymous Auth habilitado
- AsyncStorage para persistência da sessão
- Regras Firestore que aceitem `signedIn`

## Fora

- Login/cadastro do fiel
- Google
- Recuperação de senha
- Logout do fiel
- Migração ou exclusão de contas antigas
