# Tasks: 005-benfeitor-da-fe Benfeitor da Fé

## Checklist

- [x] **T1 — Regras Firestore**
  - Faz: create do próprio uid com LGPD; read só admin.
  - Verifica: fiel não lista a coleção; create sem consentimento falha.
  - Fora: UI.

- [x] **T2 — Validadores**
  - Faz: CPF e telefone com DDD.
  - Verifica: CPF inválido conhecido falha; válido conhecido passa.
  - Fora: pagamento.

- [x] **T3 — Página da campanha**
  - Faz: textos oficiais adaptados, sem travessão.
  - Verifica: três passos visíveis; sem barra de meta.
  - Fora: form submit.

- [x] **T4 — Formulário e gravação**
  - Faz: campos, checkbox LGPD, `submitLead`.
  - Verifica: doc criado com `status: novo` e `uid`.
  - Fora: lista admin.

- [x] **T5 — Confirmação**
  - Faz: hero da campanha + foto do encontro + três passos seguintes + WhatsApp oficial e volta à Home. Sem check verde de SaaS.
  - Verifica: não afirma que o pagamento ocorreu; copy sem travessão.
  - Fora: boleto.

## Validação final

- [ ] Aceite de `spec.md`
- [ ] LGPD conferido
- [ ] Copy sem travessão
- [ ] Docs atualizados
