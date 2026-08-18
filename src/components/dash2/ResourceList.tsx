import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Estrutura comum para listas internas: conteúdo flexível à esquerda, metadados
 * previsíveis no desktop e ações sempre presas ao mesmo trilho à direita.
 */
export function ResourceList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("divide-y divide-hairline", className)}>{children}</div>;
}

export function ResourceListRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "p-4 transition-colors hover:bg-page/[0.42] focus-within:bg-page/[0.42] sm:p-5",
        className,
      )}
    >
      {children}
    </article>
  );
}

export function ResourceListColumns({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Cabeçalho de uma lista operacional no desktop. Ao declarar a mesma grade no
 * cabeçalho e em cada linha, metadados e ações deixam de "flutuar" conforme o
 * conteúdo da primeira coluna muda.
 */
export function ResourceListGridHeader({
  children,
  gridTemplateColumns,
  className,
}: {
  children: ReactNode;
  gridTemplateColumns: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "hidden border-b border-hairline bg-page/45 text-[10px] font-extrabold uppercase tracking-[0.07em] text-slate-text xl:grid",
        className,
      )}
      style={{ gridTemplateColumns } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** Contraparte da grade de cabeçalho para as linhas desktop da mesma lista. */
export function ResourceListGridRow({
  children,
  gridTemplateColumns,
  className,
}: {
  children: ReactNode;
  gridTemplateColumns: string;
  className?: string;
}) {
  return (
    <div
      className={cn("grid min-w-0 gap-4 xl:items-center", className)}
      style={{ gridTemplateColumns } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function ActionRail({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-end gap-2 border-t border-hairline pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
