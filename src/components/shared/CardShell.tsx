import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CardShell({
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
        "flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-border/80",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-6 border-b border-border/50 px-6 py-5">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#29C454]/80">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1.5 text-[16px] font-bold leading-none tracking-tight text-navy">
            {title}
          </h2>
          {description && (
            <p className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-slate-text/90">
              {description}
            </p>
          )}
        </div>
        {action && (
          <button
            type="button"
            className="group -mr-1 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy transition-all hover:bg-navy hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {action}
            <ArrowRight
              className="size-3 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        )}
      </header>

      <div className={cn("flex-1 px-6 py-5", bodyClassName)}>{children}</div>
    </section>
  );
}
