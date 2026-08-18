import type { ReactNode } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Topbar } from "@/components/dash2/Topbar";

export function InternalWorkspacePage({ children }: { children: ReactNode }) {
  return (
    <AppLayout contentClassName="flex h-full min-h-0 flex-col overflow-hidden bg-white p-0 font-manrope">
      <Topbar />
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="w-full space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
          {children}
        </div>
      </div>
    </AppLayout>
  );
}
