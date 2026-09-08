import { View, ScrollView, Linking, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../lib/authProvider";
import { EDICAO } from "../lib/edicao";
import { Voltar } from "../components/Voltar";
import { TituloPagina, TituloSecao, Paragrafo, Botao } from "../components/Ui";
import { CORES } from "../lib/tema";

export default function SobreScreen() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={estilos.tela}>
      <Voltar para="/conta" rotulo="Conta" />
      <ScrollView contentContainerStyle={estilos.pagina}>
      <TituloPagina>Sobre o Crescer</TituloPagina>
      <Paragrafo style={{ marginTop: 14 }}>
        O Crescer nasceu em Campina Grande como resposta autêntica para os fiéis
        católicos no período do carnaval. O nome vem da Segunda Carta de São
        Pedro: crescer na graça e no conhecimento do Senhor (2 Pd 3, 18).
      </Paragrafo>
      <Paragrafo style={{ marginTop: 12 }}>
        Em 2009 o evento assumiu a temática da família e, desde 2012, intitula-se
        o Encontro da Família Católica. Hoje é considerado o maior encontro de
        famílias católicas do Brasil, promovido pela Comunidade de São Pio X e
        recebendo caravanas de todo o país.
      </Paragrafo>
      <Paragrafo style={{ marginTop: 12 }}>
        A edição atual é o {EDICAO.nome}, realizado no {EDICAO.local}. A
        comunidade já convoca as famílias para o Crescer 2027.
      </Paragrafo>

      <TituloSecao style={{ marginTop: 28 }}>Caravanas</TituloSecao>
      <Paragrafo style={{ marginTop: 10 }}>
        Venha em caravana. Encontre responsáveis que organizam viagens e
        peregrinações para o encontro perto de você, ou inscreva a sua caravana
        no site oficial.
      </Paragrafo>
      <Botao
        titulo="Caravanas no site oficial"
        onPress={() => Linking.openURL("https://encontrodafamiliacatolica.com.br/")}
        style={{ marginTop: 14 }}
      />

      <TituloSecao style={{ marginTop: 28 }}>Comunidade de São Pio X</TituloSecao>
      <Paragrafo style={{ marginTop: 10 }}>Rua Afonso Pena, 61, Centro, Campina Grande, PB</Paragrafo>
      <Paragrafo>Telefones: (83) 3341-7017 e (83) 3088-7017</Paragrafo>
      <Paragrafo>WhatsApp: (83) 98897-7017</Paragrafo>
      <Paragrafo>E-mail: contato@piox.org.br</Paragrafo>
      <Paragrafo style={{ marginTop: 12, opacity: 0.65 }}>
        Mantenedora: Associação Carismática Católica São Pio X. CNPJ 02.868.732/0001-23.
      </Paragrafo>
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  pagina: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
});
