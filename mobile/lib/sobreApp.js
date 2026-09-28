// Texto da página de informação do app.
//
// ESTE É O ARQUIVO A TROCAR quando a Comunidade de São Pio X entregar uma
// nova versão do texto. Troque o conteúdo dos vetores abaixo e nada mais
// muda: a tela percorre TEXTO_SOBRE_APP e depois AVISO_DADOS, sem string
// solta no componente.
//
// Regras de escrita, das specs 005, 006 e 013:
// - sem travessão em nenhum caractere da copy
// - sem número hero, sem emblema de plano e sem promessa de pagamento
// - texto corrido, com ponto final, na voz da comunidade

// Texto aprovado pela Comunidade de São Pio X em 28/09/2026.
export const TEXTO_SOBRE_APP = [
  "O aplicativo oficial do Crescer 2027 foi desenvolvido para auxiliar participantes, voluntários e demais envolvidos na organização e realização do evento, reunindo em um único ambiente as principais informações e acessos relacionados ao Crescer. O app funciona como um hub digital do evento, facilitando o acesso à programação, notícias, conteúdos, orientações, serviços e demais funcionalidades disponíveis, proporcionando uma experiência mais prática, organizada e integrada antes e durante o Crescer.",
];

// Aviso de uso dos dados, no mesmo formato do aviso do formulário de
// Testemunhos.
export const AVISO_DADOS = [
  "A Comunidade São Pio X adota medidas para preservar a privacidade e a segurança das informações utilizadas no aplicativo oficial do Crescer 2027. O app busca coletar e tratar apenas os dados estritamente necessários ao funcionamento de suas funcionalidades, em conformidade com a legislação aplicável, especialmente a Lei Geral de Proteção de Dados Pessoais (LGPD). Algumas funcionalidades podem direcionar o usuário para serviços e plataformas externas, que possuem políticas próprias de privacidade e tratamento de dados.",
];

// Bloco administrativo. Só aparece para quem tem `role: admin` na mesa, e
// explica que a mesa continua no site, porque o app não tem área de
// administração.
export const TEXTO_ADMIN =
  "A mesa de trabalho fica no site do Crescer, com login de administrador. " +
  "É de lá que a equipe publica as notícias e a programação.";
