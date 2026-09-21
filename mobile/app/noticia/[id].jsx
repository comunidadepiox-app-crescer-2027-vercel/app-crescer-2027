import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../lib/authProvider";
import { getPublishedNewsById, formataDataFirestore } from "../../lib/noticias";
import { Voltar } from "../../components/Voltar";
import { TituloPagina, Paragrafo } from "../../components/Ui";
import { CorpoNoticia } from "../../components/CorpoNoticia";
import { corpoEhHtml } from "../../lib/artigoHtml";
import { CORES, FONTES } from "../../lib/tema";

const simbolo = require("../../assets/brand/simbolo-crescer.png");

export default function NoticiaDetalheScreen() {
  const { user, loading } = useAuth();
  const { id } = useLocalSearchParams();
  const [estado, setEstado] = useState({ carregando: true, noticia: null });

  useEffect(() => {
    if (!id) return;
    getPublishedNewsById(id)
      .then((noticia) => setEstado({ carregando: false, noticia }))
      .catch(() => setEstado({ carregando: false, noticia: null }));
  }, [id]);

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  if (estado.carregando) {
    return (
      <View style={estilos.tela}>
        <Voltar para="/noticias" rotulo="Notícias" />
        <View style={estilos.centro}>
          <ActivityIndicator color={CORES.titulo} />
        </View>
      </View>
    );
  }

  if (!estado.noticia) {
    return (
      <View style={estilos.tela}>
        <Voltar para="/noticias" rotulo="Notícias" />
        <View style={estilos.corpo}>
          <TituloPagina>Notícia não encontrada</TituloPagina>
          <Paragrafo style={{ marginTop: 12 }}>
            Esta notícia não existe ou não está mais publicada.
          </Paragrafo>
        </View>
      </View>
    );
  }

  const { noticia } = estado;
  const html = corpoEhHtml(noticia.body);
  const paragrafos = html
    ? []
    : String(noticia.body || "")
        .split(/\n{2,}|\r\n\r\n/)
        .filter((p) => p.trim());

  return (
    <View style={estilos.tela}>
      <Voltar para="/noticias" rotulo="Notícias" />
      <ScrollView contentContainerStyle={estilos.scroll}>
        <View style={estilos.capaBloco}>
          {noticia.coverUrl ? (
            <Image source={{ uri: noticia.coverUrl }} style={estilos.capa} />
          ) : (
            <Image source={simbolo} style={estilos.simbolo} resizeMode="contain" />
          )}
        </View>
        <View style={estilos.corpo}>
          <Text style={estilos.data}>{formataDataFirestore(noticia.publishedAt)}</Text>
          <TituloPagina>{noticia.title}</TituloPagina>
          {noticia.authorName || noticia.authorPhotoUrl ? (
            <View style={estilos.autor}>
              {noticia.authorPhotoUrl ? (
                <Image source={{ uri: noticia.authorPhotoUrl }} style={estilos.fotoAutor} />
              ) : null}
              {noticia.authorName ? <Text style={estilos.nomeAutor}>{noticia.authorName}</Text> : null}
            </View>
          ) : null}
          {html ? (
            <CorpoNoticia body={noticia.body} />
          ) : (
            <View style={estilos.texto}>
              {paragrafos.map((paragrafo, i) => (
                <Paragrafo key={i}>{paragrafo.trim()}</Paragrafo>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { paddingBottom: 48 },
  capaBloco: {
    width: "100%",
    height: 240,
    backgroundColor: CORES.creme,
    alignItems: "center",
    justifyContent: "center",
  },
  capa: { width: "100%", height: "100%" },
  simbolo: { width: 88, height: 88, opacity: 0.75 },
  corpo: { paddingHorizontal: 20, paddingTop: 22 },
  data: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 13,
    color: CORES.destaque,
    marginBottom: 8,
  },
  texto: { gap: 16, marginTop: 18 },
  autor: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fotoAutor: { width: 40, height: 40 },
  nomeAutor: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 14,
    color: CORES.texto,
  },
});
