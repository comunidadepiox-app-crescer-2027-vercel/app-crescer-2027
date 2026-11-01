"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { CabecalhoMesa, classeBotaoPrimario } from "@/components/admin/CabecalhoMesa";

export default function AdminBenfeitorPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    user.getIdToken()
      .then((token) => fetch("/api/admin/benfeitor-email", { headers: { Authorization: `Bearer ${token}` } }))
      .then(async (res) => {
        const dados = await res.json();
        if (!res.ok) throw new Error(dados.error);
        setEmail(dados.email || "");
      })
      .catch(() => setErro("Não foi possível carregar o endereço."))
      .finally(() => setCarregando(false));
  }, [user]);

  async function salvar(evento) {
    evento.preventDefault();
    setAviso("");
    setErro("");
    setOcupado(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/benfeitor-email", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const dados = await res.json();
      if (!res.ok) throw new Error(dados.error);
      setEmail(dados.email);
      setAviso("Endereço salvo. Os próximos cadastros serão enviados para ele.");
    } catch (error) {
      setErro(error.message || "Não foi possível salvar.");
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="max-w-xl">
      <CabecalhoMesa
        titulo="Benfeitor da Fé"
        frase="Endereço que recebe por e-mail os novos cadastros de Benfeitor."
      />
      {carregando ? (
        <p className="mt-8 text-sm text-texto/60">Carregando...</p>
      ) : (
        <form onSubmit={salvar} className="mt-8 rounded-[14px] border border-linha bg-superficie p-5">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">E-mail de destino</span>
            <input
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={(evento) => {
                setEmail(evento.target.value);
                setAviso("");
                setErro("");
              }}
              className="rounded-[10px] border border-linha px-3 py-2 outline-none focus:border-titulo"
            />
          </label>
          {aviso ? <p className="mt-4 text-sm font-medium text-verde">{aviso}</p> : null}
          {erro ? <p className="mt-4 text-sm font-medium text-vermelho">{erro}</p> : null}
          <button type="submit" disabled={ocupado} className={`${classeBotaoPrimario} mt-5`}>
            Salvar
          </button>
        </form>
      )}
    </div>
  );
}
