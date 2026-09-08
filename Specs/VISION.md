# Visão do produto — WebApp Crescer

## O que é

WebApp do **Crescer — Encontro da Família Católica**, encontro anual de famílias promovido pela Comunidade de São Pio X em Campina Grande/PB.

O app é o companheiro de quem vai ao encontro: entrar com a própria conta, ver o que acontece hoje, ler as notícias da comunidade e apoiar a obra como Benfeitor da Fé.

## Para quem

| Persona | Precisa |
|---|---|
| Fiel / família no evento | Login simples, cronograma do dia, notícias, caminho claro para apoiar |
| Equipe de comunicação (admin) | Publicar notícia, ajustar programação, atualizar destaques da Home sem deploy |
| Comunidade (institucional) | Voz fiel ao site oficial, sem cara de produto genérico, dados pessoais tratados com LGPD |

## Promessa

Uma família abre o app no dia do encontro e, em poucos toques, sabe o que está acontecendo agora, o que vem a seguir e como acompanhar a comunidade depois.

## Fora desta visão

- Ingressos, credenciamento ou pagamento de inscrição (o encontro não é tratado como e-commerce aqui)
- Gateway de doação (boleto/Pix do Benfeitor acontece no fluxo oficial, após contato humano)
- Rede social, chat ou feed de comentários
- App nativo: em andamento na spec `008` (Expo em `mobile/`). CMS admin permanece na web.
- Gestão de caravanas (o site oficial já faz isso; o app só aponta o link)
- CMS genérico para páginas arbitrárias

## Stack

| Camada | Escolha | Motivo |
|---|---|---|
| UI | Next.js App Router + JSX | App web, rotas por pasta, JavaScript como decidido |
| Estilo | Tailwind CSS | Tokens do Crescer em CSS variables, sem UI kit genérico |
| Auth | Firebase Auth | E-mail/senha e Google no mesmo projeto |
| Dados | Cloud Firestore | Conteúdo editorial e leads sem backend próprio nesta fase |
| Mídia | Cloudinary | Capas de notícia e fotos de galeria |

## Navegação do produto

Área autenticada:

- `/` — Início (login e cadastro). Sem sessão, o fiel permanece aqui.
- `/home` — Notícias em destaque + cronograma do dia
- `/noticias` e `/noticias/[id]`
- `/cronograma`
- `/benfeitor`
- `/configuracao`
- `/galeria`
- `/sobre`

Área admin (role `admin`), no site, não no app nativo:

- `/admin` — sem sessão mostra login simples (`admin@crecer.com` pré-preenchido)
- `/admin/noticias`
- `/admin/cronograma`
- `/admin/destaques`
- `/admin/leads`

## Glossário

| Termo | Significado neste projeto |
|---|---|
| Fiel | Usuário autenticado sem permissão de publicação |
| Admin | Usuário com `role: admin` no documento `users` |
| Espaço | Palco ou programação paralela (Palco Principal, Palco Musical, Autógrafos, Palestras Formativas, Espaço para Crianças, Espaço para Jovens) |
| Item de programação | Um horário em um espaço, com título, convidado e local |
| Lead Benfeitor | Cadastro de interesse; não é pagamento |
| Edição | Ano/número do encontro (ex.: 30º Crescer). A edição oficial do app ainda está em [OPEN-QUESTIONS.md](OPEN-QUESTIONS.md) |

## Referências oficiais

- Site do evento: https://encontrodafamiliacatolica.com.br/
- Programação: https://encontrodafamiliacatolica.com.br/programacao/
- Benfeitor da Fé: https://benfeitordafe.comunidadepiox.org.br/benfeitordafe
- Comunidade: https://comunidadepiox.org.br/

Mantenedora: Associação Carismática Católica São Pio X, Rua Afonso Pena, 61, Centro, Campina Grande/PB. CNPJ 02.868.732/0001-23.
