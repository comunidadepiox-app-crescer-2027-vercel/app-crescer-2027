# Spec: 004-cronograma Cronograma

- Status: `in-progress` (implementada; validação com dados reais aguarda Firebase configurado)
- Complexidade: `alta`
- Personas: `fiel` (leitura); escrita é 007
- Depende de: [001-autenticacao](../001-autenticacao/), [002-navegacao-e-home](../002-navegacao-e-home/)

## Problema

O encontro tem vários espaços no mesmo dia. O fiel precisa ver o que acontece hoje na Home e a programação inteira numa página só, no modelo do site oficial.

## Escopo

### Entra

- `/cronograma` com seleção de dia da edição (controle em linha, não pílula)
- Dentro do dia, seções por espaço:
  - Palco Principal
  - Palco Musical e Cultural
  - Espaço para Autógrafos
  - Palestras Formativas
  - Espaço para Crianças
  - Espaço para Jovens
- Cada item: horário, título, convidado/pregador (se houver), local
- Aviso fixo: horários e convidados podem mudar sem aviso prévio
- Home consome o recorte do dia definido na 002

### Não entra

- Lembrete push
- Mapa indoor
- Edição pelo fiel
- Import automático da página `/programacao/` do WordPress

## Fluxos

1. Abre Cronograma → dia padrão (hoje / primeiro / último, mesma regra da Home).
2. Troca o dia → lista dos espaços daquele dia.
3. Home “hoje” escuta a mesma coleção e recorta o dia da regra 002.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota | `/cronograma` |
| Coleções | `programDays` (opcional), `programItems` |
| Cloudinary | não obrigatório |
| Papel | autenticado |

## Dados

Coleção `programItems/{id}`

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `date` | string `YYYY-MM-DD` | sim | data civil em Recife |
| `time` | string `HH:mm` | sim | |
| `title` | string | sim | |
| `guest` | string | não | pregador, cantor, equipe |
| `location` | string | sim | ex.: Centro de Convenções |
| `space` | enum | sim | ver lista abaixo |
| `order` | number | sim | desempate no mesmo horário |
| `notes` | string | não | |
| `published` | bool | sim | |

Enum `space`: `palco-principal` | `palco-musical` | `autografos` | `palestras` | `criancas` | `jovens`

`programDays` é opcional: `{ date, label, weekday }`. Se não existir, derivar os dias distintos de `programItems`.

## Regras de negócio

- Fiel só vê `published == true`.
- A lista pública filtra `published` no Firestore e recorta `date` / ordem no client, para não depender de índice composto.
- Espaço sem itens no dia não inventa card vazio decorativo; some ou mostra uma linha “Sem programação neste espaço”.
- Não transformar espaços em chips redondos.

## Critérios de aceite

- [ ] Dá para ver todos os espaços do site oficial
- [ ] Troca de dia atualiza a lista
- [ ] Home e Cronograma usam o mesmo recorte de “hoje”
- [ ] Aviso de alteração de horário aparece
- [ ] Estado vazio se a coleção estiver sem dados

## Anti-slop

Não é calendário SaaS com pills de categoria. É programação de evento: dia, horário, local, nome.

## Referências

- https://encontrodafamiliacatolica.com.br/programacao/
