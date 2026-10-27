import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { Botao } from "./Ui";
import { CORES, FONTES, RAIO } from "../lib/tema";

export function FormularioJotform({ url }) {
  const webRef = useRef(null);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [erro, setErro] = useState(false);

  const aoVoltar = useCallback(() => {
    if (!podeVoltar) return false;
    webRef.current?.goBack();
    return true;
  }, [podeVoltar]);

  useEffect(() => {
    if (Platform.OS !== "android") return undefined;
    const inscricao = BackHandler.addEventListener("hardwareBackPress", aoVoltar);
    return () => inscricao.remove();
  }, [aoVoltar]);

  function aoSolicitar(req) {
    const alvo = req.url || "";
    if (!alvo || alvo === "about:blank") return true;
    if (/^(https?:|data:|blob:|file:)/i.test(alvo)) return true;
    Linking.openURL(alvo).catch(() => {});
    return false;
  }

  function tentarDeNovo() {
    setErro(false);
    webRef.current?.reload();
  }

  return (
    <View style={estilos.caixa}>
      <WebView
        ref={webRef}
        source={{ uri: url }}
        style={estilos.web}
        containerStyle={estilos.web}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        allowsBackForwardNavigationGestures
        setSupportMultipleWindows={false}
        startInLoadingState
        renderLoading={() => (
          <View style={estilos.carregando}>
            <ActivityIndicator color={CORES.titulo} />
          </View>
        )}
        onLoad={() => setErro(false)}
        onError={() => setErro(true)}
        onNavigationStateChange={(estado) => setPodeVoltar(estado.canGoBack)}
        onShouldStartLoadWithRequest={aoSolicitar}
        onOpenWindow={(evento) => {
          const alvo = evento.nativeEvent.targetUrl;
          if (alvo) Linking.openURL(alvo).catch(() => {});
        }}
      />
      {erro ? (
        <View style={estilos.erroFundo}>
          <View style={estilos.erroCartao}>
            <Text style={estilos.erroTitulo}>Não foi possível carregar o formulário</Text>
            <Text style={estilos.erroTexto}>
              Verifique a conexão e tente de novo. Se continuar, abra o formulário no
              navegador do aparelho.
            </Text>
            <Botao titulo="Tentar de novo" onPress={tentarDeNovo} style={estilos.botao} />
            <Botao
              titulo="Abrir no navegador"
              variante="contorno"
              onPress={() => Linking.openURL(url).catch(() => {})}
              style={estilos.botao}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  web: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  carregando: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CORES.fundo,
  },
  erroFundo: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: CORES.fundo,
  },
  erroCartao: {
    width: "100%",
    maxWidth: 420,
    padding: 20,
    gap: 10,
    borderRadius: RAIO.cartao,
    borderWidth: 1,
    borderColor: CORES.linha,
    backgroundColor: CORES.superficie,
  },
  erroTitulo: {
    fontFamily: FONTES.titulo,
    fontSize: 20,
    lineHeight: 25,
    textTransform: "uppercase",
    color: CORES.titulo,
  },
  erroTexto: {
    fontFamily: FONTES.corpo,
    fontSize: 15,
    lineHeight: 22,
    color: CORES.texto,
  },
  botao: {
    alignSelf: "stretch",
  },
});
