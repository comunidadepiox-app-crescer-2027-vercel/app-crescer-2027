import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Linking,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AudioLines from "lucide-react-native/icons/audio-lines";
import Contact from "lucide-react-native/icons/contact";
import HandHeart from "lucide-react-native/icons/hand-heart";
import Handshake from "lucide-react-native/icons/handshake";
import MapPinned from "lucide-react-native/icons/map-pinned";
import UserGroup from "lucide-react-native/icons/user-group";
import ShoppingBag from "lucide-react-native/icons/shopping-bag";
import Ticket from "lucide-react-native/icons/ticket";
import { useRouter } from "expo-router";
import { CORES, FONTES } from "../lib/tema";
import { abreLinkExterno, LINK_PARTICIPAR } from "../lib/links";

const terco = require("../assets/icons/icone-novo.png");
const testemunhos = require("../assets/icons/icone-testemunhos.png");
const { height: ALTURA_TELA } = Dimensions.get("window");

// url com o destino no navegador. avisar: o endereço ainda não foi informado
// pela comunidade, então o toque mostra o aviso em vez de abrir uma página em
// branco. indisponivel: o ícone aparece apagado e não responde ao toque.
const ITENS = [
  { rotulo: "Terço da Restauração das Famílias", imagem: terco, rota: "/terco-restauracao" },
  { rotulo: "Participar", Icone: Ticket, url: LINK_PARTICIPAR, avisar: true },
  { rotulo: "Faça sua Doação", Icone: HandHeart, rota: "/colabore" },
  { rotulo: "Seja Voluntário", Icone: Handshake },
  { rotulo: "Loja", Icone: ShoppingBag, url: "https://usedevotum.com.br/colecao-arte-piedosa/" },
  { rotulo: "Seja Fornecedor", Icone: Contact, rota: "/fornecedor" },
  { rotulo: "Testemunhos", imagem: testemunhos, tamanhoImagem: 50, rota: "/testemunhos" },
  { rotulo: "Spotify", Icone: AudioLines },
  { rotulo: "Mapa do Evento", Icone: MapPinned, indisponivel: true },
  { rotulo: "Congresso", Icone: UserGroup, indisponivel: true },
];

export function MenuAtalhos({ aberto, onFechar, alturaBarra = 0 }) {
  const router = useRouter();
  const [visivel, setVisivel] = useState(aberto);
  
  // Animações nativas
  const translateY = useRef(new Animated.Value(ALTURA_TELA)).current;
  const opacidade = useRef(new Animated.Value(0)).current;

  // Guardamos a ref da função de fechar para callbacks
  const onFecharRef = useRef(onFechar);
  onFecharRef.current = onFechar;

  useEffect(() => {
    if (aberto) {
      setVisivel(true);
      // Entradas em mola (Spring) dão sensação de resposta imediata e natural
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 25,
          mass: 0.8,
          stiffness: 260,
        }),
        Animated.timing(opacidade, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Saída rápida e suave
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: ALTURA_TELA,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacidade, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setVisivel(false);
      });
    }
  }, [aberto, translateY, opacidade]);

  // Gestos de arrastar para fechar (PanResponder)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesto) =>
        gesto.dy > 5 && Math.abs(gesto.dy) > Math.abs(gesto.dx),

      onPanResponderMove: (_, gesto) => {
        // Permite apenas arrastar para baixo
        if (gesto.dy > 0) {
          translateY.setValue(gesto.dy);
          // Reduz a opacidade do fundo proporcionalmente ao arrasto
          const progresso = Math.max(0, 1 - gesto.dy / 300);
          opacidade.setValue(progresso);
        }
      },

      onPanResponderRelease: (_, gesto) => {
        // Se arrastou mais de 90px ou deu um "flick" rápido para baixo
        if (gesto.dy > 90 || gesto.vy > 0.5) {
          onFecharRef.current?.();
        } else {
          // Caso contrário, volta para a posição aberta com efeito de mola
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              bounciness: 4,
              speed: 14,
            }),
            Animated.timing(opacidade, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  if (!visivel && !aberto) return null;

  return (
    <View style={[estilos.overlay, { bottom: alturaBarra }]} accessibilityViewIsModal>
      {/* Fundo escurecido clicável para fechar */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onFechar}>
        <Animated.View style={[estilos.fundo, { opacity: opacidade }]} />
      </Pressable>

      {/* Cartão do Menu */}
      <Animated.View
        style={[estilos.folha, { transform: [{ translateY }] }]}
      >
        <View style={estilos.alcaToque} {...panResponder.panHandlers}>
          <View style={estilos.alca} />
        </View>

        <View style={estilos.grade}>
          {ITENS.map(({ rotulo, Icone, imagem, tamanhoImagem, rota, url, indisponivel, avisar, descricao }) => {
            const conteudo = <>
              <View style={estilos.poco}>
                {imagem ? (
                  <Image
                    source={imagem}
                    style={[estilos.terco, tamanhoImagem ? { width: tamanhoImagem, height: tamanhoImagem } : null]}
                    resizeMode="contain"
                  />
                ) : (
                  <Icone color={CORES.roxoBotao} size={34} strokeWidth={2} />
                )}
              </View>
              <Text style={[estilos.rotulo, indisponivel && estilos.rotuloIndisponivel]}>{rotulo}</Text>
            </>;
            if (indisponivel) {
              return <Pressable key={rotulo} accessibilityRole="button" accessibilityLabel={rotulo} accessibilityState={{ disabled: true }} disabled style={[estilos.item, estilos.itemIndisponivel]}>{conteudo}</Pressable>;
            }
            if (url) {
              // avisar: a URL ainda não foi informada pela comunidade. O toque
              // mostra o aviso em vez de abrir uma página em branco.
              const abrir = avisar
                ? () => abreLinkExterno(url)
                : () => { onFechar(); Linking.openURL(url).catch(() => {}); };
              return <Pressable key={rotulo} accessibilityRole="link" accessibilityLabel={descricao || rotulo} onPress={abrir} style={({ pressed }) => [estilos.item, pressed && { opacity: 0.72 }]}>{conteudo}</Pressable>;
            }
            if (!rota) return <View key={rotulo} style={estilos.item}>{conteudo}</View>;
            return <Pressable key={rotulo} accessibilityRole="button" accessibilityLabel={rotulo} onPress={() => { onFechar(); router.push(rota); }} style={({ pressed }) => [estilos.item, pressed && { opacity: 0.72 }]}>{conteudo}</Pressable>;
          })}
        </View>
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: "transparent",
  },
  fundo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 12, 28, 0.45)",
  },
  folha: {
    position: "absolute",
    zIndex: 2,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: CORES.superficie,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingBottom: 28,
    overflow: "hidden",
  },
  alcaToque: {
    alignSelf: "stretch",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 18,
  },
  alca: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D5D5D5",
  },
  // Grade de três colunas, empacotada pela esquerda. Com space-between, a
  // última linha de dois itens jogava um para cada ponta e abria um buraco no
  // meio. Aqui a linha cheia continua distribuída e a parcial só deixa a sobra
  // na direita, com os itens sempre encostados um no outro.
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    rowGap: 20,
  },
  item: {
    width: "33%",
    alignItems: "center",
    gap: 10,
  },
  poco: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#F3F1F1",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  terco: {
    width: 75,
    height: 75,
  },
  rotulo: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 11,
    letterSpacing: 0.6,
    color: "#8E8E8E",
    textTransform: "uppercase",
    textAlign: "center",
  },
  itemIndisponivel: {
    opacity: 0.42,
  },
  rotuloIndisponivel: {
    color: "#B4B4B4",
  },
});
