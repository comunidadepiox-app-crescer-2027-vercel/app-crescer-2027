// Edição vigente do encontro. Decisão registrada no plano e em Specs/OPEN-QUESTIONS.md:
// enquanto a comunidade não define a edição 2027, o app usa as datas oficiais do 30º Crescer.
export const EDICAO = {
  nome: "30º Crescer",
  titulo: "O Encontro da Família Católica",
  inicio: "2026-02-13",
  fim: "2026-02-17",
  local: "Centro de Convenções, Campina Grande, PB",
};

const TIMEZONE = "America/Recife";

export function hojeISO() {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

// Regra do recorte "hoje no evento" (spec 002):
// durante o evento usa o dia corrente; antes, o primeiro dia; depois, o último.
export function resolveDiaRecorte() {
  const hoje = hojeISO();
  if (hoje < EDICAO.inicio) return { date: EDICAO.inicio, posicao: "antes" };
  if (hoje > EDICAO.fim) return { date: EDICAO.fim, posicao: "depois" };
  return { date: hoje, posicao: "durante" };
}

export function formataDataCurta(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const data = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIMEZONE,
    day: "numeric",
    month: "long",
  }).format(data);
}

export function formataDataLonga(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const data = new Date(Date.UTC(y, m - 1, d, 12));
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(data);
}
