import { View, ScrollView, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../lib/authProvider";
import { Voltar } from "../components/Voltar";
import { TituloPagina, TituloSecao, Paragrafo } from "../components/Ui";
import { TEXTO_SOBRE_APP, AVISO_DADOS, CREDITOS, TEXTO_ADMIN } from "../lib/sobreApp";
import { CORES } from "../lib/tema";

export default function SobreAppScreen() {
  const { user, loading, profile } = useAuth();

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
          <TituloSecao>Créditos do aplicativo</TituloSecao>
          <Paragrafo style={estilos.paragrafo}>{CREDITOS.texto}</Paragrafo>
          {CREDITOS.linhas.map((linha, i) => (
            <Paragrafo key={`credito-${i}`} style={estilos.paragrafo}>
              {linha}
            </Paragrafo>
          ))}
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
});
