// Regras puras do formulário de testemunho. Sem rede e sem Firebase, para a
// validação ser testável e a tela não carregar nada desnecessário.

export const LIMITE_NOME = 60;
export const LIMITE_TEXTO = 2000;
export const MINIMO_TEXTO = 20;

function soEspaco(valor) {
  return String(valor ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

// Nome anônimo nunca vai para o documento, mesmo que o campo ainda tenha
// algum resto. O que vale é a opção marcada, não o que sobrou no campo.
export function nomeNormalizado({ nome, anonimo }) {
  if (anonimo) return "";
  return soEspaco(nome).slice(0, LIMITE_NOME);
}

export function validaTestemunho({ nome, anonimo, texto, autorizouUsoPublico }) {
  if (autorizouUsoPublico !== true) {
    return "Marque a autorização para enviar seu testemunho.";
  }
  const limpo = soEspaco(texto);
  if (!limpo) return "Escreva o seu testemunho antes de enviar.";
  if (limpo.length < MINIMO_TEXTO) {
    return `Escreva um pouco mais, com pelo menos ${MINIMO_TEXTO} letras.`;
  }
  if (String(texto).length > LIMITE_TEXTO) {
    return `O texto passa de ${LIMITE_TEXTO} caracteres.`;
  }
  if (!anonimo && !soEspaco(nome)) {
    return "Escreva o seu nome ou marque a opção de anônimo.";
  }
  return null;
}

export function restantes(texto) {
  return LIMITE_TEXTO - String(texto || "").length;
}
