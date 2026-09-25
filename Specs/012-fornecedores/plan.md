# Plan: 012-fornecedores Página de fornecedores

- Spec: `../012-fornecedores/spec.md`
- Status: `planned`

## Abordagem

Criar uma tela Expo Router autenticada, espelhando a estrutura visual das telas de detalhe existentes. A navegação será feita pelo `expo-router`; os dados serão uma lista local, com `url: null` reservado para os links futuros. Cada opção vira um card branco com ícone em quadrado creme, título em caixa alta e descrição curta. A integração do menu usará a mesma folha central já existente.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/app/fornecedor.jsx` | Tela autenticada, cabeçalho, cards de fornecedores e copy de apoio |
| `mobile/components/MenuAtalhos.jsx` | Adicionar rota ao atalho Fornecedor |

## Firestore

Nenhuma coleção nova ou alteração de contrato.

## Ordem de entrega

1. Registrar a spec e o plano da funcionalidade.
2. Criar a rota autenticada e a lista local com URLs reservadas.
3. Atualizar o menu para navegar à rota.
4. Validar aceite visual, acessibilidade e bundle Expo.

## Riscos

| Risco | Mitigação |
|---|---|
| Links futuros ainda não definidos | Manter `url` explícito como `null` e cards sem `onPress` |
| Imagem com proporção incompatível | Usar `resizeMode="cover"` e altura responsiva |
| Navegação autenticada inconsistente | Reutilizar o padrão de `Redirect` e `useAuth` das telas internas |

## Fora deste plan

CMS, links externos, detalhes individuais de fornecedor e alteração de dados.
