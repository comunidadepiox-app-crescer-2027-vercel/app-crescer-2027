import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ativarNotificacao, adiarPedido, lerPedido } from "../lib/notificacoes";
import { CORES, FONTES } from "../lib/tema";

export function PedidoNotificacao({ uid }) {
  const insets = useSafeAreaInsets();
  const [aberto, setAberto] = useState(false);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    lerPedido()
      .then((valor) => setAberto(!valor))
      .catch(() => setAberto(false));
  }, []);

  if (!aberto) return null;

  async function ativar() {
    setAviso("");
    try {
      const res = await ativarNotificacao(uid);
      if (res.ok) {
        setAberto(false);
        return;
      }
      if (res.motivo === "negado") {
        setAviso("Sem a permissão, a mudança da programação não chega neste celular.");
        return;
      }
      setAviso("A notificação com o app fechado pede o aplicativo instalado.");
    } catch {
      setAviso("Não foi possível ativar agora.");
    }
  }

  async function depois() {
    await adiarPedido();
    setAberto(false);
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View style={[estilos.cartao, { bottom: 76 + insets.bottom }]}>
        <Text style={estilos.titulo}>Ative as notificações</Text>
        <Text style={estilos.texto}>
          Quando a programação de hoje mudar, o aviso chega mesmo com o app fechado.
        </Text>
        {aviso ? <Text style={estilos.aviso}>{aviso}</Text> : null}
        <View style={estilos.acoes}>
          <Pressable onPress={ativar} style={estilos.principal}>
            <Text style={estilos.principalTexto}>Ativar notificações</Text>
          </Pressable>
          <Pressable onPress={depois}>
            <Text style={estilos.depois}>Agora não</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.linha,
    padding: 16,
  },
  titulo: {
    fontFamily: FONTES.titulo,
    fontSize: 18,
    textTransform: "uppercase",
    color: CORES.titulo,
  },
  texto: {
    marginTop: 8,
    fontFamily: FONTES.corpo,
    fontSize: 14,
    lineHeight: 20,
    color: CORES.texto,
  },
  aviso: {
    marginTop: 8,
    fontFamily: FONTES.corpoMedio,
    fontSize: 13,
    color: CORES.destaque,
  },
  acoes: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  principal: {
    backgroundColor: CORES.titulo,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  principalTexto: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 13,
    color: "#fff",
    textTransform: "uppercase",
  },
  depois: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 13,
    color: CORES.texto,
    textDecorationLine: "underline",
  },
});
