import { View, Text, Pressable, StyleSheet } from "react-native";
import Heart from "lucide-react-native/icons/heart";
import { CORES, FONTES } from "../lib/tema";
import { nomeDoEspaco } from "../lib/programa";

export function ProgramaLista({ itens, lembretes, ocupadoId, onAlternarLembrete }) {
  return (
    <View>
      {itens.map((item, i) => {
        const marcado = lembretes?.has(item.id);
        return (
          <View key={item.id} style={[estilos.item, i < itens.length - 1 && estilos.itemLinha]}>
            <Text style={estilos.hora}>{item.time}</Text>
            <View style={estilos.conteudo}>
              <View style={estilos.cabeca}>
                <Text style={estilos.titulo}>{item.title}</Text>
                {onAlternarLembrete ? (
                  <Pressable
                    onPress={() => onAlternarLembrete(item)}
                    disabled={ocupadoId === item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${marcado ? "Cancelar aviso para" : "Avisar-me sobre"} ${item.title} às ${item.time}`}
                    accessibilityState={{ disabled: ocupadoId === item.id, selected: marcado }}
                    hitSlop={8}
                  >
                    <Heart size={26} color={CORES.destaque} fill={marcado ? CORES.destaque : "transparent"} />
                  </Pressable>
                ) : null}
              </View>
              {item.space ? (
                <Text style={estilos.espaco}>NO {nomeDoEspaco(item.space).toLocaleUpperCase("pt-BR")}</Text>
              ) : null}
              {item.guest ? <Text style={estilos.extra}>{item.guest}</Text> : null}
              {item.location ? <Text style={estilos.extra}>{item.location}</Text> : null}
              {item.notes ? <Text style={estilos.extra}>{item.notes}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  item: {
    flexDirection: "row",
    gap: 14,
    paddingVertical: 16,
  },
  itemLinha: {
    borderBottomWidth: 1,
    borderBottomColor: CORES.linha,
  },
  hora: {
    width: 66,
    paddingTop: 2,
    fontFamily: FONTES.corpoSemi,
    fontSize: 16,
    color: CORES.texto,
  },
  conteudo: { flex: 1, minWidth: 0 },
  cabeca: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  titulo: {
    flex: 1,
    fontFamily: FONTES.corpoMedio,
    fontSize: 17,
    lineHeight: 23,
    color: CORES.texto,
  },
  espaco: {
    alignSelf: "flex-start",
    marginTop: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: CORES.roxoBotao,
    fontFamily: FONTES.corpoMedio,
    fontSize: 11,
    color: "#fff",
  },
  extra: {
    marginTop: 5,
    fontFamily: FONTES.corpo,
    fontSize: 14,
    lineHeight: 19,
    color: "rgba(17,28,45,0.7)",
  },
});
