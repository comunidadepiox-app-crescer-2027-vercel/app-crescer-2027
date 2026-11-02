import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AVISO_PUSH,
  MOTIVO,
  ativarNotificacao,
  lerPedido,
  sincronizarNotificacao,
} from "../lib/notificacoes";
import { alturaBarra } from "./BarraAbas";
import { CORES, FONTES } from "../lib/tema";

export function PedidoNotificacao({ uid }) {
  const insets = useSafeAreaInsets();
  const [aberto, setAberto] = useState(false);
  const [aviso, setAviso] = useState("");
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    Promise.all([
      lerPedido().catch(() => null),
      sincronizarNotificacao(uid).catch((erro) => {
        if (__DEV__) console.warn("Crescer: falha ao sincronizar notifica\u00e7\u00e3o.", erro?.message || erro);
        return null;
      }),
    ]).then(([valor, res]) => setAberto(valor !== "aceito" && !res?.ok));
  }, [uid]);

  if (!aberto) return null;

  async function ativar() {
    setAviso("");
    setOcupado(true);
    try {
      const res = await ativarNotificacao(uid);
      if (res.ok) {
        setAberto(false);
        return;
      }
      setAviso(AVISO_PUSH[res.motivo] || AVISO_PUSH[MOTIVO.ERRO]);
    } catch (erro) {
      setAviso(AVISO_PUSH[MOTIVO.ERRO]);
      if (__DEV__) console.warn("Crescer: falha ao ativar o aviso.", erro?.message || erro);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View style={[estilos.cartao, { bottom: alturaBarra(insets.bottom) + 12 }]}>
        <Text style={estilos.titulo}>Ative as notifica&#231;&#245;es</Text>
        <Text style={estilos.texto}>
          Quando a programa&#231;&#227;o de hoje mudar, o aviso chega mesmo com o app fechado.
        </Text>
        {aviso ? <Text style={estilos.aviso}>{aviso}</Text> : null}
        <View style={estilos.acoes}>
          <Pressable onPress={ativar} disabled={ocupado} style={estilos.principal}>
            <Text style={estilos.principalTexto}>
              {ocupado ? "Ativando" : "Ativar notifica\u00e7\u00f5es"}
            </Text>
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
});
