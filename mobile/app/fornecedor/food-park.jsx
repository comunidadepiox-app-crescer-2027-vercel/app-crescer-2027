import { StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../../lib/authProvider";
import { Voltar } from "../../components/Voltar";
import { FormularioJotform } from "../../components/FormularioJotform";
import { LINK_INSCRICAO_FORNECEDORES_FOOD_PARK } from "../../lib/links";
import { CORES } from "../../lib/tema";

export default function FornecedorFoodParkScreen() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={estilos.tela}>
      <Voltar para="/fornecedor" rotulo="Food Park" />
      <FormularioJotform url={LINK_INSCRICAO_FORNECEDORES_FOOD_PARK} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
});
