"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { CabecalhoMesa, classeBotaoNeutro, classeBotaoPrimario, classeBotaoSecundario } from "@/components/admin/CabecalhoMesa";

const campo = "w-full rounded-[10px] border border-linha px-3 py-2 outline-none focus:border-titulo";
const vazio = { title: "", body: "", type: "imediata", date: "", time: "", endDate: "", times: "" };
const dataEnvio = (item) => item.type === "agendada" ? `${item.date} às ${item.time}` : `Diariamente às ${(item.times || [item.time]).join(", ")}${item.endDate ? ` até ${item.endDate}` : ""}`;
const statusLabel = { agendada: "Agendada", ativa: "Ativa", pausada: "Pausada", concluida: "Concluída", desabilitada: "Desabilitada" };
function agoraRecife() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "America/Recife", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map(({ type, value }) => [type, value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

function mensagemErro(error, padrao) {
  if (error?.code === "permission-denied") {
    return "Sem permissão para acessar notificações. Confira se o documento users desta conta tem role admin e se as regras do Firestore estão publicadas.";
  }
  return error?.message || padrao;
}

export default function AdminNotificacoesPage() {
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState(null);
  const [programacoes, setProgramacoes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function carregar() {
    const [ps, hs] = await Promise.all([
      getDocs(query(collection(db, "notificationSchedules"), orderBy("createdAt", "desc"))),
      getDocs(query(collection(db, "notificationHistory"), orderBy("sentAt", "desc"))),
    ]);
    setProgramacoes(ps.docs.map((d) => ({ id: d.id, ...d.data() })));
    setHistorico(hs.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => { carregar().catch((error) => setErro(mensagemErro(error, "Não foi possível carregar notificações."))); }, []);

  function alterar(chave, valor) { setForm((atual) => ({ ...atual, [chave]: valor })); }

  async function salvar(event) {
    event.preventDefault(); setErro(""); setAviso("");
    const times = [...new Set((form.type === "recorrente" ? form.times.split(",") : [form.time]).map((t) => t.trim()))];
    if (!form.title.trim() || !form.body.trim() || !form.date || times.some((t) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(t)) || (form.type === "recorrente" && (!times.length || (form.endDate && form.endDate < form.date)))) {
      setErro("Confira título, mensagem, data, horários e término da recorrência."); return;
    }
    const hoje = agoraRecife();
    if (form.date < hoje.date || (form.date === hoje.date && (form.type === "agendada" ? times[0] <= hoje.time : times.every((time) => time <= hoje.time)))) {
      setErro("Escolha uma data e horário futuros no fuso de Recife."); return;
    }
    setOcupado(true);
    try {
      const valores = {
        title: form.title.trim(), body: form.body.trim(), type: form.type,
        date: form.date, time: times[0], times,
        endDate: form.type === "recorrente" ? form.endDate : form.date,
        status: form.type === "recorrente" ? "ativa" : "agendada", updatedAt: serverTimestamp(),
      };
      if (editando) await updateDoc(doc(db, "notificationSchedules", editando), valores);
      else await addDoc(collection(db, "notificationSchedules"), { ...valores, createdAt: serverTimestamp(), createdBy: auth.currentUser.uid });
      setForm(vazio); setEditando(null); setAviso("Programação salva."); await carregar();
    } catch (error) { setErro(mensagemErro(error, "Não foi possível salvar a programação.")); }
    finally { setOcupado(false); }
  }

  async function editar(item) {
    if (item.status === "concluida" || item.status === "desabilitada") return;
    setEditando(item.id);
    setForm({ title: item.title, body: item.body, type: item.type, date: item.date, time: item.time, endDate: item.endDate === item.date && item.type === "agendada" ? "" : item.endDate || "", times: (item.times || [item.time]).join(", ") });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function status(item, novo) {
    if (novo === "desabilitada" && !window.confirm("Desabilitar esta programação e cancelar os próximos envios?")) return;
    setErro(""); setAviso("");
    try {
      await updateDoc(doc(db, "notificationSchedules", item.id), { status: novo, updatedAt: serverTimestamp() });
      await carregar();
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível alterar a programação."));
    }
  }

  async function enviar(event) {
    event.preventDefault(); setErro(""); setAviso("");
    if (!window.confirm(`Enviar agora para todos os aparelhos habilitados?\n\n${form.title}\n${form.body}`)) return;
    setOcupado(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/notify-admin", { method: "POST", headers: { Authorization: `Bearer ${idToken}`, "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await res.json();
      if (!res.ok) throw new Error([result.error || "Não foi possível enviar.", result.aviso].filter(Boolean).join(" "));
      const entrega = result.total ? `Aceita pelo serviço para ${result.sent} de ${result.total} aparelhos.` : "Nenhum aparelho com notificações ativadas foi encontrado.";
      setAviso([entrega, result.aviso].filter(Boolean).join(" "));
      setForm(vazio); await carregar();
    } catch (e) { setErro(e.message || "Não foi possível enviar."); await carregar().catch(() => {}); }
    finally { setOcupado(false); }
  }

  return <div className="max-w-4xl">
    <CabecalhoMesa titulo="Notificações" frase="Envie avisos e acompanhe programações e disparos. Horários no fuso de Recife (UTC−3)." />
    <form onSubmit={!editando && form.type === "imediata" ? enviar : salvar} className="mt-8 flex flex-col gap-4 rounded-[14px] border border-linha bg-superficie p-5">
      <h2 className="font-titulo text-xl font-bold uppercase">{editando ? "Editar programação" : "Nova notificação"}</h2>
      <div className="flex flex-wrap gap-2" aria-label="Tipo de envio">
        {[["imediata", "Enviar agora"], ["agendada", "Agendar uma vez"], ["recorrente", "Recorrente"]].map(([v, label]) => <button key={v} type="button" disabled={Boolean(editando)} onClick={() => alterar("type", v)} className={form.type === v ? classeBotaoPrimario : classeBotaoNeutro}>{label}</button>)}
      </div>
      <label className="flex flex-col gap-1"><span className="text-sm font-medium">Título</span><input required maxLength={50} value={form.title} onChange={(e) => alterar("title", e.target.value)} className={campo} /></label>
      <label className="flex flex-col gap-1"><span className="text-sm font-medium">Mensagem</span><textarea required maxLength={200} rows={3} value={form.body} onChange={(e) => alterar("body", e.target.value)} className={`${campo} resize-y`} /></label>
      {form.type !== "imediata" && <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1"><span className="text-sm font-medium">{form.type === "recorrente" ? "Data de início" : "Data do envio"}</span><input required type="date" min={agoraRecife().date} value={form.date} onChange={(e) => alterar("date", e.target.value)} className={campo} /></label>
        {form.type === "agendada" ? <label className="flex flex-col gap-1"><span className="text-sm font-medium">Horário</span><input required type="time" value={form.time} onChange={(e) => alterar("time", e.target.value)} className={campo} /></label> : <>
          <label className="flex flex-col gap-1"><span className="text-sm font-medium">Horários (separados por vírgula)</span><input required placeholder="09:00, 18:00" value={form.times} onChange={(e) => alterar("times", e.target.value)} className={campo} /></label>
          <label className="flex flex-col gap-1"><span className="text-sm font-medium">Data de término (opcional)</span><input type="date" min={form.date} value={form.endDate} onChange={(e) => alterar("endDate", e.target.value)} className={campo} /></label>
          <p className="self-end text-sm text-texto/60">Recorrência diária</p>
        </>}
      </div>}
      {erro && <p role="alert" className="text-sm font-medium text-vermelho">{erro}</p>}{aviso && <p role="status" className="text-sm font-medium text-titulo">{aviso}</p>}
      <div className="flex flex-wrap gap-2"><button disabled={ocupado} className={classeBotaoPrimario}>{ocupado ? "Processando..." : editando ? "Salvar edição" : form.type === "imediata" ? "Enviar para todos" : "Salvar programação"}</button>{editando && <button type="button" onClick={() => { setEditando(null); setForm(vazio); }} className={classeBotaoNeutro}>Cancelar edição</button>}</div>
    </form>

    <section className="mt-10"><h2 className="font-titulo text-2xl font-bold uppercase">Programações</h2><div className="mt-4 grid gap-3">{programacoes.length ? programacoes.map((item) => <article key={item.id} className="rounded-[14px] border border-linha bg-superficie p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold">{item.title} <span className="ml-2 text-xs font-normal text-texto/60">{item.type === "recorrente" ? "Recorrente" : "Agendada"} · {statusLabel[item.status] || item.status}</span></p><p className="mt-1 text-sm text-texto/70">{dataEnvio(item)}</p><p className="mt-1 whitespace-pre-wrap text-sm">{item.body}</p></div><div className="flex flex-wrap gap-2">{!["concluida", "desabilitada"].includes(item.status) && <><button onClick={() => editar(item)} className={classeBotaoSecundario}>Editar</button>{item.status === "pausada" ? <button onClick={() => status(item, item.type === "recorrente" ? "ativa" : "agendada")} className={classeBotaoNeutro}>Retomar</button> : <button onClick={() => status(item, "pausada")} className={classeBotaoNeutro}>Pausar</button>}<button onClick={() => status(item, "desabilitada")} className={classeBotaoNeutro}>Desabilitar</button></>}</div></div></article>) : <p className="text-sm text-texto/60">Nenhuma programação cadastrada.</p>}</div></section>

    <section className="mt-10"><h2 className="font-titulo text-2xl font-bold uppercase">Histórico de envios</h2><div className="mt-4 grid gap-3">{historico.length ? historico.map((item) => <article key={item.id} className="rounded-[14px] border border-linha bg-superficie p-4"><p className="font-semibold">{item.title} <span className="ml-2 text-xs font-normal text-texto/60">{item.type} · {item.status}</span></p><p className="mt-1 text-sm">{item.body}</p><p className="mt-1 text-sm text-texto/70">{item.sentAt?.toDate?.().toLocaleString("pt-BR", { timeZone: "America/Recife" }) || "Horário não informado"} · {item.sent ?? 0}/{item.total ?? 0} aceitos</p></article>) : <p className="text-sm text-texto/60">Nenhum envio registrado.</p>}</div></section>
  </div>;
}
