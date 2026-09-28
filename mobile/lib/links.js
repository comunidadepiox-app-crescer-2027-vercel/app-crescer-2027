// Endereços que o app abre no navegador do aparelho.
//
// Nenhum item de link pode ficar sem destino. Quando a constante está vazia,
// o toque mostra um aviso curto em vez de falhar em silêncio, que é o jeito
// mais honesto de expor um endereço que a comunidade ainda não mandou.

import { Alert, Linking } from "react-native";

// Campanha do Benfeitor da Fé, da Comunidade de São Pio X. A tela de campanha
// saiu do app em 28/09/2026 e ficou arquivada em mobile/_arquivo/benfeitor/.
export const LINK_BENFEITOR = "https://benfeitordafe.comunidadepiox.org.br/crescer";

// TODO(ingresso): preencher com a página oficial de inscrição do encontro.
// Enquanto estiver vazio, o botão INGRESSO e o atalho Ingresso da folha
// central avisam que o endereço entra em breve. Não trocar por um palpite.
export const LINK_INGRESSO = "";

const AVISO_INGRESSO = {
  titulo: "Em breve",
  texto:
    "O endereço de ingresso do Crescer ainda não foi publicado pela comunidade. " +
    "Logo que sair, ele entra aqui.",
};

const AVISO_FALHA = {
  titulo: "Não foi possível abrir",
  texto: "O navegador do aparelho recusou o endereço. Tente de novo em instantes.",
};

export function linkDisponivel(url) {
  return Boolean(String(url || "").trim());
}

// Abre o endereço no navegador. Devolve false, e mostra o aviso, quando o
// endereço ainda não foi informado ou quando o aparelho não conseguiu abrir.
export function abreLinkExterno(url, aviso = AVISO_INGRESSO) {
  if (!linkDisponivel(url)) {
    if (aviso) Alert.alert(aviso.titulo, aviso.texto);
    return false;
  }
  Linking.openURL(url).catch(() => {
    Alert.alert(AVISO_FALHA.titulo, AVISO_FALHA.texto);
  });
  return true;
}
