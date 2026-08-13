import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { DashboardTicker, type DashboardTickerItem } from "@/components/dash2/DashboardTicker";
import { cn } from "@/lib/utils";

type SummaryTicker = {
  items: DashboardTickerItem[];
  ariaLabel: string;
  duration?: number;
  delay?: number;
};

export type SummaryCardProps = {
  icon: LucideIcon;
  tone: "green" | "blue" | "purple" | "orange";
  value: string;
  label: string;
  hint?: string;
  link?: string;
  linkTo?: "/dash2/oportunidades/novas";
  trend?: string;
  trendDir?: "up" | "down";
  ticker?: SummaryTicker;
  className?: string;
};

const toneMap = {
  green: { bg: "bg-[#29C454]/10", icon: "text-[#29C454]", value: "text-[#29C454]" },
  blue: { bg: "bg-blue-50", icon: "text-blue-600", value: "text-blue-600" },
  purple: { bg: "bg-purple-50", icon: "text-purple-600", value: "text-purple-600" },
  orange: { bg: "bg-orange-50", icon: "text-orange-600", value: "text-orange-600" },
} as const;

export function SummaryCard({
  icon: Icon,
  tone,
  value,
  label,
  hint,
  link,
  linkTo,
  trend,
  trendDir = "up",
  ticker,
  className,
}: SummaryCardProps) {
  const t = toneMap[tone];

  const action = link ? (
    linkTo ? (
      <Link
        to={linkTo}
        className={cn(
          "inline-flex shrink-0 items-center whitespace-nowrap rounded-md px-1 text-[10px] font-bold transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#29C454] sm:text-[11px]",
          ticker ? "min-h-6" : "min-h-11 rounded-lg px-2 text-[12px]",
          t.icon,
        )}
      >
        <span className="summary-card__action-full">{link} →</span>
        <span className="summary-card__action-compact">Todas →</span>
      </Link>
    ) : (
      <button
        type="button"
        aria-label={`${link}: ${label}`}
        className={cn(
          "inline-flex shrink-0 items-center whitespace-nowrap rounded-md px-1 text-[10px] font-bold transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#29C454] sm:text-[11px]",
          ticker ? "min-h-6" : "min-h-11 rounded-lg px-2 text-[12px]",
          t.icon,
        )}
      >
        <span className="summary-card__action-full">{link} →</span>
        <span className="summary-card__action-compact">Todas →</span>
      </button>
    )
  ) : null;

  return (
    <article
      className={cn(
        "summary-card group flex min-w-0 flex-col gap-3 rounded-2xl border border-hairline bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_0_rgba(0,0,0,0.06)] transition-all hover:border-slate-300 sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-lg border border-hairline",
              t.bg,
            )}
          >
            <Icon className={cn("size-4", t.icon)} strokeWidth={2} aria-hidden="true" />
          </div>
          <p className="text-[14px] font-semibold leading-tight text-ink">{label}</p>
        </div>
        {trend && (
          <div
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-bold",
              trendDir === "up"
                ? "border-[#29C454]/20 bg-[#29C454]/10 text-[#29C454]"
                : "border-orange-100 bg-orange-50 text-orange-600",
            )}
          >
            {trendDir === "up" ? (
              <TrendingUp className="size-3" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-3" aria-hidden="true" />
            )}
            {trend}
          </div>
        )}
      </div>

      <div className="mt-1">
        <p
          className={cn(
            "text-[24px] font-bold leading-none tracking-tight tabular-nums sm:text-[26px]",
            t.value,
          )}
        >
          {value}
        </p>
        <div className="mt-2 flex min-h-6 items-center justify-between">
          <p className="text-[12px] font-medium leading-tight text-slate-text">
            {hint || "vs. ontem"}
          </p>
          {!ticker && action}
        </div>

        {ticker && (
          <div className="mt-1 grid min-h-7 w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-1 border-t border-hairline pt-1">
            <DashboardTicker
              items={ticker.items}
              ariaLabel={ticker.ariaLabel}
              {...(ticker.duration !== undefined ? { duration: ticker.duration } : {})}
              {...(ticker.delay !== undefined ? { delay: ticker.delay } : {})}
            />
            {action}
          </div>
        )}
      </div>
    </article>
  );
}
