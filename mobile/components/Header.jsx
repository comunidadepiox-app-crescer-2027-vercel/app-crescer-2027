import { View, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CORES } from "../lib/tema";
import { Botao } from "./Ui";
import { IconeInfo } from "./Icones";

const logo = require("../assets/brand/logo-crescer-branca.png");

export function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[estilos.barra, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={() => router.push("/home")} hitSlop={8} style={estilos.logoBotao}>
        <Image source={logo} resizeMode="contain" style={estilos.logo} />
      </Pressable>
      <View style={estilos.acoes}>
        <Botao
          titulo="FAÇA SUA DOAÇÃO"
          variante="roxo"
          onPress={() => router.push("/colabore")}
          style={{ alignSelf: "center", paddingVertical: 8, paddingHorizontal: 12 }}
        />
        <Pressable
          onPress={() => router.push("/sobre-o-app")}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Sobre o aplicativo"
          style={estilos.info}
        >
          <IconeInfo cor="#fff" tamanho={24} />
        </Pressable>
      </View>
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
  logoBotao: {
    flex: 1,
    marginRight: 8,
  },
  logo: {
    width: 150,
    maxWidth: "100%",
    height: 36,
  },
  acoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  info: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
