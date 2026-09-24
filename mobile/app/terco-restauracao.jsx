import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Linking } from "react-native";
import { Redirect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../lib/authProvider";
import { Voltar } from "../components/Voltar";
import { IconeSetaEsquerda } from "../components/Icones";
import { CORES, FONTES } from "../lib/tema";

const RESTAURACOES = [
  ["1ª Restauração", "Pela cura da vida conjugal"],
  ["2ª Restauração", "Pela cura da vida profissional e financeira"],
  ["3ª Restauração", "Pela cura da relação entre pais e filhos"],
  ["4ª Restauração", "Pela cura dos traumas de família"],
  ["5ª Restauração", "Pela saúde"],
];

const ETAPAS = [
  ["Introdução", [
    ["p", "O Terço pela Restauração das Famílias é uma resposta da Comunidade de São Pio X aos muitos fiéis que buscam em Deus a restauração de suas famílias. É um convite à oração, à fé e à confiança no Senhor pela cura, fortalecimento e renovação dos laços familiares."],
    ["p", "Reze com fé e perseverança, confiando sua família à intercessão da Sagrada Família de Nazaré e colocando diante de Deus suas necessidades e esperanças."],
    ["p", "Observação: não é necessário adquirir um terço especial, com mais ou menos contas. O terço que você já possui é suficiente."],
    ["h", "Conheça o livro"],
    ["p", "Aprofunde essa experiência de oração com o livro Terço pela Restauração das Famílias, da Comunidade de São Pio X."],
    ["p", "Adquira seu exemplar na loja da Comunidade São Pio X ou pela loja virtual da Livraria Loyola."],
    ["l", "Comprar na loja virtual da Livraria Loyola", "https://www.livrarialoyola.com.br/produto/terco-pela-restauracao-das-familias-416233"]
  ]],
  ["Sinal da Cruz e oferecimento", [
    ["i", "Primeiro, você vai fazer o"],
    ["h", "Sinal da Cruz"],
    ["o", "Pelo sinal da santa Cruz, livrai-nos Deus, nosso Senhor, dos nossos inimigos. Em nome do Pai e do Filho e do Espírito Santo. Amém!"],
    ["h", "Oferecimento"],
    ["o", "Abri, Senhor, os meus lábios para bendizer o vosso santo nome. Purificai o meu coração de todos os pensamentos vãos, desordenados e estranhos. Iluminai o meu entendimento e inflamai minha vontade para que possa rezar digna, atenta e devotamente este Terço, e mereça ser atendido na presença da vossa divina Majestade. Amém!"],
  ]],
  ["Creio", [
    ["i", "Na cruz, você vai rezar:"],
    ["o", "Creio em Deus Pai todo-poderoso, criador do Céu e da terra. E em Jesus Cristo, seu único Filho, nosso Senhor, que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado. Desceu à mansão dos mortos; ressuscitou ao terceiro dia, subiu aos céus; está sentado à direita de Deus Pai todo-poderoso, donde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica; na comunhão dos santos; na remissão dos pecados; na ressurreição da carne; na vida eterna.\n\nAmém!"],
  ]],
  ["Pai-nosso", [
    ["i", "Na primeira conta grande, você vai rezar o Pai-nosso:"],
    ["o", "Pai nosso que estais nos céus,\nsantificado seja o vosso nome,\nvenha a nós o vosso Reino,\nseja feita a vossa vontade,\nassim na terra como no céu;\no pão nosso de cada dia nos dai hoje,\nperdoai-nos as nossas ofensas,\nassim como nós perdoamos\na quem nos tem ofendido\ne não nos deixeis cair em tentação,\nmas livrai-nos do mal. Amém!"],
  ]],
  ["Três contas pequenas", [
    ["i", "Você vai rezar a saudação à Sagrada Família:"],
    ["p", "Jesus, Filho de Deus e filho de Maria, abençoai a minha família! Inspirai nela a unidade, a paz e o amor mútuo que encontrou em vossa própria família na pequena cidade de Nazaré."],
    ["p", "Maria, Mãe de Jesus e Nossa Mãe, nutri a nossa família com vossa fé e o vosso amor. Conservai-nos perto de vosso Filho Jesus, em todas as nossas tristezas e alegrias."],
    ["p", "José, pai “adotivo” de Jesus, guardião e esposo de Maria, protegei a nossa família. Ajudai-nos em todos os momentos de desânimo ou ansiedade."],
    ["i", "Ao final, você vai rezar o Glória ao Pai:"],
    ["o", "Glória ao Pai e ao Filho e ao Espírito Santo,\ncomo era no princípio, agora e sempre. Amém!"],
  ]],
  ...RESTAURACOES.map(([titulo, intencao]) => [titulo, [
    ["i", intencao], ["h", "Conta grande"],
    ["o", "Ó Sagrada Família, que imitemos em nossos lares as vossas virtudes e que, unidos pelos laços do amor, cheguemos um dia às alegrias do Céu."],
    ["h", "Conta pequena, 10 vezes"], ["o", "Jesus, Maria e José, minha família vossa é!"],
    ["h", "JACULATÓRIA"],
    ["o", "Jesus, Maria e José,\neu vos dou meu coração e a minha alma."],
  ]]),
  ["Agradecimento", [["o", "Jesus, Maria e José,\nem Vós contemplamos\no esplendor do verdadeiro amor,\nconfiantes, a Vós nos consagramos.\n\nSagrada Família de Nazaré,\ntornai também as nossas famílias\nlugares de comunhão e cenáculos de oração,\nautênticas escolas do Evangelho\ne pequenas igrejas domésticas.\n\nSagrada Família de Nazaré,\nque nunca mais haja nas famílias\nepisódios de violência, de fechamento e divisão;\ne quem tiver sido ferido ou escandalizado\nseja rapidamente consolado e curado.\n\nSagrada Família de Nazaré,\nfazei que todos nos tornemos conscientes\ndo caráter sagrado e inviolável da família,\nda sua beleza no projeto de Deus.\n\nJesus, Maria e José,\nouvi-nos e acolhei a nossa súplica.\n\nAmém!"]]],
];

export default function TercoRestauracaoScreen() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const [atual, setAtual] = useState(0);
  const [titulo, blocos] = ETAPAS[atual];

  useEffect(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, [atual]);
  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return <View style={s.tela}>
    <Voltar para="/home" rotulo="Terço" />
    <ScrollView ref={scrollRef} contentContainerStyle={[s.scroll, { paddingBottom: 110 + insets.bottom }]}>
      <Text style={s.sobre}>Terço da Restauração das Famílias</Text>
      <Text style={s.titulo}>{titulo}</Text>
      <View style={s.conteudo}>
        {blocos.map(([tipo, texto, url], indice) => (
          <Bloco key={`${titulo}-${indice}`} tipo={tipo} texto={texto} url={url} numero={indice + 1} />
        ))}
      </View>
    </ScrollView>
    <View style={[s.nav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Seta rotulo="Etapa anterior" desabilitada={atual === 0} onPress={() => setAtual(atual - 1)} />
      <Text accessibilityLiveRegion="polite" style={s.contador}>{`${atual + 1} de ${ETAPAS.length}`}</Text>
      <Seta rotulo="Próxima etapa" direita desabilitada={atual === ETAPAS.length - 1} onPress={() => setAtual(atual + 1)} />
    </View>
  </View>;
}

function Bloco({ tipo, texto, url, numero }) {
  if (tipo === "l") {
    return (
      <Pressable onPress={() => Linking.openURL(url)} style={s.botaoLink}>
        <Text style={s.textoLink}>{texto}</Text>
      </Pressable>
    );
  }

  const estilo = tipo === "h" ? s.subtitulo : tipo === "i" ? s.intencao : tipo === "o" ? s.oracao : tipo === "n" ? s.numerado : s.paragrafo;
  return <Text style={estilo}>{tipo === "n" ? `${numero}. ${texto}` : texto}</Text>;
}

function Seta({ rotulo, direita, desabilitada, onPress }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={rotulo} accessibilityState={{ disabled: desabilitada }} disabled={desabilitada} onPress={onPress} hitSlop={10} style={[s.seta, desabilitada && s.desabilitada]}>
    <View style={direita && s.direita}><IconeSetaEsquerda cor="#fff" tamanho={28} /></View>
  </Pressable>;
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo }, 
  scroll: { paddingHorizontal: 20, paddingTop: 24 },
  sobre: { fontFamily: FONTES.corpoSemi, fontSize: 12, lineHeight: 17, color: CORES.destaque, textTransform: "uppercase", letterSpacing: 0.5 },
  titulo: { marginTop: 7, fontFamily: FONTES.titulo, fontSize: 29, lineHeight: 34, color: CORES.titulo, textTransform: "uppercase" },
  conteudo: { gap: 17, marginTop: 26 }, 
  paragrafo: { fontFamily: FONTES.corpo, fontSize: 17, lineHeight: 26, color: CORES.texto },
  oracao: { fontFamily: FONTES.corpo, fontSize: 17, lineHeight: 27, color: CORES.texto, fontStyle: "italic" },
  subtitulo: { marginTop: 5, fontFamily: FONTES.titulo, fontSize: 18, lineHeight: 23, color: CORES.titulo, textTransform: "uppercase" },
  intencao: { marginTop: -6, fontFamily: FONTES.corpoMedio, fontSize: 18, lineHeight: 25, color: CORES.texto },
  numerado: { fontFamily: FONTES.corpo, fontSize: 17, lineHeight: 26, color: CORES.texto },
  botaoLink: { backgroundColor: CORES.roxoBotao, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: "center", marginTop: 8 },
  textoLink: { fontFamily: FONTES.corpoSemi, fontSize: 16, color: "#fff", textAlign: "center" },
  nav: { position: "absolute", left: 0, right: 0, bottom: 0, minHeight: 70, paddingHorizontal: 20, paddingTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: CORES.roxoBotao, borderTopWidth: 1, borderTopColor: CORES.roxo },
  seta: { width: 44, height: 42, alignItems: "center", justifyContent: "center" }, 
  desabilitada: { opacity: 0.32 }, 
  direita: { transform: [{ rotate: "180deg" }] },
  contador: { fontFamily: FONTES.corpoSemi, fontSize: 14, color: "#fff", textTransform: "uppercase", letterSpacing: 0.6 },
});