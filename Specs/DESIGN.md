# Identidade visual — WebApp Crescer

Este arquivo é a fonte da verdade visual do app. Tokens extraídos em 04/09/2026 de três fontes: o CSS ao vivo de [encontrodafamiliacatolica.com.br](https://encontrodafamiliacatolica.com.br/), os PDFs `Site Crescer.pdf` e `Site Ben Feitor da Fé.pdf` (páginas renderizadas e cores amostradas por região) e os assets oficiais baixados do próprio site.

## Assets oficiais (`public/brand/`)

| Arquivo | O que é | Uso no app |
|---|---|---|
| `logo-crescer-branca.png` | Logo horizontal branca (coração + wordmark) | Header laranja |
| `simbolo-crescer.png` | Coração dourado de mãos (favicon oficial, 270px) | Rodapé, notícia sem capa |
| `banner-elemento.webp` | Arte 30 anos com Sagrada Família, pomba e coração low-poly | Reserva para destaques |
| `banner-fundo.webp` | Fundo do banner do site | Referência de cor |
| `foto-evento.webp` | Foto real do encontro (velas acesas) | Hero da Home |
| `benfeitor-meta.jpg` | Arte da landing do Benfeitor da Fé | Referência de cor e lockup |
| `splash-crescer.mp4` | Vídeo da logo se montando (Jitter, recorte quadrado, fundo branco trocado pelo roxo `#3a1075`) | Splash de abertura |
| `wordmark-crescer-branca.png` | Lettering "Crescer" + subtítulo recortado da logo oficial branca | Splash (sobre roxo) |

O símbolo também existe em vetor: `components/brand/SimboloCrescer.jsx`, redesenhado peça por peça (usado na tela de login; a splash usa o vídeo).

## Leitura de design

App de evento católico institucional para famílias. Linguagem do site oficial do Crescer: editorial, fotográfica, de comunidade. Não é SaaS, não é startup, não é landing genérica de IA.

## Fontes (extraídas do site oficial)

| Papel | Família | Pesos | Origem |
|---|---|---|---|
| Títulos, nav, botões | **Geometric Slabserif 703 Condensed** | 500, 700 | Self-host, `public/fonts/geometric-slabserif-{500,700}.woff2`, baixadas do próprio site do evento |
| Corpo e UI | **Outfit** | 400, 500, 600 | Google Fonts via `next/font/google` |
| Display decorativa (uso raríssimo) | **Arcane Nine** | 400 | Self-host, `public/fonts/arcane-nine-400.woff2` |

Observações do site:

- Títulos e botões aparecem em **caixa alta** com Geometric Slabserif.
- Corpo é Outfit 400/500 (o tema carrega Poppins mas quase não usa; **não** usar Poppins).
- Fallbacks: títulos → `"Segoe UI", Georgia, serif`; corpo → `system-ui, sans-serif`.
- Licença: arquivos servidos publicamente pelo site oficial do evento; uso no app do próprio evento. Registrado como aceito.

Proibido: Inter, Roboto, Poppins, Montserrat, Open Sans, Lato, Geist como voz da marca. Gabarito/DM Sans são do **Instituto Crescer** (outra organização), fora.

## Cores (amostradas dos PDFs renderizados + variáveis do CSS do site)

```css
--crescer-roxo: #3a1075;        /* roxo profundo: hero, rodapé, splash */
--crescer-roxo-botao: #310073;  /* roxo dos botões e títulos sobre claro */
--crescer-roxo-claro: #4c1d90;  /* facetas poligonais sobre roxo */
--crescer-laranja: #d68130;     /* laranja do header e seções de destaque */
--crescer-laranja-claro: #df9d5b; /* facetas poligonais sobre laranja */
--crescer-dourado: #f8d99b;     /* dourado do símbolo do coração */
--crescer-dourado-escuro: #c39a58;
--crescer-amarelo: #f4e77e;     /* realce de texto sobre roxo */
--crescer-fundo: #fcfcfc;
--crescer-superficie: #ffffff;
--crescer-texto: #111c2d;
--crescer-titulo: #310073;      /* títulos usam o roxo institucional */
--crescer-destaque: #d68130;    /* ações e acentos usam o laranja oficial */
--crescer-linha: #e0e0e0;
--crescer-creme: #fbf6ea;
--crescer-verde: #00a584;
--crescer-vermelho: #c02231;
```

Como os sites usam a paleta:

- **Header**: laranja `#d68130` com logo branca e botão roxo `#310073`.
- **Hero e rodapé**: roxo profundo `#3a1075` com padrão poligonal em traço claro (classes `.fundo-roxo-poligonal` e `.fundo-laranja-poligonal` no `globals.css`).
- **Seções de conteúdo**: brancas, títulos em roxo, caixa alta, slab.
- **CTAs**: laranja sobre roxo, roxo sobre laranja ou sobre branco.
- **Dourado**: exclusivo do símbolo do coração e de acentos pequenos (nav ativa).

Contraste conferido: branco sobre `#3a1075` e sobre `#310073` passa AA; branco sobre `#d68130` passa para texto grande/bold (botões e títulos slab, sempre caixa alta). `#d68130` sobre branco só com peso 600+ ou sublinhado.

## Componentes-base (padrões do site)

- Botão primário sobre claro: fundo laranja `--crescer-destaque` ou roxo `--crescer-roxo-botao`, texto branco, Geometric Slabserif 700 caixa alta, `border-radius: 10px` (**não** usar `rounded-full`).
- Botão secundário: borda `--crescer-roxo-botao`, texto `--crescer-titulo`, mesmo raio.
- Cartão: superfície branca, borda `--crescer-linha`, raio 14px em blocos grandes, sem sombra pesada.
- Grupo de programação: faixa de título em roxo `--crescer-roxo-botao` com texto branco.
- Splash de abertura: fundo roxo `#3a1075`, vídeo `splash-crescer.mp4` da logo se montando, wordmark branco surge perto do final; sai quando o vídeo termina e a sessão do Firebase resolve. Com `prefers-reduced-motion`, mostra o símbolo estático no lugar do vídeo.
- Navegação mobile: barra roxa fixa com ícones de linha (`components/nav/icones.jsx`), item ativo em dourado.

## Layout

- Texto alinhado à esquerda por padrão. Centro só em casos pontuais da marca (logo na tela de início).
- Hierarquia por tipo e peso, não por número enorme isolado.
- Fotografia real do encontro, não stock genérica.
- Nav persistente com destinos reais. Nenhum botão órfão.

## O que é cara de IA neste projeto (proibido)

- Travessão (`—`) em copy da interface. Preferir vírgula, ponto ou dois-pontos.
- Pílulas redondas, chips e badges em cápsula
- Blocos de texto centralizados como padrão de página
- Botões que não levam a lugar nenhum
- Fontes genéricas de template
- Números hero gigantes (estatística inflada)
- Gradientes em fundo, botão ou overlay
- Cards de vidro, mesh roxo, três colunas de feature iguais

## Tom de voz

Institucional e direto, no registro do site oficial. Sem slogan de startup. Sem travessão. Sem "jornada", "ecossistema" ou "experiência imersiva".

Exemplo aceitável: "Veja o que acontece hoje no Palco Principal."
