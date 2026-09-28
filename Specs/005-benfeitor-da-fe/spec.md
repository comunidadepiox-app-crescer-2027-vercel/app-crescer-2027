# Spec: 005-benfeitor-da-fe Benfeitor da Fé

- Status: `in-progress` (formulário do app arquivado em 28/09/2026; a aba abre o site da campanha)
- Complexidade: `alta`
- Personas: `fiel`
- Depende de: [001-autenticacao](../001-autenticacao/), [002-navegacao-e-home](../002-navegacao-e-home/)

> **Superfície web retirada.** O site Next.js é só a mesa administrativa (`/admin`).

> **Página do app arquivada em 28/09/2026.** A campanha passou a ser do site da Comunidade de São Pio X, e o app não repete esse conteúdo. A tela e a lib do formulário saíram das rotas do expo-router e ficaram em `mobile/_arquivo/benfeitor/`, fora do bundle, com um README que descreve o que é preciso para recriá-las. A aba **Benfeitor** da barra inferior deixa de ser rota e abre `https://benfeitordafe.comunidadepiox.org.br/crescer` no navegador. A coleção `benefactorLeads`, a rota `/admin/leads` e as regras de leitura continuam intactas, para o caso de o formulário voltar.

## Problema

O encontro depende de apoio contínuo. O fiel precisa entender a campanha e deixar um cadastro para a comunidade entrar em contato. O app não cobra.

## Escopo

### Entra

- Aba **Benfeitor** na barra inferior do app, que abre a campanha no site da comunidade
- A página interna de campanha e o formulário de lead, arquivados em `mobile/_arquivo/benfeitor/` e disponíveis para recriação
- Leitura da coleção `benefactorLeads` pelo admin, mantida como está

### Não entra

- Página de campanha dentro do app
- Gateway, Pix copia-e-cola automático, boleto, cartão, assinatura recorrente no app
- Valor de contribuição
- Área "meu histórico de doações"
- Captcha matemático do site oficial (1+1) se o Auth já autenticou o fiel; manter só se o risco de spam exigir depois

## Fluxos

1. Fiel toca Benfeitor na barra inferior e o site da campanha abre no navegador do aparelho, em `https://benfeitordafe.comunidadepiox.org.br/crescer`.
2. O app não pede dado nenhum nesse caminho: nome, telefone, CPF e consentimento ficam com o site.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota do app | nenhuma. A aba Benfeitor é link externo |
| Coleção | `benefactorLeads` (leitura do admin) |
| Link externo | `https://benfeitordafe.comunidadepiox.org.br/crescer` |
| Papel | `fiel` para tocar a aba; `admin` para ler os leads |

## Página arquivada

Ficou em `mobile/_arquivo/benfeitor/`, fora das rotas do expo-router e fora do bundle. Para recriá-la, o README da pasta lista o que é preciso:

| Arquivo | Responsabilidade |
|---|---|
| `mobile/_arquivo/benfeitor/README.md` | o que a tela fazia e o que falta para voltar |
| `mobile/_arquivo/benfeitor/BenfeitorScreen.jsx` | hero da campanha, texto, formulário, LGPD e confirmação |
| `mobile/_arquivo/benfeitor/benfeitorLib.js` | máscaras de celular e CPF, validação de CPF e telefone, `submitLead` e `jaTemLead` |

Dependências que a tela arquivada tem no app: `lib/firebase.js`, `lib/authProvider.jsx`, `components/FundoPoligonal.jsx` e `components/Ui.jsx`. Nenhuma delas foi removida nesta entrega.

## Dados

Coleção `benefactorLeads/{id}`. O contrato não mudou e o app não escreve mais nela.

| Campo | Tipo | Obrigatório | Nota |
|---|---|---|---|
| `name` | string | sim | (LGPD) |
| `email` | string | não | Não é preenchido pelo app do fiel; pode existir em registros antigos |
| `phone` | string | sim | (LGPD) |
| `cpf` | string | sim | (LGPD) só dígitos internamente |
| `lgpdConsent` | bool | sim | deve ser `true` |
| `lgpdConsentAt` | timestamp | sim | |
| `uid` | string | sim | quem enviou |
| `status` | `'novo'` \| `'contatado'` \| `'descartado'` | sim | default `novo` |
| `createdAt` | timestamp | sim | |

## Regras de negócio

- A aba Benfeitor é um link externo. Ela não entra como rota do expo-router, para o botão não piscar em branco ao tocar.
- O app não pede CPF, telefone nem consentimento de LGPD neste caminho.
- Sem consentimento, nada é gravado. A regra continua valendo caso o formulário volte.
- CPF válido (algoritmo) e celular com DDD. A máscara é só visual; no Firestore gravamos só dígitos.
- O client **não** processa pagamento.
- Copy alinhada ao site oficial, sem travessão, sem "jornada de doação".
- Fiel cria só o próprio lead (`uid == auth.uid`). Pode ler só os próprios documentos. Não lista a coleção inteira.

## Critérios de aceite

- [ ] A aba Benfeitor da barra inferior abre o site da campanha no navegador
- [ ] Nenhuma rota `/benfeitor` existe no bundle do app
- [ ] A tela e a lib arquivadas estão em `mobile/_arquivo/benfeitor/`, com o README do que falta para voltar
- [ ] A aba mantém o ícone de coração e o rótulo Benfeitor, na mesma posição da barra
- [ ] `/admin/leads` continua lendo `benefactorLeads` sem alteração
- [ ] Nenhum dado é pedido ao fiel antes de sair para o site

## Anti-slop

Não é landing de crowdfunding com barra de meta e números gigantes. Quem lê a campanha agora é o site da comunidade, e o app só abre a porta.

## Referências

- https://benfeitordafe.comunidadepiox.org.br/crescer
- Mantenedora e CNPJ em [VISION.md](../VISION.md)
- Comportamento do link externo na barra: [002-navegacao-e-home](../002-navegacao-e-home/spec.md)

