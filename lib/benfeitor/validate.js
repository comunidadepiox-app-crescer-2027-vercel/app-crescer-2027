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
  const calc = (fim) => {
    let soma = 0;
    for (let i = 0; i < fim; i++) soma += Number(d[i]) * (fim + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return calc(9) === Number(d[9]) && calc(10) === Number(d[10]);
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
