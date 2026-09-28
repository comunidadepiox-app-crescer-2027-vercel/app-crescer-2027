# Spec: 013-testimunhos Testemunhos

- Status: `in-progress` (IA retirada em 28/09/2026; a mesa lê o texto original)
- Complexidade: `alta`
- Personas: `fiel` (envia), `admin` (decide)
- Depende de: [007-admin-cms](../007-admin-cms/), [008-app-react-native](../008-app-react-native/), [002-navegacao-e-home](../002-navegacao-e-home/)

> **O que mudou em 28/09/2026.** Não existe mais IA no testemunho. O fiel escreve o texto e ele é gravado direto para a fila da mesa. Saíram a chamada ao Groq, o resumo automático, o filtro de conteúdo, os status `recusado_ia` e `revisao` e os campos `resumo`, `moderacao` e `motivoRecusa`. Quem decide agora lê o texto que a pessoa escreveu, e a decisão é inteiramente da equipe.

## Problema

Durante o encontro, o público quer compartilhar o que mudou em sua vida, e o apresentador precisa ler esse relato em segundos, no palco, sem se perder em um texto de centenas de linhas nem em um texto pesado demais para ser dito diante da comunidade.

## Escopo

### Entra

- Atalho Testemunhos na folha central do app, abrindo a rota autenticada `/testemunhos`
- Tela no padrão do detalhe de notícia: cabeçalho laranja com voltar para a Home, hero no roxo poligonal, coluna de leitura alinhada à esquerda
- Hero no mesmo desenho do Benfeitor da Fé: logo `icone-testemunhos.png` centralizada na caixa de 260 por 112 e o parágrafo de apoio, sem título nem símbolo do coração
- Campo de nome, opcional, com limite de 60 caracteres
- Opção de enviar como anônimo, que esvazia o nome antes de gravar
- Campo de texto com limite de 2000 caracteres e contador visível
- Aviso curto de uso dos dados, no mesmo formato do aviso já usado no formulário do Benfeitor
- Uma tela de confirmação depois do envio, com a possibilidade de escrever outro testemunho
- Grava o documento por um Route Handler, usando a service account
- Aba Testemunhos na mesa, com leitura paginada por setas e dois botões de decisão
- Abas Aguardando e Encerrados, para separar o que ainda exige decisão do que já foi decidido
- Botões Testemunho lido e Não aceitar, que tiram o item da lista sem recarregar a página
- A mesa mostra o texto original, com o nome e a data, e a equipe decide

### Não entra

- IA, resumo automático, filtro automático de conteúdo e qualquer chamada a serviço externo
- Publicação do testemunho para a comunidade ler no app
- Áudio, foto ou vídeo junto do testemunho
- Mural público e compartilhamento
- Exportação, relatório e estatística na mesa
- Notificação push quando chega um testemunho
- Edição do texto pelo admin depois do envio
- Aviso para a pessoa de que o texto foi aceito ou recusado

## Fluxos

1. Fiel abre a folha central e toca em Testemunhos. A folha fecha e `/testemunhos` abre.
2. Fiel preenche o nome ou marca a opção de anônimo, escreve o testemunho e toca em Enviar.
3. O app chama a rota do servidor com o token da sessão anônima.
4. O servidor grava em `testimonials` com `status: novo`. A tela de confirmação abre na hora, sem esperar resposta da equipe.
5. Admin abre Testemunhos na mesa. Vê os aguardando do mais antigo para o mais recente e navega entre as páginas com as setas.
6. Admin lê o texto. Se puder ler no palco, toca em Testemunho lido. Se for pesado demais, toca em Não aceitar. O item sai da aba e o contador cai.
7. Admin volta a Testemunhos em qualquer momento e encontra o que já foi decidido na aba Encerrados.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota Expo | `/testemunhos` |
| Rota da mesa | `/admin/testemunhos` |
| Rota do servidor | `POST /api/testemunhos` |
| Coleção Firestore | `testimonials` |
| Papel necessário | `fiel` autenticado para enviar; `admin` para ler e decidir |

## Dados

Coleção `testimonials/{id}`

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `nome` | string | sim | vazio quando `anonimo` é verdadeiro. (LGPD) |
| `anonimo` | bool | sim | |
| `texto` | string | sim | original, até 2000 caracteres. (LGPD) É este campo que a mesa mostra |
| `status` | string | sim | `novo`, `lido` ou `nao_aceito` |
| `pasta` | string | sim | `aguardando` ou `encerrados`. Campo denormalizado, escrito pelo servidor e reescrito a cada decisão, para a consulta da mesa ser um `where` simples em `orderBy` |
| `uid` | string | sim | uid da sessão anônima do Firebase Auth. (LGPD) |
| `origem` | string | sim | `app` |
| `lidoAt` | timestamp | não | preenchido ao marcar lido |
| `decididoAt` | timestamp | não | preenchido ao decidir |
| `decididoPor` | string | não | uid do admin que decidiu |
| `createdAt` | timestamp | sim | ordena a lista |
| `updatedAt` | timestamp | sim | |

`resumo`, `moderacao` e `motivoRecusa` saíram do contrato. Documento gravado antes de 28/09/2026 pode ter esses campos: a mesa ignora os que existirem, e nada precisa ser apagado.

A escrita vem sempre do servidor. O cliente do fiel não escreve nesta coleção, e o servidor ignora qualquer `status`, `resumo` ou `uid` que venha no corpo do pedido.

## Regras de negócio

- O texto tem 2000 caracteres. Um documento do Firestore suporta muito mais, então esse limite não tem custo de armazenamento.
- Uma sessão anônima envia um testemunho por edição do evento. Reenvio mostra a confirmação, igual ao Benfeitor.
- Nenhum texto é recusado na entrada. Depreciação, ansiedade, perda, abuso e adoecimento mental chegam inteiros à mesa, e a decisão é da equipe.
- A lista da mesa é ordenada por `createdAt` crescente. O primeiro enviado fica no topo.
- Marcar lido ou não aceitar grava `decididoAt`, `decididoPor` e move o item para a pasta `encerrados`, e o item sai da aba Aguardando.
- Item da pasta Encerrados não mostra botões, só a linha de status e a de decisão registrada.
- Decisão é definitiva nesta versão. Não há botão de desfazer.
- A paginação usa setas no mesmo desenho do Terço, com desvio de ambiente seguro respeitado.
- Fiel autenticado em `/admin/testemunhos` vê recusa, sem vazar dado.
- A equipe recebe o texto inteiro, sem suavizar. Relato pesado demais para o palco é decisão da equipe na leitura.

## Critérios de aceite

- [ ] O atalho Testemunhos abre `/testemunhos`, fecha a folha e mostra o ícone próprio, não o de linha
- [ ] A tela só abre com sessão e volta para a Home pelo cabeçalho laranja
- [ ] O hero mostra só a logo e o parágrafo de apoio, no mesmo desenho do Benfeitor
- [ ] O nome é opcional, marca 60 caracteres e some quando a opção de anônimo está marcada
- [ ] O campo de texto trava em 2000 caracteres e mostra o contador
- [ ] Texto limpo é gravado com `status: novo` e chega na aba Aguardando
- [ ] Nenhuma chamada a IA acontece no envio nem na gravação
- [ ] Nenhum campo `resumo`, `moderacao` ou `motivoRecusa` é gravado
- [ ] Texto com palavrão ou relato pesado chega na fila, sem filtro automático
- [ ] Envio repetido da mesma sessão não cria segundo documento
- [ ] A mesa mostra o texto original, com nome, data e linha de status
- [ ] A mesa lista os mais antigos primeiro
- [ ] As setas percorrem as páginas e travam na primeira e na última
- [ ] Testemunho lido e Não aceito tiram o item da aba Aguardando
- [ ] A aba Encerrados mostra os já decididos
- [ ] A mesa funciona em 375 px, sem rolagem horizontal e com alvos de toque de 44 px
- [ ] Fiel não lê nem escreve `testimonials`
- [ ] A service account e nenhuma chave de IA aparecem no bundle do app

## Anti-slop

- Sem pílulas, chips ou `rounded-full` em navegação, filtros e status
- Sem gradiente, sem card de vidro e sem número hero de quantos testemunhos chegaram
- Status é texto em cor, não cápsula
- Texto à esquerda; a logo do testemunho no hero, no mesmo lugar do Benfeitor

## Referências

- Specs irmãs: 002-navegacao-e-home (folha central), 007-admin-cms (mesa), 008-app-react-native (app), 011-terco-restauracao-familias (setas de navegação)
- [DESIGN.md](../DESIGN.md)
- [OPEN-QUESTIONS.md](../OPEN-QUESTIONS.md): texto final do aviso LGPD
