import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { listPublishedNews } from "../../lib/noticias";
import { NewsCard } from "../../components/NewsCard";
import { TituloPagina, Paragrafo } from "../../components/Ui";
import { CORES, FONTES } from "../../lib/tema";

export default function NoticiasScreen() {
  const [noticias, setNoticias] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    listPublishedNews(50)
      .then(setNoticias)
      .catch(() => {
        setErro(true);
        setNoticias([]);
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={estilos.pagina}>
      <TituloPagina>Notícias</TituloPagina>
      <Paragrafo style={{ marginTop: 8 }}>
        As novidades do Crescer e da Comunidade de São Pio X.
      </Paragrafo>
      {noticias === null ? (
        <Paragrafo style={{ marginTop: 20 }}>Carregando notícias...</Paragrafo>
      ) : erro ? (
        <Text style={estilos.erro}>Não foi possível carregar as notícias agora.</Text>
      ) : noticias.length === 0 ? (
        <Paragrafo style={{ marginTop: 20 }}>
          Ainda não há notícias publicadas. Volte em breve.
        </Paragrafo>
      ) : (
        <View style={{ gap: 14, marginTop: 20 }}>
          {noticias.map((n) => (
            <NewsCard key={n.id} noticia={n} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pagina: { padding: 16, paddingBottom: 32, backgroundColor: CORES.fundo },
  erro: {
    marginTop: 20,
    fontFamily: FONTES.corpoMedio,
    fontSize: 14,
    color: CORES.vermelho,
  },
});
