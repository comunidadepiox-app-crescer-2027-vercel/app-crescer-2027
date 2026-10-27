import { StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../../lib/authProvider";
import { Voltar } from "../../components/Voltar";
import { FormularioJotform } from "../../components/FormularioJotform";
import { LINK_INSCRICAO_SERVOS } from "../../lib/links";
import { CORES } from "../../lib/tema";

export default function VoluntarioScreen() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={estilos.tela}>
      <Voltar para="/home" rotulo="Seja Voluntário" />
      <FormularioJotform url={LINK_INSCRICAO_SERVOS} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
});
