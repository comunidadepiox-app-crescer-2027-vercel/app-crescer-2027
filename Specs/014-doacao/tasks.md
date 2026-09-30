# Tasks: 014-doacao Colabore

Uma task = uma mudança verificável. Proibido agrupar “implementar a tela inteira”.

Marcar `[x]` só depois de conferir o critério. Se o comportamento mudar no código, atualizar este arquivo.

## Checklist

- [x] **T1 — Spec e contratos**
  - Faz: registrar rota, `siteContent/doacao`, PIX estático, header, folha e mesa.
  - Verifica: spec, plan e mapa em `Specs/README.md` descrevem o comportamento antes do código.
  - Fora: implementação da tela.

- [x] **T2 — Header e folha**
  - Faz: botão **COLABORE** no header abre `/colabore`; atalho Colabore entra na folha depois de Participar.
  - Verifica: Participar permanece na folha; o ícone de informação continua no header.
  - Fora: conteúdo da página.

- [x] **T3 — Tela da oferta**
  - Faz: `/colabore` com convite, logo na faixa laranja, QR, código copia e cola, beneficiário e aviso de que o app não recebe o pagamento.
  - Verifica: sessão obrigatória, voltar para a Home, copiar coloca o payload na área de transferência.
  - Fora: barra de progresso e mesa.

- [x] **T4 — Mesa do percentual**
  - Faz: `/admin/doacao` no menu, campo 0–100, salvar em `siteContent/doacao`. Campo vazio remove `percent`.
  - Verifica: inteiro fora de 0–100 é recusado; `0` grava barra vazia.
  - Fora: editar PIX ou meta em reais.

- [x] **T5 — Barra ao vivo**
  - Faz: escuta `siteContent/doacao` e mostra a barra só com inteiro 0–100, sem cifra.
  - Verifica: sem documento ou sem `percent`, a barra não aparece; com número válido, atualiza sem recarregar o app.
  - Fora: gráfico circular ou valor em reais.

- [x] **T6 — Abertura**
  - Faz: overlay em cada visita, frases em sequência, contagem até 86.000, toque para pular. Com movimento reduzido, não anima.
  - Verifica: a barra laranja permanece; o toque ou o fim da sequência revela a oferta; o 86.000 não aparece como meta.
  - Fora: persistir que a pessoa já viu.

- [x] **T7 — Rearranjo da oferta**
  - Faz: blocos centrados, parágrafos justificados, faixa da logo, cartão PIX e cartão de quem recebe.
  - Verifica: QR, botão copiar e beneficiário continuam; sem coração animado.
  - Fora: alterar a mesa.

- [x] **T8 — Docs do redesign v2**
  - Faz: registrar ritmo em 3 atos, tipos maiores e continuidade laranja em spec, plan e tasks.
  - Verifica: diff só em `Specs/014-doacao`, sem mudar contrato.
  - Fora: código.

- [x] **T9 — Abertura v2**
  - Faz: mesma sequência e 86.000, com entrada translateY mais fade mais escala, filete dourado e saída revelando a oferta.
  - Verifica: total abaixo de 7s, toque pula após 700ms, movimento reduzido estático, sem foto nem gradiente.
  - Fora: mudar roteiro ou mesa.

- [x] **T10 — Oferta v2**
  - Faz: faixa ponte, convite, barra, cartão PIX único, beneficiário compacto e aviso, com tipos maiores.
  - Verifica: QR, copiar, beneficiário e barra condicional continuam.
  - Fora: remover informação obrigatória.

- [x] **T11 — Regressão**
  - Faz: conferir sessão, voltar para home, copy sem travessão e `expo-doctor`.
  - Verifica: nenhum botão órfão.
  - Fora: nova feature.

- [x] **T12 — Docs do redesign v3**
  - Faz: tirar os valores da abertura da spec, do plan e das tasks, e registrar o roteiro novo.
  - Verifica: nenhum aceite exige 86.000 na abertura.
  - Fora: código.

- [x] **T13 — Abertura v3**
  - Faz: 3 atos sem valores, fundo com camada ambiente e marcadores de progresso.
  - Verifica: total abaixo de 7s, toque pula após 700ms, movimento reduzido estático, sem foto nem gradiente.
  - Fora: mudar a oferta ou a mesa.

- [x] **T14 — Ponte e regressão**
  - Faz: faixa laranja repete a frase final nova; conferir sessão, voltar, copy sem travessão.
  - Verifica: QR, copiar, beneficiário e barra condicional continuam.
  - Fora: nova feature.

- [x] **T15 — Docs do redesign v4**
  - Faz: roteiro em 4 atos com refrão VIRA e malha conectada na spec, no plan e nas tasks.
  - Verifica: nenhum aceite exige valores na abertura.
  - Fora: código.

- [x] **T16 — Abertura v4**
  - Faz: atos VIRA ACOLHIDA e VIRA MESA POSTA, malha própria com deriva, halo, paralaxe e filete no ato final.
  - Verifica: total por volta de 9s, toque pula após 700ms, movimento reduzido estático, sem foto nem gradiente.
  - Fora: mudar a oferta ou a mesa.

- [x] **T17 — Regressão**
  - Faz: conferir sessão, voltar, copy sem travessão e nenhum botão órfão.
  - Verifica: QR, copiar, beneficiário e barra condicional continuam.
  - Fora: nova feature.

- [x] **T18 — Ajuste sem entrada e frase ponte**
  - Faz: textos da abertura aparecem direto, só com fade de saída; ponte e ato 4 com a frase nova.
  - Verifica: sem animação de entrada, frase idêntica nos dois lugares, copy sem travessão.
  - Fora: mudar roteiro ou fundo.

- [x] **T19 — Remover a abertura**
  - Faz: `/colabore` abre direto na oferta; arquiva o componente em `mobile/_arquivo/colabore/` com README; atualiza spec, plan e tasks.
  - Verifica: nenhum import aponta para a abertura; QR, copiar, beneficiário e barra condicional continuam.
  - Fora: mudar a oferta ou a mesa.

- [x] **T20 — Restaurar a abertura v4**
  - Faz: remove a versão cinética da outra IA, volta o componente v4 para `mobile/components/`, religa no `/colabore` e reverte spec, plan e tasks.
  - Verifica: nenhum vestígio da versão cinética; QR, copiar, beneficiário e barra condicional continuam.
  - Fora: mudar a oferta ou a mesa.

- [x] **T21 — Abertura v5 com texto novo e ritmo calmo**
  - Faz: 4 batidas pedidas pelo responsável, transições lentas sem mola nem escala, fundo em laços longos.
  - Verifica: fecho dourado com filete, toque pula após 700ms, movimento reduzido estático, sem valores em reais.
  - Fora: mudar a oferta ou a mesa.

## Validação final

- [ ] Todos os critérios de aceite de `spec.md` passaram
- [ ] Nenhuma rota ou botão sem destino
- [ ] Copy sem travessão
- [ ] Se houve dado pessoal, fluxo LGPD conferido
- [ ] `spec.md`, `plan.md` e este arquivo refletem o que foi entregue
