import { useEffect, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { G, Polygon } from "react-native-svg";
import { FundoRoxoPoligonal } from "./FundoPoligonal";
import { CORES, FONTES } from "../lib/tema";

const BATIDAS = [
  { texto: "COLABORE", tamanho: 46, dourada: false, pausa: 1500 },
  { texto: "COM O CRESCER", tamanho: 40, dourada: false, pausa: 1500 },
  { texto: "PRECISAMOS DA SUA", tamanho: 34, dourada: false, pausa: 1500 },
  { texto: "GENEROSIDADE", tamanho: 46, dourada: true, pausa: 1700 },
];

function mulberry32(semente) {
  return function () {
    semente |= 0;
    semente = (semente + 0x6d2b79f5) | 0;
    let t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MALHA_COLS = 5;
const MALHA_LINHAS = 10;
const MALHA_W = 400;
const MALHA_H = 800;

function constroiMalha() {
  const rand = mulberry32(20270207);
  const pts = [];
  for (let r = 0; r <= MALHA_LINHAS; r++) {
    const linha = [];
    for (let c = 0; c <= MALHA_COLS; c++) {
      const bx = (c / MALHA_COLS) * MALHA_W;
      const by = (r / MALHA_LINHAS) * MALHA_H;
      const jx = c === 0 || c === MALHA_COLS ? 0 : (rand() - 0.5) * 52;
      const jy = r === 0 || r === MALHA_LINHAS ? 0 : (rand() - 0.5) * 48;
      linha.push([bx + jx, by + jy]);
    }
    pts.push(linha);
  }
  const tris = [];
  let id = 0;
  for (let r = 0; r < MALHA_LINHAS; r++) {
    for (let c = 0; c < MALHA_COLS; c++) {
      const a = pts[r][c];
      const b = pts[r][c + 1];
      const d = pts[r + 1][c];
      const e = pts[r + 1][c + 1];
      tris.push({ id: id++, p: [a, b, d], cheio: (r * MALHA_COLS + c) % 8 === 0 });
      tris.push({ id: id++, p: [b, e, d], cheio: false });
    }
  }
  return tris;
}

async function movimentoReduzido() {
  try {
    return await Promise.race([
      AccessibilityInfo.isReduceMotionEnabled(),
      new Promise((resolve) => setTimeout(() => resolve(false), 200)),
    ]);
  } catch {
    return false;
  }
}

export function ColaboreAbertura({ onFim }) {
  const insets = useSafeAreaInsets();
  const onFimRef = useRef(onFim);
  onFimRef.current = onFim;
  const vivo = useRef(true);
  const encerrado = useRef(false);
  const podePular = useRef(false);

  const malha = useMemo(constroiMalha, []);

  const opacidade = useRef(new Animated.Value(1)).current;
  const deslocamento = useRef(new Animated.Value(0)).current;
  const divisor = useRef(new Animated.Value(0)).current;
  const overlay = useRef(new Animated.Value(1)).current;
  const revelacao = useRef(new Animated.Value(0)).current;
  const derivaX = useRef(new Animated.Value(0)).current;
  const derivaY = useRef(new Animated.Value(0)).current;
  const halo = useRef(new Animated.Value(0)).current;
  const flutua = useRef(new Animated.Value(0)).current;

  const [indice, setIndice] = useState(0);
  const [reduzido, setReduzido] = useState(false);

  useEffect(() => {
    if (reduzido) return undefined;
    const lacoX = Animated.loop(
      Animated.sequence([
        Animated.timing(derivaX, {
          toValue: 1,
          duration: 10000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(derivaX, {
          toValue: 0,
          duration: 10000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    const lacoY = Animated.loop(
      Animated.sequence([
        Animated.timing(derivaY, {
          toValue: 1,
          duration: 12000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(derivaY, {
          toValue: 0,
          duration: 12000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    const lacoHalo = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(halo, {
          toValue: 0,
          duration: 5000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    const lacoFlutua = Animated.loop(
      Animated.sequence([
        Animated.timing(flutua, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(flutua, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    lacoX.start();
    lacoY.start();
    lacoHalo.start();
    lacoFlutua.start();
    return () => {
      lacoX.stop();
      lacoY.stop();
      lacoHalo.stop();
      lacoFlutua.stop();
    };
  }, [derivaX, derivaY, flutua, halo, reduzido]);

  useEffect(() => {
    vivo.current = true;
    encerrado.current = false;
    const esperas = [];

    const liberaPulo = setTimeout(() => {
      podePular.current = true;
    }, 700);
    esperas.push(liberaPulo);

    function espera(ms) {
      return new Promise((resolve) => {
        const t = setTimeout(resolve, ms);
        esperas.push(t);
      });
    }

    function anima(av, toValue, duration, useNativeDriver, easing) {
      return new Promise((resolve) => {
        if (!vivo.current) {
          resolve();
          return;
        }
        Animated.timing(av, {
          toValue,
          duration,
          easing: easing || Easing.out(Easing.quad),
          useNativeDriver,
        }).start(() => resolve());
      });
    }

    function terminar() {
      if (encerrado.current) return;
      encerrado.current = true;
      vivo.current = false;
      onFimRef.current();
    }

    async function mostrar() {
      opacidade.setValue(0);
      deslocamento.setValue(12);
      if (vivo.current) {
        await new Promise((resolve) => {
          Animated.parallel([
            Animated.timing(opacidade, {
              toValue: 1,
              duration: 650,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(deslocamento, {
              toValue: 0,
              duration: 800,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start(() => resolve());
        });
      }
    }

    async function esconder() {
      if (!vivo.current) return;
      await new Promise((resolve) => {
        Animated.parallel([
          Animated.timing(opacidade, {
            toValue: 0,
            duration: 550,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(deslocamento, {
            toValue: -10,
            duration: 600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]).start(() => resolve());
      });
    }

    async function rodar() {
      const motion = await movimentoReduzido();
      if (!vivo.current) return;
      if (motion) {
        setReduzido(true);
        setIndice(BATIDAS.length - 1);
        opacidade.setValue(1);
        divisor.setValue(1);
        await espera(1600);
        if (!vivo.current) return;
        await anima(overlay, 0, 400, true, Easing.inOut(Easing.sin));
        terminar();
        return;
      }
      for (let i = 0; i < BATIDAS.length; i++) {
        if (!vivo.current) return;
        setIndice(i);
        divisor.setValue(0);
        await mostrar();
        if (!vivo.current) return;
        if (i === BATIDAS.length - 1) {
          Animated.timing(divisor, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }).start();
        }
        await espera(BATIDAS[i].pausa);
        if (!vivo.current) return;
        if (i < BATIDAS.length - 1) {
          await esconder();
        }
      }
      if (!vivo.current) return;
      await new Promise((resolve) => {
        Animated.parallel([
          Animated.timing(overlay, {
            toValue: 0,
            duration: 600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(revelacao, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]).start(() => resolve());
      });
      terminar();
    }

    rodar();

    return () => {
      vivo.current = false;
      esperas.forEach(clearTimeout);
    };
  }, [deslocamento, divisor, opacidade, overlay, revelacao]);

  function pular() {
    if (!podePular.current || encerrado.current) return;
    encerrado.current = true;
    vivo.current = false;
    opacidade.stopAnimation();
    deslocamento.stopAnimation();
    divisor.stopAnimation();
    overlay.stopAnimation();
    derivaX.stopAnimation();
    derivaY.stopAnimation();
    halo.stopAnimation();
    flutua.stopAnimation();
    onFimRef.current();
  }

  const batida = BATIDAS[Math.min(indice, BATIDAS.length - 1)];

  return (
    <Animated.View
      style={[estilos.camada, { opacity: overlay }]}
      accessibilityViewIsModal
      pointerEvents="auto"
    >
      <Pressable
        onPress={pular}
        accessibilityRole="button"
        accessibilityLabel="Pular abertura e ir para a oferta"
        style={estilos.toque}
      >
        <FundoRoxoPoligonal style={estilos.fundo}>
          <View pointerEvents="none" style={estilos.ambiente}>
            <Animated.View
              style={[
                estilos.malha,
                {
                  transform: [
                    {
                      translateX: derivaX.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-12, 12],
                      }),
                    },
                    {
                      translateY: derivaY.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-14, 14],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Svg
                viewBox={`0 0 ${MALHA_W} ${MALHA_H}`}
                preserveAspectRatio="xMidYMid slice"
                style={StyleSheet.absoluteFill}
              >
                <G stroke="#ffffff" strokeWidth={1.1} opacity={0.5} fill="none">
                  {malha.map((t) => (
                    <Polygon
                      key={t.id}
                      points={t.p.map((p) => p.join(",")).join(" ")}
                      fill={t.cheio ? CORES.dourado : "none"}
                      fillOpacity={t.cheio ? 0.1 : 0}
                    />
                  ))}
                </G>
              </Svg>
            </Animated.View>
            <Animated.View
              style={[
                estilos.halo,
                {
                  opacity: halo.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.04, 0.07],
                  }),
                  transform: [
                    {
                      scale: halo.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.05],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                estilos.anelDourado,
                {
                  opacity: flutua.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 0.32],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                estilos.ponto,
                estilos.ponto1,
                {
                  opacity: flutua.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.35, 0.65],
                  }),
                  transform: [
                    {
                      translateY: flutua.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -8],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                estilos.ponto,
                estilos.ponto2,
                {
                  opacity: flutua.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 0.3],
                  }),
                  transform: [
                    {
                      translateY: flutua.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 7],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                estilos.pontoBranco,
                estilos.ponto3,
                {
                  opacity: derivaY.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.25, 0.45],
                  }),
                  transform: [
                    {
                      translateY: derivaY.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -11],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                estilos.pontoBranco,
                estilos.ponto4,
                {
                  opacity: derivaX.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 0.2],
                  }),
                  transform: [
                    {
                      translateY: derivaX.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 10],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
          <View style={estilos.centro}>
            <Animated.View
              style={{
                opacity: reduzido ? 1 : opacidade,
                width: "100%",
                alignItems: "center",
                transform: reduzido ? [] : [{ translateY: deslocamento }],
              }}
            >
              <Text
                style={[
                  estilos.batia,
                  { fontSize: batida.tamanho, lineHeight: batida.tamanho * 1.15 },
                  batida.dourada && estilos.batiaDourada,
                ]}
                accessibilityLiveRegion="polite"
              >
                {batida.texto}
              </Text>
              {indice === BATIDAS.length - 1 ? (
                <Animated.View
                  style={[estilos.divisor, { transform: [{ scaleX: divisor }] }]}
                />
              ) : null}
            </Animated.View>
          </View>
          <View style={[estilos.rodape, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={estilos.marcadores}>
              {BATIDAS.map((b, i) => (
                <View
                  key={b.texto}
                  style={[
                    estilos.marcador,
                    i < indice && estilos.marcadorFeito,
                    i === indice && estilos.marcadorAtivo,
                  ]}
                />
              ))}
            </View>
            <Text style={estilos.dica}>Toque para continuar</Text>
          </View>
        </FundoRoxoPoligonal>
      </Pressable>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  camada: {
    flex: 1,
    backgroundColor: CORES.roxo,
  },
  toque: {
    flex: 1,
  },
  fundo: {
    flex: 1,
  },
  ambiente: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  malha: {
    position: "absolute",
    top: -30,
    bottom: -30,
    left: -30,
    right: -30,
  },
  halo: {
    position: "absolute",
    top: "30%",
    left: "12%",
    right: "12%",
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: "#ffffff",
  },
  anelDourado: {
    position: "absolute",
    bottom: 140,
    right: -46,
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: CORES.dourado,
  },
  ponto: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: CORES.dourado,
  },
  pontoBranco: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ffffff",
  },
  ponto1: { top: "22%", left: "16%" },
  ponto2: { top: "36%", right: "14%" },
  ponto3: { bottom: "32%", left: "28%" },
  ponto4: { top: "58%", right: "26%" },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  batia: {
    fontFamily: FONTES.titulo,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textAlign: "center",
    color: "#fff",
  },
  batiaDourada: {
    color: CORES.dourado,
  },
  divisor: {
    marginTop: 18,
    width: 120,
    height: 3,
    borderRadius: 2,
    backgroundColor: CORES.dourado,
  },
  rodape: {
    alignItems: "center",
    paddingTop: 8,
  },
  marcadores: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  marcador: {
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  marcadorFeito: {
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  marcadorAtivo: {
    backgroundColor: CORES.dourado,
  },
  dica: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 13,
    letterSpacing: 0.4,
    textAlign: "center",
    color: "rgba(255,255,255,0.7)",
  },
});
