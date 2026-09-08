const mensagens = {
  "auth/invalid-credential": "E-mail ou senha incorretos. Confira e tente de novo.",
  "auth/user-not-found": "Não encontramos uma conta com este e-mail.",
  "auth/wrong-password": "E-mail ou senha incorretos. Confira e tente de novo.",
  "auth/email-already-in-use": "Este e-mail já tem uma conta. Use a opção Entrar.",
  "auth/invalid-email": "Este e-mail não parece válido.",
  "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
  "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente de novo.",
  "auth/popup-closed-by-user": "A janela do Google foi fechada antes de concluir.",
  "auth/popup-blocked": "O navegador bloqueou a janela do Google. Libere popups e tente de novo.",
  "auth/cancelled-popup-request": "Outra janela de login já estava aberta. Tente de novo.",
  "auth/unauthorized-domain":
    "Este endereço não está autorizado a fazer login. No console do Firebase, em Authentication, Settings, Authorized domains, adicione o domínio ou IP que você está usando.",
  "auth/operation-not-supported-in-this-environment":
    "Este navegador não suporta o login do Google aqui. Tente pelo Chrome ou Safari.",
  "auth/network-request-failed": "Sem conexão. Verifique sua internet.",
};

export function traduzErroAuth(error) {
  return mensagens[error?.code] || "Não foi possível concluir. Tente novamente.";
}
