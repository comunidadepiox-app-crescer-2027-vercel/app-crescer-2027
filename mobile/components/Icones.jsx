// Ícones de linha do app, no traço único da identidade do Crescer.
import { Image } from "react-native";
import Svg, { Path, Rect, Circle } from "react-native-svg";

function Base({ children, cor = "#fff", tamanho = 24 }) {
  return (
    <Svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke={cor}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </Svg>
  );
}

export function IconeCasa(props) {
  return (
    <Base {...props}>
      <Path d="M3 10.5 12 3l9 7.5" />
      <Path d="M5.5 9.5V20a1 1 0 0 0 1 1H10v-5.5h4V21h3.5a1 1 0 0 0 1-1V9.5" />
    </Base>
  );
}

export function IconeJornal(props) {
  return (
    <Base {...props}>
      <Path d="M4 5h13v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V5Z" />
      <Path d="M17 8h3v11a2 2 0 0 1-2 2" />
      <Path d="M7.5 9h6M7.5 12.5h6M7.5 16h4" />
    </Base>
  );
}

export function IconeCalendario(props) {
  return (
    <Base {...props}>
      <Rect x={3.5} y={5} width={17} height={16} rx={2} />
      <Path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <Path d="M7.5 13h3M7.5 17h3M13.5 13h3M13.5 17h3" />
    </Base>
  );
}

// O Benfeitor da Fé tem arte própria, em linha, e vem em duas versões: a
// branca para a aba em repouso e a dourada para a aba pressionada. A troca é
// por arquivo, não por cor, porque a cor já está na arte.
const ICONE_BENFEITOR = require("../assets/icons/icon-benfeitor.png");
const ICONE_BENFEITOR_ATIVO = require("../assets/icons/icon-benfeitor-pressionado.png");

// A arte é alta e estreita, 365 por 590. Ela entra um pouco mais alta que o
// quadrado dos ícones de linha, e a largura sai da proporção da arte.
const ALTURA_BENFEITOR = 28;
const LARGURA_BENFEITOR = Math.round((ALTURA_BENFEITOR * 365) / 590);

export function IconeBenfeitor({ focused }) {
  return (
    <Image
      source={focused ? ICONE_BENFEITOR_ATIVO : ICONE_BENFEITOR}
      style={{ width: LARGURA_BENFEITOR, height: ALTURA_BENFEITOR }}
      resizeMode="contain"
    />
  );
}

export function IconePessoa(props) {
  return (
    <Base {...props}>
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4.5 21c.8-3.5 3.9-5.5 7.5-5.5s6.7 2 7.5 5.5" />
    </Base>
  );
}

export function IconeFotos(props) {
  return (
    <Base {...props}>
      <Rect x={3.5} y={5.5} width={17} height={13} rx={2} />
      <Circle cx={9} cy={10.5} r={1.6} />
      <Path d="m5 18 4.5-4.5 3 3 3.5-3.5 4.5 4.5" />
    </Base>
  );
}

export function IconeInfo(props) {
  return (
    <Base {...props}>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 11v5M12 7.8v.4" />
    </Base>
  );
}

export function IconeSino(props) {
  return (
    <Base {...props}>
      <Path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <Path d="M10 21h4" />
    </Base>
  );
}

export function IconeSetaEsquerda(props) {
  return (
    <Base {...props}>
      <Path d="M15 5 7 12l8 7" />
    </Base>
  );
}

export function IconeGrade(props) {
  return (
    <Base {...props}>
      <Rect x={3.5} y={3.5} width={7} height={7} rx={1.6} />
      <Rect x={13.5} y={3.5} width={7} height={7} rx={1.6} />
      <Rect x={3.5} y={13.5} width={7} height={7} rx={1.6} />
      <Rect x={13.5} y={13.5} width={7} height={7} rx={1.6} />
    </Base>
  );
}

export function IconeGoogle({ cor = "#310073", tamanho = 18 }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 16 16" fill={cor}>
      <Path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
    </Svg>
  );
}
