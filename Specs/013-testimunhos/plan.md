# Plan: 013-testimunhos Testemunhos

- Spec: [spec.md](spec.md)
- Status: `in-progress`

## Abordagem

Uma spec só para o fluxo inteiro: o app envia, a mesa decide. A barreira real é o servidor. O app do fiel chama `POST /api/testemunhos` com o token da sessão anônima; a rota valida a sessão com `verificaUsuario`, monta o documento com os campos do contrato e grava com o Admin SDK. A coleção `testimonials` fica com escrita `false` nas rules, então nenhum app adulterado injeta `status`, `pasta` ou `uid`.

Desde 28/09/2026 não existe IA no meio do caminho. A rota grava `status: novo` e pronto, e a mesa mostra o `texto` que a pessoa escreveu. Isso tirou a dependência da chave do Groq, o consumo de cota e o `status: revisao`, que existia só para quando a IA falhava. A desvantagem é real e está escrita na spec: a equipe lê o texto integral, sem suavizar, então o filtro automático de palavrão e de relato de suicídio não existe mais e a decisão é toda da leitura humana.

A barreira de escrita continua a mesma e continua valendo: escrita só pelo Admin SDK, com a service account, e o corpo do pedido do cliente nunca define `status` nem `pasta`. Isso impede o app de mandar para a fila Encerrados e sumir da decisão.

A mesa lê com o SDK client, como as demais abas, e decide com `updateDoc`. Como não há resumo, a faixa de motivo sai e o cartão passa a renderizar o texto original, com o nome em cima e a data ao lado.

`firebase-admin` continua como dependência do projeto para o Route Handler, reaproveitando a `FIREBASE_SERVICE_ACCOUNT` que o job de avisos também usa.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/app/testemunhos.jsx` | tela autenticada, formulário, contador, estados de envio e confirmação |
| `mobile/assets/icons/icone-testemunhos.png` | logo do hero e ícone do atalho, usada no menu no lugar do ícone de linha |
| `mobile/lib/testemunhos.js` | validação pura, limite de 2000, `nomeNormalizado` |
| `mobile/lib/enviaTestemunho.js` | `enviaTestemunho({ nome, anonimo, texto })` contra a rota do servidor |
| `mobile/components/MenuAtalhos.jsx` | uma linha em `ITENS` para o atalho Testemunhos |
| `app/api/testemunhos/route.js` | valida sessão, trava o teto, trava envio duplicado e grava com Admin SDK |
| `lib/server/verificaAdmin.js` | `verificaUsuario(idToken)`, que resolve o uid de qualquer sessão, anônima inclusive |
| `lib/admin/testimonials.js` | `listaTestemunhos(aba, cursor, tamanho)`, `contaTestemunhos(aba)`, `marcaLido`, `naoAceita` |
| `components/admin/PaginacaoMesa.jsx` | setas e contador, no desenho do Terço, com `IconeMesa` |
| `app/admin/testemunhos/page.jsx` | abas, lista paginada, texto original e dois botões |
| `app/admin/page.jsx` | faixa Testemunhos no índice, com a contagem real da fila |
| `components/admin/iconesMesa.jsx` | chaves `testimonials`, `volta` e `avanca` no `TRACOS` |
| `app/admin/layout.jsx` | item Testemunhos no `MENU` |
| `firestore.rules` | `match /testimonials/{id}` com leitura só de admin e escrita `false` |
| `firestore.indexes.json` | composto de `pasta` com `createdAt` |
| `package.json` | `firebase-admin` e `test` sem a suíte da IA |
| ~~`lib/server/iaTestemunho.js`~~ | removido em 28/09/2026 |
| ~~`lib/server/iaTestemunho.test.js`~~ | removido em 28/09/2026 |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `testimonials` | `admin`: todas | só o Admin SDK, pela rota do servidor | `pasta ASC, createdAt ASC`, um único composto |

Regras de segurança:

- `allow read: if isAdmin()`, para o fiel nunca ler a coleção
- `allow create, update, delete: if false`, porque quem escreve é o Admin SDK com a service account
- a duplicidade é travada no servidor por `uid`, com um `where("uid","==",uid) limit(1)` antes do `add`. O índice de `uid` é automático, sem composto

Sobre o campo `pasta`: a consulta da mesa precisa de um `where` e um `orderBy`. Usar `where("status","in",[...])` com três status pediria um índice composto para cada um, cinco no total, e o Firestore expande o `in` em `OR` justamente quando o 4G do evento está ruim. `pasta` reduz a dois estados e a um índice só, ao custo de um campo que pode divergir do `status`. A divergência fica contida no código: só `marcaLido` e `naoAceita` escrevem `pasta`, e ambas escrevem `status` na mesma chamada.

O Admin SDK ignora as rules, então ele é a única exceção. Nenhum segredo dele vai para o bundle: a route handler roda só no servidor.

## Cloudinary

- Nenhuma pasta nova. Testemunho é texto.

## Ordem de entrega

1. Specs e índice de `Specs/README.md`
2. Rules e índices da coleção
3. `verificaUsuario`
4. Route Handler sem IA, `firebase-admin` e a service account
5. Lib e tela do app, depois o atalho da folha central
6. Leitura paginada e botões na mesa, depois o item do menu
7. Sync das specs irmãs e validação de build

## Fora deste plan

- Publicação no app, áudio e foto
- Mural público e compartilhamento
- Exportação e estatística
- Push ao receber um testemunho
- Desfazer decisão
- Qualquer resumo automático, filtro automático ou chamada a serviço externo
- Analytics, galeria, mural e qualquer métrica na mesa

## Riscos

| Risco | Mitigação |
|---|---|
| Texto pesado ou com palavrão chegar ao palco | a equipe lê antes de marcar lido, e o botão de descarte é explícito e imediato |
| Relato de suicídio ou abuso ser lido cru no palco | a equipe decide, e a spec registra que o filtro automático saiu |
| Inundação de fraude | um envio por uid, trava no servidor, `origem: app` e nenhum `status` vindo do cliente. Reinstalar o app gera uid novo, e essa via não é fechada |
| Service account commitada | só no servidor, e `.env` e `.env.local` já estão no `.gitignore` deste repositório |
| Texto original exposto a quem não é admin | a collection tem `allow read: if isAdmin()` e nenhuma outra rota de leitura |
| Índice de `testimonials` esquecido no deploy | o `firestore.indexes.json` entra na entrega, a página traduz `failed-precondition` em aviso legível e o item está em `OPEN-QUESTIONS` |

