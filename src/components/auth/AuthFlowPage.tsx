import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandMarks";

type Flow = "signup" | "recover" | "reset" | "invite";
const copy: Record<Flow, [string, string, string]> = {
  signup: ["Crie sua conta", "Comece configurando seu workspace de licitações.", "Continuar"],
  recover: ["Recupere sua senha", "Enviaremos um link seguro para o seu e-mail.", "Enviar link"],
  reset: [
    "Defina uma nova senha",
    "Use uma senha forte e exclusiva para sua conta.",
    "Salvar nova senha",
  ],
  invite: [
    "Convite para a equipe",
    "Você foi convidado para colaborar no workspace Iridia Soluções.",
    "Aceitar convite",
  ],
};

export function AuthFlowPage({ flow, token }: { flow: Flow; token?: string }) {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [title, description, action] = copy[flow];
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (flow === "signup" && !terms) return setError("Aceite os termos para continuar.");
    if (["signup", "reset"].includes(flow) && password.length < 8)
      return setError("Use pelo menos 8 caracteres.");
    setDone(true);
  };
  if (done) {
    const to = flow === "signup" || flow === "invite" ? "/onboarding" : "/login";
    return (
      <Shell>
        <Success
          title={
            flow === "recover"
              ? "E-mail enviado"
              : flow === "reset"
                ? "Senha atualizada"
                : "Tudo pronto"
          }
          description={
            flow === "recover"
              ? "Confira sua caixa de entrada e o spam. O link expira por segurança."
              : "Você já pode continuar com segurança."
          }
          action={flow === "recover" ? "Voltar ao login" : "Continuar"}
          onClick={() => navigate({ to })}
        />
      </Shell>
    );
  }
  return (
    <Shell>
      <article className="w-full max-w-[460px] rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <Link
          to="/login"
          className="inline-flex min-h-11 items-center gap-2 text-[12px] font-bold text-slate-text hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          Voltar para entrar
        </Link>
        <h1 className="mt-5 text-[26px] font-extrabold tracking-[-0.03em] text-ink">{title}</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-text">{description}</p>
        {flow === "invite" ? (
          <form className="mt-6 grid gap-3" onSubmit={submit}>
            <div className="rounded-2xl border border-[#29C454]/25 bg-brand-tint/50 p-4 text-[12px] text-slate-text">
              <strong className="block text-[14px] text-ink">Iridia Soluções</strong>
              <span>
                Analista de licitações · convite {token ? `#${token.slice(0, 8)}` : "válido"}
              </span>
            </div>
            <button className="min-h-11 rounded-xl bg-[#18B849] text-[13px] font-extrabold text-white">
              {action}
              <CheckCircle2 className="ml-2 inline size-4" />
            </button>
          </form>
        ) : (
          <form className="mt-6 grid gap-4" onSubmit={submit}>
            <Field label="E-mail" type="email" placeholder="seu@email.com" />
            {flow === "signup" ? <Field label="Nome" placeholder="Seu nome completo" /> : null}
            {flow === "signup" || flow === "reset" ? (
              <label className="grid gap-2 text-[12px] font-bold text-ink">
                {flow === "reset" ? "Nova senha" : "Senha"}
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                  className="min-h-11 rounded-xl border border-hairline px-3 text-[13px] outline-none focus:border-[#18B849]"
                />
              </label>
            ) : null}
            {flow === "signup" ? (
              <label className="flex gap-2 text-[12px] text-slate-text">
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
                Aceito os termos de uso e a política de privacidade.
              </label>
            ) : null}
            {error ? <p className="text-[12px] font-bold text-red-600">{error}</p> : null}
            <button className="min-h-11 rounded-xl bg-[#18B849] text-[13px] font-extrabold text-white">
              {action}
              <ArrowRight className="ml-2 inline size-4" />
            </button>
          </form>
        )}
      </article>
    </Shell>
  );
}
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#F8FAFC] px-4 py-8 font-manrope">
      <div className="absolute left-5 top-5">
        <BrandLogo variant="dark" />
      </div>
      {children}
    </main>
  );
}
function Field({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <label className="grid gap-2 text-[12px] font-bold text-ink">
      {label}
      <input
        required
        type={type}
        placeholder={placeholder}
        className="min-h-11 rounded-xl border border-hairline px-3 text-[13px] outline-none focus:border-[#18B849]"
      />
    </label>
  );
}
function Success({
  title,
  description,
  action,
  onClick,
}: {
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <article className="w-full max-w-[430px] rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <CheckCircle2 className="mx-auto size-12 text-brand-strong" />
      <h1 className="mt-4 text-[25px] font-extrabold text-ink">{title}</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-text">{description}</p>
      <button
        onClick={onClick}
        className="mt-6 min-h-11 w-full rounded-xl bg-[#18B849] text-[13px] font-extrabold text-white"
      >
        {action}
      </button>
    </article>
  );
}
