# Spec: 015-liturgia-diaria Liturgia Diária

- Status: `in-progress`
- Complexidade: `media`
- Personas: `fiel`
- Depende de: [008-app-react-native](../008-app-react-native/spec.md), [002-navegacao-e-home](../002-navegacao-e-home/spec.md)

## Problema

O app não tem um caminho para a liturgia do dia. Durante o encontro, e também no preparo de casa, o fiel precisa ler as leituras, o salmo, o evangelho e as orações do dia sem sair do aplicativo e sem carregar um livro. Hoje ele precisa abrir um site por conta própria.

## Escopo

### Entra

- Atalho **Liturgia Diária** na folha central, logo depois do Terço da Restauração das Famílias, abrindo a rota autenticada `/liturgia`
- Tela no mesmo padrão do Terço (spec 011): cabeçalho laranja de retorno para a Home, coluna de leitura alinhada à esquerda e barra inferior fixa de navegação por etapas
- Conteúdo buscado na API pública `https://liturgia.up.railway.app/v2/`, pela data do dia, sem nenhum texto escrito à mão no app
- Seções montadas a partir da resposta: celebração do dia, primeira leitura, salmo, segunda leitura quando existir, evangelho e as orações da dia
- Seções que a API não devolver simplesmente não existem na navegação. Não há seção vazia nem aviso de "conteúdo indisponível"
- Data do dia resolvida no calendário de `America/Recife`, o mesmo fuso usado pelas outras telas
- Uma única busca por abertura da tela, guardada em memória enquanto a tela estiver viva
- Estados de carregamento, de falha da API e de retorno sem liturgia, com ação de tentar de novo
- Navegação por setas e também por gesto horizontal sobre o texto

### Não entra

- Escolha de outra data, calendário, histórico e texto de ontem
- Antifonas de entrada e de comunhão
- Orações extras do dia (a API devolve em `oracoes.extras` e `leituras.extras`, e esta entrega não as mostra)
- Áudio, compartilhamento, favoritos, marcadores de leitura e lembretes
- Cache em disco, modo offline e sincronização entre abas
- Espelho da API no projeto, publicação pela mesa e qualquer edição do texto pelo time
- Conteúdo da liturgia escrito no repositório

## Fluxos

1. O fiel abre a folha central e toca em Liturgia Diária. A folha fecha e `/liturgia` abre.
2. A tela pede a liturgia de hoje. Enquanto a resposta não chega, ela mostra o carregamento no mesmo lugar do texto, sem tela de erro.
3. Com a resposta, a primeira etapa mostra a celebração do dia e a primeira leitura; a celebração inclui o nome do santo ou da festa, a cor litúrgica e a data por extenso.
4. O fiel lê a etapa e avança pelas setas inferiores, que ficam travadas na primeira e na última etapa.
5. O fiel também pode arrastar o texto na horizontal para ir à etapa seguinte ou voltar. O gesto só vale quando ele é claramente horizontal, para não competir com a rolagem do texto.
6. Se a API falhar ou vier vazia, a tela diz o que aconteceu e oferece tentar de novo.
7. Sem sessão, a rota volta para a tela inicial.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota Expo | `/liturgia` |
| API externa | `GET https://liturgia.up.railway.app/v2/{DD-MM-AAAA}` |
| Componente | `mobile/components/BarraEtapas.jsx` |
| Papel necessário | `fiel` autenticado |

## Contrato lido

A API é de terceiros e responde em português. Nada é gravado no Firestore e nada é enviado de volta.

| Caminho da resposta | Uso na tela |
|---|---|
| `liturgia` | título da celebração do dia, quando preenchido |
| `cor` | cor litúrgica, mostrada como texto ao lado da data |
| `data` | não usada. A tela mostra o dia de hoje resolvido no fuso do app, e não a data que o serviço devolveu |
| `leituras.primeiraLeitura[]` | primeira leitura, com `referencia`, `titulo` e `texto` |
| `leituras.salmo[]` | salmo, com `referencia`, `refrao` e `texto` |
| `leituras.segundaLeitura[]` | segunda leitura; lista vazia no dia comum, e a etapa não é criada |
| `leituras.evangelho[]` | evangelho, com `referencia`, `titulo` e `texto` |
| `oracoes.coleta` | oração de coleta |
| `oracoes.oferendas` | oração das oferendas |
| `oracoes.comunhao` | oração de comunhão |

A API é inconsistente em três pontos, e a normalização trata os três: `oracoes.extras` pode vir como objeto único em vez de lista, uma seção ausente pode vir como lista vazia, como `null` ou como a string "Não há segunda leitura hoje!", e uma seção pode trazer mais de um item. Nenhum desses casos chega à tela como texto solto.

Sobre o último ponto: em dias de festa a mesma seção vem com duas formas da mesma leitura, ou com duas escolhas válidas, como no Natal, na Páscoa e na Apresentação do Senhor. Isso é a liturgia do dia, não defeito do serviço. A tela mostra todos os itens e diz que existe mais de uma opção, em vez de escolher um por conta própria.

## Regras de negócio

- A data usada é sempre o dia de hoje no calendário de `America/Recife`, resolvido por `hojeISO()` de `mobile/lib/edicao.js`. Não há parâmetro de data na rota.
- A API aceita a data no caminho, no formato `DD-MM-AAAA`. Query string é ignorada pelo serviço, então não é usada.
- Uma requisição por abertura. O resultado fica em memória na própria tela e some quando ela é desmontada. Sem disco, sem revalidação em segundo plano.
- A liturgia do dia não fica gravada no repositório. Se a API cair, a tela avisa, sem texto de reserva.
- A primeira leitura aparece junto à celebração na primeira etapa. As etapas seguintes aparecem na ordem: salmo, segunda leitura, evangelho e orações.
- Etapas sem conteúdo não entram na lista. O contador da barra inferior conta só as etapas que existem.
- Seção com mais de um item mostra todos os itens e um aviso curto de que o dia tem mais de uma opção. Nenhum item é escolhido nem escondido pelo app.
- As leituras trazem o versículo colado ao texto, com o número grudado na palavra ("21Piedade"). A tela separa o número do texto para a linha ficar legível.
- Ao trocar de etapa, a rolagem volta ao topo.
- A barra inferior fica sempre visível, e o texto termina acima dela, com folga para a área segura.
- Sem sessão, a rota volta à tela inicial, como nas outras telas internas.
- A tela é de leitura, não de formulário: nada é enviado, nada é gravado e nenhum dado do fiel sai do aparelho além da requisição da data.

## Critérios de aceite

- [ ] O atalho Liturgia Diária abre `/liturgia`, fica logo depois do Terço e fecha a folha
- [ ] O atalho usa ícone de linha, no mesmo desenho dos outros itens da folha
- [ ] A tela só abre com sessão e volta para a Home pelo cabeçalho laranja
- [ ] A data da requisição é o dia de hoje em `America/Recife`, sem parâmetro na rota
- [ ] Nenhum texto de liturgia está escrito no repositório
- [ ] A primeira etapa mostra a celebração do dia, a cor litúrgica e a data, quando a API devolver
- [ ] A primeira etapa mostra a celebração e a primeira leitura; as etapas seguintes aparecem na ordem salmo, segunda leitura, evangelho e orações
- [ ] Dia sem segunda leitura não cria a etapa, e o contador não conta uma etapa que não existe
- [ ] Seção com duas formas da mesma leitura mostra as duas e avisa que existe mais de uma opção
- [ ] A tela não mostra "Não há segunda leitura hoje!" nem qualquer texto de aviso da API
- [ ] As setas inferiores avançam e voltam, travadas na primeira e na última etapa
- [ ] Arrastar o texto na horizontal muda de etapa, e a rolagem vertical continua normal
- [ ] A troca de etapa devolve a rolagem ao topo
- [ ] Falha da API mostra aviso honesto com ação de tentar de novo
- [ ] Resposta sem liturgia do dia mostra aviso próprio, sem etapa vazia
- [ ] O carregamento ocupa o lugar do texto e não empurra o cabeçalho
- [ ] A barra inferior respeita a área segura e não cobre o fim do texto
- [ ] A tela mantém header, tipografia, cores e leitura editorial do app, igual ao Terço
- [ ] Só uma requisição por abertura da tela

## Anti-slop

- Sem pílulas, chips ou `rounded-full` na navegação, no indicador de etapa ou na cor litúrgica
- Sem gradiente, sem card de vidro e sem número hero
- A cor litúrgica é texto, não um disco colorido
- Nada centralizado como padrão, exceto o contador da barra inferior que já existe no Terço
- Sem travessão na copy

## Referências

- [DESIGN.md](../DESIGN.md)
- [011-terco-restauracao-familias](../011-terco-restauracao-familias/spec.md): padrão visual e de navegação desta tela
- [002-navegacao-e-home](../002-navegacao-e-home/spec.md): folha central
- API: https://liturgia.up.railway.app/v2/
