# Plan: 020-notificacoes Caixa de notificações no app

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

A mesa grava a programação em `notificationSchedules`. O envio imediato continua na rota `/api/notify-admin`, que valida `role == admin` no servidor e usa o token do admin para gravar a caixa de cada fiel. O job de agendamentos roda no GitHub Actions a cada 5 minutos, usa o Admin SDK e grava `notificationHistory` e `notificationRuns` sem depender das regras do cliente.

O app lê a caixa com `onSnapshot` em `users/{uid}/notifications`, ordenada por `createdAt` decrescente. O mesmo observador alimenta a lista de `/notificacoes` e o badge do sino no header. A leitura exige que as regras publicadas tenham o bloco da subcoleção. Sem publicar as regras, o Firestore devolve `permission-denied` e o app mostra o erro genérico.

A gravação da caixa pelo painel usa o token do admin, não a service account. Isso evita depender da credencial de servidor para uma escrita pequena e mantém a regra explícita: só admin cria, e só com os campos do contrato. O job continua com o Admin SDK porque roda fora do app.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `app/admin/notificacoes/page.jsx` | formulário de envio imediato, agendamento, recorrência, lista e histórico |
| `app/api/notify-admin/route.js` | push imediato e gravação da caixa do fiel |
| `app/api/notify-programa/route.js` | push da mudança de programação e gravação da caixa |
| `mobile/app/notificacoes.jsx` | lista, marcação de leitura e silêncio |
| `mobile/components/Header.jsx` | sino com contador de não lidas |
| `mobile/components/Icones.jsx` | ícone de sino |
| `mobile/lib/caixaNotificacoes.js` | observação da caixa, leitura e gravação do silêncio |
| `jobs/lembrete-aviso/notificacoes.js` | envio de agendamentos e recorrências |
| `.github/workflows/notificacoes.yml` | cron de 5 em 5 minutos e disparo manual |
| `firestore.rules` | leitura e marcação de leitura pelo fiel; criação pelo admin; coleções da mesa |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `users/{uid}/notifications` | o próprio uid | fiel altera `lida` e `lidaAt`; admin cria pela rota de envio | `orderBy('createdAt', 'desc')`, índice de campo único |
| `notificationSchedules` | admin | admin | `orderBy('createdAt', 'desc')`; job filtra `status in ['ativa','agendada']` |
| `notificationHistory` | admin | admin e Admin SDK | `orderBy('sentAt', 'desc')` |
| `notificationRuns` | ninguém no cliente | Admin SDK | id `{scheduleId}_{date}_{time}` |
| `deviceTokens` | o próprio uid ou admin | o próprio uid | `where('uid', '==', uid)` |

Regras de segurança:

- `users/{uid}/notifications`: leitura só do dono; update só de `lida` e `lidaAt`, apenas para marcar como lido; create só admin, com `title`, `body`, `lida` e `createdAt` validados; delete fechado.
- `notificationSchedules`: leitura, criação e update só admin; delete fechado.
- `notificationHistory`: leitura e criação só admin; update e delete fechados.
- `notificationRuns`: sem match, de propósito. Só o Admin SDK escreve.
- `deviceTokens`: update do próprio uid aceita `silenciado` booleano.

## Cloudinary

Não usa.

## Ordem de entrega

1. Publicar as regras com os blocos `notifications`, `notificationSchedules` e `notificationHistory`.
2. Garantir a criação da caixa pelo painel depois do push imediato.
3. Garantir a criação da caixa pelo aviso de mudança de programação.
4. Conferir o job de agendamentos e o cron.
5. Conferir o sino, a lista, a marcação de leitura e o silêncio no app.
6. Melhorar a mensagem de erro do painel quando as regras não estiverem publicadas.

## Riscos

| Risco | Mitigação |
|---|---|
| Regras não publicadas | O erro do Firestore é `permission-denied`; a task de publicação é obrigatória e o painel mostra a causa provável |
| Service account de outro projeto no job | Conferir `FIREBASE_SERVICE_ACCOUNT` no secret do GitHub antes de disparar o workflow |
| Cron atrasado | A janela de 5 minutos e a trava em `notificationRuns` evitam envio duplicado |
| Muitos aparelhos no envio imediato | Lotes de 100 no Expo e `Promise.all` nas gravações |
| Push aceito e caixa falhando | A rota valida a regra antes de responder; o histórico registra o envio mesmo se a caixa falhar |
| Silêncio confundido com apagar | A tela explica que a mensagem continua salva |

## Fora deste plan

- Publicar as regras e configurar o secret do GitHub. Isso fica com quem opera a conta.
- Medir push em build de desenvolvimento.
- Confirmação de leitura por parte do fiel.
