import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../lib/authProvider";
import { Voltar } from "../components/Voltar";
import { FundoRoxoPoligonal } from "../components/FundoPoligonal";
import { Botao, Campo, TituloSecao, TituloPagina, Paragrafo, TextoErro } from "../components/Ui";
import { CORES, FONTES, RAIO } from "../lib/tema";
import { LIMITE_NOME, LIMITE_TEXTO, restantes, validaTestemunho } from "../lib/testemunhos";
import { enviaTestemunho } from "../lib/enviaTestemunho";

const logoTestemunhos = require("../assets/logo-testemunhos.png");

const AVISO =
  "A Comunidade de São Pio X usa este texto e o seu nome apenas para preparar a " +
  "leitura do seu testemunho no encontro. A equipe lê o texto que você escreveu. " +
  "Marcar a opção de anônimo apaga o nome.";

const ENVIADO =
  "Recebemos o seu testemunho. Obrigado por compartilhar. A equipe lê os textos " +
  "no encontro."

export default function TestemunhosScreen() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ nome: "", anonimo: false, texto: "" });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  function atualiza(campo, valor) {
    setErro("");
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function marcarAnonimo() {
    setErro("");
    setForm((f) => ({ ...f, anonimo: !f.anonimo, nome: f.anonimo ? f.nome : "" }));
  }

  async function enviar() {
    setErro("");
    const problema = validaTestemunho(form);
    if (problema) {
      setErro(problema);
      return;
    }
    setEnviando(true);
    try {
      const saida = await enviaTestemunho(form);
      if (!saida.ok) {
        setErro(saida.erro);
        return;
      }
      setResultado(saida);
    } finally {
      setEnviando(false);
    }
  }

  function recomecar() {
    setResultado(null);
    setForm({ nome: "", anonimo: false, texto: "" });
  }

  return (
    <View style={estilos.tela}>
      <Voltar para="/home" rotulo="Testemunhos" />
      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          contentContainerStyle={estilos.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <FundoRoxoPoligonal style={estilos.hero}>
            <Image
              source={logoTestemunhos}
              style={estilos.logo}
              resizeMode="contain"
              accessibilityLabel="Testemunhos"
            />
            <Text style={estilos.heroTexto}>
              Se algo mudou em você por causa do encontro, escreva aqui. A equipe lê o
              seu relato no palco.
            </Text>
          </FundoRoxoPoligonal>

          {resultado ? (
            <View style={estilos.bloco}>
              <TituloPagina>Testemunho enviado</TituloPagina>
              <Paragrafo style={{ marginTop: 12 }}>{ENVIADO}</Paragrafo>
              <Botao
                titulo="Escrever outro"
                variante="contorno"
                onPress={recomecar}
                style={{ marginTop: 24, alignSelf: "stretch" }}
              />
            </View>
          ) : (
            <View style={estilos.bloco}>
              <TituloSecao>Como funciona</TituloSecao>
              <Paragrafo style={{ marginTop: 8 }}>
                1. Escreva o seu nome ou marque a opção de anônimo.
              </Paragrafo>
              <Paragrafo>2. Conte o que mudou em você, com as suas palavras.</Paragrafo>
              <Paragrafo>3. A equipe lê o seu texto no palco, do jeito que você escreveu.</Paragrafo>

              <View style={{ gap: 14, marginTop: 20 }}>
                <Campo
                  rotulo="Seu nome"
                  dica="(opcional)"
                  value={form.anonimo ? "" : form.nome}
                  onChangeText={(v) => atualiza("nome", v)}
                  editable={!form.anonimo}
                  maxLength={LIMITE_NOME}
                  autoCapitalize="words"
                  placeholder="Como quer aparecer"
                />

                <Pressable
                  onPress={marcarAnonimo}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: form.anonimo }}
                  accessibilityLabel="Quero enviar como anônimo"
                  style={estilos.check}
                >
                  <View style={[estilos.caixa, form.anonimo && estilos.caixaOn]}>
                    {form.anonimo ? <Text style={estilos.marca}>{"✓"}</Text> : null}
                  </View>
                  <Text style={estilos.checkTexto}>
                    Quero enviar como anônimo. O nome não é gravado.
                  </Text>
                </Pressable>

                <View style={{ gap: 4 }}>
                  <Text style={estilos.rotulo}>Seu testemunho</Text>
                  <TextInput
                    value={form.texto}
                    onChangeText={(v) => atualiza("texto", v)}
                    placeholder="Escreva aqui o que mudou em você."
                    placeholderTextColor="rgba(17,28,45,0.35)"
                    multiline
                    numberOfLines={7}
                    maxLength={LIMITE_TEXTO}
                    textAlignVertical="top"
                    style={estilos.area}
                  />
                  <Text
                    style={[
                      estilos.contador,
                      restantes(form.texto) < 200 && { color: CORES.vermelho },
                    ]}
                  >
                    {restantes(form.texto)} de {LIMITE_TEXTO} caracteres
                  </Text>
                </View>

                <TextoErro>{erro}</TextoErro>

                <Botao
                  titulo="Enviar testemunho"
                  onPress={enviar}
                  desabilitado={enviando}
                  style={{ alignSelf: "stretch" }}
                />
              </View>

              <Text style={estilos.nota}>{AVISO}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  flex: { flex: 1 },
  scroll: { paddingBottom: 48 },
  hero: { padding: 22, alignItems: "center" },
  logo: {
    width: 300,
    height: 112,
  },
  heroTexto: {
    marginTop: 14,
    fontFamily: FONTES.corpo,
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255,255,255,0.85)",
    textAlign: "justify",
  },
  bloco: { paddingHorizontal: 20, paddingTop: 26 },
  check: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
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
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(17,28,45,0.85)",
  },
  rotulo: { fontFamily: FONTES.corpoMedio, fontSize: 14, color: CORES.texto },
  area: {
    borderRadius: RAIO.botao,
    borderWidth: 1,
    borderColor: CORES.linha,
    backgroundColor: CORES.superficie,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 150,
    fontFamily: FONTES.corpo,
    fontSize: 15,
    lineHeight: 22,
    color: CORES.texto,
  },
  contador: {
    fontFamily: FONTES.corpo,
    fontSize: 12,
    color: "rgba(17,28,45,0.55)",
    textAlign: "right",
  },
  nota: {
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: CORES.linha,
    fontFamily: FONTES.corpo,
    fontSize: 12,
    lineHeight: 19,
    color: "rgba(17,28,45,0.6)",
  },
});
