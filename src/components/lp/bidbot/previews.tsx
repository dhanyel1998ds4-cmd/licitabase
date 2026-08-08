import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock,
  PlayCircle,
  Search,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { MetricCard } from "@/components/bot/BotPageHeader";
import { StatusPill, disputeStatusTone } from "@/components/bot/StatusPill";
import { CardShell } from "@/components/shared/CardShell";
import {
  ConfigList,
  DisputeItemsTable,
  DisputeList,
  DisputeTimelineList,
  SupplierRankingTable,
} from "@/components/bot/panels";
import { bidBotMarketingDemoData as demo } from "@/lib/bid-bot-marketing-demo";
import { cn } from "@/lib/utils";

/** Wrapper that renders the real (light) dashboard surface in compact density. */
function PreviewSurface({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bidbot-preview-surface h-full bg-[#F8FAFC] p-4 font-sans overflow-y-auto custom-scrollbar",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BidBotOverviewPreview() {
  const { metrics, activeConfig, disputes } = demo.overview;
  return (
    <PreviewSurface className="p-3 md:p-4">
      <div className="flex items-center justify-between gap-3 mb-4 md:mb-6">
        <div>
          <p className="text-[8px] md:text-[9px] font-extrabold uppercase tracking-[0.2em] text-brand-strong/60">
            Bot de Lances
          </p>
          <h3 className="text-[13px] md:text-[15px] font-bold tracking-tight text-navy">
            Visão geral
          </h3>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-400 w-32 md:w-48">
          <Search className="size-3" aria-hidden="true" />
          <span className="truncate">Buscar...</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8">
        {metrics.slice(0, 4).map((m) => (
          <div
            key={m.label}
            className="flex flex-col rounded-xl border border-slate-100 bg-white p-2 md:p-3 shadow-sm"
          >
            <span className="text-[14px] md:text-[18px] font-bold text-navy tracking-tight">
              {m.value}
            </span>
            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              {m.label}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-1 md:col-span-5">
          <div className="rounded-xl md:rounded-2xl border border-slate-100 bg-white p-4 md:p-5 shadow-sm">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-brand-strong mb-3 md:mb-4">
              Configuração ativa
            </p>
            <ConfigList rows={activeConfig.slice(0, 5)} />
          </div>
        </div>
        <div className="col-span-1 md:col-span-7">
          <div className="rounded-xl md:rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="p-3 md:p-4 border-b border-slate-50">
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-navy">
                Últimas disputas
              </p>
            </div>
            <DisputeList items={disputes.slice(0, 3)} linked={false} />
          </div>
        </div>
      </div>
    </PreviewSurface>
  );
}

export function BidDisputeDetailPreview() {
  const { header, performance, botConfig, items } = demo.dispute;
  return (
    <PreviewSurface className="p-0 flex flex-col">
      <div className="p-4 md:p-6 border-b border-slate-100 bg-white">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {header.uasg} · {header.notice}
            </p>
            <h3 className="text-[16px] md:text-[20px] font-extrabold leading-tight tracking-tight text-navy">
              {header.agency}
            </h3>
            <p className="mt-2 text-[11px] md:text-[12px] font-medium text-slate-500 line-clamp-1">
              {header.title}
            </p>
          </div>
          <div className="flex sm:shrink-0 flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            <StatusPill
              tone="brand"
              className="px-2 md:px-3 py-1 text-[10px] md:text-[11px] font-bold uppercase tracking-wider"
            >
              EM ANDAMENTO
            </StatusPill>
            <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold text-brand-strong bg-brand-tint px-2 md:px-2.5 py-1 rounded-full border border-brand-strong/10">
              <Bot className="size-3" />
              BOT OPERANDO
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="rounded-xl border border-slate-100 p-3 md:p-4 bg-slate-50/30">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Posição
            </p>
            <p className="text-[20px] md:text-[28px] font-black text-brand-strong leading-none">
              {performance.position}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 p-3 md:p-4 bg-brand-tint/10">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Nosso lance
            </p>
            <p className="text-[16px] md:text-[22px] font-bold text-navy leading-none tracking-tight">
              {performance.ourBid}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 p-3 md:p-4">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Desconto
            </p>
            <p className="text-[16px] md:text-[22px] font-bold text-warn leading-none tracking-tight">
              {performance.discount}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 p-3 md:p-4">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Lances
            </p>
            <p className="text-[16px] md:text-[22px] font-bold text-navy leading-none tracking-tight">
              {performance.bidsGiven}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        <div className="hidden md:block col-span-4 p-6 border-r border-slate-100 bg-white">
          <p className="text-[11px] font-bold uppercase tracking-wider text-navy mb-5">
            Configuração do bot
          </p>
          <ConfigList rows={botConfig.slice(0, 6)} />
          <div className="mt-8 p-3.5 rounded-xl bg-brand-tint border border-brand-strong/10 flex items-center gap-3">
            <Bot className="size-4 text-brand-strong" />
            <p className="text-[11px] font-bold text-brand-strong">
              Sessão {performance.sessionStart}
            </p>
          </div>
        </div>
        <div className="col-span-1 md:col-span-8 p-0 bg-white overflow-hidden flex flex-col">
          <div className="px-4 md:px-6 py-4 border-b border-slate-50 flex items-center gap-4 md:gap-6">
            <span className="text-[11px] md:text-[12px] font-bold text-brand-strong border-b-2 border-brand-strong pb-4 -mb-4">
              Itens
            </span>
            <span className="text-[11px] md:text-[12px] font-bold text-slate-400 pb-4 -mb-4 cursor-not-allowed">
              Classificação
            </span>
            <span className="text-[11px] md:text-[12px] font-bold text-slate-400 pb-4 -mb-4 cursor-not-allowed">
              Timeline
            </span>
          </div>
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <DisputeItemsTable items={items} />
          </div>
        </div>
      </div>
    </PreviewSurface>
  );
}

function SessionInfo({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 text-slate-300" />
      <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-none">
          {label}
        </p>
        <p className="text-[12px] font-bold text-navy mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export function BidRankingPreview() {
  const { item, ourPosition, ourBid, bestBid, rows } = demo.ranking;
  return (
    <PreviewSurface className="p-0 flex flex-col">
      <div className="p-4 md:p-5 border-b border-slate-100 bg-white">
        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-brand-strong mb-1">
          Ranking
        </p>
        <h3 className="text-[13px] md:text-[15px] font-bold text-navy truncate">{item}</h3>
      </div>
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-white shadow-sm">
        <div className="p-3 md:p-4 text-center">
          <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Posição
          </p>
          <p className="text-[16px] md:text-[20px] font-black text-brand-strong">{ourPosition}</p>
        </div>
        <div className="p-3 md:p-4 text-center">
          <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Nosso lance
          </p>
          <p className="text-[14px] md:text-[18px] font-bold text-navy">{ourBid}</p>
        </div>
        <div className="p-3 md:p-4 text-center">
          <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Melhor
          </p>
          <p className="text-[14px] md:text-[18px] font-bold text-navy opacity-40">{bestBid}</p>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-white">
        <SupplierRankingTable rows={rows.slice(0, 10)} />
      </div>
    </PreviewSurface>
  );
}

export function BidTimelinePreview() {
  return (
    <PreviewSurface className="p-0">
      <div className="p-4 md:p-5 border-b border-slate-100 bg-white">
        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-brand-strong mb-1">
          Histórico
        </p>
        <h3 className="text-[13px] md:text-[15px] font-bold text-navy">Timeline da sessão</h3>
      </div>
      <div className="flex-1 overflow-auto bg-white">
        <DisputeTimelineList events={demo.timeline.events.slice(0, 8)} />
      </div>
    </PreviewSurface>
  );
}

export function BidBotOperationalSummaryPreview() {
  return (
    <PreviewSurface className="flex flex-col justify-center">
      <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-brand-strong mb-6 md:mb-8 text-center bg-brand-tint py-2 rounded-full border border-brand-strong/10 mx-4 md:mx-6">
        Resumo Operacional
      </p>
      <div className="grid grid-cols-2 gap-3 md:gap-4 px-4 md:px-6">
        {demo.operationalSummary.map((m) => (
          <div
            key={m.label}
            className="text-center p-3 md:p-5 rounded-2xl border border-slate-100 bg-white shadow-sm transition-transform hover:scale-[1.02]"
          >
            <p className="text-[18px] md:text-[24px] font-black text-navy leading-none tracking-tight">
              {m.value}
            </p>
            <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-2">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </PreviewSurface>
  );
}
