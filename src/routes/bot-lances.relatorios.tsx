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
import { useResizableColumns } from "@/components/dash2/ResizableColumns";

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

const reportsTableColumns = [
  { id: "disputes", width: 108, min: 92, max: 170 },
  { id: "bids", width: 98, min: 82, max: 160 },
  { id: "wins", width: 100, min: 84, max: 165 },
  { id: "savings", width: 180, min: 142, max: 300 },
];

function ReportsPage() {
  const { getColumnWidth, getResizeHandleProps } = useResizableColumns({
    storageKey: "licitabase.bot-reports-table-widths.v1",
    columns: reportsTableColumns,
  });
  return (
    <>
      <BotPageHeader
        title="Relatórios"
        description="Desempenho consolidado das disputas automatizadas por período."
        guide={{
          title: "Use os resultados para melhorar a próxima estratégia",
          description:
            "Compare períodos, identifique onde o bot teve melhor desempenho e leve esse aprendizado para as próximas configurações.",
          steps: [
            {
              title: "Leia os indicadores",
              description: "Comece por vitórias, lances e economia gerada.",
            },
            {
              title: "Compare períodos",
              description: "Observe mudanças de desempenho ao longo da operação.",
            },
            {
              title: "Ajuste a estratégia",
              description: "Use os achados para recalibrar regras e limites.",
            },
          ],
        }}
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
          <Table className="table-fixed">
            <colgroup>
              <col />
              <col style={{ width: getColumnWidth("disputes") }} />
              <col style={{ width: getColumnWidth("bids") }} />
              <col style={{ width: getColumnWidth("wins") }} />
              <col style={{ width: getColumnWidth("savings") }} />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead className="relative">
                  Período
                  <button
                    {...getResizeHandleProps("disputes")}
                    aria-label="Redimensionar largura da coluna Disputas"
                  />
                </TableHead>
                <TableHead className="relative text-right">
                  Disputas
                  <button
                    {...getResizeHandleProps("bids")}
                    aria-label="Redimensionar largura da coluna Lances"
                  />
                </TableHead>
                <TableHead className="relative text-right">
                  Lances
                  <button
                    {...getResizeHandleProps("wins")}
                    aria-label="Redimensionar largura da coluna Vitórias"
                  />
                </TableHead>
                <TableHead className="relative text-right">
                  Vitórias
                  <button
                    {...getResizeHandleProps("savings")}
                    aria-label="Redimensionar largura da coluna Economia gerada"
                  />
                </TableHead>
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
