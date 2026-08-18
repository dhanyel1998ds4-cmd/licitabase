import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, PanelLeft, PanelLeftDashed } from "lucide-react";
import { SidebarNavItem, type SidebarNavItemProps } from "./SidebarNavItem";
import { BrandLogo, BrandPattern } from "@/components/brand/BrandMarks";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SidebarUtilityCards } from "./SidebarUtilityCards";
import { getGlobalSearchItem } from "@/lib/global-search-catalog";

type NavGroup = {
  label?: string;
  items: SidebarNavItemProps[];
};

function navigationItem(
  id: string,
  fallbackUrl: string,
  extras: Partial<SidebarNavItemProps> = {},
): SidebarNavItemProps {
  const catalogItem = getGlobalSearchItem(id);
  if (!catalogItem) throw new Error(`Item de navegação não encontrado no catálogo: ${id}`);

  return {
    icon: catalogItem.icon,
    label: catalogItem.navigationLabel ?? catalogItem.title,
    url: catalogItem.route ?? fallbackUrl,
    ...extras,
  };
}

function navigationSubItem(id: string, fallbackUrl: string) {
  const catalogItem = getGlobalSearchItem(id);
  if (!catalogItem) throw new Error(`Subitem de navegação não encontrado no catálogo: ${id}`);
  return {
    label: catalogItem.navigationLabel ?? catalogItem.title,
    url: catalogItem.route ?? fallbackUrl,
  };
}

const navGroups: NavGroup[] = [
  {
    items: [navigationItem("dashboard-home", "/dash2")],
  },
  {
    label: "Explorar licitações",
    items: [
      navigationItem("search-bids", "/licitacoes/buscar"),
      navigationItem("interest-categories", "/categorias"),
      navigationItem("bid-items", "/itens"),
      navigationItem("saved-filters", "/filtros"),
      navigationItem("favorites", "/dash2/oportunidades/favoritos"),
    ],
  },
  {
    label: "Minha operação",
    items: [
      navigationItem("my-bids", "/dash2/operacao/minhas-licitacoes"),
      navigationItem("operation-pipeline", "/pipeline"),
      navigationItem("bid-bot-home", "/bot-lances", {
        badge: 2,
        subItems: [
          { ...navigationSubItem("bid-bot-home", "/bot-lances"), label: "Visão geral" },
          navigationSubItem("bid-bot-disputes", "/bot-lances/disputas"),
          navigationSubItem("bid-bot-monitoring", "/bot-lances/monitoramento"),
          navigationSubItem("bid-bot-reports", "/bot-lances/relatorios"),
          navigationSubItem("bid-bot-history", "/bot-lances/historico"),
          navigationSubItem("bid-bot-settings", "/bot-lances/configuracoes"),
        ],
      }),
      navigationItem("documents", "/documentos"),
    ],
  },
  {
    label: "Inteligência",
    items: [
      navigationItem("bid-xray", "/raio-x"),
      navigationItem("agency-score", "/score-orgaos"),
      navigationItem("monitored-companies", "/empresas-monitoradas"),
      navigationItem("competitors", "/concorrentes"),
      navigationItem("company-reports", "/relatorios"),
    ],
  },
  {
    label: "Gestão",
    items: [
      navigationItem("team-permissions", "/equipe"),
      navigationItem("integrations", "/integracoes"),
      navigationItem("email-templates", "/dash2/gestao/templates-emails"),
      navigationItem("billing-plan", "/planos"),
    ],
  },
];

type SidebarProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  showCollapseToggle?: boolean;
};

type ActiveIndicatorLayout = {
  top: number;
  height: number;
};

export function Sidebar({
  collapsed = false,
  onToggleCollapse,
  showCollapseToggle = true,
}: SidebarProps) {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string, hasSubItems = false) =>
    currentPath === url || (hasSubItems && currentPath.startsWith(`${url}/`));

  const activeGroupLabel = useMemo(() => {
    return (
      navGroups.slice(1).find((g) => g.items.some((i) => currentPath.startsWith(i.url)))?.label ??
      null
    );
  }, [currentPath]);

  const [openGroup, setOpenGroup] = useState<string | null>("Explorar licitações");
  const [activeIndicator, setActiveIndicator] = useState<ActiveIndicatorLayout | null>(null);

  const reportActiveIndicator = useCallback((next: ActiveIndicatorLayout) => {
    setActiveIndicator((current) => {
      if (
        current &&
        Math.abs(current.top - next.top) < 0.5 &&
        Math.abs(current.height - next.height) < 0.5
      ) {
        return current;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (activeGroupLabel) {
      setOpenGroup(activeGroupLabel);
    }
  }, [activeGroupLabel]);

  const toggleGroup = (label: string) => {
    setOpenGroup((current) => (current === label ? null : label));
  };

  const isGroupOpen = (label: string) => openGroup === label;
  const isDashboardActive =
    currentPath.startsWith("/dash2") || currentPath.startsWith("/bot-lances");

  return (
    <nav
      aria-label="Navegação principal"
      data-sidebar-surface
      className={cn(
        "relative flex h-full flex-col overflow-hidden border-0 bg-[radial-gradient(circle_at_100%_0%,rgba(41,196,84,0.20),transparent_34%),linear-gradient(180deg,#06351e_0%,#042819_100%)] pb-3 pt-5 transition-all",
        collapsed ? "w-[80px] px-3" : "w-full px-5",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "sidebar-active-indicator",
          collapsed ? "sidebar-active-indicator--compact" : "sidebar-active-indicator--connected",
          activeIndicator ? "sidebar-active-indicator--ready" : "",
        )}
        style={
          activeIndicator
            ? {
                height: `${activeIndicator.height}px`,
                transform: `translate3d(0, ${activeIndicator.top}px, 0)`,
              }
            : undefined
        }
      />
      <div
        className={cn(
          "sidebar-brand-row flex items-center",
          collapsed ? "mb-4 justify-center" : "mb-5 justify-between px-1",
        )}
      >
        {!collapsed && <BrandLogo variant="light" />}
        {showCollapseToggle ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
            title={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
            className="flex size-11 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
          >
            {collapsed ? (
              <PanelLeftDashed className="size-5" aria-hidden="true" />
            ) : (
              <PanelLeft className="size-5" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>

      {!collapsed && (
        <div
          className={cn(
            "sidebar-workspace mb-4 rounded-xl border border-white/15 bg-white/[0.07] px-3 py-2 transition-all hover:bg-white/[0.11]",
            isDashboardActive
              ? "border-[#29C454]/55 bg-[#29C454]/12"
              : "border-white/15 bg-transparent",
          )}
        >
          <p
            className={cn(
              "text-[11.5px] font-medium uppercase tracking-[0.1em]",
              isDashboardActive ? "text-[#6cf08f]" : "text-white/55",
            )}
          >
            Workspace
          </p>
          <p className="mt-0.5 truncate text-[14.5px] font-medium text-white">Iridia Soluções</p>
        </div>
      )}

      {collapsed && (
        <div className="mb-3 flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl border border-white/15 transition-all hover:bg-white/10",
                  isDashboardActive
                    ? "border-[#29C454]/55 bg-[#29C454]/12"
                    : "border-white/15 bg-transparent",
                )}
              >
                <span
                  className={cn(
                    "text-[11px] font-semibold",
                    isDashboardActive ? "text-[#6cf08f]" : "text-white",
                  )}
                >
                  IS
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Workspace — Iridia Soluções
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <div className="sidebar-navigation min-h-0 flex-1 overflow-hidden">
        <ul className="flex flex-col gap-0.5">
          {navGroups[0]!.items.map((item) => (
            <SidebarNavItem
              key={item.label}
              {...item}
              active={isActive(item.url, Boolean(item.subItems?.length))}
              collapsed={collapsed}
              inverted
              onActiveLayout={reportActiveIndicator}
              sharedIndicatorReady={Boolean(activeIndicator)}
            />
          ))}
        </ul>

        <div className={cn("flex flex-col", collapsed ? "mt-3 gap-2.5" : "mt-4 gap-4")}>
          {navGroups.slice(1).map((group) => {
            const groupLabel = group.label!;
            const groupActive = activeGroupLabel === groupLabel;
            const groupOpen = isGroupOpen(groupLabel);
            return (
              <div key={groupLabel}>
                {collapsed ? (
                  <div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "mb-1 flex h-6 w-full items-center justify-center rounded-lg px-2",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                            groupActive ? "bg-transparent" : "bg-white/[0.08]",
                          )}
                          tabIndex={0}
                          role="separator"
                          aria-label={groupLabel}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              groupActive ? "bg-[#18B849]" : "bg-white/55",
                            )}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8}>
                        {groupLabel}
                      </TooltipContent>
                    </Tooltip>
                    <ul className="flex flex-col gap-0.5">
                      {group.items.map((item) => (
                        <SidebarNavItem
                          key={item.label}
                          {...item}
                          active={isActive(item.url, Boolean(item.subItems?.length))}
                          collapsed={collapsed}
                          currentPath={currentPath}
                          inverted
                          onActiveLayout={reportActiveIndicator}
                          sharedIndicatorReady={Boolean(activeIndicator)}
                        />
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Collapsible
                    open={isGroupOpen(groupLabel)}
                    onOpenChange={() => toggleGroup(groupLabel)}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "sidebar-group-trigger relative mb-1 flex min-h-11 w-full items-center gap-2 overflow-hidden rounded-xl border border-transparent px-3 py-2 text-left transition-all duration-200",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          "bg-transparent hover:bg-white/10",
                        )}
                        aria-expanded={groupOpen}
                      >
                        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-transparent opacity-0 transition-opacity" />
                        <span
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200",
                            groupOpen ? "bg-[#18B849]" : "bg-white/55",
                          )}
                        />
                        <span className="flex-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-white/85">
                          {groupLabel}
                        </span>
                        {groupOpen ? (
                          <ChevronDown
                            className="size-3.5 shrink-0 text-white/55"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronRight
                            className="size-3.5 shrink-0 text-white/55"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="flex flex-col gap-0.5">
                        {group.items.map((item) => (
                          <SidebarNavItem
                            key={item.label}
                            {...item}
                            active={isActive(item.url, Boolean(item.subItems?.length))}
                            collapsed={collapsed}
                            currentPath={currentPath}
                            inverted
                            onActiveLayout={reportActiveIndicator}
                            sharedIndicatorReady={Boolean(activeIndicator)}
                          />
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <hr className="mt-3 border-t border-white/15" />
      <SidebarUtilityCards collapsed={collapsed} />

      <BrandPattern
        className={cn(
          "pointer-events-none absolute -bottom-6 -left-10 -z-10 h-48 w-48",
          collapsed && "opacity-20",
        )}
      />
    </nav>
  );
}
