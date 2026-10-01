import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CORES, FONTES } from "../lib/tema";

export const ALTURA_ABAS = 64;
export const FOLGA_CIRCULO = 21;

// Todo ícone da barra passa por uma caixa com a mesma altura, e é a caixa que
// segura o alinhamento. Sem ela, a aba do Benfeitor, que tem arte alta, fica
// com a coluna mais comprida que as outras e o rótulo dela desce.
const TAMANHO_ICONE = 24;
const ALTURA_ICONE = 28;

// Logo do botão central (círculo laranja). Troque o arquivo em
// mobile/assets/logo-menu-central.png e ajuste o tamanho aqui.
const LOGO_MENU_CENTRAL = require("../assets/logo-menu-central.png");
export const TAMANHO_LOGO_MENU = 35;

// Os nomes são os das rotas de mobile/app/(tabs). Benfeitor voltou para a
// lista em 01/10/2026: antes disso ele era um link externo desenhado no mesmo
// componente, e o item de link saiu junto com o LINK_BENFEITOR. Agenda é
// programacao, sem acento, porque é assim que o arquivo se chama.
const ORDEM = ["home", "noticias", "programacao", "benfeitor"];

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
            <Image
              source={LOGO_MENU_CENTRAL}
              style={{ width: TAMANHO_LOGO_MENU, height: TAMANHO_LOGO_MENU }}
              resizeMode="contain"
            />
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
      <View style={estilos.icone}>
        {options.tabBarIcon?.({ color: cor, focused: ativo, size: TAMANHO_ICONE })}
      </View>
      {/* Shrink em vez de cortar: PROGRAMAÇÃO não cabe em tela estreita, e
          rótulo cortado com reticências fica pior que rótulo menor. */}
      <Text
        style={[estilos.rotulo, { color: cor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
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
  icone: {
    height: ALTURA_ICONE,
    alignItems: "center",
    justifyContent: "center",
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
