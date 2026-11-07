import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Redirect } from "expo-router";
import Globe from "lucide-react-native/icons/globe";
import Ticket from "lucide-react-native/icons/ticket";
import { useAuth } from "../lib/authProvider";
import { Voltar } from "../components/Voltar";
import { IconeSetaEsquerda } from "../components/Icones";
import { CORES, FONTES, RAIO } from "../lib/tema";
import {
  abreLinkExterno,
  LINK_CONAFAM_INGRESSO,
  LINK_CONAFAM_SITE,
} from "../lib/links";

const logo = require("../assets/logo-CONAFAM.webp");

const OPCOES = [
  {
    id: "site",
    titulo: "Site Oficial",
    descricao: "Programação, palestrantes e informações do congresso.",
    Icone: Globe,
    url: LINK_CONAFAM_SITE,
  },
  {
    id: "ingresso",
    titulo: "Adquira já seu ingresso",
    descricao: "Garanta sua vaga no CONAFAM 2027.",
    Icone: Ticket,
    url: LINK_CONAFAM_INGRESSO,
  },
];

export default function ConafamScreen() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={estilos.tela}>
      <Voltar para="/home" rotulo="CONAFAM" />
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={logo}
          style={estilos.logo}
          resizeMode="contain"
          accessible
          accessibilityRole="image"
          accessibilityLabel="Logo do CONAFAM"
        />

        <Text style={estilos.apoio}>
          O CONAFAM é um espaço de formação para famílias católicas. Durante
          três tardes, em Campina Grande, pais, mães, casais e jovens poderão
          aprofundar temas que tocam o dia a dia de cada casa. As palestras são
          mais longas e densas, e o público terá mais proximidade com quem
          forma.
        </Text>

        <View style={estilos.bloco}>
          <Text style={estilos.subtitulo}>Para quem é:</Text>
          <Text style={estilos.apoio}>
            Para casais, pais e mães que desejam educar os filhos na fé e
            fortalecer a vida familiar. Também para quem começou há pouco a
            caminhada e quer conhecer mais, e para jovens que se preparam para
            formar a própria família. Movimentos e pastorais familiares são
            muito bem-vindos.
          </Text>
        </View>

        {OPCOES.map(({ id, titulo, descricao, Icone, url }) => (
          <Pressable
            key={id}
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
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 48,
    gap: 16,
  },
  logo: {
    width: "100%",
    maxWidth: 300,
    aspectRatio: 448 / 118,
    alignSelf: "center",
  },
  apoio: {
    fontFamily: FONTES.corpo,
    fontSize: 16,
    lineHeight: 24,
    color: CORES.texto,
  },
  bloco: {
    gap: 6,
  },
  subtitulo: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 16,
    lineHeight: 24,
    color: CORES.titulo,
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
  cardPressionado: {
    opacity: 0.72,
  },
  marca: {
    width: 60,
    height: 60,
    borderRadius: RAIO.botao,
    backgroundColor: CORES.creme,
    alignItems: "center",
    justifyContent: "center",
  },
  textos: {
    flex: 1,
    gap: 5,
  },
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
  seta: {
    transform: [{ rotate: "180deg" }],
  },
});
