# Spec: 016-fale-conosco Fale Conosco

- Status: `in-progress`
- Complexidade: `media`
- Personas: `fiel`
- Depende de: [008-app-react-native](../008-app-react-native/), [002-navegacao-e-home](../002-navegacao-e-home/)

## Problema

Hoje o fiel que precisa falar com a Comunidade São Pio X não tem caminho dentro do app. A página Sobre o Crescer citava telefone, e-mail e WhatsApp como texto morto, sem ação, e em 07/10/2026 essa página ficou sem atalho na navegação. O contato oficial é o que a pessoa procura quando algo dá errado com a inscrição, a programming ou a chegada no evento, então ele precisa estar a um toque de distância e ser acionável.

## Escopo

### Entra

- Rota autenticada `/fale-conosco`, aberta por um novo atalho **Fale Conosco** na folha central
- Os três canais oficiais da Comunidade São Pio X: telefone, e-mail e WhatsApp
- Toque no telefone que inicia a chamada pelo discador do aparelho
- Toque no e-mail que abre o aplicativo de e-mail com o destinatário preenchido
- Toque no WhatsApp que abre o app do WhatsApp já na conversa com o contato
- Alternativa honesta quando o WhatsApp não está instalado no aparelho
- Aviso curto e nomeado quando o aparelho recusa uma das ações
- Cópia dos contatos em `mobile/lib/contatos.js`, único lugar a editar

### Não entra

- Formulário de contato, nome, assunto ou mensagem enviada pelo app
- Você talking with the paroquia, curia ou diocesan
- WhatsApp com mensagem pronta, arquivo ou catálogo
- Número novo, qualquer número fora dos três validados e qualquer endereço de e-mail não oficial
- Card com foto, mapa, geolocalização ou horário de atendimento
- Firestore, novos contratos de dados e CMS

## Fluxos

1. Fiel abre o menu central e toca em Fale Conosco.
2. A folha fecha e `/fale-conosco` abre.
3. Toca no telefone e o discador do aparelho abre com o número da Comunidade.
4. Toca no e-mail e o aplicativo de e-mail abre com `contato@piox.org.br` preenchido.
5. Toca no WhatsApp e o WhatsApp abre na conversa com o número oficial.
6. Sem WhatsApp instalado, o toque abre `wa.me` no navegador, que oferece a conversa na web e convida a instalar o aplicativo.
7. Se o aparelho recusar qualquer uma das ações, o app avisa qual foi, em vez de falhar em silêncio.

## Superfície do produto

| Tipo | Identificador |
|---|---|
| Rota Expo Router | `/fale-conosco` |
| Ícone do atalho | `MessageCircle` do `lucide-react-native` |
| Ícones da tela | `Phone`, `Mail` e `MessageCircle` do `lucide-react-native` |
| Coleções Firestore | nenhuma |
| Papel necessário | `fiel` autenticado |

## Dados

Nenhum contrato de dado. A spec **não lê nem escreve** no Firestore.

Os contatos são uma constante local em `mobile/lib/contatos.js`, validada pela Comunidade de São Pio X:

| Canal | Valor exibido | Valor da ação |
|---|---|---|
| Telefone | (83) 3341-7017 | `tel:+558333417017` |
| E-mail | contato@piox.org.br | `mailto:contato@piox.org.br` |
| WhatsApp | (83) 98897-7017 | `whatsapp://send?phone=5583988977017`, com `https://wa.me/5583988977017` de reserva |

Os números são os mesmos três que já constavam na página Sobre o Crescer. O telefone é o fixo da Community, o e-mail é o institucional e o WhatsApp é o número de atendimento confirmado pela comunidade em 07/10/2026. Não entra nenhum outro.

O WhatsApp é guardado no formato internacional, só com dígitos: `5583988977017`. Esse é o formato que o `wa.me` e o `whatsapp://` exigem, e o parêntese do plano não faz parte do endereço.

## Regras de negócio

- A página exige sessão, como as demais telas internas, e redireciona para `/` sem ela.
- Telefone, e-mail e WhatsApp aparecem sempre, mesmo no aparelho sem os aplicativos correspondentes. O canal não some, só a ação muda.
- O toque no WhatsApp testa antes se o aplicativo está instalado. Instalado, abre o app direto na conversa. Ausente, abre a conversa na web, que é o caminho que ainda funciona. Em nenhum dos dois casos o toque fica sem efeito.
- O toque em qualquer canal que o aparelho recuse mostra um aviso com o nome do canal, para a pessoa saber qual ação falhou.
- Todos os três canais usam o número e o endereço exatos desta spec. Nenhum destino é derivado, inferido ou reaproveitado de outro.
- A página não pede dado nenhum do fiel. Abrir o WhatsApp ou o discador não grava telefone nem e-mail em lugar nenhum, porque o app não os recebe.
- A volta leva para `/home`, no mesmo cabeçalho laranja das demais páginas.
- Identidade: fundo claro, uma coluna, título em caixa alta, linhas com ícone em quadrado creme, sem card de vidro, sem gradiente e sem pílula.

## Critérios de aceite

- [x] Fale Conosco aparece na folha central e abre `/fale-conosco`
- [x] A tela abre só com sessão e volta para `/home`
- [x] Telefone, e-mail e WhatsApp aparecem legíveis, em corpo de 16 px ou mais
- [x] Toque no telefone abre o discador com o número certo
- [x] Toque no e-mail abre o aplicativo de e-mail com o destinatário preenchido
- [x] Toque no WhatsApp abre o aplicativo na conversa e cai na web quando não há aplicativo
- [x] Nenhum botão sem efeito: quando o aparelho recusa, avisa qual canal falhou
- [x] A copy não usa travessão e não promete resposta nem horário de atendimento
- [x] A folha central fecha as linhas com linhas cheias de três atalhos

## Anti-slop

Não é página de suporte com chat embutido, número gigante de call center, formulário de atendimento nem cartão social com foto de ninguém. É uma folha de papel: três linhas, três ícones, três toques. O telefone aparece como telefone, do mesmo tamanho do resto do texto.

## Referências

- Specs irmãs: 002 (folha central), 008 (rotas do app), 006 (Sobre o app)
- [DESIGN.md](../DESIGN.md)
- Contatos validados pela Comunidade São Pio X em 07/10/2026