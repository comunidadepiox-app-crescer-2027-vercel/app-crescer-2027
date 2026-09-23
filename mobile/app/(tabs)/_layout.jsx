import { useEffect, useState } from "react";
import { AppState, View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../lib/authProvider";
import { Header } from "../../components/Header";
import { PedidoNotificacao } from "../../components/PedidoNotificacao";
import { BarraAbas, alturaBarra } from "../../components/BarraAbas";
import { MenuAtalhos } from "../../components/MenuAtalhos";
import {
  IconeCasa,
  IconeJornal,
  IconeCalendario,
  IconeCoracaoChama,
} from "../../components/Icones";
import { CORES, FONTES } from "../../lib/tema";
import { atualizarOrigemSePermitida } from "../../lib/avisoSaida";
import { garantirCanalSaida } from "../../lib/notificacoes";

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!user?.uid) return undefined;
    garantirCanalSaida();
    atualizarOrigemSePermitida(user.uid).catch(() => {});
    const sub = AppState.addEventListener("change", (estado) => {
      if (estado === "active") atualizarOrigemSePermitida(user.uid).catch(() => {});
    });
    return () => sub.remove();
  }, [user?.uid]);

  if (loading) return null;
  if (!user) return <Redirect href="/" />;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => (
          <BarraAbas
            {...props}
            menuAberto={menuAberto}
            onAlternarMenu={() => setMenuAberto((aberto) => !aberto)}
            onFecharMenu={() => setMenuAberto(false)}
          />
        )}
        screenOptions={{
          header: () => <Header />,
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: CORES.dourado,
          tabBarInactiveTintColor: "#ffffff",
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
            href: null,
            title: "Conta",
          }}
        />
      </Tabs>
      <MenuAtalhos
        aberto={menuAberto}
        onFechar={() => setMenuAberto(false)}
        alturaBarra={alturaBarra(Math.max(insets.bottom, 0))}
      />
      <PedidoNotificacao uid={user.uid} />
    </View>
  );
}
