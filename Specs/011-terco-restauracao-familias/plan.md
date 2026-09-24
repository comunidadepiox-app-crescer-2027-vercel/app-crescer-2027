# Plan: 011-terco-restauracao-familias Terço da Restauração das Famílias

- Spec: [spec.md](spec.md)
- Status: `in-progress`

## Abordagem

Criar uma tela Expo fora do grupo de abas, protegida pelo `AuthProvider`, com o mesmo header de retorno e a mesma base editorial do detalhe de notícia. As onze etapas ficam em uma constante local para não criar dependência de rede para conteúdo devocional fixo. Uma barra inferior própria controla o índice atual e respeita a área segura do aparelho.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/app/terco-restauracao.jsx` | rota, conteúdo das etapas e barra inferior de navegação |
| `mobile/components/MenuAtalhos.jsx` | transformar o atalho Terço em navegação real |
| `Specs/008-app-react-native/*` | registrar que o atalho agora possui rota |

## Firestore

Nenhuma coleção é lida ou alterada. Não há dados pessoais, índices ou regras novas.

## Ordem de entrega

1. Registrar spec, plano e tasks.
2. Criar rota protegida com conteúdo estruturado.
3. Ligar o atalho da folha à rota.
4. Validar navegação e bundle Expo.

## Riscos

| Risco | Mitigação |
|---|---|
| Orações extensas ficarem sob a barra | reservar espaço no fim do `ScrollView` considerando a área segura |
| Troca de etapa manter rolagem anterior | reposicionar a rolagem no topo a cada mudança |
| Acesso por deep link sem sessão | aplicar o mesmo redirecionamento das outras telas internas |

## Fora deste plan

Salvar a etapa atual, modo offline avançado, áudio e qualquer edição administrativa das orações.
