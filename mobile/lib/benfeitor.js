import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export function somenteDigitos(valor) {
  return String(valor || "").replace(/\D/g, "");
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

export async function submitLead({ uid, name, email, phone, cpf }) {
  return addDoc(collection(db, "benefactorLeads"), {
    uid,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: somenteDigitos(phone),
    cpf: somenteDigitos(cpf),
    lgpdConsent: true,
    lgpdConsentAt: serverTimestamp(),
    status: "novo",
    createdAt: serverTimestamp(),
  });
}

export const WHATSAPP_COMUNIDADE = "https://wa.me/5583988977017";
export const WHATSAPP_ROTULO = "(83) 98897-7017";

export function hrefWhatsappCadastro() {
  const texto =
    "Olá, acabei de me cadastrar como Benfeitor da Fé pelo aplicativo Crescer.";
  return `${WHATSAPP_COMUNIDADE}?text=${encodeURIComponent(texto)}`;
}
