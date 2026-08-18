import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import {
  BotPageHeader,
  BotPanel as CardShell,
  StatusPill,
  botInputClassName,
  botOutlineButtonClassName,
  botTabsListClassName,
  botTabsTriggerClassName,
} from "@/components/dash2/BotPrimitives";
import { MobileDisputeCards } from "@/components/bot/BotMobileCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { disputeCounts, disputes } from "@/lib/bid-bot-fixtures";
import { disputeStatusTone } from "@/lib/bot-status";

export const Route = createFileRoute("/bot-lances/disputas/")({
  head: () => ({
    meta: [
      { title: "Disputas do Bot de Lances | LicitaBase" },
      {
        name: "description",
        content:
          "Lista completa das disputas acompanhadas pelo bot: ativas, aguardando, pausadas e finalizadas.",
      },
      { property: "og:title", content: "Disputas do Bot de Lances | LicitaBase" },
      { property: "og:description", content: "Gerencie todas as disputas automatizadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DisputesPage,
});

const filters = [
  { key: "todas", label: "Todas", count: disputeCounts.todas },
  { key: "Ativa", label: "Ativas", count: disputeCounts.ativas },
  { key: "Aguardando", label: "Aguardando", count: disputeCounts.aguardando },
  { key: "Pausada", label: "Pausadas", count: disputeCounts.pausadas },
  { key: "Finalizada", label: "Finalizadas", count: disputeCounts.finalizadas },
] as const;

function DisputesPage() {
  const [filter, setFilter] = useState<string>("todas");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (!filtersOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [filtersOpen]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return disputes.filter((d) => {
      const matchesFilter = filter === "todas" || d.status === filter;
      const matchesQuery =
        !q ||
        d.agency.toLowerCase().includes(q) ||
        d.object.toLowerCase().includes(q) ||
        d.uasg.includes(q) ||
        d.notice.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <>
      <BotPageHeader
        title="Disputas"
        description="Todas as sessões de disputa acompanhadas pelos seus robôs de lance."
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={botOutlineButtonClassName}
            onClick={() => {
              setFiltersOpen(true);
            }}
            aria-haspopup="dialog"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filtros avançados{filter !== "todas" ? " · 1" : ""}
          </Button>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <div className="relative -mx-1 min-w-0 overflow-hidden px-1 pr-10">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList
              className={`${botTabsListClassName} min-w-max justify-start overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
            >
              {filters.map((f) => (
                <TabsTrigger key={f.key} value={f.key} className={botTabsTriggerClassName}>
                  {f.label}
                  <span className="tnum ml-2 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-ink">
                    {f.count}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/95 to-transparent" />
        </div>
        <div className="min-w-0 flex-1">
          <Input
            className={botInputClassName}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por órgão, objeto, UASG ou edital..."
            aria-label="Buscar disputas"
          />
        </div>
      </div>

      <CardShell eyebrow="Operacional" title="Sessões de disputa" bodyClassName="p-0">
        <MobileDisputeCards items={rows} />
        <div className="hidden overflow-x-auto lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Órgão / objeto</TableHead>
                <TableHead>Sessão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Itens</TableHead>
                <TableHead className="text-right">Lances</TableHead>
                <TableHead className="text-right">Valor estimado</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="max-w-[420px]">
                    <p className="truncate text-[13px] font-bold text-ink">{d.agency}</p>
                    <p className="truncate text-[12px] text-slate-text/90">{d.object}</p>
                    <p className="mt-1 text-[11px] text-slate-text/70">
                      UASG {d.uasg} · {d.notice}
                    </p>
                  </TableCell>
                  <TableCell className="text-[12px] text-slate-text">{d.date}</TableCell>
                  <TableCell>
                    <StatusPill tone={disputeStatusTone(d.status)}>{d.status}</StatusPill>
                  </TableCell>
                  <TableCell className="tnum whitespace-nowrap text-right text-[13px] font-semibold text-ink">
                    {d.items} {d.items === 1 ? "item" : "itens"}
                  </TableCell>
                  <TableCell className="tnum text-right text-[13px] text-ink">{d.bids}</TableCell>
                  <TableCell className="tnum text-right text-[13px] font-bold text-ink">
                    {d.estimatedValue}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className={botOutlineButtonClassName}
                      asChild
                    >
                      <Link to="/bot-lances/disputas/$disputeId" params={{ disputeId: d.id }}>
                        Abrir
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-[13px] text-slate-text">
                    Nenhuma disputa encontrada para os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardShell>

      {filtersOpen ? (
        <div
          className="fixed inset-0 z-[100] grid items-end bg-slate-950/35 backdrop-blur-[1px] sm:place-items-center sm:p-6"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setFiltersOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dispute-filter-title"
            className="relative max-h-[85dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6"
          >
            <SheetHeader className="pr-10 text-left">
              <SheetTitle id="dispute-filter-title">Filtrar disputas</SheetTitle>
              <SheetDescription>
                Escolha o estado das sessões que deseja visualizar.
              </SheetDescription>
            </SheetHeader>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Fechar filtros"
              className="absolute right-5 top-5 grid size-10 place-items-center rounded-xl border border-hairline bg-white text-[22px] leading-none text-ink shadow-sm sm:right-6 sm:top-6"
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="mt-6 grid gap-2">
              {filters.map((item) => {
                const selected = filter === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setFilter(item.key);
                      setFiltersOpen(false);
                    }}
                    aria-pressed={selected}
                    className={
                      selected
                        ? "flex min-h-12 items-center justify-between rounded-xl border border-[#29C454] bg-[#29C454]/10 px-4 text-left text-[14px] font-bold text-[#15943a]"
                        : "flex min-h-12 items-center justify-between rounded-xl border border-hairline bg-white px-4 text-left text-[14px] font-semibold text-ink"
                    }
                  >
                    <span>{item.label}</span>
                    <span className="tnum rounded-full bg-slate-100 px-2 py-1 text-[12px]">
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
