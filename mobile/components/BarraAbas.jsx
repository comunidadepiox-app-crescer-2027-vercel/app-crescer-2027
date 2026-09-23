import { Pressable, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconeGrade } from "./Icones";
import { CORES, FONTES } from "../lib/tema";

export const ALTURA_ABAS = 64;
export const FOLGA_CIRCULO = 21;

const ORDEM = ["home", "noticias", "agenda", "benfeitor"];

export function alturaBarra(insetoBaixo) {
  return ALTURA_ABAS + FOLGA_CIRCULO + insetoBaixo;
}

export function BarraAbas({
  state,
  descriptors,
  navigation,
  menuAberto,
  onAlternarMenu,
  onFecharMenu,
}) {
  const insets = useSafeAreaInsets();
  const rotas = ORDEM.map((nome) => state.routes.find((rota) => rota.name === nome)).filter(Boolean);
  const esquerda = rotas.slice(0, 2);
  const direita = rotas.slice(2);
  const nomeAtivo = state.routes[state.index]?.name;

  return (
    <View style={[estilos.caixa, { height: alturaBarra(insets.bottom) }]}>
      <View style={[estilos.fundo, { height: ALTURA_ABAS + insets.bottom }]} />
      <View style={[estilos.fileira, { paddingBottom: insets.bottom }]}>
        {esquerda.map((rota) => (
          <ItemAba
            key={rota.key}
            rota={rota}
            ativo={nomeAtivo === rota.name}
            options={descriptors[rota.key].options}
            navigation={navigation}
            onFecharMenu={onFecharMenu}
          />
        ))}
        <View style={estilos.slotMenu}>
          <Pressable
            onPress={onAlternarMenu}
            accessibilityRole="button"
            accessibilityLabel="Menu"
            accessibilityState={{ expanded: menuAberto }}
            style={estilos.circulo}
          >
            <IconeGrade cor="#fff" tamanho={30} />
          </Pressable>
        </View>
        {direita.map((rota) => (
          <ItemAba
            key={rota.key}
            rota={rota}
            ativo={nomeAtivo === rota.name}
            options={descriptors[rota.key].options}
            navigation={navigation}
            onFecharMenu={onFecharMenu}
          />
        ))}
      </View>
    </View>
  );
}

function ItemAba({ rota, ativo, options, navigation, onFecharMenu }) {
  const cor = ativo ? CORES.dourado : "#ffffff";
  const rotulo = options.title ?? rota.name;

  function aoPressionar() {
    onFecharMenu();
    const evento = navigation.emit({
      type: "tabPress",
      target: rota.key,
      canPreventDefault: true,
    });
    if (!ativo && !evento.defaultPrevented) {
      navigation.navigate(rota.name, rota.params);
    }
  }

  return (
    <Pressable
      onPress={aoPressionar}
      accessibilityRole="tab"
      accessibilityState={{ selected: ativo }}
      accessibilityLabel={rotulo}
      style={estilos.aba}
    >
      {options.tabBarIcon?.({ color: cor, focused: ativo, size: 24 })}
      <Text style={[estilos.rotulo, { color: cor }]} numberOfLines={1}>
        {rotulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    backgroundColor: "transparent",
  },
  fundo: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: CORES.roxoBotao,
  },
  fileira: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  aba: {
    flex: 1,
    height: ALTURA_ABAS,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: 2,
  },
  rotulo: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 10,
    textTransform: "uppercase",
  },
  slotMenu: {
    width: 72,
    height: ALTURA_ABAS,
    alignItems: "center",
  },
  circulo: {
    position: "absolute",
    top: -FOLGA_CIRCULO,
    width: 60,
    height: 60,
    borderRadius: 90,
    backgroundColor: CORES.laranja,
    alignItems: "center",
    justifyContent: "center",
  },
});
