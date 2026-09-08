// Edição vigente do encontro: Crescer 2027 (30 anos), 5 a 9 de fevereiro de 2027.
export const EDICAO = {
  nome: "30º Crescer",
  titulo: "O Encontro da Família Católica",
  inicio: "2027-02-05",
  fim: "2027-02-09",
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

// Regra do recorte "hoje no evento" (spec 002), calendário civil Recife
// (meia-noite a meia-noite): antes do evento e no dia 5 mostra 2027-02-05;
// depois que o dia 5 acaba, mostra o 6; no fim da edição, o último dia.
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

export function diasDaEdicao() {
  const dias = [];
  const [y, m, d] = EDICAO.inicio.split("-").map(Number);
  let atual = new Date(Date.UTC(y, m - 1, d, 12));
  for (let i = 0; i < 14; i++) {
    const iso = atual.toISOString().slice(0, 10);
    if (iso > EDICAO.fim) break;
    dias.push(iso);
    atual = new Date(atual.getTime() + 24 * 60 * 60 * 1000);
  }
  return dias;
}
