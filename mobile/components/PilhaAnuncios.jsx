import { useEffect, useState } from "react";
import {
  View,
  Image,
  Pressable,
  Modal,
  Text,
  StyleSheet,
  useWindowDimensions,
  Linking,
  AppState,
} from "react-native";
import { observarAnunciosAtivos } from "../lib/anuncios";
import { FONTES } from "../lib/tema";

function abreLink(url) {
  const texto = String(url || "").trim();
  if (!/^https?:\/\//i.test(texto)) return;
  Linking.openURL(texto).catch(() => {});
}

function caixaDaImagem(naturalW, naturalH, maxW, maxH) {
  if (!naturalW || !naturalH) return null;
  const proporcao = naturalW / naturalH;
  let largura = maxW;
  let altura = largura / proporcao;
  if (altura > maxH) {
    altura = maxH;
    largura = altura * proporcao;
  }
  return { largura, altura };
}

let entradaPendente = true;

AppState.addEventListener("change", (estado) => {
  if (estado === "background") entradaPendente = true;
});

export function PilhaAnuncios() {
  const { width, height } = useWindowDimensions();
  const [fila, setFila] = useState([]);
  const [medida, setMedida] = useState(null);
  const frente = fila[0];
  const maxW = Math.min(width * 0.86, 360);
  const maxH = Math.max(120, Math.min(height * 0.72, height - 44 - 56 - 48));
  const caixa = medida ? caixaDaImagem(medida.w, medida.h, maxW, maxH) : null;

  useEffect(() => {
    const listaAtual = { itens: [] };
    let recebeuLista = false;

    function abrirSeEntrada() {
      if (!recebeuLista || !entradaPendente) return;
      entradaPendente = false;
      setFila(listaAtual.itens.slice());
    }

    const parar = observarAnunciosAtivos(
      (lista) => {
        listaAtual.itens = lista;
        recebeuLista = true;
        abrirSeEntrada();
      },
      () => {
        recebeuLista = true;
        entradaPendente = false;
      }
    );

    const sub = AppState.addEventListener("change", (estado) => {
      if (estado === "active") abrirSeEntrada();
    });

    return () => {
      parar();
      sub.remove();
    };
  }, []);

  useEffect(() => {
    const url = frente?.imageUrl;
    if (!url) {
      setMedida(null);
      return;
    }
    let vivo = true;
    setMedida(null);
    Image.getSize(
      url,
      (w, h) => {
        if (vivo && w > 0 && h > 0) setMedida({ w, h });
      },
      () => {}
    );
    return () => {
      vivo = false;
    };
  }, [frente?.imageUrl]);

  if (fila.length === 0) return null;

  function fechar() {
    setFila((f) => f.slice(1));
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={fechar}>
      <View style={estilos.fundo}>
        {caixa ? (
          <View style={{ width: caixa.largura }}>
            <Pressable onPress={fechar} style={estilos.fechar} accessibilityLabel="Fechar anúncio">
              <Text style={estilos.xis}>×</Text>
            </Pressable>
            <View style={{ width: caixa.largura, height: caixa.altura }}>
              {fila.slice(0, 4).map((item, indice) => {
                const naFrente = indice === 0;
                return (
                  <View
                    key={item.id}
                    style={[
                      estilos.cartaz,
                      {
                        width: caixa.largura,
                        height: caixa.altura,
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
                      <Image source={{ uri: item.imageUrl }} style={estilos.imagem} resizeMode="cover" />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <Pressable
            onPress={fechar}
            style={[estilos.fechar, estilos.fecharSolto]}
            accessibilityLabel="Fechar anúncio"
          >
            <Text style={estilos.xis}>×</Text>
          </Pressable>
        )}
        {frente?.linkUrl && caixa ? (
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
    overflow: "hidden",
  },
  imagemWrap: { flex: 1 },
  imagem: { width: "100%", height: "100%" },
  fechar: {
    alignSelf: "flex-end",
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  fecharSolto: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  xis: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 32,
    lineHeight: 36,
    color: "#fff",
  },
  dica: {
    marginTop: 40,
    fontFamily: FONTES.corpo,
    fontSize: 13,
    color: "#fff",
  },
});
