import { Pressable, Image, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { CORES, FONTES, RAIO } from "../lib/tema";
import { formataDataFirestore } from "../lib/noticias";

const simbolo = require("../assets/brand/simbolo-crescer.png");

export function NewsCard({ noticia }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/noticia/${noticia.id}`)}
      style={estilos.cartao}
    >
      <View style={estilos.capa}>
        {noticia.coverUrl ? (
          <Image source={{ uri: noticia.coverUrl }} style={estilos.foto} />
        ) : (
          <Image source={simbolo} style={estilos.simbolo} resizeMode="contain" />
        )}
      </View>
      <View style={estilos.corpo}>
        <Text style={estilos.titulo}>{noticia.title}</Text>
        <Text style={estilos.data}>{formataDataFirestore(noticia.publishedAt)}</Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    borderRadius: RAIO.cartao,
    borderWidth: 1,
    borderColor: CORES.linha,
    backgroundColor: CORES.superficie,
    overflow: "hidden",
  },
  capa: {
    height: 150,
    backgroundColor: CORES.creme,
    alignItems: "center",
    justifyContent: "center",
  },
  foto: { width: "100%", height: "100%" },
  simbolo: { width: 64, height: 64, opacity: 0.7 },
  corpo: { padding: 16 },
  titulo: {
    fontFamily: FONTES.titulo,
    fontSize: 17,
    lineHeight: 22,
    textTransform: "uppercase",
    color: CORES.titulo,
  },
  data: {
    marginTop: 6,
    fontFamily: FONTES.corpo,
    fontSize: 13,
    color: "rgba(17,28,45,0.6)",
  },
});
