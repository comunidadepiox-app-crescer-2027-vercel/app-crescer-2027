"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/lib/auth/AuthProvider";

const CHAVES = [
  { key: "home", rotulo: "Destaque da Home", ajuda: "Texto curto exibido no topo da Home (opcional)." },
  { key: "about", rotulo: "Sobre o Crescer", ajuda: "Complemento institucional da página Sobre (opcional)." },
];

export default function AdminDestaquesPage() {
  const { user } = useAuth();
  const [conteudos, setConteudos] = useState(null);
  const [aviso, setAviso] = useState("");
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    Promise.all(
      CHAVES.map(async ({ key }) => {
        const snap = await getDoc(doc(db, "siteContent", key));
        return [key, snap.exists() ? snap.data() : { title: "", body: "" }];
      })
    )
      .then((pares) => setConteudos(Object.fromEntries(pares)))
      .catch(() => setConteudos(Object.fromEntries(CHAVES.map(({ key }) => [key, { title: "", body: "" }]))));
  }, []);

  if (conteudos === null) {
    return <p className="text-sm text-texto/60">Carregando...</p>;
  }

  function atualiza(key, campo, valor) {
    setConteudos((c) => ({ ...c, [key]: { ...c[key], [campo]: valor } }));
  }

  async function salvar(key) {
    setAviso("");
    setErro("");
    setOcupado(true);
    try {
      await setDoc(doc(db, "siteContent", key), {
        title: conteudos[key].title || "",
        body: conteudos[key].body || "",
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      });
      setAviso("Conteúdo salvo.");
    } catch {
      setErro("Não foi possível salvar.");
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold uppercase">Destaques</h1>
      <p className="mt-2 text-texto/80">
        Textos institucionais editáveis sem novo deploy.
      </p>

      {aviso && <p className="mt-4 text-sm font-medium text-verde">{aviso}</p>}
      {erro && <p className="mt-4 text-sm font-medium text-vermelho">{erro}</p>}

      <div className="mt-6 flex flex-col gap-8">
        {CHAVES.map(({ key, rotulo, ajuda }) => (
          <section key={key} className="rounded-[10px] border border-linha bg-superficie p-5">
            <h2 className="font-titulo text-lg font-bold uppercase text-titulo">{rotulo}</h2>
            <p className="mt-1 text-sm text-texto/60">{ajuda}</p>
            <label className="mt-3 flex flex-col gap-1">
              <span className="text-sm font-medium">Título</span>
              <input
                type="text"
                value={conteudos[key].title}
                onChange={(e) => atualiza(key, "title", e.target.value)}
                className="rounded-[10px] border border-linha px-3 py-2 outline-none focus:border-titulo"
              />
            </label>
            <label className="mt-3 flex flex-col gap-1">
              <span className="text-sm font-medium">Texto</span>
              <textarea
                rows={4}
                value={conteudos[key].body}
                onChange={(e) => atualiza(key, "body", e.target.value)}
                className="rounded-[10px] border border-linha px-3 py-2 outline-none focus:border-titulo"
              />
            </label>
            <button
              type="button"
              disabled={ocupado}
              onClick={() => salvar(key)}
              className="mt-4 rounded-[10px] bg-titulo px-5 py-2.5 font-titulo font-bold uppercase text-white disabled:opacity-60"
            >
              Salvar
            </button>
          </section>
        ))}
      </div>
    </div>
  );
}
