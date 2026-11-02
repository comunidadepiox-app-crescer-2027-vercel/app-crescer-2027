# Plan: 013-testimunhos Testemunhos

- Spec: [spec.md](spec.md)
- Status: `in-progress`

## Abordagem

Uma spec só para o fluxo inteiro: o app envia, a mesa decide. O app do fiel chama `POST /api/testemunhos` com o token da sessão anônima; a rota valida a sessão com `verificaUsuario` e usa o mesmo token no Firestore REST. As rules limitam a criação ao próprio uid, validam o contrato e impedem que o cliente injete campos fora dele.

Desde 28/09/2026 não existe IA no meio do caminho. A rota grava `status: novo` e pronto, e a mesa mostra o `texto` que a pessoa escreveu. Isso tirou a dependência da chave do Groq, o consumo de cota e o `status: revisao`, que existia só para quando a IA falhava. A desvantagem é real e está escrita na spec: a equipe lê o texto integral, sem suavizar, então o filtro automático de palavrão e de relato de suicídio não existe mais e a decisão é toda da leitura humana.

A barreira de escrita continua nas rules: o corpo do pedido nunca define `status` nem `pasta`, a rota monta esses campos e o documento usa o uid como id com precondição `exists:false`. Isso impede campos adulterados e reenvio sem consultar o texto já gravado.

A mesa lê com o SDK client, como as demais abas, e decide com `updateDoc`. Como não há resumo, a faixa de motivo sai e o cartão passa a renderizar o texto original, com o nome em cima e a data ao lado.

O envio de testemunhos não precisa da `FIREBASE_SERVICE_ACCOUNT`. Outros fluxos do projeto continuam usando essa credencial.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/app/testemunhos.jsx` | tela autenticada, formulário, contador, estados de envio e confirmação |
| `mobile/assets/icons/icone-testemunhos.png` | logo do hero e ícone do atalho, usada no menu no lugar do ícone de linha |
| `mobile/lib/testemunhos.js` | validação pura, limite de 2000, `nomeNormalizado` |
| `mobile/lib/enviaTestemunho.js` | `enviaTestemunho({ nome, anonimo, texto })` contra a rota do servidor |
| `mobile/components/MenuAtalhos.jsx` | uma linha em `ITENS` para o atalho Testemunhos |
| `app/api/testemunhos/route.js` | valida sessão e conteúdo; grava com o token Firebase do fiel |
| `lib/server/verificaAdmin.js` | `verificaUsuario(idToken)`, que resolve o uid de qualquer sessão, anônima inclusive |
| `lib/admin/testimonials.js` | `listaTestemunhos(aba, cursor, tamanho)`, `contaTestemunhos(aba)`, `marcaLido`, `naoAceita` |
| `components/admin/PaginacaoMesa.jsx` | setas e contador, no desenho do Terço, com `IconeMesa` |
| `app/admin/testemunhos/page.jsx` | abas, lista paginada, texto original e dois botões |
| `app/admin/page.jsx` | faixa Testemunhos no índice, com a contagem real da fila |
| `components/admin/iconesMesa.jsx` | chaves `testimonials`, `volta` e `avanca` no `TRACOS` |
| `app/admin/layout.jsx` | item Testemunhos no `MENU` |
| `firestore.rules` | fiel cria só o próprio testemunho validado; admin lê e decide |
| `firestore.indexes.json` | composto de `pasta` com `createdAt` |
| `package.json` | `firebase-admin` e `test` sem a suíte da IA |
| ~~`lib/server/iaTestemunho.js`~~ | removido em 28/09/2026 |
| ~~`lib/server/iaTestemunho.test.js`~~ | removido em 28/09/2026 |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `testimonials` | `admin`: todas | fiel cria só `/testimonials/{uid}`; admin atualiza apenas a decisão | `pasta ASC, createdAt ASC`, um único composto |

Regras de segurança:

- leitura continua restrita a admin
- criação exige autenticação, `documentId == request.auth.uid`, consentimento, limites e campos exatos; update permite só a decisão do admin e delete é proibido
- `exists:false` na escrita impede um segundo envio no mesmo uid sem leitura de testemunhos pelo fiel

Sobre o campo `pasta`: a consulta da mesa precisa de um `where` e um `orderBy`. Usar `where("status","in",[...])` com três status pediria um índice composto para cada um, cinco no total, e o Firestore expande o `in` em `OR` justamente quando o 4G do evento está ruim. `pasta` reduz a dois estados e a um índice só, ao custo de um campo que pode divergir do `status`. A divergência fica contida no código: só `marcaLido` e `naoAceita` escrevem `pasta`, e ambas escrevem `status` na mesma chamada.

O Route Handler grava com o token ID do Firebase; as rules do Firestore se aplicam à escrita. Nenhuma service account vai para o bundle.

## Cloudinary

- Nenhuma pasta nova. Testemunho é texto.

## Ordem de entrega

1. Specs e índice de `Specs/README.md`
2. Rules e índices da coleção
3. `verificaUsuario`
4. Route Handler sem IA nem service account para testemunhos
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
| Inundação de fraude | um documento por uid, `origem: app` e nenhum `status` vindo do cliente. Reinstalar o app gera uid novo, e essa via não é fechada |
| Service account commitada | não é usada pelo envio de testemunhos; outras rotas mantêm a credencial só no servidor |
| Texto original exposto a quem não é admin | a collection tem `allow read: if isAdmin()` e nenhuma outra rota de leitura |
| Índice de `testimonials` esquecido no deploy | o `firestore.indexes.json` entra na entrega, a página traduz `failed-precondition` em aviso legível e o item está em `OPEN-QUESTIONS` |

