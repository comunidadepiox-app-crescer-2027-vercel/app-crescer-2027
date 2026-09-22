# Tasks: 010-aviso-saida Aviso de saída com trânsito

Uma task = uma mudança verificável. Proibido agrupar “implementar a tela inteira”.

Marcar `[x]` só depois de conferir o critério. Se o comportamento mudar no código, atualizar este arquivo.

## Checklist

- [x] **T1 — Spec e ponteiros**
  - Faz: `spec.md`, `plan.md`, este arquivo. A spec 004 aponta o lembrete para cá. O README lista a 010.
  - Verifica: os três arquivos existem e a linha da 004 não diz mais que lembrete fica de fora sem destino.
  - Fora: código do app.

- [x] **T2 — Rules**
  - Faz: `queroIr` do próprio uid, forma de `origem`, `trafficAlerts` e `mapsUsage` sem acesso do cliente.
  - Verifica: leitura do `firestore.rules`.
  - Fora: publicar as rules no console.

- [x] **T3 — Quero ir e localização**
  - Faz: ação na Agenda e na Home, explicação antes da permissão, gravação da origem, canal `saida`, apagar em Conta.
  - Verifica: leitura do fluxo no código e texto de permissão no `app.json`.
  - Fora: aceite do sistema no aparelho.

- [x] **T4 — Job TomTom e push**
  - Faz: `jobs/aviso-saida` chama a Routing API Orbis com `traffic=live`, classifica, calcula a saída e envia o Expo Push uma vez.
  - Verifica: `node --test jobs/aviso-saida/calculo.test.js`.
  - Fora: chamada real ao TomTom e push no aparelho.

- [x] **T5 — Cota e cron**
  - Faz: contador para em 8.000. Workflow só em fevereiro, runner `ubuntu-latest`, `workflow_dispatch` com `forcar`.
  - Verifica: o YAML e o teste do limite.
  - Fora: cadastrar os secrets no GitHub.

## Validação final

- [ ] Todos os critérios de aceite de `spec.md` passaram (falta o push real num build de desenvolvimento)
- [x] Nenhuma rota ou botão sem destino
- [x] Copy sem travessão
- [x] Se houve dado pessoal, fluxo LGPD conferido
- [x] `spec.md`, `plan.md` e este arquivo refletem o que foi entregue
