// Kit básico de UI do app, seguindo Specs/DESIGN.md.
import { Text, TextInput, Pressable, View, StyleSheet } from "react-native";
import { CORES, FONTES, RAIO } from "../lib/tema";

export function TituloPagina({ children, style }) {
  return <Text style={[estilos.tituloPagina, style]}>{children}</Text>;
}

export function TituloSecao({ children, style }) {
  return <Text style={[estilos.tituloSecao, style]}>{children}</Text>;
}

export function Paragrafo({ children, style }) {
  return <Text style={[estilos.paragrafo, style]}>{children}</Text>;
}

export function TextoErro({ children }) {
  if (!children) return null;
  return <Text style={estilos.erro}>{children}</Text>;
}

export function TextoAviso({ children }) {
  if (!children) return null;
  return <Text style={estilos.aviso}>{children}</Text>;
}

const fundosBotao = {
  laranja: { backgroundColor: CORES.destaque },
  roxo: { backgroundColor: CORES.roxoBotao },
  contorno: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: CORES.roxoBotao,
  },
  contornoVermelho: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: CORES.vermelho,
  },
};

export function Botao({ titulo, onPress, variante = "laranja", desabilitado, icone, style }) {
  const corTexto =
    variante === "contorno" ? CORES.titulo : variante === "contornoVermelho" ? CORES.vermelho : "#fff";
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      style={({ pressed }) => [
        estilos.botao,
        fundosBotao[variante],
        desabilitado && { opacity: 0.6 },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {icone ? <View style={{ marginRight: 8 }}>{icone}</View> : null}
      <Text style={[estilos.botaoTexto, { color: corTexto }]}>{titulo}</Text>
    </Pressable>
  );
}

export function Campo({ rotulo, dica, ...props }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={estilos.rotulo}>
        {rotulo}
        {dica ? <Text style={{ color: "rgba(17,28,45,0.6)" }}> {dica}</Text> : null}
      </Text>
      <TextInput
        placeholderTextColor="rgba(17,28,45,0.35)"
        style={estilos.campo}
        {...props}
      />
    </View>
  );
}

export function Cartao({ children, style }) {
  return <View style={[estilos.cartao, style]}>{children}</View>;
}

const estilos = StyleSheet.create({
  tituloPagina: {
    fontFamily: FONTES.titulo,
    fontSize: 28,
    lineHeight: 32,
    textTransform: "uppercase",
    color: CORES.titulo,
  },
  tituloSecao: {
    fontFamily: FONTES.titulo,
    fontSize: 21,
    lineHeight: 26,
    textTransform: "uppercase",
    color: CORES.titulo,
  },
  paragrafo: {
    fontFamily: FONTES.corpo,
    fontSize: 15,
    lineHeight: 23,
    color: CORES.texto,
  },
  erro: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 14,
    color: CORES.vermelho,
  },
  aviso: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 14,
    color: CORES.verde,
  },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    borderRadius: RAIO.botao,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  botaoTexto: {
    fontFamily: FONTES.titulo,
    fontSize: 16,
    textTransform: "uppercase",
  },
  rotulo: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 14,
    color: CORES.texto,
  },
  campo: {
    borderRadius: RAIO.botao,
    borderWidth: 1,
    borderColor: CORES.linha,
    backgroundColor: CORES.superficie,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: FONTES.corpo,
    fontSize: 15,
    color: CORES.texto,
  },
  cartao: {
    borderRadius: RAIO.cartao,
    borderWidth: 1,
    borderColor: CORES.linha,
    backgroundColor: CORES.superficie,
    overflow: "hidden",
  },
});
