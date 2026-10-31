import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Redirect } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useAuth } from "../lib/authProvider";
import { Voltar } from "../components/Voltar";
import { FundoLaranjaPoligonal } from "../components/FundoPoligonal";
import { Botao, Paragrafo, TituloSecao } from "../components/Ui";
import { CORES, FONTES, RAIO } from "../lib/tema";
import { BENEFICIARIO, PIX_COPIA_COLA } from "../lib/doacao";

const logo = require("../assets/brand/logo-crescer-branca.png");
const qrcode = require("../assets/qrcode-doacao.png");

export default function ColaboreScreen() {
  const { user, loading } = useAuth();
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return undefined;
    const t = setTimeout(() => setCopiado(false), 2200);
    return () => clearTimeout(t);
  }, [copiado]);

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  async function copiar() {
    try {
      await Clipboard.setStringAsync(PIX_COPIA_COLA);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <View style={estilos.tela}>
      <Voltar para="/home" rotulo="Colabore" />
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={estilos.scroll}
          showsVerticalScrollIndicator={false}
        >
          <FundoLaranjaPoligonal style={estilos.faixa}>
            <Text style={estilos.ponte}>
              Em 2027, o encontro continua se o mesmo cuidado vier.
            </Text>
            <Image
              source={logo}
              resizeMode="contain"
              style={estilos.logo}
              accessibilityLabel="Crescer"
            />
          </FundoLaranjaPoligonal>

          <View style={estilos.corpo}>
            <Paragrafo style={estilos.convite}>
              O encontro acontece pelo cuidado de muita gente. A sua oferta ajuda
              a realizar o Crescer 2027. O pagamento é no aplicativo do banco.
            </Paragrafo>

            <View style={estilos.cartao}>
              <TituloSecao style={estilos.tituloBloco}>PIX</TituloSecao>
              <Paragrafo style={[estilos.textoBloco, { marginTop: 12 }]}>
                Aponte a câmera do aplicativo do seu banco para o código.
              </Paragrafo>
              <View style={estilos.qrCaixa}>
                <Image
                  source={qrcode}
                  style={estilos.qr}
                  resizeMode="contain"
                  accessibilityRole="image"
                  accessibilityLabel="QR Code PIX para colaborar com o Crescer"
                />
              </View>
              <Paragrafo style={[estilos.textoBloco, { marginTop: 22 }]}>
                Ou copie o código PIX e cole no aplicativo do banco.
              </Paragrafo>
              <View style={estilos.pixCaixa}>
                <Text selectable style={estilos.pixCodigo}>
                  {PIX_COPIA_COLA}
                </Text>
              </View>
              <Botao
                titulo={copiado ? "Copiado" : "Copiar código"}
                variante={copiado ? "contorno" : "laranja"}
                onPress={copiar}
                style={estilos.botao}
              />
            </View>

            <View style={estilos.cartao}>
              <TituloSecao style={estilos.tituloBloco}>Quem recebe</TituloSecao>
              <Paragrafo style={[estilos.textoBloco, { marginTop: 12 }]}>
                Confira o beneficiário antes de confirmar o pagamento.
              </Paragrafo>
              <Text style={estilos.beneficiarioNome}>{BENEFICIARIO.nome}</Text>
              <Text style={estilos.beneficiarioDado}>CNPJ {BENEFICIARIO.cnpj}</Text>
              <Text style={estilos.beneficiarioDado}>{BENEFICIARIO.cidade}</Text>
            </View>

            <Text style={estilos.nota}>
              O aplicativo não recebe o pagamento e não guarda dados bancários.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: CORES.fundo },
  scroll: { paddingBottom: 56 },
  ponte: {
    fontFamily: FONTES.titulo,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    textAlign: "center",
    color: "#fff",
  },
  faixa: {
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 280,
    maxWidth: "100%",
    marginTop: 16,
    height: 48,
  },
  corpo: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  convite: {
    fontSize: 16,
    lineHeight: 24,
  },
  textoBloco: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  tituloBloco: {
    fontSize: 22,
    lineHeight: 27,
    textAlign: "center",
    alignSelf: "stretch",
  },
  cartao: {
    marginTop: 28,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: CORES.superficie,
    borderWidth: 1,
    borderColor: CORES.linha,
    borderRadius: RAIO.cartao,
  },
  qrCaixa: {
    marginTop: 18,
    alignSelf: "center",
    padding: 12,
    backgroundColor: CORES.creme,
    borderWidth: 1,
    borderColor: CORES.linha,
    borderRadius: RAIO.cartao,
  },
  qr: {
    width: 240,
    height: 240,
  },
  pixCaixa: {
    marginTop: 12,
    alignSelf: "stretch",
    padding: 14,
    backgroundColor: CORES.creme,
    borderWidth: 1,
    borderColor: CORES.linha,
    borderRadius: RAIO.cartao,
  },
  pixCodigo: {
    fontFamily: FONTES.corpo,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: CORES.texto,
  },
  botao: {
    marginTop: 16,
    alignSelf: "center",
  },
  beneficiarioNome: {
    marginTop: 16,
    fontFamily: FONTES.corpoSemi,
    fontSize: 17,
    lineHeight: 23,
    textAlign: "center",
    color: CORES.titulo,
  },
  beneficiarioDado: {
    marginTop: 4,
    fontFamily: FONTES.corpo,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: CORES.texto,
  },
  nota: {
    marginTop: 28,
    fontFamily: FONTES.corpo,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    color: CORES.texto,
    opacity: 0.65,
  },
});
