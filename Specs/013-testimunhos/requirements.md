# Requirements: 013-testimunhos Testemunhos

## Funcionais

- **RF-01** O fiel abre Testemunhos pela folha central do app.
- **RF-02** O fiel escreve o nome ou marca a opção de enviar como anônimo.
- **RF-03** O fiel escreve o testemunho em um campo de 2000 caracteres.
- **RF-04** O envio passa por uma IA gratuita que filtra o texto e devolve um resumo legível no palco.
- **RF-05** Texto com palavrão, baixo calão ou conteúdo de risco é gravado marcado como recusado pela IA, para decisão do apresentador.
- **RF-06** Todo testemunho gravado aparece na aba Testemunhos da mesa, do mais antigo para o mais recente.
- **RF-07** O apresentador navega entre as páginas de testemunhos com setas, sem sair da aba.
- **RF-08** O apresentador marca um testemunho como lido ou como não aceito, e o item sai da lista de aguardando.
- **RF-09** A leitura da mesa mostra o resumo, não o texto original.

## Não funcionais

- **RNF-01** Identidade: tokens e proibições de [DESIGN.md](../DESIGN.md)
- **RNF-02** Stack: Next.js App Router, JSX, Tailwind, Firebase, Cloudinary
- **RNF-03** Acessibilidade: contraste AA no texto corrido; alvos de toque usáveis no mobile
- **RNF-04** A mesa de Testemunhos é navegável em tela de 375 px, sem tabela e sem rolagem horizontal
- **RNF-05** A chave da IA e a service account nunca entram no bundle do app
- **RNF-06** Falha da IA não perde o testemunho: o item entra em revisão manual

## Papéis

| Ação | `fiel` | `admin` | Sem sessão |
|---|---|---|---|
| Abrir `/testemunhos` no app | sim | não se aplica | redireciona ao início |
| Enviar testemunho pela rota do servidor | sim, uma vez | não se aplica | 401 |
| Ler `testimonials` | não | sim | não |
| Marcar lido ou não aceito | não | sim | não |

## LGPD

- Dados: nome opcional (LGPD), texto do testemunho (LGPD), uid anônimo do Firebase Auth (LGPD)
- Finalidade: receber e preparar a leitura de testemunhos no encontro
- Base / aviso ao titular: checkbox de anônimo e aviso curto na tela, alinhado ao aviso já usado no app
- Onde fica armazenado: coleção `testimonials` no mesmo projeto Firestore do evento
- Quem lê: somente a equipe com `role: admin`. O fiel não lê a coleção
- Quem apaga: a equipe, pelo console do Firebase, a pedido do titular
- Pendência: validar o texto final do aviso com a comunidade, registrado em [OPEN-QUESTIONS.md](../OPEN-QUESTIONS.md)

## Dependências

- Specs que precisam estar `planned` ou `in-progress`: [007-admin-cms](../007-admin-cms/), [008-app-react-native](../008-app-react-native/), [002-navegacao-e-home](../002-navegacao-e-home/)
- Contas / secrets: chave gratuita do Groq em `GROQ_API_KEY`; `FIREBASE_SERVICE_ACCOUNT` já presente no projeto

## Fora

- Publicar testemunho no app para a comunidade ler
- Galeria de fotos ou áudio junto do testemunho
- Mural público de testemunhos
- Exportação e relatório
- Notificação push ao receber um testemunho
