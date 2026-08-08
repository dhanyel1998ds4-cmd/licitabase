import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/bot-lances")({
  component: BotLancesLayout,
});

function BotLancesLayout() {
  return (
    <AppLayout>
      <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
        <div className="w-full space-y-8 px-4 py-8 lg:px-8">
          <Outlet />
        </div>
      </div>
    </AppLayout>
  );
}
