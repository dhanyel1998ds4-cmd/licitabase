import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BellOff,
  BookmarkPlus,
  ChevronRight,
  CircleAlert,
  Copy,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Search,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { PageContextHeader } from "@/components/dash2/PageContextHeader";
import { PageHowItWorks } from "@/components/dash2/PageHowItWorks";
import { Panel } from "@/components/dash2/Panel";
import { InternalPageState, UnsavedChangesDialog } from "@/components/dash2/InternalPageState";
import {
  ActionRail,
  ResourceList,
  ResourceListColumns,
  ResourceListRow,
} from "@/components/dash2/ResourceList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultSavedTenderFilters,
  readSavedTenderFilters,
  setActiveSavedTenderFilter,
  writeSavedTenderFilters,
  type SavedTenderFilter,
} from "@/lib/saved-tender-filters";
import { cn } from "@/lib/utils";

type FilterView = "all" | "alerts" | "paused" | "empty";

const frequencyCopy = {
  instant: { label: "Alerta imediato", icon: Bell, className: "bg-brand-tint text-brand-strong" },
  daily: { label: "Resumo diário", icon: Bell, className: "bg-[#EEF4FF] text-[#2455B6]" },
  weekly: { label: "Resumo semanal", icon: Bell, className: "bg-[#F5F0FF] text-[#7453C6]" },
  off: { label: "Alertas pausados", icon: BellOff, className: "bg-slate-100 text-slate-text" },
} as const;

function splitValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getDraft(filter?: SavedTenderFilter | null): SavedTenderFilter {
  return (
    filter ?? {
      id: `filter-${Date.now()}`,
      name: "",
      query: "",
      criteria: [],
      categories: [],
      regions: [],
      alertFrequency: "daily",
      enabled: true,
      newMatches: 0,
      lastRun: "Ainda não executado",
      createdAt: "agora",
    }
  );
}

export function SavedTenderFiltersPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SavedTenderFilter[]>(readSavedTenderFilters);
  const [view, setView] = useState<FilterView>("all");
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<SavedTenderFilter | null>(null);
  const [draft, setDraft] = useState<SavedTenderFilter>(() => getDraft());
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SavedTenderFilter | null>(null);

  const updateFilters = (next: SavedTenderFilter[]) => {
    setFilters(next);
    writeSavedTenderFilters(next);
  };

  const displayed = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return filters.filter((filter) => {
      const matchesView =
        view === "all" ||
        (view === "alerts" && filter.enabled && filter.alertFrequency !== "off") ||
        (view === "paused" && !filter.enabled) ||
        (view === "empty" && filter.newMatches === 0);
      const haystack = [
        filter.name,
        filter.query,
        ...filter.criteria,
        ...filter.categories,
        ...filter.regions,
      ]
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      return matchesView && (!normalized || haystack.includes(normalized));
    });
  }, [filters, query, view]);

  const activeCount = filters.filter((filter) => filter.enabled).length;
  const immediateCount = filters.filter(
    (filter) => filter.enabled && filter.alertFrequency === "instant",
  ).length;
  const totalMatches = filters.reduce((total, filter) => total + filter.newMatches, 0);
  const metrics: Array<{
    label: string;
    value: number;
    description: string;
    Icon: LucideIcon;
    iconClassName: string;
  }> = [
    {
      label: "Filtros ativos",
      value: activeCount,
      description: "monitorando sua operação",
      Icon: BookmarkPlus,
      iconClassName: "text-brand-strong bg-brand-tint",
    },
    {
      label: "Alerta imediato",
      value: immediateCount,
      description: "prioridades com aviso na hora",
      Icon: Bell,
      iconClassName: "text-[#2455B6] bg-[#EEF4FF]",
    },
    {
      label: "Novas oportunidades",
      value: totalMatches,
      description: "encontradas desde a última leitura",
      Icon: Search,
      iconClassName: "text-[#7453C6] bg-[#F5F0FF]",
    },
  ];

  const openEditor = (filter?: SavedTenderFilter) => {
    setEditing(filter ?? null);
    setDraft(getDraft(filter));
    setDirty(false);
    setEditorOpen(true);
  };

  const setDraftValue = <Key extends keyof SavedTenderFilter>(
    key: Key,
    value: SavedTenderFilter[Key],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  const saveDraft = () => {
    const name = draft.name.trim();
    if (!name) {
      toast.error("Dê um nome para identificar este filtro.");
      return;
    }
    const next = editing
      ? filters.map((filter) => (filter.id === draft.id ? { ...draft, name } : filter))
      : [{ ...draft, name }, ...filters];
    updateFilters(next);
    setDirty(false);
    setEditorOpen(false);
    toast.success(editing ? "Filtro atualizado" : "Filtro criado", {
      description: "A busca está pronta para ser reutilizada pela equipe.",
    });
  };

  const requestCloseEditor = (open: boolean) => {
    if (!open && dirty) {
      setDiscardOpen(true);
      return;
    }
    setEditorOpen(open);
  };

  const runFilter = (filter: SavedTenderFilter) => {
    setActiveSavedTenderFilter(filter);
    navigate({ to: "/dash2/licitacoes/buscar" });
  };

  const duplicateFilter = (filter: SavedTenderFilter) => {
    const copy: SavedTenderFilter = {
      ...filter,
      id: `filter-${Date.now()}`,
      name: `${filter.name} · cópia`,
      newMatches: 0,
      lastRun: "Ainda não executado",
      createdAt: "agora",
    };
    updateFilters([copy, ...filters]);
    toast.success("Filtro duplicado", {
      description: "Revise os critérios antes de ativar os alertas.",
    });
  };

  const toggleFilter = (filter: SavedTenderFilter, enabled: boolean) => {
    updateFilters(filters.map((item) => (item.id === filter.id ? { ...item, enabled } : item)));
    toast.success(enabled ? "Filtro reativado" : "Filtro pausado", {
      description: enabled
        ? "Os alertas voltarão a acompanhar novas oportunidades."
        : "Nada será perdido; você pode retomar quando quiser.",
    });
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="space-y-5 sm:space-y-6">
        <PageContextHeader
          context="explore"
          title="Filtros salvos"
          description="Reutilize buscas que funcionam e receba apenas as oportunidades que combinam com sua operação."
          actions={
            <Button
              onClick={() => openEditor()}
              className="bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139E3E]"
            >
              <Plus className="size-4" aria-hidden="true" />
              Criar filtro
            </Button>
          }
        />

        <PageHowItWorks
          title="Transforme uma busca útil em acompanhamento contínuo"
          description="Um filtro reúne critérios, canais de alerta e o atalho para reabrir a mesma busca sem reconfigurar tudo."
          steps={[
            {
              title: "Defina os critérios",
              description: "Crie o recorte com termos, categorias, regiões e prazo.",
            },
            {
              title: "Escolha o alerta",
              description: "Ative apenas os avisos que realmente exigem resposta.",
            },
            {
              title: "Retome e ajuste",
              description: "Abra o filtro para pesquisar ou refine-o quando a operação mudar.",
            },
          ]}
        />

        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {metrics.map(({ label, value, description, Icon, iconClassName }) => (
            <Panel key={label} className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-xl",
                    String(iconClassName),
                  )}
                >
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <p className="text-[12px] font-extrabold text-ink">{label}</p>
              </div>
              <p className="mt-4 text-[25px] font-extrabold leading-none tracking-[-0.03em] text-ink">
                {value}
              </p>
              <p className="mt-2 text-[11px] font-medium text-slate-text">{description}</p>
            </Panel>
          ))}
        </div>

        <Panel className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-hairline p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
                Sua biblioteca
              </p>
              <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.02em] text-ink">
                Buscas prontas para agir
              </h2>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                Ative alertas somente nos critérios que exigem acompanhamento.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 min-[480px]:flex-row lg:w-auto">
              <div className="relative min-w-0 flex-1 lg:w-[260px]">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-text"
                  aria-hidden="true"
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar filtro ou critério"
                  className="h-11 rounded-xl border-hairline pl-9 text-[12px] shadow-none"
                  aria-label="Buscar filtro ou critério"
                />
              </div>
              <Tabs value={view} onValueChange={(value) => setView(value as FilterView)}>
                <TabsList className="grid h-11 w-full grid-cols-4 rounded-xl border border-hairline bg-page/60 p-1 min-[480px]:w-[310px]">
                  <TabsTrigger
                    value="all"
                    className="min-h-9 px-1 text-[10px] font-bold sm:text-[11px]"
                  >
                    Todos
                  </TabsTrigger>
                  <TabsTrigger
                    value="alerts"
                    className="min-h-9 px-1 text-[10px] font-bold sm:text-[11px]"
                  >
                    Alertas
                  </TabsTrigger>
                  <TabsTrigger
                    value="paused"
                    className="min-h-9 px-1 text-[10px] font-bold sm:text-[11px]"
                  >
                    Pausados
                  </TabsTrigger>
                  <TabsTrigger
                    value="empty"
                    className="min-h-9 px-1 text-[10px] font-bold sm:text-[11px]"
                  >
                    Sem novas
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {displayed.length ? (
            <ResourceList>
              {displayed.map((filter) => {
                const frequency = frequencyCopy[filter.alertFrequency];
                const FrequencyIcon = frequency.icon;
                return (
                  <ResourceListRow key={filter.id}>
                    <ResourceListColumns>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="min-w-0 text-[15px] font-extrabold text-ink">
                            {filter.name}
                          </h3>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-extrabold",
                              frequency.className,
                            )}
                          >
                            <FrequencyIcon className="size-3" aria-hidden="true" />
                            {filter.enabled ? frequency.label : "Pausado"}
                          </span>
                        </div>
                        <p className="mt-1.5 truncate text-[12px] text-slate-text">
                          {filter.query || "Busca por critérios específicos"}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {[
                            ...filter.categories,
                            ...filter.criteria,
                            ...filter.regions.map((region) => `UF ${region}`),
                          ]
                            .slice(0, 6)
                            .map((criterion) => (
                              <span
                                key={criterion}
                                className="rounded-full bg-page px-2.5 py-1 text-[10px] font-semibold text-slate-text"
                              >
                                {criterion}
                              </span>
                            ))}
                        </div>
                      </div>
                      <ActionRail className="grid grid-cols-[1fr_auto] gap-x-5 gap-y-3 sm:flex sm:items-center xl:gap-5">
                        <div>
                          <p className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-text">
                            Encontradas
                          </p>
                          <p
                            className={cn(
                              "mt-1 text-[17px] font-extrabold",
                              filter.newMatches ? "text-brand-strong" : "text-ink",
                            )}
                          >
                            {filter.newMatches}
                          </p>
                          <p className="text-[10px] text-slate-text">{filter.lastRun}</p>
                        </div>
                        <div className="sm:hidden">
                          <Switch
                            checked={filter.enabled}
                            onCheckedChange={(enabled) => toggleFilter(filter, enabled)}
                            aria-label={`${filter.enabled ? "Pausar" : "Ativar"} ${filter.name}`}
                          />
                        </div>
                        <div className="hidden sm:block">
                          <Switch
                            checked={filter.enabled}
                            onCheckedChange={(enabled) => toggleFilter(filter, enabled)}
                            aria-label={`${filter.enabled ? "Pausar" : "Ativar"} ${filter.name}`}
                          />
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-2 sm:col-auto">
                          <Button
                            type="button"
                            onClick={() => runFilter(filter)}
                            className="h-11 rounded-xl bg-[#18B849] px-3 text-[11px] font-extrabold text-white hover:bg-[#139E3E]"
                          >
                            <Play className="size-3.5" aria-hidden="true" />
                            Ver oportunidades
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="size-11 rounded-xl border-hairline shadow-none"
                                aria-label={`Mais ações para ${filter.name}`}
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="min-w-[190px] rounded-xl border-hairline p-1.5"
                            >
                              <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.08em] text-slate-text">
                                Ações do filtro
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                className="min-h-10 rounded-lg text-[12px] font-semibold"
                                onSelect={() => openEditor(filter)}
                              >
                                <Pencil className="size-4" />
                                Editar critérios
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="min-h-10 rounded-lg text-[12px] font-semibold"
                                onSelect={() => duplicateFilter(filter)}
                              >
                                <Copy className="size-4" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="min-h-10 rounded-lg text-[12px] font-semibold text-rose-600 focus:text-rose-700"
                                onSelect={() => setDeleteTarget(filter)}
                              >
                                <Trash2 className="size-4" />
                                Excluir filtro
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </ActionRail>
                    </ResourceListColumns>
                  </ResourceListRow>
                );
              })}
            </ResourceList>
          ) : (
            <div className="p-4 sm:p-5">
              <InternalPageState
                state="empty"
                title="Nenhum filtro neste recorte"
                description="Tente outro termo ou crie uma busca para monitorar as oportunidades certas."
                action={
                  <Button
                    onClick={() => openEditor()}
                    className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139E3E]"
                  >
                    <Plus className="size-4" />
                    Criar filtro
                  </Button>
                }
              />
            </div>
          )}
        </Panel>
      </div>

      <Sheet open={editorOpen} onOpenChange={requestCloseEditor}>
        <SheetContent
          side="right"
          className="flex h-full w-full max-w-none flex-col gap-0 border-hairline bg-white p-0 sm:max-w-[560px]"
          overlayClassName="bg-slate-950/30 backdrop-blur-[1px]"
        >
          <SheetHeader className="border-b border-hairline px-5 py-5 text-left sm:px-6">
            <SheetTitle className="text-[18px] font-extrabold text-ink">
              {editing ? "Editar filtro" : "Criar filtro"}
            </SheetTitle>
            <SheetDescription className="text-[12px] leading-relaxed text-slate-text">
              Defina os critérios e escolha como sua equipe deve ser avisada.
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="filter-name" className="text-[11px] font-extrabold text-ink">
                Nome do filtro
              </Label>
              <Input
                id="filter-name"
                value={draft.name}
                onChange={(event) => setDraftValue("name", event.target.value)}
                placeholder="Ex.: TI prioritária · Sudeste"
                className="h-11 rounded-xl border-hairline text-[13px] shadow-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-query" className="text-[11px] font-extrabold text-ink">
                Termos da busca
              </Label>
              <Textarea
                id="filter-query"
                value={draft.query}
                onChange={(event) => setDraftValue("query", event.target.value)}
                placeholder="notebook, monitor, SSD..."
                className="min-h-24 resize-none rounded-xl border-hairline text-[13px] shadow-none"
              />
              <p className="text-[10.5px] text-slate-text">
                Separe os termos por espaço; eles serão levados à busca de licitações.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="filter-categories" className="text-[11px] font-extrabold text-ink">
                  Categorias
                </Label>
                <Input
                  id="filter-categories"
                  value={draft.categories.join(", ")}
                  onChange={(event) => setDraftValue("categories", splitValues(event.target.value))}
                  placeholder="Equipamentos de TI"
                  className="h-11 rounded-xl border-hairline text-[12px] shadow-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-regions" className="text-[11px] font-extrabold text-ink">
                  UFs e regiões
                </Label>
                <Input
                  id="filter-regions"
                  value={draft.regions.join(", ")}
                  onChange={(event) =>
                    setDraftValue(
                      "regions",
                      splitValues(event.target.value).map((value) => value.toUpperCase()),
                    )
                  }
                  placeholder="SP, MG, RJ"
                  className="h-11 rounded-xl border-hairline text-[12px] shadow-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-criteria" className="text-[11px] font-extrabold text-ink">
                Critérios complementares
              </Label>
              <Textarea
                id="filter-criteria"
                value={draft.criteria.join(", ")}
                onChange={(event) => setDraftValue("criteria", splitValues(event.target.value))}
                placeholder="Aderência mínima 85%, propostas em até 15 dias"
                className="min-h-20 resize-none rounded-xl border-hairline text-[12px] shadow-none"
              />
            </div>
            <div className="rounded-2xl border border-[#29C454]/20 bg-brand-tint/50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-extrabold text-ink">
                    Monitorar novas oportunidades
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-text">
                    Você pode pausar sem apagar esta busca.
                  </p>
                </div>
                <Switch
                  checked={draft.enabled}
                  onCheckedChange={(enabled) => setDraftValue("enabled", enabled)}
                  aria-label="Monitorar novas oportunidades"
                />
              </div>
              {draft.enabled ? (
                <Select
                  value={draft.alertFrequency}
                  onValueChange={(value) =>
                    setDraftValue("alertFrequency", value as SavedTenderFilter["alertFrequency"])
                  }
                >
                  <SelectTrigger className="mt-4 h-11 rounded-xl border-hairline bg-white text-[12px] shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="instant">Alerta assim que encontrar</SelectItem>
                    <SelectItem value="daily">Resumo diário</SelectItem>
                    <SelectItem value="weekly">Resumo semanal</SelectItem>
                  </SelectContent>
                </Select>
              ) : null}
            </div>
            <div className="flex gap-2 rounded-xl border border-[#3269D8]/15 bg-[#EEF4FF]/70 p-3 text-[#2455B6]">
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p className="text-[11px] leading-relaxed">
                As alterações passam a valer na próxima leitura. Nenhum alerta será disparado
                retroativamente.
              </p>
            </div>
          </div>
          <SheetFooter className="border-t border-hairline bg-page/40 px-5 py-4 sm:px-6">
            <Button
              variant="outline"
              onClick={() => requestCloseEditor(false)}
              className="min-h-11 rounded-xl border-hairline text-[12px] font-bold shadow-none"
            >
              Cancelar
            </Button>
            <Button
              onClick={saveDraft}
              className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139E3E]"
            >
              Salvar filtro
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <UnsavedChangesDialog
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        onDiscard={() => {
          setDirty(false);
          setDiscardOpen(false);
          setEditorOpen(false);
        }}
      />
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="max-w-[calc(100%_-_32px)] rounded-2xl border-hairline sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir este filtro?</AlertDialogTitle>
            <AlertDialogDescription>
              Você deixará de receber alertas desta busca. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-rose-600 text-white hover:bg-rose-700"
              onClick={() => {
                if (!deleteTarget) return;
                updateFilters(filters.filter((filter) => filter.id !== deleteTarget.id));
                toast.success("Filtro excluído");
                setDeleteTarget(null);
              }}
            >
              Excluir filtro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
