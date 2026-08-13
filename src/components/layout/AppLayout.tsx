import { useState, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { AppLayoutStateContext } from "./app-layout-state";
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
    <AppLayoutStateContext.Provider value={{ sidebarCollapsed: collapsed }}>
      <TooltipProvider delayDuration={0}>
        <div className="h-dvh overflow-hidden bg-sunken">
          {/* Sidebar desktop */}
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-30 hidden border-r border-border bg-sidebar transition-all duration-300 ease-out min-[1440px]:!block",
              collapsed ? "w-[80px]" : "w-[280px]",
            )}
          >
            <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} />
          </aside>

          {/* Compact rail for notebooks */}
          <aside className="fixed inset-y-0 left-0 z-30 hidden w-[80px] border-r border-border bg-sidebar lg:block min-[1440px]:!hidden">
            <Sidebar collapsed onToggleCollapse={() => setOpen(true)} />
          </aside>

          <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger asChild>
              <button
                type="button"
                aria-label="Abrir menu"
                className="fixed left-4 top-2.5 z-[60] flex size-11 items-center justify-center rounded-xl border border-border bg-card text-navy shadow-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-navy/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <DialogPrimitive.Content
                className="fixed inset-y-0 left-0 z-[90] w-[304px] max-w-[88vw] overflow-hidden border-r border-border bg-sidebar shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest("a")) setOpen(false);
                }}
              >
                <DialogPrimitive.Title className="sr-only">Menu principal</DialogPrimitive.Title>
                <DialogPrimitive.Close
                  aria-label="Fechar menu"
                  className="absolute right-3 top-5 z-20 flex size-11 items-center justify-center rounded-xl border border-border bg-white text-navy shadow-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <X className="size-5" aria-hidden="true" />
                </DialogPrimitive.Close>
                <Sidebar collapsed={false} showCollapseToggle={false} />
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>

          <div
            className={cn(
              "flex h-dvh min-w-0 flex-col overflow-x-hidden overflow-y-hidden transition-all duration-300 ease-out lg:pl-[80px]",
              collapsed ? "min-[1440px]:!pl-[80px]" : "min-[1440px]:!pl-[280px]",
            )}
          >
            <main className={cn("min-h-0 min-w-0 flex-1", contentClassName)}>{children}</main>
          </div>
        </div>
      </TooltipProvider>
    </AppLayoutStateContext.Provider>
  );
}
