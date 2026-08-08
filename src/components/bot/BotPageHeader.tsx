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
    <header className="flex flex-wrap items-start justify-between gap-6 py-4">
      <div className="relative">
        <div className="absolute -left-4 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-brand" />
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-strong/70">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-navy">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-[70ch] text-[14px] font-medium text-slate-text/80">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
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
        "rounded-2xl border border-border bg-card px-5 py-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.06)] transition-all hover:border-border/80",
        className,
      )}
    >
      <p className={cn("tnum text-[20px] lg:text-[26px] font-bold leading-none tracking-tight", toneClass[tone])}>
        {value}
      </p>
      <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.12em] text-navy">{label}</p>
      {hint && <p className="mt-1 text-[12px] text-slate-text/80">{hint}</p>}
    </div>
  );
}
