// Benfeitor da Fé. A tela saiu do app em 28/09/2026, quando a campanha virou
// link externo para o site da comunidade, e voltou em 01/10/2026 como rota de
// verdade. O app não grava nada: o cadastro vai para app/api/lead-benfeitor,
// que valida a sessão e os dados, grava em benefactorLeads e avisa a comissão
// por e-mail.
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useAuth } from "../../lib/authProvider";
import {
  AVISO_EMAIL,
  AVISO_SEM_EMAIL,
  LIMITE_NOME,
  formataCelular,
  formataCpf,
  validaLead,
} from "../../lib/benfeitor";
import { enviaLeadBenfeitor, jaTemLead } from "../../lib/enviaLeadBenfeitor";
import { FundoRoxoPoligonal } from "../../components/FundoPoligonal";
import { Botao, Campo, Paragrafo, TextoErro, TituloSecao } from "../../components/Ui";
import { CORES, FONTES } from "../../lib/tema";

const logoBenfeitor = require("../../assets/brand/logo-benfeitor.png");
const foto = require("../../assets/brand/foto-evento.webp");

const PASSOS = [
  "A equipe da Comunidade de São Pio X entra em contato no WhatsApp que você informou.",
  "Vocês combinam a contribuição mensal. O pagamento é por boleto ou Pix, fora deste aplicativo.",
  "Nada foi cobrado agora. Este foi só o cadastro de interesse.",
];

const LGPD =
  "Autorizo o uso destes dados pela Comunidade de São Pio X apenas para o contato e o " +
  "cadastro de Benfeitor da Fé, em conformidade com a LGPD.";

const MANTENEDORA =
  "Este aplicativo não processa pagamentos. O envio deste formulário é um cadastro de " +
  "interesse. Mantenedora: Associação Carismática Católica São Pio X, CNPJ 02.868.732/0001-23.";

export default function BenfeitorScreen() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [form, setForm] = useState({
    name: profile?.displayName || "",
    email: "",
    phone: "",
    cpf: "",
    lgpdConsent: false,
  });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [checando, setChecando] = useState(true);

  // Reabrir a aba depois do envio abre a confirmação, sem o formulário de novo.
  useEffect(() => {
    if (!user?.uid) return undefined;
    let ativo = true;
    setChecando(true);
    jaTemLead(user.uid)
      .then((existe) => {
        if (ativo && existe) setResultado({ emailEnviado: false, jaEnviado: true });
      })
      .catch(() => {})
      .finally(() => {
        if (ativo) setChecando(false);
      });
    return () => {
      ativo = false;
    };
  }, [user?.uid]);

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  function atualiza(campo, valor) {
    setErro("");
    if (campo === "phone") valor = formataCelular(valor);
    if (campo === "cpf") valor = formataCpf(valor);
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
      const saida = await enviaLeadBenfeitor(form);
      if (!saida.ok) {
        setErro(saida.erro);
        return;
      }
      setResultado(saida);
    } finally {
      setEnviando(false);
    }
  }

  if (checando) {
    return (
      <View style={[estilos.tela, { padding: 16 }]}>
        <Paragrafo>Carregando...</Paragrafo>
      </View>
    );
  }

  if (resultado) {
    return (
      <ScrollView contentContainerStyle={estilos.scroll} style={estilos.tela}>
        <FundoRoxoPoligonal style={estilos.hero}>
          <Image
            source={logoBenfeitor}
            style={estilos.logo}
            resizeMode="contain"
            accessibilityLabel="Benfeitor da Fé"
          />
          <Text style={estilos.heroTitulo}>Cadastro recebido</Text>
          <Text style={estilos.heroTexto}>
            Obrigado por querer sustentar esta missão. A Comunidade de São Pio X vai falar
            com você para concluir o cadastro.
          </Text>
        </FundoRoxoPoligonal>

        <View style={estilos.bloco}>
          <Paragrafo>{resultado.emailEnviado ? AVISO_EMAIL : AVISO_SEM_EMAIL}</Paragrafo>

          <TituloSecao style={{ marginTop: 22 }}>O que acontece agora</TituloSecao>
          {PASSOS.map((texto, i) => (
            <View key={texto} style={estilos.passo}>
              <Text style={estilos.passoNum}>{i + 1}</Text>
              <Paragrafo style={estilos.passoTexto}>{texto}</Paragrafo>
            </View>
          ))}

          <Botao
            titulo="Voltar para a Home"
            variante="contorno"
            onPress={() => router.push("/home")}
            style={{ marginTop: 24, alignSelf: "stretch" }}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={estilos.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <FundoRoxoPoligonal style={estilos.hero}>
          <Image
            source={logoBenfeitor}
            style={estilos.logo}
            resizeMode="contain"
            accessibilityLabel="Benfeitor da Fé"
          />
          <Text style={estilos.heroTexto}>
            Ajude a Comunidade de São Pio X a transformar as famílias e contribua para a
            realização do Crescer.
          </Text>
        </FundoRoxoPoligonal>

        <View style={estilos.bloco}>
          <Paragrafo>
            O Benfeitor da Fé é uma campanha de apoio contínuo, formada por pessoas que
            decidem colaborar mensalmente para sustentar e expandir as obras da Comunidade
            de São Pio X.
          </Paragrafo>

          <TituloSecao style={{ marginTop: 22 }}>Como participar</TituloSecao>
          <Paragrafo style={{ marginTop: 8 }}>1. Preencha o formulário com seus dados.</Paragrafo>
          <Paragrafo>2. A comissão recebe seu cadastro e fala com você no seu WhatsApp.</Paragrafo>
          <Paragrafo>3. Depois você pode contribuir por boleto ou Pix, todo mês.</Paragrafo>

          <View style={estilos.campos}>
            <Campo
              rotulo="Nome completo"
              value={form.name}
              onChangeText={(v) => atualiza("name", v)}
              maxLength={LIMITE_NOME}
              autoCapitalize="words"
              placeholder="Como você quer ser chamado"
            />
            <Campo
              rotulo="E-mail"
              value={form.email}
              onChangeText={(v) => atualiza("email", v)}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Para a comissão responder"
            />
            <Campo
              rotulo="Celular com DDD"
              value={form.phone}
              onChangeText={(v) => atualiza("phone", v)}
              keyboardType="phone-pad"
              placeholder="(83) 98897-7017"
              maxLength={15}
            />
            <Campo
              rotulo="CPF"
              value={form.cpf}
              onChangeText={(v) => atualiza("cpf", v)}
              keyboardType="number-pad"
              placeholder="000.000.000-00"
              maxLength={14}
            />

            <Pressable
              onPress={() => atualiza("lgpdConsent", !form.lgpdConsent)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: form.lgpdConsent }}
              accessibilityLabel={LGPD}
              style={estilos.check}
            >
              <View style={[estilos.caixa, form.lgpdConsent && estilos.caixaOn]}>
                {form.lgpdConsent ? <Text style={estilos.marca}>{"✓"}</Text> : null}
              </View>
              <Text style={estilos.checkTexto}>{LGPD}</Text>
            </Pressable>

            <TextoErro>{erro}</TextoErro>

            <Botao
              titulo="Quero participar"
              onPress={enviar}
              desabilitado={enviando}
              style={{ alignSelf: "stretch" }}
            />
          </View>

          <Text style={estilos.nota}>{MANTENEDORA}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  scroll: { paddingBottom: 48 },
  hero: { padding: 22, alignItems: "center" },
  logo: {
    width: 260,
    height: 112,
  },
  heroTitulo: {
    marginTop: 14,
    fontFamily: FONTES.titulo,
    fontSize: 28,
    lineHeight: 32,
    textTransform: "uppercase",
    color: "#fff",
  },
  heroTexto: {
    marginTop: 13,
    fontFamily: FONTES.corpo,
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255,255,255,0.85)",
    textAlign: "justify",
  },
  foto: {
    width: "100%",
    height: 180,
    marginTop: 18,
    borderRadius: 10,
  },
  bloco: { paddingHorizontal: 20, paddingTop: 26 },
  campos: { gap: 14, marginTop: 22 },
  passo: { flexDirection: "row", gap: 14, alignItems: "flex-start", marginTop: 10 },
  passoNum: {
    width: 22,
    fontFamily: FONTES.titulo,
    fontSize: 20,
    color: CORES.destaque,
  },
  passoTexto: { flex: 1 },
  check: { flexDirection: "row", gap: 12, alignItems: "flex-start", marginTop: 4 },
  caixa: {
    width: 22,
    height: 22,
    marginTop: 1,
    borderWidth: 1,
    borderColor: CORES.titulo,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  caixaOn: { backgroundColor: CORES.titulo },
  marca: { color: "#fff", fontFamily: FONTES.corpoSemi, fontSize: 15, lineHeight: 18 },
  checkTexto: {
    flex: 1,
    fontFamily: FONTES.corpo,
    fontSize: 13,
    lineHeight: 20,
    color: "rgba(17,28,45,0.8)",
  },
  nota: {
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: CORES.linha,
    fontFamily: FONTES.corpo,
    fontSize: 12,
    lineHeight: 19,
    color: "rgba(17,28,45,0.55)",
  },
});
