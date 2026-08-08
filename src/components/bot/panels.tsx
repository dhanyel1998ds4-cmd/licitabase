import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { StatusPill, disputeStatusTone } from "@/components/bot/StatusPill";
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

function DisputeRowContent({ dispute: d }: { dispute: Dispute }) {
  return (
    <>
      <div className="grid size-7 md:size-9 shrink-0 place-items-center rounded-lg md:rounded-xl bg-brand-tint">
        <Bot className="size-3 md:size-4 text-brand-strong" aria-hidden="true" />
      </div>
      <div className="min-w-[40%] flex-1">
        <p className="truncate text-[12px] md:text-[13px] font-bold text-navy">{d.agency}</p>
        <p className="truncate text-[11px] md:text-[12px] text-slate-text/90">{d.object}</p>
      </div>
      <span className="hidden sm:block w-20 md:w-24 shrink-0 text-[11px] md:text-[12px] text-slate-text">{d.date}</span>
      <StatusPill tone={disputeStatusTone(d.status)} className="text-[10px] md:text-[12px] px-2 py-0.5">{d.status}</StatusPill>
      <span className="tnum hidden lg:block w-32 md:w-36 shrink-0 text-right text-[12px] md:text-[13px] font-bold text-navy">
        {d.estimatedValue}
      </span>
    </>
  );
}

/** List of disputes. When `linked` is false rows are static (used on the landing page). */
export function DisputeList({
  items,
  linked = true,
}: {
  items: Dispute[];
  linked?: boolean;
}) {
  return (
    <ul className="divide-y divide-border/50">
      {items.map((d) => {
        const inner = <DisputeRowContent dispute={d} />;
        return (
          <li key={d.id}>
            {linked ? (
              <Link
                to="/bot-lances/disputas/$disputeId"
                params={{ disputeId: d.id }}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#F8FAFC]"
              >
                {inner}
              </Link>
            ) : (
              <div className="flex items-center gap-4 px-6 py-4">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function DisputeItemsTable({ items = disputeItems }: { items?: typeof disputeItems }) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[600px] md:min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-[11px] md:text-[12px]">Item</TableHead>
            <TableHead className="text-right text-[11px] md:text-[12px]">Nosso lance</TableHead>
            <TableHead className="text-right text-[11px] md:text-[12px] hidden sm:table-cell">Melhor lance</TableHead>
            <TableHead className="text-right text-[11px] md:text-[12px] hidden md:table-cell">Desconto</TableHead>
            <TableHead className="text-right text-[11px] md:text-[12px] hidden md:table-cell">Lances</TableHead>
            <TableHead className="text-right text-[11px] md:text-[12px]">Posição</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.number}>
              <TableCell className="max-w-[200px] md:max-w-[360px]">
                <p className="text-[12px] md:text-[13px] font-bold text-navy">Item {item.number}</p>
                <p className="text-[11px] md:text-[12px] text-slate-text/90 line-clamp-1">{item.description}</p>
                <p className="mt-1 text-[10px] md:text-[11px] text-slate-text/70 hidden sm:block">{item.checks}</p>
              </TableCell>
              <TableCell className="tnum text-right text-[12px] md:text-[13px] font-bold text-navy">
                {item.ourBid}
                <span className="block text-[10px] md:text-[11px] font-medium text-slate-text/70">{item.ourBidAt}</span>
              </TableCell>
              <TableCell className="tnum text-right text-[12px] md:text-[13px] text-navy hidden sm:table-cell">
                {item.bestBid}
                <span className="block text-[10px] md:text-[11px] text-slate-text/70">{item.bestBidAt}</span>
              </TableCell>
              <TableCell className="tnum text-right text-[12px] md:text-[13px] text-warn hidden md:table-cell">{item.discount}</TableCell>
              <TableCell className="tnum text-right text-[12px] md:text-[13px] text-navy hidden md:table-cell">{item.bids}</TableCell>
              <TableCell className="text-right">
                <StatusPill tone="brand" className="text-[10px] md:text-[12px] px-2 py-0.5">{item.position}</StatusPill>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function SupplierRankingTable({ rows = disputeRanking }: { rows?: typeof disputeRanking }) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[450px] md:min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 md:w-14 text-[11px] md:text-[12px]">#</TableHead>
            <TableHead className="text-[11px] md:text-[12px]">Fornecedor</TableHead>
            <TableHead className="text-[11px] md:text-[12px] hidden sm:table-cell">UF</TableHead>
            <TableHead className="text-[11px] md:text-[12px] hidden md:table-cell">Porte</TableHead>
            <TableHead className="text-right text-[11px] md:text-[12px]">Lance</TableHead>
            <TableHead className="text-right text-[11px] md:text-[12px] hidden sm:table-cell">Variação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.pos} className={cn(row.you && "bg-brand-tint/60")}>
              <TableCell className="tnum text-[12px] md:text-[13px] font-bold text-navy">{row.pos}º</TableCell>
              <TableCell className="text-[12px] md:text-[13px] text-navy">
                <span className="truncate block max-w-[120px] md:max-w-none">{row.supplier}</span>
                {row.you && (
                  <StatusPill tone="brand" className="mt-1 md:mt-0 md:ml-2 text-[10px] px-1.5 py-0">
                    Você
                  </StatusPill>
                )}
              </TableCell>
              <TableCell className="text-[11px] md:text-[12px] text-slate-text hidden sm:table-cell">{row.uf}</TableCell>
              <TableCell className="text-[11px] md:text-[12px] text-slate-text hidden md:table-cell">{row.type}</TableCell>
              <TableCell className="tnum text-right text-[12px] md:text-[13px] font-bold text-navy">{row.bid}</TableCell>
              <TableCell className="tnum text-right text-[12px] md:text-[13px] text-slate-text hidden sm:table-cell">{row.delta || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function DisputeTimelineList({ events = disputeTimeline }: { events?: typeof disputeTimeline }) {
  return (
    <ol className="divide-y divide-border/50">
      {events.map((ev, index) => (
        <li key={`${ev.time}-${index}`} className="flex gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4">
          <span className="tnum w-12 md:w-16 shrink-0 text-[11px] md:text-[12px] font-bold text-slate-text">{ev.time}</span>
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
            <p className="text-[12px] md:text-[13px] font-bold text-navy truncate md:whitespace-normal">{ev.event}</p>
            <p className="text-[11px] md:text-[12px] text-slate-text/90 truncate md:whitespace-normal">{ev.detail}</p>
            <p className="mt-1 text-[10px] md:text-[11px] text-slate-text/70 hidden sm:block">{ev.note}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="tnum text-[12px] md:text-[13px] font-bold text-navy">{ev.value}</p>
            <p className="text-[10px] md:text-[11px] text-slate-text/70">{ev.status}</p>
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
