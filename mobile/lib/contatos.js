// Canais oficiais de contato da Comunidade de São Pio X.
//
// ESTE É O ARQUIVO A TROCAR quando a comunidade confirmar um número ou um
// e-mail diferentes. Troque só o valor dentro do canal e a tela inteira
// acompanha, porque nenhum dígito ou endereço se repete no componente.
//
// Regras de escrita, da spec 016:
// - só entram canais validados pela Comunidade São Pio X
// - o valor exibido é o que a pessoa lê; a URL é o que o aparelho entende
// - o WhatsApp e o telefone usam só dígitos no formato internacional, porque
//   o esquema `whatsapp://` e o `tel:` não entendem parêntese nem espaço
// - a tela não recebe dado do fiel ao abrir qualquer um desses destinos

export const CONTATOS = [
  {
    id: "telefone",
    rotulo: "Telefone",
    valor: "(83) 3341-7017",
    // discador do aparelho. `canOpenURL` sempre pede antes de abrir.
    url: "tel:+558333417017",
    aviso: "Este aparelho não conseguiu abrir o discador. Você pode ligar para (83) 3341-7017.",
  },
  {
    id: "email",
    rotulo: "E-mail",
    valor: "contato@piox.org.br",
    // aplicativo de e-mail com o destinatário já preenchido
    url: "mailto:contato@piox.org.br",
    aviso: "Este aparelho não conseguiu abrir o aplicativo de e-mail. O endereço é contato@piox.org.br.",
  },
  {
    id: "whatsapp",
    rotulo: "WhatsApp",
    valor: "(83) 98897-7017",
    // aplicativo do WhatsApp, já na conversa com o contato oficial
    url: "whatsapp://send?phone=5583988977017",
    // reserva para o aparelho sem o WhatsApp instalado: a conversa na web
    // funciona no navegador e é o caminho que sobra
    reserva: "https://wa.me/5583988977017",
    aviso: "Este aparelho não conseguiu abrir o WhatsApp. O número da comunidade é (83) 98897-7017.",
  },
];

export function contatoPorId(id) {
  return CONTATOS.find((canal) => canal.id === id);
}