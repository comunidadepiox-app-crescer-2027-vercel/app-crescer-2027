import { useEffect } from "react";
import { ActivityIndicator, Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Botao } from "../components/Ui";
import { useAuth } from "../lib/authProvider";
import { CORES, FONTES } from "../lib/tema";

export default function StartScreen() {
  const router = useRouter();
  const { user, loading, error, retry } = useAuth();

  useEffect(() => {
    if (!loading && user) router.replace("/home");
  }, [loading, user, router]);

  if (loading) {
    return (
      <View style={estilos.pagina}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={estilos.pagina}>
        <Text style={estilos.titulo}>Não foi possível abrir o aplicativo</Text>
        <Text style={estilos.texto}>Confira sua conexão e tente novamente.</Text>
        <Botao titulo="Tentar novamente" onPress={retry} style={estilos.botao} />
      </View>
    );
  }

  return <View style={estilos.pagina} />;
}

const estilos = StyleSheet.create({
  pagina: {
    flex: 1,
    padding: 24,
    backgroundColor: CORES.fundo,
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontFamily: FONTES.titulo,
    fontSize: 24,
    lineHeight: 30,
    textAlign: "center",
    color: CORES.texto,
  },
  texto: {
    marginTop: 12,
    fontFamily: FONTES.corpo,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    color: CORES.texto,
  },
  botao: { marginTop: 20 },
});
