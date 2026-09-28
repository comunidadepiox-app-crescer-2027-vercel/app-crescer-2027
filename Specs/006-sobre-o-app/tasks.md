# Tasks: 006-sobre-o-app Sobre o app

Uma task = uma mudança verificável. Proibido agrupar "implementar a tela inteira".

Marcar `[x]` só depois de conferir o critério. Se o comportamento mudar no código, atualizar este arquivo.

## Retirada da tela de Configuração (feito antes desta troca)

- [x] **T1 — Página de conta**
  - Faz: `/configuracao` com e-mail e nome.
  - Verifica: sem sessão redireciona.
  - Fora: admin CMS.

- [x] **T2 — Salvar nome**
  - Faz: Auth + `users.displayName`.
  - Verifica: reload mantém o nome.
  - Fora: e-mail editável.

- [x] **T3 — Sair**
  - Faz: signOut → `/`.
  - Verifica: voltar não reabre Home autenticada.
  - Fora: delete.

- [x] **T4 — Admin link e privacidade**
  - Faz: atalho só se `role == admin`; texto LGPD curto.
  - Verifica: fiel não vê `/admin`; copy sem travessão.
  - Fora: lista de leads.

## Sobre o app (28/09/2026)

- [x] **T5 — Texto da página isolado em arquivo**
  - Faz: `mobile/lib/sobreApp.js` com `TEXTO_SOBRE_APP` e `AVISO_DADOS`, mais o marcador de onde entra o texto final.
  - Verifica: a tela não tem string de conteúdo; trocar o vetor muda a página inteira.
  - Fora: qualquer texto final, que ainda não existe.

- [x] **T6 — Rota `/sobre-o-app`**
  - Faz: a tela com título, parágrafos, aviso de uso dos dados, atalhos de Galeria e Sobre o Crescer e bloco do admin.
  - Verifica: abre com sessão, redireciona sem sessão, nenhuma rolagem horizontal em 375 px e nenhum campo editável.
  - Fora: mudar o padrão visual de `/sobre` e `/galeria`.

- [x] **T7 — Ícone de informação no header**
  - Faz: `IconeInfo` no lugar de `IconeEngrenagem`, abrindo `/sobre-o-app`; `IconeEngrenagem` removido de `Icones.jsx`.
  - Verifica: nenhuma ocorrência de engrenagem no app e o bundle abre a rota nova.
  - Fora: mudar a barra inferior.

- [x] **T8 — Retirada de `conta`**
  - Faz: `mobile/app/(tabs)/conta.jsx` removido, `Tabs.Screen` de `conta` fora do `(tabs)/_layout.jsx`, e o `Voltar` de `/galeria` e `/sobre` apontando para `/sobre-o-app`.
  - Verifica: nenhuma rota `/conta` no bundle e as duas páginas institucionais voltam para a página certa.
  - Fora: apagar `users.displayName` de quem já tem valor gravado.

- [x] **T9 — Sincronia das specs**
  - Faz: atualizar `README.md`, a 002, a 008 e a 010 com a saída da configuração e do apagamento de localização.
  - Verifica: nenhum documento ficou atrás do código.
  - Fora: reescrever spec que não mudou de comportamento.

## Validação final

- [ ] Aceite de `spec.md` (falta o texto final da comunidade)
- [x] Nenhum toggle fictício
- [x] Docs atualizados
