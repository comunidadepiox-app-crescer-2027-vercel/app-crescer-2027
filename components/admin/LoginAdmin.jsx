"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firebaseConfigurado } from "@/lib/firebase/client";
import { traduzErroAuth } from "@/lib/auth/errors";
import { EMAIL_ADMIN } from "@/lib/admin/login";

export function LoginAdmin() {
  const [email, setEmail] = useState(EMAIL_ADMIN);
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    if (!firebaseConfigurado) {
      setErro("O Firebase ainda não foi configurado neste ambiente. Preencha o .env.local.");
      return;
    }
    setEnviando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch (err) {
      setErro(traduzErroAuth(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-fundo px-4">
      <div className="w-full max-w-md rounded-[14px] border border-linha bg-superficie p-6">
        <p className="font-titulo text-lg font-bold uppercase text-titulo">Crescer Admin</p>
        <p className="mt-1 text-sm text-texto/70">
          Mesa de trabalho da equipe de comunicação. Entre com a conta administrativa.
        </p>
        <form onSubmit={entrar} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">E-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="rounded-[10px] border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Senha</span>
            <input
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              className="rounded-[10px] border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
            />
          </label>
          {erro && <p className="text-sm font-medium text-vermelho">{erro}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="mt-2 rounded-[10px] bg-destaque px-6 py-3 font-titulo text-lg font-bold uppercase text-white disabled:opacity-60"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export function RecusaAdmin({ onSair }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-fundo px-4">
      <div className="w-full max-w-md rounded-[14px] border border-linha bg-superficie p-6">
        <p className="font-titulo text-lg font-bold uppercase text-titulo">Área restrita</p>
        <p className="mt-2 text-sm leading-relaxed text-texto/80">
          Esta conta não tem papel de administrador. No console do Firebase, abra
          Firestore, coleção <span className="font-medium">users</span>, documento
          do uid desta conta, e defina o campo <span className="font-medium">role</span>{" "}
          como <span className="font-medium">admin</span>. Depois recarregue a página.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={onSair}
            className="rounded-[10px] bg-destaque px-6 py-3 font-titulo text-lg font-bold uppercase text-white"
          >
            Sair
          </button>
          <Link href="/home" className="self-center text-sm font-medium text-texto/60 underline">
            Voltar ao app
          </Link>
        </div>
      </div>
    </div>
  );
}
