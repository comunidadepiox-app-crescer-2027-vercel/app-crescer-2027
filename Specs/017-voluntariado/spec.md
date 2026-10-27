# Spec: 017-voluntariado Voluntariado no app

- Status: `in-progress` (implementada; teste em aparelho pendente)
- Complexidade: `media`
- Personas: `fiel`
- Depende de: [008-app-react-native](../008-app-react-native/), [002-navegacao-e-home](../002-navegacao-e-home/)

## Problema

O atalho Seja Voluntário da folha central abre hoje o JotForm no navegador do aparelho. O fiel sai do app no meio de uma inscrição longa, com dados pessoais e envio de foto, e perde o contexto visual do Crescer. O app não tem uma tela própria de voluntariado nem um caminho claro para a equipe do Food Park.

## Escopo

### Entra

- Rota autenticada `/voluntario`, aberta pelo atalho Seja Voluntário da folha central
- Tela de escolha de equipe com os cards Food Park e Outros, no mesmo desenho da página Fornecedor
- Food Park abre `/voluntario/food-park`
- Outros fica visível, sem ação, com texto de que outras equipes serão divulgadas
- Rota autenticada `/voluntario/food-park` com o JotForm oficial embutido em WebView
- Cabeçalho laranja com Voltar: na primeira tela, para a Home; na segunda, para a lista de equipes
- Formulário em tela cheia abaixo do cabeçalho, com carregamento, erro e nova tentativa
- Links externos do formulário (e-mail, telefone e outros aplicativos) abertos fora do WebView
- Botão físico de voltar do Android navega dentro do formulário antes de sair da tela
- Endereço do formulário centralizado em `mobile/lib/links.js`
- Permissões de câmera e fotos no iOS para o envio de foto exigido pelo formulário

### Não entra

- Formulário nativo ou campos de inscrição dentro do app
- Leitura, gravação ou interceptação de dados do formulário no Firestore ou em qualquer storage do app
- Outras equipes além de Food Park com formulário próprio
- Alteração do formulário JotForm, das regras de seleção ou do processo de aprovação
- Upload de foto próprio, câmera customizada ou galeria própria
- Login próprio para o formulário; a sessão anônima do app continua valendo
- Notificação de status da inscrição

## Fluxos

1. O fiel abre a folha central e toca em Seja Voluntário.
2. A folha fecha e `/voluntario` abre, com o cabeçalho SEJA VOLUNTÁRIO e o retorno para a Home.
3. A tela mostra os cards Food Park e Outros.
4. O fiel toca em Food Park.
5. `/voluntario/food-park` abre, com o cabeçalho FOOD PARK e o retorno para `/voluntario`.
6. O JotForm oficial carrega dentro do WebView e o fiel preenche a inscrição no app.
7. Ao sair, o Voltar do cabeçalho retorna para a lista de equipes; o voltar físico do Android usa o histórico do WebView quando existe e, sem histórico, sai da tela.
8. Se o formulário não carregar, a tela mostra o motivo e oferece tentar de novo ou abrir o endereço no navegador.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota Expo Router | `/voluntario` |
| Rota Expo Router | `/voluntario/food-park` |
| Componente | `mobile/components/FormularioJotform.jsx` |
| Ícones | `Utensils` e `Store` do `lucide-react-native` |
| Endereço externo | `https://form.jotform.com/262908510287057` em `mobile/lib/links.js` |
| Coleções Firestore | nenhuma |
| Papel necessário | `fiel` autenticado |

## Dados

Nenhum contrato de dado novo. O app não lê, grava ou encaminha os dados digitados no formulário. O WebView carrega a página oficial do JotForm, e a submissão vai direto para o JotForm, como já acontece quando o atalho abre o navegador.

O formulário coleta dados pessoais, entre eles nome, CPF, data de nascimento, endereço, telefone, e-mail, foto e, para menores, dados do responsável legal. A coleta e o tratamento são os do formulário oficial e do termo apresentado nele. O app não armazena nem registra esses valores. Nenhuma informação do formulário passa por `mobile/lib` ou pelo Firestore.

A lista de equipes é local e não vem do Firestore:

| id | Título | Ação |
|---|---|---|
| `food-park` | Food Park | `/voluntario/food-park` |
| `outros` | Outros | nenhuma, reservado para uma próxima entrega |

## Regras de negócio

- As duas rotas exigem sessão, como as demais telas internas, e redirecionam para `/` sem ela.
- O atalho Seja Voluntário deixa de abrir o navegador e passa a abrir `/voluntario` dentro do app.
- O card Food Park é acionável e leva ao formulário. O card Outros é informativo, não é botão e não aponta para destino inexistente.
- O formulário é o oficial, na URL informada. O app não cria campos paralelos nem reaproveita o formulário em outra tela.
- O app não injeta scripts para ler ou alterar os valores do formulário. A única injeção permitida é a de navegação e estados de carregamento.
- O formulário abre no WebView. O navegador externo é apenas a alternativa de erro, não o fluxo principal.
- A tela do formulário não adiciona texto de apoio acima dele: mostra só o cabeçalho e o formulário, como decidido.
- Links de e-mail, telefone e outros aplicativos saem do WebView e abrem no aplicativo correspondente.
- O botão físico de voltar do Android volta uma etapa do formulário enquanto houver histórico; sem histórico, sai da tela.
- A barra inferior não aparece nessas rotas, porque elas ficam fora do grupo `(tabs)`, como `/fornecedor`.
- A primeira tela volta para `/home`; a segunda volta para a lista de equipes.
- Identidade: fundo claro, uma coluna, cabeçalho laranja, cards brancos com borda, ícone em quadrado creme, títulos em caixa alta e texto à esquerda. Sem gradiente, sem pílula e sem card de vidro.

## Critérios de aceite

- [x] Seja Voluntário abre `/voluntario` dentro do app e não abre mais o navegador
- [x] `/voluntario` exige sessão e volta para `/home` pelo cabeçalho
- [x] A tela mostra Food Park e Outros no mesmo desenho dos cards de `/fornecedor`, sem barra inferior
- [x] Food Park abre `/voluntario/food-park`
- [x] Outros permanece visível, sem ação e sem seta, sem prometer um destino que não existe
- [x] `/voluntario/food-park` exige sessão e volta para `/voluntario`
- [ ] O JotForm oficial carrega no WebView, rola, aceita teclado e permite avançar as etapas (teste em aparelho pendente)
- [ ] O seletor de foto do formulário abre no aparelho e permite anexar uma imagem (teste em aparelho pendente)
- [x] Links de e-mail e telefone do formulário abrem fora do WebView
- [x] O voltar físico do Android usa o histórico do WebView quando existe e, sem histórico, sai da tela
- [x] Em erro de carregamento, a tela oferece tentar de novo e abrir no navegador, sem tela em branco
- [x] Nenhum dado do formulário é gravado pelo app; nenhuma coleção ou regra nova no Firestore
- [x] O bundle do app conclui sem erro

## Anti-slop

Não é um formulário nativo clonado, nem uma tela de inscrição com campos próprios. É uma página de escolha de equipe no padrão editorial do app e uma casca honesta em volta do formulário oficial. O JotForm mantém o desenho dele dentro do WebView; a identidade do Crescer vale para o cabeçalho, os cards e o fundo da tela. Proibido gradiente, pílula, badge, número hero, texto centralizado como padrão de página e botão sem destino.

## Referências

- Specs irmãs: 002 (folha central), 008 (rotas do app), 012 (desenho dos cards)
- [DESIGN.md](../DESIGN.md)
- Formulário oficial: https://form.jotform.com/262908510287057
