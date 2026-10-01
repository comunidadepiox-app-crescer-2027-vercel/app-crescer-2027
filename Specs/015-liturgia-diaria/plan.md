# Plan: 015-liturgia-diaria Liturgia Diária

- Spec: [spec.md](spec.md)
- Status: `in-progress`

## Abordagem

Rota Expo fora do grupo de abas, protegida pelo `AuthProvider`, no mesmo casco do Terço: `Voltar` laranja para a Home, `ScrollView` de coluna única e barra inferior fixa com setas e contador. A diferença é a origem do texto: onde o Terço tem as orações em uma constante local, a Liturgia busca na API pública e normaliza a resposta em etapas antes de desenhar.

A barra inferior do Terço é extraída para `mobile/components/BarraEtapas.jsx` e as duas telas passam a usar o mesmo componente. É a única duplicação evitada nesta entrega: as setas, o contador, a área segura e o estado desabilitado já estavam prontos e testados na spec 011.

A data vem de `hojeISO()` em `mobile/lib/edicao.js`, que já resolve o dia no calendário de `America/Recife`. Reaproveitar essa função mantém o fuso do app em um lugar só. A data entra no caminho da URL, porque a API aceita o dia em `DD-MM-AAAA` e ignora query string.

A normalização vive em `mobile/lib/liturgia.js` e é pura: recebe a resposta crua da API e devolve a lista de etapas já filtrada. Isso deixa a tela sem nenhum `if` sobre o formato da resposta e deixa os casos de campo ausente testáveis fora do aparelho.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/lib/liturgia.js` | URL da API, data do dia, busca, normalização em etapas e limpeza do texto das leituras |
| `mobile/app/liturgia.jsx` | rota autenticada, carregamento, erro, etapas e gesto horizontal |
| `mobile/components/BarraEtapas.jsx` | barra inferior de navegação extraída do Terço, reutilizada pelas duas telas |
| `mobile/app/terco-restauracao.jsx` | passar a usar `BarraEtapas` no lugar da barra local, sem mudar comportamento |
| `mobile/components/MenuAtalhos.jsx` | atalho Liturgia Diária logo depois do Terço |
| `Specs/002-navegacao-e-home/*` | registrar o novo atalho na folha |
| `Specs/008-app-react-native/*` | registrar a rota nova no app |

## Firestore

Nenhuma coleção é lida ou alterada. Não há dado pessoal, índice ou regra nova.

## Cloudinary

Nenhum asset novo. O atalho usa ícone de linha do lucide, como Participar, Colabore, Loja, Fornecedor, Spotify, Mapa do Evento e Congresso.

## Ordem de entrega

1. Registrar spec, plan e tasks.
2. `lib/liturgia.js`: URL, data, busca e normalização pura.
3. `components/BarraEtapas.jsx` e o Terço passando a usá-lo.
4. `app/liturgia.jsx` com carregamento, erro e etapas.
5. Atalho da folha central.
6. Sincronizar as specs 002 e 008 e o mapa do `Specs/README.md`.
7. Validar bundle.

## Riscos

| Risco | Mitigação |
|---|---|
| A API mudar o formato da resposta | A normalização aceita lista, objeto, `null` e string, e ignora o que não entender |
| A API cair sem rede | Aviso curto com ação de tentar de novo; nenhum texto de reserva no repositório |
| O serviço ficar lento | Um pedido por abertura, com carência antes de mostrar falha, para não piscar erro em rede lenta |
| Texto comprido ficar sob a barra | Mesma folga do Terço, considerando a área segura |
| Gesto horizontal competir com a rolagem | O gesto só é aceito quando o deslocamento horizontal domina claramente o vertical |
| Extração da barra mudar o Terço | O componente novo recebe os mesmos estilos e as mesmas props; o Terço continua com as mesmas onze etapas e os mesmos limites |

## Fora deste plan

Escolha de data, antifonas, orações extras, áudio, favoritos, cache em disco, modo offline, espelho da API no projeto e qualquer edição pela mesa.