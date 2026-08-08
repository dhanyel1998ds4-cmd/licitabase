import { cn } from "@/lib/utils";

const tones = {
  brand: "bg-brand-tint text-brand-strong",
  info: "bg-info-tint text-info",
  warn: "bg-warn-tint text-warn",
  neutral: "bg-navy/5 text-navy",
} as const;

export type StatusTone = keyof typeof tones;

export function StatusPill({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function disputeStatusTone(status: string): StatusTone {
  if (status === "Ativa") return "brand";
  if (status === "Aguardando") return "warn";
  if (status === "Finalizada") return "info";
  return "neutral";
}
