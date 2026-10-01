# Spec: 005-benfeitor-da-fe Benfeitor da Fé

- Status: `in-progress` (página e formulário no app; o e-mail para a comissão fica sem envio até a comissão informar o endereço)
- Complexidade: `alta`
- Personas: `fiel`
- Depende de: [001-autenticacao](../001-autenticacao/), [002-navegacao-e-home](../002-navegacao-e-home/), [008-app-react-native](../008-app-react-native/)

> **Página restaurada em 01/10/2026.** A tela saiu do app em 28/09/2026, quando a campanha virou um link externo para `https://benfeitordafe.comunidadepiox.org.br/crescer`. Ela voltou como rota de verdade, e cada envio agora também chega por e-mail no endereço da comissão. A aba **Benfeitor** da barra inferior é rota de novo, e o CTA da Home abre a tela em vez do site.

## Problema

O encontro depende de apoio contínuo. O fiel precisa entender a campanha e deixar um cadastro, e a comissão precisa receber esse cadastro sem depender de o fiel falar com ela no WhatsApp por conta própria.

## Escopo

### Entra

- Aba **Benfeitor** na barra inferior do app, como rota de verdade
- Página de campanha com o formulário de nome, e-mail, celular e CPF, mais o consentimento de LGPD
- Envio do lead para o e-mail da comissão, além da gravação em `benefactorLeads`
- E-mail com os dados do lead e o endereço do fiel em `reply_to`, para a comissão responder direto
- Leitura da coleção `benefactorLeads` pelo admin, sem alteração

### Não entra

- Gateway, Pix copia-e-cola automático, boleto, cartão, assinatura recorrente no app
- Valor de contribuição
- Área "meu histórico de doações"
- Anexo, PDF ou segunda mensagem para o fiel depois do envio
- Captcha matemático do site oficial (1+1) se o Auth já autenticou o fiel; manter só se o risco de spam exigir depois

## Fluxos

1. Fiel toca Benfeitor na barra inferior e a página da campanha abre dentro do app.
2. Ele preenche nome, e-mail, celular e CPF, marca o consentimento de LGPD e toca em **Quero participar**.
3. O app envia os dados para a rota do servidor pelo token da sessão. A rota valida tudo de novo, grava em `benefactorLeads` e dispara o e-mail para a comissão.
4. O lead é sempre gravado primeiro. O e-mail é uma segunda via: se ele falhar, o cadastro continua na mesa em `/admin/leads` e a tela confirma o recebimento com a frase que corresponde ao que de fato aconteceu.
5. Se já existir lead do mesmo `uid`, a tela abre direto na confirmação, sem mostrar o formulário de novo.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota do app | `/benfeitor` |
| Rota do servidor | `POST /api/lead-benfeitor` |
| Coleção | `benefactorLeads` |
| Leitura do admin | `/admin/leads` |
| Envio de e-mail | Resend, por `fetch`, em `lib/server/emailBenfeitor.js` |
| Papel | `fiel` para enviar; `admin` para ler os leads |

## Dados

Documento `benefactorLeads/{id}`. O contrato dos campos do lead não mudou. A gravação passa a ser do Admin SDK, dentro do Route Handler, e não do client.

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `name` | string | sim | (LGPD) |
| `email` | string | sim | (LGPD) obrigatório no formulário restaurado |
| `phone` | string | sim | (LGPD) só dígitos internamente |
| `cpf` | string | sim | (LGPD) só dígitos internamente |
| `lgpdConsent` | bool | sim | sempre `true`; sem ele a rota recusa |
| `lgpdConsentAt` | timestamp | sim | |
| `uid` | string | sim | quem enviou |
| `status` | `'novo'` \| `'contatado'` \| `'descartado'` | sim | default `novo` |
| `emailAvisado` | bool | sim | se o e-mail para a comissão saiu |
| `emailAvisadoEm` | timestamp \| null | sim | null quando o envio falhou ou não foi tentado |
| `createdAt` | timestamp | sim | |

Variáveis de ambiente, todas no servidor:

| Variável | Obrigatória | Nota |
|---|---|---|
| `RESEND_API_KEY` | para enviar | Chave da conta Resend. Sem ela o lead é gravado e o e-mail não sai |
| `EMAIL_BENFEITOR_DESTINO` | para enviar | Endereço da comissão. A constante `DESTINO` em `lib/server/emailBenfeitor.js` é o lugar oficial; a variável sobrescreve |
| `EMAIL_BENFEITOR_REMETENTE` | para enviar | Remetente verificado na Resend. Sem valor, a rota usa `Crescer <onboarding@resend.dev>` |

## Regras de negócio

- A aba Benfeitor é rota do expo-router, não link externo. Um `Tabs.Screen` sem arquivo quebra o bundle, e link que finge ser tela pisca em branco ao toque.
- O app não grava nada. Quem grava é a rota do servidor, pelo Admin SDK, o mesmo caminho de `testimonials`.
- A escrita do client em `benefactorLeads` está fechada nas rules. O Admin SDK não passa por rule, então a gravação continua funcionando.
- Sem consentimento, nada é gravado e nenhum e-mail sai.
- CPF válido por algoritmo e celular com DDD. A máscara é visual; no Firestore e no e-mail vai só dígito, com a formatação montada na hora de escrever.
- O e-mail vai para um endereço só. Sem cópia para o fiel, que já tem o contato da equipe na tela de confirmação.
- O e-mail nunca decide o sucesso do cadastro. Falha do Resend, chave ausente ou destino vazio não apagam nem invalidam o lead.
- Sem chave ou sem destino, a tela não mostra erro e não promete notificação por e-mail. A confirmação muda de frase, porque é isso que a pessoa precisa saber.
- Sem gateway de pagamento no client. O app não processa pagamento.
- Copy alinhada ao site oficial, sem travessão, sem "jornada de doação".
- O fiel não lista a coleção inteira. Só o admin.

## Critérios de aceite

- [x] A aba Benfeitor da barra inferior abre a página dentro do app, sem piscar em branco
- [x] A Home abre `/benfeitor` pelo CTA "Quero ser Benfeitor da Fé"
- [x] Nome, e-mail, celular e CPF são validados no app e de novo na rota do servidor
- [x] O consentimento de LGPD é obrigatório para gravar e para enviar
- [x] Cada envio cria um documento em `benefactorLeads` com `status: novo`, `uid` da sessão e CPF só com dígitos
- [ ] Cada envio chega por e-mail no endereço da comissão, com os dados do lead e o `reply_to` no e-mail do fiel. Pendente: a comissão ainda não informou o endereço, então `DESTINO` em `lib/server/emailBenfeitor.js` está vazio e o envio real não foi conferido
- [x] Sem `RESEND_API_KEY` ou sem destino, o lead continua gravado e a tela não promete o e-mail
- [x] Reabrir a aba depois do envio mostra a confirmação, sem o formulário de novo
- [x] `/admin/leads` continua lendo `benefactorLeads` sem alteração
- [x] `RESEND_API_KEY` e o destino do e-mail não aparecem no bundle do app

## Anti-slop

Não é landing de crowdfunding com barra de meta e números gigantes. A tela tem a cara de um formulário institucional: texto à esquerda, sem pílula, sem gradiente, sem número hero. A confirmação não usa check verde de SaaS e não afirma que pagamento nenhum aconteceu.

## Referências

- Campanha no site da comunidade: https://benfeitordafe.comunidadepiox.org.br/crescer
- Mantenedora e CNPJ em [VISION.md](../VISION.md)
- Barro da barra e item externo que saiu: [002-navegacao-e-home](../002-navegacao-e-home/spec.md)
- Rota de referência do envio com token: [013-testimunhos](../013-testimunhos/spec.md)