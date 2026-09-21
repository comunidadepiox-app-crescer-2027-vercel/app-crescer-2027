import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { observarProgramaPublicado, itensDoDia, agrupaPorEspaco } from "../../lib/programa";
import { EDICAO, resolveDiaRecorte, formataDataCurta, formataDataLonga, diasDaEdicao } from "../../lib/edicao";
import { ProgramaLista } from "../../components/ProgramaLista";
import { TituloPagina, Paragrafo } from "../../components/Ui";
import { FaixaPrograma } from "../../components/FaixaPrograma";
import { useAvisoPrograma } from "../../lib/avisoPrograma";
import { CORES, FONTES } from "../../lib/tema";

export default function AgendaScreen() {
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
  const doRecorte = todos ? itensDoDia(todos, resolveDiaRecorte().date) : null;
  const aviso = useAvisoPrograma(doRecorte);

  const grupos = itens ? agrupaPorEspaco(itens) : null;

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.pagina}>
      <FaixaPrograma mudou={aviso.mudou} onEntendi={aviso.entendi} naAgenda />
      <TituloPagina>Cronograma</TituloPagina>
      <Paragrafo style={{ marginTop: 8 }}>
        {EDICAO.nome}, {EDICAO.local}.
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
        <ProgramaLista grupos={grupos} />
      )}

      <Text style={estilos.nota}>
        Os horários e os convidados podem ser alterados sem aviso prévio.
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
