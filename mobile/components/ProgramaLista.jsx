import { View, Text, Pressable, StyleSheet } from "react-native";
import { CORES, FONTES } from "../lib/tema";
import { nomeDoEspaco } from "../lib/programa";

export function ProgramaLista({ grupos, lembretes, ocupadoId, onAlternarLembrete }) {
  return (
    <View style={{ gap: 16 }}>
      {[...grupos.entries()].map(([espaco, itens]) => (
        <View key={espaco} style={estilos.bloco}>
          <View style={estilos.cabeca}>
            <Text style={estilos.espaco}>{nomeDoEspaco(espaco)}</Text>
            {itens[0]?.location ? (
              <Text style={estilos.local}>Local: {itens[0].location}</Text>
            ) : null}
          </View>
          {itens.map((item, i) => (
            <View
              key={item.id}
              style={[estilos.item, i < itens.length - 1 && estilos.itemLinha]}
            >
              <Text style={estilos.hora}>{item.time}</Text>
              <View style={{ flex: 1 }}>
                <Text style={estilos.titulo}>{item.title}</Text>
                {item.guest ? <Text style={estilos.extra}>{item.guest}</Text> : null}
                {item.notes ? <Text style={estilos.extra}>{item.notes}</Text> : null}
                {onAlternarLembrete ? (
                  <Pressable
                    onPress={() => onAlternarLembrete(item)}
                    disabled={ocupadoId === item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.title} às ${item.time}`}
                  >
                    <Text style={estilos.lembrete}>
                      {lembretes?.has(item.id) ? "Cancelar aviso" : "Avise-me"}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CORES.linha,
    backgroundColor: CORES.superficie,
    overflow: "hidden",
  },
  cabeca: {
    backgroundColor: CORES.roxoBotao,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  espaco: {
    fontFamily: FONTES.titulo,
    fontSize: 17,
    textTransform: "uppercase",
    color: "#fff",
  },
  local: {
    fontFamily: FONTES.corpo,
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  item: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemLinha: {
    borderBottomWidth: 1,
    borderBottomColor: CORES.linha,
  },
  hora: {
    width: 52,
    fontFamily: FONTES.corpoSemi,
    fontSize: 14,
    color: CORES.destaque,
  },
  titulo: {
    fontFamily: FONTES.corpoMedio,
    fontSize: 15,
    color: CORES.texto,
  },
  extra: {
    fontFamily: FONTES.corpo,
    fontSize: 13,
    color: "rgba(17,28,45,0.7)",
    marginTop: 2,
  },
  lembrete: {
    fontFamily: FONTES.corpoSemi,
    fontSize: 14,
    color: CORES.destaque,
    textDecorationLine: "underline",
    marginTop: 8,
  },
});
