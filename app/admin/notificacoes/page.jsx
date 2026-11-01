"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase/client";
import { CabecalhoMesa, classeBotaoPrimario } from "@/components/admin/CabecalhoMesa";

export default function AdminNotificacoesPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function enviar(event) {
    event.preventDefault();
    setErro("");
    setResultado("");
    setOcupado(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/notify-admin", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "N\u00e3o foi poss\u00edvel enviar.");
      setResultado(data.total
        ? `Notifica\u00e7\u00e3o aceita pelo servi\u00e7o para ${data.sent} de ${data.total} aparelhos.`
        : "Nenhum aparelho com notifica\u00e7\u00f5es ativadas foi encontrado.");
      setTitle("");
      setBody("");
    } catch (error) {
      setErro(error.message || "N\u00e3o foi poss\u00edvel enviar.");
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <CabecalhoMesa
        titulo={"Notifica\u00e7\u00f5es"}
        frase={"Envie um aviso para os aparelhos que aceitaram receber notifica\u00e7\u00f5es no app."}
      />
      <form onSubmit={enviar} className="mt-8 flex flex-col gap-4 rounded-[14px] border border-linha bg-superficie p-5">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">{"T\u00edtulo"}</span>
          <input required maxLength={50} value={title} onChange={(event) => setTitle(event.target.value)} className="rounded-[10px] border border-linha px-3 py-2 outline-none focus:border-titulo" />
          <span className="text-right text-xs text-texto/60">{title.length}/50</span>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Mensagem</span>
          <textarea required maxLength={200} rows={4} value={body} onChange={(event) => setBody(event.target.value)} className="resize-y rounded-[10px] border border-linha px-3 py-2 outline-none focus:border-titulo" />
          <span className="text-right text-xs text-texto/60">{body.length}/200</span>
        </label>
        {erro ? <p role="alert" className="text-sm font-medium text-vermelho">{erro}</p> : null}
        {resultado ? <p role="status" className="text-sm font-medium text-titulo">{resultado}</p> : null}
        <div>
          <button type="submit" disabled={ocupado || !title.trim() || !body.trim()} className={classeBotaoPrimario}>
            {ocupado ? "Enviando..." : "Enviar para todos"}
          </button>
        </div>
      </form>
    </div>
  );
}
