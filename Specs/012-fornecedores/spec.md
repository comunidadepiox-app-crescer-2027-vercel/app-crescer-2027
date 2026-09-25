# Spec: 012-fornecedores Página de fornecedores

- Status: `in-progress`
- Complexidade: `media`
- Personas: `fiel`
- Depende de: [008-app-react-native](../008-app-react-native/)

## Problema

O atalho Fornecedor da folha central precisa levar o fiel a uma página visual com as opções de fornecedores do encontro.

## Escopo

### Entra

- Rota autenticada `/fornecedor`
- Cabeçalho laranja com voltar para a Home
- Cards visuais para Food Park e Outros
- Dois cards grandes com ícone, título e descrição curta
- Estrutura responsiva com tipografia e cores do app
- Campos de URL reservados para os cards, sem ação nesta entrega

### Não entra

- Links ou navegação dos cards
- Conteúdo administrativo dos fornecedores
- Firestore ou novos contratos de dados

## Fluxos

1. Fiel abre o menu central.
2. Fiel toca em Fornecedor.
3. A folha fecha e a rota `/fornecedor` abre.
4. Fiel toca em voltar e retorna à Home.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota Expo Router | `/fornecedor` |
| Ícones | `Utensils` e `Store` do `lucide-react-native` |
| Papel necessário | `fiel` autenticado |

## Dados

A tela usa somente uma lista local estática. Cada item possui `id`, `titulo`, `descricao`, `Icone` e `url` reservado para uma futura integração.

## Regras de negócio

- A página exige sessão autenticada, como as demais telas internas.
- O item Fornecedor deve navegar para `/fornecedor`.
- Os cards são apenas visuais nesta entrega e não devem iniciar navegação.
- O retorno do cabeçalho leva sempre para `/home`.
- A identidade deve usar a fonte, a paleta e os raios definidos no app.

## Critérios de aceite

- [ ] Fornecedor aparece no menu e abre `/fornecedor`
- [ ] A tela abre somente com sessão autenticada
- [ ] O cabeçalho exibe `FORNECEDOR` e retorna para a Home
- [ ] Food Park e Outros aparecem como cards grandes com ícone, título e descrição
- [ ] Os cards possuem espaço reservado para URLs futuras
- [ ] A página não tem navegação inferior nem ação sem destino

## Anti-slop

Sem imagens de fundo, gradientes, badges ou pílulas. Cards brancos com borda, ícone em quadrado creme, títulos em caixa alta alinhados à esquerda, conforme `DESIGN.md`.

## Referências

- Specs irmãs: 002-navegacao-e-home, 008-app-react-native
- Design: `Specs/DESIGN.md`
- Assets: `mobile/assets/images/`
