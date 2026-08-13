import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import {
  TrendingUp,
  ClipboardCheck,
  History,
  CircleCheckBig,
  Star,
  NotebookPen,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Topbar } from "@/components/dash2/Topbar";
import { SummaryCard } from "@/components/dash2/SummaryCard";
import { WonBidsCard } from "@/components/dash2/WonBidsCard";
import { LiveBidsCard } from "@/components/dash2/LiveBidsCard";
import { PortalStatusCard } from "@/components/dash2/PortalStatusCard";
import { newOpportunitiesSummary } from "@/lib/new-opportunities-fixtures";
import { useCurrentDate } from "@/hooks/use-current-date";
import { useGreeting } from "@/hooks/use-greeting";

export const Route = createFileRoute("/dash2")({
  head: () => ({
    meta: [
      { title: "Visão geral — LicitaBase" },
      {
        name: "description",
        content:
          "Painel de visão geral da LicitaBase: resumo do dia, integrações, propostas, pós-disputas e licitações em tempo real.",
      },
      { property: "og:title", content: "Visão geral — LicitaBase" },
      {
        property: "og:description",
        content:
          "Acompanhe oportunidades, propostas cadastradas, pós-disputas e licitações finalizadas em um só painel.",
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
    <AppLayout contentClassName="flex h-full min-h-0 flex-col overflow-hidden bg-[#F8FAFC] p-0 font-manrope">
      <Topbar />
      {isDashboardHome ? <DashboardHome /> : <Outlet />}
    </AppLayout>
  );
}

function DashboardHome() {
  const greeting = useGreeting();
  const currentDate = useCurrentDate();

  return (
    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 sm:space-y-6 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:gap-6">
        <div className="min-w-0">
          <p className="text-[20px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[22px]">
            <span className="block sm:inline">{greeting},</span>{" "}
            <span className="block text-brand-strong sm:inline">Jussefer</span>
          </p>
          {currentDate ? (
            <time
              dateTime={currentDate.dateTime}
              className="mt-1 hidden whitespace-nowrap text-[12px] font-medium text-slate-text sm:block"
            >
              {currentDate.compactLabel}
            </time>
          ) : (
            <span className="mt-1 hidden text-[12px] font-medium text-slate-text sm:block">
              Data de hoje
            </span>
          )}
        </div>

        <div className="flex items-start justify-end gap-2 text-right sm:gap-2.5">
          <div className="h-11 w-1 shrink-0 rounded-full bg-[#29C454]" />
          <div>
            <h1 className="whitespace-nowrap text-[15px] font-bold leading-tight text-ink sm:text-[16px]">
              Resumo do dia
            </h1>
            {currentDate ? (
              <time
                dateTime={currentDate.dateTime}
                className="mt-1 block whitespace-nowrap text-[11px] font-medium leading-tight text-slate-text sm:text-[12px]"
              >
                {currentDate.compactLabel}
              </time>
            ) : (
              <span className="mt-1 block text-[11px] font-medium text-slate-text sm:text-[12px]">
                Data de hoje
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <SummaryCard
          className="min-[360px]:col-span-2 sm:col-span-1"
          icon={TrendingUp}
          tone="green"
          value={String(newOpportunitiesSummary.total)}
          label="Novas oportunidades"
          link="Ver todas"
          linkTo="/dash2/oportunidades/novas"
          trend="+12%"
          ticker={{
            ariaLabel: "Novas oportunidades publicadas",
            duration: 31,
            delay: -4,
            items: [
              {
                id: "comprasnet-ti-sp",
                label: "ComprasNet · Equipamentos de TI · SP · há 2 min",
                compactLabel: "TI · SP · 2 min",
                tone: "green",
                marker: "up",
              },
              {
                id: "licitanet-saude-mg",
                label: "Licitanet · Material hospitalar · MG · há 6 min",
                compactLabel: "Saúde · MG · 6 min",
                tone: "green",
                marker: "up",
              },
              {
                id: "bnc-manutencao-pr",
                label: "BNC · Manutenção predial · PR · há 11 min",
                compactLabel: "Predial · PR · 11 min",
                tone: "green",
                marker: "up",
              },
            ],
          }}
        />
        <SummaryCard
          className="min-[360px]:col-span-2 sm:col-span-1"
          icon={ClipboardCheck}
          tone="blue"
          value="14"
          label="Proposta cadastrada"
          hint="licitações cadastradas"
          trend="+4,2%"
          link="Ver todas"
          ticker={{
            ariaLabel: "Próximos prazos das propostas cadastradas",
            duration: 28,
            delay: -11,
            items: [
              {
                id: "deadline-11-ago-23h",
                label: "Hoje · 11 ago · 23h",
                compactLabel: "Hoje · 23h",
                tone: "orange",
                marker: "dot",
              },
              {
                id: "deadline-12-ago-14h",
                label: "Próxima · 12 ago · 14h",
                compactLabel: "12 ago · 14h",
                tone: "green",
                marker: "dot",
              },
              {
                id: "deadline-15-ago-09h",
                label: "15 ago · 09h",
                compactLabel: "15 ago · 09h",
                tone: "blue",
                marker: "dot",
              },
              {
                id: "deadline-18-ago-10h30",
                label: "18 ago · 10h30",
                compactLabel: "18 ago · 10h30",
                tone: "slate",
                marker: "dot",
              },
            ],
          }}
        />
        <SummaryCard
          icon={History}
          tone="purple"
          value="10"
          label="Pós-disputa"
          hint="2 exigem atenção"
          trend="+3"
        />
        <SummaryCard
          icon={CircleCheckBig}
          tone="orange"
          value="1"
          label="Finalizado"
          hint="finalizada hoje"
          trend="-2"
          trendDir="down"
          link="Ver todas"
          ticker={{
            ariaLabel: "Licitações finalizadas recentemente",
            duration: 34,
            delay: -19,
            items: [
              {
                id: "ended-pe-845-2026",
                label: "PE 845/2026 · finalizada hoje, 11h20",
                compactLabel: "PE 845 · 11h20",
                tone: "orange",
                marker: "check",
              },
              {
                id: "ended-dl-142-2026",
                label: "DL 142/2026 · finalizada hoje, 10h45",
                compactLabel: "DL 142 · 10h45",
                tone: "orange",
                marker: "check",
              },
              {
                id: "ended-pe-310-2026",
                label: "PE 310/2026 · finalizada ontem, 17h30",
                compactLabel: "PE 310 · ontem",
                tone: "slate",
                marker: "check",
              },
            ],
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4">
        <SummaryCard
          icon={Star}
          tone="green"
          value={String(newOpportunitiesSummary.favorites)}
          label="Favoritos"
          hint="Oportunidades salvas"
        />
        <SummaryCard
          icon={NotebookPen}
          tone="blue"
          value="0"
          label="Minhas anotações"
          hint="Anotações registradas"
        />
      </div>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">
        <WonBidsCard />
        <LiveBidsCard />
        <PortalStatusCard />
      </div>
    </div>
  );
}
