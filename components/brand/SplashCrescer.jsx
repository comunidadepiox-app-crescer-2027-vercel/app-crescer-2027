"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth/AuthProvider";

// Se o autoplay do vídeo falhar (economia de bateria etc.), não prender o usuário
const FALLBACK_MS = 6000;
const DURACAO_SAIDA_MS = 450;

// Abertura do app: vídeo da logo do Crescer se montando, sobre o roxo
// oficial, com o lettering branco da marca surgindo no final. Aparece em
// todo carregamento completo e só sai quando o vídeo terminou e a sessão
// do Firebase foi resolvida.
export function SplashCrescer() {
  const { loading } = useAuth();
  const [reduzMovimento, setReduzMovimento] = useState(false);
  const [mostraWordmark, setMostraWordmark] = useState(false);
  const [animacaoCompleta, setAnimacaoCompleta] = useState(false);
  const [oculta, setOculta] = useState(false);

  useEffect(() => {
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduz) {
      setReduzMovimento(true);
      setMostraWordmark(true);
    }
    const t = setTimeout(() => setAnimacaoCompleta(true), reduz ? 700 : FALLBACK_MS);
    return () => clearTimeout(t);
  }, []);

  const saindo = animacaoCompleta && !loading;

  useEffect(() => {
    if (!saindo) return;
    const t = setTimeout(() => setOculta(true), DURACAO_SAIDA_MS);
    return () => clearTimeout(t);
  }, [saindo]);

  if (oculta) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-roxo ${
        saindo ? "splash-saida" : ""
      }`}
    >
      {reduzMovimento ? (
        <Image
          src="/brand/simbolo-crescer.png"
          alt=""
          width={176}
          height={176}
          priority
          className="h-40 w-40 md:h-44 md:w-44"
        />
      ) : (
        <video
          src="/brand/splash-crescer.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime >= 2.8) setMostraWordmark(true);
          }}
          onEnded={() => setAnimacaoCompleta(true)}
          className="w-64 md:w-72"
        />
      )}
      <Image
        src="/brand/wordmark-crescer-branca.png"
        alt=""
        width={240}
        height={67}
        priority
        className={`mt-2 h-auto w-56 md:w-60 ${
          mostraWordmark ? "splash-wordmark" : "opacity-0"
        }`}
      />
    </div>
  );
}
