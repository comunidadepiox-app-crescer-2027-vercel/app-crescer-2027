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
| [002-navegacao-e-home](002-navegacao-e-home/) | Nav, Home, recorte do dia, notícias em destaque | Alta |
| [003-noticias](003-noticias/) | Lista e detalhe de notícias | Média |
| [004-cronograma](004-cronograma/) | Programação por dia e espaço | Alta |
| [005-benfeitor-da-fe](005-benfeitor-da-fe/) | Campanha e lead com LGPD | Alta |
| [006-configuracao](006-configuracao/) | Conta, perfil, sair | Média |
| [007-admin-cms](007-admin-cms/) | Publicação de conteúdo | Alta |
| [008-app-react-native](008-app-react-native/) | App do fiel em Expo/React Native (`mobile/`) | Alta |
| [009-anuncios](009-anuncios/) | Retirada: anúncios em pilha na Home do app | Média |
| [010-aviso-saida](010-aviso-saida/) | Aviso de saída com trânsito para quem marca Quero ir | Alta |

Ordem de implementação: `000` → `001` → `002` → (`003` e `004` em paralelo após a Home) → `005` → `006` → `007` → `008`.

A spec `007` pode avançar o plan em paralelo, mas o CMS só entra depois das coleções de notícias e cronograma existirem.

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
