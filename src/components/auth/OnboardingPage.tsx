import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleDot,
  MapPin,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandMarks";

const steps = [
  "Boas-vindas",
  "Sua empresa",
  "Categorias",
  "Regiões",
  "Portais",
  "Alertas",
  "Pronto",
];
const categories = [
  "Tecnologia",
  "Material de escritório",
  "Limpeza",
  "Engenharia",
  "Saúde",
  "Serviços técnicos",
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(["Tecnologia"]);
  const done = step === steps.length - 1;
  const toggle = (item: string) =>
    setSelected((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  return (
    <main className="min-h-dvh bg-[#041410] p-0 font-manrope lg:h-dvh lg:overflow-hidden lg:p-5">
      <div className="grid min-h-dvh overflow-hidden bg-[#F7FAF8] lg:h-[calc(100dvh-40px)] lg:min-h-0 lg:grid-cols-[340px_minmax(0,1fr)] lg:rounded-[28px]">
        <aside className="relative hidden overflow-hidden bg-[#061D16] px-8 py-9 text-white lg:flex lg:flex-col">
          <div className="pointer-events-none absolute -right-20 top-20 size-72 rotate-[22deg] rounded-[58px] border border-[#3BE671]/25" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full border-[36px] border-[#21C554]/15" />
          <BrandLogo variant="light" className="relative z-10" />
          <div className="relative z-10 mt-16">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#4EEA7C]">
              Primeiro acesso
            </p>
            <h1
              className="mt-3 text-[29px] font-extrabold leading-tight tracking-[-0.035em]"
              style={{ color: "#F8FFFA" }}
            >
              Seu comando para vender mais ao governo.
            </h1>
            <p className="mt-4 text-[13px] leading-relaxed" style={{ color: "#D5E6DC" }}>
              Vamos montar uma experiência sob medida para a sua operação.
            </p>
          </div>
          <ol className="relative z-10 mt-11 space-y-1.5">
            {steps.map((label, index) => (
              <li
                key={label}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[12px] font-bold ${index === step ? "bg-white/12 text-white" : index < step ? "text-[#75E496]" : "text-slate-400"}`}
              >
                <span
                  className={`grid size-6 place-items-center rounded-full text-[10px] ${index === step ? "bg-[#24C85A] text-white" : index < step ? "bg-[#174B33] text-[#62E58C]" : "bg-white/10 text-slate-400"}`}
                >
                  {index < step ? <CheckCircle2 className="size-3.5" /> : index + 1}
                </span>
                {label}
              </li>
            ))}
          </ol>
          <div className="relative z-10 mt-auto rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <Sparkles className="size-5 text-[#4EEA7C]" />
            <p className="mt-2 text-[12px] font-bold">Tudo pode ser ajustado depois.</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              Você terá controle total das preferências na sua conta.
            </p>
          </div>
        </aside>
        <section
          data-onboarding-content
          className="relative flex min-h-0 min-w-0 flex-col overflow-hidden py-0 bg-[radial-gradient(circle_at_88%_6%,rgba(37,201,91,0.13),transparent_25%),#F7FAF8] lg:overflow-y-auto"
        >
          <header className="flex min-h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-5 backdrop-blur sm:px-8 lg:hidden">
            <BrandLogo variant="dark" />
            <span className="text-[11px] font-bold text-slate-text">
              Etapa {step + 1} de {steps.length}
            </span>
          </header>
          <div className="mx-auto flex w-full max-w-4xl flex-1 items-center px-4 py-6 sm:px-8 lg:px-12">
            <article className="w-full overflow-hidden rounded-[26px] border border-white bg-white shadow-[0_22px_70px_rgba(6,29,22,0.10)]">
              <div className="h-1.5 bg-slate-100">
                <div
                  className="h-full bg-gradient-to-r from-[#18B849] to-[#5DE783] transition-all duration-500"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
              <div className="p-6 sm:p-9 lg:p-11">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-brand-strong">
                      {steps[step]}
                    </p>
                    <h2 className="mt-2 text-[27px] font-extrabold tracking-[-0.04em] text-ink sm:text-[34px]">
                      {titles[step]}
                    </h2>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#E9FAEF] text-[#18B849]">
                    <StepIcon step={step} />
                  </span>
                </div>
                <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-slate-text">
                  {descriptions[step]}
                </p>
                <div className="mt-8 min-h-[240px]">
                  <StepBody step={step} selected={selected} toggle={toggle} />
                </div>
              </div>
              <footer className="flex items-center justify-between border-t border-slate-100 bg-[#FBFDFC] px-6 py-4 sm:px-9">
                <button
                  disabled={step === 0}
                  onClick={() => setStep((current) => current - 1)}
                  className="min-h-11 rounded-xl px-2 text-[12px] font-bold text-slate-text transition hover:text-ink disabled:opacity-35"
                >
                  <ArrowLeft className="mr-1 inline size-4" />
                  Voltar
                </button>
                <button
                  onClick={() =>
                    done ? navigate({ to: "/dash2" }) : setStep((current) => current + 1)
                  }
                  className="min-h-11 rounded-xl bg-[#18B849] px-5 text-[12px] font-extrabold text-white shadow-[0_8px_20px_rgba(24,184,73,0.25)] transition hover:-translate-y-0.5 hover:bg-[#139E3E]"
                >
                  {done ? "Abrir meu painel" : "Continuar"}
                  <ArrowRight className="ml-1.5 inline size-4" />
                </button>
              </footer>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
const titles = [
  "Vamos deixar a LicitaBase com a sua cara",
  "Conte um pouco sobre sua empresa",
  "O que sua empresa fornece?",
  "Onde sua operação acontece?",
  "Quais portais você usa?",
  "Como prefere ser avisado?",
  "Seu workspace está pronto.",
];
const descriptions = [
  "Em menos de dois minutos, você terá oportunidades e alertas muito mais relevantes.",
  "Essas informações ajudam a organizar a operação da sua equipe.",
  "Vamos usar estas escolhas para encontrar licitações com maior aderência.",
  "Priorize locais para evitar alertas que não fazem sentido agora.",
  "Vamos sugerir conexões para centralizar suas disputas.",
  "Você escolhe o nível de acompanhamento ideal para a sua rotina.",
  "Sua base está configurada. A primeira oportunidade pode estar a poucos cliques.",
];
function StepIcon({ step }: { step: number }) {
  const icons = [Sparkles, Building2, CircleDot, MapPin, Building2, Sparkles, CheckCircle2];
  const Icon = icons[step] ?? Sparkles;
  return <Icon className="size-5" />;
}
function StepBody({
  step,
  selected,
  toggle,
}: {
  step: number;
  selected: string[];
  toggle: (value: string) => void;
}) {
  if (step === 0)
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric value="400 mil+" label="licitações analisadas" />
        <Metric value="15+" label="filtros inteligentes" />
        <Metric value="1 só lugar" label="para sua operação" />
      </div>
    );
  if (step === 2)
    return (
      <div className="flex flex-wrap gap-2.5">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => toggle(item)}
            className={`min-h-11 rounded-xl border px-3 text-[12px] font-bold transition ${selected.includes(item) ? "border-[#18B849] bg-[#E9FAEF] text-[#13763A] shadow-sm" : "border-slate-200 bg-white text-slate-text hover:border-[#18B849]/45"}`}
          >
            {selected.includes(item) ? <CheckCircle2 className="mr-1.5 inline size-3.5" /> : null}
            {item}
          </button>
        ))}
      </div>
    );
  if (step === 1 || step === 3)
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={step === 1 ? "Razão social" : "Estados prioritários"}
          placeholder={step === 1 ? "Iridia Soluções Ltda." : "SP, RJ, MG"}
        />
        <Field
          label={step === 1 ? "CNPJ" : "Regiões atendidas"}
          placeholder={step === 1 ? "00.000.000/0001-00" : "Sudeste"}
        />
      </div>
    );
  if (step === 6)
    return (
      <div className="rounded-2xl border border-[#18B849]/20 bg-[#F0FCF4] p-5">
        <CheckCircle2 className="size-6 text-[#18B849]" />
        <p className="mt-3 text-[14px] font-extrabold text-ink">
          Tecnologia já foi adicionada às suas preferências.
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
          Você receberá recomendações mais relevantes a partir de agora.
        </p>
      </div>
    );
  return (
    <div className="grid gap-3">
      {["ComprasNet", "Licitanet", "Portal de Compras Públicas"].map((item, index) => (
        <label
          key={item}
          className="flex min-h-12 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-ink"
        >
          <span>
            {step === 5
              ? [
                  "Novas oportunidades compatíveis",
                  "Prazos e atualizações",
                  "Atividade do Bot de Lances",
                ][index]
              : item}
          </span>
          <input
            type="checkbox"
            defaultChecked={index === 0 || step === 5}
            className="size-4 accent-[#18B849]"
          />
        </label>
      ))}
    </div>
  );
}
function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#F8FCF9] p-4">
      <p className="text-[20px] font-extrabold tracking-tight text-[#18B849]">{value}</p>
      <p className="mt-1 text-[11px] font-semibold leading-relaxed text-slate-text">{label}</p>
    </div>
  );
}
function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="grid gap-2 text-[12px] font-bold text-ink">
      {label}
      <input
        placeholder={placeholder}
        className="min-h-11 rounded-xl border border-slate-200 px-3 text-[13px] font-medium outline-none transition focus:border-[#18B849] focus:ring-2 focus:ring-[#18B849]/15"
      />
    </label>
  );
}
