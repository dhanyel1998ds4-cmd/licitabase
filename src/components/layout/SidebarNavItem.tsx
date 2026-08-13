import { Link } from "@tanstack/react-router";
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
};

function Badge({ children }: { children: number }) {
  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold leading-none text-ink">
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
}: SidebarNavItemProps) {
  const showSubItems =
    !collapsed && !!subItems?.length && !!currentPath && currentPath.startsWith(url);
  const link = (
    <Link
      to={url as "/dash2"}
      aria-current={active ? "page" : undefined}
      aria-label={label}
      className={cn(
        "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-[14px] transition-all border border-transparent",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        collapsed && "justify-center px-2",
        active
          ? "bg-white shadow-sm border border-hairline font-bold text-ink"
          : "font-medium text-slate-text hover:bg-white/50 hover:text-ink",
      )}
    >
      <Icon
        className={cn("size-[18px] shrink-0", active ? "text-ink" : "text-slate-text")}
        strokeWidth={1.7}
        aria-hidden="true"
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && typeof badge === "number" && <Badge>{badge}</Badge>}
    </Link>
  );

  if (collapsed) {
    return (
      <li>
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} className="flex items-center gap-2">
            <span>{label}</span>
            {typeof badge === "number" && <Badge>{badge}</Badge>}
          </TooltipContent>
        </Tooltip>
      </li>
    );
  }

  return (
    <li>
      {link}
      {showSubItems && (
        <ul className="mt-0.5 ml-[26px] flex flex-col gap-0.5 border-l border-hairline pl-3">
          {subItems!.map((sub) => {
            const subActive =
              sub.url === url
                ? currentPath === sub.url || currentPath === `${sub.url}/`
                : currentPath === sub.url || currentPath.startsWith(`${sub.url}/`);
            return (
              <li key={sub.url}>
                <Link
                  to={sub.url as "/dash2"}
                  aria-current={subActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-10 items-center rounded-lg px-2.5 text-[13.5px] transition-all",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    subActive
                      ? "bg-white font-bold text-ink shadow-sm"
                      : "font-medium text-slate-text hover:bg-white/50 hover:text-ink",
                  )}
                >
                  {sub.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
