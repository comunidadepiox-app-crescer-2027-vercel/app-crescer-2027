# Spec: 006-configuracao Configuração

- Status: `in-progress` (implementada; validação end-to-end aguarda Firebase configurado)
- Complexidade: `media`
- Personas: `fiel`, `admin`
- Depende de: [001-autenticacao](../001-autenticacao/), [002-navegacao-e-home](../002-navegacao-e-home/)

## Problema

O fiel precisa ver a conta com que entrou, atualizar o nome e sair. O admin precisa de um caminho visível para o CMS.

## Escopo

### Entra

- `/configuracao`
- Exibe e-mail (somente leitura)
- Edita `displayName` no Auth e em `users`
- Sair (signOut) e voltar para `/`
- Se `role == admin`, link real para `/admin`
- Texto curto de privacidade: o que o app guarda (conta e, se enviou, lead Benfeitor)

### Não entra

- Troca de e-mail
- Exclusão de conta automatizada (pode listar “fale com a comunidade” até haver processo)
- Tema escuro, notificações push, idioma
- Upload de avatar (photoURL do Google permanece se existir, sem editor)

## Fluxos

1. Abre Configuração → vê e-mail e nome.
2. Salva nome → `users.displayName` e Auth atualizados.
3. Sair → sessão limpa, `/`.
4. Admin vê atalho para `/admin`.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota | `/configuracao` |
| Coleção | `users` (update do próprio doc) |
| Cloudinary | não |
| Papel | autenticado |

## Dados

Update permitido em `users/{uid}`: `displayName` (e `updatedAt` se existir). `role` e `email` não mudam por esta tela.

## Regras de negócio

- Sem sessão, redirect `/`.
- Sair é irreversível na sessão atual.
- Não mostrar pílula de “plano Pro” ou status inventado.

## Critérios de aceite

- [ ] E-mail visível, não editável
- [ ] Nome persistido após reload
- [ ] Sair funciona
- [ ] Admin vê link `/admin`; fiel não vê
- [ ] Aviso de privacidade existe e não usa travessão

## Anti-slop

Não é settings de SaaS com dezenas de toggles. Uma coluna: conta, privacidade, sair.

## Referências

- Specs irmãs: 001, 005 (menção ao lead), 007 (atalho admin)
