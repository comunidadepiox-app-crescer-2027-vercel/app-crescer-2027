# Plan: 006-sobre-o-app Sobre o app

- Spec: [spec.md](spec.md)
- Status: `in-progress`

## Abordagem

Uma página de leitura, no padrão do Sobre o Crescer já existente: fundo claro, uma coluna, título em maiúscula, parágrafos e atalhos como texto sublinhado. Sem card, sem toggle, sem campo.

O texto vem de `mobile/lib/sobreApp.js`, um vetor de parágrafos mais o aviso de uso dos dados. A tela percorre o vetor e não tem string de conteúdo. Quando a comunidade entregar o texto final, a edição é nesse arquivo e a tela não muda.

A tela de Configuração é removida junto com a `Tabs.Screen` de `conta`, que já estava com `href: null` e por isso não aparecia na barra. O ícone do header deixa de ser `IconeEngrenagem` e passa a ser `IconeInfo`, que já existia em `Icones.jsx` e só não era usado. `IconeEngrenagem` sai do arquivo de ícones, porque não sobrou tela de configuração para ele.

`/galeria` e `/sobre` continuam existindo. O `Voltar` das duas aponta para `/sobre-o-app`, que passa a ser o ponto de entrada de todo o conteúdo institucional do app.

## Arquivos e rotas previstos

| Caminho | Responsabilidade |
|---|---|
| `mobile/lib/sobreApp.js` | `TEXTO_SOBRE_APP` e `AVISO_DADOS`, com o marcador do texto final |
| `mobile/app/sobre-o-app.jsx` | tela: título, parágrafos, aviso, atalhos e bloco do admin |
| `mobile/components/Header.jsx` | `IconeInfo` no lugar de `IconeEngrenagem`, abrindo `/sobre-o-app` |
| `mobile/components/Icones.jsx` | `IconeEngrenagem` removido |
| `mobile/app/galeria.jsx` | `Voltar` passa a apontar para `/sobre-o-app` |
| `mobile/app/sobre.jsx` | `Voltar` passa a apontar para `/sobre-o-app` |
| `mobile/app/(tabs)/conta.jsx` | removido |
| `mobile/app/(tabs)/_layout.jsx` | remove a `Tabs.Screen` de `conta` e o import de `useQueroIr` que dependia do aviso |
| `mobile/lib/avisoSaida.js` | `apagarOrigem` sai junto com a 010 |

## Firestore

| Coleção | Leitura | Escrita | Índice / query |
|---|---|---|---|
| `users` | o próprio uid | nenhuma | doc id |

`role` é lido para decidir se o bloco administrativo aparece. `displayName` continua escrito pelo app, mas nenhuma tela o edita depois desta troca.

O bloco do admin não é um link para `/admin` dentro do app. O app não tem área administrativa, então o bloco explica que a mesa continua no site, como já fazia a tela de Conta.

## Cloudinary

Não.

## Ordem de entrega

1. `mobile/lib/sobreApp.js` com o texto provisório e o marcador do texto final.
2. `mobile/app/sobre-o-app.jsx`.
3. Header com `IconeInfo` e `IconeEngrenagem` fora do `Icones.jsx`.
4. Remover `conta.jsx` e a `Tabs.Screen` de `conta`; ajustar o `Voltar` de Galeria e Sobre.
5. Sync das specs 002 e 008 e do README do mapa.

## Riscos

| Risco | Mitigação |
|---|---|
| Texto final atrasado travar a entrega | o vetor nasce com texto provisário honesto e um comentário indicando o arquivo e o formato da troca |
| Página virar tela de marketing | uma coluna, sem imagem grande, sem número e sem botão de destaque |
| Papel vazar antes do perfil carregar | o bloco só renderiza com `role == admin`, e o perfil ausente não é admin |
| Rastro de rota morta | busca por `/conta` no bundle depois da remoção |

## Fora deste plan

Termos, política de privacidade longa, edição de conta, logout, tema escuro e qualquer ajuste de configuração.
