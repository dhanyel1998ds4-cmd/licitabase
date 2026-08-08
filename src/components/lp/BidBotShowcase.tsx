import { Bot } from "lucide-react";
import { MetricCard } from "@/components/bot/BotPageHeader";
import { StatusPill } from "@/components/bot/StatusPill";
import { CardShell } from "@/components/shared/CardShell";
import {
  ConfigList,
  DisputeItemsTable,
  DisputeList,
  DisputeTimelineList,
  ScreenFrame,
  SupplierRankingTable,
} from "@/components/bot/panels";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  bidBotActiveConfig,
  bidBotSummary,
  disputeBotConfig,
  disputePerformance,
  disputes,
} from "@/lib/bid-bot-fixtures";

const previewDisputes = disputes.slice(0, 4);
const previewSummary = bidBotSummary.slice(0, 4);

export function BidBotShowcase() {
  return (
    <Tabs defaultValue="overview" className="font-sans">
      <TabsList className="bg-white/10 text-white/70">
        <TabsTrigger value="overview">Visão geral</TabsTrigger>
        <TabsTrigger value="dispute">Disputa</TabsTrigger>
        <TabsTrigger value="ranking">Classificação</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4">
        <ScreenFrame label="Bot de Lances — Visão geral">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {previewSummary.map((m) => (
              <MetricCard key={m.label} {...m} className="px-3 py-3 shadow-none" />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <CardShell eyebrow="Operacional" title="Configuração ativa">
              <ConfigList rows={bidBotActiveConfig} />
            </CardShell>
            <CardShell eyebrow="Disputas" title="Últimas disputas do bot" bodyClassName="p-0">
              <DisputeList items={previewDisputes} linked={false} />
            </CardShell>
          </div>
        </ScreenFrame>
      </TabsContent>

      <TabsContent value="dispute" className="mt-4">
        <ScreenFrame label="Disputa — Pregão 845/2026 · Guarulhos - SP">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard
              value={disputePerformance.position}
              label="Nossa posição"
              tone="brand"
              className="px-3 py-3 shadow-none"
            />
            <MetricCard
              value={disputePerformance.ourBid}
              label="Nosso lance"
              tone="navy"
              className="px-3 py-3 shadow-none"
            />
            <MetricCard
              value={disputePerformance.discount}
              label="Desconto"
              tone="warn"
              className="px-3 py-3 shadow-none"
            />
            <MetricCard
              value={String(disputePerformance.bidsGiven)}
              label="Lances dados"
              tone="info"
              className="px-3 py-3 shadow-none"
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <CardShell eyebrow="Bot" title="Configuração do bot">
              <ConfigList rows={disputeBotConfig} />
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-brand-tint px-3 py-2.5">
                <Bot className="size-4 text-brand-strong" aria-hidden="true" />
                <p className="text-[12px] font-medium text-brand-strong">
                  Sessão {disputePerformance.sessionStart} → {disputePerformance.sessionEnd}
                </p>
              </div>
            </CardShell>
            <CardShell eyebrow="Disputa" title="Itens em disputa" bodyClassName="p-0">
              <div className="overflow-x-auto">
                <DisputeItemsTable />
              </div>
              <div className="flex items-center gap-2 px-6 py-4">
                <StatusPill tone="brand">Ganhando</StatusPill>
                <p className="text-[12px] text-slate-text">
                  Próximo evento às {disputePerformance.nextEvent}
                </p>
              </div>
            </CardShell>
          </div>
        </ScreenFrame>
      </TabsContent>

      <TabsContent value="ranking" className="mt-4">
        <ScreenFrame label="Disputa — Classificação dos fornecedores">
          <CardShell
            eyebrow="Ranking"
            title="Classificação dos fornecedores"
            description="Posições registradas na sessão pública de disputa."
            bodyClassName="p-0"
          >
            <div className="max-h-[420px] overflow-auto">
              <SupplierRankingTable />
            </div>
          </CardShell>
        </ScreenFrame>
      </TabsContent>

      <TabsContent value="timeline" className="mt-4">
        <ScreenFrame label="Disputa — Timeline da sessão">
          <CardShell
            eyebrow="Histórico"
            title="Timeline da sessão"
            description="Sequência cronológica de eventos registrados pelo bot."
            bodyClassName="p-0"
          >
            <div className="max-h-[420px] overflow-auto">
              <DisputeTimelineList />
            </div>
          </CardShell>
        </ScreenFrame>
      </TabsContent>
    </Tabs>
  );
}
