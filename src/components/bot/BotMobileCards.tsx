import { Link } from "@tanstack/react-router";
import { Activity, ArrowRight, Bot, CalendarDays, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/dash2/BotPrimitives";
import type { Dispute } from "@/lib/bid-bot-fixtures";
import { disputeStatusTone } from "@/lib/bot-status";

export function MobileDisputeCards({ items }: { items: Dispute[] }) {
  if (items.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-[14px] text-slate-text lg:hidden">
        Nenhuma disputa encontrada para os filtros selecionados.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-hairline lg:hidden">
      {items.map((dispute) => (
        <li key={dispute.id} className="px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#29C454]/15 bg-[#29C454]/10 text-[#15943a]">
                <Bot className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-bold leading-snug text-ink">{dispute.agency}</p>
                <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-slate-text">
                  {dispute.object}
                </p>
              </div>
            </div>
            <StatusPill tone={disputeStatusTone(dispute.status)} className="shrink-0 text-[11px]">
              {dispute.status}
            </StatusPill>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-slate-text">
            <span>{dispute.notice}</span>
            <span>UASG {dispute.uasg}</span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                Sessão
              </dt>
              <dd className="mt-1 text-[13px] font-semibold text-ink">{dispute.date}</dd>
            </div>
            <div className="text-right">
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                Estimado
              </dt>
              <dd className="tnum mt-1 text-[13px] font-bold text-ink">{dispute.estimatedValue}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                Itens
              </dt>
              <dd className="tnum mt-1 text-[13px] font-semibold text-ink">
                {dispute.items} {dispute.items === 1 ? "item" : "itens"}
              </dd>
            </div>
            <div className="text-right">
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                Lances
              </dt>
              <dd className="tnum mt-1 text-[13px] font-semibold text-ink">{dispute.bids}</dd>
            </div>
          </dl>

          <Button
            variant="outline"
            className="mt-4 min-h-11 w-full rounded-xl border-hairline bg-white shadow-none hover:bg-slate-50"
            asChild
          >
            <Link to="/bot-lances/disputas/$disputeId" params={{ disputeId: dispute.id }}>
              Abrir disputa
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </li>
      ))}
    </ul>
  );
}

type MonitoringItem = {
  name: string;
  scope: string;
  frequency: string;
  checks: string;
  state: "Monitorando" | "Pausado";
};

export function MobileMonitoringCards({ items }: { items: MonitoringItem[] }) {
  return (
    <ul className="divide-y divide-hairline lg:hidden">
      {items.map((item) => (
        <li key={item.name} className="px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[14px] font-bold leading-snug text-ink">{item.name}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-text">{item.scope}</p>
            </div>
            <StatusPill
              tone={item.state === "Monitorando" ? "brand" : "neutral"}
              className="shrink-0 text-[11px]"
            >
              <Activity className="size-3" aria-hidden="true" />
              {item.state}
            </StatusPill>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                Intervalo
              </dt>
              <dd className="tnum mt-1 text-[14px] font-bold text-ink">{item.frequency}</dd>
            </div>
            <div className="text-right">
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                Verificações
              </dt>
              <dd className="tnum mt-1 text-[14px] font-bold text-ink">{item.checks}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

type ReportRow = {
  period: string;
  disputes: number;
  bids: number;
  wins: number;
  savings: string;
};

export function MobileReportCards({ items }: { items: ReportRow[] }) {
  return (
    <ul className="divide-y divide-hairline lg:hidden">
      {items.map((item) => (
        <li key={item.period} className="px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl border border-[#29C454]/15 bg-[#29C454]/10 text-[#15943a]">
                <CalendarDays className="size-4" aria-hidden="true" />
              </span>
              <p className="text-[15px] font-bold text-ink">{item.period}</p>
            </div>
            <StatusPill tone="brand" className="text-[11px]">
              <Trophy className="size-3" aria-hidden="true" />
              {item.wins} vitórias
            </StatusPill>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                Disputas
              </dt>
              <dd className="tnum mt-1 text-[14px] font-bold text-ink">{item.disputes}</dd>
            </div>
            <div className="text-right">
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                Lances
              </dt>
              <dd className="tnum mt-1 text-[14px] font-bold text-ink">{item.bids}</dd>
            </div>
            <div className="col-span-2 border-t border-hairline pt-3">
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                Economia gerada
              </dt>
              <dd className="tnum mt-1 text-[15px] font-bold text-[#15943a]">{item.savings}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

type HistoryRow = {
  id: string;
  date: string;
  dispute: string;
  result: "Vencemos" | "Perdemos" | "Cancelada";
  ourBid: string;
  bids: number;
};

function historyTone(result: HistoryRow["result"]) {
  if (result === "Vencemos") return "brand" as const;
  if (result === "Perdemos") return "warn" as const;
  return "neutral" as const;
}

export function MobileHistoryCards({ items }: { items: HistoryRow[] }) {
  if (items.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-[14px] text-slate-text lg:hidden">
        Nenhum registro encontrado.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-hairline lg:hidden">
      {items.map((item) => (
        <li key={item.id} className="px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[14px] font-bold leading-snug text-ink">{item.dispute}</p>
              <p className="mt-1 text-[12px] text-slate-text">{item.date}</p>
            </div>
            <StatusPill tone={historyTone(item.result)} className="shrink-0 text-[11px]">
              {item.result}
            </StatusPill>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                Nosso lance
              </dt>
              <dd className="tnum mt-1 text-[14px] font-bold text-ink">{item.ourBid}</dd>
            </div>
            <div className="text-right">
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                Lances
              </dt>
              <dd className="tnum mt-1 text-[14px] font-bold text-ink">{item.bids}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
