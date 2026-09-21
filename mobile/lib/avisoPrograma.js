import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE = "crescer.programa.impressao";

export function impressaoPrograma(itens) {
  return (itens || [])
    .map((item) =>
      [item.id, item.time, item.title, item.space, item.guest || "", item.location || ""].join("|")
    )
    .join("\n");
}

export function useAvisoPrograma(itens) {
  const [mudou, setMudou] = useState(false);
  const atual = itens ? impressaoPrograma(itens) : null;

  useFocusEffect(
    useCallback(() => {
      if (atual == null) return undefined;
      let vivo = true;
      AsyncStorage.getItem(CHAVE).then(async (salva) => {
        if (!vivo) return;
        if (salva == null) {
          await AsyncStorage.setItem(CHAVE, atual);
          setMudou(false);
          return;
        }
        setMudou(salva !== atual);
      });
      return () => {
        vivo = false;
      };
    }, [atual])
  );

  async function entendi() {
    if (atual == null) return;
    await AsyncStorage.setItem(CHAVE, atual);
    setMudou(false);
  }

  return { mudou, entendi };
}
