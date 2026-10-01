# Plan: 010-avisos-programacao Avisos da programação

- Spec: [spec.md](spec.md)
- Status: `in-progress`

## Abordagem

O admin não ganha tela nova. O fiel marca Avise-me no item da programação e o job manda os avisos. Não há coordenada, não há rota e não há chave de mapa: o único dado que o job precisa do Firestore é a lista de lembretes e o horário publicado do item.

O cálculo puro fica em `jobs/aviso-saida/calculo.js`, sem Firebase e sem rede, para `node --test` rodar. Ele responde a três perguntas: que horas começa o item, que marcos já venceram nesta execução e o que escrever no corpo do push. Nada mais.

Sobre o nome do marco: o job não compara o relógio com o horário do marco. Ele compara quanto falta para o item começar e pergunta quais Marcos estão para vencer dentro da tolerância. É isso que faz o aviso chegar na hora mesmo com o cron de 5 minutos atrasado ou pulando execuções.

A gravação dos marcos é feita numa transação que relê o documento. Sem isso, duas execuções simultâneas do GitHub Actions mandariam o mesmo aviso duas vezes, porque a trava é o próprio documento que está sendo lido. A transação relê, decide e grava; o push sai depois do commit, e se a chamada ao Expo falhar, o marco volta para a lista.

`expo-location` sai do `app.json`, das permissões do Android e do `package.json` do app. A função de apagar a coordenada sai junto, e com ela o bloco de privacidade da tela de Configuração, que já não existe.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/components/ProgramaLista.jsx` | Ação Avise-me em cada item, com o rótulo Cancelar aviso |
| `mobile/app/(tabs)/programacao.jsx` | Liga a ação na aba Programação |
| `mobile/app/(tabs)/home.jsx` | A mesma ação no recorte do dia |
| `mobile/lib/avisoSaida.js` | `observarLembretes`, `marcarLembrete`, `desmarcarLembrete`, `useAviseMe` e o pedido de permissão de aviso |
| `mobile/lib/notificacoes.js` | Canal Android `aviso` |
| `mobile/app.json` | sem `expo-location` e sem permissões de localização |
| `mobile/package.json` | sem `expo-location` |
| `firestore.rules` | `lembretes` do próprio uid; `lembreteAvisos` sem match |
| `jobs/aviso-saida/calculo.js` | Regras puras: início do item, marcos vencidos, texto do aviso |
| `jobs/aviso-saida/calculo.test.js` | Casos de janela, tolerância, marco já enviado e atraso |
| `jobs/aviso-saida/executar.js` | Firestore, reserva de marco, Expo Push |
| `jobs/aviso-saida/tomtom.js` | removido |
| `.github/workflows/aviso-saida.yml` | Cron de 5 em 5 minutos e `workflow_dispatch` |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `users/{uid}/lembretes` | o próprio uid | o próprio uid cria e apaga | o job lista o collection group |
| `lembreteAvisos` | ninguém no cliente | só o Admin SDK | id `{uid}_{itemId}` |

Regras de segurança:

- `lembretes` só com `itemId` igual ao id do documento e `createdAt`.
- `lembreteAvisos` não tem match, de propósito. O cliente não lê nem escreve; o job usa o Admin SDK.
- A função `origemOk` sai do `users`, porque `origem` deixou de ser um campo que o app escreve. Quem ainda tiver `origem` gravada continua com o dado, e ninguém o apaga sozinho.
- O `uid` usado pelo job é o identificador anônimo da instalação.
- `role` e `email` continuam imutáveis no update do usuário.

## Cloudinary

Não usa.

## Ordem de entrega

1. `calculo.js` e `calculo.test.js` com os marcos e a tolerância.
2. Rules: `lembretes` no lugar de `queroIr`, `lembreteAvisos` fechado.
3. App: Avise-me no `ProgramaLista`, `lib/avisoSaida.js` sem localização, canal `aviso`.
4. `app.json` e `package.json` sem `expo-location`.
5. `executar.js` sem TomTom, com reserva de marco em transação.
6. Workflow a cada 5 minutos, sem `TOMTOM_API_KEY`.
7. Remoção de `tomtom.js` e do bloco de privacidade da antiga tela de Configuração.
8. Sync das specs 001, 002, 006, 008 e do README do mapa.

## Riscos

| Risco | Mitigação |
|---|---|
| Cron do GitHub atrasa | Tolerância de 5 minutos em cima de cada marco, e o marco mais próximo vence o que já passou |
| Duas execuções mandam o mesmo aviso | A reserva de marco é transacional e relê o documento antes de decidir |
| Rajada de push quando o app é marcado em cima da hora | Só o marco mais próximo entra na janela de tolerância |
| Push falha e o aviso se perde | O marco volta para a lista e a execução seguinte tenta de novo |
| Cota de minutos do GitHub | Cron só em fevereiro, na janela de 6h às 22h de Recife, runner Linux padrão |
| Expo Go não recebe push | O lembrete grava do mesmo jeito. O push vale no build de desenvolvimento |
| Secrets | `FIREBASE_SERVICE_ACCOUNT` só no GitHub. Fora do repositório |

## Fora deste plan

- Publicar as rules no Firebase e cadastrar o secret. Isso fica com quem opera a conta.
- Medir o push num aparelho com build de desenvolvimento.
- Qualquer sistema de localização, rota ou trânsito. Está fora do produto.
