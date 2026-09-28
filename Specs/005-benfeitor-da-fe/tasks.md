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

- [x] **T8 — Link externo no lugar da aba**
  - Faz: constante `LINK_BENFEITOR` em `mobile/lib/links.js` e item de link externo em `BarraAbas`, depois da aba Agenda, com o mesmo ícone e o mesmo rótulo.
  - Verifica: tocar abre `https://benfeitordafe.comunidadepiox.org.br/crescer`; a `Tabs.Screen` de `benfeitor` saiu do `(tabs)/_layout.jsx`; nenhuma rota `/benfeitor` no bundle.
  - Fora: mudar a ordem da barra ou o desenho do item ativo.

- [x] **T9 — Arquivo da página e da lib**
  - Faz: `mobile/app/(tabs)/benfeitor.jsx` e `mobile/lib/benfeitor.js` movidos para `mobile/_arquivo/benfeitor/`, com `README.md` registrando o que a tela fazia e o que falta para recriá-la.
  - Verifica: nenhum import no app aponta para `lib/benfeitor`; a pasta não entra no bundle; `app/admin/leads` e `firestore.rules` sem alteração.
  - Fora: apagar `benefactorLeads`, `/admin/leads` ou os leads já gravados.

## Validação final

- [ ] Aceite de `spec.md`
- [x] LGPD conferido
- [x] Copy sem travessão
- [x] Docs atualizados

