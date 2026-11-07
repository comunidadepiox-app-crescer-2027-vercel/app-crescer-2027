# Tasks: 020-notificacoes Caixa de notificações no app

Uma task = uma mudança verificável. Proibido agrupar “implementar a tela inteira”.

Marcar `[x]` só depois de conferir o critério. Se o comportamento mudar no código, atualizar este arquivo.

> Estado em 06/11/2026: código e regras ajustados no repositório. A validação em produção depende de publicar as regras (T12).

## Checklist

- [ ] **T1 — Liberar a leitura da caixa do próprio fiel nas regras**
  - Faz: bloco `match /notifications/{notificationId}` com `read` para o próprio uid.
  - Verifica: consulta anônima em `users/{uid}/notifications` deixa de devolver `permission-denied` depois de publicar as regras.
  - Fora: leitura da caixa de outro uid.

- [ ] **T2 — Liberar a criação da caixa pelo admin, com contrato validado**
  - Faz: `create` para `isAdmin()` com `title`, `body`, `lida == false` e `createdAt == request.time`.
  - Verifica: endpoint imediato grava a caixa sem violar as regras e um fiel não consegue criar.
  - Fora: create pelo próprio fiel e delete.

- [ ] **T3 — Manter a marcação de leitura do fiel**
  - Faz: `update` só de `lida` e `lidaAt`, apenas para `true`.
  - Verifica: toque no aviso marca como lido e uma tentativa de desmarcar falha.
  - Fora: edição de título ou mensagem.

- [ ] **T4 — Gravar a caixa no envio imediato**
  - Faz: `/api/notify-admin` grava um documento por uid que recebeu o push.
  - Verifica: aviso enviado pelo painel aparece no app em segundos.
  - Fora: gravar caixa para aparelhos com ticket de erro.

- [ ] **T5 — Gravar a caixa no aviso de programação**
  - Faz: `/api/notify-programa` grava a caixa depois do push.
  - Verifica: mudança publicada do dia do recorte aparece na caixa do fiel.
  - Fora: mudança fora do dia do recorte.

- [ ] **T6 — Enviar agendamentos e recorrências pelo job**
  - Faz: job lê `notificationSchedules`, envia push e grava histórico, execução e caixa.
  - Verifica: agendamento único sai uma vez; recorrência não repete o mesmo horário no mesmo dia.
  - Fora: envio fora da janela de 5 minutos ou de programação pausada.

- [ ] **T7 — Sino com contagem de não lidas no header**
  - Faz: observa a caixa e mostra badge com no máximo `9+`.
  - Verifica: badge nasce com as não lidas e diminui ao marcar como lida.
  - Fora: animação chamativa.

- [ ] **T8 — Página `/notificacoes`**
  - Faz: lista por `createdAt` decrescente, estado vazio honesto e marcação de leitura no toque.
  - Verifica: abre pelo sino e mostra título, mensagem e data no fuso de Recife.
  - Fora: exclusão e resposta.

- [ ] **T9 — Silêncio por aparelho**
  - Faz: lê e grava `silenciado` em `deviceTokens` do próprio uid.
  - Verifica: o interruptor reflete o estado e a mensagem continua na caixa.
  - Fora: silêncio global na conta.

- [ ] **T10 — Painel de programações e histórico**
  - Faz: envia agora, agenda uma vez, cria recorrência, pausa, retoma, desabilita e lista histórico.
  - Verifica: cada ação grava o status esperado e recarrega as listas.
  - Fora: edição do histórico.

- [ ] **T11 — Mensagem clara quando as regras não estão publicadas**
  - Faz: painel distingue `permission-denied` e orienta a publicar as regras.
  - Verifica: sem as regras, a tela não mostra só o erro genérico.
  - Fora: expor detalhes internos do Firestore.

- [ ] **T12 — Publicar as regras no projeto Firebase**
  - Faz: `firebase deploy --only firestore:rules --project app-crescer-2027`.
  - Verifica: o app abre `/notificacoes` sem o erro de carregamento.
  - Fora: publicar outros serviços.

## Validação final

- [ ] Todos os critérios de aceite de `spec.md` passaram
- [ ] Nenhuma rota ou botão sem destino
- [ ] Copy sem travessão
- [ ] Se houve dado pessoal, fluxo LGPD conferido
- [ ] `spec.md`, `plan.md` e este arquivo refletem o que foi entregue
