import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-hairline bg-white py-0 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_0_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PanelHeader({
  icon,
  title,
  subtitle,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "panel-header flex flex-wrap items-start justify-between gap-3 sm:gap-4",
        className,
      )}
    >
      <div className="panel-header__main flex min-w-0 flex-1 items-start gap-3">
        {icon ? (
          <span className="panel-header__icon mt-0.5 shrink-0 text-[#29C454]">{icon}</span>
        ) : null}
        <div className="min-w-0">
          <h2 className="panel-header__title text-[16px] font-bold leading-tight tracking-tight text-ink">
            {title}
          </h2>
          {subtitle ? (
            <p className="panel-header__subtitle mt-1 text-[13px] font-medium leading-snug text-slate-text">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="panel-header__action shrink-0 self-center">{action}</div> : null}
    </div>
  );
}

export function ArrowLink({
  children,
  className,
  tone = "brand",
}: {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "muted";
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md text-[12px] font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
        tone === "brand" ? "text-[#29C454] hover:text-[#29C454]" : "text-slate-text hover:text-ink",
        className,
      )}
    >
      <span>{children}</span>
      <ArrowRight className="size-3.5" aria-hidden="true" />
    </button>
  );
}
