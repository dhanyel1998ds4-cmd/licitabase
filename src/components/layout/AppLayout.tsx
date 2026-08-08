import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function AppLayout({
  children,
  contentClassName,
}: {
  children: ReactNode;
  contentClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-sunken">
        {/* Sidebar desktop */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 hidden border-r border-border bg-sidebar transition-all duration-300 ease-out lg:block",
            collapsed ? "w-[80px]" : "w-[280px]",
          )}
        >
          <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} />
        </aside>

        {/* Drawer mobile/tablet */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Fechar menu"
              className="absolute inset-0 bg-navy/40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[296px] max-w-[85vw] overflow-y-auto border-r border-border bg-sidebar">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-xl text-navy hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
              <Sidebar collapsed={false} />
            </div>
          </div>
        )}

        <div
          className={cn(
            "h-full min-w-0 overflow-x-hidden flex flex-col transition-all duration-300 ease-out",
            collapsed ? "lg:pl-[80px]" : "lg:pl-[280px]",
          )}
        >
          <div className="flex items-center gap-2 px-5 pt-5 lg:hidden">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              className="flex size-11 items-center justify-center rounded-xl border border-border bg-card text-navy hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
          <main className={cn("min-w-0 flex-1", contentClassName)}>{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
