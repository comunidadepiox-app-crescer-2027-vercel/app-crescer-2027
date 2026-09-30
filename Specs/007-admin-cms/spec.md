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
- Login simples em `/admin` (e-mail pré-preenchido `crescer-admin@crescer.app`, senha digitada; sem Google e sem cadastro nesta tela)
- O app do fiel usa Anonymous Auth separado e nunca concede acesso ao CMS
- `/admin` com barra lateral roxa: Início, Notícias, Cronograma, Testemunhos e Colabore. Item ativo marcado em dourado
- Início da mesa com o trabalho real: rascunho de notícia mais recente ou nada por publicar, e programação do dia do recorte. Se a leitura falhar, a faixa permanece e a linha de estado some
- CRUD de `news` com editor TipTap: folha de escrita (título em slab, barra agrupada por ícones, menu na seleção, menu no parágrafo vazio, recuo por botão e por Tab, colar ou soltar imagem), coluna com autor, capa e publicação, e pré-visualização antes de publicar
- CRUD de `programItems` (abas só dos dias da edição; lista não depende de índice composto)
- Aviso push quando a programação publicada do dia do recorte muda (spec 004 e 008)
- Fiel que abrir `/admin` vê recusa (sem vazar dados) e pode sair
- `/` redireciona para `/admin`. O site não tem as telas do fiel
- `/admin/doacao` grava o percentual da oferta do app, ver [014](../014-doacao/spec.md)

### Não entra

- Gestão de usuários além de ver o próprio papel
- Promoção self-serve para admin (o primeiro admin nasce pela decisão de OPEN-QUESTIONS)
- Media library completa; upload pontual (capa, autor, imagem e vídeo do texto)
- A fila de testemunhos é da spec 013. Aqui entram só a rota da mesa e a faixa do início
- Destaques e Benfeitores no menu da mesa (as rotas `/admin/destaques` e `/admin/leads` continuam no código, fora da navegação)

## Fluxos

1. Admin abre `/admin` no navegador (não no app nativo). Sem sessão, vê login só e-mail/senha, com e-mail pré-preenchido `crescer-admin@crescer.app`. Entra e cai na mesa.
2. Cria notícia na folha do editor. Formata pela barra ou pelo menu da seleção, insere imagem colando ou soltando no texto, envia capa e autor, pré-visualiza e publica.
3. Cria ou edita item de programação. Se a mudança publicada for do dia do recorte, a mesa dispara o aviso.
4. Fiel autenticado em `/admin` vê recusa (não vê dados) e sai pela própria tela. Sem sessão, permanece no login da mesa. Quem abre `/` cai em `/admin`.
5. Admin abre Colabore na barra e grava o percentual da oferta, ver spec 014.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rotas da mesa | `/admin`, `/admin/noticias`, `/admin/noticias/[id]`, `/admin/cronograma`, `/admin/testemunhos`, `/admin/doacao` |
| Rotas fora do menu | `/admin/destaques`, `/admin/leads` |
| Coleções | `news`, `programItems`, `deviceTokens`, `siteContent`, `benefactorLeads`, `testimonials`, `users` (leitura do próprio role) |
| Cloudinary | `news/`, `authors/` |
| Papel | `admin` |

## Dados

Contratos já definidos nas specs 003, 004 e 005. `siteContent/{key}`:

| Campo | Tipo | Nota |
|---|---|---|
| `title` | string | |
| `body` | string | |
| `updatedAt` | timestamp | |
| `updatedBy` | string | uid |

Chaves iniciais: `home`, `about`, `benfeitor` (se a campanha deixar de ser só estática), `doacao` (percentual da oferta, spec 014).

## Regras de negócio

- Toda escrita editorial exige `role == admin` nas rules (não só na UI).
- O e-mail da mesa (`crescer-admin@crescer.app`) é só um atalho de digitação. A senha fica no Firebase Auth, nunca no repositório. O papel `admin` continua sendo definido à mão no documento `users/{uid}`, antes do primeiro login (senão o client cria `role: fiel`).
- Login da mesa não cria conta e não promove ninguém.
- Publicar notícia preenche `publishedAt` se ainda vazio.
- Lead: admin não edita CPF/e-mail; só `status`.
- Upload Cloudinary usa unsigned preset **restrito** ou signed no server. Preferir signed via Route Handler se houver `CLOUDINARY_API_SECRET`; nunca commitar o secret.
- O editor só grava HTML já aceito pelo app: parágrafo, título, lista, citação, link, cor, alinhamento, recuo, imagem, vídeo e botão. Tabela, destaque e código não entram.
- O início da mesa não inventa métrica. A linha de cada faixa sai da coleção correspondente.

## Critérios de aceite

- [ ] Fiel não lê nem escreve coleções admin
- [ ] Admin publica notícia visível no app nativo
- [ ] Admin cria item visível na agenda e na Home do app
- [ ] Admin lista leads sem export público
- [ ] Capa aparece via Cloudinary
- [ ] No editor, a seleção abre o menu de formato, o parágrafo vazio oferece imagem, vídeo, botão e título, colar imagem insere no texto, e Tab não tira o foco
- [ ] O início mostra o estado real de notícias e cronograma, sem número hero nem gráfico
- [ ] UI admin sóbria, sem dashboard de métricas inventadas
- [ ] Colabore aparece no menu da mesa e abre `/admin/doacao`

## Anti-slop

Sem gráficos vazios, sem “insights”, sem números hero de quantos fiéis. É mesa de trabalho: listas e formulários.

## Referências

- Specs 003, 004, 005
- OPEN-QUESTIONS: promoção do primeiro admin
