# Spec: 020-notificacoes Caixa de notificações no app

- Status: `in-progress`
- Complexidade: `alta`
- Personas: `fiel` (recebe e relê os avisos); `admin` (envia agora, agenda, repete e acompanha)
- Depende de: [007-admin-cms](../007-admin-cms/), [008-app-react-native](../008-app-react-native/), [010-avisos-programacao](../010-avisos-programacao/)

## Problema

O admin já consegue disparar push pelo painel, mas o fiel que perde a notificação não tem onde reler o aviso. O sino e a página de notificações existem no app, porém a caixa não abre porque as regras publicadas do Firestore não liberam a leitura de `users/{uid}/notifications`. Além disso, o envio pelo painel tentava gravar a caixa com o token do admin, operação que as próprias regras fecham.

## Escopo

### Entra

- Sino no header do app, com contagem de notificações não lidas
- Página `/notificacoes` com a lista dos avisos recebidos
- Toque no aviso marca como lido; o badge do sino diminui sem recarregar
- Interruptor de silêncio dos avisos por aparelho
- No painel `/admin/notificacoes`: envio imediato, agendamento único, recorrência diária, pausa, retomada, desabilitação e histórico de envios
- Gravação da caixa do fiel depois do envio imediato, do aviso de mudança de programação e do job de agendamentos
- Regras do Firestore para leitura e marcação de leitura pelo próprio fiel
- Job de GitHub Actions que envia os agendamentos e as recorrências a cada 5 minutos

### Não entra

- Chat, comentários ou resposta do fiel
- Segmentação de público, anexos, imagem ou vídeo na notificação
- Confirmação individual de entrega ou de abertura
- Push remoto dentro do Expo Go
- Exclusão de notificação pelo fiel
- Edição do histórico já gravado

## Fluxos

1. O admin abre `/admin/notificacoes`, escolhe **Enviar agora**, preenche título e mensagem e confirma.
2. A rota `/api/notify-admin` valida o papel `admin`, envia o push pelo Expo e grava um documento em `notificationHistory` e um em `users/{uid}/notifications` para cada aparelho que aceitou o envio.
3. O fiel abre o app. O header mostra o sino com a contagem de documentos com `lida == false`.
4. O fiel toca no sino e vê a lista em `/notificacoes`, da mais recente para a mais antiga.
5. O fiel toca em um aviso não lido. O documento recebe `lida: true` e `lidaAt`, e o badge é atualizado pela escuta do Firestore.
6. O admin escolhe **Agendar uma vez** ou **Recorrente**, define data, horários e término opcional. O job lê as programações ativas ou agendadas, envia o push na janela e grava a caixa do fiel.
7. O admin pode pausar, retomar ou desabilitar uma programação. Desabilitada não volta a enviar.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota da mesa | `/admin/notificacoes` |
| Rotas do app | `/notificacoes` (aberta pelo sino do header) |
| Rotas de API | `POST /api/notify-admin`, `POST /api/notify-programa` |
| Coleções | `notificationSchedules`, `notificationHistory`, `notificationRuns`, `users/{uid}/notifications`, `deviceTokens` |
| Job | `jobs/lembrete-aviso/notificacoes.js`, `.github/workflows/notificacoes.yml` |
| Papel | `admin` para escrever programações e disparar; `fiel` para ler, marcar como lido e silenciar |

## Dados

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `notificationSchedules.title` | string | sim | até 50 caracteres |
| `notificationSchedules.body` | string | sim | até 200 caracteres |
| `notificationSchedules.type` | string | sim | `imediata`, `agendada` ou `recorrente` |
| `notificationSchedules.date` | string | sim para agendada e recorrente | `YYYY-MM-DD` no fuso de Recife |
| `notificationSchedules.time` | string | sim para agendada | `HH:mm` no fuso de Recife |
| `notificationSchedules.times` | array de string | sim para recorrente | horários diários, sem repetição |
| `notificationSchedules.endDate` | string | não | fim opcional da recorrência |
| `notificationSchedules.status` | string | sim | `agendada`, `ativa`, `pausada`, `concluida` ou `desabilitada` |
| `notificationSchedules.createdAt` | timestamp | sim | |
| `notificationSchedules.updatedAt` | timestamp | sim | |
| `notificationSchedules.createdBy` | string | sim | uid do admin |
| `notificationHistory.title` | string | sim | cópia do título enviado |
| `notificationHistory.body` | string | sim | cópia da mensagem enviada |
| `notificationHistory.type` | string | sim | `imediata`, `agendada` ou `recorrente` |
| `notificationHistory.status` | string | sim | `aceita`, `parcial`, `falha` ou `processando` |
| `notificationHistory.sent` | number | sim | tickets aceitos pelo Expo |
| `notificationHistory.total` | number | sim | aparelhos tentados |
| `notificationHistory.sentAt` | timestamp | sim | |
| `notificationRuns` | documento interno | sim | trava de envio do job, escrito só pelo Admin SDK |
| `users/{uid}/notifications.title` | string | sim | até 50 caracteres |
| `users/{uid}/notifications.body` | string | sim | até 200 caracteres |
| `users/{uid}/notifications.lida` | boolean | sim | nasce `false` |
| `users/{uid}/notifications.createdAt` | timestamp | sim | |
| `users/{uid}/notifications.lidaAt` | timestamp | não | preenchido no toque |
| `deviceTokens.silenciado` | boolean | não | silêncio por aparelho |

## Regras de negócio

- O fiel lê apenas a própria subcoleção `users/{uid}/notifications`. Nenhum outro fiel lê a caixa alheia.
- O fiel só altera `lida` e `lidaAt`, e só pode marcar como lido, nunca desmarcar.
- A regra de criação da caixa aceita só admin, com título, mensagem, `lida == false` e `createdAt == request.time`. A mesa usa a rota autenticada de envio para fazer essa escrita.
- O job de agendamentos usa o Admin SDK e não depende de regra de criação do cliente.
- A programação salva é sempre interpretada no fuso `America/Recife`.
- Recorrência sem data de término continua ativa até o admin pausar ou desabilitar.
- O mesmo horário de uma recorrência não envia duas vezes no mesmo dia, mesmo com o cron atrasado ou repetido.
- O histórico é imutável; uma falha de envio fica registrada e não é reescrita.
- O silêncio não apaga a notificação da caixa. Ele só evita o som e a vibração do push.
- Sem aparelho habilitado, a programação continua salva e o histórico registra zero aparelhos.

## Critérios de aceite

- [ ] O sino aparece no header do app e mostra a contagem de não lidas
- [ ] `/notificacoes` lista os avisos da mais recente para a mais antiga
- [ ] Um aviso enviado pelo painel aparece na caixa do fiel sem recarregar o app
- [ ] Tocar em um aviso não lido grava `lida: true` e atualiza o badge
- [ ] O fiel não consegue ler a caixa de outro uid
- [ ] O fiel não consegue apagar nem criar notificação pela API do cliente
- [ ] O interruptor de silêncio grava `silenciado` nos aparelhos do próprio uid
- [ ] O admin envia agora, agenda uma vez e cria recorrência diária
- [ ] Pausar, retomar e desabilitar mudam o estado da programação
- [ ] O job grava o histórico e a caixa do fiel
- [ ] As regras publicadas incluem `notifications`, `notificationSchedules` e `notificationHistory`
- [ ] O erro "Não foi possível carregar as notificações" não aparece com as regras publicadas

## Anti-slop

A caixa é uma lista de avisos, não um feed social. Sem cards de vidro, gradiente, pílula de categoria ou número hero. O sino é um ícone de linha ao lado do ícone de informação, no mesmo tamanho e sem animação chamativa.

## Referências

- Specs irmãs: 007 (mesa), 008 (app), 010 (avisos da programação)
- Expo Push: https://docs.expo.dev/push-notifications/overview/
