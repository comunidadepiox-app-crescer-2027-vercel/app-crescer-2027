# Tasks: 001-autenticacao Autenticação e tela de início

## Checklist

- [x] **T1 — Cliente Firebase**
  - Faz: `lib/firebase/client.js` com Auth e Firestore a partir de `NEXT_PUBLIC_*`.
  - Verifica: app inicializa sem secret de servidor no client.
  - Fora: UI.

- [x] **T2 — Regras de `users`**
  - Faz: `firestore.rules` para create `fiel` e update sem mudar `role`.
  - Verifica: tentativa de gravar `admin` pelo client falha.
  - Fora: coleções de notícia.

- [x] **T3 — AuthProvider e guard**
  - Faz: sessão reativa; rotas internas exigem login.
  - Verifica: `/home` sem sessão volta a `/`.
  - Fora: desenho da Home.

- [x] **T4 — Cadastro e login por e-mail**
  - Faz: dois modos no mesmo `/` (entrar / criar conta).
  - Verifica: conta nova gera `users/{uid}` e abre `/home`.
  - Fora: Google.

- [x] **T5 — Google**
  - Faz: provider Google + create do doc se não existir.
  - Verifica: segundo login não duplica nem reseta `role`.
  - Fora: outros providers.

- [x] **T6 — Reset de senha e erros**
  - Faz: `sendPasswordResetEmail` e mensagens claras.
  - Verifica: cada botão tem destino; erros não são genéricos vazios.
  - Fora: tela de configuração.

- [x] **T7 — Substituir placeholder da 000**
  - Faz: `/` é só a tela de início, com identidade da 000.
  - Verifica: logado em `/` vai para `/home`; copy sem travessão.
  - Fora: seções de notícia.

## Validação final

- [ ] Aceite de `spec.md`
- [ ] Nenhum botão sem destino
- [ ] Copy sem travessão
- [ ] E-mail tratado como dado pessoal (não logar senha)
- [ ] Docs desta pasta atualizados
