"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { validaLead } from "@/lib/benfeitor/validate";
import { submitLead, WHATSAPP_COMUNIDADE } from "@/lib/benfeitor/submit";
import { IconeCoracaoChama } from "@/components/nav/icones";

export default function BenfeitorPage() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    name: profile?.displayName || user?.displayName || "",
    email: user?.email || "",
    phone: "",
    cpf: "",
    lgpdConsent: false,
  });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function atualiza(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function enviar(e) {
    e.preventDefault();
    setErro("");
    const problema = validaLead(form);
    if (problema) {
      setErro(problema);
      return;
    }
    setEnviando(true);
    try {
      await submitLead({ uid: user.uid, ...form });
      setEnviado(true);
    } catch {
      setErro("Não foi possível enviar agora. Tente novamente em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="max-w-prose">
        <h1 className="text-3xl font-bold uppercase">Cadastro recebido</h1>
        <p className="mt-4 leading-relaxed">
          Obrigado por querer sustentar esta missão. A equipe da Comunidade de
          São Pio X vai entrar em contato pelo seu WhatsApp para concluir o
          cadastro. A contribuição mensal é feita por boleto ou Pix, sempre no
          contato direto com a comunidade.
        </p>
        <a
          href={WHATSAPP_COMUNIDADE}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-[10px] bg-titulo px-5 py-2.5 font-titulo font-bold uppercase text-white"
        >
          Falar com a comunidade no WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div>
      <section className="fundo-roxo-poligonal rounded-[14px] p-6 md:p-10">
        <IconeCoracaoChama className="h-14 w-14 text-dourado" />
        <h1 className="mt-4 max-w-xl font-titulo text-3xl font-bold uppercase leading-tight text-white md:text-4xl">
          Seja um Benfeitor da Fé
        </h1>
        <p className="mt-3 max-w-xl text-white/85">
          Ajude a Comunidade de São Pio X a transformar as famílias e contribua
          para a realização do Crescer.
        </p>
        <a
          href="#formulario"
          className="mt-6 inline-block rounded-[10px] bg-destaque px-5 py-2.5 font-titulo text-base font-bold uppercase text-white"
        >
          Quero ser Benfeitor da Fé
        </a>
      </section>

      <div className="mt-10 max-w-prose">
      <p className="leading-relaxed">
        O Benfeitor da Fé é uma campanha de apoio contínuo, formada por pessoas
        que decidem colaborar mensalmente para sustentar e expandir as obras da
        Comunidade de São Pio X. Ser Benfeitor da Fé é assumir compromisso com a
        missão e fazer parte de uma rede de pessoas unidas pela solidariedade e
        pela fé.
      </p>
      <p className="mt-4 leading-relaxed">
        As doações são destinadas à manutenção e ao crescimento das atividades
        de evangelização, cursos, eventos como o Crescer e ações sociais da
        comunidade.
      </p>

      <h2 className="mt-8 text-2xl font-bold uppercase">Como participar</h2>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-texto/85">
        <li>Preencha o formulário com seus dados.</li>
        <li>Entraremos em contato no seu WhatsApp para concluir o cadastro.</li>
        <li>Todos os meses você poderá contribuir através de boleto ou Pix.</li>
      </ol>

      <form id="formulario" onSubmit={enviar} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Nome completo</span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => atualiza("name", e.target.value)}
            autoComplete="name"
            className="rounded-[10px] border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">E-mail</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => atualiza("email", e.target.value)}
            autoComplete="email"
            className="rounded-[10px] border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Celular com DDD</span>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => atualiza("phone", e.target.value)}
            autoComplete="tel"
            placeholder="(83) 90000-0000"
            className="rounded-[10px] border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">CPF</span>
          <input
            type="text"
            required
            inputMode="numeric"
            value={form.cpf}
            onChange={(e) => atualiza("cpf", e.target.value)}
            placeholder="000.000.000-00"
            className="rounded-[10px] border border-linha bg-superficie px-4 py-3 outline-none focus:border-titulo"
          />
        </label>

        <label className="mt-2 flex items-start gap-3">
          <input
            type="checkbox"
            checked={form.lgpdConsent}
            onChange={(e) => atualiza("lgpdConsent", e.target.checked)}
            className="mt-1 h-4 w-4 accent-titulo"
          />
          <span className="text-sm leading-relaxed text-texto/80">
            Autorizo o uso destes dados pela Comunidade de São Pio X apenas para
            o contato e o cadastro de Benfeitor da Fé, em conformidade com a
            LGPD.
          </span>
        </label>

        {erro && <p className="text-sm font-medium text-vermelho">{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="mt-2 self-start rounded-[10px] bg-destaque px-6 py-3 font-titulo text-lg font-bold uppercase text-white disabled:opacity-60"
        >
          Quero participar
        </button>
      </form>

      <p className="mt-8 border-t border-linha pt-4 text-xs leading-relaxed text-texto/60">
        Este aplicativo não processa pagamentos. O envio deste formulário é um
        cadastro de interesse: a equipe da comunidade conclui tudo com você pelo
        WhatsApp. Mantenedora: Associação Carismática Católica São Pio X, CNPJ
        02.868.732/0001-23.
      </p>
      </div>
    </div>
  );
}
