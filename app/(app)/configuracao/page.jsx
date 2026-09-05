"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function ConfiguracaoPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [nome, setNome] = useState(profile?.displayName || user?.displayName || "");
  const [aviso, setAviso] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvarNome(e) {
    e.preventDefault();
    setAviso("");
    setErro("");
    setSalvando(true);
    try {
      await updateProfile(auth.currentUser, { displayName: nome.trim() });
      await updateDoc(doc(db, "users", user.uid), { displayName: nome.trim() });
      setAviso("Nome atualizado.");
    } catch {
      setErro("Não foi possível salvar agora. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function sair() {
    await signOut(auth);
    router.replace("/");
  }

  return (
    <div className="max-w-prose">
      <h1 className="text-3xl font-bold uppercase">Configuração</h1>

      <section className="mt-8">
        <h2 className="text-xl font-bold uppercase">Sua conta</h2>
        <p className="mt-2 text-sm text-texto/70">
          E-mail: <span className="font-medium text-texto">{user?.email}</span>
        </p>

        <form onSubmit={salvarNome} className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Nome</span>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="rounded-[10px] border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
            />
          </label>
          {aviso && <p className="text-sm font-medium text-verde">{aviso}</p>}
          {erro && <p className="text-sm font-medium text-vermelho">{erro}</p>}
          <button
            type="submit"
            disabled={salvando}
            className="self-start rounded-[10px] bg-titulo px-5 py-2.5 font-titulo font-bold uppercase text-white disabled:opacity-60"
          >
            Salvar nome
          </button>
        </form>
      </section>

      {profile?.role === "admin" && (
        <section className="mt-10 border-t border-linha pt-6">
          <h2 className="text-xl font-bold uppercase">Administração</h2>
          <p className="mt-2 text-sm text-texto/70">
            Você faz parte da equipe de comunicação.
          </p>
          <Link
            href="/admin"
            className="mt-3 inline-block rounded-[10px] border border-titulo px-5 py-2.5 font-titulo font-bold uppercase text-titulo"
          >
            Abrir área administrativa
          </Link>
        </section>
      )}

      <section className="mt-10 border-t border-linha pt-6">
        <h2 className="text-xl font-bold uppercase">Privacidade</h2>
        <p className="mt-2 text-sm leading-relaxed text-texto/70">
          Este aplicativo guarda apenas os dados da sua conta (nome e e-mail) e,
          se você enviou, o cadastro de interesse do Benfeitor da Fé. Nada é
          compartilhado fora da Comunidade de São Pio X. Para excluir sua conta,
          fale com a comunidade pelo e-mail contato@piox.org.br.
        </p>
      </section>

      <section className="mt-10 border-t border-linha pt-6">
        <button
          type="button"
          onClick={sair}
          className="rounded-[10px] border border-vermelho px-5 py-2.5 font-titulo font-bold uppercase text-vermelho"
        >
          Sair da conta
        </button>
      </section>
    </div>
  );
}
