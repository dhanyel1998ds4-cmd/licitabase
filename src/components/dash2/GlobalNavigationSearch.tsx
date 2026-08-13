import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  CornerDownLeft,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { openAlicitanteAssistant } from "@/lib/alicitante-events";
import { openDashboardNotifications, openUserAccountMenu } from "@/lib/dashboard-events";
import {
  globalSearchFilters,
  searchGlobalCatalog,
  type GlobalSearchAction,
  type GlobalSearchFilter,
  type GlobalSearchItem,
  type GlobalSearchRoute,
  type GlobalSearchType,
} from "@/lib/global-search-catalog";
import { cn } from "@/lib/utils";

const RECENT_SEARCH_STORAGE_KEY = "licitabase:global-search-recent";
const RESULT_GROUP_ORDER = [
  "Páginas",
  "Oportunidades",
  "Operação",
  "Inteligência",
  "Conta e workspace",
  "Gestão",
  "Configurações",
  "Ações rápidas",
];

const resultTypeLabels: Record<GlobalSearchType, string> = {
  page: "Página",
  section: "Seção",
  setting: "Configuração",
  action: "Ação",
  resource: "Recurso",
};

function readRecentSearchIds() {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(RECENT_SEARCH_STORAGE_KEY) ?? "[]");
    return Array.isArray(stored)
      ? stored.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function groupResults(items: GlobalSearchItem[], query: string) {
  const groups = new Map<string, GlobalSearchItem[]>();

  items.forEach((item) => {
    const group = query ? item.group : item.type === "action" ? "Ações rápidas" : "Mais acessados";
    groups.set(group, [...(groups.get(group) ?? []), item]);
  });

  return [...groups.entries()].sort(([first], [second]) => {
    if (first === "Mais acessados") return -1;
    if (second === "Mais acessados") return 1;
    return RESULT_GROUP_ORDER.indexOf(first) - RESULT_GROUP_ORDER.indexOf(second);
  });
}

function HighlightedTitle({ title, query }: { title: string; query: string }) {
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  if (!normalizedQuery) return title;
  const start = title.toLocaleLowerCase("pt-BR").indexOf(normalizedQuery);
  if (start < 0) return title;

  return (
    <>
      {title.slice(0, start)}
      <mark className="rounded-sm bg-[#29C454]/15 px-0.5 text-inherit">
        {title.slice(start, start + normalizedQuery.length)}
      </mark>
      {title.slice(start + normalizedQuery.length)}
    </>
  );
}

function ResultItem({
  item,
  query,
  onSelect,
}: {
  item: GlobalSearchItem;
  query: string;
  onSelect: (item: GlobalSearchItem) => void;
}) {
  const Icon = item.icon;
  const available = item.status === "available";

  return (
    <CommandItem
      value={item.id}
      disabled={!available}
      onSelect={() => available && onSelect(item)}
      aria-label={
        available
          ? `${item.title}. ${item.description}`
          : `${item.title}. Em preparação e ainda indisponível`
      }
      className={cn(
        "group min-h-[68px] gap-3 rounded-xl px-3 py-2.5",
        available
          ? "cursor-pointer data-[selected=true]:bg-brand-tint data-[selected=true]:text-ink"
          : "cursor-not-allowed !opacity-100 data-[selected=true]:bg-transparent",
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl border",
          available
            ? "border-[#29C454]/15 bg-[#29C454]/8 text-brand-strong"
            : "border-hairline bg-page text-slate-text",
        )}
      >
        <Icon className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[13.5px] font-bold text-ink">
            <HighlightedTitle title={item.title} query={query} />
          </span>
          <span
            className={cn(
              "hidden shrink-0 rounded-md px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.05em] sm:inline",
              available ? "bg-page text-slate-text" : "bg-amber-50 text-amber-700",
            )}
          >
            {available ? resultTypeLabels[item.type] : "Em preparação"}
          </span>
        </span>
        <span className="mt-0.5 block truncate text-[11px] font-semibold text-slate-text">
          {item.breadcrumb.join(" › ")}
        </span>
        <span className="mt-0.5 line-clamp-2 text-[10.5px] font-medium leading-relaxed text-slate-text/90 sm:block sm:truncate">
          {item.description}
        </span>
      </span>

      {available ? (
        item.type === "action" ? (
          <CornerDownLeft
            className="size-4 shrink-0 text-slate-text transition-colors group-data-[selected=true]:text-brand-strong"
            aria-hidden="true"
          />
        ) : (
          <ArrowRight
            className="size-4 shrink-0 text-slate-text transition-transform group-data-[selected=true]:translate-x-0.5 group-data-[selected=true]:text-brand-strong"
            aria-hidden="true"
          />
        )
      ) : (
        <Clock3 className="size-4 shrink-0 text-amber-600" aria-hidden="true" />
      )}
    </CommandItem>
  );
}

function ResultGroup({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <CommandGroup
      heading={heading}
      className="mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[10.5px] [&_[cmdk-group-heading]]:font-extrabold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.09em] [&_[cmdk-group-heading]]:text-slate-text"
    >
      {children}
    </CommandGroup>
  );
}

function SearchPaletteContent({
  query,
  filter,
  currentPath,
  recentIds,
  mobile,
  onQueryChange,
  onFilterChange,
  onSelect,
  onAskAlicitante,
}: {
  query: string;
  filter: GlobalSearchFilter;
  currentPath: string;
  recentIds: string[];
  mobile?: boolean;
  onQueryChange: (value: string) => void;
  onFilterChange: (filter: GlobalSearchFilter) => void;
  onSelect: (item: GlobalSearchItem) => void;
  onAskAlicitante: (query: string) => void;
}) {
  const results = useMemo(
    () =>
      searchGlobalCatalog({
        query,
        filter,
        currentPath,
        role: "admin",
        recentIds,
      }),
    [currentPath, filter, query, recentIds],
  );
  const filterCounts = useMemo(
    () =>
      Object.fromEntries(
        globalSearchFilters.map((candidate) => [
          candidate,
          searchGlobalCatalog({
            query,
            filter: candidate,
            currentPath,
            role: "admin",
            recentIds,
          }).length,
        ]),
      ) as Record<GlobalSearchFilter, number>,
    [currentPath, query, recentIds],
  );
  const visibleFilters = query
    ? globalSearchFilters.filter(
        (candidate) => candidate === "Todos" || filterCounts[candidate] > 0 || candidate === filter,
      )
    : globalSearchFilters;
  const availableItems = results
    .filter(({ item }) => item.status === "available")
    .slice(0, query ? 18 : 12)
    .map(({ item }) => item);
  const comingSoonItems = results
    .filter(({ item }) => item.status === "coming-soon")
    .slice(0, 10)
    .map(({ item }) => item);
  const availableGroups = groupResults(availableItems, query);
  const hasAnyResult = availableItems.length > 0 || comingSoonItems.length > 0;

  return (
    <Command shouldFilter={false} className="h-full rounded-none bg-white font-manrope text-ink">
      <div className="relative shrink-0 border-b border-hairline">
        <CommandInput
          autoFocus
          value={query}
          onValueChange={onQueryChange}
          placeholder="Buscar páginas, configurações e recursos..."
          aria-label="Buscar páginas, configurações e recursos"
          className="h-14 pr-20 text-[15px] font-medium text-ink placeholder:text-slate-text"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Limpar pesquisa"
            className="absolute right-4 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-slate-text transition-colors hover:bg-page hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-hairline bg-page px-2 py-1 text-[11px] font-bold text-slate-text sm:flex">
            Ctrl K
          </kbd>
        )}
      </div>

      <div
        className="flex shrink-0 gap-2 overflow-x-auto border-b border-hairline px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Filtrar resultados"
      >
        {visibleFilters.map((candidate) => (
          <button
            key={candidate}
            type="button"
            onClick={() => onFilterChange(candidate)}
            className={cn(
              "min-h-10 shrink-0 rounded-full border px-4 text-[12px] font-bold transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
              filter === candidate
                ? "border-[#29C454] bg-[#29C454] text-white"
                : "border-hairline bg-page text-slate-text hover:border-[#29C454]/40 hover:bg-brand-tint hover:text-brand-strong",
            )}
            aria-pressed={filter === candidate}
          >
            {candidate}
            {query ? ` ${filterCounts[candidate]}` : ""}
          </button>
        ))}
      </div>

      <CommandList
        className={cn(
          "max-h-[min(58vh,560px)] overflow-y-auto overflow-x-hidden px-3 py-2",
          mobile && "min-h-0 max-h-none flex-1",
        )}
      >
        {!hasAnyResult && (
          <div className="px-6 py-10 text-center">
            <Search className="mx-auto size-8 text-slate-text/55" aria-hidden="true" />
            <p className="mt-3 text-[14px] font-bold text-ink">
              Nenhuma página ou configuração encontrada
            </p>
            <p className="mx-auto mt-1 max-w-sm text-[12px] font-medium leading-relaxed text-slate-text">
              Tente outro termo ou pergunte à Alicitante usando sua pesquisa atual.
            </p>
          </div>
        )}

        {availableGroups.map(([group, items]) => (
          <ResultGroup key={group} heading={group}>
            {items.map((item) => (
              <ResultItem key={item.id} item={item} query={query} onSelect={onSelect} />
            ))}
          </ResultGroup>
        ))}

        {comingSoonItems.length > 0 && (
          <ResultGroup heading="Em preparação">
            {comingSoonItems.map((item) => (
              <ResultItem key={item.id} item={item} query={query} onSelect={onSelect} />
            ))}
          </ResultGroup>
        )}
      </CommandList>

      {query && (
        <div className="flex shrink-0 items-center gap-3 border-t border-hairline bg-page/60 px-4 py-3 sm:px-5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-tint text-brand-strong">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-bold text-ink">Não encontrou o que procurava?</p>
            <p className="truncate text-[10.5px] font-medium text-slate-text">
              Pergunte à Alicitante sobre “{query}”
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAskAlicitante(query)}
            className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-xl border border-[#29C454]/30 bg-white px-3 text-[10.5px] font-bold text-brand-strong transition-colors hover:border-[#29C454] hover:bg-brand-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
          >
            Perguntar
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="hidden shrink-0 items-center justify-between border-t border-hairline px-5 py-3 text-[10.5px] font-semibold text-slate-text sm:flex">
        <span>↑↓ navegar</span>
        <span>Enter abrir</span>
        <span>Esc fechar</span>
      </div>
    </Command>
  );
}

export function GlobalNavigationSearch() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<GlobalSearchFilter>("Todos");
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => setRecentIds(readRecentSearchIds()), []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (!query || filter === "Todos") return;
    const count = searchGlobalCatalog({
      query,
      filter,
      currentPath: location.pathname,
      role: "admin",
      recentIds,
    }).length;
    if (count === 0) setFilter("Todos");
  }, [filter, location.pathname, query, recentIds]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQuery("");
      setFilter("Todos");
    }
  };

  const rememberSelection = (id: string) => {
    const nextIds = [id, ...recentIds.filter((recentId) => recentId !== id)].slice(0, 8);
    setRecentIds(nextIds);
    try {
      window.localStorage.setItem(RECENT_SEARCH_STORAGE_KEY, JSON.stringify(nextIds));
    } catch {
      // A busca continua funcional quando o armazenamento local está indisponível.
    }
  };

  const runAction = (action: GlobalSearchAction) => {
    if (action === "open-notifications") openDashboardNotifications();
    if (action === "open-alicitante") openAlicitanteAssistant();
    if (action === "open-user-menu") openUserAccountMenu();
  };

  const handleSelect = (item: GlobalSearchItem) => {
    if (item.status !== "available") return;
    rememberSelection(item.id);
    handleOpenChange(false);

    if (item.route) {
      void navigate({ to: item.route as GlobalSearchRoute });
      return;
    }

    if (item.action) window.setTimeout(() => runAction(item.action!), 120);
  };

  const handleAskAlicitante = (searchQuery: string) => {
    handleOpenChange(false);
    window.setTimeout(() => openAlicitanteAssistant(searchQuery), 120);
  };

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Abrir busca global de páginas e recursos"
      aria-expanded={open}
      className={cn(
        "mr-auto flex h-11 min-w-11 items-center rounded-xl border border-hairline bg-slate-50/70 text-slate-text transition-all",
        "hover:border-[#29C454]/35 hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
        "justify-center px-0 md:w-[180px] md:justify-start md:px-3.5 lg:w-full lg:max-w-[480px]",
      )}
    >
      <Search className="size-[18px] shrink-0" strokeWidth={1.8} aria-hidden="true" />
      <span className="ml-2 hidden truncate text-[13px] font-semibold md:inline lg:text-[13.5px]">
        <span className="lg:hidden">Buscar</span>
        <span className="hidden lg:inline">Buscar páginas e recursos...</span>
      </span>
      <kbd className="ml-auto hidden shrink-0 items-center rounded-md border border-hairline bg-white px-2 py-1 text-[10.5px] font-bold text-slate-text lg:flex">
        Ctrl K
      </kbd>
    </button>
  );

  const palette = (
    <SearchPaletteContent
      query={query}
      filter={filter}
      currentPath={location.pathname}
      recentIds={recentIds}
      mobile={isMobile}
      onQueryChange={setQuery}
      onFilterChange={setFilter}
      onSelect={handleSelect}
      onAskAlicitante={handleAskAlicitante}
    />
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        <Drawer open={open} onOpenChange={handleOpenChange}>
          <DrawerContent
            overlayClassName="!z-[95] bg-slate-950/25 backdrop-blur-[1px]"
            className="z-[100] h-[91dvh] max-h-[91dvh] rounded-t-[24px] border-hairline bg-white font-manrope"
          >
            <DrawerTitle className="sr-only">Busca global</DrawerTitle>
            <DrawerDescription className="sr-only">
              Encontre páginas, configurações, ações e recursos do Licitabase.
            </DrawerDescription>
            <div className="mt-3 min-h-0 flex-1 overflow-hidden rounded-t-[20px]">{palette}</div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          overlayClassName="bg-slate-950/25 backdrop-blur-[1px]"
          showCloseButton={false}
          className="left-1/2 top-[82px] block max-h-[calc(100dvh-100px)] w-[calc(100%-32px)] max-w-[740px] translate-x-[-50%] translate-y-0 overflow-hidden rounded-[22px] border-hairline bg-white p-0 font-manrope shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
        >
          <DialogTitle className="sr-only">Busca global</DialogTitle>
          <DialogDescription className="sr-only">
            Encontre páginas, configurações, ações e recursos do Licitabase.
          </DialogDescription>
          {palette}
        </DialogContent>
      </Dialog>
    </>
  );
}
