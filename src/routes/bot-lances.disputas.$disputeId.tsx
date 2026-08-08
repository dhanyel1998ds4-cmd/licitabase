import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Bot, Pause, RefreshCcw } from "lucide-react";
import { BotPageHeader, MetricCard } from "@/components/bot/BotPageHeader";
import { StatusPill, disputeStatusTone } from "@/components/bot/StatusPill";
import { CardShell } from "@/components/shared/CardShell";
import {
  ConfigList,
  DisputeItemsTable,
  DisputeTimelineList,
  SupplierRankingTable,
} from "@/components/bot/panels";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { disputeBotConfig, disputePerformance, disputes } from "@/lib/bid-bot-fixtures";

export const Route = createFileRoute("/bot-lances/disputas/$disputeId")({
  loader: ({ params }) => {
    const dispute = disputes.find((d) => d.id === params.disputeId);
    if (!dispute) throw notFound();
    return { dispute };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Disputa não encontrada | LicitaBase" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.dispute.notice} — Disputa | LicitaBase`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.dispute.object.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.dispute.agency },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <p role="alert" className="text-[13px] text-slate-text">
      {error.message}
    </p>
  ),
  notFoundComponent: () => (
    <div className="py-16 text-center">
      <p className="text-[15px] font-bold text-navy">Disputa não encontrada.</p>
      <Button variant="outline" size="sm" className="mt-4" asChild>
        <Link to="/bot-lances/disputas">Voltar para disputas</Link>
      </Button>
    </div>
  ),
  component: DisputeDetail,
});

function DisputeDetail() {
  const { dispute } = Route.useLoaderData();

  return (
    <>
      <Link
        to="/bot-lances/disputas"
        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-text hover:text-navy"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Voltar para disputas
      </Link>

      <BotPageHeader
        eyebrow={`UASG ${dispute.uasg} · ${dispute.notice}`}
        title={dispute.agency}
        description={dispute.object}
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCcw className="size-4" aria-hidden="true" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Pause className="size-4" aria-hidden="true" />
              Pausar bot
            </Button>
            <StatusPill tone={disputeStatusTone(dispute.status)}>{dispute.status}</StatusPill>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          value={disputePerformance.position}
          label="Nossa posição"
          hint="No item principal"
          tone="brand"
        />
        <MetricCard
          value={disputePerformance.ourBid}
          label="Nosso lance"
          hint={`Melhor: ${disputePerformance.bestBid}`}
          tone="navy"
        />
        <MetricCard
          value={disputePerformance.discount}
          label="Desconto"
          hint="Sobre o valor estimado"
          tone="warn"
        />
        <MetricCard
          value={String(disputePerformance.bidsGiven)}
          label="Lances dados"
          hint={`Duração ${disputePerformance.estimatedDuration}`}
          tone="info"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <CardShell eyebrow="Bot" title="Configuração do bot">
            <ConfigList rows={disputeBotConfig} />
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-brand-tint px-3 py-2.5">
              <Bot className="size-4 text-brand-strong" aria-hidden="true" />
              <p className="text-[12px] font-medium text-brand-strong">
                Sessão {disputePerformance.sessionStart} → {disputePerformance.sessionEnd}
              </p>
            </div>
          </CardShell>
        </div>

        <div className="lg:col-span-8">
          <Tabs defaultValue="itens">
            <TabsList>
              <TabsTrigger value="itens">Itens</TabsTrigger>
              <TabsTrigger value="classificacao">Classificação</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="itens" className="mt-4">
              <CardShell eyebrow="Disputa" title="Itens em disputa" bodyClassName="p-0">
                <DisputeItemsTable />
              </CardShell>
            </TabsContent>

            <TabsContent value="classificacao" className="mt-4">
              <CardShell
                eyebrow="Ranking"
                title="Classificação dos fornecedores"
                description="Posições registradas na sessão pública de disputa."
                bodyClassName="p-0"
              >
                <SupplierRankingTable />
              </CardShell>
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <CardShell
                eyebrow="Histórico"
                title="Timeline da sessão"
                description="Sequência cronológica de eventos registrados pelo bot."
                bodyClassName="p-0"
              >
                <DisputeTimelineList />
              </CardShell>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
