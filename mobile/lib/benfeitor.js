// Regras puras do formulário de Benfeitor da Fé. Sem rede e sem Firebase, para
// a validação ser testável e a tela não carregar nada desnecessário.
//
// A tela saiu do app em 28/09/2026, quando a campanha virou link externo para
// o site da comunidade, e voltou em 01/10/2026 como rota de verdade, agora com
// envio para a comissão por e-mail.

export const LIMITE_NOME = 120;

export function somenteDigitos(valor) {
  return String(valor || "").replace(/\D/g, "");
}

export function formataCelular(valor) {
  const d = somenteDigitos(valor).slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const resto = d.slice(2);
  if (!resto) return `(${ddd})`;
  if (d.length <= 6) return `(${ddd}) ${resto}`;
  if (d.length <= 10) return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`;
  return `(${ddd}) ${resto.slice(0, 5)}-${resto.slice(5)}`;
}

export function formataCpf(valor) {
  const d = somenteDigitos(valor).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function cpfValido(cpf) {
  const d = somenteDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digito = (fim) => {
    let soma = 0;
    for (let i = 0; i < fim; i++) soma += Number(d[i]) * (fim + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}

export function celularValido(telefone) {
  const d = somenteDigitos(telefone);
  return d.length === 10 || d.length === 11;
}

export function validaLead({ name, email, phone, cpf, lgpdConsent }) {
  if (!name?.trim()) return "Informe seu nome completo.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) return "Informe um e-mail válido.";
  if (!celularValido(phone)) return "Informe um celular com DDD, por exemplo (83) 98897-7017.";
  if (!cpfValido(cpf)) return "Este CPF não é válido. Confira os números.";
  if (!lgpdConsent) return "É preciso autorizar o uso dos dados para continuar.";
  return null;
}

export const WHATSAPP_COMUNIDADE = "https://wa.me/5583988977017";
export const WHATSAPP_ROTULO = "(83) 98897-7017";

export function hrefWhatsappCadastro() {
  const texto =
    "Olá, acabei de me cadastrar como Benfeitor da Fé pelo aplicativo Crescer.";
  return `${WHATSAPP_COMUNIDADE}?text=${encodeURIComponent(texto)}`;
}

// A confirmação muda de frase conforme o que de fato aconteceu. O e-mail para
// a comissão é a segunda via do cadastro: quando ele não sai, o lead continua
// gravado, e o fiel precisa saber que a equipe ainda vai falar com ele.
export const AVISO_EMAIL =
  "A comissão recebe este cadastro por e-mail. Nada foi cobrado agora.";

export const AVISO_SEM_EMAIL =
  "A comissão recebe este cadastro pela mesa da equipe. Nada foi cobrado agora.";
