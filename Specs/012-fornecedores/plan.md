# Plan: 012-fornecedores Página de fornecedores

- Spec: `../012-fornecedores/spec.md`
- Status: `in-progress` (atualizado pela 018)

## Abordagem

Criar uma tela Expo Router autenticada, espelhando a estrutura visual das telas de detalhe existentes. A navegação será feita pelo `expo-router`; os dados serão uma lista local, com Food Park apontando para `/fornecedor/food-park` (018) e Outros reservado com `rota: null`. Cada opção vira um card branco com ícone em quadrado creme, título em caixa alta e descrição curta. A integração do menu usará a mesma folha central já existente.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/app/fornecedor/index.jsx` | Tela autenticada, cabeçalho, cards de fornecedores e copy de apoio |
| `mobile/app/fornecedor/food-park.jsx` | Tela do formulário de fornecedores do Food Park (018) |
| `mobile/components/MenuAtalhos.jsx` | Adicionar rota ao atalho Fornecedor |

## Firestore

Nenhuma coleção nova ou alteração de contrato.

## Ordem de entrega

1. Registrar a spec e o plano da funcionalidade.
2. Criar a rota autenticada e a lista local, com Food Park acionável e Outros reservado.
3. Atualizar o menu para navegar à rota.
4. Abrir o formulário de fornecedores do Food Park pela rota aninhada (018).
5. Validar aceite visual, acessibilidade e bundle Expo.

## Riscos

| Risco | Mitigação |
|---|---|
| Outros ainda sem formulário | Manter `rota: null`, card estático e sem seta |
| Imagem com proporção incompatível | Usar `resizeMode="cover"` e altura responsiva |
| Navegação autenticada inconsistente | Reutilizar o padrão de `Redirect` e `useAuth` das telas internas |

## Fora deste plan

CMS, links externos, detalhes individuais de fornecedor, formulário para Outros e alteração de dados.
