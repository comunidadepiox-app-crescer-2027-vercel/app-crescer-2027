# Requirements: 005-benfeitor-da-fe Benfeitor da Fé

## Funcionais

- **RF-01** Fiel autenticado lê a campanha em `/benfeitor`.
- **RF-02** Envia nome, e-mail, celular e CPF com consentimento LGPD.
- **RF-03** Lead nasce com `status: novo` e `uid` do autor.
- **RF-04** Não há cobrança no app.
- **RF-05** Confirmação descreve o próximo passo humano (WhatsApp, boleto ou Pix depois).

## Não funcionais

- **RNF-01** Visual institucional, sem crowdfunding kit
- **RNF-02** CPF armazenado só para a equipe; leitura restrita
- **RNF-03** Formulário usável no mobile

## Papéis

| Ação | `fiel` | `admin` | Sem sessão |
|---|---|---|---|
| Ver campanha | sim | sim | não |
| Enviar lead | sim | sim | não |
| Listar leads | não | 007 | não |

## LGPD

- Dados: nome, e-mail, celular, CPF
- Finalidade: contato da comunidade para concluir o cadastro de Benfeitor
- Aviso: checkbox obrigatório, texto alinhado ao site (“dados usados apenas para esta missão”)
- Onde: Firestore `benefactorLeads`
- Quem lê: `admin`
- Titular autenticado: o envio é consciente e vinculado ao `uid`

## Dependências

- 001, 002
- Decisão de WhatsApp automático em OPEN-QUESTIONS

## Fora

Pagamento, valor mínimo, área do doador.
