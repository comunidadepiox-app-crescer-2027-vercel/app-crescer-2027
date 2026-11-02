# Tasks: 013-testimunhos Testemunhos

Uma task = uma mudança verificável. Proibido agrupar "implementar a tela inteira".

Marcar `[x]` só depois de conferir o critério. Se o comportamento mudar no código, atualizar este arquivo.

## Checklist

- [x] **T1 — Spec e contratos**
  - Faz: registrar requirements, spec, plan e tasks, e incluir a pasta no mapa de `Specs/README.md`.
  - Verifica: os quatro arquivos existem e o mapa lista `013-testimunhos`.
  - Fora: qualquer código de produção.

- [x] **T2 — Rules e índices da coleção**
  - Faz: incluir `match /testimonials/{id}` com leitura só de admin, criação validada no id do uid e decisão restrita ao admin.
  - Verifica: fiel não lê testemunhos e só cria um documento próprio; admin lê e decide.
  - Fora: publish das rules no console, que é operação do responsável.

- [x] **T3 — Sessão anônima no servidor**
  - Faz: incluir `verificaUsuario(idToken)` em `lib/server/verificaAdmin.js`, resolvendo o uid de qualquer sessão sem exigir `role`.
  - Verifica: uid anônimo resolve; token ausente, inválido ou sem projeto configurado devolvem `null`.
  - Fora: promover admin, que continua manual pelo console.

- [x] **T4 — Camada de IA** (removida em 28/09/2026)
  - Faz: era `lib/server/iaTestemunho.js` com o prompt em português, a chamada ao Groq e a normalização da resposta em `{ aprovado, motivo, resumo }`.
  - Estado: arquivo e teste apagados. Nenhum resquício de IA fica no servidor nem no ambiente.
  - Fora: qualquer SDK de IA instalado no projeto.

- [x] **T5 — Rota do servidor**
  - Faz: `app/api/testemunhos/route.js` validando sessão e conteúdo; grava com o token do fiel em `testimonials/{uid}`.
  - Verifica: 401 sem sessão, 400 fora do contrato, 200 com `status: novo`, e `exists:false` impede segundo envio.
  - Fora: aceitar `status` ou `resumo` enviados pelo cliente.

- [x] **T6 — Dependência e ambiente**
  - Estado: o envio de testemunhos não usa `firebase-admin` nem `FIREBASE_SERVICE_ACCOUNT`.
  - Verifica: o app não contém service account; as rules aplicam autorização por token Firebase.

- [x] **T7 — Lib do app**
  - Faz: `mobile/lib/testemunhos.js` com `nomeNormalizado`, `validaTestemunho` e o teto de 2000.
  - Verifica: nome acima de 60, texto vazio e texto acima de 2000 devolvem mensagem em português.
  - Fora: qualquer chamada de rede.

- [x] **T8 — Tela do app**
  - Faz: `mobile/app/testemunhos.jsx` com cabeçalho laranja, hero no roxo poligonal, campo de nome, opção de anônimo, campo de texto com contador, aviso, botão e tela de confirmação.
  - Verifica: `npx expo export --platform android` conclui sem erro e a tela tem os quatro estados, sendo eles envio em andamento, erro, confirmação e formulário.
  - Fora: mexer nas demais telas do app.

- [x] **T9 — Atalho da folha central**
  - Faz: incluir Testemunhos em `ITENS` em `mobile/components/MenuAtalhos.jsx`.
  - Verifica: o atalho fecha a folha e abre `/testemunhos`, e a grade continua com três colunas.
  - Fora: alterar os atalhos existentes.

- [x] **T10 — Leitura da mesa**
  - Faz: `lib/admin/testimonials.js` com `listaTestemunhos`, `contaTestemunhos`, `marcaLido` e `naoAceita`.
  - Verifica: a primeira página traz os mais antigos e a segunda continua de onde a primeira parou, sem repetir nem pular.
  - Fora: editar o texto do testemunho.

- [x] **T11 — Setas de paginação**
  - Faz: `components/admin/PaginacaoMesa.jsx` com setas, contador e estado desabilitado.
  - Verifica: a seta da esquerda trava na primeira página e a da direita trava na última, com `aria` e estado desabilitado expostos.
  - Fora: numerar as páginas.

- [x] **T12 — Aba Testemunhos da mesa**
  - Faz: `app/admin/testemunhos/page.jsx` com as abas Aguardando e Encerrados, a lista paginada, o texto original e os dois botões.
  - Verifica: em 375 px não há rolagem horizontal, o alvo de cada botão tem 44 px, o texto original aparece com nome, data e status, e marcar lido tira o item da aba sem recarregar.
  - Fora: gráfico, número hero e filtro por data.

- [x] **T13 — Item do menu da mesa**
  - Faz: incluir Testemunhos no `MENU` de `app/admin/layout.jsx` e as chaves `testemunhos`, `volta` e `avanca` em `iconesMesa.jsx`.
  - Verifica: o item marca ativo em dourado e a barra colapsa em rolagem horizontal no celular.
  - Fora: reorganizar os itens existentes.

- [x] **T14 — Sincronia das specs**
  - Faz: atualizar o `README.md`, a `002`, a `007`, a `008` e a `OPEN-QUESTIONS` com o que esta entrega mudou.
  - Verifica: nenhum documento ficou atrás do código.
  - Fora: reescrever spec que não mudou de comportamento.

- [x] **T15 — Validação**
  - Faz: rodar `npm run build` no projeto e `npx expo export --platform android` no `mobile/`, e conferir o aceite de `spec.md` item por item.
  - Verifica: os dois comandos concluem sem erro.
  - Fora: teste em aparelho real, que depende do Expo Go na mão do responsável.

## Validação final

- [x] Todos os critérios de aceite de `spec.md` passaram
- [x] Nenhuma rota ou botão sem destino
- [x] Copy sem travessão
- [x] Se houve dado pessoal, fluxo LGPD conferido
- [x] `spec.md`, `plan.md` e este arquivo refletem o que foi entregue

## Retirada da IA (28/09/2026)

- [x] **T16 — Rota do servidor sem IA**
  - Faz: a rota grava `status: novo` direto, sem `resumo`, `moderacao` e `motivoRecusa`, e a resposta só carrega o que a confirmação precisa.
  - Verifica: busca por `filtraTestemunho`, `GROQ` e `resumo` na rota não acha nada; documento gravado não tem campo de resumo.
  - Fora: aceitar `status` ou `pasta` vindos do cliente.

- [x] **T17 — Arquivos da IA apagados**
  - Faz: `lib/server/iaTestemunho.js` e `lib/server/iaTestemunho.test.js` removidos, `GROQ_API_KEY` fora do `.env.example` e o `npm test` repontado para a suíte que sobrou.
  - Verifica: `npm test` e `npm run test:aviso-saida` passam; busca por `GROQ` no repositório não acha código.
  - Fora: revogar a chave no console do Groq, que é operação do responsável.

- [x] **T18 — Mesa lendo o texto original**
  - Faz: `ROTULO_STATUS` sem `recusado_ia` e `revisao`, cartão renderizando `texto` em vez de `resumo`, faixa de motivo removida e os dois botões sempre visíveis na Aguardando.
  - Verifica: texto com palavrão e relato pesado aparecem íntegros na fila; item em revisão não existe mais; marcar lido continua tirando o item da aba.
  - Fora: suavizar o texto na leitura.

- [x] **T19 — Tela do app sem ramo de status**
  - Faz: a confirmação do envio tem uma mensagem só, e o texto de "Como funciona" não promete resumo automático.
  - Verifica: nenhum `resultado.status` na tela; `npm run build` e o bundle do app concluem.
  - Fora: avisar o fiel de que o texto foi aceito, que continua fora do produto.

- [x] **T20 — Sincronia**
  - Faz: `requirements.md`, `spec.md`, `plan.md`, este arquivo, o `Specs/README.md`, a `OPEN-QUESTIONS` e o comentário das `firestore.rules` sem menção ao filtro da IA.
  - Verifica: busca por "resumo pela IA", "Groq" e "recusado_ia" nos documentos não acha afirmação que não seja histórica.
  - Fora: reescrever spec que não mudou de comportamento.

## Conferido nesta entrega

- `npm run build` conclui e cria `/admin/testemunhos` e `/api/testemunhos`
- `npm test` passa na suíte do job de avisos
- `npx expo export --platform android` inclui a rota `/testemunhos` no bundle
- o bundle do app não contém `gsk_`, `private_key` nem `firebase-adminsdk`
- nenhum arquivo novo tem travessão na copy
