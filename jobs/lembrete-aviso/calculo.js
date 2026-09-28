// Regras puras do Avise-me. Sem Firebase e sem rede, para o teste rodar com
// `node --test` e a lógica de aviso ficar conferível na mão.
//
// O job não tenta acertar o minuto exato do marco. O GitHub Actions agenda por
// cron de 5 em 5 minutos e pode atrasar a execução, então a pergunta é outra:
// quais marcos já venceram e ainda cabem na tolerância. Ver `marcosPendentes`.

export const EDICAO = { inicio: "2027-02-05", fim: "2027-02-09" };
export const TIMEZONE = "America/Recife";

// Marcos do aviso, em minutos antes do horário do item.
export const MARCOS_AVISO = [30, 15, 10, 5, 1];

// Folga aceita em cada marco. Com o cron de 5 minutos, a execução normal cai
// dentro dessa janela sem precisar de nenhum ajuste.
export const TOLERANCIA_MINUTOS = 5;

// Janela de trabalho do job: do começo do maior marco até a tolerância depois do
// horário do item, para o marco de 1 minuto não se perder.
export const JANELA_MINUTOS = MARCOS_AVISO[0] + TOLERANCIA_MINUTOS;

export function minutosRestantes(inicioMs, agoraMs) {
  if (!Number.isFinite(inicioMs) || !Number.isFinite(agoraMs)) return null;
  return (inicioMs - agoraMs) / 60000;
}

// Verdadeiro enquanto o job ainda deve olhar o item.
export function dentroDaJanela(agoraMs, inicioMs) {
  const falta = minutosRestantes(inicioMs, agoraMs);
  if (falta === null) return false;
  return falta <= JANELA_MINUTOS && falta >= -TOLERANCIA_MINUTOS;
}

// Marcos que vencem nesta execução e que ainda não saíram.
//
// Só entra o marco cuja folga está entre 0 e a tolerância. É o que evita duas
// coisas de uma vez: o aviso atrasado ainda sai, e marcar o item em cima da hora
// não vira rajada de quatro pushes, porque só o marco mais próximo cabe na
// janela. O marco de 1 minuto tem folga de 4 minutos, então pode chegar logo
// depois do horário do item, e o texto dele foi escrito para funcionar nos dois
// casos.
export function marcosPendentes({
  agoraMs,
  inicioMs,
  enviados = [],
  marcos = MARCOS_AVISO,
  tolerancia = TOLERANCIA_MINUTOS,
}) {
  const falta = minutosRestantes(inicioMs, agoraMs);
  if (falta === null) return [];

  const jaSaiu = new Set(enviados);
  return [...marcos]
    .sort((a, b) => b - a)
    .filter((marco) => {
      if (jaSaiu.has(marco)) return false;
      const folga = marco - falta;
      return folga >= 0 && folga <= tolerancia;
    });
}

export function textoAviso(marco, titulo) {
  if (marco === 1) return `Está começando agora: ${titulo}.`;
  if (marco === 30) return `Falta meia hora para ${titulo}.`;
  return `Faltam ${marco} minutos para ${titulo}.`;
}

export function idAviso(uid, itemId) {
  return `${uid}_${itemId}`;
}

export function inicioDoItemMs(date, time) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date || ""))) return null;
  const partes = String(time || "").split(":");
  const hh = Number(partes[0]);
  const mm = Number(partes[1]);
  if (!Number.isInteger(hh) || !Number.isInteger(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
    return null;
  }
  const iso = `${date}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00-03:00`;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? null : ms;
}

export function dataRecife(ms) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms));
}

export function minutosDoDiaRecife(ms) {
  const partes = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(ms));
  let hora = Number(partes.find((p) => p.type === "hour").value);
  const minuto = Number(partes.find((p) => p.type === "minute").value);
  if (hora === 24) hora = 0;
  return hora * 60 + minuto;
}

export function dentroDoRelogio(agoraMs, edicao = EDICAO) {
  const data = dataRecife(agoraMs);
  if (data < edicao.inicio || data > edicao.fim) return false;
  const minutos = minutosDoDiaRecife(agoraMs);
  return minutos >= 6 * 60 && minutos <= 22 * 60;
}
