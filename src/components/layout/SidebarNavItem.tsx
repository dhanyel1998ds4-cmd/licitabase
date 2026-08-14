import { Link } from "@tanstack/react-router";
import { useLayoutEffect, useRef, type RefObject } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type SidebarNavItemProps = {
  icon: LucideIcon;
  label: string;
  url: string;
  active?: boolean;
  badge?: number;
  collapsed?: boolean;
  subItems?: { label: string; url: string }[];
  currentPath?: string;
  inverted?: boolean;
  onActiveLayout?: ((layout: { top: number; height: number }) => void) | undefined;
  sharedIndicatorReady?: boolean;
};

function useActiveIndicatorLayout({
  active,
  element,
  onActiveLayout,
}: {
  active: boolean;
  element: RefObject<HTMLAnchorElement | null>;
  onActiveLayout?: ((layout: { top: number; height: number }) => void) | undefined;
}) {
  useLayoutEffect(() => {
    if (!active || !onActiveLayout || !element.current) return;

    const target = element.current;
    const surface = target.closest<HTMLElement>("[data-sidebar-surface]");
    if (!surface) return;

    const measure = () => {
      const targetRect = target.getBoundingClientRect();
      const surfaceRect = surface.getBoundingClientRect();
      onActiveLayout({
        top: targetRect.top - surfaceRect.top,
        height: targetRect.height,
      });
    };

    // Mede ainda no layout effect para que a rota inicial já pinte com o item
    // ativo no lugar, sem um deslocamento perceptível ao carregar a dashboard.
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active, element, onActiveLayout]);
}

function Badge({ children, inverted = false }: { children: number; inverted?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
        inverted ? "bg-white/15 text-white" : "bg-slate-100 text-ink",
      )}
    >
      {children}
    </span>
  );
}

export function SidebarNavItem({
  icon: Icon,
  label,
  url,
  active = false,
  badge,
  collapsed = false,
  subItems,
  currentPath,
  inverted = false,
  onActiveLayout,
  sharedIndicatorReady = false,
}: SidebarNavItemProps) {
  const showSubItems =
    !collapsed && !!subItems?.length && !!currentPath && currentPath.startsWith(url);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const indicatorActive = active && !showSubItems;
  useActiveIndicatorLayout({ active: indicatorActive, element: linkRef, onActiveLayout });
  const activeItemClass =
    inverted && !collapsed && showSubItems
      ? "z-20 border-transparent bg-transparent font-bold text-[#6cf08f] shadow-none"
      : inverted && !collapsed
        ? sharedIndicatorReady
          ? "sidebar-nav-item--active z-20 w-[calc(100%+1.25rem)] !overflow-visible rounded-r-none border-transparent bg-transparent font-bold text-ink shadow-none"
          : "sidebar-nav-item--fallback-connected z-20 w-[calc(100%+1.25rem)] !overflow-visible rounded-r-none border-white bg-white font-bold text-ink shadow-none"
        : sharedIndicatorReady
          ? "sidebar-nav-item--active z-20 border-transparent bg-transparent font-bold text-brand-strong shadow-none"
          : "sidebar-nav-item--fallback-compact z-20 border-[#c8ead2] bg-[#eaf3ed] font-bold text-brand-strong shadow-none";
  const link = (
    <Link
      ref={linkRef}
      to={url as "/dash2"}
      aria-current={active ? "page" : undefined}
      aria-label={label}
      className={cn(
        "sidebar-nav-link relative flex min-h-11 w-full items-center gap-3 overflow-hidden rounded-xl border border-transparent px-3 text-[14px] transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        collapsed && "!min-h-9 justify-center px-2",
        active
          ? activeItemClass
          : inverted
            ? "font-medium text-white/70 hover:bg-white/10 hover:text-white"
            : "font-medium text-slate-text hover:bg-white/50 hover:text-ink",
      )}
    >
      <Icon
        className={cn(
          "relative z-10 size-[18px] shrink-0",
          active
            ? inverted && (collapsed || showSubItems)
              ? "text-[#6cf08f]"
              : "text-brand-strong"
            : inverted
              ? "text-white/65"
              : "text-slate-text",
        )}
        strokeWidth={1.7}
        aria-hidden="true"
      />
      {!collapsed && <span className="relative z-10 truncate">{label}</span>}
      {!collapsed && typeof badge === "number" && (
        <span className="relative z-10">
          <Badge inverted={inverted && !active}>{badge}</Badge>
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <li>
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} className="flex items-center gap-2">
            <span>{label}</span>
            {typeof badge === "number" && <Badge inverted={inverted && !active}>{badge}</Badge>}
          </TooltipContent>
        </Tooltip>
      </li>
    );
  }

  return (
    <li>
      {link}
      {showSubItems && (
        <ul className="ml-[30px] mt-0.5 flex flex-col gap-0.5 pl-2">
          {subItems!.map((sub) => {
            const subActive =
              sub.url === url
                ? currentPath === sub.url || currentPath === `${sub.url}/`
                : currentPath === sub.url || currentPath.startsWith(`${sub.url}/`);
            return (
              <SidebarSubNavItem
                key={sub.url}
                url={sub.url}
                label={sub.label}
                active={subActive}
                inverted={inverted}
                onActiveLayout={onActiveLayout}
                sharedIndicatorReady={sharedIndicatorReady}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
}

function SidebarSubNavItem({
  url,
  label,
  active,
  inverted,
  onActiveLayout,
  sharedIndicatorReady,
}: {
  url: string;
  label: string;
  active: boolean;
  inverted: boolean;
  onActiveLayout?: ((layout: { top: number; height: number }) => void) | undefined;
  sharedIndicatorReady: boolean;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  useActiveIndicatorLayout({ active, element: linkRef, onActiveLayout });

  return (
    <li>
      <Link
        ref={linkRef}
        to={url as "/dash2"}
        aria-current={active ? "page" : undefined}
        className={cn(
          "sidebar-nav-sub-link relative z-20 flex min-h-10 items-center overflow-hidden rounded-lg px-2.5 text-[13.5px] transition-all duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          active
            ? sharedIndicatorReady
              ? "sidebar-nav-item--active border-transparent bg-transparent font-bold text-brand-strong shadow-none"
              : "sidebar-nav-item--fallback-compact border-[#c8ead2] bg-[#eaf3ed] font-bold text-brand-strong shadow-none"
            : inverted
              ? "font-medium text-white/65 hover:bg-white/10 hover:text-white"
              : "font-medium text-slate-text hover:bg-white/50 hover:text-ink",
        )}
      >
        <span className="relative z-10">{label}</span>
      </Link>
    </li>
  );
}
