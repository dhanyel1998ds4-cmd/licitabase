import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  CloudDownload,
  Globe2,
  Link2,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel, PanelHeader } from "./Panel";
import { MobilePagedList } from "./MobilePagedList";

type PortalStatus = "Operacional" | "Sincronizando" | "Atenção";

type ConnectedPortal = {
  name: string;
  shortName: string;
  status: PortalStatus;
  lastSync: string;
  receivedToday: number;
};

type StatusStyle = {
  icon: LucideIcon;
  badge: string;
  dot: string;
};

const statusStyles: Record<PortalStatus, StatusStyle> = {
  Operacional: {
    icon: CheckCircle2,
    badge: "border-[#29C454]/20 bg-[#29C454]/10 text-[#16863A]",
    dot: "bg-[#29C454]",
  },
  Sincronizando: {
    icon: RefreshCw,
    badge: "border-blue-100 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  Atenção: {
    icon: CircleAlert,
    badge: "border-orange-100 bg-orange-50 text-orange-700",
    dot: "bg-orange-500",
  },
};

const connectedPortals: ConnectedPortal[] = [
  {
    name: "ComprasNet",
    shortName: "CN",
    status: "Operacional",
    lastSync: "há 12s",
    receivedToday: 604,
  },
  {
    name: "Licitanet",
    shortName: "LN",
    status: "Operacional",
    lastSync: "há 35s",
    receivedToday: 128,
  },
  {
    name: "Portal de Compras Públicas",
    shortName: "PCP",
    status: "Sincronizando",
    lastSync: "há 1min",
    receivedToday: 76,
  },
  {
    name: "Bolsa Nacional de Compras",
    shortName: "BNC",
    status: "Atenção",
    lastSync: "há 18min",
    receivedToday: 42,
  },
];

export function PortalStatusCard() {
  const renderPortal = (portal: ConnectedPortal) => {
    const style = statusStyles[portal.status];
    const StatusIcon = style.icon;

    return (
      <article
        key={portal.shortName}
        className={cn(
          "dashboard-portal-card group min-w-0 rounded-xl border border-hairline bg-slate-50/45 p-3 transition-[border-color,box-shadow] hover:border-slate-300 hover:bg-white hover:shadow-sm sm:p-3.5",
          portal.status === "Atenção" && "dashboard-portal-card--attention",
        )}
      >
        <div className="flex min-w-0 items-start justify-between gap-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#DCFCE7] bg-white text-[11px] font-bold text-[#16863A] shadow-sm">
              {portal.shortName}
            </div>
            <div className="min-w-0">
              <h3 className="dashboard-portal-title text-[13px] font-bold leading-snug text-ink">
                {portal.name}
              </h3>
              <p className="dashboard-portal-subtitle mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-slate-text">
                <Globe2 className="size-3" aria-hidden="true" />
                Portal integrado
              </p>
            </div>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold",
              style.badge,
            )}
          >
            <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden="true" />
            {portal.status}
          </span>
        </div>

        <div className="dashboard-portal-metrics mt-2.5 grid grid-cols-2 gap-2 border-t border-hairline pt-2.5 sm:mt-3 sm:pt-3">
          <div className="min-w-0">
            <p className="dashboard-portal-metric__label text-[10px] font-bold uppercase tracking-wide text-slate-text">
              Última sincronização
            </p>
            <p className="mt-1 flex items-center gap-1 text-[12px] font-bold text-ink">
              <StatusIcon
                className={cn(
                  "size-3.5 shrink-0",
                  portal.status === "Operacional"
                    ? "text-[#29C454]"
                    : portal.status === "Sincronizando"
                      ? "text-blue-500 motion-safe:animate-spin"
                      : "text-orange-500",
                )}
                aria-hidden="true"
              />
              <span className="dashboard-portal-metric__short">Sync </span>
              {portal.lastSync}
            </p>
          </div>
          <div className="min-w-0 border-l border-hairline pl-2.5 text-right">
            <p className="dashboard-portal-metric__label text-[10px] font-bold uppercase tracking-wide text-slate-text">
              Recebidas hoje
            </p>
            <p className="mt-1 text-[13px] font-bold text-[#16863A] tabular-nums">
              <span className="dashboard-portal-metric__short">Hoje </span>
              {portal.receivedToday}
            </p>
          </div>
        </div>
      </article>
    );
  };

  const renderDesktopPortalRow = (portal: ConnectedPortal) => {
    const style = statusStyles[portal.status];
    const StatusIcon = style.icon;

    return (
      <li
        key={`desktop-${portal.shortName}`}
        className={cn(
          "grid min-h-[66px] grid-cols-[minmax(260px,1.35fr)_minmax(150px,0.62fr)_minmax(170px,0.72fr)_minmax(130px,0.48fr)] items-center gap-5 border-t border-hairline px-4 transition-colors first:border-t-0 hover:bg-slate-50/70",
          portal.status === "Atenção" && "bg-orange-50/45 hover:bg-orange-50/70",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#DCFCE7] bg-white text-[11px] font-bold text-[#16863A] shadow-sm">
            {portal.shortName}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-bold text-ink">{portal.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-[10.5px] font-semibold text-slate-text">
              <Globe2 className="size-3" aria-hidden="true" />
              Portal integrado
            </p>
          </div>
        </div>

        <span
          className={cn(
            "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-bold",
            style.badge,
          )}
        >
          <span className={cn("size-1.5 rounded-full", style.dot)} aria-hidden="true" />
          {portal.status}
        </span>

        <span className="inline-flex items-center gap-2 text-[12px] font-bold text-ink">
          <StatusIcon
            className={cn(
              "size-4 shrink-0",
              portal.status === "Operacional"
                ? "text-[#29C454]"
                : portal.status === "Sincronizando"
                  ? "text-blue-500 motion-safe:animate-spin"
                  : "text-orange-500",
            )}
            aria-hidden="true"
          />
          {portal.lastSync}
        </span>

        <span className="text-right text-[14px] font-bold text-[#16863A] tabular-nums">
          {portal.receivedToday}
        </span>
      </li>
    );
  };

  return (
    <Panel className="dashboard-detail-panel flex min-w-0 flex-col p-4 sm:p-6 xl:col-span-2">
      <PanelHeader
        icon={
          <div className="rounded-lg bg-[#29C454]/10 p-1.5">
            <Link2 className="size-5 text-[#29C454]" strokeWidth={2} aria-hidden="true" />
          </div>
        }
        title="Integrações"
        subtitle="Acompanhe conexões, sincronizações e novas licitações recebidas."
        action={
          <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#29C454]/20 bg-[#29C454]/10 px-3 text-[12px] font-bold text-[#16863A]">
            <span className="size-2 rounded-full bg-[#29C454]" aria-hidden="true" />4 conectados
          </span>
        }
      />

      <div className="dashboard-portal-summary mt-4 flex items-start gap-3 rounded-xl border border-[#DCFCE7] bg-[#F0FDF4]/60 p-3 sm:mt-6 sm:items-center">
        <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-[#DCFCE7] bg-white">
          <CloudDownload className="size-4 text-[#29C454]" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-[#16863A]">Sincronização contínua ativa</p>
          <p className="mt-0.5 text-[12px] font-medium leading-relaxed text-slate-text">
            850 oportunidades recebidas hoje em quatro portais.
          </p>
        </div>
        <span className="hidden rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#16863A] shadow-sm sm:inline-flex">
          Atualizado agora
        </span>
      </div>

      <div className="mt-3 sm:mt-4">
        <MobilePagedList
          items={connectedPortals}
          renderItem={renderPortal}
          getKey={(portal) => portal.shortName}
          ariaLabel="Integrações com portais de licitações"
          pageHasAttention={(items) => items.some((portal) => portal.status === "Atenção")}
          pageClassName="space-y-2.5 divide-y-0"
        />
        <div className="dashboard-portals-grid hidden gap-2.5 md:grid md:gap-3 xl:hidden">
          {connectedPortals.map(renderPortal)}
        </div>
        <div className="hidden overflow-hidden rounded-xl border border-hairline bg-white xl:block">
          <div
            className="grid grid-cols-[minmax(260px,1.35fr)_minmax(150px,0.62fr)_minmax(170px,0.72fr)_minmax(130px,0.48fr)] gap-5 bg-slate-50/80 px-4 py-2.5 text-[9.5px] font-extrabold uppercase tracking-[0.06em] text-slate-text"
            aria-hidden="true"
          >
            <span>Portal</span>
            <span>Status</span>
            <span>Última sincronização</span>
            <span className="text-right">Recebidas hoje</span>
          </div>
          <ul aria-label="Lista compacta de integrações">
            {connectedPortals.map(renderDesktopPortalRow)}
          </ul>
        </div>
      </div>

      <div className="dashboard-detail-footer mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 sm:gap-3 sm:pt-4">
        <p className="text-[12px] font-semibold text-slate-text">
          <strong className="text-[#16863A]">3 operacionais</strong> · 1 requer atenção
        </p>
        <button
          type="button"
          className="dashboard-card-action inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-[13px] font-bold text-[#29C454] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          <span className="dashboard-card-action__full">Gerenciar integrações</span>
          <span className="dashboard-card-action__short">Integrações</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </Panel>
  );
}
