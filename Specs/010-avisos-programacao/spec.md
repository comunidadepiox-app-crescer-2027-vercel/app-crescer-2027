# Spec: 010-avisos-programacao Avisos da programação

- Status: `in-progress` (localização e TomTom retirados em 28/09/2026; agora é contagem regressiva)
- Complexidade: `alta`
- Personas: `fiel` (marca o item e recebe os avisos); `admin` (só publica a programação, como na 004)
- Depende de: [004-cronograma](../004-cronograma/), [008-app-react-native](../008-app-react-native/)

> **O que mudou em 28/09/2026.** A ação **Quero ir** virou **Avise-me** e perdeu o sistema de localização. Não existe mais `expo-location`, nem `users.origem`, nem chamada ao TomTom, nem hora de sair, nem classificação de trânsito. O que fica é uma contagem regressiva: quem marca recebe aviso 30, 15, 10, 5 e 1 minuto antes do item começar. A subcoleção `users/{uid}/queroIr` passou a ser `users/{uid}/lembretes`, e `trafficAlerts` passou a ser `lembreteAvisos`, agora guardando só quais avisos já saíram.

## Problema

O fiel usa uma sessão anônima do Firebase por instalação. O UID dessa sessão identifica os lembretes marcados e os tokens push do aparelho. O job continua funcionando com o mesmo modelo de dados, sem depender de lugar nenhum.

## Escopo

### Entra

- Ação **Avise-me** em cada item da Agenda e do recorte do dia na Home
- Aviso push 30, 15, 10, 5 e 1 minuto antes do horário do item, com o texto do item no corpo
- Botão que vira **Cancelar aviso** quando o lembrete está marcado
- Job no GitHub Actions que acorda a cada 5 minutos na janela do encontro, lê os lembretes e envia o Expo Push
- Cada marco sai uma vez só, mesmo com o cron atrasado ou pulando execuções
- Disparo manual (`workflow_dispatch`) para teste fora de fevereiro de 2027

### Não entra

- Localização, permissões de GPS, `expo-location` e qualquer coordenada
- Cálculo de rota, hora de sair e nível de trânsito
- TomTom Routing API, `TOMTOM_API_KEY` e o contador de chamadas
- Mapa na tela e navegação no app
- Aviso para quem não marcou
- Ajuste da lista de marcos pelo admin
- Push dentro do Expo Go

## Fluxos

1. O fiel toca Avise-me. O app garante o token de notificação, avisa uma vez que o Expo Go não recebe push e grava o documento em `users/{uid}/lembretes/{itemId}`.
2. Ao abrir o app de novo, o item já aparece como Cancelar aviso. Tocar de novo apaga o documento e nenhum aviso sai.
3. No encontro, o job lê os itens publicados que começam nos próximos 35 minutos e têm lembrete.
4. A cada execução, o job envia todos os marcos vencidos que ainda não saíram, e grava quais saíram em `lembreteAvisos/{uid}_{itemId}`.
5. Fora de 5 a 9 de fevereiro de 2027, ou fora de 6h às 22h em Recife, o cron não roda. O disparo manual ignora só esse portão de calendário.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Telas | Agenda, Home (recorte do dia) |
| Coleções | `users/{uid}/lembretes/{itemId}`, `lembreteAvisos/{uid}_{itemId}`, `deviceTokens` |
| Job | `jobs/aviso-saida/`, `.github/workflows/aviso-saida.yml` |
| Papel | sessão anônima do fiel autenticada. Escrita de aviso só pelo job (Admin SDK) |

## Dados

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `lembretes.itemId` | string | sim | igual ao id do documento |
| `lembretes.createdAt` | timestamp | sim | |
| `lembreteAvisos.uid` | string | sim | dono do lembrete |
| `lembreteAvisos.itemId` | string | sim | |
| `lembreteAvisos.marcos` | array de number | sim | marcos já enviados, do maior para o menor |
| `lembreteAvisos.atualizadoEm` | timestamp | sim | |

`users.origem`, `trafficAlerts` e `mapsUsage` saíram do contrato. `users.origem` pode continuar gravado em documento antigo; nenhuma tela e nenhuma regra dependem dele.

## Marcos e tolerância

O GitHub Actions agenda por cron de 5 em 5 minutos e pode atrasar a execução. Por isso o job não procura o minuto exato: num disparo, ele envia todo marco que já venceu, desde que a folga esteja dentro da tolerância de 5 minutos.

Com o cron de 5 minutos e o item começando no horário cheio, o fiel recebe o aviso de 30 no minuto 30, o de 15 no 15, o de 10 no 10, o de 5 no 5 e o de 1 no próprio horário do item. A prática é uma folga de até 5 minutos em cada aviso.

Duas consequências assumidas de propósito:

- Se o app for marcado com menos de 10 minutos de antecedência, chega um aviso só, o mais próximo. Não é rajada de quatro pushes.
- Se uma execução atrasar muito, um marco pode ser perdido. Quem recebe o de 30 e o de 15 e depois falha a execução do 10 recebe o de 5 e o de 1. O aviso atrasa, não se duplica.

O marco de 1 minuto pode sair até 4 minutos depois do horário do item, porque é o único com folga suficiente para isso. O texto dele é escrito para funcionar nos dois casos: "Está começando agora".

## Regras de negócio

- O admin só publica `date`, `time` e `location` em `programItems`.
- Um marco só é enviado uma vez por pessoa e item. A trava é o `marcos` do documento, escrita numa transação que rele o documento antes de decidir.
- Se a chamada ao Expo Push falhar, o marco que falhou volta para a lista, e a execução seguinte tenta de novo.
- Sem token no aparelho, o lembrete fica gravado e nada é enviado. O app não inventa confirmação de aviso que não vai chegar.
- O texto do aviso é curto e nomeia o item: `Faltam 15 minutos para {título}.`
- Sem cartão: o plano Free do GitHub Actions dá 2.000 minutos por mês, e o cron só existe em fevereiro, na janela do encontro.

## Critérios de aceite

- [ ] Dá para marcar e desmarcar Avise-me na Agenda e na Home
- [ ] O item marcado mostra Cancelar aviso
- [ ] Nenhuma permissão de localização é pedida e nenhum campo `expo-location` aparece no app
- [ ] O aviso chega 30, 15, 10, 5 e 1 minuto antes do horário do item
- [ ] O mesmo par pessoa e item não recebe o mesmo marco duas vezes
- [ ] Quem marca com menos de 10 minutos de antecedência recebe um aviso só
- [ ] Failing no push devolve o marco para a tentativa seguinte
- [ ] O cron automático só existe na janela de fevereiro de 2027
- [ ] Push real no aparelho (build de desenvolvimento; fora do Expo Go)

## Anti-slop

Não é app de navegação e não é app de trânsito. Não há mapa, rota desenhada, nível de tráfego nem pílula de categoria. O botão é texto na linha do horário, como o resto da agenda.

## Referências

- Specs irmãs: 004 (programação), 008 (push e `deviceTokens`)
- Antigo destino do aviso, com trânsito: arquivado nesta spec, sem código
