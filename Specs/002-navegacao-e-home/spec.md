# Spec: 002-navegacao-e-home Navegação e Home

- Status: `in-progress` (implementada; seções com dados reais aguardam Firebase configurado)
- Complexidade: `alta`
- Personas: `fiel`
- Depende de: [001-autenticacao](../001-autenticacao/); consome recortes de [003-noticias](../003-noticias/) e [004-cronograma](../004-cronograma/)

> **Superfície web retirada.** O site Next.js é só a mesa administrativa (`/admin`). Home e navegação do fiel desta spec vivem no app Expo, spec [008](../008-app-react-native/spec.md).

## Problema

Depois do login, o fiel precisa de um ponto de chegada que mostre o dia do evento, as notícias recentes e um caminho fixo para as outras páginas.

## Escopo

### Entra

- Shell autenticado com navegação persistente
- Barra inferior: Home, Notícias, círculo de menu, Agenda, Benfeitor da Fé
- Conta fora da barra: engrenagem no header, à direita de INSCREVA-SE, abre a tela de Conta
- Folha do círculo: Santo Terço, Voluntário, Fornecedor, Spotify. Só ícone e rótulo; sem rota nesta entrega
- Destinos extras (prompt: “outras que forem importantes”): Galeria, Sobre
- `/home` com:
  - seção de notícias (até 4 publicadas, capa + título + data; escuta ao vivo)
  - seção de cronograma do dia do recorte (todos os espaços e horários daquela data; escuta ao vivo)
- Páginas-casca de `/galeria` e `/sobre` (conteúdo institucional mínimo; galeria completa pode listar álbuns depois)
- Estado vazio honesto quando não houver notícia ou quando a data estiver fora do evento

### Não entra

- CRUD de notícia ou programação (007)
- Detalhe completo da notícia (003 implementa; a Home só aponta)
- Programação completa por abas de espaço (004)
- Formulário Benfeitor (005)
- Destino de Santo Terço, Voluntário, Fornecedor e Spotify

## Fluxos

1. Fiel autenticado cai em `/home`.
2. Toca uma notícia → `/noticias/[id]`.
3. Toca “ver cronograma” ou um horário → `/cronograma` (com âncora do dia, se já existir na 004).
4. A barra leva a Home, Notícias, Agenda e Benfeitor. O item ativo fica dourado, sem pílula. Na Conta, aberta pela engrenagem, nenhuma aba fica ativa.
5. O círculo abre a folha por cima da tela. Fecha ao tocar de novo no círculo, no fundo escuro ou ao arrastar para baixo. Os quatro atalhos não navegam.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rotas | `/home`, `/galeria`, `/sobre` |
| Coleções lidas | `news`, `programItems` (e/ou `programDays`), `siteContent` |
| Cloudinary | URLs de capa já gravadas na notícia |
| Papel | `fiel` ou `admin` autenticado |

## Dados

Esta spec **lê**, não cria contrato novo. Contratos oficiais: 003, 004 e `siteContent` (textos da Home/Sobre, criado na 007; até lá, copy estática fiel ao site).

Regra de recorte do dia (calendário civil em `America/Recife`, meia-noite a meia-noite):

- Antes de 5/02/2027: Home mostra a programação do dia **5** (primeiro dia) + aviso de que o encontro ainda não começou.
- No dia 5: continua o dia 5 até o dia acabar.
- No dia 6: passa a ser o dia 6; o mesmo para 7, 8 e 9.
- Depois de 9/02/2027: mostra o último dia + aviso da última jornada.

A Home lista até 4 notícias publicadas (as mais recentes) e **toda** a programação do dia do recorte. Home, Notícias e Cronograma escutam o Firestore (`onSnapshot`): o que o admin publica aparece sem recarregar o app.

Datas da edição: constante em `lib/event/edition.js` (5 a 9 de fevereiro de 2027).

## Regras de negócio

- Nav sempre visível nas rotas do grupo `(app)`.
- Nenhum item da barra sem página. Os quatro atalhos da folha não são botão enquanto não tiverem destino.
- Home não inventa estatística (“milhares de famílias”).
- Link de Caravanas no Sobre ou rodapé da Home aponta para o site oficial, não abre produto interno.

## Critérios de aceite

- [ ] Os sete destinos da nav existem e abrem página real
- [ ] Home mostra bloco de notícias e bloco do dia
- [ ] Fora das datas do evento, o aviso existe e não é um número hero
- [ ] Sem sessão, `/home` redireciona (spec 001)
- [ ] Item ativo da barra é dourado, sem pílula. O círculo laranja do centro é o controle do menu
- [ ] A barra mostra Home, Notícias, Agenda e Benfeitor, com o círculo no meio
- [ ] A engrenagem, à direita de INSCREVA-SE, abre Conta e nenhuma aba fica dourada
- [ ] A folha lista Santo Terço, Voluntário, Fornecedor e Spotify, sem navegar, e fecha no círculo, no fundo ou no arraste

## Anti-slop

Home não é bento de três cards iguais, nem hero com gradiente e CTA órfão. Tipografia à esquerda, foto real se houver, seções empilhadas como um jornal do evento.

## Referências

- Site: https://encontrodafamiliacatolica.com.br/
- Programação: https://encontrodafamiliacatolica.com.br/programacao/
