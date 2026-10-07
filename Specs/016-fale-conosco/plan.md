# Plan: 016-fale-conosco Fale Conosco

- Spec: [spec.md](spec.md)
- Status: `in-progress`

## Abordagem

Uma tela de leitura e toque, no mesmo desenho da página de Fornecedores: fundo claro, uma coluna, cabeçalho laranja com voltar para a Home, linha de apoio e uma linha por canal. Cada linha traz o ícone em quadrado creme, o nome do canal, o valor oficial e uma seta, que é o padrão que o app já usa para "isto abre alguma coisa".

A diferença para Fornecedores é que aqui a linha é realmente acionável. Cada canal carrega a URL que o aparelho entende: `tel:`, `mailto:` e `whatsapp://`. Não há botão de "enviar mensagem" nem campo de texto, porque o app não recebe nada do fiel.

O WhatsApp é o único caso com dois caminhos. O toque pergunta antes se o aplicativo está instalado: se estiver, abre `whatsapp://send?phone=...` e cai direto na conversa; se não estiver, abre `https://wa.me/...` no navegador, que é o único caminho que ainda funciona sem aplicativo. Os três canais passam por `Linking.canOpenURL` e, se o aparelho recusar, um `Alert` diz qual canal falhou, com o mesmo tom de aviso honesto que `lib/links.js` já usa para o Participar.

Os contatos ficam em `mobile/lib/contatos.js`, com o valor exibido separado do valor da ação. O arquivo é o único lugar a editar quando a comunidade trocar um número, no mesmo espírito do marcador de texto final em `lib/sobreApp.js`.

O atalho entra na folha central entre Fornecedor e Testemunhos. A folha já tem onze itens; com o novo, fecha em quatro linhas de três, sem sobra.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/lib/contatos.js` | os três canais oficiais, valor exibido, URL da ação e a mensagem de aviso por canal |
| `mobile/app/fale-conosco.jsx` | tela autenticada, linha de apoio e as três linhas acionáveis |
| `mobile/components/MenuAtalhos.jsx` | uma linha em `ITENS` para o atalho Fale Conosco, com `MessageCircle` |

## Firestore

Nenhuma coleção nova, nenhuma leitura e nenhuma escrita. Não há contrato alterado.

## Cloudinary

Não.

## Ordem de entrega

1. `mobile/lib/contatos.js` com os três canais e as URLs de ação.
2. `mobile/app/fale-conosco.jsx` com as linhas acionáveis e o aviso por canal.
3. `MenuAtalhos.jsx` com o atalho Fale Conosco.
4. Sincronia do `Specs/README.md` e da `008`.
5. `npx expo export --platform android` para conferir o bundle.

## Riscos

| Risco | Mitigação |
|---|---|
| Número de WhatsApp divergir do oficial | o número vive em uma constante só, com comentário de origem; nenhuma tela repete dígito |
| `canOpenURL` falhar no iOS por falta de esquema declarado | a reserva em `wa.me` cobre o caso; o app não depende do teste para funcionar |
| Toque em canal sem aplicativo não fazer nada | `canOpenURL` antes e `Alert` depois, com o nome do canal no aviso |
| A tela virar formulário de atendimento | a spec proíbe formulário; a linha só abre aplicativo do aparelho |
| Inserir mais um item e quebrar a grade de três colunas | a folha vai de 11 para 12 itens, quatro linhas cheias |

## Fora deste plan

Formulário de contato, envio de mensagem pelo app, atendentes, horário de atendimento, outros canais, mapa, qualquer número fora dos três validados e qualquer coleção nova.