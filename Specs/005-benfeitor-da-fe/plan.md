# Plan: 005-benfeitor-da-fe Benfeitor da Fé

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

Página autenticada com bloco editorial + formulário controlado. Validação de CPF/telefone em `lib/benfeitor/`. Write só com `lgpdConsent == true`. Admin consulta leads na 007 (lista simples). Destino WhatsApp/e-mail fica atrás da decisão de OPEN-QUESTIONS; o plan já reserva o helper `whatsappHref`.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `app/(app)/benfeitor/page.jsx` | campanha + form + confirmação |
| `lib/benfeitor/validate.js` | CPF, telefone, campos |
| `lib/benfeitor/submit.js` | `addDoc` em `benefactorLeads` |
| `lib/benfeitor/whatsapp.js` | URL opcional |
| `firestore.rules` | create autenticado do próprio uid; get/list só admin |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `benefactorLeads` | admin | create: `auth.uid == uid` e `lgpdConsent` | `createdAt` desc para o admin |

Regras:

- create: autenticado, `uid == request.auth.uid`, `lgpdConsent == true`, `status == 'novo'`
- update/delete: só admin (007)
- read: só admin

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
| Usuário envia várias vezes | permitir mais de um lead; admin vê duplicatas pelo uid/cpf |
| Confundir com checkout | copy e UI sem preço, sem Pix QR |

## Fora deste plan

Pagamento, CRM externo, e-mail transacional (salvo decisão futura).
