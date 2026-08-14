import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Bot, CalendarDays, Flag, MapPin, Plus, Sparkles } from "lucide-react";
import { Panel } from "@/components/dash2/Panel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tenders } from "@/components/tender-search/TenderSearchPage";
import { newOpportunities } from "@/lib/new-opportunities-fixtures";
import { disputes } from "@/lib/bid-bot-fixtures";
import { useOpportunityTriage } from "@/hooks/use-opportunity-triage";
import { useBotOperationOutcomes } from "@/hooks/use-bot-operation-outcomes";
import { useTenderDecisions } from "@/hooks/use-tender-decisions";

const stages = [
  "Todas",
  "Em análise",
  "Propostas",
  "Em disputa",
  "Pós-disputa",
  "Finalizadas",
] as const;
type Stage = (typeof stages)[number];

const operationStageLabel = {
  analysis: "Em análise",
  proposal: "Proposta",
  dispute: "Em disputa",
  "post-dispute": "Pós-disputa",
  finalized: "Finalizada",
} as const;

type OperationItem = {
  id: string;
  title: string;
  agency: string;
  location: string;
  deadline: string;
  value: string;
  match: number;
  priority: "normal" | "high";
  note?: string | undefined;
  stage: "analysis" | "proposal" | "dispute" | "post-dispute" | "finalized";
  source: "opportunity" | "search" | "bot";
  botStatus?: string;
  bids?: string;
};

export function OperationPipelinePage() {
  const [stage, setStage] = useState<Stage>("Todas");
  const { triage } = useOpportunityTriage();
  const { decisions } = useTenderDecisions();
  const { outcomes } = useBotOperationOutcomes();

  useEffect(() => {
    const requestedStage = new URLSearchParams(window.location.search).get("stage");
    const validStage = {
      analysis: "Em análise",
      proposal: "Propostas",
      dispute: "Em disputa",
      "post-dispute": "Pós-disputa",
      finalized: "Finalizadas",
    }[requestedStage ?? ""] as Stage | undefined;
    if (validStage) setStage(validStage);
  }, []);

  const items = useMemo<OperationItem[]>(() => {
    const fromOpportunities = newOpportunities.flatMap((opportunity) => {
      const record = triage[opportunity.id];
      if (record?.decision !== "interested") return [];
      return [
        {
          id: opportunity.id,
          title: opportunity.title,
          agency: opportunity.agency,
          location: opportunity.state,
          deadline: `${opportunity.openingDate}${opportunity.openingTime ? ` · ${opportunity.openingTime}` : ""}`,
          value: opportunity.estimatedValue,
          match: opportunity.matchScore ?? 0,
          priority: record.priority ?? "normal",
          note: record.note,
          stage: record.stage ?? "analysis",
          source: "opportunity" as const,
        },
      ];
    });
    const fromSearch = tenders.flatMap((tender) => {
      if (decisions[tender.id] !== "interested") return [];
      return [
        {
          id: tender.id,
          title: tender.title,
          agency: tender.agency,
          location: `${tender.city}/${tender.state}`,
          deadline: tender.proposalDeadline,
          value: new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 0,
          }).format(tender.value),
          match: tender.match,
          priority: "normal" as const,
          stage: "analysis" as const,
          source: "search" as const,
        },
      ];
    });
    const fromBot = disputes.flatMap((dispute) => {
      if (dispute.status !== "Ativa" && dispute.status !== "Pausada") return [];
      if (outcomes[dispute.id]) return [];
      return [
        {
          id: dispute.id,
          title: dispute.object,
          agency: dispute.agency,
          location: `UASG ${dispute.uasg}`,
          deadline: `Sessão ${dispute.date}`,
          value: dispute.estimatedValue,
          match: 0,
          priority: dispute.status === "Ativa" ? ("high" as const) : ("normal" as const),
          stage: "dispute" as const,
          source: "bot" as const,
          botStatus: dispute.status,
          bids: dispute.bids,
        },
      ];
    });
    const fromBotOutcomes = Object.values(outcomes).flatMap((outcome) => {
      const dispute = disputes.find((item) => item.id === outcome.disputeId);
      if (!dispute) return [];

      const isPostDispute = outcome.disposition === "post-dispute";
      const isAdjudicated = outcome.disposition === "adjudicated";
      return [
        {
          id: dispute.id,
          title: dispute.object,
          agency: dispute.agency,
          location: `UASG ${dispute.uasg}`,
          deadline: isPostDispute
            ? "Resultado aguardando conferência"
            : isAdjudicated
              ? "Resultado confirmado"
              : "Resultado registrado",
          value: outcome.finalBid,
          match: 0,
          priority: isPostDispute ? ("high" as const) : ("normal" as const),
          stage: isPostDispute ? ("post-dispute" as const) : ("finalized" as const),
          source: "bot" as const,
          botStatus: isPostDispute ? "Pós-disputa" : isAdjudicated ? "Adjudicada" : "Não êxito",
          bids: String(outcome.bids),
        },
      ];
    });
    return [...fromBot, ...fromBotOutcomes, ...fromOpportunities, ...fromSearch].sort(
      (left, right) => (left.priority === right.priority ? 0 : left.priority === "high" ? -1 : 1),
    );
  }, [decisions, outcomes, triage]);

  const visibleItems = items.filter((item) => {
    if (stage === "Todas") return true;
    if (stage === "Em análise") return item.stage === "analysis";
    if (stage === "Propostas") return item.stage === "proposal";
    if (stage === "Em disputa") return item.stage === "dispute";
    if (stage === "Pós-disputa") return item.stage === "post-dispute";
    if (stage === "Finalizadas") return item.stage === "finalized";
    return false;
  });
  const isInitialStage = stage === "Todas" || stage === "Em análise";
  const analysisCount = items.filter((item) => item.stage === "analysis").length;
  const proposalCount = items.filter((item) => item.stage === "proposal").length;
  const disputeCount = items.filter((item) => item.stage === "dispute").length;
  const postDisputeCount = items.filter((item) => item.stage === "post-dispute").length;
  const finalizedCount = items.filter((item) => item.stage === "finalized").length;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="space-y-5 sm:space-y-6">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[12px] font-bold text-brand-strong">Minha operação</p>
            <h1 className="mt-1 text-[24px] font-extrabold tracking-[-0.02em] text-ink sm:text-[28px]">
              Minhas licitações
            </h1>
            <p className="mt-2 text-[13px] text-slate-text">
              Acompanhe cada oportunidade desde a análise até a conclusão da disputa.
            </p>
          </div>
          <Button
            asChild
            className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
          >
            <Link to="/dash2/oportunidades/novas">
              <Plus className="size-4" />
              Analisar oportunidades
            </Link>
          </Button>
        </header>

        <Tabs value={stage} onValueChange={(value) => setStage(value as Stage)}>
          <TabsList className="h-auto max-w-full justify-start gap-1 overflow-x-auto rounded-xl border border-hairline bg-white p-1">
            {stages.map((item) => (
              <TabsTrigger
                key={item}
                value={item}
                className="min-h-10 shrink-0 px-3 text-[12px] font-bold"
              >
                {item}
                {item === "Em análise" && analysisCount ? (
                  <span className="ml-1 rounded-full bg-brand-tint px-1.5 py-0.5 text-[10px] text-brand-strong">
                    {analysisCount}
                  </span>
                ) : null}
                {item === "Propostas" && proposalCount ? (
                  <span className="ml-1 rounded-full bg-brand-tint px-1.5 py-0.5 text-[10px] text-brand-strong">
                    {proposalCount}
                  </span>
                ) : null}
                {item === "Em disputa" && disputeCount ? (
                  <span className="ml-1 rounded-full bg-brand-tint px-1.5 py-0.5 text-[10px] text-brand-strong">
                    {disputeCount}
                  </span>
                ) : null}
                {item === "Pós-disputa" && postDisputeCount ? (
                  <span className="ml-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
                    {postDisputeCount}
                  </span>
                ) : null}
                {item === "Finalizadas" && finalizedCount ? (
                  <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-text">
                    {finalizedCount}
                  </span>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-3">
          {visibleItems.map((item) => (
            <Panel key={`${item.source}-${item.id}`} className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-tint text-brand-strong">
                  {item.source === "bot" ? (
                    <Bot className="size-5" />
                  ) : item.priority === "high" ? (
                    <Flag className="size-5" />
                  ) : (
                    <Sparkles className="size-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-extrabold text-amber-700">
                      {operationStageLabel[item.stage]}
                    </span>
                    {item.source === "bot" ? (
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${item.botStatus === "Ativa" ? "bg-brand-tint text-brand-strong" : item.botStatus === "Pausada" || item.botStatus === "Pós-disputa" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-text"}`}
                      >
                        {item.stage === "dispute"
                          ? `Bot ${item.botStatus === "Ativa" ? "ativo" : "pausado"}`
                          : item.botStatus}
                      </span>
                    ) : item.priority === "high" ? (
                      <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-extrabold text-red-700">
                        Prioridade alta
                      </span>
                    ) : null}
                    {item.source === "bot" ? (
                      <span className="text-[11px] font-bold text-slate-text">
                        {item.bids === "—"
                          ? "Aguardando lances"
                          : `${item.bids} lances registrados`}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-text">
                        {item.match}% aderência
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-[15px] font-extrabold leading-snug text-ink">
                    {item.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-slate-text">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {item.agency} · {item.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      {item.deadline}
                    </span>
                    <span className="font-semibold text-ink">{item.value}</span>
                  </div>
                  {item.note ? (
                    <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[12px] leading-relaxed text-slate-text">
                      {item.note}
                    </p>
                  ) : null}
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="min-h-11 shrink-0 rounded-xl border-hairline text-[12px] font-bold"
                >
                  {item.source === "search" ? (
                    <Link to="/dash2/licitacoes/$licitacaoId" params={{ licitacaoId: item.id }}>
                      Ver detalhes
                      <ArrowRight className="size-4" />
                    </Link>
                  ) : item.source === "bot" ? (
                    item.stage === "post-dispute" || item.stage === "finalized" ? (
                      <Link
                        to="/dash2/operacao/minhas-licitacoes/$licitacaoId"
                        params={{ licitacaoId: item.id }}
                      >
                        {item.stage === "post-dispute"
                          ? "Conferir resultado"
                          : "Consultar resultado"}
                        <ArrowRight className="size-4" />
                      </Link>
                    ) : (
                      <Link to="/bot-lances/disputas/$disputeId" params={{ disputeId: item.id }}>
                        Abrir sessão do bot
                        <ArrowRight className="size-4" />
                      </Link>
                    )
                  ) : item.stage === "dispute" ? (
                    <Link
                      to="/dash2/operacao/minhas-licitacoes/$licitacaoId/disputa"
                      params={{ licitacaoId: item.id }}
                    >
                      Acompanhar disputa
                      <ArrowRight className="size-4" />
                    </Link>
                  ) : (
                    <Link
                      to="/dash2/operacao/minhas-licitacoes/$licitacaoId"
                      params={{ licitacaoId: item.id }}
                    >
                      {item.stage === "proposal" ? "Editar proposta" : "Abrir participação"}
                      <ArrowRight className="size-4" />
                    </Link>
                  )}
                </Button>
              </div>
            </Panel>
          ))}
        </div>

        {!visibleItems.length ? (
          <Panel className="grid min-h-[300px] place-items-center p-5 text-center sm:p-6">
            <div className="max-w-sm">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-tint text-brand-strong">
                <Sparkles className="size-6" />
              </span>
              <h2 className="mt-4 text-[18px] font-extrabold text-ink">
                {isInitialStage
                  ? "Nenhuma licitação em análise"
                  : `Nenhuma licitação em ${stage.toLocaleLowerCase("pt-BR")}`}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-text">
                {isInitialStage
                  ? "Marque uma oportunidade como interessante para iniciar o acompanhamento por aqui."
                  : stage === "Propostas"
                    ? "Prepare e salve uma proposta para que ela apareça nesta etapa."
                    : stage === "Em disputa"
                      ? "Quando o Bot de Lances iniciar ou pausar uma sessão, ela aparecerá aqui para acompanhamento."
                      : "Os itens avançarão para esta etapa conforme a operação evoluir."}
              </p>
              {isInitialStage ? (
                <Button
                  asChild
                  className="mt-5 min-h-11 rounded-xl bg-[#18B849] text-white hover:bg-[#139e3e]"
                >
                  <Link to="/dash2/oportunidades/novas">Ver novas oportunidades</Link>
                </Button>
              ) : null}
            </div>
          </Panel>
        ) : null}
      </div>
    </div>
  );
}
