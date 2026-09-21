import { useState } from "react";
import { View, Linking } from "react-native";
import { WebView } from "react-native-webview";
import { htmlDoArtigo } from "../lib/artigoHtml";

const MEDIR = `
  (function () {
    function envia() {
      var h = Math.max(
        document.body ? document.body.scrollHeight : 0,
        document.documentElement ? document.documentElement.scrollHeight : 0
      );
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(String(h));
    }
    window.addEventListener("load", envia);
    setTimeout(envia, 250);
    setTimeout(envia, 1000);
  })();
  true;
`;

export function CorpoNoticia({ body }) {
  const [altura, setAltura] = useState(160);

  return (
    <View style={{ height: altura, marginTop: 8 }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlDoArtigo(body) }}
        style={{ backgroundColor: "transparent" }}
        scrollEnabled={false}
        javaScriptEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        injectedJavaScript={MEDIR}
        onMessage={(evento) => {
          const valor = Number(evento.nativeEvent.data);
          if (valor > 0) setAltura(valor);
        }}
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={(req) => {
          const url = req.url || "";
          if (!url || url === "about:blank" || url.startsWith("data:")) return true;
          if (req.isTopFrame === false) return true;
          const clique = req.navigationType === "click" || req.isTopFrame === true;
          if (clique && /^https?:/i.test(url)) {
            Linking.openURL(url).catch(() => {});
            return false;
          }
          return true;
        }}
      />
    </View>
  );
}
