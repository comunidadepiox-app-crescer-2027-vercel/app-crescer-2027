# Tasks: 001-autenticacao Autenticação anônima do fiel

## Checklist

- [x] **T1 — Atualizar contratos SDD**
  - Faz: substituir o contrato de login/cadastro pelo contrato Anonymous Auth.
  - Verifica: specs 001, 006, 008, 010 e referências relacionadas coerentes.
  - Fora: implementação.

- [x] **T2 — Provider anônimo**
  - Faz: restaurar sessão, encerrar sessão antiga, chamar `signInAnonymously` e criar `users/{uid}`.
  - Verifica: nova instalação e reabertura usam o mesmo fluxo seguro.
  - Fora: admin web.

- [x] **T3 — Inicialização sem formulário**
  - Faz: substituir a tela de login do fiel por inicialização automática e retry.
  - Verifica: app abre diretamente na Home sem credenciais.
  - Fora:guards das rotas.

- [x] **T4 — Navegação protegida**
  - Faz: adaptar guards para aguardar a sessão anônima.
  - Verifica: nenhuma rota interna abre antes do UID existir.
  - Fora: regras Firestore já existentes.

- [x] **T5 — Conta sem credenciais**
  - Faz: remover e-mail, logout e sessão admin da Conta; manter nome e localização.
  - Verifica: salvar nome atualiza Auth e `users/{uid}`.
  - Fora: Benfeitor.

- [x] **T6 — Remover dependências sem uso**
  - Faz: retirar Google, reset e pacotes que ficarem realmente sem uso.
  - Verifica: bundle mobile não contém imports mortos.
  - Fora: admin web.

- [ ] **T7 — Validar integrações**
  - Faz: testar News, Agenda, Quero ir, localização, push, Benfeitor e jobs.
  - Verifica: todas usam o UID anônimo sem alteração indevida de segurança.
  - Fora: novas funcionalidades.

## Validação final

- [ ] Aceite de `spec.md`
- [ ] Primeiro uso e reabertura validados
- [ ] Retry de falha validado
- [ ] Login, cadastro, Google, reset e logout ausentes no fiel
- [ ] Nome persiste na Conta
- [ ] Login admin e regras administrativas continuam funcionando
- [ ] Testes, lint, typecheck e builds disponíveis concluídos
