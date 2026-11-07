import { useEffect, useState } from "react";
import { View, Image, Pressable, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CORES } from "../lib/tema";
import { abreLinkExterno, LINK_PARTICIPAR } from "../lib/links";
import { Botao } from "./Ui";
import { IconeInfo, IconeSino } from "./Icones";
import { useAuth } from "../lib/authProvider";
import { observarNotificacoes } from "../lib/caixaNotificacoes";

const logo = require("../assets/brand/logo-crescer-branca.png");

export function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const [naoLidas, setNaoLidas] = useState(0);

  useEffect(() => {
    if (!user?.uid) return;
    return observarNotificacoes(user.uid, (lista) => setNaoLidas(lista.filter((item) => !item.lida).length), () => setNaoLidas(0));
  }, [user?.uid]);

  return (
    <View style={[estilos.barra, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={() => router.push("/home")} hitSlop={8} style={estilos.logoBotao}>
        <Image source={logo} resizeMode="contain" style={estilos.logo} />
      </Pressable>
      <View style={estilos.acoes}>
        <Botao
          titulo="PARTICIPAR"
          variante="roxo"
          onPress={() => abreLinkExterno(LINK_PARTICIPAR)}
          style={{ alignSelf: "center", paddingVertical: 8, paddingHorizontal: 12 }}
        />
        <Pressable
          onPress={() => router.push("/notificacoes")}
          hitSlop={4}
          accessibilityRole="button"
          accessibilityLabel={naoLidas ? `Notificações, ${naoLidas} não lidas` : "Notificações"}
          style={estilos.info}
        >
          <IconeSino cor="#fff" tamanho={24} />
          {naoLidas > 0 ? <View style={estilos.badge}><Text style={estilos.badgeTexto}>{naoLidas > 9 ? "9+" : naoLidas}</Text></View> : null}
        </Pressable>
        <Pressable
          onPress={() => router.push("/sobre-o-app")}
          hitSlop={4}
          accessibilityRole="button"
          accessibilityLabel="Sobre o aplicativo"
          style={[estilos.info, estilos.infoProximo]}
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
  infoProximo: {
    marginLeft: -8,
  },
  badge: { position: "absolute", top: 3, right: 1, minWidth: 17, height: 17, paddingHorizontal: 3, borderRadius: 9, backgroundColor: "#b42318", alignItems: "center", justifyContent: "center" },
  badgeTexto: { color: "#fff", fontSize: 10, fontWeight: "700" },
});
