# Tasks: 016-fale-conosco Fale Conosco

Uma task = uma mudança verificável. Proibido agrupar "implementar a tela inteira".

Marcar `[x]` só depois de conferir o critério. Se o comportamento mudar no código, atualizar este arquivo.

## Especificação (07/10/2026)

- [x] **T1 — Spec, plan e contratos locais**
  - Faz: registrar rota, papel, os três canais validados, os dois caminhos do WhatsApp e o aviso por canal, antes de escrever código.
  - Verifica: `spec.md` e `plan.md` descrevem o comportamento, inclusive o que não entra.
  - Fora: qualquer número fora dos três validados.

## Implementação

- [x] **T2 — Contatos oficiais em arquivo**
  - Faz: `mobile/lib/contatos.js` com telefone, e-mail e WhatsApp, cada um com rótulo, valor exibido, URL da ação, aviso próprio e reserva do WhatsApp.
  - Verifica: trocar o número no arquivo muda a tela inteira; nenhum dígito se repete em outro arquivo.
  - Fora: endereço sem destino e número adivinhado.

- [x] **T3 — Rota `/fale-conosco`**
  - Faz: `mobile/app/fale-conosco.jsx` autenticada, com `Voltar` para `/home`, linha de apoio e uma linha por canal.
  - Verifica: abre com sessão, redireciona sem sessão, sem rolagem horizontal em 375 px e sem campo digitável.
  - Fora: alterar o padrão visual de `/fornecedor` e `/sobre-o-app`.

- [x] **T4 — Toque em cada canal**
  - Faz: telefone com `tel:`, e-mail com `mailto:` e WhatsApp testando o aplicativo antes, com reserva em `wa.me` e `Alert` nomeando o canal que falhou.
  - Verifica: os três toques abrem o destino correto e nenhum deixa o dedo sem resposta.
  - Fora: mensagem pronta, anexos e conversa dentro do app.

- [x] **T5 — Atalho na folha central**
  - Faz: uma linha em `ITENS` em `mobile/components/MenuAtalhos.jsx`, depois de Fornecedor, com `MessageCircle` e a rota `/fale-conosco`.
  - Verifica: o item fecha a folha e abre a página; a grade fecha em quatro linhas de três.
  - Fora: alterar os demais atalhos e a ordem dos que já existem.

- [x] **T6 — Sincronia das specs**
  - Faz: incluir a 016 no mapa do `Specs/README.md` e acrescentar a rota e o atalho na superfície da `008`.
  - Verifica: nenhum documento ficou atrás do código.
  - Fora: reescrever spec que não mudou de comportamento.

## Validação final

- [x] Aceite de `spec.md` conferido item a item
- [x] Nenhuma rota ou botão sem destino
- [x] Copy sem travessão
- [x] Nenhum dado pessoal coletado pela tela
- [x] `spec.md`, `plan.md` e este arquivo refletem o que foi entregue
- [ ] Toque validado em aparelho físico, com e sem WhatsApp instalado