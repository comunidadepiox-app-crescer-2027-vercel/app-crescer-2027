"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, firebaseConfigurado } from "@/lib/firebase/client";
import { useAuth, ensureUserDoc } from "@/lib/auth/AuthProvider";
import { traduzErroAuth } from "@/lib/auth/errors";
import { SimboloCrescer } from "@/components/brand/SimboloCrescer";

export default function InicioPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [modo, setModo] = useState("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/home");
  }, [loading, user, router]);

  // Volta do login por redirecionamento (fluxo do celular): o sucesso é
  // tratado pelo AuthProvider; aqui só exibimos o erro, se houver.
  useEffect(() => {
    if (!auth) return;
    getRedirectResult(auth).catch((err) => {
      console.error("Erro no retorno do login Google:", err);
      setErro(traduzErroAuth(err));
    });
  }, []);

  async function entrarComEmail(e) {
    e.preventDefault();
    setErro("");
    setAviso("");
    if (!firebaseConfigurado) {
      setErro("O Firebase ainda não foi configurado neste ambiente. Preencha o .env.local.");
      return;
    }
    setEnviando(true);
    try {
      if (modo === "criar") {
        const cred = await createUserWithEmailAndPassword(auth, email, senha);
        if (nome.trim()) {
          await updateProfile(cred.user, { displayName: nome.trim() });
        }
        await ensureUserDoc({ ...cred.user, displayName: nome.trim() || cred.user.displayName });
      } else {
        await signInWithEmailAndPassword(auth, email, senha);
      }
      router.replace("/home");
    } catch (err) {
      setErro(traduzErroAuth(err));
    } finally {
      setEnviando(false);
    }
  }

  async function entrarComGoogle() {
    setErro("");
    setAviso("");
    if (!firebaseConfigurado) {
      setErro("O Firebase ainda não foi configurado neste ambiente. Preencha o .env.local.");
      return;
    }
    setEnviando(true);
    try {
      // Em navegador de celular o popup é instável (fecha sozinho);
      // usar o fluxo de redirecionamento direto.
      const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (mobile) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      const cred = await signInWithPopup(auth, googleProvider);
      await ensureUserDoc(cred.user);
      router.replace("/home");
    } catch (err) {
      console.error("Erro no login Google:", err);
      if (err?.code === "auth/popup-blocked" || err?.code === "auth/cancelled-popup-request") {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      setErro(traduzErroAuth(err));
    } finally {
      setEnviando(false);
    }
  }

  async function esqueciASenha() {
    setErro("");
    setAviso("");
    if (!email) {
      setErro("Digite seu e-mail no campo acima para receber o link de redefinição.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setAviso("Enviamos um e-mail com o link para redefinir sua senha.");
    } catch (err) {
      setErro(traduzErroAuth(err));
    }
  }

  const abaClasse = (ativa) =>
    `pb-2 font-titulo text-lg font-bold uppercase ${
      ativa ? "border-b-2 border-destaque text-titulo" : "text-texto/60"
    }`;

  return (
    <main className="fundo-roxo-poligonal min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <header className="flex flex-col items-center">
        <Image
            src="/brand/logo-crescer-branca.png"
            alt="Crescer, o Encontro da Família Católica"
            width={220}
            height={40}
            priority
          />
        </header>

        <div className="mt-8 rounded-[14px] bg-superficie p-6 shadow-lg">
          <div className="border-b border-linha">
            <div className="flex gap-6">
              <button type="button" onClick={() => setModo("entrar")} className={abaClasse(modo === "entrar")}>
                Entrar
              </button>
              <button type="button" onClick={() => setModo("criar")} className={abaClasse(modo === "criar")}>
                Criar conta
              </button>
            </div>
          </div>

          <form onSubmit={entrarComEmail} className="mt-6 flex flex-col gap-4">
            {modo === "criar" && (
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Nome</span>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  autoComplete="name"
                  className="rounded-[10px] border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
                />
              </label>
            )}
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">E-mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="rounded-[10px] border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                Senha {modo === "criar" && <span className="text-texto/60">(mínimo 6 caracteres)</span>}
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete={modo === "criar" ? "new-password" : "current-password"}
                className="rounded-[10px] border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
              />
            </label>

            {erro && <p className="text-sm font-medium text-vermelho">{erro}</p>}
            {aviso && <p className="text-sm font-medium text-verde">{aviso}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="mt-2 rounded-[10px] bg-destaque px-6 py-3 font-titulo text-lg font-bold uppercase text-white disabled:opacity-60"
            >
              {modo === "criar" ? "Criar minha conta" : "Entrar"}
            </button>

            {modo === "entrar" && (
              <button
                type="button"
                onClick={esqueciASenha}
                className="self-start text-sm font-medium text-destaque underline"
              >
                Esqueci a senha
              </button>
            )}
          </form>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-linha" />
            <span className="text-sm text-texto/60">ou</span>
            <span className="h-px flex-1 bg-linha" />
          </div>

          <button
            type="button"
            onClick={entrarComGoogle}
            disabled={enviando}
            className="mt-6 w-full rounded-[10px] border-2 border-roxo-botao px-6 py-3 font-titulo text-lg font-bold uppercase text-titulo disabled:opacity-60 flex justify-center items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
              <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
            </svg>
            Continuar com Google
          </button>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-white/70">
          Ao criar a conta você concorda que seu nome e e-mail sejam usados para
          identificação neste aplicativo, conforme a LGPD. Nada é compartilhado
          fora da Comunidade de São Pio X.
        </p>
      </div>
    </main>
  );
}
