import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { somenteDigitos } from "./validate";

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
