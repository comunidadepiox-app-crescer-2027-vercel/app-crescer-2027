# Benfeitor da Fé, arquivado

A tela de campanha e o formulário de lead do Benfeitor da Rite saíram do app em
**28/09/2026**. A campanha passou a ser do site da Comunidade de São Pio X, e o
app não repete esse conteúdo. A aba **Benfeitor** da barra inferior abre
`https://benfeitordafe.comunidadepiox.org.br/crescer` no navegador.

Esta pasta existe para o formulário não ter de ser reescrito do zero caso a
Comunidade queira voltar com ele. Nada aqui é importado por nenhuma tela, e
nada aqui entra no bundle do app: o expo-router só enxerga arquivos em
`mobile/app/`, e o Metro só empacota o que é importado.

## O que tem aqui

| Arquivo | Responsabilidade |
|---|---|
| `BenfeitorScreen.jsx` | Tela da campanha: hero com a logo, texto, os três passos oficiais, formulário, checkbox de LGPD e a tela de cadastro recebido |
| `benfeitorLib.js` | Máscaras de celular e CPF, validação de CPF por algoritmo e de celular com DDD, `submitLead` e `jaTemLead` |

## O que a tela fazia

- Hero roxo poligonal com `assets/brand/logo-benfeitor.png` na caixa de 260 por
  112 e o parágrafo de apoio, sem título
- Campos de nome, e-mail, celular e CPF, com a máscara aparecendo enquanto digita
- Checkbox de consentimento de LGPD, obrigatório para gravar
- Gravação em `benefactorLeads` com `status: novo` e `uid` da sessão anônima
- Se já existisse lead do mesmo `uid`, abria a tela de cadastro recebido com os
  três próximos passos e o WhatsApp oficial `(83) 98897-7017`
- Prefill de nome e e-mail a partir de `users`

## Para recriar, o caminho é este

1. Mova `BenfeitorScreen.jsx` para `mobile/app/(tabs)/benfeitor.jsx` e
   `benfeitorLib.js` para `mobile/lib/benfeitor.js`.
2. Ajuste os imports relativos. No arquivo original eles eram `../../` a partir
   de `mobile/app/(tabs)/`, e continuam sendo `../../` a partir de
   `mobile/_arquivo/benfeitor/`, que tem a mesma profundidade. O que muda é o
   nome do arquivo da lib e o do componente.
3. Em `mobile/app/(tabs)/_layout.jsx`, volte a `Tabs.Screen` de `benfeitor` e
   tire o item de link externo de `BarraAbas.jsx` (a constante `LINK_EXTERNO`).
4. O `LGPD`, a máscara e o `submitLead` continuam válidos. A coleção
   `benefactorLeads`, as regras de leitura e a aba `/admin/leads` do site não
   foram tocadas.

## O que não depende de nada que tenha sido removido

Estes arquivos do app continuam existindo e podem ser reutilizados:

- `mobile/lib/firebase.js`
- `mobile/lib/authProvider.jsx`
- `mobile/components/FundoPoligonal.jsx`
- `mobile/components/Ui.jsx`

O que saiu junto com a tela de Configuração foi `mobile/lib/avisoSaida.js` na
parte da localização, e isso não afeta esta tela.

## Regra

Botão sem destino é proibido. Se a tela voltar, a aba tem que voltar a ser uma
rota de verdade, e não um link que finge ser uma tela.
