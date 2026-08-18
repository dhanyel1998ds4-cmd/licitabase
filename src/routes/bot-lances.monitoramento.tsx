import { createFileRoute } from "@tanstack/react-router";
import { Activity, RefreshCcw } from "lucide-react";
import {
  BotPageHeader,
  BotPanel as CardShell,
  MetricCard,
  StatusPill,
  botOutlineButtonClassName,
} from "@/components/dash2/BotPrimitives";
import { MobileMonitoringCards } from "@/components/bot/BotMobileCards";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { monitoringMetrics, monitoringWatchers } from "@/lib/bid-bot-fixtures";
import { useResizableColumns } from "@/components/dash2/ResizableColumns";

export const Route = createFileRoute("/bot-lances/monitoramento")({
  head: () => ({
    meta: [
      { title: "Monitoramento do Bot de Lances | LicitaBase" },
      {
        name: "description",
        content:
          "Acompanhe as sessões monitoradas, frequência de verificação e alertas do bot de lances.",
      },
      { property: "og:title", content: "Monitoramento do Bot de Lances | LicitaBase" },
      { property: "og:description", content: "Sessões monitoradas em tempo real pelo bot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MonitoringPage,
});

const monitoringTableColumns = [
  { id: "scope", width: 270, min: 180, max: 440 },
  { id: "interval", width: 112, min: 92, max: 170 },
  { id: "checks", width: 124, min: 104, max: 190 },
  { id: "state", width: 144, min: 118, max: 220 },
];

function MonitoringPage() {
  const { getColumnWidth, getResizeHandleProps } = useResizableColumns({
    storageKey: "licitabase.bot-monitoring-table-widths.v1",
    columns: monitoringTableColumns,
  });
  return (
    <>
      <BotPageHeader
        title="Monitoramento"
        description="Sessões acompanhadas em tempo real, com verificações automáticas de preço e posição. Atualizado agora."
        guide={{
          title: "Mantenha as verificações sob controle",
          description:
            "Acompanhe a leitura de cada portal, identifique qualquer alerta e ajuste o intervalo ou a estratégia quando o cenário pedir.",
          steps: [
            {
              title: "Acompanhe a leitura",
              description: "Veja a cadência das verificações e o estado de cada sessão.",
            },
            {
              title: "Identifique alertas",
              description: "Priorize sessões com mudança de preço ou posição.",
            },
            {
              title: "Corrija o contexto",
              description: "Atualize a configuração antes que a disputa exija uma ação manual.",
            },
          ],
        }}
        actions={
          <Button variant="outline" size="sm" className={botOutlineButtonClassName}>
            <RefreshCcw className="size-4" aria-hidden="true" />
            Atualizar agora
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {monitoringMetrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <CardShell
        eyebrow="Tempo real"
        title="Sessões monitoradas"
        description="Cada sessão é verificada automaticamente no intervalo configurado."
        bodyClassName="p-0"
      >
        <MobileMonitoringCards items={monitoringWatchers} />
        <div className="hidden overflow-x-auto lg:block">
          <Table className="table-fixed">
            <colgroup>
              <col />
              <col style={{ width: getColumnWidth("scope") }} />
              <col style={{ width: getColumnWidth("interval") }} />
              <col style={{ width: getColumnWidth("checks") }} />
              <col style={{ width: getColumnWidth("state") }} />
            </colgroup>
            <TableHeader>
              <TableRow>
                <TableHead className="relative">
                  Órgão
                  <button
                    {...getResizeHandleProps("scope")}
                    aria-label="Redimensionar largura da coluna Escopo"
                  />
                </TableHead>
                <TableHead className="relative">
                  Escopo
                  <button
                    {...getResizeHandleProps("interval")}
                    aria-label="Redimensionar largura da coluna Intervalo"
                  />
                </TableHead>
                <TableHead className="relative text-right">
                  Intervalo
                  <button
                    {...getResizeHandleProps("checks")}
                    aria-label="Redimensionar largura da coluna Verificações"
                  />
                </TableHead>
                <TableHead className="relative text-right">
                  Verificações
                  <button
                    {...getResizeHandleProps("state")}
                    aria-label="Redimensionar largura da coluna Estado"
                  />
                </TableHead>
                <TableHead className="text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monitoringWatchers.map((w) => (
                <TableRow key={w.name}>
                  <TableCell className="text-[13px] font-bold text-ink">{w.name}</TableCell>
                  <TableCell className="text-[12px] text-slate-text">{w.scope}</TableCell>
                  <TableCell className="tnum text-right text-[13px] text-ink">
                    {w.frequency}
                  </TableCell>
                  <TableCell className="tnum text-right text-[13px] text-ink">{w.checks}</TableCell>
                  <TableCell className="text-right">
                    <StatusPill tone={w.state === "Monitorando" ? "brand" : "neutral"}>
                      <Activity className="size-3" aria-hidden="true" />
                      {w.state}
                    </StatusPill>
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
