# Tasks: 010-avisos-programacao Avisos da programação

Uma task = uma mudança verificável. Proibido agrupar "implementar a tela inteira".

Marcar `[x]` só depois de conferir o critério. Se o comportamento mudar no código, atualizar este arquivo.

## Aviso de saída com trânsito (feito antes de 28/09/2026)

- [x] **T1 — Spec e ponteiros**
  - Faz: `spec.md`, `plan.md`, este arquivo. A spec 004 aponta o lembrete para cá. O README lista a pasta.
  - Verifica: os três arquivos existem e a linha da 004 aponta para cá.
  - Fora: código do app.

- [x] **T2 — Rules da localização**
  - Faz: `queroIr` do próprio uid, forma de `origem`, `trafficAlerts` e `mapsUsage` sem acesso do cliente.
  - Verifica: leitura do `firestore.rules`.
  - Fora: publicar as rules no console.

- [x] **T3 — Quero ir e localização**
  - Faz: ação na Agenda e na Home, explicação antes da permissão, gravação da origem, canal `saida`, apagar em Conta.
  - Verifica: leitura do fluxo no código e texto de permissão no `app.json`.
  - Fora: aceite do sistema no aparelho.

- [x] **T4 — Job TomTom e push**
  - Faz: `jobs/aviso-saida` chama a Routing API Orbis com `traffic=live`, classifica, calcula a saída e envia o Expo Push uma vez.
  - Verifica: `npm run test:aviso-saida`.
  - Fora: chamada real ao TomTom e push no aparelho.

- [x] **T5 — Cota e cron**
  - Faz: contador para em 8.000. Workflow só em fevereiro, runner `ubuntu-latest`, `workflow_dispatch` com `forcar`.
  - Verifica: o YAML e o teste do limite.
  - Fora: cadastrar os secrets no GitHub.

## Avise-me, sem localização (28/09/2026)

- [x] **T6 — Cálculo puro dos marcos**
  - Faz: `jobs/aviso-saida/calculo.js` com `MARCOS_AVISO`, tolerância de 5 minutos, janela de 35 minutos e o texto de cada aviso.
  - Verifica: `npm run test:aviso-saida` passa nos casos de marco exato, atraso, marco já enviado, marcação em cima da hora e item fora da janela.  - Fora: Firebase, rede e qualquer chamada de mapa.

- [x] **T7 — Rules do lembrete**
  - Faz: `users/{uid}/lembretes` no lugar de `queroIr`, `lembreteAvisos` sem match no cliente e a função `origemOk` removida do `users`.
  - Verifica: fiel marca e apaga o próprio lembrete, não lista os de outros e não enxerga `lembreteAvisos`.
  - Fora: apagar `users.origem` de documento já gravado.

- [x] **T8 — Avise-me no app**
  - Faz: ação na Agenda e na Home com os rótulos Avise-me e Cancelar aviso, `useAviseMe` em `mobile/lib/avisoSaida.js` e canal Android `aviso`.
  - Verifica: marcar e desmarcar funciona nos dois lugares e o app não pede permissão de localização em nenhum fluxo.
  - Fora: push dentro do Expo Go.

- [x] **T9 — Retirada da localização**
  - Faz: `expo-location` fora do `app.json` e do `package.json`, permissões de GPS fora do Android, `apagarOrigem` fora da lib e bloco de privacidade da antiga tela de Configuração removido.
  - Verifica: busca por `expo-location`, `origem` e `Location` no `mobile/` não acha nada; o app ainda compila.
  - Fora: apagar coordenada já gravada no Firestore.

- [x] **T10 — Job sem mapa**
  - Faz: `executar.js` lê `lembretes`, reserva cada marco em transação e envia o Expo Push; `tomtom.js` removido; `TOMTOM_API_KEY` fora do workflow e do `.env.example`.
  - Verifica: o job não referencia TomTom, `mapsUsage` nem `trafficAlerts`; marco que falhou no push volta para a lista.
  - Fora: push no aparelho.

- [x] **T11 — Workflow a cada 5 minutos**
  - Faz: cron `*/5` nas duas faixas de horário, `workflow_dispatch` com `forcar` mantido.
  - Verifica: o YAML e o `package.json` do job.
  - Fora: cadastrar o secret no GitHub.

- [x] **T12 — Sincronia das specs**
  - Faz: atualizar o `README.md`, a 001, a 002, a 006, a 008 e a `OPEN-QUESTIONS`.
  - Verifica: nenhum documento ficou atrás do código.
  - Fora: reescrever spec que não mudou de comportamento.

## Validação final

- [ ] Todos os critérios de aceite de `spec.md` passaram (falta o push real num build de desenvolvimento)
- [x] Nenhuma rota ou botão sem destino
- [x] Copy sem travessão
- [x] Se houve dado pessoal, fluxo LGPD conferido
- [x] `spec.md`, `plan.md` e este arquivo refletem o que foi entregue
