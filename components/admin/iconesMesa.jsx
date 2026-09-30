const TRACOS = {
  inicio: (
    <>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M7 10.5V20h10v-9.5" />
    </>
  ),
  noticias: (
    <>
      <path d="M7 3.5h7l5 5V20.5H7z" />
      <path d="M14 3.5V9h5" />
      <path d="M10 13h6M10 16.5h4" />
    </>
  ),
  cronograma: (
    <>
      <path d="M7 4v3M17 4v3" />
      <path d="M5 8h14" />
      <rect x="5" y="5.5" width="14" height="14" />
    </>
  ),
  citacao: (
    <>
      <path d="M8 16V11c0-2 1.2-3.5 3-3.5" />
      <path d="M16 16V11c0-2-1.2-3.5-3-3.5" />
    </>
  ),
  lista: (
    <>
      <path d="M9 7h11M9 12h11M9 17h11" />
      <path d="M5 7h.01M5 12h.01M5 17h.01" />
    </>
  ),
  numerada: (
    <>
      <path d="M10 7h10M10 12h10M10 17h10" />
      <path d="M4 8V6h2M4 13h2l-2-2.2V10h2M4 18h2.2a1 1 0 0 0 0-2H4" />
    </>
  ),
  esquerda: (
    <>
      <path d="M4 7h16M4 12h10M4 17h14" />
    </>
  ),
  centro: (
    <>
      <path d="M4 7h16M7 12h10M5 17h14" />
    </>
  ),
  direita: (
    <>
      <path d="M4 7h16M10 12h10M6 17h14" />
    </>
  ),
  recuoMais: (
    <>
      <path d="M4 7h16M9 12h11M9 17h11" />
      <path d="M4 15.5 7 12 4 8.5" />
    </>
  ),
  recuoMenos: (
    <>
      <path d="M4 7h16M4 12h11M4 17h11" />
      <path d="M20 15.5 17 12l3-3.5" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a4 4 0 0 0 6 .5l1.5-1.5a4 4 0 0 0-5.6-5.6L10.5 8" />
      <path d="M14 11a4 4 0 0 0-6-.5L6.5 12a4 4 0 0 0 5.6 5.6l1.4-1.4" />
    </>
  ),
  imagem: (
    <>
      <rect x="4" y="5" width="16" height="14" />
      <path d="M4 15.5 9 11l4 3.5 2.5-2L20 16" />
      <circle cx="9" cy="9" r="1" />
    </>
  ),
  video: (
    <>
      <rect x="3.5" y="6" width="17" height="12" />
      <path d="M11 9.5v5l4.5-2.5z" />
    </>
  ),
  botao: (
    <>
      <rect x="4" y="8" width="16" height="8" rx="1.5" />
      <path d="M8 12h8" />
    </>
  ),
  desfazer: (
    <>
      <path d="M8 8H4v4" />
      <path d="M4.5 8.5A8 8 0 1 1 6 18" />
    </>
  ),
  refazer: (
    <>
      <path d="M16 8h4v4" />
      <path d="M19.5 8.5A8 8 0 1 0 18 18" />
    </>
  ),
  testimonials: (
    <>
      <path d="M8 15.5V12c0-2 1.1-3.5 2.8-3.5" />
      <path d="M16 15.5V12c0-2-1.1-3.5-2.8-3.5" />
      <path d="M5 4.5h14v15H5z" />
    </>
  ),
  colabore: (
    <>
      <path d="M4 14.5c1.6-1.4 3.5-2.2 5.4-2.2 1.6 0 2.4.7 2.6 1.7.2-1 1-1.7 2.6-1.7 1.9 0 3.8.8 5.4 2.2" />
      <path d="M12 20.2c0-3.6-2.8-6-5.6-6-.9 0-1.8.2-2.6.6" />
      <path d="M12 20.2c0-3.6 2.8-6 5.6-6 .9 0 1.8.2 2.6.6" />
    </>
  ),
  volta: (
    <>
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </>
  ),
  avanca: (
    <>
      <path d="M9.5 5.5 16 12l-6.5 6.5" />
    </>
  ),
};

export function IconeMesa({ nome, className = "h-[18px] w-[18px]" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {TRACOS[nome]}
    </svg>
  );
}
