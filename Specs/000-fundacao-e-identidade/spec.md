# Spec: 000-fundacao-e-identidade Fundação e identidade

- Status: `validated`
- Complexidade: `alta`
- Personas: equipe de desenvolvimento (nenhuma tela de fiel/admin ainda)
- Depende de: PDFs/print oficiais no repositório; contas Firebase e Cloudinary listadas em [OPEN-QUESTIONS.md](../OPEN-QUESTIONS.md)

## Problema

O repositório está vazio. Sem scaffold, tokens visuais e layout-base, qualquer tela nasceria sem a identidade do Crescer e quebraria o SDD.

## Escopo

### Entra

- App Next.js (App Router) em JavaScript/JSX
- Tailwind CSS com CSS variables dos tokens extraídos
- Fonte oficial do site do evento, self-host ou CDN com licença registrada em [DESIGN.md](../DESIGN.md)
- Layout-base (shell) sem navegação de produto: tipografia, cores, ritmo, container
- Estrutura inicial de pastas `app/`, `lib/`, `public/`
- Arquivo de ambiente de exemplo (somente chaves públicas Firebase / Cloudinary cloud name)
- Atualização de [DESIGN.md](../DESIGN.md) com hex, família e pesos reais

### Não entra

- Telas de login, Home, notícias, cronograma, Benfeitor, configuração ou admin
- Regras Firestore de produto
- Conteúdo editorial
- Componentes de nav do produto

## Fluxos

1. Inspecionar PDFs, print do Instagram e CSS do site oficial.
2. Registrar tokens em `DESIGN.md`.
3. Criar o app Next.js e aplicar tokens no CSS global.
4. Renderizar uma página técnica temporária só para validar tipo, cor e ritmo. Essa página some na spec 001.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota App Router | `/` (placeholder técnico até a spec 001) |
| Coleção Firestore | nenhuma |
| Pasta Cloudinary | nenhuma ainda |
| Papel necessário | nenhum |

## Dados

Nenhum documento de produto.

## Regras de negócio

- Não usar brandbook do Instituto Crescer.
- Não implementar feature de produto nesta spec.
- Tokens só entram no CSS depois de extraídos das referências oficiais, nunca inventados.

## Critérios de aceite

- [ ] `package.json` com Next.js App Router, React e Tailwind; arquivos em `.js` / `.jsx`
- [ ] [DESIGN.md](../DESIGN.md) preenchido com família, pesos, hex e origem da fonte
- [ ] CSS global usa variáveis `--crescer-*` (sem gradiente, sem fonte genérica)
- [ ] Página técnica mostra título, corpo, link e botão com a identidade extraída
- [ ] Nenhum travessão, pílula ou hero numérico nessa página
- [ ] `.env.example` existe; nenhum secret de servidor commitado

## Anti-slop

A fundação não pode nascer com Inter, fundo em mesh, card de vidro ou botão `rounded-full`. Se parecer template de IA, a spec falhou.

## Referências

- Specs irmãs: todas as demais dependem desta
- Site oficial: https://encontrodafamiliacatolica.com.br/
- Benfeitor: https://benfeitordafe.comunidadepiox.org.br/benfeitordafe
