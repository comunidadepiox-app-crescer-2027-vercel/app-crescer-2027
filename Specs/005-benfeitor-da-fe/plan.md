# Plan: 005-benfeitor-da-fe Benfeitor da Fé

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

Página autenticada com bloco editorial + formulário controlado. Validação de CPF/telefone em `lib/benfeitor/`. Write só com `lgpdConsent == true`. Admin consulta leads na 007 (lista simples). Destino WhatsApp/e-mail fica atrás da decisão de OPEN-QUESTIONS; o plan já reserva o helper `whatsappHref`.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `app/(app)/benfeitor/page.jsx` | campanha + form + confirmação |
| `lib/benfeitor/validate.js` | CPF, telefone, máscaras, campos |
| `lib/benfeitor/submit.js` | `addDoc` e `jaTemLead` (próprio uid) |
| `firestore.rules` | create autenticado do próprio uid; read: admin ou próprio uid |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `benefactorLeads` | admin: todos; fiel: só `uid == auth.uid` | create: `auth.uid == uid` e `lgpdConsent` | `createdAt` desc para o admin |

Regras:

- create: autenticado, `uid == request.auth.uid`, `lgpdConsent == true`, `status == 'novo'`
- update/delete: só admin (007)
- read: admin, ou o fiel só dos docs com o próprio `uid`

## Cloudinary

Não.

## Ordem de entrega

1. Regras e validador.
2. Página editorial.
3. Formulário + gravação.
4. Confirmação.
5. Helper WhatsApp se a questão aberta for “sim”.

## Riscos

| Risco | Mitigação |
|---|---|
| CPF em texto no Firestore | restringir leitura a admin; política de retenção na OPEN-QUESTIONS |
| Usuário envia várias vezes | a UI mostra a confirmação se já existe lead do uid; admin ainda pode ver duplicatas antigas |
| Confundir com checkout | copy e UI sem preço, sem Pix QR |

## Fora deste plan

Pagamento, CRM externo, e-mail transacional (salvo decisão futura).
