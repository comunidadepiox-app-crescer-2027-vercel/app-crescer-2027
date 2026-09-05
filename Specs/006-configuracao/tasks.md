# Tasks: 006-configuracao Configuração

## Checklist

- [x] **T1 — Página de conta**
  - Faz: `/configuracao` com e-mail e nome.
  - Verifica: sem sessão redireciona.
  - Fora: admin CMS.

- [x] **T2 — Salvar nome**
  - Faz: Auth + `users.displayName`.
  - Verifica: reload mantém o nome.
  - Fora: e-mail editável.

- [x] **T3 — Sair**
  - Faz: signOut → `/`.
  - Verifica: voltar não reabre Home autenticada.
  - Fora: delete.

- [x] **T4 — Admin link e privacidade**
  - Faz: atalho só se `role == admin`; texto LGPD curto.
  - Verifica: fiel não vê `/admin`; copy sem travessão.
  - Fora: lista de leads.

## Validação final

- [ ] Aceite de `spec.md`
- [ ] Nenhum toggle fictício
- [ ] Docs atualizados
