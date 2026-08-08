import { createFileRoute } from "@tanstack/react-router";
import { BotPageHeader } from "@/components/bot/BotPageHeader";
import { StatusPill } from "@/components/bot/StatusPill";
import { CardShell } from "@/components/shared/CardShell";
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

function HistoryPage() {
  return (
    <>
      <BotPageHeader
        title="Histórico"
        description="Registro das disputas encerradas e seus resultados."
      />

      <CardShell eyebrow="Encerradas" title="Disputas finalizadas" bodyClassName="p-0">
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
            {historyRows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-[12px] text-slate-text">{r.date}</TableCell>
                <TableCell className="text-[13px] font-bold text-navy">{r.dispute}</TableCell>
                <TableCell>
                  <StatusPill tone={resultTone(r.result)}>{r.result}</StatusPill>
                </TableCell>
                <TableCell className="tnum text-right text-[13px] font-bold text-navy">
                  {r.ourBid}
                </TableCell>
                <TableCell className="tnum text-right text-[13px] text-navy">{r.bids}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardShell>
    </>
  );
}
