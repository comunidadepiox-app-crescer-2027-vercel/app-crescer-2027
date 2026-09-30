import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export const PIX_COPIA_COLA =
  "00020126360014br.gov.bcb.pix0114028687320001235204000053039865802BR5925ASSOC_CARISMATICA_CATOLIC6014Campina_Grande610958101-10062290525YG0D11907520179069884147363049EAD";

export const BENEFICIARIO = {
  nome: "Associação Carismática Católica São Pio X",
  cnpj: "02.868.732/0001-23",
  cidade: "Campina Grande/PB",
};

// Custo histórico do encontro em 2026. Não é meta nem arrecadação de 2027.
export const CUSTO_CRESCER_2026 = 86000;

export function percentValido(valor) {
  if (typeof valor !== "number" || !Number.isFinite(valor) || !Number.isInteger(valor)) {
    return null;
  }
  if (valor < 0 || valor > 100) return null;
  return valor;
}

export function observarPercentualDoacao(onData, onError) {
  if (!db) {
    onError?.(new Error("Firebase não configurado"));
    return () => {};
  }
  return onSnapshot(
    doc(db, "siteContent", "doacao"),
    (snap) => onData(percentValido(snap.exists() ? snap.data().percent : undefined)),
    (err) => onError?.(err)
  );
}
