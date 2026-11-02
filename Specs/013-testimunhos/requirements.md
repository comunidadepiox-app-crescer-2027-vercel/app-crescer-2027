# Requirements: 013-testimunhos Testemunhos

## Funcionais

- **RF-01** O fiel abre Testemunhos pela folha central do app.
- **RF-02** O fiel escreve o nome ou marca a opção de enviar como anônimo.
- **RF-03** O fiel escreve o testemunho em um campo de 2000 caracteres.
- **RF-04** O envio grava o texto do jeito que foi escrito, sem passar por IA, filtro ou resumo.
- **RF-05** Todo testemunho gravado aparece na aba Testemunhos da mesa, do mais antigo para o mais recente.
- **RF-06** O apresentador navega entre as páginas de testemunhos com setas, sem sair da aba.
- **RF-07** O apresentador marca um testemunho como lido ou como não aceito, e o item sai da lista de aguardando.
- **RF-08** A leitura da mesa mostra o texto original, com nome, data e linha de status.

## Não funcionais

- **RNF-01** Identidade: tokens e proibições de [DESIGN.md](../DESIGN.md)
- **RNF-02** Stack: Next.js App Router, JSX, Tailwind, Firebase, Cloudinary
- **RNF-03** Acessibilidade: contraste AA no texto corrido; alvos de toque usáveis no mobile
- **RNF-04** A mesa de Testemunhos é navegável em tela de 375 px, sem tabela e sem rolagem horizontal
- **RNF-05** A service account e qualquer chave externa nunca entram no bundle do app
- **RNF-06** Nenhuma dependência de serviço externo: sem chave, sem cota e sem rede além do próprio projeto Firebase

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
- Atenção: a equipe lê o texto integral, sem resumo intermediário. Isso amplia o alcance do acesso e vale para o aviso de uso
- Pendência: validar o texto final do aviso com a comunidade, registrado em [OPEN-QUESTIONS.md](../OPEN-QUESTIONS.md)

## Dependências

- Specs que precisam estar `planned` ou `in-progress`: [007-admin-cms](../007-admin-cms/), [008-app-react-native](../008-app-react-native/), [002-navegacao-e-home](../002-navegacao-e-home/)
- Contas / secrets: o envio usa o token da sessão Firebase e não precisa de `FIREBASE_SERVICE_ACCOUNT`. Sem chave de IA

## Fora

- Publicar testemunho no app para a comunidade ler
- Galeria de fotos ou áudio junto do testemunho
- Mural público de testemunhos
- Exportação e relatório
- Notificação push ao receber um testemunho
