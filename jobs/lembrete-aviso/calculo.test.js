import assert from "node:assert/strict";
import test from "node:test";
import {
  JANELA_MINUTOS,
  MARCOS_AVISO,
  TOLERANCIA_MINUTOS,
  dentroDaJanela,
  dentroDoRelogio,
  idAviso,
  inicioDoItemMs,
  marcosPendentes,
  minutosRestantes,
  textoAviso,
} from "./calculo.js";

const MIN = 60 * 1000;

// Item que começa às 19h de Recife, no dia 6 de fevereiro de 2027.
const INICIO = inicioDoItemMs("2027-02-06", "19:00");

function faltaDe(minutos) {
  return INICIO - minutos * MIN;
}

test("os marcos são 30, 15, 10, 5 e 1 minuto", () => {
  assert.deepEqual(MARCOS_AVISO, [30, 15, 10, 5, 1]);
});

test("no cron de 5 minutos cada marco vence sozinho", () => {
  // O item começa às 19h. O cron roda 18h30, 18h45, 18h50, 18h55 e 19h.
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(30), inicioMs: INICIO }), [30]);
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(25), inicioMs: INICIO, enviados: [30] }), []);
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(20), inicioMs: INICIO, enviados: [30] }), []);
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(15), inicioMs: INICIO, enviados: [30] }), [15]);
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(10), inicioMs: INICIO, enviados: [30, 15] }), [10]);
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(5), inicioMs: INICIO, enviados: [30, 15, 10] }), [5]);
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(0), inicioMs: INICIO, enviados: [30, 15, 10, 5] }), [1]);
});

test("a tolerância deixa o aviso sair mesmo com o cron atrasado", () => {
  // Execução 3 minutos atrasada no marco de 30.
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(27), inicioMs: INICIO }), [30]);
  // Perdeu o marco de 30, e o de 15 ainda tem folga de 3 minutos.
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(12), inicioMs: INICIO }), [15]);
  // Perdeu o de 15, e o de 10 tem folga de 1 minuto. Perdeu também, de uma vez.
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(9), inicioMs: INICIO }), [10]);
  // Perdeu o de 10, e o de 5 tem folga de 3 minutos.
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(2), inicioMs: INICIO }), [5]);
  // Nenhum marco com folga: a execução caiu num intervalo cego e não envia nada.
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(20), inicioMs: INICIO }), []);
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(8), inicioMs: INICIO }), [10]);
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(35), inicioMs: INICIO }), []);
});

test("marcar em cima da hora não vira rajada de push", () => {
  // Faltam 3 minutos e nada saiu ainda: só o marco mais próximo cabe.
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(3), inicioMs: INICIO }), [5]);
  // Faltam 45 minutos: ainda não venceu nada.
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(45), inicioMs: INICIO }), []);
});

test("o marco de 1 minuto ainda sai logo depois do horário do item", () => {
  const enviados = [30, 15, 10, 5];
  assert.deepEqual(marcosPendentes({ agoraMs: INICIO + MIN, inicioMs: INICIO, enviados }), [1]);
  assert.deepEqual(marcosPendentes({ agoraMs: INICIO + 4 * MIN, inicioMs: INICIO, enviados }), [1]);
  assert.deepEqual(marcosPendentes({ agoraMs: INICIO + 5 * MIN, inicioMs: INICIO, enviados }), []);
});

test("marco já enviado não volta, mesmo com a lista fora de ordem", () => {
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(30), inicioMs: INICIO, enviados: [30, 15, 10, 5, 1] }), []);
  assert.deepEqual(marcosPendentes({ agoraMs: faltaDe(30), inicioMs: INICIO, enviados: [] }), [30]);
});

test("item sem horário válido não gera aviso", () => {
  assert.equal(inicioDoItemMs("2027-02-06", "25:00"), null);
  assert.equal(inicioDoItemMs("2027-02-06", "abc"), null);
  assert.equal(inicioDoItemMs("", "19:00"), null);
  assert.deepEqual(marcosPendentes({ agoraMs: Date.now(), inicioMs: null }), []);
  assert.equal(minutosRestantes(null, Date.now()), null);
});

test("a janela cobre o maior marco e a folga depois do item", () => {
  assert.equal(JANELA_MINUTOS, MARCOS_AVISO[0] + TOLERANCIA_MINUTOS);
  assert.equal(dentroDaJanela(faltaDe(JANELA_MINUTOS), INICIO), true);
  assert.equal(dentroDaJanela(faltaDe(JANELA_MINUTOS + 1), INICIO), false);
  assert.equal(dentroDaJanela(INICIO, INICIO), true);
  assert.equal(dentroDaJanela(INICIO + TOLERANCIA_MINUTOS * MIN, INICIO), true);
  assert.equal(dentroDaJanela(INICIO + (TOLERANCIA_MINUTOS + 1) * MIN, INICIO), false);
});

test("relógio só na semana do encontro, entre 6h e 22h de Recife", () => {
  assert.equal(dentroDoRelogio(Date.parse("2027-02-06T18:00:00-03:00")), true);
  assert.equal(dentroDoRelogio(Date.parse("2027-02-06T05:59:00-03:00")), false);
  assert.equal(dentroDoRelogio(Date.parse("2027-02-06T22:01:00-03:00")), false);
  assert.equal(dentroDoRelogio(Date.parse("2027-02-04T12:00:00-03:00")), false);
  assert.equal(dentroDoRelogio(Date.parse("2026-09-28T12:00:00-03:00")), false);
});

test("o texto do aviso nomeia o item e não promete hora de sair", () => {
  assert.equal(textoAviso(30, "Missa de abertura"), "Falta meia hora para Missa de abertura.");
  assert.equal(textoAviso(15, "Missa de abertura"), "Faltam 15 minutos para Missa de abertura.");
  assert.equal(textoAviso(10, "Missa de abertura"), "Faltam 10 minutos para Missa de abertura.");
  assert.equal(textoAviso(5, "Missa de abertura"), "Faltam 5 minutos para Missa de abertura.");
  assert.equal(textoAviso(1, "Missa de abertura"), "Está começando agora: Missa de abertura.");
  for (const marco of MARCOS_AVISO) {
    assert.doesNotMatch(textoAviso(marco, "Missa"), /trânsito|sair às|Livre|Cheio|—/);
  }
});

test("o id do aviso junta pessoa e item", () => {
  assert.equal(idAviso("abc", "item1"), "abc_item1");
});
