import { View, StyleSheet } from "react-native";
import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../lib/authProvider";
import { Header } from "../../components/Header";
import {
  IconeCasa,
  IconeJornal,
  IconeCalendario,
  IconeCoracaoChama,
  IconePessoa,
} from "../../components/Icones";
import { CORES, FONTES } from "../../lib/tema";

const ALTURA_ABAS = 64;

function FundoAbas() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={{ height: ALTURA_ABAS, backgroundColor: CORES.roxoBotao }} />
      <View style={{ flex: 1, backgroundColor: "#000" }} />
    </View>
  );
}

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const insetoBaixo = Math.max(insets.bottom, 0);

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarBackground: () => <FundoAbas />,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: ALTURA_ABAS + insetoBaixo,
          paddingTop: 6,
          paddingBottom: insetoBaixo,
        },
        tabBarActiveTintColor: CORES.dourado,
        tabBarInactiveTintColor: "rgba(255,255,255,0.75)",
        tabBarLabelStyle: {
          fontFamily: FONTES.corpoSemi,
          fontSize: 10,
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconeCasa cor={color} />,
        }}
      />
      <Tabs.Screen
        name="noticias"
        options={{
          title: "Notícias",
          tabBarIcon: ({ color }) => <IconeJornal cor={color} />,
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color }) => <IconeCalendario cor={color} />,
        }}
      />
      <Tabs.Screen
        name="benfeitor"
        options={{
          title: "Benfeitor",
          tabBarIcon: ({ color }) => <IconeCoracaoChama cor={color} />,
        }}
      />
      <Tabs.Screen
        name="conta"
        options={{
          title: "Conta",
          tabBarIcon: ({ color }) => <IconePessoa cor={color} />,
        }}
      />
    </Tabs>
  );
}
