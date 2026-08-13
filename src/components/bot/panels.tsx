import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { StatusPill, type StatusVisual } from "@/components/bot/StatusPill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Dispute } from "@/lib/bid-bot-fixtures";
import { disputeItems, disputeRanking, disputeTimeline } from "@/lib/bid-bot-fixtures";
import { disputeStatusTone } from "@/lib/bot-status";

/** Key/value list used for "Configuração ativa" and "Configuração do bot". */
export function ConfigList({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="space-y-4">
      {rows.map((row) => (
        <div key={row.label} className="flex items-start justify-between gap-4">
          <dt className="text-[12px] font-medium text-slate-text">{row.label}</dt>
          <dd className="text-[13px] font-bold text-navy">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function DisputeRowContent({ dispute: d, visual }: { dispute: Dispute; visual: StatusVisual }) {
  return (
    <>
      <div className="md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-tint">
              <Bot className="size-4 text-brand-strong" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-bold leading-snug text-navy">{d.agency}</p>
              <p className="mt-1 text-[13px] leading-snug text-slate-text">{d.object}</p>
            </div>
          </div>
          <StatusPill
            tone={disputeStatusTone(d.status)}
            visual={visual}
            className="shrink-0 text-[11px]"
          >
            {d.status}
          </StatusPill>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 px-3 py-3">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
              Sessão
            </dt>
            <dd className="mt-1 text-[13px] font-semibold text-navy">{d.date}</dd>
          </div>
          <div className="text-right">
            <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
              Estimado
            </dt>
            <dd className="tnum mt-1 text-[13px] font-bold text-navy">{d.estimatedValue}</dd>
          </div>
        </dl>
      </div>
      <div className="hidden items-center gap-4 md:flex">
        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-tint">
          <Bot className="size-4 text-brand-strong" aria-hidden="true" />
        </div>
        <div className="min-w-[40%] flex-1">
          <p className="truncate text-[13px] font-bold text-navy">{d.agency}</p>
          <p className="truncate text-[12px] text-slate-text/90">{d.object}</p>
        </div>
        <span className="w-24 shrink-0 text-[12px] text-slate-text">{d.date}</span>
        <StatusPill tone={disputeStatusTone(d.status)} visual={visual}>
          {d.status}
        </StatusPill>
        <span className="tnum hidden w-36 shrink-0 text-right text-[13px] font-bold text-navy lg:block">
          {d.estimatedValue}
        </span>
      </div>
    </>
  );
}

/** List of disputes. When `linked` is false rows are static (used on the landing page). */
export function DisputeList({
  items,
  linked = true,
  visual = "legacy",
}: {
  items: Dispute[];
  linked?: boolean;
  visual?: StatusVisual;
}) {
  return (
    <ul className="divide-y divide-border/50">
      {items.map((d) => {
        const inner = <DisputeRowContent dispute={d} visual={visual} />;
        return (
          <li key={d.id}>
            {linked ? (
              <Link
                to="/bot-lances/disputas/$disputeId"
                params={{ disputeId: d.id }}
                className="block px-4 py-4 transition-colors hover:bg-[#F8FAFC] sm:px-6"
              >
                {inner}
              </Link>
            ) : (
              <div className="block px-4 py-4 sm:px-6">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function DisputeItemsTable({
  items = disputeItems,
  visual = "legacy",
}: {
  items?: typeof disputeItems;
  visual?: StatusVisual;
}) {
  return (
    <>
      <ul
        className={cn("divide-y divide-border/60", visual === "dash2" ? "lg:hidden" : "md:hidden")}
      >
        {items.map((item) => (
          <li key={item.number} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-navy">Item {item.number}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-text">
                  {item.description}
                </p>
              </div>
              <StatusPill tone="brand" visual={visual} className="shrink-0 text-[11px]">
                {item.position}
              </StatusPill>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                  Nosso lance
                </dt>
                <dd className="tnum mt-1 text-[14px] font-bold text-navy">{item.ourBid}</dd>
                <dd className="text-[11px] text-slate-text">{item.ourBidAt}</dd>
              </div>
              <div className="text-right">
                <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                  Melhor lance
                </dt>
                <dd className="tnum mt-1 text-[14px] font-bold text-navy">{item.bestBid}</dd>
                <dd className="text-[11px] text-slate-text">{item.bestBidAt}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                  Desconto
                </dt>
                <dd className="tnum mt-1 text-[13px] font-bold text-warn">{item.discount}</dd>
              </div>
              <div className="text-right">
                <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                  Atividade
                </dt>
                <dd className="mt-1 text-[13px] font-semibold text-navy">
                  {item.bids} lances · {item.checks}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <div
        className={cn(
          "hidden w-full overflow-x-auto",
          visual === "dash2" ? "lg:block" : "md:block",
        )}
      >
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-[11px] md:text-[12px]">Item</TableHead>
              <TableHead className="text-right text-[11px] md:text-[12px]">Nosso lance</TableHead>
              <TableHead className="text-right text-[11px] md:text-[12px] hidden sm:table-cell">
                Melhor lance
              </TableHead>
              <TableHead className="text-right text-[11px] md:text-[12px] hidden md:table-cell">
                Desconto
              </TableHead>
              <TableHead className="text-right text-[11px] md:text-[12px] hidden md:table-cell">
                Lances
              </TableHead>
              <TableHead className="text-right text-[11px] md:text-[12px]">Posição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.number}>
                <TableCell className="max-w-[200px] md:max-w-[360px]">
                  <p className="text-[12px] md:text-[13px] font-bold text-navy">
                    Item {item.number}
                  </p>
                  <p className="text-[11px] md:text-[12px] text-slate-text/90 line-clamp-1">
                    {item.description}
                  </p>
                  <p className="mt-1 text-[10px] md:text-[11px] text-slate-text/70 hidden sm:block">
                    {item.checks}
                  </p>
                </TableCell>
                <TableCell className="tnum text-right text-[12px] md:text-[13px] font-bold text-navy">
                  {item.ourBid}
                  <span className="block text-[10px] md:text-[11px] font-medium text-slate-text/70">
                    {item.ourBidAt}
                  </span>
                </TableCell>
                <TableCell className="tnum text-right text-[12px] md:text-[13px] text-navy hidden sm:table-cell">
                  {item.bestBid}
                  <span className="block text-[10px] md:text-[11px] text-slate-text/70">
                    {item.bestBidAt}
                  </span>
                </TableCell>
                <TableCell className="tnum text-right text-[12px] md:text-[13px] text-warn hidden md:table-cell">
                  {item.discount}
                </TableCell>
                <TableCell className="tnum text-right text-[12px] md:text-[13px] text-navy hidden md:table-cell">
                  {item.bids}
                </TableCell>
                <TableCell className="text-right">
                  <StatusPill
                    tone="brand"
                    visual={visual}
                    className="px-2 py-0.5 text-[10px] md:text-[12px]"
                  >
                    {item.position}
                  </StatusPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export function SupplierRankingTable({
  rows = disputeRanking,
  visual = "legacy",
}: {
  rows?: typeof disputeRanking;
  visual?: StatusVisual;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full min-w-0">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 md:w-14 text-[11px] md:text-[12px]">#</TableHead>
            <TableHead className="text-[11px] md:text-[12px]">Fornecedor</TableHead>
            <TableHead className="text-[11px] md:text-[12px] hidden sm:table-cell">UF</TableHead>
            <TableHead className="text-[11px] md:text-[12px] hidden md:table-cell">Porte</TableHead>
            <TableHead className="text-right text-[11px] md:text-[12px]">Lance</TableHead>
            <TableHead className="text-right text-[11px] md:text-[12px] hidden sm:table-cell">
              Variação
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.pos} className={cn(row.you && "bg-brand-tint/60")}>
              <TableCell className="tnum text-[12px] md:text-[13px] font-bold text-navy">
                {row.pos}º
              </TableCell>
              <TableCell className="min-w-0 text-[12px] text-navy md:text-[13px]">
                <span className="block max-w-[145px] truncate min-[420px]:max-w-[190px] md:max-w-none">
                  {row.supplier}
                </span>
                {row.you && (
                  <StatusPill
                    tone="brand"
                    visual={visual}
                    className="mt-1 px-1.5 py-0 text-[10px] md:ml-2 md:mt-0"
                  >
                    Você
                  </StatusPill>
                )}
              </TableCell>
              <TableCell className="text-[11px] md:text-[12px] text-slate-text hidden sm:table-cell">
                {row.uf}
              </TableCell>
              <TableCell className="text-[11px] md:text-[12px] text-slate-text hidden md:table-cell">
                {row.type}
              </TableCell>
              <TableCell className="tnum text-right text-[12px] md:text-[13px] font-bold text-navy">
                {row.bid}
              </TableCell>
              <TableCell className="tnum text-right text-[12px] md:text-[13px] text-slate-text hidden sm:table-cell">
                {row.delta || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function DisputeTimelineList({
  events = disputeTimeline,
}: {
  events?: typeof disputeTimeline;
}) {
  return (
    <ol className="divide-y divide-border/50">
      {events.map((ev, index) => (
        <li key={`${ev.time}-${index}`} className="flex gap-2 px-4 py-4 md:gap-4 md:px-6">
          <span className="tnum w-12 md:w-16 shrink-0 text-[11px] md:text-[12px] font-bold text-slate-text">
            {ev.time}
          </span>
          <span
            className={cn(
              "mt-1.5 size-1.5 md:size-2 shrink-0 rounded-full",
              ev.kind === "Nosso lance" && "bg-brand",
              ev.kind === "Preço caiu" && "bg-warn",
              ev.kind === "Monitorando" && "bg-info",
              (ev.kind === "Sessão" || ev.kind === "Fase" || ev.kind === "Sistema") && "bg-navy/30",
            )}
          />
          <div className="min-w-0 flex-1">
            <p className="break-words text-[13px] font-bold text-navy">{ev.event}</p>
            <p className="break-words text-[12px] leading-relaxed text-slate-text">{ev.detail}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-text/80">{ev.note}</p>
          </div>
          <div className="max-w-[112px] shrink-0 text-right sm:max-w-none">
            <p className="tnum break-words text-[12px] font-bold text-navy md:text-[13px]">
              {ev.value}
            </p>
            <p className="text-[11px] text-slate-text">{ev.status}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Small chrome wrapper so app screens can be embedded on marketing pages. */
export function ScreenFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#F8FAFC] shadow-2xl">
      <div className="flex items-center gap-2 border-b border-black/5 bg-white px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#FF5F57]" />
        <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="size-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-3 truncate text-[11px] font-bold text-slate-text">{label}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
