import { Landmark, ArrowRight, CheckCircle2 } from "lucide-react";
import { Panel, PanelHeader } from "./Panel";

const scoreMetrics = [
  { value: "92", label: "Score geral" },
  { value: "Alto", label: "Volume de compras" },
  { value: "Baixo", label: "Risco de inadimplência" },
  { value: "R$ 245 mi", label: "Valor homologado (12m)" },
] as const;

const agencyInsights = [
  "Alto volume e frequência de compras públicas.",
  "Histórico de pagamentos em dia nos últimos 24 meses.",
  "Baixa ocorrência de impugnações e recursos.",
] as const;

export function AgencyScoreCard() {
  return (
    <Panel className="flex min-w-0 flex-col p-5 sm:p-6">
      <PanelHeader
        icon={
          <div className="p-1.5 bg-[#29C454]/10 rounded-lg">
            <Landmark className="size-5 text-[#29C454]" strokeWidth={2} aria-hidden="true" />
          </div>
        }
        title="Score do Órgão"
        subtitle="Avaliação estratégica dos órgãos para decisões mais assertivas."
      />

      <div className="mt-5 flex flex-1 flex-col gap-5 sm:mt-6 sm:gap-6">
        {/* Highlighted Agency Box */}
        <div className="rounded-2xl border border-[#DCFCE7] bg-[#F0FDF4]/60 p-4 shadow-sm sm:rounded-3xl sm:p-6">
          <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:mb-8 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <div className="size-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                <Landmark className="size-5 text-slate-400" />
              </div>
              <h3 className="text-[15px] font-bold leading-snug text-ink">
                Prefeitura Municipal de Porto Alegre/RS
              </h3>
            </div>
            <span className="rounded-full border border-[#29C454]/20 bg-white px-3 py-1.5 text-[12px] font-bold text-[#29C454] shadow-sm">
              Ótimo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
            {scoreMetrics.map((metric) => (
              <div
                key={metric.label}
                className="space-y-1 rounded-xl border border-[#DCFCE7] bg-white/75 p-3 text-left sm:border-0 sm:bg-transparent sm:p-0 sm:text-center"
              >
                <p className="text-[21px] font-bold leading-none text-[#29C454]">{metric.value}</p>
                <p className="text-[12px] font-medium leading-snug text-slate-text">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits/Insights List */}
        <div className="space-y-3.5 px-1">
          {agencyInsights.map((text) => (
            <div key={text} className="group flex items-start gap-2.5">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-[#29C454]/20 transition-colors group-hover:border-[#29C454]/40">
                <CheckCircle2 className="size-3.5 text-[#29C454]" />
              </div>
              <p className="text-[14px] font-medium leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="group mt-auto flex min-h-11 items-center justify-end gap-1.5 rounded-lg text-[13px] font-bold text-[#29C454] transition-colors hover:text-[#29C454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          <span>Ver análise completa</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </Panel>
  );
}
