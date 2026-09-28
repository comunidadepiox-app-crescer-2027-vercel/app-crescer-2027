# Plan: 005-benfeitor-da-fe Benfeitor da Fé

- Spec: [spec.md](spec.md)
- Status: `in-progress` (formulário do app arquivado; a aba abre o site)

## Abordagem

A campanha é do site da Comunidade de São Pio X. O app deixa de ter a página e passa a ter um link externo na barra inferior. O que era rota do expo-router vira um item de link na `BarraAbas`, desenhado no mesmo lugar da aba, com o mesmo ícone e o mesmo rótulo.

O item não vira `Tabs.Screen`. Um `Tabs.Screen` sem arquivo quebra o bundle, e uma aba que navega para uma tela inexistente pisca em branco ao toque. A `BarraAbas` recebe uma lista de links externos e os desenha depois das abas, no mesmo componente `ItemAba`, sem pílula e sem destaque além do dourado do ativo.

O formulário e a lib saem das rotas para `mobile/_arquivo/benfeitor/`. Fora de `mobile/app/` o expo-router não enxerga arquivo, e o Metro só empacota o que é importado, então nada disso vai para o bundle. O README da pasta registra o que a tela fazia, as validações e os passos para voltar.

`benefactorLeads`, `/admin/leads` e as regras da coleção ficam como estão. Nenhum lead é apagado e nenhuma regra muda.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/lib/links.js` | `LINK_BENFEITOR`, `LINK_INGRESSO` e `abreLinkExterno`, com o aviso de link pendente |
| `mobile/components/BarraAbas.jsx` | desenha o item de link externo depois da aba Agenda |
| `mobile/app/(tabs)/_layout.jsx` | remove a `Tabs.Screen` de `benfeitor` |
| `mobile/_arquivo/benfeitor/README.md` | o que a tela fazia e o que falta para recriá-la |
| `mobile/_arquivo/benfeitor/BenfeitorScreen.jsx` | tela arquivada: campanha, formulário, LGPD e confirmação |
| `mobile/_arquivo/benfeitor/benfeitorLib.js` | máscaras, validação de CPF e telefone, `submitLead`, `jaTemLead` |
| `app/admin/leads/page.jsx` | inalterado, segue lendo `benefactorLeads` |
| `lib/admin/leads.js` | inalterado |
| `firestore.rules` | inalterado |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `benefactorLeads` | admin: todos; fiel: só `uid == auth.uid` | hoje só o admin, porque o app não grava mais | `createdAt` desc para o admin |

Regras inalteradas:

- create: autenticado, `uid == request.auth.uid`, `lgpdConsent == true`, `status == 'novo'`
- update/delete: só admin
- read: admin, ou o fiel só dos docs com o próprio `uid`

## Cloudinary

Não.

## Ordem de entrega

1. `mobile/lib/links.js` com a constante do Benfeitor e o helper de abertura.
2. `BarraAbas` com o item de link externo e a `Tabs.Screen` de `benfeitor` removida.
3. Mover a tela e a lib para `mobile/_arquivo/benfeitor/` e escrever o README.
4. Conferir que nada mais importa `mobile/lib/benfeitor.js` e que o bundle não leva a pasta.
5. Sync das specs 002 e 008 e do README do mapa.

## Riscos

| Risco | Mitigação |
|---|---|
| Tocar na aba piscar em branco | o item é link, não rota, então não existe tela para o router tentar abrir |
| App quebrar por import morto | a pasta arquivada não é importada por ninguém; o bundle é conferido na validação |
| CPF em texto no Firestore | segue restrito a admin; política de retenção na OPEN-QUESTIONS |
| Confundir com checkout | o app não mostra preço nem Pix QR; quem vê a campanha é o site |

## Fora deste plan

Pagamento, CRM externo, e-mail transacional (salvo decisão futura) e qualquer reativação do formulário no app.

