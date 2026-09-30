"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getDoacao, salvarPercentualDoacao } from "@/lib/admin/doacao";
import { CabecalhoMesa, classeBotaoPrimario } from "@/components/admin/CabecalhoMesa";

function interpretaPercent(texto) {
  const t = String(texto).trim();
  if (t === "") return { vazio: true };
  if (!/^\d{1,3}$/.test(t)) {
    return { erro: "Use um número inteiro de 0 a 100." };
  }
  const n = Number(t);
  if (n < 0 || n > 100) {
    return { erro: "Use um número inteiro de 0 a 100." };
  }
  return { percent: n };
}

export default function AdminDoacaoPage() {
  const { user } = useAuth();
  const [campo, setCampo] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    getDoacao()
      .then((dados) => {
        setCampo(dados.percent === null ? "" : String(dados.percent));
      })
      .catch(() => setErro("Não foi possível ler o percentual."))
      .finally(() => setCarregando(false));
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setAviso("");
    setErro("");
    const lido = interpretaPercent(campo);
    if (lido.erro) {
      setErro(lido.erro);
      return;
    }
    setOcupado(true);
    try {
      await salvarPercentualDoacao({
        percent: lido.vazio ? null : lido.percent,
        uid: user.uid,
      });
      setAviso(
        lido.vazio
          ? "Percentual removido. A barra some no aplicativo."
          : "Percentual salvo. O aplicativo atualiza a barra."
      );
    } catch {
      setErro("Não foi possível salvar.");
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="max-w-xl">
      <CabecalhoMesa
        titulo="Colabore"
        frase="O percentual que o aplicativo mostra na oferta do Crescer 2027. Sem cifra e sem meta em reais."
      />

      {carregando ? (
        <p className="mt-8 text-sm text-texto/60">Carregando...</p>
      ) : (
        <form onSubmit={salvar} className="mt-8 rounded-[14px] border border-linha bg-superficie p-5">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Percentual da meta</span>
            <input
              type="text"
              inputMode="numeric"
              value={campo}
              onChange={(e) => {
                setAviso("");
                setErro("");
                setCampo(e.target.value);
              }}
              placeholder="0 a 100"
              className="rounded-[10px] border border-linha px-3 py-2 outline-none focus:border-titulo"
            />
          </label>
          <p className="mt-2 text-sm text-texto/60">
            Inteiro de 0 a 100. Deixe em branco e salve para esconder a barra.
            Zero mostra a barra vazia.
          </p>
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
