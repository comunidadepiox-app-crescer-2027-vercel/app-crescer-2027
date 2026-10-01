import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { observarNoticiasPublicadas } from "../../lib/noticias";
import { observarProgramaPublicado, itensDoDia, agrupaPorEspaco } from "../../lib/programa";
import { EDICAO, resolveDiaRecorte, formataDataCurta } from "../../lib/edicao";
import { NewsCard } from "../../components/NewsCard";
import { ProgramaLista } from "../../components/ProgramaLista";
import { FundoRoxoPoligonal, FundoLaranjaPoligonal } from "../../components/FundoPoligonal";
import { Botao, TituloSecao, Paragrafo } from "../../components/Ui";
import { CORES, FONTES } from "../../lib/tema";
import { useAuth } from "../../lib/authProvider";
import { useAviseMe } from "../../lib/aviseMe";

const foto = require("../../assets/brand/foto-evento.webp");

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { ids, ocupado, alternar } = useAviseMe(user?.uid);
  const [noticias, setNoticias] = useState(null);
  const [programa, setPrograma] = useState(null);
  const [erroNoticias, setErroNoticias] = useState(false);
  const [erroPrograma, setErroPrograma] = useState(false);
  const recorte = resolveDiaRecorte();

  useEffect(() => {
    const pararNoticias = observarNoticiasPublicadas(
      (lista) => {
        setErroNoticias(false);
        setNoticias(lista);
      },
      () => {
        setErroNoticias(true);
        setNoticias([]);
      },
      4
    );
    const pararPrograma = observarProgramaPublicado(
      (todos) => {
        setErroPrograma(false);
        setPrograma(itensDoDia(todos, recorte.date));
      },
      () => {
        setErroPrograma(true);
        setPrograma([]);
      }
    );
    return () => {
      pararNoticias();
      pararPrograma();
    };
  }, [recorte.date]);

  const grupos = programa ? agrupaPorEspaco(programa) : null;

  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={estilos.pagina}>
      <FundoRoxoPoligonal style={estilos.hero}>
        <Text style={estilos.edicao}>{EDICAO.nome}</Text>
        <Text style={estilos.slogan}>
          Ame sua casa, ame sua família e encontre a paz
        </Text>
        <Text style={estilos.quando}>
          De {formataDataCurta(EDICAO.inicio)} a {formataDataCurta(EDICAO.fim)}, {EDICAO.local}.
        </Text>
        <Botao titulo="Ver a programação" onPress={() => router.push("/programacao")} />
        <Image source={foto} style={estilos.foto} />
      </FundoRoxoPoligonal>

      <View style={estilos.secao}>
        <View style={estilos.cabeca}>
          <TituloSecao>Notícias</TituloSecao>
          <Pressable onPress={() => router.push("/noticias")}>
            <Text style={estilos.link}>Ver todas</Text>
          </Pressable>
        </View>
        {noticias === null ? (
          <Paragrafo>Carregando notícias...</Paragrafo>
        ) : erroNoticias ? (
          <Text style={estilos.erro}>Não foi possível carregar as notícias agora.</Text>
        ) : noticias.length === 0 ? (
          <Paragrafo>Ainda não há notícias publicadas. Volte em breve.</Paragrafo>
        ) : (
          <View style={{ gap: 14 }}>
            {noticias.map((n) => (
              <NewsCard key={n.id} noticia={n} />
            ))}
          </View>
        )}
      </View>

      <View style={estilos.secao}>
        <View style={estilos.cabeca}>
          <TituloSecao>
            {recorte.posicao === "durante" ? "Hoje no evento" : "Programação"}
          </TituloSecao>
          <Pressable onPress={() => router.push("/programacao")}>
            <Text style={estilos.link}>Cronograma</Text>
          </Pressable>
        </View>
        <Paragrafo>Programação de {formataDataCurta(recorte.date)}.</Paragrafo>
        {recorte.posicao === "depois" ? (
          <Paragrafo>
            O {EDICAO.nome} já aconteceu. Esta é a programação da última jornada, de{" "}
            {formataDataCurta(EDICAO.fim)}.
          </Paragrafo>
        ) : null}
        {programa === null ? (
          <Paragrafo>Carregando programação...</Paragrafo>
        ) : erroPrograma ? (
          <Text style={estilos.erro}>Não foi possível carregar a programação agora.</Text>
        ) : programa.length === 0 ? (
          <Paragrafo>
            A programação de {formataDataCurta(recorte.date)} ainda não foi publicada.
          </Paragrafo>
        ) : (
          <ProgramaLista
            grupos={grupos}
            lembretes={ids}
            ocupadoId={ocupado}
            onAlternarLembrete={alternar}
          />
        )}
      </View>

      <FundoLaranjaPoligonal style={estilos.cta}>
        <Text style={estilos.ctaTitulo}>Seja um Benfeitor da Fé</Text>
        <Text style={estilos.ctaTexto}>
          Realizar um evento como o Crescer é um grande desafio. Contribua com a
          Comunidade de São Pio X e ajude a levar o encontro a milhares de famílias.
        </Text>
        <Botao
          titulo="Quero ser Benfeitor da Fé"
          variante="roxo"
          onPress={() => router.push("/benfeitor")}
        />
      </FundoLaranjaPoligonal>
    </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  pagina: { paddingBottom: 32, backgroundColor: CORES.fundo },
  hero: { padding: 22, borderRadius: 0 },
  edicao: {
    fontFamily: FONTES.titulo,
    fontSize: 16,
    textTransform: "uppercase",
    color: CORES.amarelo,
  },
  slogan: {
    marginTop: 8,
    fontFamily: FONTES.titulo,
    fontSize: 28,
    lineHeight: 32,
    textTransform: "uppercase",
    color: "#fff",
  },
  quando: {
    marginTop: 10,
    marginBottom: 16,
    fontFamily: FONTES.corpo,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },
  foto: {
    width: "100%",
    height: 180,
    marginTop: 18,
    borderRadius: 10,
  },
  secao: { paddingHorizontal: 16, paddingTop: 28, gap: 12 },
  cabeca: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  link: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 13,
    color: CORES.destaque,
    textDecorationLine: "underline",
  },
  erro: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 14,
    color: CORES.vermelho,
  },
  cta: { margin: 16, marginTop: 28, padding: 22, borderRadius: 14 },
  ctaTitulo: {
    fontFamily: FONTES.titulo,
    fontSize: 24,
    textTransform: "uppercase",
    color: "#fff",
  },
  ctaTexto: {
    marginTop: 8,
    marginBottom: 16,
    fontFamily: FONTES.corpo,
    fontSize: 14,
    lineHeight: 21,
    color: "rgba(255,255,255,0.9)",
  },
});
