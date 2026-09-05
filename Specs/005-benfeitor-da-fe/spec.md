# Spec: 005-benfeitor-da-fe Benfeitor da Fé

- Status: `in-progress` (implementada; gravação do lead aguarda Firebase configurado)
- Complexidade: `alta`
- Personas: `fiel`
- Depende de: [001-autenticacao](../001-autenticacao/), [002-navegacao-e-home](../002-navegacao-e-home/)

## Problema

O encontro depende de apoio contínuo. O fiel precisa entender a campanha e deixar um cadastro para a comunidade entrar em contato. O app não cobra.

## Escopo

### Entra

- `/benfeitor` com o conteúdo da campanha (o que é, missão, destino da contribuição, como participar)
- Formulário: nome, e-mail, celular, CPF, checkbox de consentimento LGPD
- Gravação em `benefactorLeads`
- Tela de confirmação: a equipe fala no WhatsApp; contribuição mensal é boleto ou Pix no fluxo humano
- Link/WhatsApp da comunidade `(83) 98897-7017` como canal oficial, sem fingir que a mensagem já foi enviada se não foi
- Prefill de nome/e-mail a partir de `users` quando existirem

### Não entra

- Gateway, Pix copia-e-cola automático, boleto, cartão, assinatura recorrente no app
- Valor de contribuição
- Área “meu histórico de doações”
- Captcha matemático do site oficial (1+1) se o Auth já autenticou o fiel; manter só se o risco de spam exigir depois

## Fluxos

1. Fiel lê a campanha.
2. Preenche e marca o consentimento.
3. Envio cria lead `status: novo`.
4. Vê confirmação. Se a operação decidir (OPEN-QUESTIONS), um `wa.me` pode abrir com texto pronto. Isso é extra, não substitui o registro no Firestore.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota | `/benfeitor` |
| Coleção | `benefactorLeads` |
| Cloudinary | nenhuma obrigatória |
| Papel | autenticado |

## Dados

Coleção `benefactorLeads/{id}`

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `name` | string | sim | (LGPD) |
| `email` | string | sim | (LGPD) |
| `phone` | string | sim | (LGPD) |
| `cpf` | string | sim | (LGPD) só dígitos internamente |
| `lgpdConsent` | bool | sim | deve ser `true` |
| `lgpdConsentAt` | timestamp | sim | |
| `uid` | string | sim | quem enviou |
| `status` | `'novo'` \| `'contatado'` \| `'descartado'` | sim | default `novo` |
| `createdAt` | timestamp | sim | |

## Regras de negócio

- Sem consentimento, não grava.
- CPF válido (algoritmo) e celular com DDD.
- O client **não** processa pagamento.
- Copy alinhada ao site oficial, sem travessão, sem “jornada de doação”.
- Fiel cria só o próprio lead (`uid == auth.uid`). Não lê a coleção inteira.

## Critérios de aceite

- [ ] Página explica campanha e os três passos oficiais
- [ ] Envio válido cria documento
- [ ] Envio sem LGPD é bloqueado
- [ ] CPF inválido é recusado
- [ ] Confirmação não promete débito automático
- [ ] Nenhum botão “doar agora” que não tenha destino real (o CTA é “Quero participar” / enviar o formulário)

## Anti-slop

Não é landing de crowdfunding com barra de meta e números gigantes. É página institucional de campanha, como o site da comunidade.

## Referências

- https://benfeitordafe.comunidadepiox.org.br/benfeitordafe
- Mantenedora e CNPJ em [VISION.md](../VISION.md)
