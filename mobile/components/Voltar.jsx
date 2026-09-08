import { Pressable, Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconeSetaEsquerda } from "./Icones";
import { CORES, FONTES } from "../lib/tema";

export function Voltar({ para, rotulo = "Voltar" }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[estilos.barra, { paddingTop: insets.top + 8 }]}>
      <Pressable
        onPress={() => (para ? router.push(para) : router.back())}
        hitSlop={8}
        style={({ pressed }) => [estilos.botao, pressed && { opacity: 0.75 }]}
      >
        <IconeSetaEsquerda cor="#fff" tamanho={22} />
        <Text style={estilos.texto}>{rotulo}</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: {
    backgroundColor: CORES.laranja,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingVertical: 4,
    paddingRight: 12,
  },
  texto: {
    fontFamily: FONTES.titulo,
    fontSize: 16,
    textTransform: "uppercase",
    color: "#fff",
  },
});
