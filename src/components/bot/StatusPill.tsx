import { cn } from "@/lib/utils";

const tones = {
  brand: "bg-brand-tint text-brand-strong",
  info: "bg-info-tint text-info",
  warn: "bg-warn-tint text-warn",
  neutral: "bg-navy/5 text-navy",
} as const;

const dashboardTones = {
  brand: "border border-[#29C454]/20 bg-[#29C454]/10 text-[#15943a]",
  info: "border border-blue-100 bg-blue-50 text-blue-700",
  warn: "border border-amber-200 bg-amber-50 text-amber-700",
  neutral: "border border-slate-200 bg-slate-50 text-slate-text",
} as const;

export type StatusTone = keyof typeof tones;
export type StatusVisual = "legacy" | "dash2";

export function StatusPill({
  children,
  tone = "neutral",
  visual = "legacy",
  className,
}: {
  children: React.ReactNode;
  tone?: StatusTone;
  visual?: StatusVisual;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold leading-none",
        visual === "dash2" ? dashboardTones[tone] : tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
