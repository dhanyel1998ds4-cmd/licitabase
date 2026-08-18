import type { ReactNode } from "react";
import { pageContextLabels, type PageContext } from "@/lib/page-context";
import { cn } from "@/lib/utils";

type PageContextHeaderProps = {
  context: PageContext;
  contextLabel?: string;
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
  actionsClassName?: string;
};

/**
 * Cabeçalho comum da área autenticada. O contexto é limitado aos grupos da
 * Sidebar para que título, rota e navegação usem sempre a mesma linguagem.
 */
export function PageContextHeader({
  context,
  contextLabel,
  title,
  description,
  badge,
  actions,
  className,
  actionsClassName,
}: PageContextHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-1 h-8 w-1 shrink-0 rounded-full bg-[#29C454]" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-strong sm:text-[11px]">
            {contextLabel ?? pageContextLabels[context]}
          </p>
          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2 sm:gap-2.5">
            <h1 className="min-w-0 text-[24px] font-extrabold leading-tight tracking-[-0.025em] text-ink sm:text-[28px]">
              {title}
            </h1>
            {badge ? <span className="shrink-0">{badge}</span> : null}
          </div>
          {description ? (
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-text">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {actions ? (
        <div
          className={cn(
            "flex w-full shrink-0 flex-col gap-2 min-[480px]:flex-row sm:w-auto sm:flex-wrap sm:items-center [&>*]:min-h-11 [&>*]:justify-center [&>*]:rounded-xl [&>*]:shadow-none min-[480px]:[&>*]:flex-1 sm:[&>*]:flex-none",
            actionsClassName,
          )}
        >
          {actions}
        </div>
      ) : null}
    </header>
  );
}
