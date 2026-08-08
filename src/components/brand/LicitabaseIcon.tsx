import { cn } from "@/lib/utils";

/**
 * Ícone oficial LicitaBase — Carregado a partir do asset fornecido.
 */
export function LicitabaseIcon({ className }: { className?: string }) {
  return (
    <img
      src="/licitabase-icon.webp"
      alt=""
      width={40}
      height={40}
      className={cn("size-10 object-contain", className)}
      aria-hidden="true"
    />
  );
}
