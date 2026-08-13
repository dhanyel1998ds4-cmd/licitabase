import { ArrowRight, CalendarCheck2, CircleDollarSign, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel, PanelHeader } from "./Panel";
import { MobilePagedList } from "./MobilePagedList";

type WonBidStatus = "Homologada" | "Adjudicada" | "Contrato assinado";

type WonBid = {
  id: string;
  agency: string;
  object: string;
  finalValue: string;
  resultDate: string;
  status: WonBidStatus;
};

const statusStyles: Record<WonBidStatus, string> = {
  Homologada: "border-[#29C454]/20 bg-[#29C454]/10 text-[#16863A]",
  Adjudicada: "border-blue-100 bg-blue-50 text-blue-700",
  "Contrato assinado": "border-violet-100 bg-violet-50 text-violet-700",
};

const wonBids: WonBid[] = [
  {
    id: "PE 133/2026",
    agency: "Instituto Federal do Rio Grande do Sul",
    object: "Registro de preços para aquisição de servidores de rede.",
    finalValue: "R$ 1.103.954,00",
    resultDate: "10 ago 2026",
    status: "Homologada",
  },
  {
    id: "PE 088/2026",
    agency: "Prefeitura Municipal de Campinas/SP",
    object: "Fornecimento de notebooks corporativos e acessórios.",
    finalValue: "R$ 245.800,00",
    resultDate: "07 ago 2026",
    status: "Adjudicada",
  },
  {
    id: "PE 014/2026",
    agency: "Secretaria Estadual de Administração/PR",
    object: "Licenciamento de software e suporte técnico especializado.",
    finalValue: "R$ 86.400,00",
    resultDate: "02 ago 2026",
    status: "Contrato assinado",
  },
];

export function WonBidsCard() {
  const renderBid = (bid: WonBid) => (
    <article key={bid.id} className="dashboard-bid-row group relative min-w-0">
      <button
        type="button"
        aria-label={`Abrir resultado da ${bid.id}`}
        className="dashboard-bid-row__target absolute inset-0 z-10 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
      />

      <div className="dashboard-bid-copy min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-text">
            <Medal className="size-3.5 text-[#29C454]" aria-hidden="true" />
            {bid.id}
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-bold",
              statusStyles[bid.status],
            )}
          >
            {bid.status}
          </span>
        </div>
        <h3 className="dashboard-bid-title mt-1.5 text-[14px] font-bold leading-snug text-ink">
          {bid.agency}
        </h3>
        <p className="dashboard-bid-description mt-1 text-[12px] font-medium leading-snug text-slate-text">
          {bid.object}
        </p>
      </div>

      <div className="dashboard-bid-metrics">
        <div className="dashboard-bid-metric">
          <p className="dashboard-bid-metric__label text-[10px] font-bold uppercase tracking-wide text-slate-text">
            Valor final
          </p>
          <p className="dashboard-bid-metric__value mt-1 truncate text-[12px] font-bold text-[#16863A] tabular-nums">
            {bid.finalValue}
          </p>
        </div>
        <div className="dashboard-bid-metric">
          <p className="dashboard-bid-metric__label text-[10px] font-bold uppercase tracking-wide text-slate-text">
            Resultado
          </p>
          <p className="dashboard-bid-metric__value mt-1 flex items-center gap-1 truncate text-[11px] font-bold text-ink">
            <CalendarCheck2 className="size-3 shrink-0 text-slate-text" aria-hidden="true" />
            {bid.resultDate}
          </p>
        </div>
        <span className="dashboard-bid-arrow" aria-hidden="true">
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );

  return (
    <Panel className="dashboard-detail-panel flex min-w-0 flex-col p-4 sm:p-6">
      <PanelHeader
        icon={
          <div className="rounded-lg bg-[#29C454]/10 p-1.5">
            <Trophy className="size-5 text-[#29C454]" strokeWidth={2} aria-hidden="true" />
          </div>
        }
        title="Licitações ganhas"
        subtitle="Acompanhe resultados, valores homologados e a evolução dos contratos conquistados."
        action={
          <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#29C454]/20 bg-[#29C454]/10 px-3 text-[12px] font-bold text-[#16863A]">
            <Medal className="size-3.5" aria-hidden="true" />3 resultados
          </span>
        }
      />

      <div className="dashboard-detail-summary mt-4 grid grid-cols-2 gap-2 rounded-xl border border-[#DCFCE7] bg-[#F0FDF4]/55 p-2 sm:mt-6 sm:gap-2.5 sm:p-2.5">
        <div className="dashboard-detail-summary__item rounded-lg bg-white p-2.5 shadow-sm sm:p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-text">
            <Trophy className="size-3.5 text-[#29C454]" aria-hidden="true" />
            Ganhas
          </p>
          <p className="mt-2 text-[22px] font-bold leading-none text-[#29C454] tabular-nums">3</p>
        </div>
        <div className="dashboard-detail-summary__item rounded-lg bg-white p-2.5 shadow-sm sm:p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-text">
            <CircleDollarSign className="size-3.5 text-[#29C454]" aria-hidden="true" />
            Valor homologado
          </p>
          <p className="mt-2 text-[20px] font-bold leading-none text-ink tabular-nums">
            R$ 1,43 mi
          </p>
        </div>
      </div>

      <div className="dashboard-bid-list mt-3 border-y border-hairline sm:mt-4">
        <MobilePagedList
          items={wonBids}
          renderItem={renderBid}
          getKey={(bid) => bid.id}
          ariaLabel="Resultados de licitações ganhas"
        />
        <div className="hidden divide-y divide-hairline md:block">{wonBids.map(renderBid)}</div>
      </div>

      <div className="dashboard-detail-footer mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 sm:gap-3 sm:pt-4">
        <p className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-text">
          <CircleDollarSign className="size-4 text-[#29C454]" aria-hidden="true" />
          Ticket médio: <strong className="text-ink">R$ 478,7 mil</strong>
        </p>
        <button
          type="button"
          className="dashboard-card-action inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-[13px] font-bold text-[#29C454] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          <span className="dashboard-card-action__full">Ver histórico completo</span>
          <span className="dashboard-card-action__short">Ver histórico</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </Panel>
  );
}
