import { useId } from "react";

// Coração do Crescer redesenhado em vetor a partir do símbolo oficial:
// coração cheio com um coração menor vazado no alto e quatro linhas
// curvas aninhadas (as "mãos") na metade inferior. As peças ficam
// separadas para a splash poder montá-lo peça por peça.
const CORACAO_EXTERNO =
  "M120 218C60 170 14 130 14 78 14 40 44 16 76 16c20 0 36 10 44 24 8-14 24-24 44-24 32 0 62 24 62 62 0 52-46 92-106 140Z";
const CORACAO_INTERNO =
  "M120 128C92 106 66 88 66 66c0-19 15-30 30-30 10 0 19 5 24 14 5-9 14-14 24-14 15 0 30 11 30 30 0 22-26 40-54 62Z";
const CORPO = `${CORACAO_EXTERNO} ${CORACAO_INTERNO}`;

// Cada linha é o contorno de fundo de um coração aninhado, com um vinco
// suave no centro, como no símbolo oficial.
const LINHAS = [
  "M32 118 C54 138 100 152 120 156 C140 152 186 138 208 118",
  "M44 134 C62 152 100 167 120 171 C140 167 178 152 196 134",
  "M58 150 C74 166 102 182 120 186 C138 182 166 166 182 150",
  "M74 167 C86 180 104 196 120 200 C136 196 154 180 166 167",
];

export function SimboloCrescer({ animado = false, corLinhas = "#3a1075", className = "" }) {
  const id = useId();
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-dourado`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8dfae" />
          <stop offset="0.5" stopColor="#e9c17e" />
          <stop offset="1" stopColor="#c39a58" />
        </linearGradient>
        <clipPath id={`${id}-esq`}>
          <rect x="0" y="0" width="120" height="240" />
        </clipPath>
        <clipPath id={`${id}-dir`}>
          <rect x="120" y="0" width="120" height="240" />
        </clipPath>
        <clipPath id={`${id}-coracao`}>
          <path d={CORACAO_EXTERNO} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-esq)`} className={animado ? "splash-metade-esquerda" : undefined}>
        <path d={CORPO} fillRule="evenodd" fill={`url(#${id}-dourado)`} />
      </g>
      <g clipPath={`url(#${id}-dir)`} className={animado ? "splash-metade-direita" : undefined}>
        <path d={CORPO} fillRule="evenodd" fill={`url(#${id}-dourado)`} />
      </g>

      <g
        clipPath={`url(#${id}-coracao)`}
        fill="none"
        stroke={corLinhas}
        strokeWidth="5"
        strokeLinecap="round"
      >
        {LINHAS.map((d, i) => (
          <path
            key={d}
            d={d}
            className={animado ? "splash-arco" : undefined}
            style={animado ? { animationDelay: `${1.05 + i * 0.15}s` } : undefined}
          />
        ))}
      </g>
    </svg>
  );
}
