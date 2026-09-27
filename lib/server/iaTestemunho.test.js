import assert from "node:assert/strict";
import test from "node:test";

import {
  cortaPalavras,
  filtraTestemunho,
  montaMensagens,
  normalizaResposta,
  textoLimpo,
} from "./iaTestemunho.js";

function respostaGroq(content) {
  return async () => ({
    ok: true,
    json: async () => ({ choices: [{ message: { content } }] }),
  });
}

test("textoLimpo tira carriage return, controlador e linha em branco extra", () => {
  assert.equal(textoLimpo("  uma\r\nlinha\x07  "), "uma\nlinha");
  assert.equal(textoLimpo("a\n\n\n\nb"), "a\n\nb");
  assert.equal(textoLimpo(null), "");
});

test("cortaPalavras nunca quebra no meio de uma palavra", () => {
  const cortado = cortaPalavras("palavra outrapalavramenteo resto", 20);
  assert.ok(cortado.length <= 20);
  assert.equal(cortado, "palavra");
});

test("cortaPalavras corta no limite quando não há espaço nenhum", () => {
  assert.equal(cortaPalavras("abcdefghijklmnopqrstuvwxyz", 10), "abcdefghij");
});

test("normalizaResposta aprova e devolve o resumo", () => {
  const r = normalizaResposta(
    '{"aprovado":true,"motivo":"","resumo":"Eu era uma pessoa fechada, hoje converso com meus filhos."}'
  );
  assert.deepEqual(r, {
    aprovado: true,
    motivo: "",
    resumo: "Eu era uma pessoa fechada, hoje converso com meus filhos.",
  });
});

test("normalizaResposta recusa e devolve o motivo sem resumo", () => {
  const r = normalizaResposta('{"aprovado":false,"motivo":"palavrão","resumo":"ignorado"}');
  assert.deepEqual(r, { aprovado: false, motivo: "palavrão", resumo: "" });
});

test("normalizaResposta aceita string booleana e JSON dentro de texto", () => {
  const r = normalizaResposta('Claro! {"aprovado":"true","resumo":"Deus me sustentou.","motivo":""}');
  assert.equal(r.aprovado, true);
  assert.equal(r.resumo, "Deus me sustentou.");
});

test("normalizaResposta recusa quando aprovado vem em false, que é o mais comum", () => {
  const r = normalizaResposta('{"aprovado":false,"motivo":"método de suicídio","resumo":""}');
  assert.equal(r.aprovado, false);
  assert.equal(r.motivo, "método de suicídio");
});

test("normalizaResposta põe motivo genérico quando a IA não manda", () => {
  const r = normalizaResposta('{"aprovado":false}');
  assert.equal(r.motivo, "conteúdo impróprio");
});

test("normalizaResposta devolve null para resposta fora do formato", () => {
  assert.equal(normalizaResposta("não sei responder"), null);
  assert.equal(normalizaResposta(""), null);
  assert.equal(normalizaResposta('{"aprovado":true}'), null);
  assert.equal(normalizaResposta('{"aprovado":true,"resumo":"   "}'), null);
});

test("o prompt manda suavizar depressão e suicídio já vivido, sem nomear o ato", () => {
  const [sistema] = montaMensagens("qualquer coisa");
  assert.match(sistema.content, /depressão/);
  assert.match(sistema.content, /já vivida/);
  assert.match(sistema.content, /nunca nomeie o ato/);
  assert.match(sistema.content, /palavrão/);
  assert.match(sistema.content, /400 caracteres/);
});

test("o texto do fiel entra no prompt dentro de aspas triplas", () => {
  const mensagens = montaMensagens("meu testemunho");
  assert.equal(mensagens.length, 2);
  assert.equal(mensagens[1].role, "user");
  assert.ok(mensagens[1].content.includes('"""meu testemunho"""'));
});

test("filtraTestemunho chama o Groq e devolve a decisão", async () => {
  const r = await filtraTestemunho("testemunho bom", {
    chave: "chave-de-teste",
    busca: respostaGroq('{"aprovado":true,"motivo":"","resumo":"Deus restaurou o meu lar."}'),
  });
  assert.deepEqual(r, { aprovado: true, motivo: "", resumo: "Deus restaurou o meu lar." });
});

test("filtraTestemunho manda temperatura baixa e resposta em JSON", async () => {
  let enviado = null;
  await filtraTestemunho("texto", {
    chave: "chave-de-teste",
    busca: async (_url, opcoes) => {
      enviado = JSON.parse(opcoes.body);
      return { ok: true, json: async () => ({ choices: [{ message: { content: '{"aprovado":true,"resumo":"r"}' } }] }) };
    },
  });
  assert.equal(enviado.temperature, 0.2);
  assert.deepEqual(enviado.response_format, { type: "json_object" });
  assert.equal(enviado.model, "llama-3.3-70b-versatile");
});

test("filtraTestemunho devolve null sem chave, sem rede e com erro do Groq", async () => {
  assert.equal(await filtraTestemunho("texto", { chave: "" }), null);
  assert.equal(
    await filtraTestemunho("texto", {
      chave: "k",
      busca: async () => {
        throw new Error("rede fora");
      },
    }),
    null
  );
  assert.equal(
    await filtraTestemunho("texto", { chave: "k", busca: async () => ({ ok: false }) }),
    null
  );
});

test("filtraTestemunho devolve null em texto vazio, mesmo com chave", async () => {
  assert.equal(
    await filtraTestemunho("   ", { chave: "k", busca: respostaGroq("{}") }),
    null
  );
});

test("filtraTestemunho devolve null quando o corpo não é JSON", async () => {
  const r = await filtraTestemunho("texto", {
    chave: "k",
    busca: async () => ({
      ok: true,
      json: async () => {
        throw new Error("html");
      },
    }),
  });
  assert.equal(r, null);
});
