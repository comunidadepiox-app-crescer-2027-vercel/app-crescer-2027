import { View, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CORES } from "../lib/tema";
import { Botao } from "./Ui";

const logo = require("../assets/brand/logo-crescer-branca.png");

export function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[estilos.barra, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={() => router.push("/home")} hitSlop={8}>
        <Image source={logo} resizeMode="contain" style={estilos.logo} />
      </Pressable>
      <Botao
        titulo="INSCREVA-SE"
        variante="roxo"
        onPress={() => router.push("/benfeitor")}
        style={{ alignSelf: "center", paddingVertical: 8, paddingHorizontal: 12 }}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: {
    backgroundColor: CORES.laranja,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  logo: {
    width: 150,
    height: 36,
  },
});
