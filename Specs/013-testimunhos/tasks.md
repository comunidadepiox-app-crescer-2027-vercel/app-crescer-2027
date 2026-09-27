# Tasks: 013-testimunhos Testemunhos

Uma task = uma mudança verificável. Proibido agrupar "implementar a tela inteira".

Marcar `[x]` só depois de conferir o critério. Se o comportamento mudar no código, atualizar este arquivo.

## Checklist

- [x] **T1 — Spec e contratos**
  - Faz: registrar requirements, spec, plan e tasks, e incluir a pasta no mapa de `Specs/README.md`.
  - Verifica: os quatro arquivos existem e o mapa lista `013-testimunhos`.
  - Fora: qualquer código de produção.

- [x] **T2 — Rules e índices da coleção**
  - Faz: incluir `match /testimonials/{id}` com leitura só de admin e escrita `false`, e os compostos de `status` com `createdAt` em `firestore.indexes.json`.
  - Verifica: fiel autenticado não lê a coleção; nada além do Admin SDK escreve.
  - Fora: publish das rules no console, que é operação do responsável.

- [x] **T3 — Sessão anônima no servidor**
  - Faz: incluir `verificaUsuario(idToken)` em `lib/server/verificaAdmin.js`, resolvendo o uid de qualquer sessão sem exigir `role`.
  - Verifica: uid anônimo resolve; token ausente, inválido ou sem projeto configurado devolvem `null`.
  - Fora: promover admin, que continua manual pelo console.

- [x] **T4 — Camada de IA**
  - Faz: `lib/server/iaTestemunho.js` com o prompt em português, a chamada ao Groq e a normalização da resposta em `{ aprovado, motivo, resumo }`.
  - Verifica: `node --test lib/server/iaTestemunho.test.js` passa nos casos de recusa, suavização de depressão, suicídio já vivido, repetição, texto limpo, chave ausente e resposta fora do formato.
  - Fora: qualquer SDK de IA instalado no projeto.

- [x] **T5 — Rota do servidor**
  - Faz: `app/api/testemunhos/route.js` validando sessão, teto de 2000, corpo vazio, envio duplicado e gravação com Admin SDK.
  - Verifica: 401 sem sessão, 400 fora do contrato, 200 com `status: novo`, `recusado_ia` ou `revisao`, e segundo envio da mesma sessão não cria documento.
  - Fora: aceitar `status` ou `resumo` enviados pelo cliente.

- [x] **T6 — Dependência e ambiente**
  - Faz: `firebase-admin` no `package.json`, `GROQ_API_KEY` no `.env.example` e no `.env.local`, e `.env` e `.env.local` no `.gitignore`.
  - Verifica: a chave não aparece em nenhum arquivo versionado nem no bundle do app.
  - Fora: criar a conta no Groq, que é operação do responsável.

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
  - Faz: `app/admin/testemunhos/page.jsx` com as abas Aguardando e Encerrados, a lista paginada, a faixa de motivo e os dois botões.
  - Verifica: em 375 px não há rolagem horizontal, o alvo de cada botão tem 44 px, o texto original não aparece e marcar lido tira o item da aba sem recarregar.
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

## Conferido nesta entrega

- `npm run build` conclui e cria `/admin/testemunhos` e `/api/testemunhos`
- `npm test` passa nos 16 casos de `lib/server/iaTestemunho.test.js`
- `npx expo export --platform android` inclui a rota `/testemunhos` no bundle
- o bundle do app não contém `gsk_`, `private_key`, `firebase-adminsdk` nem `GROQ_API_KEY`
- nenhum arquivo novo tem travessão na copy
