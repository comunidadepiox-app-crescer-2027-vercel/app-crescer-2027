# Spec: 010-aviso-saida Aviso de saída com trânsito

- Status: `in-progress`
- Complexidade: `alta`
- Personas: `fiel` (marca o item e recebe o push); `admin` (só publica a programação, como na 004)
- Depende de: [004-cronograma](../004-cronograma/), [008-app-react-native](../008-app-react-native/)

## Problema

O fiel usa uma sessão anônima do Firebase por instalação. O UID dessa sessão identifica as marcações, a localização e os tokens push do aparelho. O job continua funcionando com o mesmo modelo de dados.

## Escopo

### Entra

- Ação **Quero ir** em cada item da Agenda e do recorte do dia na Home
- Explicação do uso da localização antes do pedido do sistema (LGPD)
- Última coordenada gravada enquanto o app está em uso, atualizada ao voltar para primeiro plano
- Apagar essa coordenada em Conta
- Job no GitHub Actions que, a cada 10 minutos na janela do encontro, consulta a Routing API Orbis do TomTom (`traffic=live`) e envia um push pela API do Expo
- Classificação Livre, Cheio ou Muito Cheio a partir da duração com trânsito e do atraso
- Hora de sair = início do item, menos o tempo de carro, menos 15 minutos
- Um aviso por pessoa e item. Coordenada com mais de 12 horas gera um único pedido para abrir o app, sem inventar hora nem trânsito
- Trava em 8.000 chamadas da Routing API no mês
- Disparo manual (`workflow_dispatch`) para teste fora de fevereiro de 2027

### Não entra

- Aviso para quem não marcou Quero ir
- Localização com o app fechado ou permissão "sempre"
- Cloud Functions e plano Blaze
- Matrix Routing do TomTom
- Campo novo no cadastro do admin
- Mapa na tela
- Push dentro do Expo Go

## Fluxos

1. O fiel toca Quero ir. O app explica a localização, pede permissão de uso e garante o token de notificação.
2. Com a permissão, grava `origem` e o documento em `queroIr`. Sem a permissão, grava o Quero ir e avisa que não há hora de saída.
3. Ao abrir o app ou voltar do segundo plano, se a permissão já existe, atualiza `origem`.
4. Em Conta, o fiel apaga a coordenada.
5. No encontro, o job lê itens publicados que começam nos próximos 70 minutos e têm Quero ir. Calcula a rota até o Centro de Convenções e, na hora de sair, manda o push.
6. Fora de 5 a 9 de fevereiro de 2027, ou fora de 6h às 22h em Recife, o cron não chama o TomTom. O disparo manual ignora só esse portão de calendário.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Telas | Agenda, Home (recorte do dia), Conta |
| Coleções | `users/{uid}.origem` (LGPD), `users/{uid}/queroIr/{itemId}`, `trafficAlerts/{uid}_{itemId}`, `mapsUsage/{YYYY-MM}` |
| Job | `jobs/aviso-saida/`, `.github/workflows/aviso-saida.yml` |
| Papel | sessão anônima do fiel autenticada. Escrita de alerta e contador só pelo job (Admin SDK) |

## Dados

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `origem.lat` | number | sim, se houver origem | (LGPD) |
| `origem.lng` | number | sim, se houver origem | (LGPD) |
| `origem.updatedAt` | timestamp | sim, se houver origem | (LGPD) |
| `queroIr.itemId` | string | sim | igual ao id do documento |
| `queroIr.createdAt` | timestamp | sim | |
| `trafficAlerts.nivel` | string | não | Livre, Cheio ou Muito Cheio |
| `trafficAlerts.sairAs` | string | não | hora em Recife, ex. `18h40` |
| `trafficAlerts.etaMinutos` | number | não | |
| `trafficAlerts.sentAt` | timestamp | não | trava o segundo push de trânsito |
| `trafficAlerts.nudgeEm` | timestamp | não | trava o segundo pedido para abrir o app |
| `mapsUsage.count` | number | sim | chamadas da Routing API no mês |

Destino fixo do job: Centro de Convenções de Campina Grande, Arco Metropolitano, `-7.2275974, -35.8438964` (OpenStreetMap). O campo `location` do item continua sendo o espaço.

## Regras de negócio

- O admin só publica `date`, `time` e `location` em `programItems`.
- O texto do push de trânsito é: `Tá chegando a hora de {título}! Atualmente, o trânsito está {nível}. Se você for de carro de aplicativo, recomendamos sair às {hora} para chegar com segurança ao local.`
- Razão = duração com trânsito / (duração com trânsito menos o atraso). Abaixo de 1,15 é Livre. Até 1,45 é Cheio. Acima é Muito Cheio. Atraso maior ou igual à duração é Muito Cheio.
- Recalcula a rota se a última tiver 20 minutos ou mais, ou se data e hora do item mudaram.
- Consultas ao TomTom em fila de 2. Uma origem por chamada. Sem instruções e sem geometria.
- Sem cartão: TomTom Freemium (20.000 rotas/mês; a trava interna é 8.000) e GitHub Actions no runner Linux padrão, cron só em fevereiro (cota de 2.000 minutos do plano Free).

## Critérios de aceite

- [ ] Dá para marcar e desmarcar Quero ir na Agenda
- [ ] A localização é explicada antes do pedido do sistema e pode ser apagada em Conta
- [ ] A hora de sair desconta o tempo da rota e 15 minutos
- [ ] O mesmo par pessoa + item não recebe dois pushes de trânsito
- [ ] Coordenada velha não gera hora nem classificação inventadas
- [ ] O job para de chamar o TomTom ao chegar em 8.000 no mês
- [ ] O cron automático só existe na janela de fevereiro de 2027
- [ ] Push com trânsito real no aparelho (build de desenvolvimento; fora do Expo Go)

## Anti-slop

Não é app de navegação. Não há mapa, rota desenhada nem pílula de categoria. O botão é texto na linha do horário.

## Referências

- Specs irmãs: 004 (programação), 008 (push e `deviceTokens`)
- TomTom Routing API Orbis v3, `traffic=live`
- Site oficial: https://encontrodafamiliacatolica.com.br/programacao/
