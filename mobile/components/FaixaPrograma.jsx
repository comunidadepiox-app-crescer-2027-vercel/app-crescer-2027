import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { CORES, FONTES } from "../lib/tema";

export function FaixaPrograma({ mudou, onEntendi, naAgenda }) {
  const router = useRouter();
  if (!mudou) return null;

  return (
    <View style={[estilos.faixa, naAgenda && estilos.encaixada]}>
      <Text style={estilos.texto}>A programação de hoje mudou.</Text>
      <View style={estilos.acoes}>
        {naAgenda ? null : (
          <Pressable onPress={() => router.push("/agenda")}>
            <Text style={estilos.link}>Ver a agenda</Text>
          </Pressable>
        )}
        <Pressable onPress={onEntendi}>
          <Text style={estilos.link}>Entendi</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  faixa: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    padding: 14,
    borderWidth: 1,
    borderColor: CORES.linha,
    backgroundColor: CORES.creme,
    gap: 8,
  },
  encaixada: { marginHorizontal: 0, marginTop: 0 },
  texto: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 15,
    color: CORES.texto,
  },
  acoes: { flexDirection: "row", gap: 16 },
  link: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 13,
    color: CORES.destaque,
    textDecorationLine: "underline",
  },
});
