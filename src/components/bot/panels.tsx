import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bot,
  CircleDot,
  Radio,
  TrendingDown,
  Trophy,
} from "lucide-react";
import { useResizableColumns } from "@/components/dash2/ResizableColumns";
import { ResourceListGridHeader, ResourceListGridRow } from "@/components/dash2/ResourceList";
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
import type { Dispute, DisputeRankingRow } from "@/lib/bid-bot-fixtures";
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

const overviewDisputeColumns = [
  { id: "session", width: 104, min: 96, max: 168 },
  { id: "status", width: 104, min: 96, max: 164 },
  { id: "items", width: 58, min: 52, max: 104 },
  { id: "bids", width: 58, min: 52, max: 104 },
  { id: "value", width: 122, min: 112, max: 220 },
  { id: "action", width: 36, min: 32, max: 56 },
];

/**
 * A aba de itens vive dentro de uma coluna mais estreita da sala de disputa.
 * Por isso o item mantém uma largura mínima maior e os dados numéricos ocupam
 * trilhos compactos e estáveis, redimensionáveis no desktop amplo.
 */
const disputeItemColumns = [
  { id: "ourBid", width: 100, min: 86, max: 190 },
  { id: "bestBid", width: 100, min: 86, max: 190 },
  { id: "discount", width: 68, min: 58, max: 128 },
  { id: "bids", width: 52, min: 42, max: 100 },
  { id: "position", width: 52, min: 42, max: 104 },
];

const disputeItemLeadingColumn = { id: "item", width: 180, min: 156, max: 280 };

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
  const { gridTemplateColumns, getResizeHandleProps } = useResizableColumns({
    storageKey: "licitabase.bot-overview-disputes-widths.v1",
    columns: overviewDisputeColumns,
    leadingColumn: "minmax(230px, 1fr)",
  });

  const dashboardList = visual === "dash2";

  return (
    <div className="divide-y divide-border/50" role="list" aria-label="Últimas disputas do bot">
      {dashboardList ? (
        <ResourceListGridHeader
          gridTemplateColumns={gridTemplateColumns}
          className="px-4 py-3 sm:px-6"
        >
          <span className="relative">
            Licitação
            <button {...getResizeHandleProps("session")} aria-label="Redimensionar coluna Sessão" />
          </span>
          <span className="relative">
            Sessão
            <button {...getResizeHandleProps("status")} aria-label="Redimensionar coluna Status" />
          </span>
          <span className="relative">
            Status
            <button {...getResizeHandleProps("items")} aria-label="Redimensionar coluna Itens" />
          </span>
          <span className="relative text-right">
            Itens
            <button {...getResizeHandleProps("bids")} aria-label="Redimensionar coluna Lances" />
          </span>
          <span className="relative text-right">
            Lances
            <button
              {...getResizeHandleProps("value")}
              aria-label="Redimensionar coluna Valor estimado"
            />
          </span>
          <span className="relative text-right">
            Valor
            <button {...getResizeHandleProps("action")} aria-label="Redimensionar coluna Ação" />
          </span>
          <span className="sr-only">Ação</span>
        </ResourceListGridHeader>
      ) : null}
      {items.map((d) => {
        const inner = dashboardList ? (
          <>
            <div className="xl:hidden">
              <DisputeRowContent dispute={d} visual={visual} />
            </div>
            <div className="hidden min-w-0 items-center gap-3 xl:flex">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-tint">
                <Bot className="size-4 text-brand-strong" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-navy">{d.agency}</p>
                <p className="truncate text-[12px] text-slate-text/90">{d.object}</p>
              </div>
            </div>
            <span className="hidden text-[12px] text-slate-text xl:block">{d.date}</span>
            <div className="hidden xl:block">
              <StatusPill tone={disputeStatusTone(d.status)} visual={visual}>
                {d.status}
              </StatusPill>
            </div>
            <span className="tnum hidden whitespace-nowrap text-right text-[13px] font-semibold text-ink xl:block">
              {d.items} {d.items === 1 ? "item" : "itens"}
            </span>
            <span className="tnum hidden text-right text-[13px] text-ink xl:block">{d.bids}</span>
            <span className="tnum hidden whitespace-nowrap text-right text-[13px] font-bold text-ink xl:block">
              {d.estimatedValue}
            </span>
            <ArrowRight
              className="hidden size-4 justify-self-end text-slate-text/70 xl:block"
              aria-hidden="true"
            />
          </>
        ) : (
          <DisputeRowContent dispute={d} visual={visual} />
        );
        return (
          <div key={d.id} role="listitem">
            {linked ? (
              <Link
                to="/bot-lances/disputas/$disputeId"
                params={{ disputeId: d.id }}
                className={cn(
                  "block px-4 py-4 transition-colors hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#29C454] sm:px-6",
                  dashboardList && "xl:grid xl:items-center xl:gap-0",
                )}
                style={dashboardList ? { gridTemplateColumns } : undefined}
              >
                {inner}
              </Link>
            ) : (
              <div
                className={cn(
                  "block px-4 py-4 sm:px-6",
                  dashboardList && "xl:grid xl:items-center xl:gap-0",
                )}
                style={dashboardList ? { gridTemplateColumns } : undefined}
              >
                {inner}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DisputeItemsTable({
  items = disputeItems,
  visual = "legacy",
  activeItemNumber,
  onItemSelect,
  participatingItemNumbers,
}: {
  items?: (typeof disputeItems)[number][];
  visual?: StatusVisual;
  activeItemNumber?: number;
  onItemSelect?: (itemNumber: number) => void;
  participatingItemNumbers?: number[];
}) {
  const compactOnly = visual === "dash2";
  const selectable = Boolean(onItemSelect) && items.length > 1;
  // A terceira coluna da sala tem 320 px como mínimo. Só há espaço para uma
  // tabela de seis colunas em monitores ultrawide; abaixo disso, os cards
  // preservam o contexto de cada item sem criar rolagem horizontal.
  const desktopGridClassName = compactOnly ? "min-[2240px]:grid" : "md:grid";
  const desktopHiddenClassName = compactOnly ? "min-[2240px]:hidden" : "md:hidden";
  const { gridTemplateColumns, getResizeHandleProps } = useResizableColumns({
    // A tabela anterior não compartilhava a mesma grade entre cabeçalho e
    // linhas. A nova chave descarta larguras persistidas daquele layout.
    storageKey: `licitabase.bot-dispute-items-${visual}-widths.v2`,
    columns: disputeItemColumns,
    leadingColumn: disputeItemLeadingColumn,
  });

  return (
    <>
      <ul
        className={cn(
          "divide-y divide-border/60",
          desktopHiddenClassName,
        )}
      >
        {items.map((item) => {
          const participating = participatingItemNumbers?.includes(item.number) ?? true;
          return (
            <li
              key={item.number}
              className={cn(
                "px-4 py-4 transition-colors sm:px-5",
                !participating && "bg-slate-50/55 opacity-65",
                selectable &&
                  participating &&
                  "cursor-pointer hover:bg-[#29C454]/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#29C454]",
                activeItemNumber === item.number && "bg-[#29C454]/[0.07]",
              )}
              role={selectable && participating ? "button" : undefined}
              tabIndex={selectable && participating ? 0 : undefined}
              aria-current={activeItemNumber === item.number ? "true" : undefined}
              aria-disabled={!participating || undefined}
              onClick={selectable && participating ? () => onItemSelect?.(item.number) : undefined}
              onKeyDown={
                selectable && participating
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onItemSelect?.(item.number);
                      }
                    }
                  : undefined
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-bold text-navy">Item {item.number}</p>
                    {!participating ? (
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-text">
                        Fora da participação
                      </span>
                    ) : null}
                  </div>
                  <p
                    className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-slate-text"
                    title={item.description}
                  >
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
                  <dd className="tnum mt-1 whitespace-nowrap text-[14px] font-bold text-navy">
                    {keepCurrencyTogether(item.ourBid)}
                  </dd>
                  <dd className="whitespace-nowrap text-[11px] text-slate-text">{item.ourBidAt}</dd>
                </div>
                <div className="text-right">
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                    Melhor lance
                  </dt>
                  <dd className="tnum mt-1 whitespace-nowrap text-[14px] font-bold text-navy">
                    {keepCurrencyTogether(item.bestBid)}
                  </dd>
                  <dd className="whitespace-nowrap text-[11px] text-slate-text">
                    {item.bestBidAt}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                    Desconto
                  </dt>
                  <dd className="tnum mt-1 whitespace-nowrap text-[13px] font-bold text-warn">
                    {item.discount}
                  </dd>
                </div>
                <div className="text-right">
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                    Atividade
                  </dt>
                  <dd className="mt-1 whitespace-nowrap text-[13px] font-semibold text-navy">
                    {item.bids} lances · {item.checks}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
      <div className={cn("hidden", desktopGridClassName)} role="table" aria-label="Itens em disputa">
        <ResourceListGridHeader
          gridTemplateColumns={gridTemplateColumns}
          className={cn("gap-2 px-4 py-3 sm:px-5", !compactOnly && "md:!grid")}
        >
          <span className="relative">
            Item
            <button {...getResizeHandleProps("item")} aria-label="Redimensionar coluna Item" />
          </span>
          <span className="relative text-right">
            Nosso lance
            <button {...getResizeHandleProps("ourBid")} aria-label="Redimensionar coluna Nosso lance" />
          </span>
          <span className="relative text-right">
            Melhor lance
            <button {...getResizeHandleProps("bestBid")} aria-label="Redimensionar coluna Melhor lance" />
          </span>
          <span className="relative text-right">
            Desconto
            <button {...getResizeHandleProps("discount")} aria-label="Redimensionar coluna Desconto" />
          </span>
          <span className="relative text-right">
            Lances
            <button {...getResizeHandleProps("bids")} aria-label="Redimensionar coluna Lances" />
          </span>
          <span className="text-right">Posição</span>
        </ResourceListGridHeader>
        <div className="divide-y divide-border/60" role="rowgroup">
          {items.map((item) => {
            const participating = participatingItemNumbers?.includes(item.number) ?? true;
            return (
              <ResourceListGridRow
                key={item.number}
                gridTemplateColumns={gridTemplateColumns}
                className={cn(
                  "min-h-[78px] gap-2 px-4 py-3.5 sm:px-5",
                  !participating && "bg-slate-50/55 text-slate-text",
                  selectable &&
                    participating &&
                    "cursor-pointer hover:bg-[#29C454]/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#29C454]",
                  activeItemNumber === item.number && "bg-[#29C454]/[0.07]",
                )}
                role="row"
                tabIndex={selectable && participating ? 0 : undefined}
                aria-current={activeItemNumber === item.number ? "true" : undefined}
                aria-disabled={!participating || undefined}
                onClick={
                  selectable && participating ? () => onItemSelect?.(item.number) : undefined
                }
                onKeyDown={
                  selectable && participating
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onItemSelect?.(item.number);
                        }
                      }
                    : undefined
                }
              >
                <div className="min-w-0 pr-2" role="cell">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[12px] font-bold text-navy md:text-[13px]">Item {item.number}</p>
                    {!participating ? (
                      <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-text">
                        Fora da participação
                      </span>
                    ) : null}
                  </div>
                  <p
                    className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-text/90 md:text-[12px]"
                    title={item.description}
                  >
                    {item.description}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-text/70 md:text-[11px]">{item.checks}</p>
                </div>
                <div className="tnum min-w-0 whitespace-nowrap text-right text-[12px] font-bold text-navy md:text-[13px]" role="cell">
                  {keepCurrencyTogether(item.ourBid)}
                  <span className="block whitespace-nowrap text-[10px] font-medium text-slate-text/70 md:text-[11px]">
                    {item.ourBidAt}
                  </span>
                </div>
                <div className="tnum min-w-0 whitespace-nowrap text-right text-[12px] text-navy md:text-[13px]" role="cell">
                  {keepCurrencyTogether(item.bestBid)}
                  <span className="block whitespace-nowrap text-[10px] text-slate-text/70 md:text-[11px]">
                    {item.bestBidAt}
                  </span>
                </div>
                <div className="tnum min-w-0 whitespace-nowrap text-right text-[12px] text-warn md:text-[13px]" role="cell">
                  {item.discount}
                </div>
                <div className="tnum min-w-0 whitespace-nowrap text-right text-[12px] text-navy md:text-[13px]" role="cell">
                  {item.bids}
                </div>
                <div className="text-right" role="cell">
                  <StatusPill tone="brand" visual={visual} className="px-2 py-0.5 text-[10px] md:text-[12px]">
                    {item.position}
                  </StatusPill>
                </div>
              </ResourceListGridRow>
            );
          })}
        </div>
      </div>
    </>
  );
}

function keepCurrencyTogether(value: string) {
  return value.replace(/^R\$\s*/, "R$\u00a0");
}

function RankingPosition({ position }: { position: number }) {
  const medal = {
    1: "border-amber-200 bg-amber-50 text-amber-600",
    2: "border-slate-200 bg-slate-100 text-slate-500",
    3: "border-orange-200 bg-orange-50 text-orange-700",
  }[position];

  if (!medal) {
    return (
      <span className="tnum text-[12px] font-bold text-navy md:text-[13px]">
        {position}
        {"\u00ba"}
      </span>
    );
  }

  return (
    <span
      aria-label={`${position}\u00aa posi\u00e7\u00e3o`}
      title={`${position}\u00aa posi\u00e7\u00e3o`}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-full border text-[11px] font-extrabold shadow-sm",
        medal,
      )}
    >
      <Trophy className="size-3.5" aria-hidden="true" />
      <span className="sr-only">
        {position}
        {"\u00ba"} lugar
      </span>
    </span>
  );
}

function RankingMovement({ row }: { row: DisputeRankingRow }) {
  if (!row.movement || !row.movementLabel) return null;

  const improved = row.movement === "up";
  const Icon = row.movement === "updated" ? CircleDot : improved ? ArrowUp : ArrowDown;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold",
        improved
          ? "bg-[#29C454]/10 text-[#15943a]"
          : row.movement === "updated"
            ? "bg-blue-50 text-blue-700"
            : "bg-orange-50 text-orange-700",
      )}
    >
      <Icon className="size-2.5" aria-hidden="true" />
      {row.movementLabel}
    </span>
  );
}

function rankingVariationTone(delta: string) {
  if (delta.startsWith("+")) return "text-[#15943a]";
  if (delta.startsWith("-")) return "text-rose-600";
  return "text-slate-text";
}

export function SupplierRankingTable({
  rows = disputeRanking,
  visual = "legacy",
}: {
  rows?: DisputeRankingRow[];
  visual?: StatusVisual;
}) {
  const compactOnly = visual === "dash2";

  return (
    <>
      <ul
        className={cn(
          "divide-y divide-border/60",
          compactOnly ? "min-[1680px]:hidden" : "md:hidden",
        )}
      >
        {rows.map((row) => (
          <li
            key={row.id ?? row.supplier}
            className={cn(
              "px-4 py-3.5 transition-colors duration-500 sm:px-5",
              row.you && "bg-brand-tint/60",
              row.movement && "bg-[#29C454]/[0.045]",
            )}
          >
            <div className="flex items-start gap-3">
              <div className="grid size-7 shrink-0 place-items-center pt-0.5">
                <RankingPosition position={row.pos} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <p
                      className="truncate text-[13px] font-semibold text-navy"
                      title={row.supplier}
                    >
                      {row.supplier}
                    </p>
                    <RankingMovement row={row} />
                  </div>
                  <p className="tnum shrink-0 whitespace-nowrap text-[13px] font-bold text-navy">
                    {keepCurrencyTogether(row.bid)}
                  </p>
                </div>
                <div className="mt-1 flex items-center justify-between gap-3 text-[11px] text-slate-text">
                  <span className="truncate">
                    {row.uf} Â· {row.type}
                    {row.you ? " Â· VocÃª" : ""}
                  </span>
                  <span
                    className={cn(
                      "tnum shrink-0 whitespace-nowrap",
                      rankingVariationTone(row.delta),
                    )}
                  >
                    {row.delta || "\u2014"}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className={cn("hidden w-full", compactOnly ? "min-[1680px]:block" : "md:block")}>
        <Table className="w-full min-w-0 table-fixed">
          <colgroup>
            <col className="w-10" />
            <col />
            <col className="w-9" />
            <col className="w-14" />
            <col className="w-[104px]" />
            <col className="w-[66px]" />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead className="!px-2 text-[11px] md:text-[12px]">#</TableHead>
              <TableHead className="!px-2 text-[11px] md:text-[12px]">Fornecedor</TableHead>
              <TableHead className="!px-1.5 text-[11px] md:text-[12px] hidden sm:table-cell">
                UF
              </TableHead>
              <TableHead className="!px-1.5 text-[11px] md:text-[12px] hidden md:table-cell">
                Porte
              </TableHead>
              <TableHead className="!px-2 text-right text-[11px] md:text-[12px]">Lance</TableHead>
              <TableHead className="!px-2 text-right text-[11px] md:text-[12px] hidden sm:table-cell">
                Variação
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id ?? row.supplier}
                className={cn(
                  "transition-colors duration-500",
                  row.you && "bg-brand-tint/60",
                  row.movement && "bg-[#29C454]/[0.045]",
                )}
              >
                <TableCell className="tnum !px-2 text-[12px] font-bold text-navy md:text-[13px]">
                  <RankingPosition position={row.pos} />
                </TableCell>
                <TableCell className="min-w-0 !px-2 text-[12px] text-navy md:text-[13px]">
                  <div className="min-w-0">
                    <span className="block break-words leading-snug">{row.supplier}</span>
                  </div>
                  <RankingMovement row={row} />
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
                <TableCell className="!px-1.5 text-[11px] md:text-[12px] text-slate-text hidden sm:table-cell">
                  {row.uf}
                </TableCell>
                <TableCell className="!px-1.5 text-[11px] md:text-[12px] text-slate-text hidden md:table-cell">
                  {row.type}
                </TableCell>
                <TableCell className="tnum !px-2 whitespace-nowrap text-right text-[12px] font-bold text-navy md:text-[13px]">
                  {keepCurrencyTogether(row.bid)}
                </TableCell>
                <TableCell
                  className={cn(
                    "tnum !px-2 text-right text-[12px] md:text-[13px] hidden sm:table-cell",
                    rankingVariationTone(row.delta),
                  )}
                >
                  {row.delta || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export function DisputeTimelineList({
  events = disputeTimeline,
  className,
}: {
  events?: typeof disputeTimeline;
  className?: string;
}) {
  const newestEvents = [...events].reverse();

  return (
    <div
      role="region"
      aria-label="Histórico completo da sessão"
      tabIndex={0}
      className={cn(
        "overflow-y-auto overscroll-contain border-t border-hairline outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#29C454]",
        className ??
          "max-h-[min(38rem,calc(100dvh-20rem))] sm:max-h-[min(42rem,calc(100dvh-18rem))]",
      )}
    >
      <ol className="space-y-1.5 p-3 sm:p-4">
        {newestEvents.map((ev, index) => (
          <li
            key={`${ev.time}-${index}`}
            className={cn(
              "group grid grid-cols-[auto_18px_minmax(0,1fr)] gap-x-2 rounded-xl px-2 py-2.5 transition-colors hover:bg-slate-50 sm:grid-cols-[76px_20px_minmax(0,1fr)_auto] sm:gap-x-3",
              index === 0 && "bg-[#29C454]/[0.055] hover:bg-[#29C454]/[0.09]",
            )}
          >
            <span className="tnum row-span-2 whitespace-nowrap pt-1 text-[11px] font-bold text-slate-text sm:text-[12px]">
              {ev.time}
            </span>
            <TimelineMarker kind={ev.kind} isLast={index === newestEvents.length - 1} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3 sm:block">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate text-[13px] font-bold text-navy" title={ev.event}>
                    {ev.event}
                  </p>
                  {index === 0 ? (
                    <span className="hidden shrink-0 rounded-full border border-[#29C454]/20 bg-white/75 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.07em] text-[#15943a] sm:inline-flex">
                      Mais recente
                    </span>
                  ) : null}
                </div>
                <p className="tnum shrink-0 whitespace-nowrap text-right text-[12px] font-bold text-navy sm:hidden">
                  {keepCurrencyTogether(ev.value)}
                </p>
              </div>
              <p
                className="mt-0.5 truncate text-[12px] leading-relaxed text-slate-text"
                title={ev.detail}
              >
                {ev.detail}
              </p>
              <p
                className="mt-1 truncate text-[11px] leading-relaxed text-slate-text/80"
                title={ev.note}
              >
                {ev.note}
              </p>
            </div>
            <div className="hidden min-w-[108px] text-right sm:block">
              <p className="tnum whitespace-nowrap text-[12px] font-bold text-navy md:text-[13px]">
                {keepCurrencyTogether(ev.value)}
              </p>
              <p className="mt-1 text-[11px] font-medium text-slate-text">{ev.status}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TimelineMarker({ kind, isLast }: { kind: string; isLast: boolean }) {
  const marker =
    kind === "Nosso lance"
      ? { icon: Trophy, tone: "border-brand/20 bg-brand-tint text-brand-strong" }
      : kind === "Preço caiu"
        ? { icon: TrendingDown, tone: "border-warn/20 bg-orange-50 text-warn" }
        : kind === "Monitorando"
          ? { icon: Radio, tone: "border-info/20 bg-blue-50 text-info" }
          : { icon: CircleDot, tone: "border-slate-200 bg-slate-100 text-slate-text" };
  const Icon = marker.icon;

  return (
    <span className="relative row-span-2 flex justify-center">
      {!isLast && (
        <span className="absolute top-5 bottom-[-18px] w-px bg-border/70" aria-hidden="true" />
      )}
      <span
        className={cn(
          "relative z-10 mt-0.5 grid size-5 place-items-center rounded-full border",
          marker.tone,
        )}
      >
        <Icon className="size-3" aria-hidden="true" />
      </span>
    </span>
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
