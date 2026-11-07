# Plan: 019-conafam Página do CONAFAM

- Spec: [spec.md](spec.md)
- Status: `in-progress`

## Abordagem

A folha central deixa de tratar o CONAFAM como link externo: o item passa a usar a rota interna `/conafam`, no mesmo mecanismo dos demais atalhos de página. A tela nova reusa a casca da página de Fornecedor (cabeçalho laranja com `Voltar`, `ScrollView`, cards brancos com ícone em quadrado creme, título em caixa alta e seta) e acrescenta a logo oficial e o texto de apresentação acima dos cards.

Os dois destinos externos ficam em `mobile/lib/links.js` e são abertos por `abreLinkExterno`, que já mostra aviso quando o aparelho recusa o endereço. A tela não cria formulário, não grava dados e não abre WebView: a compra e a navegação do congresso acontecem nos sites oficiais.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/lib/links.js` | constantes `LINK_CONAFAM_SITE` e `LINK_CONAFAM_INGRESSO` com os endereços oficiais |
| `mobile/components/MenuAtalhos.jsx` | atalho CONAFAM passa de `url` para `rota: "/conafam"` |
| `mobile/app/conafam.jsx` | tela autenticada com logo, apresentação e os dois cards de destino |
| `Specs/019-conafam/spec.md` | contrato da feature |
| `Specs/019-conafam/plan.md` | este plano |
| `Specs/019-conafam/tasks.md` | checklist de implementação |
| `Specs/002-navegacao-e-home/spec.md` | incluir o atalho e a rota do CONAFAM |
| `Specs/008-app-react-native/spec.md` | incluir `/conafam` na superfície de rotas |
| `Specs/README.md` | incluir a 019 no mapa das specs |
| `Specs/OPEN-QUESTIONS.md` | registrar a decisão de troca do link direto pela página |

## Firestore

Nenhuma coleção nova, nenhuma leitura e nenhuma escrita. A tela é estática e só abre endereços externos.

## Cloudinary

Não. A logo é um asset local do app.

## Ordem de entrega

1. Constantes dos endereços do CONAFAM em `mobile/lib/links.js`.
2. Atalho do menu central apontando para `/conafam`.
3. Tela `mobile/app/conafam.jsx` com logo, texto e cards.
4. Sincronia das specs 002, 008, README e OPEN-QUESTIONS e da nova 019.
5. `npx expo export --platform android` e teste no Expo Go/aparelho.

## Riscos

| Risco | Mitigação |
|---|---|
| O atalho continuar abrindo o link direto e ignorar a página | trocar a propriedade `url` por `rota` no item CONAFAM e conferir o fluxo no menu |
| A logo WebP não renderizar em algum aparelho | o app já usa WebP em outras telas; usar `Image` local com `resizeMode="contain"` e testar no aparelho |
| O texto longo empurrar os cards para fora da primeira dobra | usar `ScrollView`, como na página de Fornecedor, com espaçamento entre os blocos |
| O navegador recusar um dos endereços | usar `abreLinkExterno`, que mostra aviso curto em vez de falhar em silêncio |
| A página parecer uma segunda página de ingressos | manter a apresentação institucional e os dois caminhos com o mesmo peso visual |
| O usuário sem sessão acessar a rota | aplicar o mesmo `Redirect` para `/` usado nas demais telas internas |

## Fora deste plan

Programação e palestrantes no app, checkout ou pagamento, emissão de ingresso, gravação de inscrição no Firestore, formulário próprio, notificações de status e alteração da página de Fornecedor.
