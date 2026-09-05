// Ícones de linha do app, no traço único da identidade do Crescer.
// Todos herdam a cor do texto via currentColor.

function Base({ children, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconeCasa({ className }) {
  return (
    <Base className={className}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1H10v-5.5h4V21h3.5a1 1 0 0 0 1-1V9.5" />
    </Base>
  );
}

export function IconeJornal({ className }) {
  return (
    <Base className={className}>
      <path d="M4 5h13v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V5Z" />
      <path d="M17 8h3v11a2 2 0 0 1-2 2" />
      <path d="M7.5 9h6M7.5 12.5h6M7.5 16h4" />
    </Base>
  );
}

export function IconeCalendario({ className }) {
  return (
    <Base className={className}>
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M7.5 13h3M7.5 17h3M13.5 13h3M13.5 17h3" />
    </Base>
  );
}

export function IconeCoracaoChama({ className }) {
  return (
    <Base className={className}>
      <path d="M12 21c-4.8-3.8-8-6.9-8-10.6C4 7.6 6.2 6 8.4 6c1.5 0 2.8.7 3.6 1.9C12.8 6.7 14.1 6 15.6 6 17.8 6 20 7.6 20 10.4c0 3.7-3.2 6.8-8 10.6Z" />
      <path d="M12 2.5c.9 1 1.4 1.8 1.4 2.7A1.4 1.4 0 0 1 12 6.6a1.4 1.4 0 0 1-1.4-1.4c0-.9.5-1.7 1.4-2.7Z" />
    </Base>
  );
}

export function IconePessoa({ className }) {
  return (
    <Base className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.8-3.5 3.9-5.5 7.5-5.5s6.7 2 7.5 5.5" />
    </Base>
  );
}

export function IconeFotos({ className }) {
  return (
    <Base className={className}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <circle cx="9" cy="10.5" r="1.6" />
      <path d="m5 18 4.5-4.5 3 3 3.5-3.5 4.5 4.5" />
    </Base>
  );
}

export function IconeInfo({ className }) {
  return (
    <Base className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.8v.4" />
    </Base>
  );
}
