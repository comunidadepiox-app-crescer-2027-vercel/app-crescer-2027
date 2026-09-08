// Abertura do app: vídeo da logo do Crescer se montando sobre o roxo oficial,
// com o lettering branco da marca surgindo ao final. Só sai quando o vídeo
// terminou e a sessão do Firebase foi resolvida.
import { useEffect, useRef, useState } from "react";
import { View, Image, Animated, StyleSheet, useWindowDimensions } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useAuth } from "../lib/authProvider";
import { CORES } from "../lib/tema";

const FALLBACK_MS = 6000;
const MOSTRA_WORDMARK_MS = 2800;
const DURACAO_SAIDA_MS = 450;

const video = require("../assets/brand/splash-crescer.mp4");
const wordmark = require("../assets/brand/wordmark-crescer-branca.png");

export function Splash() {
  const { loading } = useAuth();
  const { width } = useWindowDimensions();
  const [animacaoCompleta, setAnimacaoCompleta] = useState(false);
  const [oculta, setOculta] = useState(false);
  const opacidade = useRef(new Animated.Value(1)).current;
  const opacidadeWordmark = useRef(new Animated.Value(0)).current;

  const player = useVideoPlayer(video, (p) => {
    p.loop = false;
    p.muted = true;
    p.play();
  });

  useEffect(() => {
    const sub = player.addListener("playToEnd", () => setAnimacaoCompleta(true));
    const fallback = setTimeout(() => setAnimacaoCompleta(true), FALLBACK_MS);
    const tWordmark = setTimeout(() => {
      Animated.timing(opacidadeWordmark, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, MOSTRA_WORDMARK_MS);
    return () => {
      sub.remove();
      clearTimeout(fallback);
      clearTimeout(tWordmark);
    };
  }, [player, opacidadeWordmark]);

  const saindo = animacaoCompleta && !loading;

  useEffect(() => {
    if (!saindo) return;
    Animated.timing(opacidade, {
      toValue: 0,
      duration: DURACAO_SAIDA_MS,
      useNativeDriver: true,
    }).start(() => setOculta(true));
  }, [saindo, opacidade]);

  if (oculta) return null;

  const larguraVideo = Math.min(width * 0.72, 300);

  return (
    <Animated.View
      pointerEvents={saindo ? "none" : "auto"}
      style={[StyleSheet.absoluteFill, estilos.fundo, { opacity: opacidade }]}
    >
      <VideoView
        player={player}
        nativeControls={false}
        contentFit="contain"
        style={{ width: larguraVideo, height: larguraVideo }}
      />
      <Animated.View style={{ opacity: opacidadeWordmark }}>
        <Image
          source={wordmark}
          resizeMode="contain"
          style={{ width: Math.min(width * 0.6, 240), height: 64, marginTop: 8 }}
        />
      </Animated.View>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    backgroundColor: CORES.roxo,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
});
