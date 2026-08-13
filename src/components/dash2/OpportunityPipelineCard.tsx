import { useState, type DragEvent } from "react";
import {
  ArchiveX,
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Columns3,
  FileCheck2,
  Gavel,
  GripVertical,
  SearchCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel, PanelHeader } from "./Panel";

type PipelineStage = "analysis" | "prioritized" | "preparation" | "dispute";

type PipelineOpportunity = {
  id: string;
  title: string;
  agency: string;
  platform: "ComprasNet" | "Licitanet" | "PCP" | "BNC";
  state: string;
  value: string;
  deadline: string;
  match: number;
  stage: PipelineStage;
};

type StageConfig = {
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  iconSurface: string;
  badge: string;
  laneSurface: string;
};

const stageOrder: PipelineStage[] = ["analysis", "prioritized", "preparation", "dispute"];

const stageConfig: Record<PipelineStage, StageConfig> = {
  analysis: {
    label: "Em análise",
    description: "Decida se vale avançar",
    icon: SearchCheck,
    accent: "bg-blue-500",
    iconSurface: "border-blue-100 bg-blue-50 text-blue-600",
    badge: "border-blue-100 bg-blue-50 text-blue-700",
    laneSurface: "bg-blue-50/35",
  },
  prioritized: {
    label: "Priorizadas",
    description: "Melhores oportunidades",
    icon: Star,
    accent: "bg-[#29C454]",
    iconSurface: "border-[#29C454]/20 bg-[#29C454]/10 text-[#16863A]",
    badge: "border-[#29C454]/20 bg-[#29C454]/10 text-[#16863A]",
    laneSurface: "bg-[#F0FDF4]/45",
  },
  preparation: {
    label: "Preparação",
    description: "Documentos e proposta",
    icon: FileCheck2,
    accent: "bg-orange-500",
    iconSurface: "border-orange-100 bg-orange-50 text-orange-600",
    badge: "border-orange-100 bg-orange-50 text-orange-700",
    laneSurface: "bg-orange-50/35",
  },
  dispute: {
    label: "Em disputa",
    description: "Acompanhamento ao vivo",
    icon: Gavel,
    accent: "bg-violet-500",
    iconSurface: "border-violet-100 bg-violet-50 text-violet-600",
    badge: "border-violet-100 bg-violet-50 text-violet-700",
    laneSurface: "bg-violet-50/35",
  },
};

const initialOpportunities: PipelineOpportunity[] = [
  {
    id: "PE 90031/2026",
    title: "Aquisição de estações de trabalho, monitores e notebooks",
    agency: "Consórcio Intermunicipal de Serviços Públicos do Sul",
    platform: "ComprasNet",
    state: "RS",
    value: "R$ 684.250",
    deadline: "18 ago",
    match: 94,
    stage: "analysis",
  },
  {
    id: "PE 1042/2026",
    title: "Licenciamento de software e serviços de segurança em nuvem",
    agency: "Secretaria de Administração do Estado",
    platform: "Licitanet",
    state: "SP",
    value: "R$ 318.900",
    deadline: "19 ago",
    match: 91,
    stage: "analysis",
  },
  {
    id: "PE 087/2026",
    title: "Manutenção preventiva do parque de informática municipal",
    agency: "Prefeitura Municipal de Florianópolis",
    platform: "PCP",
    state: "SC",
    value: "R$ 156.400",
    deadline: "21 ago",
    match: 86,
    stage: "analysis",
  },
  {
    id: "PE 722/2026",
    title: "Fornecimento de notebooks corporativos com garantia on-site",
    agency: "Tribunal Regional do Trabalho da 4ª Região",
    platform: "ComprasNet",
    state: "RS",
    value: "R$ 492.000",
    deadline: "20 ago",
    match: 97,
    stage: "prioritized",
  },
  {
    id: "PE 331/2026",
    title: "Aquisição de servidores para ambiente de virtualização",
    agency: "Universidade Federal de Minas Gerais",
    platform: "BNC",
    state: "MG",
    value: "R$ 875.300",
    deadline: "23 ago",
    match: 93,
    stage: "prioritized",
  },
  {
    id: "PE 118/2026",
    title: "Solução integrada de backup e recuperação de dados",
    agency: "Companhia Estadual de Tecnologia",
    platform: "Licitanet",
    state: "PR",
    value: "R$ 264.700",
    deadline: "24 ago",
    match: 90,
    stage: "prioritized",
  },
  {
    id: "PE 506/2026",
    title: "Renovação de licenças, suporte e monitoramento de rede",
    agency: "Prefeitura Municipal de Campinas",
    platform: "ComprasNet",
    state: "SP",
    value: "R$ 198.600",
    deadline: "17 ago",
    match: 95,
    stage: "preparation",
  },
  {
    id: "PE 041/2026",
    title: "Serviço especializado de sustentação de infraestrutura",
    agency: "Assembleia Legislativa do Estado",
    platform: "PCP",
    state: "GO",
    value: "R$ 411.800",
    deadline: "22 ago",
    match: 89,
    stage: "preparation",
  },
  {
    id: "PE 845/2026",
    title: "Aquisição de computadores com monitor para unidades públicas",
    agency: "Prefeitura Municipal de Guarulhos",
    platform: "ComprasNet",
    state: "SP",
    value: "R$ 426.120",
    deadline: "Hoje, 14h",
    match: 96,
    stage: "dispute",
  },
  {
    id: "PE 209/2026",
    title: "Registro de preços para equipamentos de conectividade",
    agency: "Secretaria Estadual de Educação",
    platform: "BNC",
    state: "BA",
    value: "R$ 538.400",
    deadline: "Hoje, 16h",
    match: 92,
    stage: "dispute",
  },
];

const nextStage: Partial<Record<PipelineStage, PipelineStage>> = {
  analysis: "prioritized",
  prioritized: "preparation",
  preparation: "dispute",
};

const previousStage: Partial<Record<PipelineStage, PipelineStage>> = {
  prioritized: "analysis",
  preparation: "prioritized",
  dispute: "preparation",
};

function PipelineOpportunityCard({
  opportunity,
  onDiscard,
  onMove,
  onDragStart,
  onDragEnd,
}: {
  opportunity: PipelineOpportunity;
  onDiscard: (opportunity: PipelineOpportunity) => void;
  onMove: (id: string, stage: PipelineStage) => void;
  onDragStart: (event: DragEvent<HTMLElement>, id: string) => void;
  onDragEnd: () => void;
}) {
  const config = stageConfig[opportunity.stage];
  const forward = nextStage[opportunity.stage];
  const back = previousStage[opportunity.stage];

  return (
    <article
      draggable
      onDragStart={(event) => onDragStart(event, opportunity.id)}
      onDragEnd={onDragEnd}
      className="group relative rounded-xl border border-hairline bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-within:border-[#29C454]/40 sm:p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">
            {opportunity.platform}
          </span>
          <span className="rounded-md border border-hairline px-2 py-1 text-[11px] font-bold text-slate-text">
            {opportunity.state}
          </span>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold tabular-nums",
            config.badge,
          )}
        >
          <Sparkles className="size-3" aria-hidden="true" />
          {opportunity.match}%
        </span>
      </div>

      <div className="mt-3 flex items-start gap-2">
        <GripVertical
          className="mt-0.5 hidden size-4 shrink-0 cursor-grab text-slate-300 transition-colors group-hover:text-slate-400 lg:block"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-text">
            {opportunity.id}
          </p>
          <h4 className="mt-1 line-clamp-2 text-[14px] font-bold leading-snug text-ink">
            {opportunity.title}
          </h4>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 text-slate-text">
        <Building2 className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <p className="line-clamp-1 text-[12px] font-medium leading-relaxed">{opportunity.agency}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-hairline bg-slate-50/65 p-2.5">
        <div className="min-w-0">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-text">
            <CircleDollarSign className="size-3" aria-hidden="true" /> Valor
          </span>
          <p className="mt-1 truncate text-[12px] font-bold text-ink tabular-nums">
            {opportunity.value}
          </p>
        </div>
        <div className="min-w-0 border-l border-hairline pl-2.5">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-text">
            <CalendarDays className="size-3" aria-hidden="true" /> Prazo
          </span>
          <p className="mt-1 truncate text-[12px] font-bold text-ink tabular-nums">
            {opportunity.deadline}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-hairline pt-3">
        {opportunity.stage === "analysis" ? (
          <button
            type="button"
            onClick={() => onDiscard(opportunity)}
            aria-label={`Descartar ${opportunity.id}`}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-[12px] font-bold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <X className="size-3.5" aria-hidden="true" />
            Descartar
          </button>
        ) : back ? (
          <button
            type="button"
            onClick={() => onMove(opportunity.id, back)}
            aria-label={`Mover ${opportunity.id} para ${stageConfig[back].label}`}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-[12px] font-bold text-slate-text transition-colors hover:bg-slate-100 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Voltar
          </button>
        ) : (
          <span />
        )}

        {forward ? (
          <button
            type="button"
            onClick={() => onMove(opportunity.id, forward)}
            aria-label={`Mover ${opportunity.id} para ${stageConfig[forward].label}`}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#29C454]/10 px-2.5 text-[12px] font-bold text-[#16863A] transition-colors hover:bg-[#29C454]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
          >
            {opportunity.stage === "analysis"
              ? "Priorizar"
              : opportunity.stage === "prioritized"
                ? "Preparar"
                : "Ir à disputa"}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 text-[12px] font-bold text-violet-700 transition-colors hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            aria-label={`Abrir acompanhamento de ${opportunity.id}`}
          >
            Acompanhar
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
}

function PipelineLane({
  stage,
  opportunities,
  expanded,
  draggedId,
  onExpand,
  onMove,
  onDiscard,
  onDragStart,
  onDragEnd,
  onDrop,
}: {
  stage: PipelineStage;
  opportunities: PipelineOpportunity[];
  expanded: boolean;
  draggedId: string | null;
  onExpand: () => void;
  onMove: (id: string, stage: PipelineStage) => void;
  onDiscard: (opportunity: PipelineOpportunity) => void;
  onDragStart: (event: DragEvent<HTMLElement>, id: string) => void;
  onDragEnd: () => void;
  onDrop: (stage: PipelineStage) => void;
}) {
  const config = stageConfig[stage];
  const Icon = config.icon;
  const visibleItems = expanded ? opportunities : opportunities.slice(0, 2);
  const hiddenCount = opportunities.length - visibleItems.length;

  return (
    <section
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDrop(stage)}
      aria-label={`${config.label}: ${opportunities.length} oportunidades`}
      className={cn(
        "flex min-w-0 flex-col rounded-xl border border-hairline p-2.5 transition-colors sm:p-3 lg:w-[248px] lg:shrink-0 min-[1280px]:w-auto",
        config.laneSurface,
        draggedId ? "border-dashed hover:border-[#29C454]/50 hover:bg-[#F0FDF4]/70" : "",
      )}
    >
      <div className="relative mb-3 overflow-hidden rounded-lg border border-white/80 bg-white/80 p-3 shadow-sm">
        <span className={cn("absolute inset-y-0 left-0 w-1", config.accent)} />
        <div className="flex items-start justify-between gap-2 pl-1">
          <div className="flex min-w-0 items-start gap-2.5">
            <span
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-lg border",
                config.iconSurface,
              )}
            >
              <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="text-[14px] font-bold leading-tight text-ink">{config.label}</h3>
              <p className="mt-1 truncate text-[11px] font-medium text-slate-text">
                {config.description}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "rounded-full border px-2 py-1 text-[11px] font-bold tabular-nums",
              config.badge,
            )}
          >
            {opportunities.length}
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {visibleItems.length > 0 ? (
          visibleItems.map((opportunity) => (
            <PipelineOpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onDiscard={onDiscard}
              onMove={onMove}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        ) : (
          <div className="grid min-h-44 place-items-center rounded-xl border border-dashed border-slate-200 bg-white/65 p-5 text-center">
            <div>
              <CheckCircle2 className="mx-auto size-7 text-slate-300" aria-hidden="true" />
              <p className="mt-2 text-[13px] font-bold text-ink">Etapa organizada</p>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                Arraste uma oportunidade ou avance usando os botões.
              </p>
            </div>
          </div>
        )}
      </div>

      {hiddenCount > 0 ? (
        <button
          type="button"
          onClick={onExpand}
          className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-1 rounded-lg text-[12px] font-bold text-slate-text transition-colors hover:bg-white/80 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          Ver mais {hiddenCount}
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </button>
      ) : null}
    </section>
  );
}

function PipelineHeaderActions({
  archivedCount,
  expanded,
  showDiscarded,
  className,
  onToggleDiscarded,
  onToggleExpanded,
}: {
  archivedCount: number;
  expanded: boolean;
  showDiscarded: boolean;
  className?: string;
  onToggleDiscarded: () => void;
  onToggleExpanded: () => void;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-end gap-2", className)}>
      <button
        type="button"
        aria-pressed={showDiscarded}
        onClick={onToggleDiscarded}
        className={cn(
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-[12px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
          showDiscarded
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-hairline bg-white text-slate-text hover:bg-slate-50 hover:text-ink",
        )}
      >
        <ArchiveX className="size-4" aria-hidden="true" />
        <span>Descartadas</span>
        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] tabular-nums">
          {archivedCount}
        </span>
      </button>
      <button
        type="button"
        onClick={onToggleExpanded}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#29C454] px-3.5 text-[12px] font-bold text-white shadow-sm transition-colors hover:bg-[#24B84C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
      >
        {expanded ? "Resumir" : "Abrir pipeline"}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function OpportunityPipelineCard() {
  const [opportunities, setOpportunities] = useState(() => initialOpportunities);
  const [selectedStage, setSelectedStage] = useState<PipelineStage>("analysis");
  const [expanded, setExpanded] = useState(false);
  const [showDiscarded, setShowDiscarded] = useState(false);
  const [discarded, setDiscarded] = useState<PipelineOpportunity[]>([]);
  const [lastDiscarded, setLastDiscarded] = useState<PipelineOpportunity | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const moveOpportunity = (id: string, stage: PipelineStage) => {
    setOpportunities((current) =>
      current.map((opportunity) =>
        opportunity.id === id ? { ...opportunity, stage } : opportunity,
      ),
    );
    setSelectedStage(stage);
  };

  const discardOpportunity = (opportunity: PipelineOpportunity) => {
    setOpportunities((current) => current.filter((item) => item.id !== opportunity.id));
    setDiscarded((current) => [opportunity, ...current]);
    setLastDiscarded(opportunity);
  };

  const undoDiscard = () => {
    if (!lastDiscarded) return;
    setDiscarded((current) => current.filter((item) => item.id !== lastDiscarded.id));
    setOpportunities((current) => [lastDiscarded, ...current]);
    setSelectedStage(lastDiscarded.stage);
    setLastDiscarded(null);
    setShowDiscarded(false);
  };

  const handleDragStart = (event: DragEvent<HTMLElement>, id: string) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
    setDraggedId(id);
  };

  const handleDrop = (stage: PipelineStage) => {
    if (draggedId) moveOpportunity(draggedId, stage);
    setDraggedId(null);
  };

  const pipelineCount = opportunities.length;
  const archivedCount = 18 + discarded.length;
  const selectedOpportunities = opportunities.filter(
    (opportunity) => opportunity.stage === selectedStage,
  );

  return (
    <Panel className="min-w-0 overflow-hidden xl:col-span-2">
      <div className="p-5 pb-4 sm:p-6 sm:pb-5">
        <PanelHeader
          icon={
            <div className="rounded-lg bg-[#29C454]/10 p-1.5">
              <Columns3 className="size-5 text-[#29C454]" strokeWidth={2} aria-hidden="true" />
            </div>
          }
          title="Pipeline de oportunidades"
          subtitle="Analise, priorize ou descarte oportunidades e acompanhe as melhores até a disputa."
          action={
            <PipelineHeaderActions
              className="hidden sm:flex"
              archivedCount={archivedCount}
              expanded={expanded}
              showDiscarded={showDiscarded}
              onToggleDiscarded={() => setShowDiscarded((current) => !current)}
              onToggleExpanded={() => setExpanded((current) => !current)}
            />
          }
        />

        <PipelineHeaderActions
          className="mt-4 grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] sm:hidden"
          archivedCount={archivedCount}
          expanded={expanded}
          showDiscarded={showDiscarded}
          onToggleDiscarded={() => setShowDiscarded((current) => !current)}
          onToggleExpanded={() => setExpanded((current) => !current)}
        />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
          <div className="flex min-w-0 items-center gap-2 text-[12px] font-medium text-slate-text">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 font-bold text-ink">
              <Sparkles className="size-3.5 text-[#29C454]" aria-hidden="true" />
              {pipelineCount} no fluxo
            </span>
            <span className="hidden lg:inline">
              Arraste os cards entre as etapas ou use as ações.
            </span>
            <span className="lg:hidden">Selecione uma etapa para revisar.</span>
          </div>
          <button
            type="button"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-hairline bg-white px-3 text-[12px] font-bold text-ink transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
          >
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            Filtros
          </button>
        </div>
      </div>

      {showDiscarded ? (
        <div className="border-t border-hairline bg-slate-50/55 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-[15px] font-bold text-ink">Oportunidades descartadas</h3>
              <p className="mt-1 text-[13px] font-medium text-slate-text">
                O histórico completo preserva {archivedCount} decisões para consulta.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDiscarded(false)}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-[12px] font-bold text-[#16863A] transition-colors hover:bg-[#29C454]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
            >
              Voltar ao fluxo
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          </div>

          {discarded.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {discarded.map((opportunity) => (
                <article
                  key={opportunity.id}
                  className="rounded-xl border border-hairline bg-white p-4"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-text">
                    {opportunity.id} · {opportunity.platform}
                  </p>
                  <h4 className="mt-2 line-clamp-2 text-[14px] font-bold leading-snug text-ink">
                    {opportunity.title}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscarded((current) =>
                        current.filter((item) => item.id !== opportunity.id),
                      );
                      setOpportunities((current) => [opportunity, ...current]);
                      setLastDiscarded(null);
                      setShowDiscarded(false);
                      setSelectedStage(opportunity.stage);
                    }}
                    className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#29C454]/10 px-3 text-[12px] font-bold text-[#16863A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                  >
                    Restaurar oportunidade
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center">
              <div>
                <ArchiveX className="mx-auto size-7 text-slate-300" aria-hidden="true" />
                <p className="mt-2 text-[13px] font-bold text-ink">Nenhum descarte nesta sessão</p>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                  As 18 decisões anteriores continuam disponíveis no histórico completo.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div
            className="flex gap-2 overflow-x-auto border-y border-hairline bg-slate-50/45 px-5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden sm:px-6"
            role="tablist"
            aria-label="Etapas do pipeline"
          >
            {stageOrder.map((stage) => {
              const config = stageConfig[stage];
              const Icon = config.icon;
              const count = opportunities.filter((item) => item.stage === stage).length;
              const active = selectedStage === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedStage(stage)}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3 text-[12px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                    active
                      ? "border-[#29C454] bg-[#29C454] text-white shadow-sm"
                      : "border-hairline bg-white text-slate-text",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {config.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                      active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-4 sm:p-5 lg:hidden">
            <PipelineLane
              stage={selectedStage}
              opportunities={selectedOpportunities}
              expanded={expanded}
              draggedId={draggedId}
              onExpand={() => setExpanded(true)}
              onMove={moveOpportunity}
              onDiscard={discardOpportunity}
              onDragStart={handleDragStart}
              onDragEnd={() => setDraggedId(null)}
              onDrop={handleDrop}
            />
          </div>

          <div className="hidden gap-3 overflow-x-auto border-t border-hairline bg-slate-50/45 p-4 lg:flex lg:snap-x lg:snap-mandatory sm:p-5 min-[1280px]:grid min-[1280px]:grid-cols-4 min-[1280px]:overflow-visible">
            {stageOrder.map((stage) => (
              <div key={stage} className="snap-start">
                <PipelineLane
                  stage={stage}
                  opportunities={opportunities.filter((opportunity) => opportunity.stage === stage)}
                  expanded={expanded}
                  draggedId={draggedId}
                  onExpand={() => setExpanded(true)}
                  onMove={moveOpportunity}
                  onDiscard={discardOpportunity}
                  onDragStart={handleDragStart}
                  onDragEnd={() => setDraggedId(null)}
                  onDrop={handleDrop}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {lastDiscarded ? (
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-t border-red-100 bg-red-50/70 px-5 py-3 sm:px-6"
          role="status"
          aria-live="polite"
        >
          <p className="text-[12px] font-semibold text-red-800">
            <span className="font-bold">{lastDiscarded.id}</span> foi descartada.
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={undoDiscard}
              className="inline-flex min-h-10 items-center rounded-lg px-3 text-[12px] font-bold text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              Desfazer
            </button>
            <button
              type="button"
              onClick={() => setLastDiscarded(null)}
              aria-label="Fechar aviso"
              className="grid size-10 place-items-center rounded-lg text-red-500 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
