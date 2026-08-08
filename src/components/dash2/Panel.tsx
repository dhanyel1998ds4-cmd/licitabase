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
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {icon ? <span className="mt-0.5 shrink-0 text-[#29C454]">{icon}</span> : null}
        <div className="min-w-0">
          <h2 className="truncate text-[15px] font-bold tracking-tight leading-tight text-ink">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-[12px] font-medium leading-tight text-slate-text">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
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
