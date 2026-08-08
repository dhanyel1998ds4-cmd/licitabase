import { Landmark, ArrowRight, CheckCircle2 } from "lucide-react";
import { Panel, PanelHeader } from "./Panel";
import { cn } from "@/lib/utils";

export function AgencyScoreCard() {
  return (
    <Panel className="flex min-w-0 flex-col p-6">
      <PanelHeader
        icon={
          <div className="p-1.5 bg-[#29C454]/10 rounded-lg">
            <Landmark className="size-5 text-[#29C454]" strokeWidth={2} aria-hidden="true" />
          </div>
        }
        title="Score do Órgão"
        subtitle="Avaliação estratégica dos órgãos para decisões mais assertivas."
      />

      <div className="mt-6 flex flex-1 flex-col gap-6">
        {/* Highlighted Agency Box */}
        <div className="rounded-3xl bg-[#F0FDF4]/60 border border-[#DCFCE7] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                <Landmark className="size-5 text-slate-400" />
              </div>
              <h3 className="text-[15px] font-bold text-ink">
                Prefeitura Municipal de Porto Alegre/RS
              </h3>
            </div>
            <span className="text-[12px] font-bold text-[#29C454] bg-white px-3 py-1 rounded-full border border-[#29C454]/20 shadow-sm">
              Ótimo
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4 relative">
            {/* Divider lines */}
            <div className="absolute top-2 bottom-2 left-1/4 w-px bg-slate-200/50" />
            <div className="absolute top-2 bottom-2 left-2/4 w-px bg-slate-200/50" />
            <div className="absolute top-2 bottom-2 left-3/4 w-px bg-slate-200/50" />

            <div className="text-center space-y-1">
              <p className="text-[22px] font-bold text-[#29C454] leading-none">92</p>
              <p className="text-[11px] font-medium text-slate-text">Score Geral</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-[20px] font-bold text-[#29C454] leading-none">Alto</p>
              <p className="text-[11px] font-medium text-slate-text">Volume de compras</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-[20px] font-bold text-[#29C454] leading-none">Baixo</p>
              <p className="text-[11px] font-medium text-slate-text">Risco de inadimplência</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-[20px] font-bold text-[#29C454] leading-none">R$ 245 mi</p>
              <p className="text-[11px] font-medium text-slate-text">Valor homologado (12m)</p>
            </div>
          </div>
        </div>

        {/* Benefits/Insights List */}
        <div className="space-y-3.5 px-1">
          {[
            "Alto volume e frequência de compras públicas.",
            "Histórico de pagamentos em dia nos últimos 24 meses.",
            "Baixa ocorrência de impugnações e recursos.",
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-2.5 group">
              <div className="size-5 rounded-full border-2 border-[#29C454]/20 flex items-center justify-center group-hover:border-[#29C454]/40 transition-colors">
                <CheckCircle2 className="size-3.5 text-[#29C454]" />
              </div>
              <p className="text-[13px] font-medium text-ink-soft">{text}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-auto group flex items-center justify-end gap-1.5 text-[13px] font-bold text-[#29C454] hover:text-[#29C454] transition-colors"
        >
          <span>Ver análise completa</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </Panel>
  );
}
