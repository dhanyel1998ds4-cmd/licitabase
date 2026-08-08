import type { LucideIcon } from "lucide-react";
import { ArrowLink } from "./Panel";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "@tanstack/react-router";

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
}: SummaryCardProps) {
  const t = toneMap[tone];
  return (
    <article className="group flex flex-col gap-3 rounded-2xl border border-hairline bg-white p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_0_rgba(0,0,0,0.06)] transition-all hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-lg border border-hairline",
              t.bg,
            )}
          >
            <Icon className={cn("size-4", t.icon)} strokeWidth={2} aria-hidden="true" />
          </div>
          <p className="text-[13px] font-medium leading-tight text-ink">{label}</p>
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border",
              trendDir === "up"
                ? "bg-[#29C454]/10 text-[#29C454] border-[#29C454]/20"
                : "bg-orange-50 text-orange-600 border-orange-100",
            )}
          >
            {trendDir === "up" ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {trend}
          </div>
        )}
      </div>

      <div className="mt-1">
        <p
          className={cn(
            "text-[26px] font-bold tracking-tight leading-none tabular-nums",
            t.value,
          )}
        >
          {value}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] font-medium text-slate-text">{hint || "vs. ontem"}</p>
          {link && linkTo ? (
            <Link
              to={linkTo}
              className={cn(
                "text-[11px] font-bold transition-colors",
                t.icon,
                "hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
              )}
            >
              {link} →
            </Link>
          ) : link ? (
            <button
              className={cn(
                "text-[11px] font-bold transition-colors",
                t.icon,
                "hover:opacity-80",
              )}
            >
              {link} →
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
