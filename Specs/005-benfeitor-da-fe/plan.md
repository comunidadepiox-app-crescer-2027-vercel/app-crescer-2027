# Plan: 005-benfeitor-da-fe Benfeitor da Fé

- Spec: [spec.md](spec.md)
- Status: `in-progress` (página restaurada como rota, envio por e-mail para a comissão)

## Abordagem

A tela volta para `mobile/app/(tabs)/benfeitor.jsx` e volta a ser `Tabs.Screen`. O link externo que ocupava a barra e o CTA da Home saem. O arquivo da pasta `mobile/_arquivo/benfeitor/` volta para `mobile/lib/benfeitor.js`, porque ele não depende de nada que tenha sido removido.

A parte nova é o envio. O app não manda e-mail e nem grava o lead: ele fala com `POST /api/lead-benfeitor` pelo token do Firebase, o mesmo caminho de `testemunhos`. Assim `RESEND_API_KEY` e o endereço da comissão nunca entram no bundle, e a rota revalida a sessão, os campos e o consentimento antes de qualquer coisa.

A ordem dentro da rota é deliberada: grava primeiro, avisa depois. O e-mail é a segunda via, não a fonte. Se o Resend falhar, ou se a chave e o destino não existirem ainda, o lead continua na mesa em `/admin/leads` e a resposta diz que o e-mail não saiu, para a tela trocar a frase da confirmação. O contrário, devolver erro quando o e-mail falha, deixaria o fiel sem cadastro por causa de um detalhe de envio.

O envio usa `fetch` direto na API do Resend, sem dependência nova no `package.json`, no mesmo formato de `app/api/notify-programa`, que já chama a API do Expo por `fetch`. O remetente e o destino saem do servidor. O destino tem dois lugares, e isso é proposital: a constante `DESTINO` em `lib/server/emailBenfeitor.js` é onde a comissão escreve o endereço, e `EMAIL_BENFEITOR_DESTINO` sobrescreve sem precisar de novo deploy.

## Arquivos e rotas

| Caminho | Responsabilidade |
|---|---|
| `mobile/app/(tabs)/benfeitor.jsx` | tela da campanha, formulário, LGPD e confirmação |
| `mobile/lib/benfeitor.js` | máscaras, validação de CPF e telefone, `validaLead`, WhatsApp e o aviso de e-mail |
| `mobile/lib/enviaLeadBenfeitor.js` | conversa com a rota do servidor pelo token da sessão |
| `app/api/lead-benfeitor/route.js` | valida sessão e dados, grava no Firestore e dispara o e-mail |
| `lib/server/emailBenfeitor.js` | `DESTINO` da comissão, corpo do e-mail e chamada na Resend |
| `mobile/app/(tabs)/_layout.jsx` | volta a `Tabs.Screen` de `benfeitor` |
| `mobile/components/BarraAbas.jsx` | perde `LINK_EXTERNO` e o item de link externo |
| `mobile/app/(tabs)/home.jsx` | o CTA passa a abrir `/benfeitor` |
| `mobile/lib/links.js` | sai a constante `LINK_BENFEITOR`, que não tem mais uso |
| `app/admin/leads/page.jsx` | inalterado, segue lendo `benefactorLeads` |
| `firestore.rules` | a escrita do client em `benefactorLeads` fecha; o Admin SDK continua gravando |

`mobile/_arquivo/benfeitor/` sai do repositório. A tela voltou, e a pasta ficaria com duas versões do mesmo formulário, o que é pior do que não ter histórico.

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `benefactorLeads` | admin: todos; fiel: só `uid == auth.uid` | só o Admin SDK, pela rota | `createdAt` desc para o admin |

Regras:

- create: `false`. Quem grava é a rota com o Admin SDK, e as rules não valem para ele. O client nunca mais escreve, como em `testimonials`.
- update: só admin, para a mesa mudar `status`.
- read: admin, ou o fiel só dos docs com o próprio `uid`. A regra fica como está.
- delete: `false`.

## E-mail

| Item | Valor |
|---|---|
| Transporte | Resend, `POST https://api.resend.com/emails`, sem SDK |
| Remetente | `EMAIL_BENFEITOR_REMETENTE`, ou `Crescer <onboarding@resend.dev>` |
| Destino | `EMAIL_BENFEITOR_DESTINO`, ou a constante `DESTINO` do arquivo |
| `reply_to` | o e-mail que o fiel informou no formulário |
| Conteúdo | nome, e-mail, celular com DDD, CPF, data e origem do app |

O e-mail é texto puro com quebras de linha, sem HTML e sem tabela. A comissão precisa ler no celular, e o assunto já diz de onde veio o cadastro. O CPF aparece porque é dado que a equipe usa para concluir o cadastro de Benfeitor, e o titular autorizou esse uso no checkbox.

Nada de anexo, nada de PDF, nada de segunda mensagem para o fiel. Quem fala com o fiel depois é a equipe, no canal que ela escolher.

## Ordem de entrega

1. `lib/server/emailBenfeitor.js`, com o `DESTINO` vazio e o aviso do que falta.
2. `app/api/lead-benfeitor/route.js`.
3. `mobile/lib/benfeitor.js` e `mobile/lib/enviaLeadBenfeitor.js`.
4. `mobile/app/(tabs)/benfeitor.jsx`.
5. `Tabs.Screen` de volta em `_layout.jsx`, item de link externo fora da `BarraAbas`, CTA da Home em `/benfeitor`, `LINK_BENFEITOR` fora do `links.js`.
6. `firestore.rules` com a escrita do client fechada, `mobile/_arquivo/benfeitor/` removida e `.env.example` com as três variáveis.
7. Sync das specs 002, 008, do README do mapa e das questões em aberto.

## Riscos

| Risco | Mitigação |
|---|---|
| Segredo no bundle | a chave e o destino vivem no servidor; o app só manda para `${EXPO_PUBLIC_API_BASE}/api/lead-benfeitor` |
| CPF em e-mail para o lugar errado | destino vem do servidor, nunca do corpo da requisição; o corpo não consegue apontar o e-mail para fora |
| Spam pela rota | exige sessão válida, exige consentimento, exige CPF válido por algoritmo e trava um lead por `uid` |
| Chave de e-mail vazia em produção | a rota segue gravando e devolve `emailEnviado: false`; a confirmação não promete e-mail |
| E-mail duplicado a cada reenvio | a trava por `uid` responde `jaEnviado` antes de gravar, e a tela abre a confirmação |
| Link externo quebrado | sai `LINK_BENFEITOR` junto com o item da barra, para sobrar uma porta só |
| Estilo da tela arquivada desatualizado | a copy é conferida contra [DESIGN.md](../DESIGN.md) e contra as regras de identidade visual |

## Fora deste plan

Pagamento, CRM externo, e-mail transacional para o fiel, anexos, cópia oculta, múltiplos destinatários e qualquer reativação do link externo para o site da comunidade.