// Liturgia Diária: busca do texto do dia na API pública e normalização em
// etapas. Nenhuma parte da liturgia é escrita no repositório, e nada é gravado
// no Firestore: o app só lê.
//
// A API aceita a data no caminho, em DD-MM-AAAA, e ignora query string. Por
// isso a rota é montada a partir do dia, e não com parâmetro.
//
// A resposta é inconsistente em pontos que precisam ser tratados antes de
// chegar na tela: uma seção ausente pode vir como lista vazia, como null ou
// como a string "Não há segunda leitura hoje!", e `oracoes.extras` às vezes vem
// como objeto único em vez de lista. Nada disso deve aparecer para o fiel.

import { hojeISO } from "./edicao";

const BASE = "https://liturgia.up.railway.app/v2";

// O serviço responde rápido quando está de pé, mas em rede de celular ele pode
// demorar. A tela só trata como falha depois desta espera, para não piscar um
// aviso de erro em quem está só com a internet fraca.
const ESPERA_FALHA_MS = 8000;

// Uma etapa de orações costuma ter três blocos. As leituras, uma ou duas.
const MAX_BLOCOS_ORACAO = 3;

export function chaveDoDia(iso) {
  const [ano, mes, dia] = String(iso || "").split("-");
  if (!ano || !mes || !dia) return "";
  return `${dia}-${mes}-${ano}`;
}

export function urlDaLiturgia(iso) {
  const chave = chaveDoDia(iso);
  return chave ? `${BASE}/${chave}` : BASE;
}

function texto(valor) {
  const limpo = String(valor ?? "").trim();
  return limpo || "";
}

// Uma seção só vale quando tem texto. Lista vazia, null e a string de aviso da
// API caem aqui e viram nada, que é o resultado esperado: a etapa não existe.
function itens(valor) {
  if (Array.isArray(valor)) return valor;
  if (valor && typeof valor === "object") return [valor];
  return [];
}

function blocoDeLeitura(leitura, extra = {}) {
  const corpo = texto(leitura?.texto);
  if (!corpo) return null;
  return {
    tipo: "leitura",
    referencia: texto(leitura?.referencia),
    titulo: texto(leitura?.titulo) || texto(extra.tipo),
    texto: separaVersiculos(corpo),
  };
}

function blocoDeSalmo(salmo) {
  const corpo = texto(salmo?.texto);
  if (!corpo) return null;
  const blocos = [];
  const refrao = texto(salmo?.refrao);
  if (refrao) blocos.push({ tipo: "refrão", texto: refrao });
  blocos.push({ tipo: "salmo", texto: corpo });
  return {
    tipo: "salmo",
    referencia: texto(salmo?.referencia),
    titulo: texto(salmo?.titulo),
    blocos,
  };
}

// A API cola o número do versículo na palavra: "21Piedade, piedade de mim".
// Separa com um espaço para a linha não ficar com a palavra espremida contra o
// número, que é como a leitura fica difícil num aparelho.
export function separaVersiculos(corpo) {
  return String(corpo).replace(/(\d+)(?=[A-Za-zÀ-ÿ“”])/g, "$1 ");
}

// Em dias de festa a API traz a mesma leitura em duas formas, ou duas escolhas
// válidas, na mesma seção. Isso faz parte da liturgia do dia, não é defeito: a
// tela mostra as duas e avisa que existe mais de uma opção, em vez de escolher
// uma por conta própria e esconder a outra.
function etapaDeLeitura(id, titulo, itensCruos) {
  const blocos = itensCruos.map((item) => (id === "salmo" ? blocoDeSalmo(item) : blocoDeLeitura(item))).filter(Boolean);
  if (!blocos.length) return null;
  return { id, titulo, opcoes: blocos.length > 1, blocos };
}

function etapaDeLeituras(leituras) {
  return [
    etapaDeLeitura("primeira", "Primeira leitura", itens(leituras?.primeiraLeitura)),
    etapaDeLeitura("salmo", "Salmo", itens(leituras?.salmo)),
    etapaDeLeitura("segunda", "Segunda leitura", itens(leituras?.segundaLeitura)),
    etapaDeLeitura("evangelho", "Evangelho", itens(leituras?.evangelho)),
  ].filter(Boolean);
}

// A etapa da celebração abre a liturgia. Sem o nome do santo ou da festa, ela
// ainda vale com a data e a cor, porque a data sempre vem.
function etapaCelebracao(dados) {
  const celebracao = texto(dados?.liturgia);
  const cor = texto(dados?.cor);
  if (!celebracao && !cor) return null;
  return {
    id: "celebracao",
    titulo: "Celebração do dia",
    celebracao,
    cor,
    blocos: [],
  };
}

function etapaDeOracoes(oracoes) {
  const blocos = [
    { titulo: "Oração de coleta", texto: texto(oracoes?.coleta) },
    { titulo: "Oração das oferendas", texto: texto(oracoes?.oferendas) },
    { titulo: "Oração de comunhão", texto: texto(oracoes?.comunhao) },
  ]
    .filter((bloco) => bloco.texto)
    .slice(0, MAX_BLOCOS_ORACAO)
    .map((bloco) => ({ tipo: "oracao", titulo: bloco.titulo, texto: bloco.texto }));
  if (!blocos.length) return [];
  return [{ id: "oracoes", titulo: "Orações", blocos }];
}

// Puro, para o formato da resposta ser conferido sem rede. Devolve só as etapas
// que têm conteúdo, na ordem de leitura da missa.
export function normalizaLiturgia(dados) {
  if (!dados || typeof dados !== "object") return [];

  const etapas = [etapaCelebracao(dados), ...etapaDeLeituras(dados.leituras), ...etapaDeOracoes(dados.oracoes)];
  return etapas.filter(Boolean);
}

// Um pedido só. A data vai no caminho e a resposta volta já normalizada em
// etapas, ou como erro com uma mensagem que a tela mostra sem traduzir nada.
export async function buscaLiturgiaDoDia(signal) {
  const iso = hojeISO();
  const url = urlDaLiturgia(iso);
  let resposta;

  try {
    resposta = await fetch(url, { signal, headers: { Accept: "application/json" } });
  } catch (erro) {
    if (erro?.name === "AbortError") throw erro;
    throw new Error("Não foi possível falar com o serviço da liturgia agora.");
  }

  if (!resposta.ok) {
    throw new Error("O serviço da liturgia respondeu com erro. Tente de novo em instantes.");
  }

  let corpo = null;
  try {
    corpo = await resposta.json();
  } catch {
    throw new Error("O serviço da liturgia devolveu uma resposta inesperada.");
  }

  const etapas = normalizaLiturgia(corpo);
  if (!etapas.length) {
    throw new Error("Não há liturgia publicada para hoje.");
  }
  return etapas;
}

export { ESPERA_FALHA_MS };