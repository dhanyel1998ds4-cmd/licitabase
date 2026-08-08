import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { TrendingUp, CircleDollarSign, Bot, AlertTriangle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Topbar, GreetingBar } from "@/components/dash2/Topbar";
import { Panel } from "@/components/dash2/Panel";
import { SummaryCard } from "@/components/dash2/SummaryCard";
import { CompanySiteCard } from "@/components/dash2/CompanySiteCard";
import { AgencyScoreCard } from "@/components/dash2/AgencyScoreCard";
import { RecommendedOpportunitiesCard } from "@/components/dash2/RecommendedOpportunities";
import { BotCenterCard } from "@/components/dash2/BotCenterCard";
import { SmartSummaryCard } from "@/components/dash2/SmartSummaryCard";
import { newOpportunitiesSummary } from "@/lib/new-opportunities-fixtures";

export const Route = createFileRoute("/dash2")({
  head: () => ({
    meta: [
      { title: "Visão geral — LicitaBase" },
      {
        name: "description",
        content:
          "Painel de visão geral da LicitaBase: resumo do dia, score de órgãos, oportunidades recomendadas e central do bot.",
      },
      { property: "og:title", content: "Visão geral — LicitaBase" },
      {
        property: "og:description",
        content:
          "Acompanhe oportunidades, score de órgãos e o desempenho do seu bot de lances em um só painel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dash2Page,
});

function Dash2Page() {
  const location = useLocation();
  const isDashboardHome = location.pathname === "/dash2" || location.pathname === "/dash2/";

  return (
    <AppLayout contentClassName="p-0 font-manrope bg-[#F8FAFC] h-screen overflow-hidden flex flex-col">
      <Topbar />
      {isDashboardHome ? <DashboardHome /> : <Outlet />}
    </AppLayout>
  );
}

function DashboardHome() {
  return (
    <div className="flex-1 overflow-y-auto space-y-6 px-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 bg-[#29C454] rounded-full" />
          <h2 className="text-[15px] font-bold text-ink">Resumo do dia</h2>
          <span className="text-[12px] font-medium text-slate-text ml-2">05 de agosto</span>
        </div>
        <span className="text-[11px] font-medium text-slate-text">Atualizado agora</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={TrendingUp}
          tone="green"
          value={String(newOpportunitiesSummary.total)}
          label="Novas oportunidades"
          link="Ver todas"
          linkTo="/dash2/oportunidades/novas"
          trend="+12%"
        />
        <SummaryCard
          icon={CircleDollarSign}
          tone="blue"
          value="R$ 100.290,63"
          label="Valor em aberto"
          hint="14 licitações abertas"
          trend="+4,2%"
        />
        <SummaryCard
          icon={Bot}
          tone="purple"
          value="10"
          label="Bots em disputa"
          hint="2 exigem atenção"
          trend="+3"
        />
        <SummaryCard
          icon={AlertTriangle}
          tone="orange"
          value="1"
          label="Item com atenção"
          link="Ver detalhes"
          trend="-2"
          trendDir="down"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CompanySiteCard />
        <AgencyScoreCard />
        <RecommendedOpportunitiesCard />
        <BotCenterCard />
      </div>
    </div>
  );
}
