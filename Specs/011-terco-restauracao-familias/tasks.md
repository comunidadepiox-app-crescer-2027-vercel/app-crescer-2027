# Tasks: 011-terco-restauracao-familias Terço da Restauração das Famílias

## Checklist

- [x] **T1 — Contrato da funcionalidade**
  - Faz: registrar conteúdo local, rota, fluxo e limites de escopo.
  - Verifica: não cria coleção ou permissão Firebase.
  - Fora: implementação visual.

- [x] **T2 — Rota e conteúdo devocional**
  - Faz: criar as onze etapas em tela autenticada, com retorno e rolagem.
  - Verifica: cada etapa tem conteúdo completo e a troca retorna ao topo.
  - Fora: salvar progresso.

- [x] **T3 — Navegação entre etapas**
  - Faz: adicionar barra inferior fixa, contador e setas com limites.
  - Verifica: primeira e última etapas não permitem sair do intervalo.
  - Fora: navegação por gesto.

- [x] **T4 — Atalho do menu**
  - Faz: tornar o item Terço navegável e fechar a folha antes de abrir a rota.
  - Verifica: os outros três atalhos continuam sem destino.
  - Fora: rotas de Voluntário, Fornecedor e Spotify.

- [x] **T5 — Validação do bundle**
  - Faz: gerar o bundle Android do Expo.
  - Verifica: export termina sem erro.
  - Fora: teste manual no Expo Go.

## Validação final

- [ ] Todos os critérios de aceite de `spec.md` passaram
- [ ] Nenhuma rota ou botão novo sem destino
- [ ] Copy sem travessão
- [ ] `spec.md`, `plan.md` e este arquivo refletem o que foi entregue
