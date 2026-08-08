import { useEffect, useMemo, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Bot,
  BookmarkCheck,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FolderOpen,
  Gauge,
  KanbanSquare,
  LayoutDashboard,
  LifeBuoy,
  Package,
  PanelLeft,
  PanelLeftDashed,
  Plug,
  ScanSearch,
  Search,
  Settings,
  Swords,
  Tags,
  Users,
} from "lucide-react";
import { SidebarNavItem, type SidebarNavItemProps } from "./SidebarNavItem";
import { BrandLogo, BrandPattern } from "@/components/brand/BrandMarks";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type NavGroup = {
  label?: string;
  items: SidebarNavItemProps[];
};

const navGroups: NavGroup[] = [
  {
    items: [{ icon: LayoutDashboard, label: "Visão geral", url: "/dash2" }],
  },
  {
    label: "Explorar licitações",
    items: [
      { icon: Search, label: "Buscar licitações", url: "/licitacoes/buscar" },
      { icon: Tags, label: "Categorias de interesse", url: "/categorias" },
      { icon: Package, label: "Itens de licitação", url: "/itens" },
      { icon: BookmarkCheck, label: "Filtros salvos", url: "/filtros" },
    ],
  },
  {
    label: "Minha operação",
    items: [
      { icon: ClipboardList, label: "Minhas licitações", url: "/minhas-licitacoes" },
      { icon: KanbanSquare, label: "Pipeline", url: "/pipeline" },
      {
        icon: Bot,
        label: "Bot de Lances",
        url: "/bot-lances",
        badge: 2,
        subItems: [
          { label: "Visão geral", url: "/bot-lances" },
          { label: "Disputas", url: "/bot-lances/disputas" },
          { label: "Monitoramento", url: "/bot-lances/monitoramento" },
          { label: "Relatórios", url: "/bot-lances/relatorios" },
          { label: "Histórico", url: "/bot-lances/historico" },
          { label: "Configurações", url: "/bot-lances/configuracoes" },
        ],
      },
      { icon: FolderOpen, label: "Documentos", url: "/documentos" },
    ],
  },
  {
    label: "Inteligência",
    items: [
      { icon: ScanSearch, label: "Raio-X", url: "/raio-x" },
      { icon: Gauge, label: "Score dos Órgãos", url: "/score-orgaos" },
      { icon: Building2, label: "Empresas monitoradas", url: "/empresas-monitoradas" },
      { icon: Swords, label: "Concorrentes", url: "/concorrentes" },
      { icon: BarChart3, label: "Relatórios", url: "/relatorios" },
    ],
  },
  {
    label: "Gestão",
    items: [
      { icon: Users, label: "Equipe", url: "/equipe" },
      { icon: Plug, label: "Integrações", url: "/integracoes" },
      { icon: CreditCard, label: "Planos", url: "/planos" },
    ],
  },
];

const footerNav: SidebarNavItemProps[] = [
  { icon: Bell, label: "Alertas", url: "/alertas", badge: 3 },
  { icon: Settings, label: "Configurações pessoais", url: "/configuracoes" },
  { icon: LifeBuoy, label: "Ajuda e suporte", url: "/ajuda" },
];

type SidebarProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) => currentPath === url;

  const activeGroupLabel = useMemo(() => {
    return navGroups.find((g) => g.items.some((i) => currentPath.startsWith(i.url)))?.label ?? null;
  }, [currentPath]);

  const [openGroup, setOpenGroup] = useState<string | null>("Explorar licitações");

  useEffect(() => {
    if (activeGroupLabel) {
      setOpenGroup(activeGroupLabel);
    }
  }, [activeGroupLabel]);

  const toggleGroup = (label: string) => {
    setOpenGroup((current) => (current === label ? null : label));
  };

  const isGroupOpen = (label: string) => openGroup === label;
  const isDashboardActive = currentPath.startsWith("/dash2");

  return (
    <nav
      aria-label="Navegação principal"
      className={cn(
        "relative flex h-full flex-col overflow-hidden bg-[#F8FAFC] border-r border-hairline pb-6 pt-8 transition-all",
        collapsed ? "w-[80px] px-3" : "w-full px-5",
      )}
    >
      <div
        className={cn(
          "mb-6 flex items-center",
          collapsed ? "justify-center" : "justify-between px-1",
        )}
      >
        {!collapsed && <BrandLogo variant="dark" />}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
          title={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
          className="flex size-9 items-center justify-center rounded-lg text-navy hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {collapsed ? (
            <PanelLeftDashed className="size-5" aria-hidden="true" />
          ) : (
            <PanelLeft className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {!collapsed && (
        <div
          className={cn(
            "mb-5 rounded-xl border border-hairline bg-white/50 px-3 py-2.5 transition-all hover:bg-white hover:shadow-sm",
            isDashboardActive
              ? "border-slate-200 bg-white shadow-sm"
              : "border-hairline bg-transparent",
          )}
        >
          <p
            className={cn(
              "text-[10.5px] font-medium uppercase tracking-[0.12em]",
              isDashboardActive ? "text-brand-strong" : "text-muted-foreground",
            )}
          >
            Workspace
          </p>
          <p className="mt-0.5 truncate text-[14.5px] font-medium text-navy">Iridia Soluções</p>
        </div>
      )}

      {collapsed && (
        <div className="mb-5 flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl border border-hairline transition-all hover:bg-white hover:shadow-sm",
                  isDashboardActive
                    ? "border-slate-200 bg-white shadow-sm"
                    : "border-hairline bg-transparent",
                )}
              >
                <span
                  className={cn(
                    "text-[11px] font-semibold",
                    isDashboardActive ? "text-brand-strong" : "text-navy",
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

      <ul className="flex flex-col gap-0.5">
        {navGroups[0]!.items.map((item) => (
          <SidebarNavItem
            key={item.label}
            {...item}
            active={isActive(item.url)}
            collapsed={collapsed}
          />
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-5">
        {navGroups.slice(1).map((group) => {
          const groupLabel = group.label!;
          const groupActive = activeGroupLabel === groupLabel;
          return (
            <div key={groupLabel}>
              {collapsed ? (
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "mb-2 flex w-full items-center justify-center rounded-lg px-2 py-2",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          groupActive ? "bg-brand-tint/70" : "bg-navy/[0.05]",
                        )}
                        tabIndex={0}
                        role="separator"
                        aria-label={groupLabel}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            groupActive ? "bg-brand" : "bg-brand-strong",
                          )}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {groupLabel}
                    </TooltipContent>
                  </Tooltip>
                  <ul className="flex flex-col gap-1">
                    {group.items.map((item) => (
                      <SidebarNavItem
                        key={item.label}
                        {...item}
                        active={isActive(item.url)}
                        collapsed={collapsed}
                        currentPath={currentPath}
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
                        "relative mb-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-all border border-transparent",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        groupActive
                          ? "bg-white shadow-sm border border-hairline"
                          : "bg-transparent hover:bg-white/50",
                      )}
                      aria-expanded={isGroupOpen(groupLabel)}
                    >
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full transition-opacity",
                          groupActive ? "bg-brand opacity-100" : "bg-transparent opacity-0",
                        )}
                      />
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          groupActive ? "bg-brand" : "bg-brand-strong",
                        )}
                      />
                      <span
                        className={cn(
                          "flex-1 text-[11px] font-semibold uppercase tracking-[0.1em]",
                          groupActive ? "text-brand-strong" : "text-navy",
                        )}
                      >
                        {groupLabel}
                      </span>
                      {isGroupOpen(groupLabel) ? (
                        <ChevronDown
                          className={cn(
                            "size-3.5 shrink-0",
                            groupActive ? "text-brand-strong" : "text-navy/70",
                          )}
                          aria-hidden="true"
                        />
                      ) : (
                        <ChevronRight
                          className={cn(
                            "size-3.5 shrink-0",
                            groupActive ? "text-brand-strong" : "text-navy/70",
                          )}
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
                          active={isActive(item.url)}
                          collapsed={collapsed}
                          currentPath={currentPath}
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

      <hr className="my-5 border-t border-border" />

      <ul className="flex flex-col gap-0.5 pb-2">
        {footerNav.map((item) => (
          <SidebarNavItem
            key={item.label}
            {...item}
            active={isActive(item.url)}
            collapsed={collapsed}
          />
        ))}
      </ul>

      <BrandPattern
        className={cn(
          "pointer-events-none absolute -bottom-6 -left-10 -z-10 h-48 w-48",
          collapsed && "opacity-20",
        )}
      />
    </nav>
  );
}
