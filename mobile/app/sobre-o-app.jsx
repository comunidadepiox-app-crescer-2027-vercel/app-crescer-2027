import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useAuth } from "../lib/authProvider";
import { Voltar } from "../components/Voltar";
import { TituloPagina, TituloSecao, Paragrafo } from "../components/Ui";
import { TEXTO_SOBRE_APP, AVISO_DADOS, TEXTO_ADMIN } from "../lib/sobreApp";
import { CORES, FONTES } from "../lib/tema";

export default function SobreAppScreen() {
  const { user, loading, profile } = useAuth();
  const router = useRouter();

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={estilos.tela}>
      <Voltar para="/home" rotulo="Home" />
      <ScrollView contentContainerStyle={estilos.pagina}>
        <TituloPagina>Sobre o aplicativo</TituloPagina>

        <View style={estilos.bloco}>
          {TEXTO_SOBRE_APP.map((paragrafo, i) => (
            <Paragrafo key={`sobre-${i}`} style={estilos.paragrafo}>
              {paragrafo}
            </Paragrafo>
          ))}
        </View>

        <View style={estilos.bloco}>
          <TituloSecao>Seus dados</TituloSecao>
          {AVISO_DADOS.map((paragrafo, i) => (
            <Paragrafo key={`dados-${i}`} style={estilos.paragrafo}>
              {paragrafo}
            </Paragrafo>
          ))}
        </View>

        <View style={estilos.bloco}>
          <TituloSecao>Veja mais</TituloSecao>
          <Pressable onPress={() => router.push("/galeria")} style={estilos.link}>
            <Text style={estilos.linkTexto}>Abrir galeria de fotos</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/sobre")} style={estilos.link}>
            <Text style={estilos.linkTexto}>Sobre o Crescer e contatos da comunidade</Text>
          </Pressable>
        </View>

        {profile?.role === "admin" ? (
          <View style={estilos.bloco}>
            <TituloSecao>Administração</TituloSecao>
            <Paragrafo style={estilos.paragrafo}>{TEXTO_ADMIN}</Paragrafo>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  pagina: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  bloco: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: CORES.linha,
  },
  paragrafo: {
    marginTop: 12,
  },
  link: {
    marginTop: 10,
  },
  linkTexto: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 15,
    color: CORES.destaque,
    textDecorationLine: "underline",
  },
});
