"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { formataDataFirestore } from "@/lib/news/format";

const STATUS = ["novo", "contatado", "descartado"];

function formataCpf(cpf) {
  const d = String(cpf || "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formataTelefone(tel) {
  const d = String(tel || "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return tel;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const q = query(collection(db, "benefactorLeads"), orderBy("createdAt", "desc"));
    getDocs(q)
      .then((snap) => setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => {
        setErro("Não foi possível carregar os cadastros.");
        setLeads([]);
      });
  }, []);

  async function mudarStatus(id, status) {
    setErro("");
    try {
      await updateDoc(doc(db, "benefactorLeads", id), { status });
      setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch {
      setErro("Não foi possível atualizar o status.");
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold uppercase">Benfeitores da Fé</h1>
      <p className="mt-2 max-w-prose text-texto/80">
        Cadastros de interesse enviados pelo aplicativo. Entre em contato pelo
        WhatsApp e registre o andamento aqui.
      </p>

      {erro && <p className="mt-4 text-sm font-medium text-vermelho">{erro}</p>}

      {leads === null ? (
        <p className="mt-6 text-sm text-texto/60">Carregando...</p>
      ) : leads.length === 0 ? (
        <p className="mt-6 text-texto/70">Nenhum cadastro por enquanto.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {leads.map((lead) => (
            <li key={lead.id} className="rounded-[10px] border border-linha bg-superficie p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-titulo text-lg font-bold uppercase text-titulo">
                    {lead.name}
                  </p>
                  <p className="mt-1 text-sm text-texto/70">
                    {lead.email} · {formataTelefone(lead.phone)}
                  </p>
                  <p className="text-sm text-texto/70">CPF: {formataCpf(lead.cpf)}</p>
                  <p className="mt-1 text-xs text-texto/50">
                    Recebido em {formataDataFirestore(lead.createdAt)}
                  </p>
                </div>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase text-texto/60">Status</span>
                  <select
                    value={lead.status}
                    onChange={(e) => mudarStatus(lead.id, e.target.value)}
                    className="rounded-[10px] border border-linha bg-superficie px-3 py-2 text-sm outline-none focus:border-titulo"
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <a
                href={`https://wa.me/55${lead.phone}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-destaque underline"
              >
                Abrir conversa no WhatsApp
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
