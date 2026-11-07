import { useEffect, useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useAuth } from "../lib/authProvider";
import { db } from "../lib/firebase";
import { observarNotificacoes, marcarNotificacaoLida, silenciarAvisos, lerSilencio } from "../lib/caixaNotificacoes";
import { CORES, FONTES } from "../lib/tema";
import { Voltar } from "../components/Voltar";

export default function NotificacoesScreen() {
  const { user } = useAuth();
  const [lista, setLista] = useState(null);
  const [silenciado, setSilenciado] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!user?.uid || !db) return;
    return observarNotificacoes(user.uid, (itens) => { setErro(""); setLista(itens); }, () => setErro("Não foi possível carregar as notificações."));
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid && db) lerSilencio(user.uid).then(setSilenciado).catch(() => {});
  }, [user?.uid]);

  async function alternarSilencio() {
    const proximo = !silenciado;
    setSilenciado(proximo);
    try { await silenciarAvisos(user.uid, proximo); }
    catch { setSilenciado(!proximo); setErro("Não foi possível alterar o silêncio dos avisos."); }
  }

  return (
    <View style={estilos.pagina}>
      <Voltar para="/home" />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Text style={estilos.titulo}>Notificações</Text>
        <Text style={estilos.descricao}>Consulte os avisos enviados pela organização.</Text>
        <Pressable onPress={alternarSilencio} accessibilityRole="switch" accessibilityState={{ checked: silenciado }} style={estilos.silencio}>
          <View style={{ flex: 1 }}>
            <Text style={estilos.silencioTitulo}>{silenciado ? "Avisos silenciados" : "Silenciar avisos"}</Text>
            <Text style={estilos.textoPequeno}>As mensagens continuam salvas aqui.</Text>
          </View>
          <Text style={estilos.acao}>{silenciado ? "DESATIVAR" : "SILENCIAR"}</Text>
        </Pressable>
        {erro ? <Text accessibilityRole="alert" style={estilos.erro}>{erro}</Text> : null}
        {lista === null ? null : lista.length === 0 ? <Text style={estilos.vazio}>Nenhuma notificação recebida ainda.</Text> : lista.map((item) => (
          <Pressable key={item.id} onPress={() => !item.lida && marcarNotificacaoLida(user.uid, item.id).catch(() => setErro("Não foi possível marcar como lida."))} style={[estilos.cartao, !item.lida && estilos.naoLida]}>
            <View style={estilos.linhaTitulo}>
              <Text style={estilos.cartaoTitulo}>{item.title}</Text>
              {!item.lida ? <Text style={estilos.nova}>NOVA</Text> : null}
            </View>
            <Text style={estilos.mensagem}>{item.body}</Text>
            <Text style={estilos.data}>{item.createdAt?.toDate?.().toLocaleString("pt-BR", { timeZone: "America/Recife" }) || ""}</Text>
            {!item.lida ? <Text style={estilos.marcar}>Toque para marcar como lida</Text> : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: CORES.fundo },
  conteudo: { padding: 18, paddingBottom: 36, gap: 14 },
  titulo: { marginTop: 12, fontFamily: FONTES.titulo, color: CORES.titulo, fontSize: 28, textTransform: "uppercase" },
  descricao: { marginTop: -8, color: CORES.texto, fontFamily: FONTES.corpo, fontSize: 15 },
  silencio: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderWidth: 1, borderColor: CORES.linha, backgroundColor: CORES.superficie },
  silencioTitulo: { color: CORES.titulo, fontFamily: FONTES.corpoSemi, fontSize: 15 },
  textoPequeno: { marginTop: 3, color: CORES.texto, fontFamily: FONTES.corpo, fontSize: 12 },
  acao: { color: CORES.destaque, fontFamily: FONTES.corpoSemi, fontSize: 11 },
  cartao: { padding: 15, borderWidth: 1, borderColor: CORES.linha, backgroundColor: CORES.superficie, gap: 7 },
  naoLida: { borderLeftWidth: 4, borderLeftColor: CORES.destaque },
  linhaTitulo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  cartaoTitulo: { flex: 1, color: CORES.titulo, fontFamily: FONTES.corpoSemi, fontSize: 16 },
  nova: { color: CORES.destaque, fontFamily: FONTES.corpoSemi, fontSize: 10 },
  mensagem: { color: CORES.texto, fontFamily: FONTES.corpo, fontSize: 14, lineHeight: 20 },
  data: { color: CORES.texto, opacity: 0.65, fontFamily: FONTES.corpo, fontSize: 11 },
  marcar: { color: CORES.destaque, fontFamily: FONTES.corpoSemi, fontSize: 12 },
  vazio: { marginTop: 18, color: CORES.texto, fontFamily: FONTES.corpo, fontSize: 14 },
  erro: { color: CORES.vermelho, fontFamily: FONTES.corpoMedio },
});
