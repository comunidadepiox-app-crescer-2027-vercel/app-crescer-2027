// Centro de Convenções de Campina Grande, Arco Metropolitano (OpenStreetMap).
export const DESTINO = { lat: -7.2275974, lng: -35.8438964 };

export const EDICAO = { inicio: "2027-02-05", fim: "2027-02-09" };
export const MARGEM_MINUTOS = 15;
export const JANELA_MINUTOS = 70;
export const RECALCULO_MINUTOS = 20;
export const FRESCURA_HORAS = 12;
export const LIMITE_CHAMADAS = 8000;
export const TIMEZONE = "America/Recife";

export function classificarTransito(travelSec, delaySec) {
  const travel = Number(travelSec);
  const delay = Math.max(0, Number(delaySec) || 0);
  if (!Number.isFinite(travel) || travel <= 0) return null;
  const livre = travel - delay;
  if (livre <= 0) return "Muito Cheio";
  const razao = travel / livre;
  if (razao < 1.15) return "Livre";
  if (razao <= 1.45) return "Cheio";
  return "Muito Cheio";
}

export function minutosDeViagem(travelSec) {
  return Math.ceil(Number(travelSec) / 60);
}

export function horaDeSairMs(inicioMs, etaMinutos, margemMinutos = MARGEM_MINUTOS) {
  return inicioMs - (etaMinutos + margemMinutos) * 60 * 1000;
}

export function dentroDaJanela(agoraMs, inicioMs, janelaMinutos = JANELA_MINUTOS) {
  const falta = inicioMs - agoraMs;
  return falta > 0 && falta <= janelaMinutos * 60 * 1000;
}

export function decidirEnvio({ agoraMs, inicioMs, sairMs, enviado }) {
  if (enviado) return "pular";
  if (inicioMs == null || sairMs == null) return "pular";
  if (agoraMs >= inicioMs) return "pular";
  if (agoraMs >= sairMs) return "enviar";
  return "aguardar";
}

export function envioTravado(status, enviandoEmMs, agoraMs) {
  if (status !== "enviando" || enviandoEmMs == null) return false;
  return agoraMs - enviandoEmMs < 15 * 60 * 1000;
}

export function origemFresca(updatedAtMs, agoraMs, horas = FRESCURA_HORAS) {
  if (updatedAtMs == null || !Number.isFinite(updatedAtMs)) return false;
  const idade = agoraMs - updatedAtMs;
  if (idade < -5 * 60 * 1000) return false;
  if (idade < 0) return true;
  return idade <= horas * 60 * 60 * 1000;
}

export function rotaPrecisaRecalcular(calculadoEmMs, agoraMs, itemMudou, minutos = RECALCULO_MINUTOS) {
  if (itemMudou) return true;
  if (calculadoEmMs == null) return true;
  return agoraMs - calculadoEmMs >= minutos * 60 * 1000;
}

export function limiteAtingido(count, limite = LIMITE_CHAMADAS) {
  return Number(count) >= limite;
}

export function idAlerta(uid, itemId) {
  return `${uid}_${itemId}`;
}

export function lerResumo(body) {
  const summary = body?.routes?.[0]?.summary;
  const travel = summary?.travelDurationInSeconds;
  if (typeof travel !== "number" || travel <= 0) return null;
  const delay = typeof summary.trafficDelayDurationInSeconds === "number"
    ? summary.trafficDelayDurationInSeconds
    : 0;
  return { travel, delay };
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

export function mesRecife(ms) {
  return dataRecife(ms).slice(0, 7);
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

export function formatarHora(ms) {
  const partes = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(ms));
  let hora = partes.find((p) => p.type === "hour").value;
  const minuto = partes.find((p) => p.type === "minute").value;
  if (hora === "24") hora = "00";
  return `${hora}h${minuto}`;
}

export function textoAviso({ titulo, nivel, hora }) {
  return `Tá chegando a hora de ${titulo}! Atualmente, o trânsito está ${nivel}. Se você for de carro de aplicativo, recomendamos sair às ${hora} para chegar com segurança ao local.`;
}

export function textoSemLocal(titulo) {
  return `Para avisar a hora de sair para ${titulo}, abra o app e permita a localização.`;
}
