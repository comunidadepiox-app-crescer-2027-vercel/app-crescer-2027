# Spec: 017-voluntariado Voluntariado no app

- Status: `in-progress` (implementada; teste em aparelho pendente)
- Complexidade: `media`
- Personas: `fiel`
- Depende de: [008-app-react-native](../008-app-react-native/), [002-navegacao-e-home](../002-navegacao-e-home/)

## Problema

O atalho Seja Voluntário da folha central abre hoje o JotForm no navegador do aparelho. O fiel sai do app no meio de uma inscrição longa, com dados pessoais e envio de foto, e perde o contexto visual do Crescer. O app não tem uma tela própria de voluntariado.

## Escopo

### Entra

- Rota autenticada `/voluntario`, aberta pelo atalho Seja Voluntário da folha central
- Tela única com o cabeçalho laranja **SEJA VOLUNTÁRIO** e o formulário oficial embutido, sem etapa intermediária
- Cabeçalho com Voltar para a Home
- Formulário em tela cheia abaixo do cabeçalho, com carregamento, erro e nova tentativa
- Links externos do formulário (e-mail, telefone e outros aplicativos) abertos fora do WebView
- Botão físico de voltar do Android navegando dentro do formulário antes de sair da tela
- Endereço do formulário centralizado em `mobile/lib/links.js`
- Permissões de câmera e fotos no iOS para o envio de foto exigido pelo formulário

### Não entra

- Tela de escolha de equipe, cards Food Park e Outros ou qualquer etapa antes do formulário
- Alteração da página `/fornecedor`, que tem fluxo próprio na 018
- Formulário nativo ou campos de inscrição dentro do app
- Leitura, gravação ou interceptação de dados do formulário no Firestore ou em qualquer storage do app
- Outras equipes com formulário próprio
- Alteração do formulário JotForm, das regras de seleção ou do processo de aprovação
- Upload de foto próprio, câmera customizada ou galeria própria
- Login próprio para o formulário; a sessão anônima do app continua valendo
- Notificação de status da inscrição

## Fluxos

1. O fiel abre a folha central e toca em Seja Voluntário.
2. A folha fecha e `/voluntario` abre, com o cabeçalho **SEJA VOLUNTÁRIO** e o retorno para a Home.
3. O JotForm oficial carrega dentro do WebView e o fiel preenche a inscrição no app.
4. Ao sair, o Voltar do cabeçalho retorna para a Home; o voltar físico do Android usa o histórico do WebView quando existe e, sem histórico, sai da tela.
5. Se o formulário não carregar, a tela mostra o motivo e oferece tentar de novo ou abrir o endereço no navegador.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota Expo Router | `/voluntario` |
| Componente | `mobile/components/FormularioJotform.jsx` |
| Endereço externo | `https://form.jotform.com/262908510287057` em `mobile/lib/links.js` |
| Coleções Firestore | nenhuma |
| Papel necessário | `fiel` autenticado |

## Dados

Nenhum contrato de dado novo. O app não lê, grava ou encaminha os dados digitados no formulário. O WebView carrega a página oficial do JotForm, e a submissão vai direto para o JotForm, como já acontece quando o atalho abre o navegador.

O formulário coleta dados pessoais, entre eles nome, CPF, data de nascimento, endereço, telefone, e-mail, foto e, para menores, dados do responsável legal. A coleta e o tratamento são os do formulário oficial e do termo apresentado nele. O app não armazena nem registra esses valores. Nenhuma informação do formulário passa por `mobile/lib` ou pelo Firestore.

## Regras de negócio

- A rota exige sessão, como as demais telas internas, e redireciona para `/` sem ela.
- O atalho Seja Voluntário deixa de abrir o navegador e passa a abrir `/voluntario` dentro do app.
- A tela tem somente o cabeçalho e o formulário. Não há cards, texto de apoio acima do formulário ou etapa de escolha de equipe.
- O formulário é o oficial, na URL informada. O app não cria campos paralelos nem reaproveita o formulário em outra tela.
- O app não injeta scripts para ler ou alterar os valores do formulário. A única injeção permitida é a de navegação e estados de carregamento.
- O formulário abre no WebView. O navegador externo é apenas a alternativa de erro, não o fluxo principal.
- Links de e-mail, telefone e outros aplicativos saem do WebView e abrem no aplicativo correspondente.
- O botão físico de voltar do Android usa o histórico do WebView enquanto houver histórico; sem histórico, sai da tela.
- A barra inferior não aparece nessa rota, porque ela fica fora do grupo `(tabs)`, como `/fornecedor`.
- O fluxo de fornecedores do Food Park é tratado na 018 e não altera o formulário de voluntário.
- Identidade: fundo claro, cabeçalho laranja e formulário em tela cheia. Sem gradiente, sem pílula e sem card de vidro.

## Critérios de aceite

- [x] Seja Voluntário abre `/voluntario` dentro do app e não abre mais o navegador
- [x] `/voluntario` exige sessão e volta para `/home` pelo cabeçalho
- [x] A tela mostra somente o cabeçalho e o JotForm, sem cards ou etapa de escolha de equipe
- [ ] O JotForm oficial carrega no WebView, rola, aceita teclado e permite avançar as etapas (teste em aparelho pendente)
- [ ] O seletor de foto do formulário abre no aparelho e permite anexar uma imagem (teste em aparelho pendente)
- [x] Links de e-mail e telefone do formulário abrem fora do WebView
- [x] O voltar físico do Android usa o histórico do WebView quando existe e, sem histórico, sai da tela
- [x] Em erro de carregamento, a tela oferece tentar de novo e abrir no navegador, sem tela em branco
- [x] Nenhum dado do formulário é gravado pelo app; nenhuma coleção ou regra nova no Firestore
- [x] O bundle do app conclui sem erro

## Anti-slop

Não é um formulário nativo clonado, nem uma tela de inscrição com campos próprios, nem uma lista de equipes. É uma casca honesta em volta do formulário oficial. O JotForm mantém o desenho dele dentro do WebView; a identidade do Crescer vale para o cabeçalho e o fundo da tela. Proibido gradiente, pílula, badge, número hero, texto centralizado como padrão de página e botão sem destino.

## Referências

- Specs irmãs: 002 (folha central), 008 (rotas do app), 012 (página de fornecedores) e 018 (formulário do Food Park)
- [DESIGN.md](../DESIGN.md)
- Formulário oficial: https://form.jotform.com/262908510287057
