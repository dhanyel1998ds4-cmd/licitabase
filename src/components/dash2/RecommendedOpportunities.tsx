import { Star, ArrowRight } from "lucide-react";
import { Panel, PanelHeader } from "./Panel";
import { cn } from "@/lib/utils";

export type Opportunity = {
  title: string;
  agency: string;
  code: string;
  date: string;
  value: string;
};

const opportunities: Opportunity[] = [
  {
    title: "PE 012/2025 - Aquisição de equipame...",
    agency: "Pref. Mun. de Porto...",
    code: "012/2025",
    date: "04/06/2025",
    value: "R$ 242.872,86",
  },
  {
    title: "PE 018/2025 - Serviços de rastreament...",
    agency: "Pref. Mun. de Joinv...",
    code: "018/2025",
    date: "03/06/2025",
    value: "R$ 99.154,44",
  },
  {
    title: "PE 021/2025 - Aquisição de servidores ...",
    agency: "Pref. Mun. de Jund...",
    code: "021/2025",
    date: "04/06/2025",
    value: "R$ 63.445,00",
  },
];

export function RecommendedOpportunitiesCard() {
  return (
    <Panel className="min-w-0 p-6 flex flex-col">
      <PanelHeader
        icon={
          <div className="p-1.5 bg-[#29C454]/10 rounded-lg">
            <Star className="size-5 text-[#29C454]" strokeWidth={2} aria-hidden="true" />
          </div>
        }
        title="Oportunidades prioritárias"
        action={<button className="text-[12px] font-bold text-[#29C454] hover:opacity-80 transition-opacity">Ver todas →</button>}
      />

      <div className="mt-6 flex-1">
        <div className="grid grid-cols-4 gap-4 px-2 mb-3 text-[11px] font-bold text-slate-text uppercase tracking-wider">
          <div className="col-span-1">Licitação</div>
          <div className="text-center">Órgão</div>
          <div className="text-center">Abertura</div>
          <div className="text-right">Valor estimado</div>
        </div>

        <div className="divide-y divide-hairline border-y border-hairline">
          {opportunities.map((item) => (
            <div key={item.title} className="grid grid-cols-4 gap-4 py-3.5 px-2 hover:bg-slate-50/50 transition-colors group cursor-pointer items-center">
              <div className="col-span-1 truncate text-[12px] font-medium text-ink">
                {item.title}
              </div>
              <div className="text-center truncate text-[12px] text-slate-text font-medium">
                {item.agency}
              </div>
              <div className="text-center text-[12px] text-slate-text font-medium">
                {item.date}
              </div>
              <div className="flex items-center justify-end gap-3">
                <span className="text-[12px] font-bold text-[#29C454] tabular-nums">
                  {item.value}
                </span>
                <ArrowRight className="size-3.5 text-slate-300 group-hover:text-[#29C454] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
