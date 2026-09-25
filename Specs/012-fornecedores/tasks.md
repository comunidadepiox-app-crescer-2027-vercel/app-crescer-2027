# Tasks: 012-fornecedores Página de fornecedores

## Checklist

- [x] **T1 — Spec e contratos locais**
  - Faz: registrar rota, assets, autenticação e URLs reservadas.
  - Verifica: spec e plan descrevem o comportamento antes do código.
  - Fora: dados externos.

- [x] **T2 — Tela de fornecedores**
  - Faz: criar `/fornecedor` com cabeçalho, linha de apoio e dois cards grandes com ícone, título e descrição, sem fotos.
  - Verifica: tela autenticada, retorno para Home, cards sem ação e identidade do app.
  - Fora: links e conteúdo administrativo.

- [x] **T3 — Atalho do menu**
  - Faz: associar Fornecedor à rota `/fornecedor`.
  - Verifica: o item fecha a folha e abre a página.
  - Fora: alterar os demais atalhos.

- [x] **T4 — Validação**
  - Faz: executar verificação de bundle e revisar aceite visual.
  - Verifica: `npx expo export --platform android` concluiu sem erro e incluiu as duas imagens.
  - Fora: teste manual em dispositivo sem abertura do ambiente.

## Validação final

- [ ] Todos os critérios de aceite de `spec.md` passaram
- [ ] Nenhuma rota ou botão sem destino
- [ ] Copy sem travessão
- [ ] Se houve dado pessoal, fluxo LGPD conferido
- [ ] `spec.md`, `plan.md` e este arquivo refletem o que foi entregue
