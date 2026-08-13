import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BotPageHeader,
  BotPanel as CardShell,
  StatusPill,
  botInputClassName,
  botTabsListClassName,
  botTabsTriggerClassName,
} from "@/components/dash2/BotPrimitives";
import { MobileHistoryCards } from "@/components/bot/BotMobileCards";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { historyRows } from "@/lib/bid-bot-fixtures";

export const Route = createFileRoute("/bot-lances/historico")({
  head: () => ({
    meta: [
      { title: "Histórico do Bot de Lances | LicitaBase" },
      {
        name: "description",
        content:
          "Histórico das disputas finalizadas pelo bot de lances, com resultado e lances registrados.",
      },
      { property: "og:title", content: "Histórico do Bot de Lances | LicitaBase" },
      { property: "og:description", content: "Resultados das disputas encerradas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function resultTone(result: string) {
  if (result === "Vencemos") return "brand" as const;
  if (result === "Perdemos") return "warn" as const;
  return "neutral" as const;
}

const resultFilters = ["Todos", "Vencemos", "Perdemos", "Cancelada"] as const;

function HistoryPage() {
  const [resultFilter, setResultFilter] = useState<(typeof resultFilters)[number]>("Todos");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return historyRows.filter((row) => {
      const matchesResult = resultFilter === "Todos" || row.result === resultFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        row.dispute.toLowerCase().includes(normalizedQuery) ||
        row.date.includes(normalizedQuery);
      return matchesResult && matchesQuery;
    });
  }, [query, resultFilter]);

  return (
    <>
      <BotPageHeader
        title="Histórico"
        description="Registro das disputas encerradas e seus resultados."
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative -mx-1 min-w-0 overflow-hidden px-1 pr-10">
          <Tabs
            value={resultFilter}
            onValueChange={(value) => setResultFilter(value as (typeof resultFilters)[number])}
          >
            <TabsList
              className={`${botTabsListClassName} min-w-max justify-start overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
            >
              {resultFilters.map((result) => (
                <TabsTrigger key={result} value={result} className={botTabsTriggerClassName}>
                  {result}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/95 to-transparent" />
        </div>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={`${botInputClassName} min-w-0 lg:max-w-md`}
          placeholder="Buscar por disputa ou data..."
          aria-label="Buscar no histórico"
        />
      </div>

      <CardShell eyebrow="Encerradas" title="Disputas finalizadas" bodyClassName="p-0">
        <MobileHistoryCards items={rows} />
        <div className="hidden overflow-x-auto lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Disputa</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead className="text-right">Nosso lance</TableHead>
                <TableHead className="text-right">Lances</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-[12px] text-slate-text">{r.date}</TableCell>
                  <TableCell className="text-[13px] font-bold text-ink">{r.dispute}</TableCell>
                  <TableCell>
                    <StatusPill tone={resultTone(r.result)}>{r.result}</StatusPill>
                  </TableCell>
                  <TableCell className="tnum text-right text-[13px] font-bold text-ink">
                    {r.ourBid}
                  </TableCell>
                  <TableCell className="tnum text-right text-[13px] text-ink">{r.bids}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-[14px] text-slate-text">
                    Nenhum registro encontrado para os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardShell>
    </>
  );
}
