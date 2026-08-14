import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  Bot,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileSearch,
  Filter,
  FlaskConical,
  Heart,
  Info,
  Lightbulb,
  PackageSearch,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel } from "@/components/dash2/Panel";
import {
  newOpportunities,
  newOpportunitiesSummary,
  opportunityPlatforms,
  type NewOpportunity,
  type OpportunityProduct,
  type OpportunityRequirement,
  type OpportunityPlatformFilter,
} from "@/lib/new-opportunities-fixtures";
import { cn } from "@/lib/utils";
import { useOpportunityTriage, type OpportunityPriority } from "@/hooks/use-opportunity-triage";

type Decision = "dismissed" | "later" | "interested";
type AnalysisStatus = "idle" | "processing" | "done";

type Feedback = {
  message: string;
  opportunity: NewOpportunity;
  decision: Decision;
};

const decisionCopy: Record<Decision, string> = {
  dismissed: "Oportunidade descartada",
  later: "Salva para analisar depois",
  interested: "Marcada como interessante",
};

export function NewOpportunitiesPage({ isLoading = false }: { isLoading?: boolean }) {
  const [activePlatform, setActivePlatform] = useState<OpportunityPlatformFilter>("Todas");
  const [stateFilter, setStateFilter] = useState("Todos");
  const [draftStateFilter, setDraftStateFilter] = useState("Todos");
  const { triage, decide, undo } = useOpportunityTriage();
  const [queue, setQueue] = useState(() =>
    newOpportunities.filter((opportunity) => !triage[opportunity.id]),
  );
  const [position, setPosition] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [showFavorites, setShowFavorites] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [analysisById, setAnalysisById] = useState<Record<string, AnalysisStatus>>({});
  const [autoParticipate, setAutoParticipate] = useState(true);
  const [interestDraft, setInterestDraft] = useState<{
    opportunity: NewOpportunity;
    priority: OpportunityPriority;
    note: string;
  } | null>(null);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const savedIds = useMemo(
    () =>
      new Set(
        Object.entries(triage)
          .filter(([, record]) => record.decision === "later")
          .map(([id]) => id),
      ),
    [triage],
  );
  const interestedIds = useMemo(
    () =>
      new Set(
        Object.entries(triage)
          .filter(([, record]) => record.decision === "interested")
          .map(([id]) => id),
      ),
    [triage],
  );

  useEffect(() => {
    const activeTimers = timers.current;
    return () => activeTimers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    setQueue((current) => current.filter((opportunity) => !triage[opportunity.id]));
  }, [triage]);

  const availableStates = useMemo(
    () => ["Todos", ...Array.from(new Set(newOpportunities.map((item) => item.state)))],
    [],
  );

  const currentOpportunity = queue[0];
  const currentAnalysisStatus = currentOpportunity
    ? (analysisById[currentOpportunity.id] ??
      (currentOpportunity.documentAnalysis ? "done" : "idle"))
    : "idle";

  const totalInView =
    activePlatform === "Todas" && stateFilter === "Todos" && !showFavorites
      ? newOpportunitiesSummary.total
      : queue.length + Math.max(position - 1, 0);
  const visiblePosition = totalInView === 0 ? 0 : Math.min(position, Math.max(totalInView, 1));

  function getFilteredQueue(
    platform: OpportunityPlatformFilter,
    state: string,
    favoritesOnly: boolean,
    favorites: Set<string> = favoriteIds,
  ) {
    return newOpportunities.filter((opportunity) => {
      const platformMatches = platform === "Todas" || opportunity.platform === platform;
      const stateMatches = state === "Todos" || opportunity.state === state;
      const favoriteMatches = !favoritesOnly || favorites.has(opportunity.id);
      const isPending = !triage[opportunity.id];
      return platformMatches && stateMatches && favoriteMatches && (favoritesOnly || isPending);
    });
  }

  function resetQueue(
    platform: OpportunityPlatformFilter,
    state: string,
    favoritesOnly: boolean,
    favorites: Set<string> = favoriteIds,
  ) {
    setQueue(getFilteredQueue(platform, state, favoritesOnly, favorites));
    setPosition(1);
    setFeedback(null);
  }

  function selectPlatform(platform: OpportunityPlatformFilter) {
    setActivePlatform(platform);
    resetQueue(platform, stateFilter, showFavorites);
  }

  function toggleFavoritesView() {
    const nextValue = !showFavorites;
    setShowFavorites(nextValue);
    resetQueue(activePlatform, stateFilter, nextValue);
  }

  function toggleFavorite(opportunity: NewOpportunity) {
    const nextFavorites = new Set(favoriteIds);
    if (nextFavorites.has(opportunity.id)) nextFavorites.delete(opportunity.id);
    else nextFavorites.add(opportunity.id);
    setFavoriteIds(nextFavorites);

    if (showFavorites && !nextFavorites.has(opportunity.id)) {
      setQueue((current) => current.filter((item) => item.id !== opportunity.id));
    }
  }

  function registerDecision(opportunity: NewOpportunity, decision: Decision) {
    if (decision === "interested") {
      setInterestDraft({ opportunity, priority: "normal", note: "" });
      return;
    }
    commitDecision(opportunity, decision);
  }

  function commitDecision(
    opportunity: NewOpportunity,
    decision: Decision,
    details: { priority?: OpportunityPriority; note?: string } = {},
  ) {
    decide(opportunity.id, decision, details);
    setQueue((current) => current.slice(1));
    setPosition((current) => current + 1);
    setFeedback({ message: decisionCopy[decision], opportunity, decision });
  }

  function confirmInterest() {
    if (!interestDraft) return;
    const note = interestDraft.note.trim();
    commitDecision(
      interestDraft.opportunity,
      "interested",
      note ? { priority: interestDraft.priority, note } : { priority: interestDraft.priority },
    );
    setInterestDraft(null);
  }

  function undoLastDecision() {
    if (!feedback) return;
    setQueue((current) => [feedback.opportunity, ...current]);
    setPosition((current) => Math.max(1, current - 1));

    undo(feedback.opportunity.id);
    setFeedback(null);
  }

  function applyFilters() {
    setStateFilter(draftStateFilter);
    setFiltersOpen(false);
    resetQueue(activePlatform, draftStateFilter, showFavorites);
  }

  function clearFilters() {
    setActivePlatform("Todas");
    setStateFilter("Todos");
    setDraftStateFilter("Todos");
    setShowFavorites(false);
    resetQueue("Todas", "Todos", false);
  }

  function analyzeDocuments(opportunity: NewOpportunity) {
    if (analysisById[opportunity.id] === "processing") return;
    setAnalysisById((current) => ({ ...current, [opportunity.id]: "processing" }));
    const timer = setTimeout(() => {
      setAnalysisById((current) => ({ ...current, [opportunity.id]: "done" }));
    }, 950);
    timers.current.push(timer);
  }

  if (isLoading) return <OpportunitiesPageSkeleton />;

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 xl:px-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-1 h-8 w-1 shrink-0 rounded-full bg-[#29C454]" />
            <div>
              <h1 className="text-[24px] font-bold leading-tight tracking-[-0.025em] text-ink">
                Novas oportunidades
              </h1>
              <p className="mt-1 text-[13px] font-medium text-slate-text">
                Descubra licitações que combinam com seu negócio.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleFavoritesView}
            aria-pressed={showFavorites}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border px-4 text-[12px] font-semibold transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
              showFavorites
                ? "border-[#29C454] bg-[#29C454]/10 text-[#15943a]"
                : "border-hairline bg-white text-ink hover:border-slate-300",
            )}
          >
            <Star className={cn("size-4", showFavorites && "fill-[#29C454]")} />
            Favoritos
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] tabular-nums">
              {favoriteIds.size}
            </span>
          </button>
        </header>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 lg:flex-1">
            <div className="-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1 pr-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {opportunityPlatforms.map((platform) => {
                const selected = activePlatform === platform;
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => selectPlatform(platform)}
                    aria-pressed={selected}
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-[12px] font-semibold transition-all",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                      selected
                        ? "border-[#29C454] bg-[#29C454] text-white shadow-sm"
                        : "border-hairline bg-white text-slate-text hover:border-slate-300 hover:text-ink",
                    )}
                  >
                    {platform}
                    {platform === "Todas" && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                          selected ? "bg-white/20 text-white" : "bg-slate-100 text-ink",
                        )}
                      >
                        {newOpportunitiesSummary.total}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-hairline bg-white px-4 text-[12px] font-semibold text-ink transition-colors hover:border-slate-300",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                )}
                aria-label="Abrir filtros de oportunidades"
              >
                <Filter className="size-4" />
                Filtros
                {stateFilter !== "Todos" && <span className="size-2 rounded-full bg-[#29C454]" />}
              </button>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#F8FAFC] via-[#F8FAFC]/95 to-transparent"
            />
          </div>

          <div className="flex shrink-0 items-center justify-between gap-6 lg:justify-end">
            <div className="text-right">
              <p className="text-[13px] font-bold tabular-nums text-ink">
                {visiblePosition} de {totalInView}
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-slate-text">
                {newOpportunitiesSummary.updatedLabel}
              </p>
            </div>
            <TrendingUp className="size-4 text-[#29C454]" aria-hidden="true" />
          </div>
        </div>

        {feedback && (
          <div
            role="status"
            className="fixed inset-x-4 bottom-[100px] z-50 flex items-center justify-between gap-4 rounded-xl border border-[#29C454]/20 bg-white px-4 py-3 shadow-lg sm:static sm:mt-4 sm:bg-[#29C454]/[0.06] sm:shadow-none"
          >
            <div className="flex min-w-0 items-center gap-2 text-[12px] font-medium text-ink">
              <Check className="size-4 shrink-0 text-[#29C454]" />
              <span className="truncate">{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={undoLastDecision}
              className="shrink-0 text-[12px] font-bold text-[#15943a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
            >
              Desfazer
            </button>
            {feedback.decision === "interested" ? (
              <Link
                to="/dash2/operacao/minhas-licitacoes"
                className="shrink-0 text-[12px] font-bold text-[#15943a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
              >
                Ver no pipeline
              </Link>
            ) : null}
            {feedback.decision === "later" ? (
              <Link
                to="/dash2/oportunidades/favoritos"
                className="shrink-0 text-[12px] font-bold text-[#15943a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
              >
                Ver salvas
              </Link>
            ) : null}
          </div>
        )}

        {currentOpportunity ? (
          <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.85fr)]">
            <section aria-label="Fila de oportunidades" className="min-w-0 py-0">
              <OpportunityDeck
                opportunity={currentOpportunity}
                remainingCards={Math.min(queue.length - 1, 2)}
                isFavorite={favoriteIds.has(currentOpportunity.id)}
                autoParticipate={autoParticipate}
                onAutoParticipateChange={setAutoParticipate}
                onToggleFavorite={() => toggleFavorite(currentOpportunity)}
                onDecision={(decision) => registerDecision(currentOpportunity, decision)}
              />
            </section>

            <IntelligencePanel
              opportunity={currentOpportunity}
              analysisStatus={currentAnalysisStatus}
              onAnalyze={() => analyzeDocuments(currentOpportunity)}
            />
          </div>
        ) : (
          <EmptyQueue
            showFavorites={showFavorites}
            savedCount={savedIds.size}
            interestedCount={interestedIds.size}
            onReset={clearFilters}
            onReviewSaved={() => {
              const savedQueue = newOpportunities.filter((item) => savedIds.has(item.id));
              setQueue(savedQueue);
              setShowFavorites(false);
              setPosition(1);
            }}
          />
        )}
      </div>

      <FiltersDialog
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        states={availableStates}
        value={draftStateFilter}
        onValueChange={setDraftStateFilter}
        onApply={applyFilters}
        onClear={() => setDraftStateFilter("Todos")}
      />
      <InterestDialog
        draft={interestDraft}
        onOpenChange={(open) => {
          if (!open) setInterestDraft(null);
        }}
        onPriorityChange={(priority) =>
          setInterestDraft((current) => (current ? { ...current, priority } : current))
        }
        onNoteChange={(note) =>
          setInterestDraft((current) => (current ? { ...current, note } : current))
        }
        onConfirm={confirmInterest}
      />
    </div>
  );
}

function OpportunityDeck({
  opportunity,
  remainingCards,
  isFavorite,
  autoParticipate,
  onAutoParticipateChange,
  onToggleFavorite,
  onDecision,
}: {
  opportunity: NewOpportunity;
  remainingCards: number;
  isFavorite: boolean;
  autoParticipate: boolean;
  onAutoParticipateChange: (checked: boolean) => void;
  onToggleFavorite: () => void;
  onDecision: (decision: Decision) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef(0);
  const dragXRef = useRef(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [animatingDecision, setAnimatingDecision] = useState<Decision | null>(null);
  const decisionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (decisionTimer.current) clearTimeout(decisionTimer.current);
    },
    [],
  );

  function completeDecision(decision: Decision) {
    if (animatingDecision) return;
    setAnimatingDecision(decision);
    const width = cardRef.current?.getBoundingClientRect().width ?? 640;
    if (decision === "dismissed") {
      dragXRef.current = -width * 1.15;
      setDragX(dragXRef.current);
    }
    if (decision === "interested") {
      dragXRef.current = width * 1.15;
      setDragX(dragXRef.current);
    }

    decisionTimer.current = setTimeout(() => {
      onDecision(decision);
      dragXRef.current = 0;
      setDragX(0);
      setAnimatingDecision(null);
    }, 220);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (animatingDecision) return;
    if (
      event.target instanceof Element &&
      event.target.closest("button, a, input, select, label, [role='checkbox']")
    ) {
      return;
    }
    pointerStart.current = event.clientX;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || animatingDecision) return;
    const width = cardRef.current?.getBoundingClientRect().width ?? 640;
    const nextValue = Math.max(
      -width * 0.7,
      Math.min(width * 0.7, event.clientX - pointerStart.current),
    );
    dragXRef.current = nextValue;
    setDragX(nextValue);
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || animatingDecision) return;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const width = cardRef.current?.getBoundingClientRect().width ?? 640;
    const threshold = width * 0.27;
    if (dragXRef.current <= -threshold) completeDecision("dismissed");
    else if (dragXRef.current >= threshold) completeDecision("interested");
    else {
      dragXRef.current = 0;
      setDragX(0);
    }
  }

  const dragRatio = Math.min(Math.abs(dragX) / 160, 1);

  return (
    <div className="mx-auto w-full max-w-[880px]">
      <div className="relative px-0 pt-5 sm:px-5">
        {Array.from({ length: remainingCards }).map((_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="absolute inset-x-7 top-2 h-[92%] rounded-[24px] border border-hairline bg-white shadow-sm sm:inset-x-12"
            style={{
              zIndex: remainingCards - index,
              transform: `translate(${index % 2 === 0 ? 12 : -10}px, ${index * 13}px) rotate(${index % 2 === 0 ? 1.2 : -1}deg)`,
              opacity: 0.72 - index * 0.18,
            }}
          />
        ))}

        <div
          ref={cardRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className={cn(
            "relative z-10 select-none overflow-hidden rounded-[24px] border border-hairline bg-white shadow-[0_18px_48px_rgba(15,23,42,0.10)]",
            dragging ? "cursor-grabbing" : "cursor-grab",
            animatingDecision === "later" && "scale-[0.97] opacity-0",
          )}
          style={{
            touchAction: "pan-y",
            transform: `translateX(${dragX}px) rotate(${dragX / 85}deg)`,
            transition: dragging ? "none" : "transform 220ms ease, opacity 220ms ease",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-start bg-red-500/10 px-8 text-red-600"
            style={{ opacity: dragX < 0 ? dragRatio : 0 }}
          >
            <span className="-rotate-6 rounded-xl border-2 border-red-500 bg-white/90 px-4 py-2 text-sm font-extrabold tracking-wide">
              NÃO TENHO INTERESSE
            </span>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-end bg-[#29C454]/10 px-8 text-[#15943a]"
            style={{ opacity: dragX > 0 ? dragRatio : 0 }}
          >
            <span className="rotate-6 rounded-xl border-2 border-[#29C454] bg-white/90 px-4 py-2 text-sm font-extrabold tracking-wide">
              TENHO INTERESSE
            </span>
          </div>

          <article aria-labelledby={`opportunity-${opportunity.id}`}>
            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                {opportunity.isDemo && (
                  <Badge className="gap-1 border border-violet-200 bg-violet-50 text-violet-700 shadow-none hover:bg-violet-50">
                    <FlaskConical className="size-3" />
                    Edital simulado
                  </Badge>
                )}
                <Badge className="border-0 bg-blue-50 text-blue-700 shadow-none hover:bg-blue-50">
                  {opportunity.platform}
                </Badge>
                <Badge variant="outline" className="border-hairline bg-white text-slate-text">
                  {opportunity.state}
                </Badge>
                <Badge className="border-0 bg-amber-50 text-amber-700 shadow-none hover:bg-amber-50">
                  Disputa em {opportunity.openingDate}
                </Badge>
                <div className="flex w-full items-center justify-between gap-2 sm:ml-auto sm:w-auto sm:justify-start">
                  <Badge className="gap-1.5 border border-[#29C454]/20 bg-[#29C454]/10 text-[#15943a] shadow-none hover:bg-[#29C454]/10">
                    <Sparkles className="size-3" />
                    {typeof opportunity.matchScore === "number"
                      ? `Match ${opportunity.matchScore}%`
                      : "Match em cálculo"}
                  </Badge>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleFavorite();
                    }}
                    aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    aria-pressed={isFavorite}
                    className="grid size-9 place-items-center rounded-full text-slate-text transition-colors hover:bg-slate-100 hover:text-[#29C454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                  >
                    <Star className={cn("size-4", isFavorite && "fill-[#29C454] text-[#29C454]")} />
                  </button>
                </div>
              </div>

              <h2
                id={`opportunity-${opportunity.id}`}
                className="mt-6 text-[22px] font-bold leading-[1.35] tracking-[-0.02em] text-ink sm:text-[25px]"
              >
                {opportunity.title}
              </h2>
              <p className="mt-3 flex items-start gap-2 text-[12px] font-semibold uppercase leading-relaxed tracking-[0.02em] text-slate-text">
                <Building2 className="mt-0.5 size-4 shrink-0" />
                {opportunity.agency}
              </p>
              <p className="mt-4 text-[14px] font-medium leading-6 text-slate-text">
                {opportunity.description}
              </p>
              {opportunity.isDemo && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 text-[11px] font-semibold text-violet-700">
                  <Info className="size-3.5 shrink-0" />
                  Dados fictícios e verossímeis usados somente para demonstrar a experiência da
                  tela.
                </p>
              )}

              <div className="mt-6 grid grid-cols-2 rounded-2xl border border-hairline bg-slate-50/60 p-4 sm:grid-cols-4">
                <MetadataItem
                  icon={<CalendarDays />}
                  label="Data / hora"
                  value={`${opportunity.openingDate}${opportunity.openingTime ? ` · ${opportunity.openingTime}` : ""}`}
                />
                <MetadataItem
                  icon={<PackageSearch />}
                  label="Itens"
                  value={String(opportunity.items.length)}
                />
                <MetadataItem
                  icon={<CircleDollarSign />}
                  label="Valor estimado"
                  value={opportunity.estimatedValue}
                />
                <MetadataItem
                  icon={<Target />}
                  label="Match"
                  value={
                    typeof opportunity.matchScore === "number"
                      ? `${opportunity.matchScore}%`
                      : "Não disponível"
                  }
                  last
                />
              </div>

              <div className="mt-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-text">
                  Itens da licitação
                </p>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0 space-y-2.5">
                    {opportunity.items.slice(0, 2).map((item, index) => (
                      <div key={item} className="flex min-w-0 gap-3">
                        <span className="text-[13px] font-semibold text-slate-text">
                          {index + 1}.
                        </span>
                        <p className="text-[13px] font-medium leading-5 text-ink">{item}</p>
                      </div>
                    ))}
                    {opportunity.items.length > 2 && (
                      <p className="pl-6 text-[11px] font-bold text-[#15943a]">
                        + {opportunity.items.length - 2} item adicional
                      </p>
                    )}
                  </div>
                  <Button variant="outline" className="h-10 shrink-0 rounded-xl text-[12px]">
                    Ver detalhes do item
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-hairline bg-slate-50/40 px-5 py-4 sm:px-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={autoParticipate}
                    onCheckedChange={(checked) => onAutoParticipateChange(checked === true)}
                    aria-label="Participar automaticamente desta disputa com o robô"
                    className="mt-1"
                  />
                  <span>
                    <span className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                      <Bot className="size-4 text-slate-text" />
                      Participar automaticamente desta disputa com o robô
                    </span>
                    <span className="mt-1 block text-[11px] font-medium text-slate-text">
                      Acompanhar o pós-disputa e registrar resultados.
                    </span>
                  </span>
                </label>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-2 self-end text-[12px] font-bold text-[#15943a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454] sm:self-auto"
                >
                  Saiba mais
                  <Info className="size-4" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div className="sticky bottom-0 z-30 -mx-4 mt-5 grid grid-cols-3 gap-1 border-y border-hairline bg-white/95 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_28px_rgba(15,23,42,0.10)] backdrop-blur sm:static sm:mx-auto sm:mt-7 sm:max-w-[650px] sm:gap-6 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
        <DecisionButton
          icon={<X />}
          title="Excluir"
          description="Não tenho interesse"
          tone="danger"
          ariaLabel="Descartar oportunidade"
          onClick={() => completeDecision("dismissed")}
        />
        <DecisionButton
          icon={<Clock3 />}
          title="Ver depois"
          description="Analisar mais tarde"
          tone="neutral"
          ariaLabel="Salvar oportunidade para ver depois"
          onClick={() => completeDecision("later")}
        />
        <DecisionButton
          icon={<Heart />}
          title="Tenho interesse"
          description="Avançar para análise"
          tone="positive"
          ariaLabel="Marcar interesse na oportunidade"
          onClick={() => completeDecision("interested")}
        />
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-[12px] font-medium text-slate-text sm:mt-5">
        <RefreshCcw className="size-4" aria-hidden="true" />
        Arraste para os lados ou use as ações
      </p>
    </div>
  );
}

function MetadataItem({
  icon,
  label,
  value,
  last = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 px-3 py-3 sm:py-1",
        !last && "border-b border-hairline sm:border-b-0 sm:border-r",
      )}
    >
      <span className="shrink-0 text-slate-text [&_svg]:size-5">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[11px] font-medium text-slate-text">{label}</span>
        <span className="mt-0.5 block truncate text-[13px] font-bold text-ink">{value}</span>
      </span>
    </div>
  );
}

function DecisionButton({
  icon,
  title,
  description,
  tone,
  ariaLabel,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tone: "danger" | "neutral" | "positive";
  ariaLabel: string;
  onClick: () => void;
}) {
  const toneClasses = {
    danger: "border-red-300 text-red-500 hover:bg-red-50",
    neutral: "border-slate-300 text-ink hover:bg-slate-50",
    positive: "border-[#29C454]/60 text-[#18a541] hover:bg-[#29C454]/[0.06]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="group flex min-w-0 flex-col items-center gap-2 rounded-2xl p-2 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454] sm:flex-row sm:text-left"
    >
      <span
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-full border bg-white shadow-sm transition-transform group-hover:-translate-y-0.5 sm:size-16 [&_svg]:size-5 sm:[&_svg]:size-7",
          toneClasses[tone],
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            "block text-[12px] font-bold sm:text-[12px]",
            tone === "danger"
              ? "text-red-500"
              : tone === "positive"
                ? "text-[#18a541]"
                : "text-ink",
          )}
        >
          {title}
        </span>
        <span className="mt-1 hidden text-[10px] font-medium leading-4 text-slate-text sm:block">
          {description}
        </span>
      </span>
    </button>
  );
}

function IntelligencePanel({
  opportunity,
  analysisStatus,
  onAnalyze,
}: {
  opportunity: NewOpportunity;
  analysisStatus: AnalysisStatus;
  onAnalyze: () => void;
}) {
  const analysis = analysisStatus === "done" ? opportunity.documentAnalysis : undefined;

  return (
    <>
      <MobileIntelligencePanel
        opportunity={opportunity}
        analysisStatus={analysisStatus}
        onAnalyze={onAnalyze}
      />
      <aside
        aria-label="Inteligência da oportunidade"
        className="hidden min-w-0 space-y-4 xl:sticky xl:top-6 xl:block xl:self-start"
      >
        <Panel className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-hairline px-5 py-4">
            <Lightbulb className="size-5 text-[#29C454]" />
            <h2 className="text-[14px] font-bold text-ink">Insights da oportunidade</h2>
          </div>
          <div className="space-y-4 p-5">
            <InsightProgress
              icon={<Target />}
              label="Score de aderência"
              value={opportunity.matchScore}
            />
            <InsightProgress
              icon={<TrendingUp />}
              label="Chance de sucesso"
              value={opportunity.successChance}
            />
            <InsightRow
              icon={<Users />}
              label="Concorrência"
              value={
                typeof opportunity.supplierCount === "number"
                  ? `${opportunity.competitionLevel ? `${opportunity.competitionLevel} · ` : ""}${opportunity.supplierCount} fornecedores`
                  : "Não disponível"
              }
            />
            <InsightRow
              icon={<ShieldCheck />}
              label="Risco do órgão"
              value={opportunity.agencyRisk ?? "Não disponível"}
            />
            <InsightRow
              icon={<TrendingUp />}
              label="Histórico similar"
              value={
                typeof opportunity.similarWins === "number"
                  ? `${opportunity.similarWins} disputas vencidas`
                  : "Não disponível"
              }
            />
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-between border-t border-hairline px-5 py-3.5 text-[12px] font-semibold text-ink transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#29C454]"
          >
            Ver mais detalhes
            <ArrowRight className="size-4" />
          </button>
        </Panel>

        <Panel className="overflow-hidden">
          <section className="p-5" aria-labelledby="ray-title">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <FileSearch className="size-5 text-slate-text" />
                <h2 id="ray-title" className="text-[14px] font-bold text-ink">
                  Raio-X do edital
                </h2>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={onAnalyze}
                disabled={analysisStatus === "processing"}
                aria-label="Analisar edital e anexos"
                className="h-9 rounded-xl border-[#29C454] text-[11px] font-bold text-[#15943a] hover:bg-[#29C454]/[0.06] hover:text-[#15943a]"
              >
                {analysisStatus === "processing" ? (
                  <RefreshCcw className="animate-spin" />
                ) : (
                  <Sparkles />
                )}
                {analysisStatus === "processing"
                  ? "Analisando documentos..."
                  : analysisStatus === "done"
                    ? "Análise concluída"
                    : "Analisar edital e anexos"}
              </Button>
            </div>

            <div className="mt-5">
              <h3 className="text-[12px] font-bold text-ink">Resumo do edital</h3>
              <p className="mt-2 text-[11px] font-medium leading-5 text-slate-text">
                {analysis
                  ? analysis.summary
                  : "Analise os documentos para extrair resumo, exigências, prazos e condições."}
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
              <AnalysisDatum label="Exigência técnica" value={analysis?.technicalRequirement} />
              <AnalysisDatum label="Prazo de entrega" value={analysis?.deliveryDeadline} />
              <AnalysisDatum label="Condições de pagamento" value={analysis?.paymentTerms} />
            </div>
          </section>

          <IntelligenceSection
            icon={<PackageSearch />}
            title="Produtos sugeridos"
            action="Ver todos"
          >
            {analysis ? (
              <ProductPreviewList products={analysis.products} />
            ) : (
              <div className="rounded-xl border border-dashed border-hairline bg-slate-50/60 p-4 text-[11px] font-medium leading-5 text-slate-text">
                Nenhum produto foi sugerido. Execute o Raio-X ou conecte o catálogo da empresa.
              </div>
            )}
          </IntelligenceSection>

          <IntelligenceSection
            icon={<ShieldCheck />}
            title="Requisitos de habilitação"
            action="Ver todos os requisitos"
          >
            {analysis ? (
              <RequirementsList requirements={analysis.requirements} />
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-[11px] font-semibold text-amber-800">
                <Info className="size-4 shrink-0" />
                Não identificado — análise documental necessária.
              </div>
            )}
          </IntelligenceSection>

          <button
            type="button"
            className="flex w-full items-center justify-between border-t border-hairline px-5 py-3.5 text-[12px] font-semibold text-ink transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#29C454]"
          >
            Ver edital e anexos
            <ArrowRight className="size-4" />
          </button>
        </Panel>
      </aside>
    </>
  );
}

function MobileIntelligencePanel({
  opportunity,
  analysisStatus,
  onAnalyze,
}: {
  opportunity: NewOpportunity;
  analysisStatus: AnalysisStatus;
  onAnalyze: () => void;
}) {
  const analysis = analysisStatus === "done" ? opportunity.documentAnalysis : undefined;

  return (
    <section aria-labelledby="mobile-intelligence-title" className="min-w-0 xl:hidden">
      <div className="mb-3 flex items-center gap-2">
        <Lightbulb className="size-5 text-[#29C454]" aria-hidden="true" />
        <h2 id="mobile-intelligence-title" className="text-[17px] font-bold text-ink">
          Inteligência da oportunidade
        </h2>
      </div>

      <Panel className="overflow-hidden">
        <Accordion type="single" defaultValue="insights" collapsible>
          <AccordionItem value="insights" className="border-hairline px-4 sm:px-5">
            <AccordionTrigger className="min-h-14 py-3 text-[14px] font-bold text-ink hover:no-underline">
              <span className="flex items-center gap-2">
                <Target className="size-4 text-[#29C454]" aria-hidden="true" />
                Insights da oportunidade
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-5">
              <InsightProgress
                icon={<Target />}
                label="Score de aderência"
                value={opportunity.matchScore}
              />
              <InsightProgress
                icon={<TrendingUp />}
                label="Chance de sucesso"
                value={opportunity.successChance}
              />
              <InsightRow
                icon={<Users />}
                label="Concorrência"
                value={
                  typeof opportunity.supplierCount === "number"
                    ? `${opportunity.competitionLevel ? `${opportunity.competitionLevel} · ` : ""}${opportunity.supplierCount} fornecedores`
                    : "Não disponível"
                }
              />
              <InsightRow
                icon={<ShieldCheck />}
                label="Risco do órgão"
                value={opportunity.agencyRisk ?? "Não disponível"}
              />
              <InsightRow
                icon={<TrendingUp />}
                label="Histórico similar"
                value={
                  typeof opportunity.similarWins === "number"
                    ? `${opportunity.similarWins} disputas vencidas`
                    : "Não disponível"
                }
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ray" className="border-hairline px-4 sm:px-5">
            <AccordionTrigger className="min-h-14 py-3 text-[14px] font-bold text-ink hover:no-underline">
              <span className="flex items-center gap-2">
                <FileSearch className="size-4 text-slate-text" aria-hidden="true" />
                Raio-X e resumo do edital
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <Button
                type="button"
                variant="outline"
                onClick={onAnalyze}
                disabled={analysisStatus === "processing"}
                className="min-h-11 w-full rounded-xl border-[#29C454] text-[13px] font-bold text-[#15943a]"
              >
                {analysisStatus === "processing" ? (
                  <RefreshCcw className="animate-spin" />
                ) : (
                  <Sparkles />
                )}
                {analysisStatus === "processing"
                  ? "Analisando documentos..."
                  : analysisStatus === "done"
                    ? "Análise concluída"
                    : "Analisar edital e anexos"}
              </Button>
              <p className="mt-4 text-[13px] font-medium leading-relaxed text-slate-text">
                {analysis
                  ? analysis.summary
                  : "Analise os documentos para extrair resumo, exigências, prazos e condições."}
              </p>
              <div className="mt-4 grid gap-3 min-[480px]:grid-cols-3">
                <AnalysisDatum label="Exigência técnica" value={analysis?.technicalRequirement} />
                <AnalysisDatum label="Prazo de entrega" value={analysis?.deliveryDeadline} />
                <AnalysisDatum label="Condições de pagamento" value={analysis?.paymentTerms} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="products" className="border-hairline px-4 sm:px-5">
            <AccordionTrigger className="min-h-14 py-3 text-[14px] font-bold text-ink hover:no-underline">
              <span className="flex items-center gap-2">
                <PackageSearch className="size-4 text-slate-text" aria-hidden="true" />
                Produtos sugeridos
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              {analysis ? (
                <ProductPreviewList products={analysis.products} />
              ) : (
                <div className="rounded-xl border border-dashed border-hairline bg-slate-50/60 p-4 text-[13px] font-medium leading-relaxed text-slate-text">
                  Nenhum produto foi sugerido. Execute o Raio-X ou conecte o catálogo da empresa.
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="requirements" className="border-0 px-4 sm:px-5">
            <AccordionTrigger className="min-h-14 py-3 text-[14px] font-bold text-ink hover:no-underline">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-slate-text" aria-hidden="true" />
                Requisitos de habilitação
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              {analysis ? (
                <RequirementsList requirements={analysis.requirements} showDetails />
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-3 text-[13px] font-semibold leading-relaxed text-amber-800">
                  <Info className="size-4 shrink-0" aria-hidden="true" />
                  Não identificado — análise documental necessária.
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Panel>
    </section>
  );
}

function InsightProgress({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: number | undefined;
}) {
  return (
    <div className="grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-2.5">
      <span className="text-slate-text [&_svg]:size-4">{icon}</span>
      <div className="min-w-0">
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="text-[12px] font-medium text-slate-text">{label}</span>
        </div>
        {typeof value === "number" ? (
          <Progress value={value} className="h-1.5 bg-slate-100" />
        ) : (
          <div className="h-1.5 rounded-full bg-slate-100" />
        )}
      </div>
      <span className="text-[12px] font-bold tabular-nums text-ink">
        {typeof value === "number" ? `${value}%` : "N/D"}
      </span>
    </div>
  );
}

function InsightRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-2.5">
      <span className="text-slate-text [&_svg]:size-4">{icon}</span>
      <span className="text-[12px] font-medium text-slate-text">{label}</span>
      <span className="text-right text-[12px] font-semibold text-ink">{value}</span>
    </div>
  );
}

function AnalysisDatum({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="rounded-xl border border-hairline bg-slate-50/50 p-3">
      <p className="text-[11px] font-bold text-ink">{label}</p>
      <p className="mt-1.5 text-[11px] font-medium leading-[1.55] text-slate-text">
        {value ?? "Não identificado"}
      </p>
    </div>
  );
}

function ProductPreviewList({ products }: { products: OpportunityProduct[] }) {
  return (
    <div className="space-y-2">
      {products.map((product) => (
        <article
          key={product.sku}
          className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-hairline bg-white p-3"
        >
          <span className="grid size-[38px] place-items-center rounded-lg bg-[#29C454]/10 text-[#15943a]">
            <PackageSearch className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h4 className="truncate text-[11px] font-bold text-ink">{product.name}</h4>
            <p className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-[0.04em] text-slate-text">
              {product.sku}
            </p>
            <p className="mt-1 line-clamp-1 text-[10px] font-medium text-slate-text">
              {product.note}
            </p>
          </div>
          <span className="rounded-full bg-[#29C454]/10 px-2 py-1 text-[10px] font-extrabold tabular-nums text-[#15943a]">
            {product.compatibility}%
          </span>
        </article>
      ))}
    </div>
  );
}

function RequirementsList({
  requirements,
  showDetails = false,
}: {
  requirements: OpportunityRequirement[];
  showDetails?: boolean;
}) {
  return (
    <div className="grid gap-2 2xl:grid-cols-2">
      {requirements.map((requirement) => {
        const isCompliant = requirement.status === "Conforme";
        const needsAttention = requirement.status === "Atenção";

        return (
          <div
            key={requirement.label}
            className={cn(
              "rounded-xl border px-3 py-2.5",
              isCompliant
                ? "border-[#29C454]/20 bg-[#29C454]/[0.05]"
                : needsAttention
                  ? "border-amber-200 bg-amber-50"
                  : "border-hairline bg-slate-50",
            )}
          >
            <div className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full",
                  isCompliant
                    ? "bg-[#29C454] text-white"
                    : needsAttention
                      ? "bg-amber-500 text-white"
                      : "bg-slate-200 text-slate-text",
                )}
              >
                {isCompliant ? <Check className="size-3" /> : <Info className="size-2.5" />}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold leading-4 text-ink">{requirement.label}</p>
                <p
                  className={cn(
                    "mt-0.5 text-[9px] font-bold",
                    isCompliant
                      ? "text-[#15943a]"
                      : needsAttention
                        ? "text-amber-700"
                        : "text-slate-text",
                  )}
                >
                  {requirement.status}
                </p>
                {showDetails && (
                  <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-text">
                    {requirement.detail}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IntelligenceSection({
  icon,
  title,
  action,
  children,
}: {
  icon: ReactNode;
  title: string;
  action: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-hairline p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-slate-text [&_svg]:size-4">{icon}</span>
          <h3 className="text-[12px] font-bold text-ink">{title}</h3>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#15943a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          {action}
          <ChevronRight className="size-3" />
        </button>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function EmptyQueue({
  showFavorites,
  savedCount,
  interestedCount,
  onReset,
  onReviewSaved,
}: {
  showFavorites: boolean;
  savedCount: number;
  interestedCount: number;
  onReset: () => void;
  onReviewSaved: () => void;
}) {
  return (
    <Panel className="mx-auto mt-10 max-w-2xl p-8 text-center sm:p-12">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#29C454]/10 text-[#29C454]">
        <Check className="size-7" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-ink">
        {showFavorites
          ? "Nenhuma oportunidade favorita neste filtro."
          : "Você analisou todas as oportunidades disponíveis."}
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-[13px] font-medium leading-6 text-slate-text">
        Novas oportunidades aparecerão aqui conforme forem publicadas. Você marcou {interestedCount}{" "}
        como interessante e salvou {savedCount} para revisar.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        {savedCount > 0 && (
          <Button variant="outline" className="rounded-xl" onClick={onReviewSaved}>
            Revisar oportunidades salvas
          </Button>
        )}
        <Button className="rounded-xl bg-[#29C454] hover:bg-[#22ad49]" onClick={onReset}>
          Alterar filtros
        </Button>
      </div>
    </Panel>
  );
}

function InterestDialog({
  draft,
  onOpenChange,
  onPriorityChange,
  onNoteChange,
  onConfirm,
}: {
  draft: { opportunity: NewOpportunity; priority: OpportunityPriority; note: string } | null;
  onOpenChange: (open: boolean) => void;
  onPriorityChange: (priority: OpportunityPriority) => void;
  onNoteChange: (note: string) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={Boolean(draft)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl border-hairline bg-white p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-hairline px-5 py-5 sm:px-6">
          <DialogTitle className="text-[18px] text-ink">Adicionar a operação</DialogTitle>
          <DialogDescription className="pt-1 text-[13px] leading-relaxed text-slate-text">
            {draft?.opportunity.title}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 px-5 py-5 sm:px-6">
          <fieldset>
            <legend className="text-[13px] font-bold text-ink">Prioridade inicial</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(
                [
                  ["normal", "Normal", "Entrar na fila de análise"],
                  ["high", "Priorizar", "Destacar no pipeline"],
                ] as const
              ).map(([value, title, description]) => {
                const selected = draft?.priority === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onPriorityChange(value)}
                    className={cn(
                      "min-h-20 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                      selected
                        ? "border-[#29C454] bg-[#29C454]/[0.07] text-[#13763a]"
                        : "border-hairline bg-white text-ink hover:border-[#29C454]/45",
                    )}
                  >
                    <span className="block text-[12px] font-extrabold">{title}</span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-slate-text">
                      {description}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
          <label className="grid gap-2">
            <span className="text-[13px] font-bold text-ink">
              Anotação inicial <span className="font-medium text-slate-text">(opcional)</span>
            </span>
            <textarea
              value={draft?.note ?? ""}
              onChange={(event) => onNoteChange(event.target.value)}
              placeholder="Ex.: confirmar garantia on-site antes de preparar a proposta."
              rows={3}
              className="w-full resize-none rounded-xl border border-hairline bg-white px-3 py-2.5 text-[13px] leading-relaxed text-ink outline-none transition placeholder:text-slate-400 focus:border-[#29C454] focus:ring-2 focus:ring-[#29C454]/15"
            />
          </label>
        </div>
        <DialogFooter className="flex-row justify-between border-t border-hairline bg-slate-50/60 px-5 py-4 sm:px-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="min-h-11 rounded-xl text-[12px] font-bold text-slate-text"
          >
            Agora não
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
          >
            Adicionar a operação
            <ArrowRight className="size-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FiltersDialog({
  open,
  onOpenChange,
  states,
  value,
  onValueChange,
  onApply,
  onClear,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  states: string[];
  value: string;
  onValueChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-hairline bg-white">
        <DialogHeader>
          <DialogTitle className="text-ink">Filtrar oportunidades</DialogTitle>
          <DialogDescription>
            Refine a fila usando os dados disponíveis na aplicação.
          </DialogDescription>
        </DialogHeader>
        <label className="mt-2 block">
          <span className="text-[12px] font-bold text-ink">Estado</span>
          <select
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-hairline bg-white px-3 text-[13px] font-medium text-ink outline-none transition focus:border-[#29C454] focus:ring-4 focus:ring-[#29C454]/10"
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
        <div className="rounded-xl border border-dashed border-hairline bg-slate-50 p-4 text-[11px] font-medium leading-5 text-slate-text">
          Filtros de órgão, modalidade, categoria, valor e período estão preparados para integração
          com a fonte de dados completa.
        </div>
        <DialogFooter className="gap-2 sm:space-x-0">
          <Button variant="ghost" onClick={onClear}>
            Limpar
          </Button>
          <Button className="bg-[#29C454] hover:bg-[#22ad49]" onClick={onApply}>
            Aplicar filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OpportunitiesPageSkeleton() {
  return (
    <div className="flex-1 overflow-hidden bg-[#F8FAFC] px-4 py-6 sm:px-6 xl:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-60" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="mt-6 flex gap-2 overflow-hidden">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-24 shrink-0 rounded-full" />
          ))}
        </div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.85fr)]">
          <Skeleton className="h-[620px] rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
