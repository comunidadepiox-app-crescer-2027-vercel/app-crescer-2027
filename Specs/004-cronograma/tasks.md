# Tasks: 004-cronograma Cronograma

## Checklist

- [x] **T1 — Enum de espaços**
  - Faz: `spaces.js` com os seis espaços e rótulos do site.
  - Verifica: slugs estáveis; nenhum chip visual ainda.
  - Fora: UI.

- [x] **T2 — Queries e dia**
  - Faz: listar por data; resolver hoje/primeiro/último.
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
  - Faz: seção do dia da 002 usa a mesma função.
  - Verifica: mesmo conjunto de itens.
  - Fora: mapa.

## Validação final

- [ ] Aceite de `spec.md`
- [ ] Copy sem travessão
- [ ] Docs atualizados
