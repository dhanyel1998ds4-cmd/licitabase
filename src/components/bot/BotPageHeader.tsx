import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BotPageHeader({
  eyebrow = "Bot de Lances",
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col items-start justify-between gap-5 py-2 sm:flex-row sm:gap-6 sm:py-4">
      <div className="relative min-w-0 pl-3 sm:pl-0">
        <div className="absolute left-0 top-1/2 h-9 w-1 -translate-y-1/2 rounded-full bg-brand sm:-left-4" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-strong/80">
          {eyebrow}
        </p>
        <h1 className="mt-1.5 text-[clamp(26px,3vw,32px)] font-bold leading-tight tracking-[-0.025em] text-navy">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-[70ch] text-[14px] font-medium leading-relaxed text-slate-text sm:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex w-full flex-col gap-2 min-[480px]:flex-row sm:w-auto sm:flex-wrap sm:items-center [&>*]:min-h-11 [&>*]:justify-center min-[480px]:[&>*]:flex-1 sm:[&>*]:min-h-9 sm:[&>*]:flex-none">
          {actions}
        </div>
      )}
    </header>
  );
}

const toneClass = {
  brand: "text-brand-strong",
  warn: "text-warn",
  navy: "text-navy",
  info: "text-info",
} as const;

export type MetricTone = keyof typeof toneClass;

export function MetricCard({
  value,
  label,
  hint,
  tone = "navy",
  className,
}: {
  value: string;
  label: string;
  hint?: string;
  tone?: MetricTone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-[118px] rounded-2xl border border-border bg-card px-4 py-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.06)] transition-all hover:border-border/80 sm:px-5 sm:py-5",
        className,
      )}
    >
      <p
        className={cn(
          "tnum text-[24px] font-bold leading-none tracking-tight lg:text-[26px]",
          toneClass[tone],
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-[13px] font-bold uppercase tracking-[0.08em] text-navy">{label}</p>
      {hint && <p className="mt-1 text-[13px] leading-snug text-slate-text">{hint}</p>}
    </div>
  );
}
