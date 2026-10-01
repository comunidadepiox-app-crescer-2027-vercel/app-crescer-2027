// Navegação inferior por etapas, no desenho do Terço da Restauração das
// Famílias (spec 011): setas nas pontas, contador no meio e a barra acima da
// área segura do aparelho. A Liturgia Diária (spec 015) usa o mesmo componente,
// então as duas telas não têm duas versões do mesmo desenho.

import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconeSetaEsquerda } from "./Icones";
import { CORES, FONTES } from "../lib/tema";

export function BarraEtapas({ total, atual, rotuloAnterior = "Etapa anterior", rotuloProxima = "Próxima etapa", aoAnterior, aoProxima }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[estilos.barra, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Seta rotulo={rotuloAnterior} desabilitada={atual === 0} onPress={aoAnterior} />
      <Text accessibilityLiveRegion="polite" style={estilos.contador}>
        {`${atual + 1} de ${total}`}
      </Text>
      <Seta rotulo={rotuloProxima} direita desabilitada={atual === total - 1} onPress={aoProxima} />
    </View>
  );
}

function Seta({ rotulo, direita, desabilitada, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityState={{ disabled: desabilitada }}
      disabled={desabilitada}
      onPress={onPress}
      hitSlop={10}
      style={[estilos.seta, desabilitada && estilos.desabilitada]}
    >
      <View style={direita && estilos.direita}>
        <IconeSetaEsquerda cor="#fff" tamanho={28} />
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  barra: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 70,
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: CORES.roxoBotao,
    borderTopWidth: 1,
    borderTopColor: CORES.roxo,
  },
  seta: { width: 44, height: 42, alignItems: "center", justifyContent: "center" },
  desabilitada: { opacity: 0.32 },
  direita: { transform: [{ rotate: "180deg" }] },
  contador: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 14,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});