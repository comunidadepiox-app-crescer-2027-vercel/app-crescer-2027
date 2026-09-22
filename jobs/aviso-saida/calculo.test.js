import assert from "node:assert/strict";
import test from "node:test";
import {
  classificarTransito,
  decidirEnvio,
  dentroDaJanela,
  dentroDoRelogio,
  envioTravado,
  horaDeSairMs,
  inicioDoItemMs,
  limiteAtingido,
  minutosDeViagem,
  origemFresca,
  rotaPrecisaRecalcular,
  textoAviso,
  textoSemLocal,
} from "./calculo.js";

const MIN = 60 * 1000;

test("classifica Livre, Cheio e Muito Cheio pela razão", () => {
  assert.equal(classificarTransito(1000, 0), "Livre");
  assert.equal(classificarTransito(1149, 149), "Livre");
  assert.equal(classificarTransito(1150, 150), "Cheio");
  assert.equal(classificarTransito(1450, 450), "Cheio");
  assert.equal(classificarTransito(1500, 500), "Muito Cheio");
  assert.equal(classificarTransito(600, 600), "Muito Cheio");
  assert.equal(classificarTransito(0, 10), null);
});

test("hora de sair desconta a viagem e 15 minutos", () => {
  const inicio = inicioDoItemMs("2027-02-06", "19:00");
  const sair = horaDeSairMs(inicio, 25);
  assert.equal(sair, inicio - 40 * MIN);
  assert.equal(minutosDeViagem(61), 2);
});

test("janela de 70 minutos", () => {
  const inicio = inicioDoItemMs("2027-02-06", "19:00");
  assert.equal(dentroDaJanela(inicio - 70 * MIN, inicio), true);
  assert.equal(dentroDaJanela(inicio - 70 * MIN - 1, inicio), false);
  assert.equal(dentroDaJanela(inicio, inicio), false);
  assert.equal(dentroDaJanela(inicio + MIN, inicio), false);
});

test("envia uma vez, na hora, e não depois do início", () => {
  const inicio = inicioDoItemMs("2027-02-06", "19:00");
  const sair = horaDeSairMs(inicio, 25);
  assert.equal(decidirEnvio({ agoraMs: sair - MIN, inicioMs: inicio, sairMs: sair, enviado: false }), "aguardar");
  assert.equal(decidirEnvio({ agoraMs: sair, inicioMs: inicio, sairMs: sair, enviado: false }), "enviar");
  assert.equal(decidirEnvio({ agoraMs: sair + MIN, inicioMs: inicio, sairMs: sair, enviado: true }), "pular");
  assert.equal(decidirEnvio({ agoraMs: inicio, inicioMs: inicio, sairMs: sair, enviado: false }), "pular");
});

test("trava de envio em andamento impede o segundo push", () => {
  const agora = inicioDoItemMs("2027-02-06", "18:30");
  assert.equal(envioTravado("enviando", agora - 5 * MIN, agora), true);
  assert.equal(envioTravado("enviando", agora - 16 * MIN, agora), false);
  assert.equal(envioTravado("calculado", agora, agora), false);
});

test("origem com mais de 12 horas não serve para a hora de sair", () => {
  const agora = inicioDoItemMs("2027-02-06", "18:00");
  assert.equal(origemFresca(agora - 12 * 60 * MIN, agora), true);
  assert.equal(origemFresca(agora - 12 * 60 * MIN - 1, agora), false);
  assert.equal(origemFresca(null, agora), false);
});

test("recalcula a rota depois de 20 minutos ou se o horário mudou", () => {
  const agora = 1_000_000_000_000;
  assert.equal(rotaPrecisaRecalcular(null, agora, false), true);
  assert.equal(rotaPrecisaRecalcular(agora - 19 * MIN, agora, false), false);
  assert.equal(rotaPrecisaRecalcular(agora - 20 * MIN, agora, false), true);
  assert.equal(rotaPrecisaRecalcular(agora - MIN, agora, true), true);
});

test("trava mensal em 8000 chamadas", () => {
  assert.equal(limiteAtingido(7999), false);
  assert.equal(limiteAtingido(8000), true);
});

test("relógio só na semana do encontro, entre 6h e 22h de Recife", () => {
  assert.equal(dentroDoRelogio(Date.parse("2027-02-06T18:00:00-03:00")), true);
  assert.equal(dentroDoRelogio(Date.parse("2027-02-06T05:59:00-03:00")), false);
  assert.equal(dentroDoRelogio(Date.parse("2027-02-06T22:01:00-03:00")), false);
  assert.equal(dentroDoRelogio(Date.parse("2027-02-04T12:00:00-03:00")), false);
  assert.equal(dentroDoRelogio(Date.parse("2026-09-22T12:00:00-03:00")), false);
});

test("textos não inventam trânsito sem coordenada", () => {
  const aviso = textoAviso({ titulo: "Missa de abertura", nivel: "Livre", hora: "18h20" });
  assert.match(aviso, /Tá chegando a hora de Missa de abertura!/);
  assert.match(aviso, /trânsito está Livre/);
  assert.match(aviso, /sair às 18h20/);
  assert.doesNotMatch(textoSemLocal("Missa de abertura"), /Livre|Cheio|sair às/);
});
