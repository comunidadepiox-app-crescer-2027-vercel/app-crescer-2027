import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signInWithCredential,
} from "firebase/auth";
import { auth, firebaseConfigurado, GoogleAuthProvider } from "../lib/firebase";
import { useAuth, ensureUserDoc } from "../lib/authProvider";
import { traduzErroAuth } from "../lib/errosAuth";
import { FundoRoxoPoligonal } from "../components/FundoPoligonal";
import { Campo, Botao, TextoErro, TextoAviso } from "../components/Ui";
import { IconeGoogle } from "../components/Icones";
import { CORES, FONTES } from "../lib/tema";

WebBrowser.maybeCompleteAuthSession();

const logo = require("../assets/brand/logo-crescer-branca.png");
const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
const isExpoGo =
  Constants.appOwnership === "expo" || Constants.executionEnvironment === "storeClient";

const AVISO_EXPO_GO =
  "O Google bloqueia o login pelo Expo Go (política OAuth). Entre com e-mail e senha. O Google passa a funcionar no aplicativo instalado (build de desenvolvimento).";

async function concluirGoogle(idToken, router, setErro, setEnviando) {
  setEnviando(true);
  try {
    const cred = GoogleAuthProvider.credential(idToken);
    const resultado = await signInWithCredential(auth, cred);
    await ensureUserDoc(resultado.user);
    router.replace("/home");
  } catch (err) {
    setErro(traduzErroAuth(err));
  } finally {
    setEnviando(false);
  }
}

function BotaoGoogle({ enviando, setEnviando, setErro, setAviso }) {
  if (isExpoGo) {
    return (
      <Botao
        titulo="Continuar com Google"
        variante="contorno"
        onPress={() => {
          setAviso("");
          setErro(AVISO_EXPO_GO);
        }}
        desabilitado={enviando}
        icone={<IconeGoogle />}
        style={{ alignSelf: "stretch" }}
      />
    );
  }
  return (
    <BotaoGoogleNativo
      enviando={enviando}
      setEnviando={setEnviando}
      setErro={setErro}
      setAviso={setAviso}
    />
  );
}

function BotaoGoogleNativo({ enviando, setEnviando, setErro, setAviso }) {
  const router = useRouter();
  const web = googleClientId;
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: web,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim() || web,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID?.trim() || web,
  });

  useEffect(() => {
    if (response?.type !== "success") return;
    const idToken = response.params?.id_token || response.authentication?.idToken;
    if (!idToken) {
      setErro("O Google não devolveu o token. Tente de novo.");
      return;
    }
    concluirGoogle(idToken, router, setErro, setEnviando);
  }, [response, router, setErro, setEnviando]);

  return (
    <Botao
      titulo="Continuar com Google"
      variante="contorno"
      onPress={() => {
        setErro("");
        setAviso("");
        promptAsync();
      }}
      desabilitado={enviando || !request}
      icone={<IconeGoogle />}
      style={{ alignSelf: "stretch" }}
    />
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const { height: alturaTela } = useWindowDimensions();
  const { user, loading } = useAuth();
  const [modo, setModo] = useState("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/home");
  }, [loading, user, router]);

  async function entrarComEmail() {
    setErro("");
    setAviso("");
    if (!firebaseConfigurado) {
      setErro("O Firebase ainda não foi configurado neste ambiente. Preencha o .env.");
      return;
    }
    setEnviando(true);
    try {
      if (modo === "criar") {
        const cred = await createUserWithEmailAndPassword(auth, email, senha);
        if (nome.trim()) {
          await updateProfile(cred.user, { displayName: nome.trim() });
        }
        await ensureUserDoc({
          ...cred.user,
          displayName: nome.trim() || cred.user.displayName,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, senha);
      }
      router.replace("/home");
    } catch (err) {
      setErro(traduzErroAuth(err));
    } finally {
      setEnviando(false);
    }
  }

  async function esqueciASenha() {
    setErro("");
    setAviso("");
    if (!email) {
      setErro("Digite seu e-mail no campo acima para receber o link de redefinição.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setAviso("Enviamos um e-mail com o link para redefinir sua senha.");
    } catch (err) {
      setErro(traduzErroAuth(err));
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <FundoRoxoPoligonal style={[estilos.fundo, { minHeight: alturaTela }]}>
          <Image source={logo} resizeMode="contain" style={estilos.logo} />

          <View style={estilos.cartao}>
            <View style={estilos.abas}>
              <Pressable onPress={() => setModo("entrar")} style={estilos.aba}>
                <Text style={[estilos.abaTexto, modo === "entrar" && estilos.abaAtiva]}>
                  Entrar
                </Text>
              </Pressable>
              <Pressable onPress={() => setModo("criar")} style={estilos.aba}>
                <Text style={[estilos.abaTexto, modo === "criar" && estilos.abaAtiva]}>
                  Criar conta
                </Text>
              </Pressable>
            </View>

            <View style={{ gap: 14, marginTop: 20 }}>
              {modo === "criar" ? (
                <Campo
                  rotulo="Nome"
                  value={nome}
                  onChangeText={setNome}
                  autoComplete="name"
                />
              ) : null}
              <Campo
                rotulo="E-mail"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              <Campo
                rotulo="Senha"
                dica={modo === "criar" ? "(mínimo 6 caracteres)" : undefined}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                autoComplete={modo === "criar" ? "password-new" : "password"}
              />
              <TextoErro>{erro}</TextoErro>
              <TextoAviso>{aviso}</TextoAviso>
              <Botao
                titulo={modo === "criar" ? "Criar minha conta" : "Entrar"}
                onPress={entrarComEmail}
                desabilitado={enviando}
                style={{ alignSelf: "stretch" }}
              />
              {modo === "entrar" ? (
                <Pressable onPress={esqueciASenha}>
                  <Text style={estilos.link}>Esqueci a senha</Text>
                </Pressable>
              ) : null}
              <View style={estilos.divisor}>
                <View style={estilos.linha} />
                <Text style={estilos.ou}>ou</Text>
                <View style={estilos.linha} />
              </View>
              {googleClientId ? (
                <BotaoGoogle
                  enviando={enviando}
                  setEnviando={setEnviando}
                  setErro={setErro}
                  setAviso={setAviso}
                />
              ) : (
                <Botao
                  titulo="Continuar com Google"
                  variante="contorno"
                  onPress={() =>
                    setErro(
                      "O login com Google ainda precisa do client ID. Use e-mail e senha por enquanto."
                    )
                  }
                  desabilitado={enviando}
                  icone={<IconeGoogle />}
                  style={{ alignSelf: "stretch" }}
                />
              )}
            </View>
          </View>
          <Text style={estilos.lgpd}>
            Ao criar a conta você concorda que seu nome e e-mail sejam usados para
            identificação neste aplicativo, conforme a LGPD. Nada é compartilhado
            fora da Comunidade de São Pio X.
          </Text>
        </FundoRoxoPoligonal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32 },
  logo: { width: 280, height: 52, alignSelf: "center", paddingTop: 130  },
  cartao: {
    marginTop: 28,
    backgroundColor: CORES.superficie,
    borderRadius: 14,
    padding: 22,
  },
  abas: {
    flexDirection: "row",
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: CORES.linha,
  },
  aba: { paddingBottom: 8 },
  abaTexto: {
    fontFamily: FONTES.titulo,
    fontSize: 17,
    textTransform: "uppercase",
    color: "rgba(17,28,45,0.5)",
  },
  abaAtiva: {
    color: CORES.titulo,
    borderBottomWidth: 2,
    borderBottomColor: CORES.destaque,
  },
  link: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 14,
    color: CORES.destaque,
    textDecorationLine: "underline",
  },
  divisor: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  linha: { flex: 1, height: 1, backgroundColor: CORES.linha },
  ou: { fontFamily: FONTES.corpo, fontSize: 13, color: "rgba(17,28,45,0.55)" },
  lgpd: {
    marginTop: 20,
    fontFamily: FONTES.corpo,
    fontSize: 12,
    lineHeight: 18,
    color: "rgba(255,255,255,0.7)",
  },
});
