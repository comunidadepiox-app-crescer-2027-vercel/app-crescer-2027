# Tasks: 005-benfeitor-da-fe Benfeitor da Fé

## Checklist

- [x] **T1 — Regras Firestore**
  - Faz: create do próprio uid com LGPD; read admin ou próprio uid; update só admin.
  - Verifica: fiel não lista a coleção inteira; query `uid == auth.uid` passa; create sem consentimento falha.
  - Fora: UI.

- [x] **T6 — Máscara e cadastro existente**
  - Faz: celular `(83) 98897-7017` e CPF `000.000.000-00` enquanto digita; se já houver lead do uid, abre a confirmação.
  - Verifica: dígitos no Firestore; reabrir a aba não mostra o formulário de novo.
  - Fora: pagamento.

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
