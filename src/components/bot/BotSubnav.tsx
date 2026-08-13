import { useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BID_BOT_ROUTES } from "@/lib/bid-bot-fixtures";
import { useAppLayoutState } from "@/components/layout/app-layout-state";
import { cn } from "@/lib/utils";

const botSections = [
  { label: "Visão geral", to: BID_BOT_ROUTES.overview },
  { label: "Disputas", to: BID_BOT_ROUTES.disputes },
  { label: "Monitoramento", to: BID_BOT_ROUTES.monitoring },
  { label: "Relatórios", to: BID_BOT_ROUTES.reports },
  { label: "Histórico", to: BID_BOT_ROUTES.history },
  { label: "Configurações", to: BID_BOT_ROUTES.settings },
] as const;

export function BotSubnav() {
  const currentPath = useRouterState({ select: (state) => state.location.pathname });
  const { sidebarCollapsed } = useAppLayoutState();
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    activeLinkRef.current?.scrollIntoView({
      block: "nearest",
      inline: "center",
    });
  }, [currentPath]);

  return (
    <div
      className={cn(
        "relative z-30 shrink-0 border-b border-hairline bg-white",
        sidebarCollapsed ? "min-[1440px]:block" : "min-[1440px]:hidden",
      )}
    >
      <nav
        aria-label="Seções do Bot de Lances"
        className="flex min-w-0 gap-2 overflow-x-auto px-4 py-2.5 pr-14 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {botSections.map((section) => {
          const active =
            section.to === BID_BOT_ROUTES.overview
              ? currentPath === section.to || currentPath === `${section.to}/`
              : currentPath.startsWith(section.to);

          return (
            <Link
              key={section.to}
              ref={active ? activeLinkRef : undefined}
              to={section.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border px-4 text-[13px] font-semibold transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                active
                  ? "border-[#29C454] bg-[#29C454] text-white shadow-sm"
                  : "border-hairline bg-white text-slate-text hover:border-slate-300 hover:text-ink",
              )}
            >
              {section.label}
            </Link>
          );
        })}
      </nav>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-white via-white/95 to-transparent"
      />
    </div>
  );
}
