import { useState } from "react";
import { View, Text, Image, ScrollView, Pressable, Linking, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../lib/authProvider";
import { validaLead, submitLead, hrefWhatsappCadastro, WHATSAPP_ROTULO } from "../../lib/benfeitor";
import { FundoRoxoPoligonal } from "../../components/FundoPoligonal";
import { IconeCoracaoChama } from "../../components/Icones";
import { Campo, Botao, TituloSecao, Paragrafo, TextoErro } from "../../components/Ui";
import { CORES, FONTES } from "../../lib/tema";

const foto = require("../../assets/brand/foto-evento.webp");

const PASSOS = [
  "A equipe da Comunidade de São Pio X entra em contato no WhatsApp que você informou.",
  "Vocês combinam a contribuição mensal. O pagamento é por boleto ou Pix, fora deste aplicativo.",
  "Nada foi cobrado agora. Este foi só o cadastro de interesse.",
];

export default function BenfeitorScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    name: profile?.displayName || user?.displayName || "",
    email: user?.email || "",
    phone: "",
    cpf: "",
    lgpdConsent: false,
  });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function atualiza(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function enviar() {
    setErro("");
    const problema = validaLead(form);
    if (problema) {
      setErro(problema);
      return;
    }
    setEnviando(true);
    try {
      await submitLead({ uid: user.uid, ...form });
      setEnviado(true);
    } catch {
      setErro("Não foi possível enviar agora. Tente novamente em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <ScrollView contentContainerStyle={estilos.pagina}>
        <FundoRoxoPoligonal style={estilos.hero}>
          <IconeCoracaoChama cor={CORES.dourado} tamanho={48} />
          <Text style={estilos.kicker}>Benfeitor da Fé</Text>
          <Text style={[estilos.heroTitulo, { marginTop: 8 }]}>Cadastro recebido</Text>
          <Text style={estilos.heroTexto}>
            Obrigado por querer sustentar esta missão. A Comunidade de São Pio X
            recebeu seus dados e vai falar com você para concluir o cadastro.
          </Text>
          <Botao
            titulo="Falar no WhatsApp"
            onPress={() => Linking.openURL(hrefWhatsappCadastro())}
            style={{ marginTop: 16, alignSelf: "stretch" }}
          />
        </FundoRoxoPoligonal>

        <View style={estilos.depois}>
          <TituloSecao>O que acontece agora</TituloSecao>
          {PASSOS.map((texto, i) => (
            <View key={texto} style={estilos.passo}>
              <Text style={estilos.passoNum}>{i + 1}</Text>
              <Paragrafo style={{ flex: 1 }}>{texto}</Paragrafo>
            </View>
          ))}
          <Text style={estilos.nota}>
            Canal oficial da comunidade: {WHATSAPP_ROTULO}. Este aplicativo não
            processa pagamentos.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={estilos.pagina}>
      <FundoRoxoPoligonal style={estilos.hero}>
        <IconeCoracaoChama cor={CORES.dourado} tamanho={48} />
        <Text style={estilos.heroTitulo}>Seja um Benfeitor da Fé</Text>
        <Text style={estilos.heroTexto}>
          Ajude a Comunidade de São Pio X a transformar as famílias e contribua
          para a realização do Crescer.
        </Text>
      </FundoRoxoPoligonal>

      <View style={{ padding: 16, gap: 12 }}>
        <Paragrafo>
          O Benfeitor da Fé é uma campanha de apoio contínuo, formada por pessoas
          que decidem colaborar mensalmente para sustentar e expandir as obras da
          Comunidade de São Pio X.
        </Paragrafo>
        <TituloSecao style={{ marginTop: 8 }}>Como participar</TituloSecao>
        <Paragrafo>1. Preencha o formulário com seus dados.</Paragrafo>
        <Paragrafo>2. Entraremos em contato no seu WhatsApp para concluir o cadastro.</Paragrafo>
        <Paragrafo>3. Todos os meses você poderá contribuir através de boleto ou Pix.</Paragrafo>

        <View style={{ gap: 12, marginTop: 8 }}>
          <Campo rotulo="Nome completo" value={form.name} onChangeText={(v) => atualiza("name", v)} />
          <Campo
            rotulo="E-mail"
            value={form.email}
            onChangeText={(v) => atualiza("email", v)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Campo
            rotulo="Celular com DDD"
            value={form.phone}
            onChangeText={(v) => atualiza("phone", v)}
            keyboardType="phone-pad"
            placeholder="(83) 90000-0000"
          />
          <Campo
            rotulo="CPF"
            value={form.cpf}
            onChangeText={(v) => atualiza("cpf", v)}
            keyboardType="number-pad"
            placeholder="000.000.000-00"
          />
          <Pressable
            onPress={() => atualiza("lgpdConsent", !form.lgpdConsent)}
            style={estilos.check}
          >
            <View style={[estilos.caixa, form.lgpdConsent && estilos.caixaOn]} />
            <Text style={estilos.checkTexto}>
              Autorizo o uso destes dados pela Comunidade de São Pio X apenas para
              o contato e o cadastro de Benfeitor da Fé, em conformidade com a LGPD.
            </Text>
          </Pressable>
          <TextoErro>{erro}</TextoErro>
          <Botao
            titulo="Quero participar"
            onPress={enviar}
            desabilitado={enviando}
            style={{ alignSelf: "stretch" }}
          />
        </View>
        <Text style={estilos.nota}>
          Este aplicativo não processa pagamentos. O envio deste formulário é um
          cadastro de interesse. Mantenedora: Associação Carismática Católica São
          Pio X, CNPJ 02.868.732/0001-23.
        </Text>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pagina: { paddingBottom: 32, backgroundColor: CORES.fundo },
  hero: { padding: 22, alignItems: "center" },
  heroTitulo: {
    marginTop: 14,
    fontFamily: FONTES.titulo,
    fontSize: 28,
    lineHeight: 32,
    textTransform: "uppercase",
    color: "#fff",
  },
  kicker: {
    marginTop: 14,
    fontFamily: FONTES.titulo,
    fontSize: 16,
    textTransform: "uppercase",
    color: CORES.amarelo,
  },
  foto: {
    width: "100%",
    height: 180,
    marginTop: 18,
    borderRadius: 10,
  },
  linkHomeWrap: { marginTop: 14 },
  linkHome: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 14,
    color: CORES.amarelo,
    textDecorationLine: "underline",
  },
  depois: { padding: 16, gap: 14 },
  passo: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  passoNum: {
    width: 22,
    fontFamily: FONTES.titulo,
    fontSize: 20,
    color: CORES.destaque,
  },
  heroTexto: {
    marginTop: 10,
    fontFamily: FONTES.corpo,
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255,255,255,0.85)",
    textAlign: "justify",
  },
  check: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  caixa: {
    width: 18,
    height: 18,
    marginTop: 2,
    borderWidth: 1,
    borderColor: CORES.titulo,
    borderRadius: 3,
  },
  caixaOn: { backgroundColor: CORES.titulo },
  checkTexto: {
    flex: 1,
    fontFamily: FONTES.corpo,
    fontSize: 13,
    lineHeight: 20,
    color: "rgba(17,28,45,0.8)",
  },
  nota: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: CORES.linha,
    fontFamily: FONTES.corpo,
    fontSize: 12,
    lineHeight: 18,
    color: "rgba(17,28,45,0.55)",
  },
});
