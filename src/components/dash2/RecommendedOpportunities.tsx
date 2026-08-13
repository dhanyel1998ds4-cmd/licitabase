import { Star, ArrowRight } from "lucide-react";
import { Panel, PanelHeader } from "./Panel";

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
    <Panel className="flex min-w-0 flex-col p-5 sm:p-6">
      <PanelHeader
        icon={
          <div className="p-1.5 bg-[#29C454]/10 rounded-lg">
            <Star className="size-5 text-[#29C454]" strokeWidth={2} aria-hidden="true" />
          </div>
        }
        title="Oportunidades prioritárias"
        action={
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-[13px] font-bold text-[#29C454] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
          >
            Ver todas →
          </button>
        }
      />

      <div className="mt-5 flex-1 sm:mt-6">
        <div className="space-y-3 sm:hidden">
          {opportunities.map((item) => (
            <article
              key={item.code}
              className="rounded-xl border border-hairline bg-slate-50/60 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="line-clamp-2 text-[14px] font-bold leading-snug text-ink">
                    {item.title}
                  </p>
                  <p className="mt-1 truncate text-[12px] font-medium text-slate-text">
                    {item.agency}
                  </p>
                </div>
                <ArrowRight className="mt-0.5 size-4 shrink-0 text-[#29C454]" aria-hidden="true" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-hairline pt-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-slate-text">
                    Abertura
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-ink">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-slate-text">
                    Valor estimado
                  </p>
                  <p className="mt-1 whitespace-nowrap text-[14px] font-bold text-[#29C454] tabular-nums">
                    {item.value}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden sm:block">
          <div className="mb-3 grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(88px,.7fr)_minmax(120px,1fr)] gap-4 px-2 text-[12px] font-bold uppercase tracking-wider text-slate-text">
            <div>Licitação</div>
            <div className="text-center">Órgão</div>
            <div className="text-center">Abertura</div>
            <div className="text-right">Valor estimado</div>
          </div>

          <div className="divide-y divide-hairline border-y border-hairline">
            {opportunities.map((item) => (
              <div
                key={item.code}
                className="group grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(88px,.7fr)_minmax(120px,1fr)] items-center gap-4 px-2 py-3.5 transition-colors hover:bg-slate-50/50"
              >
                <div className="truncate text-[13px] font-medium text-ink">{item.title}</div>
                <div className="truncate text-center text-[13px] font-medium text-slate-text">
                  {item.agency}
                </div>
                <div className="text-center text-[13px] font-medium text-slate-text">
                  {item.date}
                </div>
                <div className="flex items-center justify-end gap-3">
                  <span className="whitespace-nowrap text-[13px] font-bold text-[#29C454] tabular-nums">
                    {item.value}
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-slate-300 transition-colors group-hover:text-[#29C454]"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
