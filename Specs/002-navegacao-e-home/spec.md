# Spec: 002-navegacao-e-home Navegação e Home

- Status: `in-progress` (implementada; seções com dados reais aguardam Firebase configurado)
- Complexidade: `alta`
- Personas: `fiel`
- Depende de: [001-autenticacao](../001-autenticacao/); consome recortes de [003-noticias](../003-noticias/) e [004-cronograma](../004-cronograma/)

## Problema

Depois do login, o fiel precisa de um ponto de chegada que mostre o dia do evento, as notícias recentes e um caminho fixo para as outras páginas.

## Escopo

### Entra

- Shell autenticado com navegação persistente
- Destinos da nav: Home, Notícias, Cronograma, Benfeitor da Fé, Configuração
- Destinos extras (prompt: “outras que forem importantes”): Galeria, Sobre
- `/home` com:
  - seção de notícias (últimas publicadas, capa + título + data)
  - seção de cronograma do dia (espaços e horários da data corrente)
- Páginas-casca de `/galeria` e `/sobre` (conteúdo institucional mínimo; galeria completa pode listar álbuns depois)
- Estado vazio honesto quando não houver notícia ou quando a data estiver fora do evento

### Não entra

- CRUD de notícia ou programação (007)
- Detalhe completo da notícia (003 implementa; a Home só aponta)
- Programação completa por abas de espaço (004)
- Formulário Benfeitor (005)

## Fluxos

1. Fiel autenticado cai em `/home`.
2. Toca uma notícia → `/noticias/[id]`.
3. Toca “ver cronograma” ou um horário → `/cronograma` (com âncora do dia, se já existir na 004).
4. Nav leva a destinos reais; item ativo visível sem pílula.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rotas | `/home`, `/galeria`, `/sobre` |
| Coleções lidas | `news`, `programItems` (e/ou `programDays`), `siteContent` |
| Cloudinary | URLs de capa já gravadas na notícia |
| Papel | `fiel` ou `admin` autenticado |

## Dados

Esta spec **lê**, não cria contrato novo. Contratos oficiais: 003, 004 e `siteContent` (textos da Home/Sobre, criado na 007; até lá, copy estática fiel ao site).

Regra de recorte do dia:

- Se hoje está entre as datas da edição → mostrar itens de hoje.
- Se hoje é antes do evento → mostrar o primeiro dia + aviso “O encontro começa em…”.
- Se hoje é depois → mostrar o último dia + aviso “Programação da última jornada” sem tom de dashboard.

Datas da edição: [OPEN-QUESTIONS.md](../OPEN-QUESTIONS.md). Enquanto não houver decisão, usar constante documentada em `lib/event/edition.js`.

## Regras de negócio

- Nav sempre visível nas rotas do grupo `(app)`.
- Nenhum item de nav sem página.
- Home não inventa estatística (“milhares de famílias”).
- Link de Caravanas no Sobre ou rodapé da Home aponta para o site oficial, não abre produto interno.

## Critérios de aceite

- [ ] Os sete destinos da nav existem e abrem página real
- [ ] Home mostra bloco de notícias e bloco do dia
- [ ] Fora das datas do evento, o aviso existe e não é um número hero
- [ ] Sem sessão, `/home` redireciona (spec 001)
- [ ] Item ativo da nav não é uma pílula `rounded-full`

## Anti-slop

Home não é bento de três cards iguais, nem hero com gradiente e CTA órfão. Tipografia à esquerda, foto real se houver, seções empilhadas como um jornal do evento.

## Referências

- Site: https://encontrodafamiliacatolica.com.br/
- Programação: https://encontrodafamiliacatolica.com.br/programacao/
