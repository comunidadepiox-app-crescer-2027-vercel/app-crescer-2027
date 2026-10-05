# Tasks: 004-cronograma Cronograma

## Checklist

- [x] **T1 — Enum de espaços**
  - Faz: `spaces.js` com os oito espaços e rótulos do site.
  - Verifica: slugs estáveis; nenhum chip visual ainda.
  - Fora: UI.

- [x] **T2 — Queries e dia**
  - Faz: `observarProgramaPublicado`; filtrar a data e ordenar no client (sem índice composto).
  - Verifica: timezone Recife; fora do evento cai na regra da 002.
  - Fora: página.

- [x] **T3 — Regras de leitura**
  - Faz: fiel só `published`.
  - Verifica: item `published: false` some.
  - Fora: write admin.

- [x] **T4 — Página /cronograma**
  - Faz: troca de dia + seções por espaço + aviso de alteração.
  - Verifica: controle de dia não é `rounded-full`; vazios honestos.
  - Fora: edição.

- [x] **T5 — Home consome o recorte**
  - Faz: seção do dia da 002 escuta a mesma coleção e filtra o dia.
  - Verifica: mesmo conjunto de itens.
  - Fora: mapa.

- [x] **T6 — Estandes e Auditório do Espaço Cultural Shaolin**
  - Faz: slugs `estandes` e `auditorio-shaolin` em `lib/program/spaces.js` e no espelho `mobile/lib/programa.js`.
  - Verifica: os dois aparecem no seletor de Espaço de `/admin/cronograma`; item gravado com os slugs aparece no app com o rótulo escrito por extenso, na Home e em Programação.
  - Fora: grupo novo na UI do app; o agrupamento continua por `space`, sem card vazio.

## Validação final

- [ ] Aceite de `spec.md`
- [ ] Copy sem travessão
- [ ] Docs atualizados
