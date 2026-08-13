import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type DashboardTickerItem = {
  id: string;
  label: string;
  compactLabel: string;
  tone?: "green" | "blue" | "orange" | "slate";
  marker?: "up" | "down" | "check" | "dot";
};

type DashboardTickerProps = {
  items: DashboardTickerItem[];
  ariaLabel: string;
  duration?: number;
  delay?: number;
  className?: string;
};

const toneClasses = {
  green: "text-[#15963A]",
  blue: "text-blue-600",
  orange: "text-orange-600",
  slate: "text-slate-text",
} as const;

const markerLabels = { up: "↗", down: "↘", check: "✓", dot: "•" } as const;

export function DashboardTicker({
  items,
  ariaLabel,
  duration = 26,
  delay = 0,
  className,
}: DashboardTickerProps) {
  if (items.length === 0) return null;

  // Repetir a sequência dentro de cada metade mantém a faixa preenchida mesmo
  // em viewports estreitos. As duas metades continuam idênticas, preservando
  // a transição contínua do loop sem saltos.
  const visualItems = [...items, ...items];

  const tickerStyle = {
    "--dashboard-ticker-duration": `${duration * 1.5}s`,
    "--dashboard-ticker-delay": `${delay}s`,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "dashboard-ticker min-w-0 flex-1 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
        className,
      )}
      tabIndex={0}
      role="group"
      aria-label={`${ariaLabel}. A animação pausa quando este conteúdo recebe foco.`}
    >
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>

      <div className="dashboard-ticker__viewport" aria-hidden="true">
        <div className="dashboard-ticker__track" style={tickerStyle}>
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className="dashboard-ticker__group" data-ticker-copy={copyIndex}>
              {visualItems.map((item, itemIndex) => {
                const tone = item.tone ?? "slate";
                const marker = item.marker ?? "dot";

                return (
                  <span
                    key={`${copyIndex}-${item.id}-${itemIndex}`}
                    className="dashboard-ticker__item"
                  >
                    <span
                      className={cn(
                        "dashboard-ticker__marker",
                        toneClasses[tone],
                        marker === "dot" && "text-[13px]",
                      )}
                    >
                      {markerLabels[marker]}
                    </span>
                    <span className="hidden whitespace-nowrap sm:inline">{item.label}</span>
                    <span className="whitespace-nowrap sm:hidden">{item.compactLabel}</span>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
