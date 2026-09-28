import { View, ScrollView, Linking, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../lib/authProvider";
import { Voltar } from "../components/Voltar";
import { TituloPagina, TituloSecao, Paragrafo, Botao, Cartao } from "../components/Ui";
import { CORES } from "../lib/tema";

const GALERIAS = [
  {
    titulo: "Galerias do site oficial",
    descricao:
      "As fotos de todas as edições do encontro ficam nas galerias do site oficial do Crescer, organizadas por dia.",
    href: "https://encontrodafamiliacatolica.com.br/galerias/",
    acao: "Abrir galerias oficiais",
  },
  {
    titulo: "Instagram do Crescer",
    descricao:
      "Acompanhe os registros do encontro e os avisos da comunidade também pelo Instagram oficial.",
    href: "https://www.instagram.com/encontrodafamiliacatolica/",
    acao: "Abrir o Instagram",
  },
];

export default function GaleriaScreen() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={estilos.tela}>
      <Voltar para="/sobre-o-app" rotulo="Sobre o app" />
      <ScrollView contentContainerStyle={estilos.pagina}>
        <TituloPagina>Galeria</TituloPagina>
        <Paragrafo style={{ marginTop: 8 }}>
          Reviva os momentos do encontro. As fotos oficiais são publicadas pela
          equipe de comunicação da Comunidade de São Pio X.
        </Paragrafo>
        {GALERIAS.map((g) => (
          <Cartao key={g.href} style={{ padding: 20, marginTop: 20 }}>
            <TituloSecao>{g.titulo}</TituloSecao>
            <Paragrafo style={{ marginTop: 8 }}>{g.descricao}</Paragrafo>
            <Botao
              titulo={g.acao}
              onPress={() => Linking.openURL(g.href)}
              style={{ marginTop: 14 }}
            />
          </Cartao>
        ))}
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
});
