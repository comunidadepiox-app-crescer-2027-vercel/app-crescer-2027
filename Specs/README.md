# Spec-Driven Development — Crescer

Este repositório usa **Spec-Driven Development (SDD)**. Nenhuma funcionalidade de média ou alta complexidade entra no código sem passar pelo fluxo abaixo.

O Crescer é o Encontro da Família Católica, organizado pela Comunidade de São Pio X em Campina Grande/PB. O app do fiel (Expo, `mobile/`) acompanha notícias, o cronograma e a campanha Benfeitor da Fé. O site Next.js é só a mesa administrativa.

## Fluxo obrigatório

```
Specification → Plan → Tasks → Implementation → Validation
```

| Etapa | Arquivo | Quando está pronto |
|---|---|---|
| Specification | `spec.md` | Problema, escopo, fluxos e aceite estão claros |
| Plan | `plan.md` | Rotas, coleções Firestore, arquivos e riscos definidos |
| Tasks | `tasks.md` | Checklist verificável, uma mudança testável por item |
| Implementation | código | Só depois das três etapas acima |
| Validation | `tasks.md` + aceite da spec | Cada task marcada só após verificação |

Status de uma spec: `draft` → `specified` → `planned` → `in-progress` → `validated`.

## Quando o fluxo é obrigatório

Use SDD completo quando a mudança for **média ou alta**:

- nova tela ou rota do App Router
- autenticação, papéis (`fiel` / `admin`) ou regras Firestore
- coleção nova ou contrato de dados alterado
- formulário com dado pessoal (LGPD)
- cronograma, notícias, Benfeitor da Fé, CMS
- identidade visual (fonte, cor, layout-base)

Pode ir direto ao código só se for **baixa** complexidade e **não** alterar contrato de dados, auth ou navegação: typo, espaçamento, copy pontual, correção visual isolada.

## Antes de implementar

1. Ler [VISION.md](VISION.md), [DESIGN.md](DESIGN.md) e [OPEN-QUESTIONS.md](OPEN-QUESTIONS.md).
2. Abrir a spec da funcionalidade em `Specs/NNN-slug/`.
3. Se a spec não existir, criá-la a partir de [Templates](Templates/) **antes** de escrever código.
4. Executar as tasks na ordem, uma de cada vez, verificando o critério de cada item.
5. Se o comportamento mudar, atualizar spec, plan e tasks na mesma entrega.

## Mapa das specs

| Pasta | Funcionalidade | Complexidade |
|---|---|---|
| [000-fundacao-e-identidade](000-fundacao-e-identidade/) | Scaffold, tokens visuais, layout-base | Alta |
| [001-autenticacao](001-autenticacao/) | Início, e-mail, Google, sessão, papéis | Alta |
| [002-navegacao-e-home](002-navegacao-e-home/) | Nav, Home, recorte do dia, notícias em destaque, header e folha central | Alta |
| [003-noticias](003-noticias/) | Lista e detalhe de notícias | Média |
| [004-cronograma](004-cronograma/) | Programação por dia e espaço | Alta |
| [005-benfeitor-da-fe](005-benfeitor-da-fe/) | Campanha no app, com envio do lead para o e-mail da comissão | Alta |
| [006-sobre-o-app](006-sobre-o-app/) | Página de informação sobre o app, sem configuração | Média |
| [007-admin-cms](007-admin-cms/) | Publicação de conteúdo | Alta |
| [008-app-react-native](008-app-react-native/) | App do fiel em Expo/React Native (`mobile/`) | Alta |
| [009-anuncios](009-anuncios/) | Retirada: anúncios em pilha na Home do app | Média |
| [010-avisos-programacao](010-avisos-programacao/) | Avise-me: contagem regressiva por push na programação, sem localização | Alta |
| [011-terco-restauracao-familias](011-terco-restauracao-familias/) | Terço da Restauração das Famílias no app | Média |
| [012-fornecedores](012-fornecedores/) | Página de fornecedores no app | Média |
| [013-testimunhos](013-testimunhos/) | Testemunho do fiel no app e fila de leitura na mesa | Alta |
| [014-doacao](014-doacao/) | Oferta pelo PIX no app e percentual na mesa | Média |
| [015-liturgia-diaria](015-liturgia-diaria/) | Liturgia do dia no app, buscada de API pública, no padrão do Terço | Média |

Ordem de implementação: `000` → `001` → `002` → (`003` e `004` em paralelo após a Home) → `005` → `006` → `007` → `008`.

A spec `007` pode avançar o plan em paralelo, mas o CMS só entra depois das coleções de notícias e cronograma existirem.

As specs `011`, `012`, `013`, `014` e `015` entram depois da `008`. A `013` escreve em coleção própria, com escrita só pelo Admin SDK, e por isso não depende de regra nova de leitura para o fiel. A `014` reusa `siteContent` da `007`. A `015` não usa Firestore: lê uma API pública de liturgia e reusa a barra de etapas extraída na `011`.

## Renomeações

| Antes | Agora | Motivo |
|---|---|---|
| `mobile/app/(tabs)/agenda.jsx` | `mobile/app/(tabs)/programacao.jsx` | A aba é Programação, o mesmo nome que a Home e a tela já usavam. Sem acento no arquivo: rota com acento vira acento na URL. O ícone de calendário continua o mesmo |
| `006-configuracao` | `006-sobre-o-app` | A tela de Configuração saiu do app. A spec cobre a página de informação que a substituiu |
| `010-aviso-saida` | `010-avisos-programacao` | Não há mais hora de sair nem trânsito. É contagem regressiva da programação |
| `mobile/app/(tabs)/benfeitor.jsx` | `mobile/_arquivo/benfeitor/BenfeitorScreen.jsx` | A campanha era do site da comunidade; a tela ficou arquivada de 28/09/2026 a 01/10/2026 |
| `mobile/lib/benfeitor.js` | `mobile/_arquivo/benfeitor/benfeitorLib.js` | Mesma razão da tela |
| `users/{uid}/queroIr` | `users/{uid}/lembretes` | A ação se chama Avise-me |
| `trafficAlerts` | `lembreteAvisos` | Guarda só quais avisos já saíram, sem rota nem hora de sair |
| `mobile/app/(tabs)/conta.jsx` | `mobile/app/sobre-o-app.jsx` | A rota da página de informação do app |

## Stack que as specs assumem

- Next.js App Router, JavaScript/JSX (sem TypeScript)
- Tailwind CSS
- Firebase Auth (e-mail/senha + Google) e Cloud Firestore
- Cloudinary para imagens
- Papéis: `fiel` e `admin`

## Convenções

- Conteúdo das specs em português.
- Slug da pasta em kebab-case: `005-benfeitor-da-fe`.
- Numeração com três dígitos, na ordem de dependência.
- Templates em [Templates/](Templates/) não se preenchem. Copia-se o modelo para a pasta da feature.
- Não confundir este evento com o Instituto Crescer (`crescer.org.br`). Fonte e cores vêm de [encontrodafamiliacatolica.com.br](https://encontrodafamiliacatolica.com.br/) e dos PDFs oficiais do evento.
