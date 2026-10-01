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

- [x] **T8 — Link externo no lugar da aba** (feito em 28/09/2026, desfeito em 01/10/2026 por T10)
  - Faz: constante `LINK_BENFEITOR` em `mobile/lib/links.js` e item de link externo em `BarraAbas`, depois da aba Agenda, com o mesmo ícone e o mesmo rótulo.
  - Verifica: tocar abre `https://benfeitordafe.comunidadepiox.org.br/crescer`; a `Tabs.Screen` de `benfeitor` saiu do `(tabs)/_layout.jsx`; nenhuma rota `/benfeitor` no bundle.
  - Fora: mudar a ordem da barra ou o desenho do item ativo.

- [x] **T9 — Arquivo da página e da lib** (feito em 28/09/2026, desfeito em 01/10/2026 por T10)
  - Faz: `mobile/app/(tabs)/benfeitor.jsx` e `mobile/lib/benfeitor.js` movidos para `mobile/_arquivo/benfeitor/`, com `README.md` registrando o que a tela fazia e o que falta para recriá-la.
  - Estado: a pasta saiu do repositório quando a tela voltou, em 01/10/2026.
  - Fora: apagar `benefactorLeads`, `/admin/leads` ou os leads já gravados.

- [x] **T10 — Rota de volta, com envio para a comissão** (01/10/2026)
  - Faz: `lib/server/emailBenfeitor.js` com o `DESTINO` vazio e o aviso do que falta; `app/api/lead-benfeitor/route.js` revalidando sessão, campos e consentimento; `mobile/lib/enviaLeadBenfeitor.js` falando com a rota pelo token; `mobile/app/(tabs)/benfeitor.jsx` e `mobile/lib/benfeitor.js` de volta; `Tabs.Screen` na `BarraAbas`, CTA da Home em `/benfeitor` e `LINK_BENFEITOR` fora do `links.js`; escrita do client fechada em `firestore.rules`; `.env.example` com as três variáveis.
  - Verifica: a aba abre a tela dentro do app sem piscar em branco; cada envio grava um doc com `status: novo`, `uid` e CPF só com dígitos; o e-mail chega com os dados e o `reply_to` no e-mail do fiel; sem `RESEND_API_KEY` ou sem destino, o lead continua gravado e a confirmação não promete e-mail; `RESEND_API_KEY` e o destino não aparecem no bundle.
  - Fora: pagamento, anexo, cópia oculta e segunda mensagem para o fiel.

## Validação final

- [ ] Aceite de `spec.md`: o destino do e-mail já foi informado; falta a `RESEND_API_KEY` em produção para o envio sair e ser conferido
- [x] LGPD conferido
- [x] Copy sem travessão
- [x] Docs atualizados

