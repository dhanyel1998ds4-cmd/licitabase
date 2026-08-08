import { cn } from "@/lib/utils";

/**
 * Logotipo oficial LicitaBase em SVG — ícone isométrico + wordmark.
 * Use quando for necessário um único asset vetorial (ex: imagem OG, exportação).
 */
export function LicitabaseLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      aria-label="LicitaBase"
      role="img"
    >
      <defs>
        <linearGradient id="lbf-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3DDB6A" />
          <stop offset="100%" stopColor="#29C454" />
        </linearGradient>
        <linearGradient id="lbf-top" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5CEB87" />
          <stop offset="100%" stopColor="#3DDB6A" />
        </linearGradient>
        <linearGradient id="lbf-side" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1FA33F" />
          <stop offset="100%" stopColor="#157A2F" />
        </linearGradient>
        <filter id="lbf-shadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Ícone L */}
      <g transform="translate(0, 4) scale(0.32)" filter="url(#lbf-shadow)" strokeLinejoin="round">
        <path d="M18 88 L92 88 L92 58 L48 58 L48 18 L18 18 Z" fill="url(#lbf-front)" stroke="url(#lbf-front)" strokeWidth="0.5" />
        <path d="M48 88 L64 72 L64 2 L48 18 Z" fill="url(#lbf-side)" stroke="url(#lbf-side)" strokeWidth="0.5" />
        <path d="M92 88 L108 72 L108 42 L92 58 Z" fill="url(#lbf-side)" stroke="url(#lbf-side)" strokeWidth="0.5" />
        <path d="M18 18 L48 18 L64 2 L34 2 Z" fill="url(#lbf-top)" stroke="url(#lbf-top)" strokeWidth="0.5" />
        <path d="M48 58 L92 58 L108 42 L64 42 Z" fill="url(#lbf-top)" stroke="url(#lbf-top)" strokeWidth="0.5" />
      </g>

      {/* Wordmark */}
      <text
        x="44"
        y="32"
        fontFamily="Poppins, sans-serif"
        fontSize="26"
        fontWeight="600"
        fill="#0F172A"
      >
        licita
      </text>
      <text
        x="106"
        y="32"
        fontFamily="Poppins, sans-serif"
        fontSize="26"
        fontWeight="600"
        fill="#29C454"
      >
        base
      </text>

      {/* Tagline */}
      <text
        x="44"
        y="44"
        fontFamily="Poppins, sans-serif"
        fontSize="7"
        fontWeight="500"
        letterSpacing="0.14em"
        fill="#64748B"
      >
        INTELIGÊNCIA EM LICITAÇÕES PÚBLICAS
      </text>
    </svg>
  );
}
