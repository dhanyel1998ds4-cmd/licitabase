import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { BotPageHeader } from "@/components/bot/BotPageHeader";
import { StatusPill, disputeStatusTone } from "@/components/bot/StatusPill";
import { CardShell } from "@/components/shared/CardShell";
import { Button } from "@/components/ui/button";
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
import { disputeCounts, disputes } from "@/lib/bid-bot-fixtures";

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
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filtros avançados
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-4">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            {filters.map((f) => (
              <TabsTrigger key={f.key} value={f.key}>
                {f.label}
                <span className="tnum ml-2 rounded-full bg-navy/5 px-1.5 py-0.5 text-[10px] font-bold text-navy">
                  {f.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="min-w-[260px] flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por órgão, objeto, UASG ou edital..."
            aria-label="Buscar disputas"
          />
        </div>
      </div>

      <CardShell eyebrow="Operacional" title="Sessões de disputa" bodyClassName="p-0">
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
                  <p className="truncate text-[13px] font-bold text-navy">{d.agency}</p>
                  <p className="truncate text-[12px] text-slate-text/90">{d.object}</p>
                  <p className="mt-1 text-[11px] text-slate-text/70">
                    UASG {d.uasg} · {d.notice}
                  </p>
                </TableCell>
                <TableCell className="text-[12px] text-slate-text">{d.date}</TableCell>
                <TableCell>
                  <StatusPill tone={disputeStatusTone(d.status)}>{d.status}</StatusPill>
                </TableCell>
                <TableCell className="tnum text-right text-[13px] text-navy">{d.items}</TableCell>
                <TableCell className="tnum text-right text-[13px] text-navy">{d.bids}</TableCell>
                <TableCell className="tnum text-right text-[13px] font-bold text-navy">
                  {d.estimatedValue}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
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
      </CardShell>
    </>
  );
}
