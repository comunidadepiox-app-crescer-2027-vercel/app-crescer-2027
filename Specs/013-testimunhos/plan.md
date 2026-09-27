# Plan: 013-testimunhos Testemunhos

- Spec: [spec.md](spec.md)
- Status: `planned`

## Abordagem

Uma spec só para o fluxo inteiro: o app envia, a mesa decide. A barreira real é o servidor. O app do fiel chama `POST /api/testemunhos` com o token da sessão anônima; a rota valida a sessão com `verificaUsuario`, chama a IA, monta o documento com os campos do contrato e grava com o Admin SDK. A coleção `testimonials` fica com escrita `false` nas rules, então nenhum app adulterado injeta resumo, status ou texto fora do filtro. Isso difere do Benfeitor, que grava direto porque é um cadastro comercial; aqui o conteúdo passa por moderação e o texto é lido em público.

A IA é a API do Groq com `llama-3.3-70b-versatile`, no free tier, sem cartão. A chave é `GROQ_API_KEY` e só existe no servidor. A chamada usa `temperature: 0.2` e `response_format: json_object`, e a resposta é `{ aprovado, motivo, resumo }`. Falha de chave ou de rede não bloqueia o envio: o documento entra como `revisao`, sem resumo, e aparece na aba Aguardando. O mesmo espelho vale para a faixa do início da mesa, que já perde a linha de estado quando a leitura falha.

A mesa lê com o SDK client, como as demais abas, e decide com `updateDoc`. A leitura nunca mostra o texto original. `firebase-admin` entra como dependência do projeto para o Route Handler, reaproveitando a `FIREBASE_SERVICE_ACCOUNT` que o job de aviso de saída já usa.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/app/testemunhos.jsx` | tela autenticada, formulário, contador, estados de envio e confirmação |
| `mobile/assets/icons/icone-testemunhos.png` | logo do hero e ícone do atalho, usada no menu no lugar do ícone de linha |
| `mobile/lib/testemunhos.js` | validação pura, limite de 2000, `nomeNormalizado` |
| `mobile/lib/enviaTestemunho.js` | `jaEnviouTestemunho(uid)`, `enviaTestemunho({ uid, nome, anonimo, texto })` contra a rota do servidor |
| `mobile/components/MenuAtalhos.jsx` | uma linha em `ITENS` para o atalho Testemunhos |
| `app/api/testemunhos/route.js` | valida sessão, trava o teto, chama a IA, grava com Admin SDK, trava envio duplicado |
| `lib/server/iaTestemunho.js` | prompt em português, chamada ao Groq, parse e normalização da resposta |
| `lib/server/iaTestemunho.test.js` | casos de recusa, suavização, repetição e texto limpo, sem rede |
| `lib/server/verificaAdmin.js` | `verificaUsuario(idToken)`, que resolve o uid de qualquer sessão, anônima inclusive |
| `lib/admin/testimonials.js` | `listaTestemunhos(aba, cursor, tamanho)`, `contaTestemunhos(aba)`, `marcaLido`, `naoAceita` |
| `components/admin/PaginacaoMesa.jsx` | setas e contador, no desenho do Terço, com `IconeMesa` |
| `app/admin/testemunhos/page.jsx` | abas, lista paginada, dois botões de decisão, faixa de motivo |
| `app/admin/page.jsx` | faixa Testemunhos no índice, com a contagem real da fila |
| `components/admin/iconesMesa.jsx` | chaves `testimonials`, `volta` e `avanca` no `TRACOS` |
| `app/admin/layout.jsx` | item Testemunhos no `MENU` |
| `firestore.rules` | `match /testimonials/{id}` com leitura só de admin e escrita `false` |
| `firestore.indexes.json` | compostos de `status` com `createdAt` |
| `.env.example`, `.env.local` | `GROQ_API_KEY` |
| `package.json` | `firebase-admin` |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `testimonials` | `admin`: todas | só o Admin SDK, pela rota do servidor | `pasta ASC, createdAt ASC`, um único composto |

Regras de segurança a prever:

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
3. `verificaUsuario` e a camada de IA com teste
4. Route Handler, `firebase-admin` e a chave no ambiente
5. Lib e tela do app, depois o atalho da folha central
6. Leitura paginada e botões na mesa, depois o item do menu
7. Sync das specs irmãs e validação de build

## Fora deste plan

- Publicação no app, áudio e foto
- Mural público e compartilhamento
- Exportação e estatística
- Push ao receber um testemunho
- Desfazer decisão

## Riscos

| Risco | Mitigação |
|---|---|
| Cota gratuita da Groq estourar no dia do encontro | `status: revisao` e o admin descarta o que não tem resumo; sem resumo automático e sem perda de texto |
| Resumo suave demais e o apresentador ler errado no palco | o resumo entra no cartão e o admin lê antes de marcar lido |
| Inundação de fraude | um envio por uid, trava no servidor, `origem: app` e nenhum resumo vindo do cliente. Reinstalar o app gera uid novo, e essa via não é fechada |
| Chave da IA commitada | `GROQ_API_KEY` só no servidor, e `.env` e `.env.local` já estão no `.gitignore` deste repositório |
| Texto original exposto por engano na mesa | a página da mesa nunca renderiza o campo `texto`, e o teste de build confere o bundle |
| Índice de `testimonials` esquecido no deploy | o `firestore.indexes.json` entra na entrega, a página traduz `failed-precondition` em aviso legível e o item está em `OPEN-QUESTIONS` |

## Fora deste plan

Analytics, galeria, mural e qualquer métrica na mesa.
