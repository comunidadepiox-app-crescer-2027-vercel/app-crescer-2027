// Filtro e resumo de testemunho com a IA gratuita do Groq.
//
// O texto chega do app do fiel e sai daqui em duas peças: a decisão de
// aprovar ou recusar, e um resumo curto para o apresentador ler no palco.
// A chamada é best effort por desenho: se a chave faltar, a cota estourar ou
// a resposta vier torta, devolvemos null e quem chama grava em revisão manual.
// Nenhum resumo é inventado sem a IA.

const MODELO = "llama-3.3-70b-versatile";
const URL_CHAT = "https://api.groq.com/openai/v1/chat/completions";
const LIMITE_RESUMO = 400;
const LIMITE_MOTIVO = 60;

// Controladores fora de \n e \t. Vêm de cola suja e de campo quebrado.
const CONTROLADORES = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const ESPACOS = /\s+/g;

const SISTEMA = `Você filtra e resume testemunho de um encontro de família católica.
O resumo vai ser lido em voz alta no palco, diante da comunidade, por um apresentador.

Recuse com aprovado false quando o texto:
- contiver palavrão, baixo calão ou xingamento;
- descrever método, meio, arma, quantidade ou instrução de suicídio ou automutilação;
- acusar ou xingar uma pessoa específica pelo nome;
- zombar da fé, da igreja, de Deus ou da comunidade;
- for apenas repetição, spam ou texto sem conteúdo.

Aceite com aprovado true mesmo quando o texto falar de depressão, ansiedade,
adoecimento mental, abuso, perda, vício, ou de uma tentativa de suicídio já vivida.
Nesses casos o resumo é a parte mais delicada da sua tarefa:
- nunca nomeie o ato e nunca cite método, meio ou quantidade;
- troque por "um passo muito difícil", "um momento de escuridão", "um período
  bem pesado" ou "quase desistir de tudo";
- mantenha o valor do relato: a pessoa foi acolhida, rezou, encontrou ajuda,
  a vida mudou;
- nunca acrescente fato que não esteja no texto.

Regras do resumo quando aprovado:
- escreva na primeira pessoa, como se fosse a própria pessoa falando;
- de 1 a 3 frases, no máximo 400 caracteres;
- sem repetição: se a pessoa repetiu a mesma ideia, guarde uma vez;
- sem link, sem nome de produto, sem código, sem formatação, sem aspas em volta;
- linguagem simples, falada, sem jargão e sem emoji;
- sem travessão longo e sem ponto e vírgula em excesso;
- termine a frase, sem deixar corte.

Responda só JSON, sem texto em volta, com estas chaves:
{"aprovado": true|false, "motivo": "", "resumo": ""}
Quando aprovado for false, resumo vai vazio e motivo tem no máximo 60 caracteres,
descrevendo o motivo em português curto, por exemplo "palavrão" ou
"método de suicídio". Quando aprovado for true, motivo vai vazio.`;

export function textoLimpo(valor) {
  return String(valor ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(CONTROLADORES, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function soTexto(valor) {
  return String(valor ?? "")
    .replace(CONTROLADORES, "")
    .replace(ESPACOS, " ")
    .trim();
}

function booleano(valor) {
  if (typeof valor === "boolean") return valor;
  if (typeof valor === "string") return valor.trim().toLowerCase() === "true";
  return false;
}

// Recorta em palavra inteira, para o resumo nunca quebrar no meio de uma.
// Se não houver espaço nenhum, corta no limite mesmo assim.
export function cortaPalavras(valor, limite) {
  const limpo = soTexto(valor);
  if (limpo.length <= limite) return limpo;
  const cortado = limpo.slice(0, limite);
  const ultimoEspaco = cortado.lastIndexOf(" ");
  if (ultimoEspaco <= 0) return cortado.trim();
  return cortado.slice(0, ultimoEspaco).trim();
}

export function normalizaResposta(bruta) {
  let dados = null;
  if (bruta && typeof bruta === "object") {
    dados = bruta;
  } else {
    const texto = String(bruta || "").trim();
    const inicio = texto.indexOf("{");
    const fim = texto.lastIndexOf("}");
    if (inicio === -1 || fim <= inicio) return null;
    try {
      dados = JSON.parse(texto.slice(inicio, fim + 1));
    } catch {
      return null;
    }
  }
  if (!dados || typeof dados !== "object") return null;

  if (!booleano(dados.aprovado)) {
    const motivo = cortaPalavras(dados.motivo, LIMITE_MOTIVO) || "conteúdo impróprio";
    return { aprovado: false, motivo, resumo: "" };
  }
  const resumo = cortaPalavras(dados.resumo, LIMITE_RESUMO);
  if (!resumo) return null;
  return { aprovado: true, motivo: "", resumo };
}

export function montaMensagens(texto) {
  return [
    { role: "system", content: SISTEMA },
    { role: "user", content: `Testemunho:\n"""${textoLimpo(texto)}"""` },
  ];
}

export async function filtraTestemunho(texto, opcoes = {}) {
  const chave = opcoes.chave || process.env.GROQ_API_KEY;
  const busca = opcoes.busca || fetch;
  const limpo = textoLimpo(texto);
  if (!limpo) return null;
  if (!chave) return null;

  let res;
  try {
    res = await busca(URL_CHAT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: opcoes.modelo || MODELO,
        temperature: 0.2,
        max_tokens: 500,
        response_format: { type: "json_object" },
        messages: montaMensagens(limpo),
      }),
    });
  } catch {
    return null;
  }
  if (!res || !res.ok) return null;

  let corpo;
  try {
    corpo = await res.json();
  } catch {
    return null;
  }
  return normalizaResposta(corpo?.choices?.[0]?.message?.content);
}
