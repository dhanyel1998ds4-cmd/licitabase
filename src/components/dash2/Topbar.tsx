import { CircleHelp } from "lucide-react";
import { AlicitanteAssistant } from "@/components/dash2/AlicitanteAssistant";
import { DashboardNotifications } from "@/components/dash2/DashboardNotifications";
import { useGreeting } from "@/hooks/use-greeting";
import { UserAccountMenu } from "@/components/dash2/UserAccountMenu";
import { GlobalNavigationSearch } from "@/components/dash2/GlobalNavigationSearch";

export function Topbar() {
  return (
    <header className="sticky top-0 z-50 flex h-16 min-w-0 shrink-0 items-center justify-end gap-1 overflow-hidden border-b border-hairline bg-white/90 px-3 pl-[76px] backdrop-blur-md sm:px-6 sm:pl-[84px] lg:pl-6">
      <GlobalNavigationSearch />
      <AlicitanteAssistant />
      <DashboardNotifications />
      <button
        type="button"
        aria-label="Ajuda"
        className="hidden size-11 place-items-center rounded-full text-ink transition-colors hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454] md:grid"
      >
        <CircleHelp className="size-[20px]" strokeWidth={1.8} aria-hidden="true" />
      </button>
      <div className="hidden w-3 md:block" />
      <UserAccountMenu />
    </header>
  );
}

export function GreetingBar() {
  const greeting = useGreeting();
  return (
    <div className="mb-2">
      <h1 className="text-[28px] font-bold tracking-tight leading-tight text-ink">
        {greeting}, Jussefer!
      </h1>
      <p className="mt-1 text-[14px] font-medium text-slate-text">Aqui está o que importa hoje.</p>
    </div>
  );
}
