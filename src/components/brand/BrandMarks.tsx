import { cn } from "@/lib/utils";
import { LicitabaseIcon } from "./LicitabaseIcon";
import { LicitabaseLogo } from "./LicitabaseLogo";

/**
 * Logotipo oficial LicitaBase (ícone + wordmark).
 * Renderiza o ícone isométrico e o texto com a tipografia Poppins carregada no app.
 */
export function BrandLogo({ className, variant = "default" }: { className?: string, variant?: "default" | "dark" | "light" }) {
  const isDark = variant === "dark";
  const isLight = variant === "light";
  
  return (
    <div className={cn("flex items-center gap-2.5", className)} data-asset="licitabase-logo">
      <LicitabaseIcon className="size-10 shrink-0" />
      <div className="leading-tight">
        <p 
          className={cn(
            "text-[22px] font-semibold tracking-tight", 
            isLight ? "text-white" : "text-[#0B132B]"
          )} 
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          licita<span className={cn(isLight ? "text-white" : "text-[#29C454]")}>base</span>
        </p>
      </div>
      <span className="sr-only">LicitaBase</span>
    </div>
  );
}

export { LicitabaseIcon, LicitabaseLogo };

/** Padrão de marca sutil em baixa opacidade. */
export function BrandPattern({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none select-none overflow-hidden", className)}
    >
      <LicitabaseIcon className="h-full w-full text-brand opacity-[0.06]" />
    </div>
  );
}
