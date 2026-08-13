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

function MonitoringPage() {
  return (
    <>
      <BotPageHeader
        title="Monitoramento"
        description="Sessões acompanhadas em tempo real, com verificações automáticas de preço e posição. Atualizado agora."
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Órgão</TableHead>
                <TableHead>Escopo</TableHead>
                <TableHead className="text-right">Intervalo</TableHead>
                <TableHead className="text-right">Verificações</TableHead>
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
