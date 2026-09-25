# Spec: 006-configuracao Configuração

- Status: `in-progress` (implementada; validação end-to-end aguarda Firebase configurado)
- Complexidade: `media`
- Personas: `fiel`, `admin`
- Depende de: [001-autenticacao](../001-autenticacao/), [002-navegacao-e-home](../002-navegacao-e-home/)

> **Superfície web retirada.** O site Next.js é só a mesa administrativa (`/admin`). A conta do fiel desta spec vive no app Expo, spec [008](../008-app-react-native/spec.md).

## Problema

O fiel escolhe um nome para a conta do aplicativo e pode apagar sua localização. A identidade usada internamente pelo app é anônima e por instalação. O admin precisa de um caminho visível para o CMS.

## Escopo

### Entra

- `/configuracao`
- Edita `displayName` no Auth e em `users`
- Exibe e trata a localização guardada
- Abre a área administrativa no site quando aplicável
- Texto curto de privacidade: o que o app guarda (conta e, se enviou, lead Benfeitor)

### Não entra

- Login, cadastro, e-mail, senha, recuperação e logout do fiel
- Exclusão de conta automatizada
- Tema escuro, notificações push, idioma
- Upload de avatar (photoURL do Google permanece se existir, sem editor)

## Fluxos

1. Abre Configuração → vê o nome escolhido.
2. Salva nome → `users.displayName` e Auth atualizados.
3. Apaga a localização guardada.
4. Admin vê atalho para `/admin`; o fiel não vê.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota | `/configuracao` |
| Coleção | `users` (update do próprio doc) |
| Cloudinary | não |
| Papel | autenticado |

## Dados

Update permitido em `users/{uid}`: `displayName` e a remoção de `origem` pela ação de privacidade. `role` e `email` não mudam por esta tela.

## Regras de negócio

- A sessão anônima é criada pelo app; a Conta não oferece login ou logout.
- O nome escolhido não transforma o UID em identidade nominal verificável.
- Não mostrar pílula de “plano Pro” ou status inventado.

## Critérios de aceite

- [ ] Nome persistido após reload
- [ ] E-mail e logout não aparecem no app do fiel
- [ ] Admin vê caminho para a mesa web; fiel não vê
- [ ] Aviso de privacidade existe e não usa travessão

## Anti-slop

Não é settings de SaaS com dezenas de toggles. Uma coluna: conta, privacidade, sair.

## Referências

- Specs irmãs: 001, 005 (menção ao lead), 007 (atalho admin)
