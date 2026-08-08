import { cn } from "@/lib/utils";

type ScoreCircleProps = {
  value: string;
  /** 0..1 fraction of the ring filled */
  progress?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  valueClassName?: string;
  showGradient?: boolean;
};

export function ScoreCircle({
  value,
  progress = 1,
  size = 64,
  strokeWidth = 4,
  className,
  valueClassName,
  showGradient = true,
}: ScoreCircleProps) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const gradientId = `score-gradient-${value.replace(',', '-')}`;

  return (
    <div
      className={cn("relative shrink-0 flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 overflow-visible">
        {showGradient && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        )}
        
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress stroke with optional glow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={showGradient ? `url(#${gradientId})` : "currentColor"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${c * progress} ${c}`}
          style={{ 
            filter: showGradient ? 'drop-shadow(0px 0px 2px currentColor)' : 'none',
            transition: 'stroke-dasharray 1s ease-in-out'
          }}
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 grid place-items-center font-bold tracking-tighter tabular-nums text-current drop-shadow-sm",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}
