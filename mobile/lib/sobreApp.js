// Texto da página de informação do app.
//
// ESTE É O ARQUIVO A TROCAR quando a Comunidade de São Pio X entregar o texto
// final. Troque o conteúdo dos vetores abaixo e nada mais muda: a tela
// percorre TEXTO_SOBRE_APP e depois AVISO_DADOS, sem string solta no
// componente.
//
// Regras de escrita, das specs 005, 006 e 013:
// - sem travessão (—) na copy
// - sem número hero, sem emblema de plano e sem promessa de pagamento
// - texto corrido, com ponto final, na voz da comunidade

// Texto provisório, escrito para o app ser honesto enquanto o texto final não
// chega. Nada aqui promete uma função que o app não tem.
export const TEXTO_SOBRE_APP = [
  "O Crescer é o Encontro da Família Católica, promovido pela Comunidade de São Pio X em Campina Grande. Este aplicativo acompanha o encontro: as notícias, a programação de cada dia, a campanha do Benfeitor da Fé e o espaço para deixar o seu testemunho.",
  "O aplicativo é gratuito e não vende nada. Nenhuma cobrança acontece aqui, e nenhuma informação sua é vendida ou compartilhada com terceiros.",
  "Quem organiza o encontro é a Comunidade de São Pio X, com o apoio da Diocese de Campina Grande e das caravanas que trazem famílias de todo o Brasil.",
];

// Aviso curto de uso dos dados, no mesmo formato do aviso do formulário de
// Testemunhos.
export const AVISO_DADOS = [
  "Este aplicativo guarda uma sessão anônima para o Crescer reconhecer o aparelho e, se você marcar Avise-me em algum item da programação, esse lembrete com o nome do item. Se você escrever um testemunho, o texto e o nome que você digitar também ficam guardados.",
  "Nada disso é vendido nem compartilhado fora da Comunidade de São Pio X. Para pedir a apagar o que foi gravado, fale com a comunidade pelos contatos da página Sobre o Crescer.",
];

// Bloco administrativo. Só aparece para quem tem `role: admin` na mesa, e
// explica que a mesa continua no site, porque o app não tem área de
// administração.
export const TEXTO_ADMIN =
  "A mesa de trabalho fica no site do Crescer, com login de administrador. " +
  "É de lá que a equipe publica as notícias e a programação.";
