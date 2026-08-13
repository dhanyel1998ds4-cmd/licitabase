import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const botInputClassName =
  "h-11 rounded-xl border-hairline bg-white px-3.5 text-[13px] font-medium text-ink shadow-none placeholder:text-slate-text focus-visible:border-[#29C454] focus-visible:ring-4 focus-visible:ring-[#29C454]/10";

export const botTabsListClassName =
  "h-11 rounded-xl border border-hairline bg-slate-100/70 p-1 text-slate-text";

export const botTabsTriggerClassName =
  "min-h-9 rounded-lg px-3 text-[13px] font-semibold text-slate-text shadow-none focus-visible:ring-[#29C454]/20 data-[state=active]:bg-white data-[state=active]:text-ink data-[state=active]:shadow-sm";

export const botOutlineButtonClassName =
  "rounded-xl border-hairline bg-white text-ink shadow-none hover:bg-slate-50 hover:text-ink focus-visible:ring-[#29C454]/20";

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
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-1 h-8 w-1 shrink-0 rounded-full bg-[#29C454]" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#15943a]">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-[24px] font-bold leading-tight tracking-[-0.025em] text-ink sm:text-[27px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-[68ch] text-[13px] font-medium leading-6 text-slate-text sm:text-[14px]">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {actions ? (
        <div className="flex w-full flex-col gap-2 min-[480px]:flex-row sm:w-auto sm:flex-wrap sm:items-center [&>*]:min-h-11 [&>*]:justify-center [&>*]:rounded-xl [&>*]:shadow-none [&>*]:focus-visible:ring-[#29C454]/20 min-[480px]:[&>*]:flex-1 sm:[&>*]:flex-none">
          {actions}
        </div>
      ) : null}
    </header>
  );
}

const metricToneClass = {
  brand: {
    accent: "bg-[#29C454]",
    surface: "bg-[#29C454]/10",
    value: "text-[#15943a]",
  },
  warn: {
    accent: "bg-orange-500",
    surface: "bg-orange-50",
    value: "text-orange-600",
  },
  navy: {
    accent: "bg-slate-500",
    surface: "bg-slate-100",
    value: "text-ink",
  },
  info: {
    accent: "bg-blue-600",
    surface: "bg-blue-50",
    value: "text-blue-600",
  },
} as const;

export type MetricTone = keyof typeof metricToneClass;

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
  const colors = metricToneClass[tone];

  return (
    <article
      className={cn(
        "group flex min-h-[108px] min-w-0 flex-col rounded-2xl border border-hairline bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.05)] transition-colors hover:border-slate-300 sm:p-5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn("grid size-7 place-items-center rounded-lg", colors.surface)}>
          <span className={cn("size-2 rounded-full", colors.accent)} />
        </span>
        <p className="min-w-0 truncate text-[12px] font-semibold text-ink">{label}</p>
      </div>
      <p
        className={cn(
          "mt-3.5 text-[24px] font-bold leading-none tracking-[-0.025em] tabular-nums sm:text-[26px]",
          colors.value,
        )}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-[11px] font-medium leading-snug text-slate-text">{hint}</p>
      ) : null}
    </article>
  );
}

export function BotPanel({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-hairline bg-white py-0 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_1px_2px_rgba(15,23,42,0.05)] transition-colors hover:border-slate-200 [&_table]:text-ink [&_thead]:bg-slate-50/70 [&_th]:h-11 [&_th]:px-4 [&_th]:text-[11px] [&_th]:font-semibold [&_th]:text-slate-text [&_td]:px-4 [&_td]:py-3 [&_tr]:border-hairline [&_tbody_tr]:hover:bg-slate-50/60",
        className,
      )}
    >
      <header className="grid min-h-[82px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-hairline px-4 py-4 sm:gap-6 sm:px-5">
        <div className="min-w-0 self-center">
          {eyebrow ? (
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#15943a]">
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={cn(
              "text-[16px] font-bold leading-tight tracking-tight text-ink",
              eyebrow && "mt-1",
            )}
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-1.5 max-w-[58ch] text-[12px] font-medium leading-5 text-slate-text sm:text-[13px]">
              {description}
            </p>
          ) : null}
        </div>
        {action ? (
          <button
            type="button"
            className="group inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-2 text-[11px] font-bold text-[#15943a] transition-colors hover:bg-[#29C454]/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
          >
            {action}
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        ) : null}
      </header>
      <div className={cn("min-w-0 flex-1 px-4 py-4 sm:px-5", bodyClassName)}>{children}</div>
    </section>
  );
}

const statusTones = {
  brand: "border-[#29C454]/20 bg-[#29C454]/10 text-[#15943a]",
  info: "border-blue-100 bg-blue-50 text-blue-700",
  warn: "border-amber-200 bg-amber-50 text-amber-700",
  neutral: "border-slate-200 bg-slate-50 text-slate-text",
} as const;

export type StatusTone = keyof typeof statusTones;

export function StatusPill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold leading-none",
        statusTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
