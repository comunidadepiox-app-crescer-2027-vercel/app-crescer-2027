// Padrão poligonal oficial: as mesmas linhas do SVG do app web,
// repetidas no tamanho real do bloco (como background-repeat).
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import { CORES } from "../lib/tema";

const TILE = 720;

function Malha({ x, y }) {
  return (
    <G
      transform={`translate(${x}, ${y})`}
      fill="none"
      stroke="#ffffff"
      strokeWidth={34}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M-40 170 220 60 470 210 720 90" />
      <Path d="M110 720 300 430 80 300" />
      <Path d="M300 430 560 560 760 420" />
      <Path d="M560 560 470 210" />
      <Path d="M220 60 300 430" />
    </G>
  );
}

function Linhas({ opacidade }) {
  const [box, setBox] = useState({ width: 0, height: 0 });

  const colunas = Math.max(1, Math.ceil(box.width / TILE));
  const linhas = Math.max(1, Math.ceil(box.height / TILE));
  const tiles = [];
  for (let r = 0; r < linhas; r++) {
    for (let c = 0; c < colunas; c++) {
      tiles.push(<Malha key={`${r}-${c}`} x={c * TILE} y={r * TILE} />);
    }
  }

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (width !== box.width || height !== box.height) {
          setBox({ width, height });
        }
      }}
    >
      {box.width > 0 ? (
        <Svg width={box.width} height={box.height} opacity={opacidade}>
          {tiles}
        </Svg>
      ) : null}
    </View>
  );
}

export function FundoRoxoPoligonal({ children, style }) {
  return (
    <View style={[{ backgroundColor: CORES.roxo, overflow: "hidden" }, style]}>
      <Linhas opacidade={0.055} />
      {children}
    </View>
  );
}

export function FundoLaranjaPoligonal({ children, style }) {
  return (
    <View style={[{ backgroundColor: CORES.laranja, overflow: "hidden" }, style]}>
      <Linhas opacidade={0.12} />
      {children}
    </View>
  );
}
