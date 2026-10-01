import { useEffect, useState } from "react";
import { View } from "react-native";
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
  IconeBenfeitor,
} from "../../components/Icones";
import { CORES, FONTES } from "../../lib/tema";
import { garantirCanalAviso } from "../../lib/notificacoes";

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    garantirCanalAviso();
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
        {/* Agenda virou Programação em 01/10/2026. O arquivo é
            programacao.jsx, sem acento: rota com acento vira acento na URL e
            quebra em parte do build. O rótulo continua com acento, e o ícone
            é o mesmo calendário de sempre. */}
        <Tabs.Screen
          name="programacao"
          options={{
            title: "Programação",
            tabBarIcon: ({ color }) => <IconeCalendario cor={color} />,
          }}
        />
        {/* Benfeitor da Fé voltou a ser rota de verdade em 01/10/2026. Antes
            disso a aba abria o site da campanha, e link que finge ser tela
            pisca em branco ao toque. */}
        <Tabs.Screen
          name="benfeitor"
          options={{
            title: "Benfeitor",
            tabBarIcon: ({ focused }) => <IconeBenfeitor focused={focused} />,
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
