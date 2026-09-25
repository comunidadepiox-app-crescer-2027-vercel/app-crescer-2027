import { useCallback, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../lib/authProvider";
import { apagarOrigem } from "../../lib/avisoSaida";
import { Campo, Botao, TituloPagina, TituloSecao, Paragrafo, TextoErro, TextoAviso } from "../../components/Ui";
import { CORES, FONTES } from "../../lib/tema";

export default function ContaScreen() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [nome, setNome] = useState(profile?.displayName || user?.displayName || "");
  const [aviso, setAviso] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [temOrigem, setTemOrigem] = useState(false);
  const [apagando, setApagando] = useState(false);
  const [avisoOrigem, setAvisoOrigem] = useState("");
  const [erroOrigem, setErroOrigem] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (!db || !user?.uid) return undefined;
      let vivo = true;
      getDoc(doc(db, "users", user.uid))
        .then((snap) => {
          if (vivo) setTemOrigem(Boolean(snap.data()?.origem?.lat));
        })
        .catch(() => {
          if (vivo) setTemOrigem(false);
        });
      return () => {
        vivo = false;
      };
    }, [user?.uid])
  );

  async function apagarLocal() {
    setErroOrigem("");
    setAvisoOrigem("");
    setApagando(true);
    try {
      await apagarOrigem(user.uid);
      setTemOrigem(false);
      setAvisoOrigem("Localização apagada.");
    } catch {
      setErroOrigem("Não foi possível apagar a localização agora.");
    } finally {
      setApagando(false);
    }
  }

  async function salvarNome() {
    setAviso("");
    setErro("");
    setSalvando(true);
    try {
      await updateProfile(user, { displayName: nome.trim() });
      await updateDoc(doc(db, "users", user.uid), { displayName: nome.trim() });
      setAviso("Nome atualizado.");
    } catch {
      setErro("Não foi possível salvar agora. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={estilos.pagina}>
      <TituloPagina>Configuração</TituloPagina>

      <TituloSecao style={{ marginTop: 24 }}>Seu perfil</TituloSecao>
      <Paragrafo style={{ marginTop: 8 }}>
        Escolha o nome que quer usar neste aplicativo.
      </Paragrafo>
      <View style={{ gap: 12, marginTop: 14 }}>
        <Campo rotulo="Nome" value={nome} onChangeText={setNome} />
        <TextoAviso>{aviso}</TextoAviso>
        <TextoErro>{erro}</TextoErro>
        <Botao titulo="Salvar nome" onPress={salvarNome} desabilitado={salvando} />
      </View>

      <View style={estilos.bloco}>
        <TituloSecao>Galeria e sobre</TituloSecao>
        <Pressable onPress={() => router.push("/galeria")} style={{ marginTop: 10 }}>
          <Text style={estilos.link}>Abrir galeria de fotos</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/sobre")} style={{ marginTop: 8 }}>
          <Text style={estilos.link}>Sobre o Crescer</Text>
        </Pressable>
      </View>

      {profile?.role === "admin" ? (
        <View style={estilos.bloco}>
          <TituloSecao>Administração</TituloSecao>
          <Paragrafo style={{ marginTop: 8 }}>
            A área administrativa continua no site. Abra o WebApp no navegador
            para publicar notícias e o cronograma.
          </Paragrafo>
        </View>
      ) : null}

      <View style={estilos.bloco}>
        <TituloSecao>Privacidade</TituloSecao>
        <Paragrafo style={{ marginTop: 8 }}>
          Este aplicativo guarda o nome escolhido e, se você marcou Quero ir,
          guarda também a última localização para calcular a hora de sair até
          o Centro de Convenções. Você pode apagar essa coordenada aqui. Se
          você enviou o cadastro de interesse do Benfeitor da Fé, esses dados
          também ficam guardados. Nada é compartilhado fora da Comunidade de
          São Pio X.
        </Paragrafo>
        {temOrigem ? (
          <Botao
            titulo="Apagar localização"
            variante="contorno"
            onPress={apagarLocal}
            desabilitado={apagando}
            style={{ marginTop: 14 }}
          />
        ) : (
          <Paragrafo style={{ marginTop: 8 }}>
            Nenhuma localização está guardada agora.
          </Paragrafo>
        )}
        <TextoAviso>{avisoOrigem}</TextoAviso>
        <TextoErro>{erroOrigem}</TextoErro>
      </View>

    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pagina: { padding: 16, paddingBottom: 40, backgroundColor: CORES.fundo },
  bloco: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: CORES.linha,
  },
  link: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 15,
    color: CORES.destaque,
    textDecorationLine: "underline",
  },
});
