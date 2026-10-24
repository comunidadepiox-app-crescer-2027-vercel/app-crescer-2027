import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Redirect } from "expo-router";
import ChevronDown from "lucide-react-native/icons/chevron-down";
import ChevronUp from "lucide-react-native/icons/chevron-up";
import Search from "lucide-react-native/icons/search";
import X from "lucide-react-native/icons/x";
import { useAuth } from "../lib/authProvider";
import { Voltar } from "../components/Voltar";
import { Paragrafo, TituloPagina, TituloSecao } from "../components/Ui";
import { CORES, FONTES } from "../lib/tema";

const CATEGORIAS = [
  ["Informações gerais", [
    ["O que é o CRESCER?", "O CRESCER – Encontro Nacional da Família Católica é um evento católico gratuito, realizado durante o Carnaval em Campina Grande (PB). É promovido pela Associação Carismática Católica São Pio X e reúne famílias para oração, celebrações litúrgicas, pregações, evangelização e convivência fraterna. Pessoas de todas as idades podem participar, sem necessidade de vínculo com movimento ou comunidade."],
    ["Quando e onde será o CRESCER 2027?", "A 30ª edição acontece de 5 a 9 de fevereiro de 2027, no Pavilhão de Eventos e Feiras do Centro de Convenções Antônio Vital do Rêgo, em Campina Grande (PB)."],
    ["Quais eventos paralelos acontecem durante o CRESCER?", "São dois eventos independentes entre si. A ExpoFamília é uma feira com exposição de produtos, serviços e soluções para a família e o lar. O CONAFAM – Congresso Nacional da Família tem programação formativa e inscrição própria e paga."],
  ]],
  ["Inscrição e acesso", [
    ["Preciso me inscrever? Como faço?", "Sim. A inscrição é gratuita e obrigatória a partir dos 10 anos, e deve ser feita pelo aplicativo oficial do CRESCER. Crianças menores de 10 anos ficam sob a responsabilidade dos pais ou responsáveis. Familiares podem ajudar no preenchimento, desde que os dados de cada participante estejam corretos."],
    ["A inscrição vale para todos os dias? Posso me inscrever no dia do evento?", "Uma única inscrição individual vale para todos os dias, e você pode participar apenas dos dias que desejar. Recomenda-se fazer a inscrição com antecedência. Inscrições presenciais dependerão da capacidade do local."],
    ["Não recebi a confirmação ou preciso corrigir meus dados. O que faço?", "Primeiro, confira no aplicativo se o cadastro foi concluído e use os recursos de consulta e recuperação da plataforma. Para correções ou se o problema continuar, entre em contato pelo WhatsApp (83) 98897-7017 ou pelo e-mail contato@piox.org.br."],
    ["Como funciona a entrada? Onde encontro meu QR Code?", "A entrada é feita com a apresentação do QR Code, no celular ou impresso. O código é enviado por e-mail e WhatsApp e também fica disponível no aplicativo. Recomenda-se levar um documento oficial com foto para eventual conferência do cadastro."],
    ["Perdi meu QR Code. Posso entrar? Posso sair e voltar no mesmo dia?", "Em casos excepcionais, a inscrição pode ser localizada pelo número de inscrição ou pelo CPF. A reentrada no mesmo dia está sujeita às regras de controle de público e de segurança do local."],
  ]],
  ["Programação", [
    ["Onde consulto a programação, os horários e os convidados?", "A programação estará no aplicativo, nos canais oficiais e em encontrodafamiliacatolica.com.br/programacao. Horários e convidados podem sofrer alterações sem aviso prévio. O evento também prevê atividades simultâneas para diferentes públicos."],
    ["Haverá missas, Adoração e confissões?", "As Santas Missas acontecem de sábado a terça-feira, de 6 a 9 de fevereiro. Também haverá momentos de Adoração e procissões do Santíssimo Sacramento, com horários informados na programação. Locais e horários de confissão serão divulgados principalmente pelo aplicativo."],
    ["Posso acompanhar o CRESCER pela internet?", "Sim. O evento será transmitido em diversas plataformas, principalmente no canal youtube.com/encontrodafamiliacatolica."],
  ]],
  ["Crianças, jovens e famílias", [
    ["Posso levar crianças?", "Sim. O CRESCER é voltado para toda a família. Os menores devem permanecer sob a responsabilidade dos pais ou responsáveis legais."],
    ["Como funciona o espaço de evangelização infantil?", "O espaço atende crianças de 4 a 9 anos, com vagas limitadas e inscrições feitas diariamente, conforme a capacidade. Os responsáveis devem permanecer disponíveis e cuidar do lanche das crianças, pois o espaço não oferece alimentação. O credenciamento não transfere à organização a responsabilidade legal pela criança. As regras completas estão em edital próprio."],
    ["Há atividades para adolescentes e jovens?", "Sim. O Espaço Geração IGNIS é dedicado aos jovens, com atividades de evangelização e convivência. Os horários estão na programação oficial."],
  ]],
  ["Acessibilidade", [
    ["O evento é acessível e oferece atendimento prioritário?", "Sim. Idosos, gestantes e pessoas com deficiência têm atendimento prioritário, e haverá áreas reservadas para acesso prioritário. Toda a programação do palco principal e do CONAFAM terá interpretação em Libras. Cuidadores e acompanhantes podem acessar o evento. Para orientações específicas, procure os canais oficiais ou as equipes de acolhida."],
    ["Há vagas de estacionamento para pessoas com deficiência?", "As vagas acessíveis seguem a legislação e as orientações da administração do estacionamento do Centro de Convenções. A organização não se responsabiliza por veículos estacionados em vias públicas ou em estacionamentos de terceiros."],
  ]],
  ["Transporte e estacionamento", [
    ["Como chego e onde estaciono?", "O Centro de Convenções fica na Alça Leste, no bairro Nova Brasília, em Campina Grande. O estacionamento interno é gratuito e comporta também ônibus e vans, conforme a capacidade. A organização pede uma oferta voluntária para ajudar nas despesas de segurança e controle de tráfego."],
    ["Haverá caravanas? Como organizo a da minha cidade?", "Haverá caravanas gratuitas saindo das paróquias de Campina Grande, organizadas com a Diocese. Rotas e horários estarão em encontrodafamiliacatolica.com.br/caravanasparoquias. Caravanas de outras cidades devem ser cadastradas em encontrodafamiliacatolica.com.br/caravanas, e cada participante precisa fazer sua inscrição individual."],
  ]],
  ["Alimentação e segurança", [
    ["Haverá alimentação no local? Posso levar comida ou bebida?", "Sim, haverá serviços de alimentação. As opções e as formas de pagamento variam conforme os estabelecimentos, que devem ser consultados sobre ingredientes e restrições alimentares. Só é permitido entrar com um recipiente de água potável para consumo próprio. Bebidas alcoólicas são terminantemente proibidas."],
    ["O que é proibido levar? Haverá revista?", "É proibido entrar com armas, objetos cortantes ou perfurantes, drogas ilícitas, bebidas alcoólicas, cigarros eletrônicos e itens que ofereçam risco à segurança. Bolsas e mochilas podem passar por inspeção visual preventiva, impessoal e não invasiva."],
    ["Quais outras regras devo observar?", "• Lugares: são ocupados por ordem de chegada, e não é permitido reservá-los para ausentes.\n• Fotos e vídeos: devem respeitar a privacidade dos participantes. Registros profissionais ou comerciais exigem autorização.\n• Segurança e saúde: o evento conta com equipes de segurança e atendimento médico.\n• Achados e perdidos: procure a equipe de acolhida.\n• Regimento Geral: está disponível nos canais oficiais."],
  ]],
  ["Voluntariado, apoio e contato", [
    ["Como posso ser voluntário?", "O processo de inscrição e seleção será divulgado nos canais oficiais. A idade mínima e os requisitos variam conforme a equipe. A coordenação distribui os voluntários de acordo com as necessidades operacionais e o perfil de cada um."],
    ["Como posso doar ou patrocinar o evento?", "As doações mantêm o CRESCER gratuito e devem ser feitas exclusivamente à Associação Carismática Católica São Pio X, CNPJ 02.898.732/0001-23, única entidade oficial para recebê-las. Empresas interessadas em patrocínio devem procurar a organização pelo e-mail contato@piox.org.br ou pelo WhatsApp (83) 98897-7017."],
    ["Como falo com a organização ou com a imprensa?", "O contato geral é pelo e-mail contato@piox.org.br ou pelo WhatsApp (83) 98897-7017. Já os jornalistas que desejam realizar a cobertura do evento devem procurar a Assessoria de Imprensa pelo e-mail imprensa@piox.org.br ou (83) 9 8871.5912. O acesso a áreas reservadas depende de credenciamento prévio."],
  ]],
  ["ExpoFamília", [
    ["O que é a ExpoFamília? Preciso de inscrição?", "É um evento paralelo ao CRESCER, com identidade e programação próprias, voltado à exposição de produtos, serviços e iniciativas para a família e o lar. A entrada é gratuita e liberada a quem tem inscrição no CRESCER 2027. A programação musical e cultural integra a programação oficial do CRESCER."],
    ["Quando e onde funciona a ExpoFamília?", "A feira funciona no Centro de Convenções, de 5 a 9 de fevereiro de 2027. Na sexta-feira, o horário é das 17h às 22h. De sábado à terça-feira, das 12h às 22h. A lista de expositores será divulgada nos canais oficiais."],
    ["Como posso ser expositor?", "Os interessados devem entrar em contato pelo e-mail contato@piox.org.br ou pelo WhatsApp (83) 98897-7017 para conhecer espaços, condições comerciais e formas de contratação."],
  ]],
  ["CONAFAM", [
    ["O que é o CONAFAM e qual a diferença para o CRESCER?", "O CONAFAM – Congresso Nacional da Família é um evento formativo, com palestras sobre temas familiares. Ele é paralelo ao CRESCER, mas totalmente distinto dele. A inscrição gratuita no CRESCER não dá acesso ao congresso, que tem inscrição própria e paga."],
    ["Como me inscrevo no CONAFAM?", "A inscrição é feita exclusivamente pelo site conafam.com.br, onde também estão os valores, os lotes, a programação e os palestrantes. As vagas são limitadas pela capacidade do espaço. As regras de cancelamento e reembolso constam do regulamento do congresso e devem ser consultadas antes do pagamento."],
    ["Quando e onde acontece o CONAFAM? Haverá certificado?", "O CONAFAM acontece de 7 a 9 de fevereiro de 2027, das 15h às 19h, no Espaço Cultural Shaolin do Centro de Convenções. O acesso exige a inscrição própria no congresso, com credenciamento específico. Quem tiver presença superior a 66% dos dias receberá certificado digital."],
  ]],
];

const normaliza = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export default function FAQScreen() {
  const { user, loading } = useAuth();
  const [busca, setBusca] = useState("");
  const [aberta, setAberta] = useState(null);
  const resultados = useMemo(() => {
    const termo = normaliza(busca.trim());
    return CATEGORIAS.map(([categoria, perguntas]) => [categoria, perguntas
      .map(([pergunta, resposta], indice) => ({ pergunta, resposta, id: `${categoria}-${indice}` }))
      .filter(({ pergunta, resposta }) => !termo || normaliza(`${categoria} ${pergunta} ${resposta}`).includes(termo)),
    ]).filter(([, perguntas]) => perguntas.length);
  }, [busca]);
  const total = resultados.reduce((soma, [, perguntas]) => soma + perguntas.length, 0);

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={estilos.tela}>
      <Voltar para="/home" rotulo="FAQ" />
      <ScrollView contentContainerStyle={estilos.pagina} keyboardShouldPersistTaps="handled">
        <TituloPagina>FAQ Crescer 2027</TituloPagina>
        <Paragrafo style={estilos.intro}>Encontre respostas para suas dúvidas sobre o evento.</Paragrafo>
        <View style={estilos.busca}>
          <Search size={20} color={CORES.destaque} />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar perguntas e respostas"
            placeholderTextColor="rgba(17,28,45,0.45)"
            accessibilityLabel="Buscar no FAQ"
            returnKeyType="search"
            style={estilos.campoBusca}
          />
          {busca ? (
            <Pressable onPress={() => setBusca("")} accessibilityRole="button" accessibilityLabel="Limpar busca" hitSlop={10}>
              <X size={20} color={CORES.texto} />
            </Pressable>
          ) : null}
        </View>
        <Text style={estilos.contagem}>{total} {total === 1 ? "pergunta encontrada" : "perguntas encontradas"}</Text>
        {resultados.length ? resultados.map(([categoria, perguntas]) => (
          <View key={categoria} style={estilos.categoria}>
            <TituloSecao style={estilos.tituloCategoria}>{categoria}</TituloSecao>
            <View style={estilos.lista}>
              {perguntas.map(({ id, pergunta, resposta }) => {
                const expandida = aberta === id;
                return (
                  <View key={id} style={estilos.item}>
                    <Pressable
                      onPress={() => setAberta(expandida ? null : id)}
                      accessibilityRole="button"
                      accessibilityState={{ expanded: expandida }}
                      style={({ pressed }) => [estilos.pergunta, pressed && { opacity: 0.75 }]}
                    >
                      <Text style={estilos.textoPergunta}>{pergunta}</Text>
                      {expandida
                        ? <ChevronUp size={20} color={CORES.destaque} />
                        : <ChevronDown size={20} color={CORES.destaque} />}
                    </Pressable>
                    {expandida ? <Text style={estilos.resposta}>{resposta}</Text> : null}
                  </View>
                );
              })}
            </View>
          </View>
        )) : <Text style={estilos.vazio}>Nenhuma pergunta encontrada. Tente outros termos.</Text>}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  pagina: { paddingHorizontal: 16, paddingTop: 22, paddingBottom: 48 },
  intro: { marginTop: 10 },
  busca: {
    minHeight: 50,
    marginTop: 20,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: CORES.linha,
    borderRadius: 10,
    backgroundColor: CORES.superficie,
  },
  campoBusca: { flex: 1, paddingVertical: 12, fontFamily: FONTES.corpo, fontSize: 15, color: CORES.texto },
  contagem: { marginTop: 12, fontFamily: FONTES.corpoMedio, fontSize: 13, color: CORES.texto, opacity: 0.65 },
  categoria: { marginTop: 26 },
  tituloCategoria: { marginBottom: 12, fontSize: 19, lineHeight: 24 },
  lista: { gap: 10 },
  item: { borderWidth: 1, borderColor: CORES.linha, borderRadius: 12, backgroundColor: CORES.superficie },
  pergunta: { minHeight: 56, paddingHorizontal: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  textoPergunta: { flex: 1, fontFamily: FONTES.corpoMedio, fontSize: 15, lineHeight: 21, color: CORES.titulo },
  resposta: { paddingHorizontal: 16, paddingBottom: 16, fontFamily: FONTES.corpo, fontSize: 15, lineHeight: 23, color: CORES.texto },
  vazio: { paddingTop: 28, fontFamily: FONTES.corpo, fontSize: 15, lineHeight: 23, color: CORES.texto },
});
