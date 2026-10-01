# Requirements: 002-navegacao-e-home Navegação e Home

## Funcionais

- **RF-01** Fiel autenticado vê a barra com Home, Notícias, Programação e Benfeitor da Fé, e o círculo de menu no centro. A Conta abre pela engrenagem do header. Galeria e Sobre continuam rotas do app.
- **RF-02** `/home` exibe seção de notícias e seção de cronograma do dia.
- **RF-03** Fora das datas da edição, a Home explica o recorte usado.
- **RF-04** `/sobre` apresenta a comunidade e o encontro, com link de caravanas para o site oficial.
- **RF-05** `/galeria` existe como página real (mesmo que vazia no início).

## Não funcionais

- **RNF-01** Identidade DESIGN.md; aba ativa sem pílula. O círculo do menu é o controle do centro da barra
- **RNF-02** Queries no client Firestore até haver motivo para server actions
- **RNF-03** Nav usável com o polegar no mobile
- **RNF-04** Datas em `America/Recife`

## Papéis

| Ação | `fiel` | `admin` | Sem sessão |
|---|---|---|---|
| Ver Home e nav | sim | sim | não |
| Publicar destaque | não | spec 007 | não |

## LGPD

Não coleta. Pode exibir nome do fiel só se o header precisar (opcional; preferir não).

## Dependências

- 001 autenticada
- 003 e 004 para dados reais; não bloqueiam as cascas
- Decisão da edição em OPEN-QUESTIONS (constante temporária permitida)

## Fora

Admin, detalhe da notícia, formulário Benfeitor, cronograma completo.
