import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { BotSubnav } from "@/components/bot/BotSubnav";
import { Topbar } from "@/components/dash2/Topbar";

export const Route = createFileRoute("/bot-lances")({
  component: BotLancesLayout,
});

function BotLancesLayout() {
  return (
    <AppLayout contentClassName="flex h-full min-h-0 flex-col overflow-hidden bg-white p-0 font-manrope">
      <div className="flex h-full min-h-0 flex-col bg-white">
        <Topbar />
        <BotSubnav />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="w-full space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
            <Outlet />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
