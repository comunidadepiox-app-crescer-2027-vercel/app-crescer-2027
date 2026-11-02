import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts, Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold } from "@expo-google-fonts/outfit";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "../lib/authProvider";
import { Splash } from "../components/Splash";
import { CORES } from "../lib/tema";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontesOk] = useFonts({
    "GeometricSlab-500": require("../assets/fonts/geometric-slabserif-500.ttf"),
    "GeometricSlab-700": require("../assets/fonts/geometric-slabserif-700.ttf"),
    ArcaneNine: require("../assets/fonts/arcane-nine-400.ttf"),
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
  });

  useEffect(() => {
    if (fontesOk) SplashScreen.hideAsync().catch(() => {});
  }, [fontesOk]);

  if (!fontesOk) {
    return (
      <View style={estilos.carregando}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Splash />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: CORES.fundo },
        }}
      />
    </AuthProvider>
  );
}

const estilos = StyleSheet.create({
  carregando: {
    flex: 1,
    backgroundColor: CORES.roxoSplash,
    alignItems: "center",
    justifyContent: "center",
  },
});
