import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Redirect } from "expo-router";
import Store from "lucide-react-native/icons/store";
import Utensils from "lucide-react-native/icons/utensils";
import { useAuth } from "../lib/authProvider";
import { Voltar } from "../components/Voltar";
import { IconeSetaEsquerda } from "../components/Icones";
import { CORES, FONTES, RAIO } from "../lib/tema";

const FORNECEDORES = [
  {
    id: "food-park",
    titulo: "Food Park",
    descricao: "Bancas de comidas e bebidas do Food Park do Crescer.",
    Icone: Utensils,
    url: null,
  },
  {
    id: "outros",
    titulo: "Outros",
    descricao: "Lojas, estandes e serviços de outras entidades do encontro.",
    Icone: Store,
    url: null,
  },
];

export default function FornecedorScreen() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={estilos.tela}>
      <Voltar para="/home" rotulo="Fornecedor" />
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={estilos.apoio}>
          Veja as opções de alimentação e serviços disponíveis durante o
          encontro.
        </Text>

        {FORNECEDORES.map((fornecedor) => {
          const { Icone } = fornecedor;
          return (
            <View key={fornecedor.id} style={estilos.card}>
              <View style={estilos.marca}>
                <Icone color={CORES.roxoBotao} size={30} strokeWidth={1.8} />
              </View>
              <View style={estilos.textos}>
                <Text style={estilos.titulo}>{fornecedor.titulo}</Text>
                <Text style={estilos.descricao}>{fornecedor.descricao}</Text>
              </View>
              <View style={estilos.seta}>
                <IconeSetaEsquerda cor={CORES.titulo} tamanho={20} />
              </View>
            </View>
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
    gap: 16,
  },
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
