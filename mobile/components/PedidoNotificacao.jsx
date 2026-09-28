import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AVISO_PUSH,
  MOTIVO,
  MOTIVO_SEM_RECURSO,
  adiarPedido,
  ativarNotificacao,
  lerPedido,
} from "../lib/notificacoes";
import { alturaBarra } from "./BarraAbas";
import { CORES, FONTES } from "../lib/tema";

export function PedidoNotificacao({ uid }) {
  const insets = useSafeAreaInsets();
  const [aberto, setAberto] = useState(false);
  const [aviso, setAviso] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [semRecurso, setSemRecurso] = useState(false);

  useEffect(() => {
    lerPedido()
      .then((valor) => setAberto(!valor))
      .catch(() => setAberto(false));
  }, []);

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
      // Quando o ambiente não tem push, insistir é inútil. A tela oferece sair.
      if (res.motivo === MOTIVO_SEM_RECURSO) setSemRecurso(true);
    } catch (erro) {
      setAviso(AVISO_PUSH[MOTIVO.ERRO]);
      if (__DEV__) console.warn("Crescer: falha ao ativar o aviso.", erro?.message || erro);
    } finally {
      setOcupado(false);
    }
  }

  async function sair() {
    await adiarPedido();
    setAberto(false);
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View style={[estilos.cartao, { bottom: alturaBarra(insets.bottom) + 12 }]}>
        <Text style={estilos.titulo}>Ative as notificações</Text>
        <Text style={estilos.texto}>
          Quando a programação de hoje mudar, o aviso chega mesmo com o app fechado.
        </Text>
        {aviso ? <Text style={estilos.aviso}>{aviso}</Text> : null}
        <View style={estilos.acoes}>
          {semRecurso ? (
            <Pressable onPress={sair} style={estilos.principal}>
              <Text style={estilos.principalTexto}>Entendi</Text>
            </Pressable>
          ) : (
            <Pressable onPress={ativar} disabled={ocupado} style={estilos.principal}>
              <Text style={estilos.principalTexto}>
                {ocupado ? "Ativando" : "Ativar notificações"}
              </Text>
            </Pressable>
          )}
          <Pressable onPress={sair} disabled={ocupado}>
            <Text style={estilos.depois}>{semRecurso ? "Agora não" : "Depois"}</Text>
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
