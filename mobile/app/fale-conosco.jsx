import { useCallback } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Redirect } from "expo-router";
import Mail from "lucide-react-native/icons/mail";
import MessageCircle from "lucide-react-native/icons/message-circle";
import Phone from "lucide-react-native/icons/phone";
import { useAuth } from "../lib/authProvider";
import { Voltar } from "../components/Voltar";
import { IconeSetaEsquerda } from "../components/Icones";
import { CORES, FONTES, RAIO } from "../lib/tema";
import { CONTATOS } from "../lib/contatos";

// ícone por canal. fica aqui, no componente, porque é desenho e não conteúdo:
// o que a comunidade troca é o contato, não o desenho da linha.
const ICONES = {
  telefone: Phone,
  email: Mail,
  whatsapp: MessageCircle,
};

export default function FaleConoscoScreen() {
  const { user, loading } = useAuth();

  const abrirCanal = useCallback(async ({ url, reserva, aviso }) => {
    // `canOpenURL` antes de abrir evita a exceção silenciosa no aparelho sem
    // discador, sem aplicativo de e-mail ou sem WhatsApp.
    const podeAbrir = await Linking.canOpenURL(url).catch(() => false);
    if (podeAbrir) {
      const abriu = await Linking.openURL(url).then(() => true).catch(() => false);
      if (abriu) return;
    }
    // WhatsApp ausente cai na conversa na web, que ainda funciona no
    // navegador. Sem reserva, o toque vira aviso.
    if (reserva) {
      const abriu = await Linking.openURL(reserva).then(() => true).catch(() => false);
      if (abriu) return;
    }
    Alert.alert("Não foi possível abrir", aviso);
  }, []);

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={estilos.tela}>
      <Voltar para="/home" rotulo="Home" />
      <ScrollView contentContainerStyle={estilos.scroll} showsVerticalScrollIndicator={false}>
        <Text style={estilos.titulo}>Fale Conosco</Text>
        <Text style={estilos.apoio}>
          Estes são os canais de atendimento da Comunidade de São Pio X. Toque em
          um deles para falar com a comunidade agora.
        </Text>

        {CONTATOS.map(({ id, rotulo, valor, url, reserva, aviso }) => {
          const Icone = ICONES[id];
          return (
            <Pressable
              key={id}
              onPress={() => abrirCanal({ url, reserva, aviso })}
              accessibilityRole="button"
              accessibilityLabel={`Abrir ${rotulo}: ${valor}`}
              style={({ pressed }) => [estilos.linha, pressed && estilos.linhaPressionada]}
            >
              <View style={estilos.marca}>
                <Icone color={CORES.roxoBotao} size={26} strokeWidth={1.8} />
              </View>
              <View style={estilos.textos}>
                <Text style={estilos.rotulo}>{rotulo}</Text>
                <Text style={estilos.valor}>{valor}</Text>
              </View>
              <View style={estilos.acao}>
                <IconeSetaEsquerda cor={CORES.destaque} tamanho={20} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 48,
    gap: 14,
  },
  titulo: {
    fontFamily: FONTES.titulo,
    fontSize: 28,
    lineHeight: 32,
    textTransform: "uppercase",
    color: CORES.titulo,
  },
  apoio: {
    fontFamily: FONTES.corpo,
    fontSize: 16,
    lineHeight: 24,
    color: CORES.texto,
    marginBottom: 6,
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: RAIO.cartao,
    borderWidth: 1,
    borderColor: CORES.linha,
    backgroundColor: CORES.superficie,
  },
  linhaPressionada: {
    opacity: 0.72,
  },
  marca: {
    width: 52,
    height: 52,
    borderRadius: RAIO.botao,
    backgroundColor: CORES.creme,
    alignItems: "center",
    justifyContent: "center",
  },
  textos: {
    flex: 1,
    gap: 4,
  },
  rotulo: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: CORES.titulo,
  },
  valor: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 17,
    lineHeight: 22,
    color: CORES.texto,
  },
  acao: {
    padding: 6,
    // a seta indica "abre alguma coisa", como em /fornecedor. o ícone do app
    // aponta para a esquerda, então a linha gira para a direita.
    transform: [{ rotate: "180deg" }],
  },
});