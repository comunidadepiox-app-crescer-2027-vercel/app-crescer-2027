# Spec: 007-admin-cms Área administrativa

- Status: `in-progress` (implementada; validação aguarda Firebase, Cloudinary e a promoção manual do primeiro admin)
- Complexidade: `alta`
- Personas: `admin`
- Depende de: [001-autenticacao](../001-autenticacao/), [003-noticias](../003-noticias/), [004-cronograma](../004-cronograma/), [005-benfeitor-da-fe](../005-benfeitor-da-fe/)

## Problema

A equipe de comunicação precisa publicar notícias, ajustar a programação e ver os leads do Benfeitor sem abrir o console do Firebase.

## Escopo

### Entra

- Grupo `/admin` protegido por `role == admin`
- Login simples em `/admin` (e-mail pré-preenchido `admin@crecer.com`, senha digitada; sem Google e sem cadastro nesta tela)
- `/admin` painel com atalhos (notícias, cronograma, destaques, leads)
- CRUD de `news` (rascunho/publicar, capa Cloudinary)
- CRUD de `programItems` (abas só dos dias da edição; lista não depende de índice composto)
- Edição de `siteContent` (textos/destaques da Home e Sobre)
- Lista de `benefactorLeads` e mudança de `status`
- Fiel que abrir `/admin` vê recusa (sem vazar dados); atalho para voltar ao app

### Não entra

- Editor WYSIWYG complexo
- Gestão de usuários além de ver o próprio papel
- Promoção self-serve para admin (o primeiro admin nasce pela decisão de OPEN-QUESTIONS)
- Media library completa; upload pontual da capa

## Fluxos

1. Admin abre `/admin` no navegador (não no app nativo). Sem sessão, vê login só e-mail/senha, com e-mail pré-preenchido `admin@crecer.com`. Entra e cai na mesa.
2. Cria notícia, envia capa ao Cloudinary, publica.
3. Cria ou edita item de programação.
4. Marca lead como `contatado`.
5. Fiel autenticado em `/admin` vê recusa (não vê dados). Sem sessão, não é redirecionado para `/`; permanece no login da mesa.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rotas | `/admin`, `/admin/noticias`, `/admin/noticias/[id]`, `/admin/cronograma`, `/admin/destaques`, `/admin/leads` |
| Coleções | `news`, `programItems`, `siteContent`, `benefactorLeads`, `users` (leitura do próprio role) |
| Cloudinary | `news/`, opcional `site/` |
| Papel | `admin` |

## Dados

Contratos já definidos nas specs 003, 004 e 005. `siteContent/{key}`:

| Campo | Tipo | Nota |
|---|---|---|
| `title` | string | |
| `body` | string | |
| `updatedAt` | timestamp | |
| `updatedBy` | string | uid |

Chaves iniciais: `home`, `about`, `benfeitor` (se a campanha deixar de ser só estática).

## Regras de negócio

- Toda escrita editorial exige `role == admin` nas rules (não só na UI).
- O e-mail da mesa (`admin@crecer.com`) é só um atalho de digitação. A conta nasce no Firebase Auth; o papel `admin` continua sendo definido à mão no documento `users/{uid}`.
- Login da mesa não cria conta e não promove ninguém.
- Publicar notícia preenche `publishedAt` se ainda vazio.
- Lead: admin não edita CPF/e-mail; só `status`.
- Upload Cloudinary usa unsigned preset **restrito** ou signed no server. Preferir signed via Route Handler se houver `CLOUDINARY_API_SECRET`; nunca commitar o secret.

## Critérios de aceite

- [ ] Fiel não lê nem escreve coleções admin
- [ ] Admin publica notícia visível em `/noticias`
- [ ] Admin cria item visível em `/cronograma` e na Home do dia
- [ ] Admin lista leads sem export público
- [ ] Capa aparece via Cloudinary
- [ ] UI admin sóbria, sem dashboard de métricas inventadas

## Anti-slop

Sem gráficos vazios, sem “insights”, sem números hero de quantos fiéis. É mesa de trabalho: listas e formulários.

## Referências

- Specs 003, 004, 005
- OPEN-QUESTIONS: promoção do primeiro admin
