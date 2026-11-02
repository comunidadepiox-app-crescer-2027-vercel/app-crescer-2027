// Liturgia Diária: o texto do dia vem da API pública de liturgia, buscado por
// `mobile/lib/liturgia.js`. O desenho é o do Terço da Restauração das Famílias
// (spec 011), com a barra de etapas compartilhada: cabeçalho laranja, coluna de
// leitura à esquerda e navegação inferior que trava nas pontas.

import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../lib/authProvider";
import { Voltar } from "../components/Voltar";
import { BarraEtapas } from "../components/BarraEtapas";
import { Botao, Paragrafo, TituloPagina } from "../components/Ui";
import { CORES, FONTES } from "../lib/tema";
import { formataDataLonga, hojeISO } from "../lib/edicao";
import { ESPERA_FALHA_MS, buscaLiturgiaDoDia } from "../lib/liturgia";

// O gesto só vale quando o dedo vai claramente para o lado. Um arrasto de
// leitura costuma ser mais curto na horizontal que na vertical, e a rolagem do
// texto não pode ser sequestrada por quem está só varrendo a linha.
const DESLOCAMENTO_MINIMO = 56;
const PESO_HORIZONTAL = 1.6;

export default function LiturgiaScreen() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const [etapas, setEtapas] = useState(null);
  const [erro, setErro] = useState("");
  const [atual, setAtual] = useState(0);
  const [tentativa, setTentativa] = useState(0);

  // Um pedido por tentativa. A carência evita mostrar falha em quem só tem
  // internet fraca, e o cancelamento evita gravar o resultado de uma tela que
  // o fiel já deixou.
  useEffect(() => {
    const controle = new AbortController();
    let vivo = true;
    const carencia = setTimeout(() => {
      if (vivo) setErro("A liturgia está demorando a responder. Tente de novo em instantes.");
    }, ESPERA_FALHA_MS);

    setEtapas(null);
    setErro("");
    setAtual(0);

    buscaLiturgiaDoDia(controle.signal)
      .then((lista) => {
        if (!vivo) return;
        clearTimeout(carencia);
        setErro("");
        setEtapas(lista);
      })
      .catch((problema) => {
        if (!vivo || problema?.name === "AbortError") return;
        clearTimeout(carencia);
        setEtapas(null);
        setErro(problema.message);
      });

    return () => {
      vivo = false;
      clearTimeout(carencia);
      controle.abort();
    };
  }, [tentativa]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [atual]);

  const vaiPara = useCallback(
    (proxima) => {
      setAtual((atual) => {
        const limite = etapas?.length || 0;
        return Math.max(0, Math.min(proxima, limite - 1));
      });
    },
    [etapas]
  );

  // O arrasto é medido, não capturado. O ScrollView continua sendo o dono da
  // rolagem vertical, e aqui só se troca de etapa quando o gesto é claramente
  // horizontal. Quem está varrendo a linha não perde a rolagem por causa disso.
  const toque = useRef(null);

  function medeToque(e) {
    const { pageX, pageY } = e.nativeEvent;
    if (!toque.current) {
      toque.current = { x: pageX, y: pageY };
      return;
    }
    const dx = pageX - toque.current.x;
    const dy = pageY - toque.current.y;
    toque.current = null;
    if (Math.abs(dx) < DESLOCAMENTO_MINIMO) return;
    if (Math.abs(dx) < Math.abs(dy) * PESO_HORIZONTAL) return;
    vaiPara(dx < 0 ? 1 : -1);
  }

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={estilos.tela}>
      <Voltar para="/home" rotulo="Liturgia" />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[estilos.scroll, { paddingBottom: 110 + insets.bottom }]}
        onTouchStart={medeToque}
        onTouchEnd={medeToque}
      >
        <Text style={estilos.sobre}>Liturgia Diária</Text>

        {etapas === null && !erro ? (
          <View style={estilos.estado}>
            <ActivityIndicator color={CORES.roxoBotao} />
            <Paragrafo style={estilos.estadoTexto}>Buscando a liturgia de hoje...</Paragrafo>
          </View>
        ) : erro ? (
          <View style={estilos.estado}>
            <TituloPagina>Liturgia indisponível</TituloPagina>
            <Paragrafo style={estilos.estadoTexto}>{erro}</Paragrafo>
            <Paragrafo style={estilos.nota}>
              O texto do dia vem de um serviço externo e não fica guardado no
              aplicativo.
            </Paragrafo>
            <Botao
              titulo="Tentar de novo"
              variante="contorno"
              onPress={() => setTentativa((n) => n + 1)}
              style={estilos.tentar}
            />
          </View>
        ) : (
          <Etapa etapa={etapas[atual]} />
        )}
      </ScrollView>

      {etapas && !erro ? (
        <BarraEtapas
          total={etapas.length}
          atual={atual}
          rotuloAnterior="Parte anterior da liturgia"
          rotuloProxima="Próxima parte da liturgia"
          aoAnterior={() => vaiPara(atual - 1)}
          aoProxima={() => vaiPara(atual + 1)}
        />
      ) : null}
    </View>
  );
}

function Etapa({ etapa }) {
  if (!etapa) return null;

  return (
    <View>
      <Text style={estilos.titulo}>{etapa.titulo}</Text>

      {etapa.id === "celebracao" ? <Celebracao etapa={etapa} /> : null}
      {etapa.opcoes ? (
        <Text style={estilos.opcoes}>
          Este dia tem mais de uma opção para esta leitura.
        </Text>
      ) : null}

      {etapa.id === "celebracao" && etapa.blocos?.length ? (
        <Text style={estilos.titulo}>Primeira leitura</Text>
      ) : null}

      <View style={estilos.conteudo}>
        {(etapa.blocos || []).map((bloco, indice) => (
          <Bloco key={`${etapa.id}-${indice}`} bloco={bloco} />
        ))}
      </View>
    </View>
  );
}

function Celebracao({ etapa }) {
  const hoje = formataDataLonga(hojeISO());
  return (
    <View style={estilos.celebracao}>
      {etapa.celebracao ? <Text style={estilos.celebracaoTexto}>{etapa.celebracao}</Text> : null}
      <Text style={estilos.data}>{hoje}</Text>
      {etapa.cor ? (
        <Text style={estilos.cor}>{`Cor litúrgica: ${etapa.cor}`}</Text>
      ) : null}
    </View>
  );
}

function Bloco({ bloco }) {
  const titulo = bloco.referencia
    ? [bloco.titulo, bloco.referencia].filter(Boolean).join(" · ")
    : bloco.titulo;

  // O salmo vem com o refrão e o texto em blocos separados. A leitura normal
  // é um bloco só, e a oração tem o nome da oração acima do texto.
  if (bloco.tipo === "salmo" && bloco.blocos?.length) {
    return (
      <View style={estilos.grupo}>
        {titulo ? <Text style={estilos.subtitulo}>{titulo}</Text> : null}
        {bloco.blocos.map((interno, indice) => (
          <TextoComVersiculos
            key={indice}
            texto={interno.texto}
            style={interno.tipo === "refrão" ? estilos.refrão : estilos.corpo}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={estilos.grupo}>
      {titulo ? <Text style={estilos.subtitulo}>{titulo}</Text> : null}
      {bloco.tipo === "leitura" ? (
        <TextoComVersiculos texto={bloco.texto} style={estilos.corpo} />
      ) : (
        <Text style={bloco.tipo === "oracao" ? estilos.oracao : estilos.corpo}>{bloco.texto}</Text>
      )}
    </View>
  );
}

function TextoComVersiculos({ texto, style }) {
  const partes = [];
  const marcador = /(^|[\s"“”.,;:!?])(\d+[ab]?)(?=$|[\s"“”.,;:!?])/gi;
  let inicio = 0;
  let match;

  while ((match = marcador.exec(texto))) {
    const inicioNumero = match.index + match[1].length;
    partes.push(texto.slice(inicio, inicioNumero));
    partes.push(
      <Text key={inicioNumero} style={estilos.numeroVersiculo}>
        {match[2]}
      </Text>
    );
    inicio = inicioNumero + match[2].length;
  }
  partes.push(texto.slice(inicio));

  return <Text style={style}>{partes}</Text>;
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  scroll: { paddingHorizontal: 20, paddingTop: 24 },
  sobre: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 12,
    lineHeight: 17,
    color: CORES.destaque,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  titulo: {
    marginTop: 7,
    fontFamily: FONTES.titulo,
    fontSize: 29,
    lineHeight: 34,
    color: CORES.titulo,
    textTransform: "uppercase",
  },
  celebracao: { marginTop: 22, gap: 8 },
  celebracaoTexto: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 19,
    lineHeight: 27,
    color: CORES.texto,
  },
  data: {
    fontFamily: FONTES.corpo,
    fontSize: 15,
    lineHeight: 22,
    color: CORES.texto,
    opacity: 0.75,
  },
  cor: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 13,
    lineHeight: 19,
    color: CORES.destaque,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  opcoes: {
    marginTop: 18,
    fontFamily: FONTES.corpo,
    fontSize: 13,
    lineHeight: 19,
    color: CORES.texto,
    opacity: 0.7,
  },
  conteudo: { gap: 17, marginTop: 26 },
  grupo: { gap: 8 },
  subtitulo: {
    fontFamily: FONTES.titulo,
    fontSize: 18,
    lineHeight: 23,
    color: CORES.titulo,
    textTransform: "uppercase",
  },
  corpo: {
    fontFamily: FONTES.corpoLeve,
    fontSize: 17,
    lineHeight: 26,
    color: "#526071",
  },
  numeroVersiculo: {
    fontFamily: FONTES.corpoSemi,
    color: CORES.texto,
  },
  oracao: {
    fontFamily: FONTES.corpo,
    fontSize: 17,
    lineHeight: 27,
    color: CORES.texto,
    fontStyle: "italic",
  },
  refrão: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 17,
    lineHeight: 26,
    color: CORES.titulo,
  },
  estado: { marginTop: 30, gap: 12 },
  estadoTexto: { fontSize: 16, lineHeight: 24 },
  nota: { fontSize: 13, lineHeight: 20, opacity: 0.65 },
  tentar: { marginTop: 8, alignSelf: "flex-start" },
});
