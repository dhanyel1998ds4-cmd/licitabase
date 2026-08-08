import { Bell, CircleHelp, ChevronDown, Plus, Search } from "lucide-react";
import { useGreeting } from "@/hooks/use-greeting";

export function NotificationButton() {
  return (
    <button
      type="button"
      aria-label="Notificações"
      className="relative grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
    >
      <Bell className="size-[20px]" strokeWidth={1.8} aria-hidden="true" />
      <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-[#29C454]" />
    </button>
  );
}

export function UserMenu() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
      aria-label="Menu do usuário"
    >
      <div className="size-9 rounded-full bg-[#29C454] flex items-center justify-center text-[12.5px] font-bold text-white">
        JE
      </div>
      <div className="hidden flex-col items-start leading-none sm:flex">
        <span className="text-[13px] font-bold text-ink">Jussefer</span>
      </div>
      <ChevronDown className="hidden size-4 text-slate-text sm:block" aria-hidden="true" />
    </button>
  );
}

export function Topbar() {
  return (
    <header className="flex h-16 min-w-0 items-center justify-end gap-1 overflow-hidden border-b border-hairline bg-white/80 backdrop-blur-md px-4 sm:px-6 sticky top-0 z-50">
      <NotificationButton />
      <button
        type="button"
        aria-label="Ajuda"
        className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
      >
        <CircleHelp className="size-[20px]" strokeWidth={1.8} aria-hidden="true" />
      </button>
      <div className="w-4" />
      <UserMenu />
    </header>
  );
}

export function GlobalSearch() {
  return (
    <label className="relative block w-full">
      <span className="sr-only">Buscar licitações, órgão ou palavras-chave</span>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-text"
        aria-hidden="true"
      />
      <input
        type="search"
        placeholder="Buscar licitações, órgão ou palavras-chave..."
        className="h-11 w-full rounded-xl border border-hairline bg-slate-50/50 pl-11 pr-4 text-[13.5px] font-medium text-ink placeholder:text-slate-text transition-all focus:bg-white focus:border-[#29C454] focus:outline-none focus:ring-4 focus:ring-[#29C454]/10"
      />
    </label>
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
