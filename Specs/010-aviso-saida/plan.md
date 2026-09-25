# Plan: 010-aviso-saida Aviso de saída com trânsito

- Spec: `../spec.md`
- Status: `planned`

## Abordagem

O admin não ganha tela nova. O fiel marca Quero ir no app. A última coordenada fica em `users/{uid}.origem`. Um workflow do GitHub, no repositório privado, acorda a cada 10 minutos só na semana do encontro, lê o Firestore com conta de serviço e chama a Routing API Orbis do TomTom. O push sai pela mesma API do Expo já usada em `app/api/notify-programa/route.js`.

O cálculo puro (classificação, janela, margem, idempotência) fica em `jobs/aviso-saida/calculo.js`, sem Firebase, para o teste rodar com `node --test`.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/components/ProgramaLista.jsx` | Ação Quero ir em cada item |
| `mobile/app/(tabs)/agenda.jsx` | Liga a ação na Agenda |
| `mobile/app/(tabs)/home.jsx` | A mesma ação no recorte do dia |
| `mobile/app/(tabs)/conta.jsx` | Apagar a coordenada |
| `mobile/app/(tabs)/_layout.jsx` | Atualiza a origem ao voltar para primeiro plano |
| `mobile/lib/avisoSaida.js` | Permissão, gravação e Quero ir |
| `mobile/lib/notificacoes.js` | Canal Android `saida` |
| `mobile/app.json` | Plugin `expo-location` |
| `firestore.rules` | `queroIr` do próprio uid; forma de `origem`; alerta e contador fechados ao cliente |
| `jobs/aviso-saida/calculo.js` | Regras puras |
| `jobs/aviso-saida/executar.js` | Firestore, TomTom, Expo Push |
| `.github/workflows/aviso-saida.yml` | Cron de fevereiro e `workflow_dispatch` |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `users/{uid}/queroIr` | o próprio uid | o próprio uid cria e apaga | o job lista o collection group |
| `users.origem` | o próprio uid | o próprio uid, campos `lat`, `lng`, `updatedAt` | |
| `trafficAlerts` | ninguém no cliente | só o Admin SDK | id `{uid}_{itemId}` |
| `mapsUsage` | ninguém no cliente | só o Admin SDK | documento `YYYY-MM` |

Regras de segurança a prever (rascunho):

- `queroIr` só com `itemId` igual ao id do documento e `createdAt`.
- `origem` ausente, nula, ou número de latitude e longitude com timestamp.
- O `uid` usado pelo job é o identificador anônimo da instalação
- `role` e `email` continuam imutáveis no update do usuário

## Cloudinary

Não usa.

## Ordem de entrega

1. Spec, plan e tasks, com o ponteiro na spec 004 e no README.
2. Rules.
3. App: Quero ir, permissão e Conta.
4. Job, workflow, trava de 8.000 e testes do cálculo.

## Riscos

| Risco | Mitigação |
|---|---|
| Cron do GitHub atrasa | Margem de 15 minutos. A execução seguinte ainda envia se o item não começou e o aviso não foi marcado |
| Cota do TomTom ou dos minutos do GitHub | Cron só em fevereiro, runner Linux padrão, trava em 8.000 chamadas. Sem cartão, o excedente é bloqueado |
| Trânsito ralo em Campina Grande | A API responde com o padrão histórico da hora. O aviso sai mesmo assim |
| Expo Go não recebe push | O Quero ir grava do mesmo jeito. O push vale no build de desenvolvimento |
| Secrets | `TOMTOM_API_KEY` e `FIREBASE_SERVICE_ACCOUNT` só no GitHub. Fora do repositório |

## Fora deste plan

- Publicar as rules no Firebase e cadastrar os secrets. Isso fica com quem opera a conta.
- Medir o push num aparelho com build de desenvolvimento.
