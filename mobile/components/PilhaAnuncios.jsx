import { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  Pressable,
  Modal,
  Text,
  StyleSheet,
  useWindowDimensions,
  Linking,
} from "react-native";
import { diaJaVisto, marcarDiaVisto, observarAnunciosAtivos } from "../lib/anuncios";
import { CORES, FONTES } from "../lib/tema";

function abreLink(url) {
  const texto = String(url || "").trim();
  if (!/^https?:\/\//i.test(texto)) return;
  Linking.openURL(texto).catch(() => {});
}

export function PilhaAnuncios() {
  const { width, height } = useWindowDimensions();
  const [fila, setFila] = useState([]);
  const decidiu = useRef(false);
  const largura = Math.min(width * 0.78, 340);
  const altura = Math.min(height * 0.7, largura * 1.7);

  useEffect(() => {
    return observarAnunciosAtivos(
      async (lista) => {
        if (decidiu.current) return;
        decidiu.current = true;
        const visto = await diaJaVisto();
        if (visto || lista.length === 0) return;
        await marcarDiaVisto();
        setFila(lista);
      },
      () => {
        decidiu.current = true;
      }
    );
  }, []);

  if (fila.length === 0) return null;

  const frente = fila[0];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => setFila((f) => f.slice(1))}>
      <View style={estilos.fundo}>
        <View style={{ position: "relative", width: largura, height: altura }}>
          {fila.slice(0, 4).map((item, indice) => {
            const naFrente = indice === 0;
            return (
              <View
                key={item.id}
                style={[
                  estilos.cartaz,
                  {
                    width: largura,
                    height: altura,
                    zIndex: 10 - indice,
                    transform: [{ translateY: indice * 12 }, { scale: 1 - indice * 0.035 }],
                  },
                ]}
              >
                <Pressable
                  disabled={!naFrente}
                  onPress={() => naFrente && abreLink(item.linkUrl)}
                  style={estilos.imagemWrap}
                >
                  <Image source={{ uri: item.imageUrl }} style={estilos.imagem} resizeMode="contain" />
                </Pressable>
                {naFrente ? (
                  <Pressable
                    onPress={() => setFila((f) => f.slice(1))}
                    style={estilos.fechar}
                    accessibilityLabel="Fechar anúncio"
                  >
                    <Text style={estilos.xis}>X</Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>
        {frente?.linkUrl ? (
          <Text style={estilos.dica}>Toque na imagem para abrir o link.</Text>
        ) : null}
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "rgba(17, 28, 45, 0.72)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  cartaz: {
    position: "absolute",
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.linha,
  },
  imagemWrap: { flex: 1 },
  imagem: { width: "100%", height: "100%" },
  fechar: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.linha,
  },
  xis: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 16,
    color: CORES.titulo,
  },
  dica: {
    marginTop: 16,
    fontFamily: FONTES.corpo,
    fontSize: 13,
    color: "#fff",
  },
});
