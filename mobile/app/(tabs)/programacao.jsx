import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { observarProgramaPublicado, itensDoDia, nomeDoEspaco } from "../../lib/programa";
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
  const [filtros, setFiltros] = useState(() => new Set());

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
  const espacos = itens ? [...new Set(itens.map((item) => item.space).filter(Boolean))] : [];
  const itensFiltrados = itens?.filter((item) => filtros.size === 0 || filtros.has(item.space));

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

      {espacos.length > 0 ? (
        <View style={estilos.filtrosBloco}>
          <Text style={estilos.rotuloFiltro}>Filtrar por espaço</Text>
          <View style={estilos.filtros}>
            <Pressable
              onPress={() => setFiltros(new Set())}
              accessibilityRole="button"
              accessibilityState={{ selected: filtros.size === 0 }}
              style={[estilos.filtro, filtros.size === 0 && estilos.filtroAtivo]}
            >
              <Text style={[estilos.filtroTexto, filtros.size === 0 && estilos.filtroTextoAtivo]}>Todos</Text>
            </Pressable>
            {espacos.map((espaco) => {
              const ativo = filtros.has(espaco);
              return (
                <Pressable
                  key={espaco}
                  onPress={() => setFiltros((atuais) => {
                    const proximos = new Set(atuais);
                    if (proximos.has(espaco)) proximos.delete(espaco);
                    else proximos.add(espaco);
                    return proximos;
                  })}
                  accessibilityRole="button"
                  accessibilityState={{ selected: ativo }}
                  style={[estilos.filtro, ativo && estilos.filtroAtivo]}
                >
                  <Text style={[estilos.filtroTexto, ativo && estilos.filtroTextoAtivo]}>{nomeDoEspaco(espaco)}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {itens === null ? (
        <Paragrafo>Carregando programação...</Paragrafo>
      ) : erro ? (
        <Text style={estilos.erro}>Não foi possível carregar a programação agora.</Text>
      ) : itens.length === 0 ? (
        <Paragrafo>A programação deste dia ainda não foi publicada.</Paragrafo>
      ) : itensFiltrados.length === 0 ? (
        <Paragrafo>Nenhuma atividade encontrada nos espaços selecionados.</Paragrafo>
      ) : (
        <ProgramaLista
          itens={itensFiltrados}
          lembretes={ids}
          ocupadoId={ocupado}
          onAlternarLembrete={alternar}
        />
      )}

      <Text style={estilos.nota}>
        Toque no coração de um item para receber um aviso 30, 15, 10, 5 e 1
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
  filtrosBloco: { gap: 8, marginBottom: 8 },
  rotuloFiltro: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 13,
    marginTop: 12,
    color: "rgba(17,28,45,0.65)",
  },
  filtros: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filtro: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: CORES.titulo,
    borderRadius: 9,
    backgroundColor: "#fff",
  },
  filtroAtivo: { backgroundColor: CORES.titulo },
  filtroTexto: { fontFamily: FONTES.corpo, fontSize: 14, color: CORES.titulo },
  filtroTextoAtivo: { color: "#fff" },
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
