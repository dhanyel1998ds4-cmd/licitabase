import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Dark-page frame around a real (light) dashboard screen.
 * Purely presentational: no navigation, no data fetching.
 */
export function ProductPreviewFrame({
  label,
  children,
  className,
  featured = false,
  scale = 1,
  active = false,
  onSelect,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  featured?: boolean;
  scale?: number;
  active?: boolean;
  onSelect?: () => void;
}) {
  const content = (
    <div
      className="bidbot-product-frame__content h-full"
      style={
        scale !== 1
          ? {
              transform: `scale(${scale})`,
              width: `calc(100% / ${scale})`,
              height: `calc(100% / ${scale})`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );

  const classes = cn(
    "bidbot-product-frame",
    featured && "bidbot-product-frame--featured",
    active && "bidbot-product-frame--active",
    className,
  );

  if (!onSelect) {
    return (
      <div className={classes} aria-label={label}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`Ver ${label}`}
      className={cn(classes, "bidbot-product-frame--button text-left")}
    >
      {content}
    </button>
  );
}
