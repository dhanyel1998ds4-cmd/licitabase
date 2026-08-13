import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import {
  BotPageHeader,
  BotPanel as CardShell,
  MetricCard,
  botOutlineButtonClassName,
} from "@/components/dash2/BotPrimitives";
import { MobileReportCards } from "@/components/bot/BotMobileCards";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { reportMetrics, reportRows } from "@/lib/bid-bot-fixtures";

export const Route = createFileRoute("/bot-lances/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios do Bot de Lances | LicitaBase" },
      {
        name: "description",
        content:
          "Desempenho consolidado do bot de lances: disputas, taxa de vitória, descontos e economia gerada.",
      },
      { property: "og:title", content: "Relatórios do Bot de Lances | LicitaBase" },
      { property: "og:description", content: "Indicadores mensais das disputas automatizadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <>
      <BotPageHeader
        title="Relatórios"
        description="Desempenho consolidado das disputas automatizadas por período."
        actions={
          <Button variant="outline" size="sm" className={botOutlineButtonClassName}>
            <Download className="size-4" aria-hidden="true" />
            Exportar CSV
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {reportMetrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <CardShell eyebrow="Consolidado" title="Desempenho por período" bodyClassName="p-0">
        <MobileReportCards items={reportRows} />
        <div className="hidden overflow-x-auto lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Disputas</TableHead>
                <TableHead className="text-right">Lances</TableHead>
                <TableHead className="text-right">Vitórias</TableHead>
                <TableHead className="text-right">Economia gerada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportRows.map((r) => (
                <TableRow key={r.period}>
                  <TableCell className="text-[13px] font-bold text-ink">{r.period}</TableCell>
                  <TableCell className="tnum text-right text-[13px] text-ink">
                    {r.disputes}
                  </TableCell>
                  <TableCell className="tnum text-right text-[13px] text-ink">{r.bids}</TableCell>
                  <TableCell className="tnum text-right text-[13px] text-[#15943a]">
                    {r.wins}
                  </TableCell>
                  <TableCell className="tnum text-right text-[13px] font-bold text-ink">
                    {r.savings}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardShell>
    </>
  );
}
