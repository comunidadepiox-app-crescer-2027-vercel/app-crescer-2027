# Spec: 018-fornecedor-food-park Formulário de fornecedores do Food Park

- Status: `in-progress` (implementada; teste em aparelho pendente)
- Complexidade: `media`
- Personas: `fiel`
- Depende de: [008-app-react-native](../008-app-react-native/), [012-fornecedores](../012-fornecedores/), [017-voluntariado](../017-voluntariado/)

## Problema

A página `/fornecedor` mostra Food Park e Outros como cards visuais. O fornecedor que quer participar do Food Park não tem caminho dentro do app para o formulário oficial: o card tem seta, mas não responde ao toque, e a inscrição só existe fora do app.

## Escopo

### Entra

- Card Food Park da página `/fornecedor` acionável, abrindo `/fornecedor/food-park`
- Rota autenticada `/fornecedor/food-park`, com cabeçalho laranja **FOOD PARK** e Voltar para `/fornecedor`
- Tela única com o cabeçalho e o JotForm oficial embutido, sem etapa intermediária
- Formulário em tela cheia abaixo do cabeçalho, com carregamento, erro e nova tentativa
- Reuso do componente `FormularioJotform` criado na 017
- Endereço `https://form.jotform.com/262965480631665` centralizado em `mobile/lib/links.js`
- Links externos do formulário abertos fora do WebView
- Botão físico de voltar do Android navegando dentro do formulário antes de sair da tela
- Card Outros mantido como informativo, sem ação e sem seta

### Não entra

- Formulário para Outros ou qualquer outra categoria de fornecedor
- Formulário nativo ou campos de inscrição dentro do app
- Leitura, gravação ou interceptação de dados do formulário no Firestore ou em qualquer storage do app
- Alteração do formulário JotForm, das regras de seleção ou do processo de aprovação
- Upload de foto próprio, câmera customizada ou galeria própria
- Alteração do formulário de voluntário ou da rota `/voluntario`
- Login próprio para o formulário; a sessão anônima do app continua valendo
- Notificação de status da inscrição

## Fluxos

1. O fiel abre a folha central e toca em Fornecedor.
2. A folha fecha e `/fornecedor` abre.
3. O fiel toca no card Food Park, inclusive na seta.
4. `/fornecedor/food-park` abre, com o cabeçalho **FOOD PARK** e o retorno para `/fornecedor`.
5. O JotForm oficial carrega dentro do WebView e o fiel preenche a inscrição no app.
6. Ao sair, o Voltar do cabeçalho retorna para a lista de fornecedores; o voltar físico do Android usa o histórico do WebView quando existe e, sem histórico, sai da tela.
7. Se o formulário não carregar, a tela mostra o motivo e oferece tentar de novo ou abrir o endereço no navegador.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota Expo Router | `/fornecedor` |
| Rota Expo Router | `/fornecedor/food-park` |
| Componente | `mobile/components/FormularioJotform.jsx` |
| Endereço externo | `https://form.jotform.com/262965480631665` em `mobile/lib/links.js` |
| Coleções Firestore | nenhuma |
| Papel necessário | `fiel` autenticado |

## Dados

Nenhum contrato de dado novo. O app não lê, grava ou encaminha os dados digitados no formulário. O WebView carrega a página oficial do JotForm, e a submissão vai direto para o JotForm.

O formulário coleta dados cadastrais do fornecedor e do responsável, conforme o formulário oficial. A coleta e o tratamento são os do formulário e do termo apresentado nele. O app não armazena nem registra esses valores. Nenhuma informação do formulário passa por `mobile/lib` ou pelo Firestore.

## Regras de negócio

- A rota exige sessão, como as demais telas internas, e redireciona para `/` sem ela.
- O card Food Park é acionável no corpo inteiro e na seta, e abre `/fornecedor/food-park`.
- O card Outros permanece informativo, sem ação e sem seta, para não prometer um destino que não existe.
- A tela do formulário tem somente o cabeçalho e o formulário. Não há cards nem texto de apoio acima dele.
- O formulário é o oficial, na URL informada. O app não cria campos paralelos nem reaproveita o formulário em outra tela.
- O app não injeta scripts para ler ou alterar os valores do formulário. A única injeção permitida é a de navegação e estados de carregamento.
- O formulário abre no WebView. O navegador externo é apenas a alternativa de erro, não o fluxo principal.
- Links de e-mail, telefone e outros aplicativos saem do WebView e abrem no aplicativo correspondente.
- O botão físico de voltar do Android usa o histórico do WebView enquanto houver histórico; sem histórico, sai da tela.
- A barra inferior não aparece nessa rota, porque ela fica fora do grupo `(tabs)`.
- A página de Fornecedor mantém o desenho dos cards da 012 e o cabeçalho laranja.
- Identidade: fundo claro, cabeçalho laranja e formulário em tela cheia. Sem gradiente, sem pílula e sem card de vidro.

## Critérios de aceite

- [x] O card Food Park abre `/fornecedor/food-park`
- [x] `/fornecedor/food-park` exige sessão e volta para `/fornecedor` pelo cabeçalho
- [x] A tela mostra somente o cabeçalho e o JotForm, sem cards ou etapa intermediária
- [ ] O JotForm oficial carrega no WebView, rola, aceita teclado e permite avançar as etapas (teste em aparelho pendente)
- [ ] O seletor de arquivo ou foto do formulário abre no aparelho, se o formulário pedir upload (teste em aparelho pendente)
- [x] Links de e-mail e telefone do formulário abrem fora do WebView
- [x] O voltar físico do Android usa o histórico do WebView quando existe e, sem histórico, sai da tela
- [x] Em erro de carregamento, a tela oferece tentar de novo e abrir no navegador, sem tela em branco
- [x] O card Outros permanece visível, sem ação e sem seta
- [x] Nenhum dado do formulário é gravado pelo app; nenhuma coleção ou regra nova no Firestore
- [x] O bundle do app conclui sem erro

## Anti-slop

Não é um formulário nativo clonado, nem uma tela de inscrição com campos próprios. É a mesma casca honesta da 017 em volta do formulário oficial, com outro endereço. O JotForm mantém o desenho dele dentro do WebView; a identidade do Crescer vale para o cabeçalho e o fundo da tela. Proibido gradiente, pílula, badge, número hero, texto centralizado como padrão de página e botão sem destino.

## Referências

- Specs irmãs: 012 (página de fornecedores), 017 (componente e padrão da tela de formulário), 008 (rotas do app)
- [DESIGN.md](../DESIGN.md)
- Formulário oficial: https://form.jotform.com/262965480631665
