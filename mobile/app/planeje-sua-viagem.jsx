import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Redirect } from "expo-router";
import Plane from "lucide-react-native/icons/plane";
import Bus from "lucide-react-native/icons/bus";
import { useAuth } from "../lib/authProvider";
import { Voltar } from "../components/Voltar";
import { IconeSetaEsquerda } from "../components/Icones";
import { CORES, FONTES, RAIO } from "../lib/tema";
import {
  abreLinkExterno,
  LINK_CARAVANAS_E_GRUPOS,
  LINK_PLANEJE_SUA_VIAGEM,
} from "../lib/links";

const OPCOES = [
  {
    titulo: "Pacotes de Viagem",
    descricao: "Passagens, hotéis e traslados com condições especiais.",
    Icone: Plane,
    url: LINK_PLANEJE_SUA_VIAGEM,
  },
  {
    titulo: "Caravanas e Grupos de Todo o Brasil",
    descricao: "Excursões com roteiros especiais, incluindo o evento e João Pessoa/PB.",
    Icone: Bus,
    url: LINK_CARAVANAS_E_GRUPOS,
  },
];

export default function PlanejeSuaViagemScreen() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={estilos.tela}>
      <Voltar para="/home" rotulo="Planeje sua Viagem" />
      <ScrollView contentContainerStyle={estilos.scroll} showsVerticalScrollIndicator={false}>
        <Text style={estilos.apoio}>Encontre a melhor opção para chegar ao encontro.</Text>
        {OPCOES.map(({ titulo, descricao, Icone, url }) => (
          <Pressable
            key={titulo}
            accessibilityRole="link"
            accessibilityLabel={`Abrir ${titulo}`}
            onPress={() => abreLinkExterno(url)}
            style={({ pressed }) => [estilos.card, pressed && estilos.cardPressionado]}
          >
            <View style={estilos.marca}>
              <Icone color={CORES.roxoBotao} size={30} strokeWidth={1.8} />
            </View>
            <View style={estilos.textos}>
              <Text style={estilos.titulo}>{titulo}</Text>
              <Text style={estilos.descricao}>{descricao}</Text>
            </View>
            <View style={estilos.seta}>
              <IconeSetaEsquerda cor={CORES.titulo} tamanho={20} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  scroll: { paddingHorizontal: 16, paddingTop: 28, paddingBottom: 48, gap: 16 },
  apoio: {
    fontFamily: FONTES.corpo,
    fontSize: 16,
    lineHeight: 24,
    color: CORES.texto,
    marginBottom: 6,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: RAIO.cartao,
    borderWidth: 1,
    borderColor: CORES.linha,
    backgroundColor: CORES.superficie,
  },
  cardPressionado: { opacity: 0.72 },
  marca: {
    width: 60,
    height: 60,
    borderRadius: RAIO.botao,
    backgroundColor: CORES.creme,
    alignItems: "center",
    justifyContent: "center",
  },
  textos: { flex: 1, gap: 5 },
  titulo: {
    fontFamily: FONTES.titulo,
    fontSize: 19,
    lineHeight: 24,
    color: CORES.titulo,
    textTransform: "uppercase",
  },
  descricao: {
    fontFamily: FONTES.corpo,
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(17,28,45,0.68)",
  },
  seta: { transform: [{ rotate: "180deg" }] },
});
