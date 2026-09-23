// Ícones de linha do app, no traço único da identidade do Crescer.
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

export function IconeCoracaoChama(props) {
  return (
    <Base {...props}>
      <Path d="M12 21c-4.8-3.8-8-6.9-8-10.6C4 7.6 6.2 6 8.4 6c1.5 0 2.8.7 3.6 1.9C12.8 6.7 14.1 6 15.6 6 17.8 6 20 7.6 20 10.4c0 3.7-3.2 6.8-8 10.6Z" />
      <Path d="M12 2.5c.9 1 1.4 1.8 1.4 2.7A1.4 1.4 0 0 1 12 6.6a1.4 1.4 0 0 1-1.4-1.4c0-.9.5-1.7 1.4-2.7Z" />
    </Base>
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

export function IconeSetaEsquerda(props) {
  return (
    <Base {...props}>
      <Path d="M15 5 7 12l8 7" />
    </Base>
  );
}

export function IconeEngrenagem(props) {
  return (
    <Base {...props}>
      <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <Circle cx={12} cy={12} r={3} />
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
