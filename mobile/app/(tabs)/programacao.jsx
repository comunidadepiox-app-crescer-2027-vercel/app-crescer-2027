import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { observarProgramaPublicado, itensDoDia, agrupaPorEspaco } from "../../lib/programa";
import { useAuth } from "../../lib/authProvider";
import { useAviseMe } from "../../lib/aviseMe";
import { EDICAO, resolveDiaRecorte, formataDataCurta, formataDataLonga, diasDaEdicao } from "../../lib/edicao";
import { ProgramaLista } from "../../components/ProgramaLista";
import { TituloPagina, Paragrafo } from "../../components/Ui";
import { CORES, FONTES } from "../../lib/tema";

export default function ProgramacaoScreen() {
  const { user } = useAuth();
  const { ids, ocupado, alternar } = useAviseMe(user?.uid);
  const dias = useMemo(diasDaEdicao, []);
  const [dia, setDia] = useState(() => resolveDiaRecorte().date);
  const [todos, setTodos] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    return observarProgramaPublicado(
      (lista) => {
        setErro(false);
        setTodos(lista);
      },
      () => {
        setErro(true);
        setTodos([]);
      }
    );
  }, []);

  const itens = todos ? itensDoDia(todos, dia) : null;

  const grupos = itens ? agrupaPorEspaco(itens) : null;

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.pagina}>
      <TituloPagina>PROGRAMAÇÃO</TituloPagina>
      <Paragrafo style={{ marginTop: 8 }}>
        {EDICAO.nome}, {EDICAO.local}.
      </Paragrafo>

      <Paragrafo style={{ marginTop: 8, color: "rgba(17, 28, 45, 0.5)" }}>
        Programação e convidados sujeitos a alteração sem aviso prévio.
      </Paragrafo>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={estilos.dias}
        style={estilos.diasFaixa}
      >
        {dias.map((d) => {
          const ativo = d === dia;
          return (
            <Pressable key={d} onPress={() => setDia(d)} style={estilos.dia}>
              <Text style={[estilos.diaTexto, ativo && estilos.diaAtivo]}>
                {formataDataCurta(d)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={estilos.longa}>{formataDataLonga(dia)}</Text>

      {itens === null ? (
        <Paragrafo>Carregando programação...</Paragrafo>
      ) : erro ? (
        <Text style={estilos.erro}>Não foi possível carregar a programação agora.</Text>
      ) : itens.length === 0 ? (
        <Paragrafo>A programação deste dia ainda não foi publicada.</Paragrafo>
      ) : (
        <ProgramaLista
          grupos={grupos}
          lembretes={ids}
          ocupadoId={ocupado}
          onAlternarLembrete={alternar}
        />
      )}

      <Text style={estilos.nota}>
        Toque em Avise-me em um item para receber um aviso 30, 15, 10, 5 e 1
        minuto antes do horário. Os horários e os convidados podem ser alterados
        sem aviso prévio.
      </Text>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: "#fff" },
  pagina: {padding: 16, paddingBottom: 32, backgroundColor: "#fff" },
  diasFaixa: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: CORES.linha,
  },
  dias: { gap: 16, paddingBottom: 8 },
  dia: { paddingBottom: 6 },
  diaTexto: {
    fontFamily: FONTES.titulo,
    fontSize: 16,
    textTransform: "uppercase",
    color: "rgba(17,28,45,0.5)",
  },
  diaAtivo: {
    color: CORES.titulo,
    borderBottomWidth: 2,
    borderBottomColor: CORES.destaque,
  },
  longa: {
    marginTop: 12,
    marginBottom: 16,
    fontFamily: FONTES.corpo,
    fontSize: 13,
    textTransform: "capitalize",
    color: "rgba(17,28,45,0.7)",
  },
  erro: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 14,
    color: CORES.vermelho,
  },
  nota: {
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: CORES.linha,
    fontFamily: FONTES.corpo,
    fontSize: 13,
    color: "rgba(17,28,45,0.55)",
  },
});
