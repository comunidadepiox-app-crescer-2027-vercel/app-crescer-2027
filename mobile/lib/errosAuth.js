const mensagens = {
  "auth/invalid-credential": "E-mail ou senha incorretos. Confira e tente de novo.",
  "auth/user-not-found": "Não encontramos uma conta com este e-mail.",
  "auth/wrong-password": "E-mail ou senha incorretos. Confira e tente de novo.",
  "auth/email-already-in-use": "Este e-mail já tem uma conta. Use a opção Entrar.",
  "auth/invalid-email": "Este e-mail não parece válido.",
  "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
  "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente de novo.",
  "auth/network-request-failed": "Sem conexão. Verifique sua internet.",
};

export function traduzErroAuth(error) {
  return mensagens[error?.code] || "Não foi possível concluir. Tente novamente.";
}
