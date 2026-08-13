import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Settings2, SlidersHorizontal } from "lucide-react";
import {
  BotPageHeader,
  BotPanel as CardShell,
  MetricCard,
  botInputClassName,
  botOutlineButtonClassName,
} from "@/components/dash2/BotPrimitives";
import { ConfigList, DisputeList } from "@/components/bot/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  bidBotActiveConfig,
  bidBotQuickSummary,
  bidBotSummary,
  disputes,
  BID_BOT_ROUTES,
} from "@/lib/bid-bot-fixtures";

export const Route = createFileRoute("/bot-lances/")({
  head: () => ({
    meta: [
      { title: "Bot de Lances — Visão geral | LicitaBase" },
      {
        name: "description",
        content:
          "Acompanhe disputas automatizadas, configuração ativa do bot e desempenho de lances em tempo real.",
      },
      { property: "og:title", content: "Bot de Lances — Visão geral | LicitaBase" },
      {
        property: "og:description",
        content: "Painel operacional do Bot de Lances do LicitaBase.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BidBotOverview,
});

function BidBotOverview() {
  return (
    <>
      <BotPageHeader
        title="Visão geral do Bot de Lances"
        description="Monitoramento em tempo real das disputas automatizadas da sua operação."
        actions={
          <>
            <Button variant="outline" size="sm" className={botOutlineButtonClassName}>
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Filtros
            </Button>
            <Button
              size="sm"
              className="rounded-xl bg-[#29C454] shadow-none hover:bg-[#22ad49]"
              asChild
            >
              <Link to={BID_BOT_ROUTES.settings}>
                <Settings2 className="size-4" aria-hidden="true" />
                Nova estratégia
              </Link>
            </Button>
          </>
        }
      />

      <div className="w-full">
        <Input
          className={botInputClassName}
          placeholder="Buscar por órgão, objeto, UASG, edital, fornecedor..."
          aria-label="Buscar disputas"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 xl:grid-cols-5">
        {bidBotSummary.map((m, index) => (
          <MetricCard
            key={m.label}
            {...m}
            className={
              index === bidBotSummary.length - 1 ? "min-[360px]:col-span-2 xl:col-span-1" : ""
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 sm:gap-5">
        <div className="space-y-4 lg:col-span-4 sm:space-y-5">
          <CardShell eyebrow="Operacional" title="Configuração ativa">
            <ConfigList rows={bidBotActiveConfig} />
            <Button
              variant="outline"
              size="sm"
              className={`${botOutlineButtonClassName} mt-6 w-full`}
              asChild
            >
              <Link to={BID_BOT_ROUTES.settings}>
                Ver configurações
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardShell>

          <CardShell eyebrow="Resumo" title="Resumo rápido">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {bidBotQuickSummary.map((m) => (
                <MetricCard key={m.label} {...m} className="shadow-none" />
              ))}
            </div>
            <p className="mt-5 flex items-center gap-2 text-[12px] text-slate-text/80">
              <Clock className="size-3.5" aria-hidden="true" />
              Atualizado agora há pouco
            </p>
          </CardShell>
        </div>

        <div className="lg:col-span-8">
          <CardShell
            eyebrow="Disputas"
            title="Últimas disputas do bot"
            description="Sessões acompanhadas automaticamente pelos seus robôs de lance."
            bodyClassName="p-0"
          >
            <DisputeList items={disputes} visual="dash2" />
            <div className="flex flex-col items-stretch gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-[13px] text-slate-text">Mostrando 1–10 de 200</p>
              <Button
                variant="outline"
                className={`${botOutlineButtonClassName} min-h-11 sm:min-h-9`}
                size="sm"
                asChild
              >
                <Link to={BID_BOT_ROUTES.disputes}>
                  Ver todas as disputas
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </CardShell>
        </div>
      </div>
    </>
  );
}
