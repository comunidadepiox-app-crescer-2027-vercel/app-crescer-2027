# Spec: 019-conafam Página do CONAFAM

- Status: `in-progress` (implementada; teste em aparelho pendente)
- Complexidade: `media`
- Personas: `fiel`
- Depende de: [002-navegacao-e-home](../002-navegacao-e-home/), [008-app-react-native](../008-app-react-native/)

## Problema

O atalho CONAFAM da folha central abre direto o endereço de ingressos, sem apresentar o congresso nem oferecer o site oficial. O fiel precisa de uma página de entrada, no mesmo padrão da página de Fornecedor, que explique o CONAFAM e deixe claros os dois caminhos: conhecer o evento e comprar o ingresso.

## Escopo

### Entra

- Atalho CONAFAM da folha central passa a abrir a rota interna `/conafam`, em vez de um endereço externo
- Rota autenticada `/conafam`, com cabeçalho laranja **CONAFAM** e volta para a Home
- Logo oficial do CONAFAM no topo da página, a partir de `mobile/assets/logo-CONAFAM.webp`
- Texto de apresentação do congresso e bloco "Para quem é", nas palavras fornecidas pela comunidade
- Dois cards grandes e acionáveis, no desenho da página de Fornecedor:
  - **Site Oficial** abre `https://conafam.com.br/`
  - **Adquira já seu ingresso** abre `https://evento.agendacatolica.com/conafam-2027`
- Endereços centralizados em `mobile/lib/links.js`
- Links externos abertos no navegador do aparelho, com aviso em caso de falha

### Não entra

- Programação, palestrantes ou conteúdo próprio do congresso dentro do app
- Checkout, pagamento ou emissão de ingresso dentro do app
- Leitura, gravação ou alteração de dados do CONAFAM no Firestore
- Alteração do site oficial ou da página de ingressos
- Formulário, inscrição própria ou captura de dados pessoais
- Notificação de status de inscrição
- Alteração da página de Fornecedor ou do formulário do Food Park

## Fluxos

1. O fiel abre a folha central e toca em CONAFAM.
2. A folha fecha e `/conafam` abre.
3. O fiel lê a apresentação do congresso e vê a logo oficial.
4. Toca em Site Oficial e o navegador abre `https://conafam.com.br/`.
5. Ou toca em Adquira já seu ingresso e o navegador abre `https://evento.agendacatolica.com/conafam-2027`.
6. O Voltar do cabeçalho retorna para a Home.
7. Se o aparelho não conseguir abrir o endereço, o app mostra um aviso curto, sem tela em branco.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota Expo Router | `/conafam` |
| Rota de origem | folha central da Home |
| Asset | `mobile/assets/logo-CONAFAM.webp` |
| Endereço externo | `https://conafam.com.br/` em `mobile/lib/links.js` |
| Endereço externo | `https://evento.agendacatolica.com/conafam-2027` em `mobile/lib/links.js` |
| Coleções Firestore | nenhuma |
| Papel necessário | `fiel` autenticado |

## Dados

Nenhum contrato de dado novo. O app não lê, grava nem encaminha dados do fiel. Os dois destinos são páginas externas oficiais, e toda a interação de inscrição ou compra acontece fora do app.

## Regras de negócio

- A rota exige sessão, como as demais telas internas, e redireciona para `/` sem ela.
- O atalho CONAFAM abre `/conafam` e não abre mais o endereço de ingressos diretamente.
- A página mostra a logo oficial, a apresentação do congresso e o bloco "Para quem é", sem resumir ou reescrever o texto da comunidade.
- Os dois cards são acionáveis no corpo inteiro e abrem o navegador do aparelho.
- Nenhum dos dois cards depende do outro: Site Oficial e Ingresso são caminhos independentes.
- Os endereços oficiais vivem em `mobile/lib/links.js`, sem cópia local na tela.
- O botão de voltar do cabeçalho leva sempre para `/home`.
- A página fica fora do grupo `(tabs)`, portanto sem barra inferior.
- A identidade segue `Specs/DESIGN.md`: fundo claro, cabeçalho laranja, cards brancos com borda, ícone em quadrado creme, títulos em caixa alta e alinhamento à esquerda.

## Critérios de aceite

- [x] O atalho CONAFAM do menu abre `/conafam` e fecha a folha
- [x] A tela abre somente com sessão autenticada
- [x] O cabeçalho exibe **CONAFAM** e retorna para a Home
- [ ] A logo oficial do CONAFAM aparece no topo, nítida e sem distorção (teste em aparelho pendente)
- [x] A apresentação e o bloco "Para quem é" usam o texto fornecido pela comunidade
- [ ] Site Oficial abre `https://conafam.com.br/` no navegador (teste em aparelho pendente)
- [ ] Adquira já seu ingresso abre `https://evento.agendacatolica.com/conafam-2027` no navegador (teste em aparelho pendente)
- [x] Os dois cards têm ícone, título, descrição curta e seta
- [x] A página não tem navegação inferior nem ação sem destino
- [x] A falha ao abrir um endereço mostra aviso, sem tela em branco

## Anti-slop

A página não é landing de venda nem clone do site do congresso. É uma página de entrada do app, com a logo oficial e os dois destinos reais. Proibido gradiente, pílula, badge, número hero, texto centralizado como padrão de página, card de vidro e botão sem destino.

## Referências

- Specs irmãs: 012 (desenho dos cards), 018 (página interna com volta), 002 (folha central), 008 (rotas do app)
- [DESIGN.md](../DESIGN.md)
- Site oficial: https://conafam.com.br/
- Ingressos: https://evento.agendacatolica.com/conafam-2027
