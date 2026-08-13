import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Bot, Pause, RefreshCcw } from "lucide-react";
import {
  BotPageHeader,
  BotPanel as CardShell,
  MetricCard,
  StatusPill,
  botOutlineButtonClassName,
  botTabsListClassName,
  botTabsTriggerClassName,
} from "@/components/dash2/BotPrimitives";
import {
  ConfigList,
  DisputeItemsTable,
  DisputeTimelineList,
  SupplierRankingTable,
} from "@/components/bot/panels";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { disputeBotConfig, disputePerformance, disputes } from "@/lib/bid-bot-fixtures";
import { disputeStatusTone } from "@/lib/bot-status";

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
      <p className="text-[15px] font-bold text-ink">Disputa não encontrada.</p>
      <Button variant="outline" size="sm" className={`${botOutlineButtonClassName} mt-4`} asChild>
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
        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-1 text-[12px] font-bold text-slate-text hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
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
            <Button variant="outline" size="sm" className={botOutlineButtonClassName}>
              <RefreshCcw className="size-4" aria-hidden="true" />
              Atualizar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className={botOutlineButtonClassName}>
                  <Pause className="size-4" aria-hidden="true" />
                  Pausar bot
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[calc(100%_-_32px)] rounded-2xl sm:max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>Pausar o bot nesta disputa?</AlertDialogTitle>
                  <AlertDialogDescription>
                    O monitoramento continuará visível, mas nenhum novo lance será enviado até a
                    reativação.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Manter ativo</AlertDialogCancel>
                  <AlertDialogAction className="bg-orange-600 text-white hover:bg-orange-700">
                    Pausar bot
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <StatusPill tone={disputeStatusTone(dispute.status)}>{dispute.status}</StatusPill>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
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

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 sm:gap-5">
        <div className="order-2 lg:order-1 lg:col-span-4">
          <CardShell eyebrow="Bot" title="Configuração do bot">
            <ConfigList rows={disputeBotConfig} />
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#29C454]/15 bg-[#29C454]/10 px-3 py-2.5">
              <Bot className="size-4 text-[#15943a]" aria-hidden="true" />
              <p className="text-[12px] font-medium text-[#15943a]">
                Sessão {disputePerformance.sessionStart} → {disputePerformance.sessionEnd}
              </p>
            </div>
          </CardShell>
        </div>

        <div className="order-1 min-w-0 lg:order-2 lg:col-span-8">
          <Tabs defaultValue="itens">
            <TabsList className={`${botTabsListClassName} grid h-12 w-full grid-cols-3`}>
              <TabsTrigger value="itens" className={`${botTabsTriggerClassName} min-w-0 px-2`}>
                Itens
              </TabsTrigger>
              <TabsTrigger
                value="classificacao"
                className={`${botTabsTriggerClassName} min-w-0 px-2`}
              >
                Classificação
              </TabsTrigger>
              <TabsTrigger value="timeline" className={`${botTabsTriggerClassName} min-w-0 px-2`}>
                Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="itens" className="mt-4">
              <CardShell eyebrow="Disputa" title="Itens em disputa" bodyClassName="p-0">
                <DisputeItemsTable visual="dash2" />
              </CardShell>
            </TabsContent>

            <TabsContent value="classificacao" className="mt-4">
              <CardShell
                eyebrow="Ranking"
                title="Classificação dos fornecedores"
                description="Posições registradas na sessão pública de disputa."
                bodyClassName="p-0"
              >
                <SupplierRankingTable visual="dash2" />
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
