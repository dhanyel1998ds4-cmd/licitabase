import { ArrowRight, Clock3, Gavel, Radio, Trophy } from "lucide-react";
import { disputes, disputeCounts, disputePerformance } from "@/lib/bid-bot-fixtures";
import { cn } from "@/lib/utils";
import { Panel, PanelHeader } from "./Panel";
import { MobilePagedList } from "./MobilePagedList";

type LiveStatus = "Ganhando" | "Monitorando" | "Atenção";

type LiveBid = {
  id: string;
  agency: string;
  notice: string;
  object: string;
  currentBid: string;
  position: string;
  status: LiveStatus;
  updated: string;
  bids: string;
};

const statusStyles: Record<LiveStatus, string> = {
  Ganhando: "border-[#29C454]/20 bg-[#29C454]/10 text-[#16863A]",
  Monitorando: "border-blue-100 bg-blue-50 text-blue-700",
  Atenção: "border-orange-100 bg-orange-50 text-orange-700",
};

const liveStatuses: LiveStatus[] = ["Ganhando", "Monitorando", "Atenção"];
const livePositions = [disputePerformance.position, "3º", "2º"];
const liveUpdates = ["há 8s", "há 16s", "há 24s"];

const liveBids: LiveBid[] = disputes
  .filter((dispute) => dispute.status === "Ativa")
  .slice(0, 3)
  .map((dispute, index) => ({
    id: dispute.id,
    agency: dispute.agency,
    notice: dispute.notice,
    object: dispute.object,
    currentBid: index === 0 ? disputePerformance.ourBid : dispute.estimatedValue,
    position: livePositions[index] ?? "—",
    status: liveStatuses[index] ?? "Monitorando",
    updated: liveUpdates[index] ?? "agora",
    bids: dispute.bids,
  }));

export function LiveBidsCard() {
  const renderBid = (bid: LiveBid) => (
    <article
      key={bid.id}
      className={cn(
        "dashboard-bid-row dashboard-live-row group relative min-w-0",
        bid.status === "Ganhando" && "dashboard-live-row--winning",
        bid.status === "Monitorando" && "dashboard-live-row--watching",
        bid.status === "Atenção" && "dashboard-live-row--attention",
      )}
    >
      <button
        type="button"
        aria-label={`Acompanhar ${bid.notice} ao vivo`}
        className="dashboard-bid-row__target absolute inset-0 z-10 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
      />

      <div className="dashboard-bid-copy min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-text">
            <Gavel className="size-3.5 text-[#29C454]" aria-hidden="true" />
            {bid.notice}
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

      <div className="dashboard-bid-metrics dashboard-live-metrics">
        <div className="dashboard-bid-metric text-center">
          <p className="dashboard-bid-metric__label text-[10px] font-bold uppercase tracking-wide text-slate-text">
            Posição
          </p>
          <p
            className={cn(
              "mt-0.5 text-[14px] font-bold",
              bid.position === "1º" ? "text-[#29C454]" : "text-ink",
            )}
          >
            {bid.position}
          </p>
        </div>
        <div className="dashboard-bid-metric text-right" aria-live="polite" aria-atomic="true">
          <p className="dashboard-bid-metric__label text-[10px] font-bold uppercase tracking-wide text-slate-text">
            Lance atual
          </p>
          <p className="mt-0.5 truncate text-[12px] font-bold text-ink tabular-nums">
            {bid.currentBid}
          </p>
          <p className="mt-0.5 flex items-center justify-end gap-1 text-[10px] font-semibold text-slate-text">
            <Clock3 className="size-3" aria-hidden="true" />
            {bid.updated} · {bid.bids} lances
          </p>
        </div>
        <span className="dashboard-bid-arrow" aria-hidden="true">
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );

  return (
    <Panel className="dashboard-detail-panel flex min-w-0 flex-col border-[#29C454]/20 bg-[linear-gradient(145deg,rgba(239,252,243,0.98),rgba(255,255,255,0.96)_44%,rgba(247,253,249,0.98))] p-4 sm:p-6">
      <PanelHeader
        icon={
          <div className="relative rounded-lg bg-[#29C454]/10 p-1.5">
            <Radio className="size-5 text-[#29C454]" strokeWidth={2} aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full border-2 border-white bg-red-500 motion-safe:animate-pulse" />
          </div>
        }
        title="Ao vivo — em andamento"
        subtitle="Acompanhe licitações, posições e lances atualizados em tempo real."
        action={
          <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 text-[12px] font-bold text-red-700">
            <span
              className="size-2 rounded-full bg-red-500 motion-safe:animate-pulse"
              aria-hidden="true"
            />
            {disputeCounts.ativas} ao vivo
          </span>
        }
      />

      <div className="dashboard-live-summary mt-4 grid grid-cols-3 gap-1.5 rounded-xl border border-[#29C454]/15 bg-white/70 p-2 sm:mt-6 sm:gap-2 sm:p-2.5">
        <div className="dashboard-live-summary__item rounded-lg bg-white p-2 text-center shadow-sm sm:p-2.5">
          <p className="text-[18px] font-bold leading-none text-[#29C454]">1</p>
          <p className="mt-1 text-[11px] font-semibold text-slate-text">Ganhando</p>
        </div>
        <div className="dashboard-live-summary__item rounded-lg bg-white p-2 text-center shadow-sm sm:p-2.5">
          <p className="text-[18px] font-bold leading-none text-blue-600">1</p>
          <p className="mt-1 text-[11px] font-semibold text-slate-text">Monitorando</p>
        </div>
        <div className="dashboard-live-summary__item rounded-lg bg-white p-2 text-center shadow-sm sm:p-2.5">
          <p className="text-[18px] font-bold leading-none text-orange-600">1</p>
          <p className="mt-1 text-[11px] font-semibold text-slate-text">
            <span className="dashboard-live-label__full">Com atenção</span>
            <span className="dashboard-live-label__short">Atenção</span>
          </p>
        </div>
      </div>

      <div className="dashboard-bid-list mt-3 border-y border-hairline sm:mt-4">
        <MobilePagedList
          items={liveBids}
          renderItem={renderBid}
          getKey={(bid) => bid.id}
          ariaLabel="Licitações em andamento"
          pageHasAttention={(items) => items.some((bid) => bid.status === "Atenção")}
        />
        <div className="hidden divide-y divide-hairline md:block">{liveBids.map(renderBid)}</div>
      </div>

      <div className="dashboard-detail-footer mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 sm:gap-3 sm:pt-4">
        <p className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-text">
          <Trophy className="size-4 text-[#29C454]" aria-hidden="true" />
          Melhor posição atual: <strong className="text-[#16863A]">1º lugar</strong>
        </p>
        <button
          type="button"
          className="dashboard-card-action inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-[13px] font-bold text-[#29C454] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          <span className="dashboard-card-action__full">Ver todas ao vivo</span>
          <span className="dashboard-card-action__short">Ver todas</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </Panel>
  );
}
