import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Activity,
  Archive,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bot,
  CheckCircle2,
  CircleAlert,
  CircleStop,
  FileCheck2,
  MessageSquareText,
  Pause,
  Play,
  Radio,
  RefreshCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";
import {
  BotPageHeader,
  BotPanel as CardShell,
  MetricCard,
  StatusPill,
  botInputClassName,
  botOutlineButtonClassName,
  botTabsListClassName,
  botTabsTriggerClassName,
} from "@/components/dash2/BotPrimitives";
import {
  ConfigList,
  DisputeItemsTable,
  DisputeTimelineList,
  SupplierRankingTable,
} from "@/components/bot/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  disputeBotConfig,
  disputeItems,
  disputePerformance,
  createLiveSessionTimeline,
  getLiveDisputeSession,
  getLiveDisputeItems,
  type DisputeRankingRow,
  type LiveDisputeItem,
  disputeRanking,
  disputeTimeline,
  disputes,
  realtimeDisputeTimeline,
} from "@/lib/bid-bot-fixtures";
import { useBotOperationOutcomes } from "@/hooks/use-bot-operation-outcomes";
import { AnnotationThread } from "@/components/annotations/AnnotationThread";

type SessionState = "active" | "paused" | "finished";
type ResultDisposition = "review" | "adjudication" | "archived";
type TeamMessage = {
  id: string;
  author: string;
  role: string;
  time: string;
  content: string;
  mine?: boolean;
};

const initialTeamMessages: TeamMessage[] = [
  {
    id: "m-1",
    author: "Marina Costa",
    role: "Comercial",
    time: "há 4 min",
    content: "Validei a composição. O item 3 é prioritário para a proposta.",
  },
  {
    id: "m-2",
    author: "Rafael Lima",
    role: "Operador",
    time: "há 2 min",
    content: "Acompanhei a última redução. A estratégia continua dentro do limite aprovado.",
  },
];

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function parseCurrency(value: string) {
  const normalized = value
    .trim()
    .replace(/[^\d,]/g, "")
    .replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

const LIVE_TIMELINE_INTERVAL_MS = 220;
const INITIAL_TIMELINE_EVENTS = 7;
const LIVE_RANKING_INTERVAL_MS = 3200;

type LiveRankingRow = DisputeRankingRow & { id: string };

function currencyValue(value: string) {
  return Number(value.replace(/[^\d,]/g, "").replace(",", "."));
}

function proposalTotal(items: LiveDisputeItem[], participatingNumbers: number[]) {
  return items
    .filter((item) => participatingNumbers.includes(item.number))
    .reduce((total, item) => total + currencyValue(item.ourBid) * (item.quantity ?? 1), 0);
}

function createLiveRankingRows(
  ourBid: number,
  marketBid: number,
  ourPosition: "1º" | "2º",
): LiveRankingRow[] {
  const competitorBid = ourPosition === "1º" ? marketBid + 0.12 : marketBid;
  const remainingBidReference = Math.max(ourBid, competitorBid);
  const bids = [
    competitorBid,
    remainingBidReference + 0.17,
    remainingBidReference + 0.31,
    remainingBidReference + 0.46,
  ];
  const otherBids = [
    remainingBidReference + 0.65,
    remainingBidReference + 0.88,
    remainingBidReference + 1.12,
    remainingBidReference + 1.43,
    remainingBidReference + 1.76,
  ];
  let otherBidIndex = 0;

  return disputeRanking
    .map((row, index) => {
      const bid = row.you ? ourBid : (bids[index] ?? otherBids[otherBidIndex++]!);
      return {
        ...row,
        id: row.you ? "iridia" : `supplier-${index}`,
        bid: currency.format(bid),
      };
    })
    .sort((left, right) => currencyValue(left.bid) - currencyValue(right.bid))
    .map((row, index) => ({ ...row, pos: index + 1 }));
}

function withRankingMovement(
  nextRows: LiveRankingRow[],
  previousRows: LiveRankingRow[],
  changedId: string,
): LiveRankingRow[] {
  const previousPosition = new Map(previousRows.map((row) => [row.id, row.pos]));

  return nextRows.map((row) => {
    const before = previousPosition.get(row.id) ?? row.pos;
    const changed = row.id === changedId;
    const movement: DisputeRankingRow["movement"] =
      changed && row.pos < before
        ? "up"
        : changed && row.pos > before
          ? "down"
          : changed
            ? "updated"
            : undefined;
    const movementLabel =
      movement === "up"
        ? `Subiu ${before - row.pos} ${before - row.pos === 1 ? "posição" : "posições"}`
        : movement === "down"
          ? `Caiu ${row.pos - before} ${row.pos - before === 1 ? "posição" : "posições"}`
          : changed
            ? "Lance atualizado"
            : undefined;

    if (!movement || !movementLabel) {
      const { movement: _movement, movementLabel: _movementLabel, ...rest } = row;
      return rest;
    }

    return { ...row, movement, movementLabel };
  });
}

export const Route = createFileRoute("/bot-lances/disputas/$disputeId")({
  loader: ({ params }) => {
    const dispute = disputes.find((d) => d.id === params.disputeId);
    if (!dispute) throw notFound();
    return { dispute };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Disputa não encontrada | LicitaBase" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.dispute.notice} — Disputa | LicitaBase`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.dispute.object.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.dispute.agency },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <p role="alert" className="text-[13px] text-slate-text">
      {error.message}
    </p>
  ),
  notFoundComponent: () => (
    <div className="py-16 text-center">
      <p className="text-[15px] font-bold text-ink">Disputa não encontrada.</p>
      <Button variant="outline" size="sm" className={`${botOutlineButtonClassName} mt-4`} asChild>
        <Link to="/bot-lances/disputas">Voltar para disputas</Link>
      </Button>
    </div>
  ),
  component: DisputeDetail,
});

function DisputeDetail() {
  const { dispute } = Route.useLoaderData();
  const liveSession = getLiveDisputeSession(dispute.id);
  const itemFixtures = useMemo(() => getLiveDisputeItems(dispute.id), [dispute.id]);
  const [activeItemNumber, setActiveItemNumber] = useState(() => itemFixtures[0]?.number ?? 1);
  const sessionTimeline = useMemo(
    () => (liveSession ? createLiveSessionTimeline(liveSession) : realtimeDisputeTimeline),
    [liveSession],
  );
  const { outcomes, openPostDispute, finalizeOutcome } = useBotOperationOutcomes();
  const savedOutcome = outcomes[dispute.id];
  const [sessionState, setSessionState] = useState<SessionState>(() => {
    if (savedOutcome) return "finished";
    if (dispute.status === "Finalizada") return "finished";
    if (dispute.status === "Pausada") return "paused";
    return "active";
  });
  const [assistedStrategy, setAssistedStrategy] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(liveSession?.elapsedSeconds ?? 8 * 60 + 37);
  const [ourBid, setOurBid] = useState(liveSession?.ourBid ?? 36122.17);
  const [marketBid, setMarketBid] = useState(liveSession?.marketBid ?? 36122.17);
  const [position, setPosition] = useState<"1º" | "2º">(liveSession?.position ?? "1º");
  const [decisionSeconds, setDecisionSeconds] = useState<number | null>(null);
  const [bidCount, setBidCount] = useState(liveSession?.bids ?? disputePerformance.bidsGiven);
  const [bidValue, setBidValue] = useState("");
  const [bidError, setBidError] = useState("");
  const [lastSync, setLastSync] = useState("há poucos segundos");
  const [notice, setNotice] = useState("");
  const [detailsTab, setDetailsTab] = useState("itens");
  const [communicationsOpen, setCommunicationsOpen] = useState(false);
  const [teamMessages, setTeamMessages] = useState<TeamMessage[]>(initialTeamMessages);
  const [teamMessageDraft, setTeamMessageDraft] = useState("");
  const [timeline, setTimeline] = useState<typeof disputeTimeline>(() =>
    sessionTimeline.slice(0, INITIAL_TIMELINE_EVENTS),
  );
  const [timelineCursor, setTimelineCursor] = useState(INITIAL_TIMELINE_EVENTS);
  const [timelinePlaybackPaused, setTimelinePlaybackPaused] = useState(false);
  const [rankingRows, setRankingRows] = useState<LiveRankingRow[]>(() =>
    createLiveRankingRows(ourBid, marketBid, position),
  );
  const [rankingSimulationStep, setRankingSimulationStep] = useState(0);
  const [resultDisposition, setResultDisposition] = useState<ResultDisposition>(() => {
    if (savedOutcome?.disposition === "adjudicated") return "adjudication";
    if (savedOutcome?.disposition === "lost") return "archived";
    return "review";
  });

  useEffect(() => {
    if (!liveSession) return;
    setElapsedSeconds(liveSession.elapsedSeconds);
    setOurBid(liveSession.ourBid);
    setMarketBid(liveSession.marketBid);
    setPosition(liveSession.position);
    setBidCount(liveSession.bids);
    setRankingRows(
      createLiveRankingRows(liveSession.ourBid, liveSession.marketBid, liveSession.position),
    );
    setRankingSimulationStep(0);
    setTimeline(sessionTimeline.slice(0, INITIAL_TIMELINE_EVENTS));
    setTimelineCursor(INITIAL_TIMELINE_EVENTS);
    setTimelinePlaybackPaused(false);
  }, [dispute.id, liveSession, sessionTimeline]);

  useEffect(() => {
    if (sessionState !== "active") return;
    const interval = window.setInterval(() => setElapsedSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [sessionState]);

  useEffect(() => {
    if (sessionState !== "active" || decisionSeconds === null) return;
    const interval = window.setInterval(() => {
      setDecisionSeconds((seconds) => (seconds && seconds > 1 ? seconds - 1 : null));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [decisionSeconds, sessionState]);

  useEffect(() => {
    if (
      detailsTab !== "timeline" ||
      timelinePlaybackPaused ||
      timelineCursor >= sessionTimeline.length
    ) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setTimeline((current) => [...current, sessionTimeline[timelineCursor]!]);
      setTimelineCursor((cursor) => cursor + 1);
    }, LIVE_TIMELINE_INTERVAL_MS);

    return () => window.clearTimeout(timeout);
  }, [detailsTab, sessionTimeline, timelineCursor, timelinePlaybackPaused]);

  useEffect(() => {
    if (detailsTab !== "classificacao" || sessionState !== "active") return;

    const timeout = window.setTimeout(() => {
      const competitorTurn = rankingSimulationStep % 2 === 0;

      if (competitorTurn) {
        const nextMarketBid = Math.max(marketBid - 0.18, 0);
        setMarketBid(nextMarketBid);
        setPosition("2º");
        setDecisionSeconds(20);
        refreshLiveRanking(ourBid, nextMarketBid, "2º", "supplier-0");
        appendTimeline({
          time: getEventTime(),
          event: "Concorrente assumiu a liderança",
          kind: "Preço caiu",
          detail: "Novo lance alterou a classificação do item em tempo real.",
          value: currency.format(nextMarketBid),
          status: "Preço caiu",
          note: "Sua empresa passou para a 2ª posição; a estratégia está avaliando a reação.",
        });
      } else if (assistedStrategy) {
        const nextOurBid = Math.max(marketBid - 0.2, 0);
        setOurBid(nextOurBid);
        setMarketBid(nextOurBid);
        setPosition("1º");
        setDecisionSeconds(null);
        setBidCount((count) => count + 1);
        refreshLiveRanking(nextOurBid, nextOurBid, "1º", "iridia");
        appendTimeline({
          time: getEventTime(),
          event: "Lance assistido",
          kind: "Nosso lance",
          detail: "A estratégia respondeu ao movimento do concorrente.",
          value: currency.format(nextOurBid),
          status: "Ganhando",
          note: "Você retomou a liderança do item 1.",
        });
      }

      setRankingSimulationStep((step) => step + 1);
    }, LIVE_RANKING_INTERVAL_MS);

    return () => window.clearTimeout(timeout);
  }, [assistedStrategy, detailsTab, marketBid, ourBid, rankingSimulationStep, sessionState]);

  useEffect(() => {
    if (!savedOutcome) return;
    const persistedBid = parseCurrency(savedOutcome.finalBid);
    setSessionState("finished");
    setResultDisposition(
      savedOutcome.disposition === "adjudicated"
        ? "adjudication"
        : savedOutcome.disposition === "lost"
          ? "archived"
          : "review",
    );
    setPosition(savedOutcome.position === "2º" ? "2º" : "1º");
    setBidCount(savedOutcome.bids);
    if (persistedBid) {
      setOurBid(persistedBid);
      setMarketBid(persistedBid);
    }
  }, [savedOutcome]);

  useEffect(() => {
    const activeItem =
      itemFixtures.find((item) => item.number === activeItemNumber) ?? itemFixtures[0];
    if (!activeItem) return;

    if (activeItem.number !== activeItemNumber) setActiveItemNumber(activeItem.number);
    const initialOurBid = currencyValue(activeItem.ourBid);
    const initialMarketBid = currencyValue(activeItem.bestBid);
    setOurBid(initialOurBid);
    setMarketBid(initialMarketBid);
    setPosition(activeItem.position === "1º" ? "1º" : "2º");
    setBidCount(activeItem.bids);
    setBidValue("");
    setBidError("");
    setDecisionSeconds(null);
    setRankingRows(
      createLiveRankingRows(
        initialOurBid,
        initialMarketBid,
        activeItem.position === "1º" ? "1º" : "2º",
      ),
    );
  }, [activeItemNumber, itemFixtures]);

  const liveItems = useMemo<LiveDisputeItem[]>(
    () =>
      itemFixtures.map((item) =>
        item.number === activeItemNumber
          ? {
              ...item,
              ourBid: currency.format(ourBid),
              bestBid: currency.format(marketBid),
              position,
              bids: bidCount,
              nextEvent: formatElapsed(elapsedSeconds),
            }
          : item,
      ),
    [activeItemNumber, bidCount, elapsedSeconds, itemFixtures, marketBid, ourBid, position],
  );
  const activeItemIndex = Math.max(
    0,
    liveItems.findIndex((item) => item.number === activeItemNumber),
  );
  const activeItem = liveItems[activeItemIndex] ?? liveItems[0];
  const itemCount = liveItems.length;
  const participatingItemNumbers = useMemo(() => {
    const configured = liveItems
      .filter((item) => item.participating !== false)
      .map((item) => item.number);
    return configured.length > 0 ? configured : liveItems.map((item) => item.number);
  }, [liveItems]);
  const participatingItems = liveItems.filter((item) =>
    participatingItemNumbers.includes(item.number),
  );
  const activeParticipatingIndex = Math.max(
    0,
    participatingItems.findIndex((item) => item.number === activeItemNumber),
  );
  const winningItems = participatingItems.filter((item) => item.position === "1º").length;
  const attentionItems = participatingItems.filter((item) => item.position !== "1º").length;
  const totalProposalValue = proposalTotal(liveItems, participatingItemNumbers);
  const isMultiItemProposal = participatingItems.length > 1;

  const stateCopy = {
    active: { label: "Ao vivo", tone: "brand" as const, detail: "Monitoramento em tempo real" },
    paused: {
      label: "Bot pausado",
      tone: "warn" as const,
      detail: "Nenhum novo lance será enviado",
    },
    finished: {
      label: "Sessão encerrada",
      tone: "neutral" as const,
      detail: "Resultado registrado nesta sessão",
    },
  }[sessionState];
  const resultWon = position === "1º";
  const latestRankingChange = rankingRows.find((row) => row.movement);

  function appendTimeline(event: (typeof disputeTimeline)[number]) {
    setTimeline((current) => [...current, event]);
  }

  function refreshLiveRanking(
    nextOurBid: number,
    nextMarketBid: number,
    nextPosition: "1º" | "2º",
    changedId: string,
  ) {
    setRankingRows((current) =>
      withRankingMovement(
        createLiveRankingRows(nextOurBid, nextMarketBid, nextPosition),
        current,
        changedId,
      ),
    );
  }

  function showCompleteTimeline() {
    setTimeline(sessionTimeline);
    setTimelineCursor(sessionTimeline.length);
    setTimelinePlaybackPaused(true);
  }

  function restartTimelinePlayback() {
    setTimeline(sessionTimeline.slice(0, INITIAL_TIMELINE_EVENTS));
    setTimelineCursor(INITIAL_TIMELINE_EVENTS);
    setTimelinePlaybackPaused(false);
  }

  function getEventTime() {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  }

  function sendTeamMessage() {
    const content = teamMessageDraft.trim();
    if (!content) return;

    setTeamMessages((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        author: "Jussefer",
        role: "Administrador",
        time: "agora",
        content,
        mine: true,
      },
    ]);
    setTeamMessageDraft("");
    setNotice("Mensagem adicionada ao chat demonstrativo da equipe.");
  }

  function registerBid(value: number, source: "manual" | "assistido") {
    const formattedBid = currency.format(value);
    setOurBid(value);
    setMarketBid(value);
    setPosition("1º");
    refreshLiveRanking(value, value, "1º", "iridia");
    setDecisionSeconds(null);
    setBidCount((count) => count + 1);
    setBidValue("");
    setBidError("");
    setNotice(
      `${source === "assistido" ? "Sugestão aplicada" : "Lance manual registrado"}: ${formattedBid}. Você retomou a 1ª posição.`,
    );
    appendTimeline({
      time: getEventTime(),
      event: source === "assistido" ? "Lance assistido" : "Nosso lance manual",
      kind: "Nosso lance",
      detail:
        source === "assistido"
          ? "Sugestão da estratégia aplicada pelo operador."
          : "Lance registrado manualmente com sucesso na sessão.",
      value: formattedBid,
      status: "Ganhando",
      note: "Você está novamente na liderança do item 1.",
    });
  }

  function handleManualBid() {
    const parsedValue = parseCurrency(bidValue);
    if (!parsedValue) {
      setBidError("Informe um valor válido para o lance.");
      return;
    }
    if (parsedValue >= marketBid) {
      setBidError(`O lance precisa ser menor que ${currency.format(marketBid)}.`);
      return;
    }
    registerBid(parsedValue, "manual");
  }

  function receiveCompetitorBid() {
    if (sessionState !== "active" || position !== "1º") return;
    const newMarketBid = Math.max(marketBid - 0.18, 0);
    setMarketBid(newMarketBid);
    setPosition("2º");
    refreshLiveRanking(ourBid, newMarketBid, "2º", "supplier-0");
    setDecisionSeconds(20);
    setNotice(
      `Novo lance concorrente de ${currency.format(newMarketBid)}. Avalie a reação antes da janela expirar.`,
    );
    appendTimeline({
      time: getEventTime(),
      event: "Concorrente assumiu a liderança",
      kind: "Preço caiu",
      detail: "Um novo valor foi identificado na leitura do portal.",
      value: currency.format(newMarketBid),
      status: "Decisão necessária",
      note: "Aguardando sua ação ou a aplicação da sugestão assistida.",
    });
  }

  function applySuggestion() {
    if (sessionState !== "active" || position !== "2º") return;
    registerBid(Math.max(marketBid - 0.2, 0), "assistido");
  }

  function pauseBot() {
    setSessionState("paused");
    setDecisionSeconds(null);
    setNotice("Bot pausado. O histórico continua disponível, mas não enviaremos novos lances.");
    appendTimeline({
      time: getEventTime(),
      event: "Bot pausado",
      kind: "Sistema",
      detail: "A estratégia assistida foi interrompida pelo operador.",
      value: "—",
      status: "Pausado",
      note: "Retome o bot para reativar o envio automático de lances.",
    });
  }

  function resumeBot() {
    setSessionState("active");
    setNotice("Bot retomado. O monitoramento da sessão está ativo novamente.");
    appendTimeline({
      time: getEventTime(),
      event: "Bot retomado",
      kind: "Sistema",
      detail: "Monitoramento e estratégia assistida reativados.",
      value: "—",
      status: "Monitorando",
      note: "A próxima oportunidade de lance será analisada pelo bot.",
    });
  }

  function finishSession() {
    setSessionState("finished");
    setDecisionSeconds(null);
    openPostDispute({
      disputeId: dispute.id,
      finalBid: currency.format(ourBid),
      position,
      bids: bidCount,
    });
    setNotice("Sessão encerrada. Confira o resultado e defina o próximo encaminhamento.");
    appendTimeline({
      time: getEventTime(),
      event: "Sessão encerrada",
      kind: "Sessão",
      detail: "A disputa foi concluída pelo operador.",
      value: currency.format(ourBid),
      status: "Finalizada",
      note: "Resultado disponível para conferência da equipe.",
    });
  }

  function forwardToAdjudication() {
    setResultDisposition("adjudication");
    finalizeOutcome(dispute.id, "adjudicated");
    setNotice("Resultado confirmado e encaminhado para adjudicação.");
    appendTimeline({
      time: getEventTime(),
      event: "Encaminhado para adjudicação",
      kind: "Sistema",
      detail: "A equipe confirmou o resultado da disputa.",
      value: currency.format(ourBid),
      status: "Em adjudicação",
      note: "Acompanhe as próximas etapas no histórico operacional.",
    });
  }

  function archiveResult() {
    setResultDisposition("archived");
    finalizeOutcome(dispute.id, "lost");
    setNotice("Resultado registrado como não êxito e arquivado no histórico.");
    appendTimeline({
      time: getEventTime(),
      event: "Resultado arquivado",
      kind: "Sistema",
      detail: "A disputa foi encerrada sem encaminhamento para adjudicação.",
      value: currency.format(ourBid),
      status: "Arquivada",
      note: "O registro permanece disponível para análise e relatórios.",
    });
  }

  return (
    <>
      <Link
        to="/bot-lances/disputas"
        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-1 text-[12px] font-bold text-slate-text hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Voltar para disputas
      </Link>

      <BotPageHeader
        eyebrow={`${liveSession?.portal === "Compras.gov" ? `UASG ${dispute.uasg}` : "Sessão do portal"} · ${dispute.notice}`}
        title={dispute.agency}
        description={dispute.object}
        guide={{
          title: "Acompanhe a sessão sem perder o momento de agir",
          description:
            "A sala reúne estratégia, posição, itens e eventos ao vivo. O bot só executa dentro dos limites configurados pela sua operação.",
          steps: [
            {
              title: "Confira a sessão",
              description: "Leia posição, lance e tempo antes de alterar qualquer decisão.",
            },
            {
              title: "Acompanhe a reação",
              description: "Use itens, classificação e timeline para entender cada mudança.",
            },
            {
              title: "Aja com controle",
              description: "Pause, retome ou registre um lance manual somente quando necessário.",
            },
          ],
        }}
        actions={
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            <Button
              variant="outline"
              size="sm"
              className={`${botOutlineButtonClassName} w-full sm:w-auto`}
              onClick={() => {
                setLastSync("agora");
                setNotice("Dados da sessão atualizados agora.");
              }}
            >
              <RefreshCcw className="size-4" aria-hidden="true" />
              Atualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl border-[#29C454]/35 bg-[#29C454]/10 text-[#117633] shadow-[0_1px_2px_rgba(21,148,58,0.1)] hover:bg-[#29C454]/18 hover:text-[#0e6b2d] focus-visible:ring-[#29C454]/25 sm:w-auto"
              onClick={() => setCommunicationsOpen(true)}
              aria-label="Abrir comunicações internas da equipe"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-[#29C454]/15">
                <MessageSquareText className="size-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 truncate">Comunicações</span>
              <span className="hidden rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] font-bold sm:inline">
                Equipe
              </span>
            </Button>
            {sessionState === "active" ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${botOutlineButtonClassName} w-full sm:w-auto`}
                  >
                    <Pause className="size-4" aria-hidden="true" />
                    Pausar bot
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[calc(100%_-_32px)] rounded-2xl sm:max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Pausar o bot nesta disputa?</AlertDialogTitle>
                    <AlertDialogDescription>
                      O monitoramento continuará visível, mas nenhum novo lance será enviado até a
                      reativação.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Manter ativo</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-orange-600 text-white hover:bg-orange-700"
                      onClick={pauseBot}
                    >
                      Pausar bot
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : sessionState === "paused" ? (
              <Button
                variant="outline"
                size="sm"
                className={`${botOutlineButtonClassName} w-full sm:w-auto`}
                onClick={resumeBot}
              >
                <Play className="size-4" aria-hidden="true" />
                Retomar bot
              </Button>
            ) : null}
            <StatusPill
              tone={stateCopy.tone}
              className="min-h-11 w-full justify-center px-3 text-[12px] sm:min-h-0 sm:w-auto sm:text-[11px]"
            >
              <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
              {stateCopy.label}
            </StatusPill>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <MetricCard
          value={position}
          label="Nossa posição"
          hint={
            position === "1º" ? `Liderando o item ${activeItem?.number ?? 1}` : "Reação necessária"
          }
          tone={position === "1º" ? "brand" : "warn"}
        />
        <MetricCard
          value={currency.format(isMultiItemProposal ? totalProposalValue : ourBid)}
          label={
            isMultiItemProposal ? "Valor total da proposta atual" : "Nosso melhor lance no item"
          }
          hint={
            isMultiItemProposal
              ? `${participatingItems.length} de ${itemCount} itens da sua participação`
              : position === "1º"
                ? "Melhor valor no item em acompanhamento"
                : `Líder: ${currency.format(marketBid)}`
          }
          tone="navy"
        />
        <MetricCard
          value={formatElapsed(elapsedSeconds)}
          label="Tempo de sessão"
          hint={stateCopy.detail}
          tone="warn"
        />
        <MetricCard
          value={String(bidCount)}
          label="Lances dados"
          hint={`Atualizado ${lastSync}`}
          tone="info"
        />
      </div>

      {sessionState === "finished" ? (
        <CardShell
          eyebrow="Pós-disputa"
          title={
            resultWon
              ? "Resultado: melhor proposta registrada"
              : "Resultado: proposta não classificada"
          }
          description={
            resultWon
              ? "O último lance está em 1ª posição. Confirme os dados da sessão antes de encaminhar para adjudicação."
              : "A sessão foi encerrada sem a melhor proposta. Registre o desfecho para manter o histórico consistente."
          }
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
            <div>
              <ol className="grid gap-2 sm:grid-cols-3" aria-label="Etapas do pós-disputa">
                <ResultStep
                  complete
                  label="Sessão encerrada"
                  detail="Eventos e último lance registrados"
                />
                <ResultStep
                  complete={resultDisposition !== "review"}
                  active={resultDisposition === "review"}
                  label="Conferir resultado"
                  detail="Validar posição e valor final"
                />
                <ResultStep
                  complete={resultDisposition !== "review"}
                  label={resultWon ? "Adjudicação" : "Arquivamento"}
                  detail={resultWon ? "Encaminhar à próxima etapa" : "Manter registro para análise"}
                />
              </ol>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <ResultDatum label="Posição final" value={position} emphasize={resultWon} />
                <ResultDatum
                  label={isMultiItemProposal ? "Valor total da proposta" : "Último lance"}
                  value={currency.format(isMultiItemProposal ? totalProposalValue : ourBid)}
                />
                <ResultDatum label="Lances registrados" value={String(bidCount)} />
              </div>
            </div>

            <div
              className={`rounded-xl border p-4 ${resultDisposition === "review" ? "border-hairline bg-slate-50/70" : resultDisposition === "adjudication" ? "border-[#29C454]/25 bg-[#29C454]/[0.07]" : "border-slate-200 bg-slate-50"}`}
            >
              {resultDisposition === "review" ? (
                <>
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="size-4 text-[#15943a]" aria-hidden="true" />
                    <p className="text-[13px] font-bold text-ink">Decisão operacional</p>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-slate-text">
                    {resultWon
                      ? "Confirme a ata e encaminhe a participação para a fila de adjudicação."
                      : "Registre o não êxito para manter indicadores e histórico atualizados."}
                  </p>
                  <Button
                    asChild
                    className="mt-4 min-h-11 w-full rounded-xl bg-[#18B849] text-[12px] font-bold text-white hover:bg-[#139e3e]"
                  >
                    <Link
                      to="/dash2/operacao/minhas-licitacoes/$licitacaoId"
                      params={{ licitacaoId: dispute.id }}
                    >
                      <FileCheck2 className="size-4" />
                      Abrir conferência pós-disputa
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`size-4 ${resultDisposition === "adjudication" ? "text-[#15943a]" : "text-slate-text"}`}
                      aria-hidden="true"
                    />
                    <p className="text-[13px] font-bold text-ink">
                      {resultDisposition === "adjudication"
                        ? "Encaminhado para adjudicação"
                        : "Resultado arquivado"}
                    </p>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-slate-text">
                    {resultDisposition === "adjudication"
                      ? "A operação pode acompanhar a confirmação do órgão e os documentos da próxima etapa."
                      : "O desfecho já está disponível para consulta e análise dos relatórios."}
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button
                      asChild
                      variant="outline"
                      className="min-h-10 flex-1 rounded-xl border-hairline text-[12px] font-bold text-ink"
                    >
                      <Link to="/bot-lances/historico">Ver histórico</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="min-h-10 flex-1 rounded-xl border-hairline text-[12px] font-bold text-ink"
                    >
                      <Link to="/bot-lances/relatorios">Ver relatórios</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardShell>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 xl:items-stretch xl:grid-cols-[minmax(240px,0.72fr)_minmax(360px,1.1fr)_minmax(320px,0.92fr)]">
        <div className="order-2 space-y-4 xl:order-1 xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:gap-4 xl:space-y-0">
          <CardShell eyebrow="Estratégia" title="Assistente de lances" className="xl:flex-[1.15]">
            <div className="flex items-start justify-between gap-4 rounded-xl border border-[#29C454]/15 bg-[#29C454]/[0.07] p-3.5">
              <div className="flex min-w-0 gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#29C454]/15 text-[#15943a]">
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[13px] font-bold text-ink">Estratégia assistida</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                    Sugere o próximo movimento respeitando o decremento definido.
                  </p>
                </div>
              </div>
              <Switch
                checked={assistedStrategy}
                aria-label="Ativar estratégia assistida"
                onCheckedChange={(enabled) => {
                  setAssistedStrategy(enabled);
                  setNotice(
                    enabled
                      ? "Estratégia assistida ativada para sugerir o próximo lance."
                      : "Estratégia assistida desativada. Os lances dependerão da sua ação manual.",
                  );
                }}
                className="mt-0.5 data-[state=checked]:bg-[#18B849] data-[state=unchecked]:bg-slate-300"
              />
            </div>
            <ConfigList rows={disputeBotConfig} />
          </CardShell>

          <CardShell
            eyebrow="Sessão"
            title="Encerrar disputa"
            className="border-rose-200/80 bg-rose-50/55 hover:border-rose-300 xl:flex-[0.85] [&>header]:border-rose-200/80"
          >
            <p className="text-[12px] leading-relaxed text-slate-text">
              Finalize quando o portal tiver concluído os lances. O resultado permanece registrado
              no histórico desta sessão.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={sessionState === "finished"}
                  className="mt-4 min-h-11 w-full rounded-xl border-rose-200 text-[12px] font-bold text-rose-700 hover:bg-rose-50 hover:text-rose-700"
                >
                  <CircleStop className="size-4" />
                  {sessionState === "finished" ? "Sessão encerrada" : "Encerrar sessão"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[calc(100%_-_32px)] rounded-2xl sm:max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>Encerrar esta sessão de disputa?</AlertDialogTitle>
                  <AlertDialogDescription>
                    O bot deixará de acompanhar novos eventos e o resultado será marcado como
                    concluído no seu painel.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Continuar sessão</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-rose-600 text-white hover:bg-rose-700"
                    onClick={finishSession}
                  >
                    Encerrar sessão
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardShell>
        </div>

        <div className="order-1 min-w-0 space-y-4 xl:order-2 xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:space-y-0">
          <CardShell
            eyebrow="Sessão ao vivo"
            title={`Item ${activeItem?.number ?? 1}${itemCount > 1 ? ` de ${itemCount}` : ""} · posição e próximo lance`}
            description={
              itemCount > 1
                ? "Escolha um item para acompanhar a liderança e agir sem perder o contexto da disputa."
                : "Acompanhe a liderança e registre uma ação manual sem sair do contexto da disputa."
            }
            className="xl:h-full"
          >
            {itemCount > 1 ? (
              <div className="mb-4 flex flex-col gap-3 rounded-xl border border-[#29C454]/15 bg-[#29C454]/[0.055] px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
                  <span className="font-bold text-ink">
                    {participatingItems.length} de {itemCount} itens na proposta
                  </span>
                  <span className="text-[#15943a]">{winningItems} ganhando</span>
                  {attentionItems > 0 ? (
                    <span className="text-amber-700">{attentionItems} com atenção</span>
                  ) : null}
                </div>
                <div
                  className="flex items-center gap-2"
                  aria-label="Navegar pelos itens da disputa"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={`${botOutlineButtonClassName} size-9 rounded-lg`}
                    disabled={activeParticipatingIndex === 0}
                    onClick={() =>
                      setActiveItemNumber(participatingItems[activeParticipatingIndex - 1]!.number)
                    }
                    aria-label="Item anterior"
                  >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                  </Button>
                  <span className="tnum min-w-16 text-center text-[12px] font-bold text-ink">
                    Item {activeParticipatingIndex + 1}/{participatingItems.length}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={`${botOutlineButtonClassName} size-9 rounded-lg`}
                    disabled={activeParticipatingIndex === participatingItems.length - 1}
                    onClick={() =>
                      setActiveItemNumber(participatingItems[activeParticipatingIndex + 1]!.number)
                    }
                    aria-label="Próximo item"
                  >
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ) : null}
            <div className="mb-4 flex flex-col gap-3 rounded-xl border border-hairline bg-slate-50/70 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-[#29C454]/10 text-[#15943a]">
                  <Wifi className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[12px] font-bold text-ink">Leitura demonstrativa do portal</p>
                  <p className="text-[11px] text-slate-text">
                    {liveSession?.portal ?? "Compras.gov"} · dados fictícios atualizados {lastSync}
                  </p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 text-[11px] font-bold text-slate-text">
                <ShieldCheck className="size-3.5 text-[#15943a]" aria-hidden="true" />
                Demonstração interativa
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(250px,0.75fr)]">
              <div className="rounded-xl border border-hairline bg-slate-50/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2.5 rounded-full ${sessionState === "active" ? "bg-[#18B849] animate-pulse" : "bg-slate-300"}`}
                    />
                    <p className="text-[12px] font-bold text-ink">{stateCopy.label}</p>
                  </div>
                  <StatusPill tone={position === "1º" ? "brand" : "warn"}>
                    {position} posição
                  </StatusPill>
                </div>
                <p className="tnum mt-5 text-[30px] font-bold tracking-[-0.035em] text-ink sm:text-[34px]">
                  {currency.format(marketBid)}
                </p>
                <p className="mt-1 text-[12px] font-medium text-slate-text">
                  {position === "1º" ? "Seu melhor lance" : "Lance líder do concorrente"} ·{" "}
                  {bidCount} lances registrados
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-hairline pt-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-text">
                      Sessão
                    </p>
                    <p className="mt-1 text-[13px] font-bold text-ink">
                      {formatElapsed(elapsedSeconds)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-text">
                      Decremento
                    </p>
                    <p className="mt-1 text-[13px] font-bold text-ink">R$ 0,20</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#29C454]/20 bg-[#29C454]/[0.055] p-4">
                <div className="flex items-center gap-2 text-[#15943a]">
                  <Bot className="size-4" aria-hidden="true" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em]">
                    Sugestão do bot
                  </p>
                </div>
                <p className="tnum mt-3 text-[22px] font-bold tracking-[-0.025em] text-ink">
                  {currency.format(Math.max(marketBid - 0.2, 0))}
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-slate-text">
                  {position === "2º"
                    ? assistedStrategy
                      ? "Pronto para recuperar a liderança dentro do decremento configurado."
                      : "Ative a estratégia ou defina manualmente a sua reação."
                    : "Valor calculado para reagir caso um concorrente reduza o preço."}
                </p>
                {position === "2º" && assistedStrategy ? (
                  <Button
                    type="button"
                    disabled={sessionState !== "active"}
                    onClick={applySuggestion}
                    className="mt-4 min-h-10 w-full rounded-xl bg-[#18B849] text-[12px] font-bold text-white hover:bg-[#139e3e]"
                  >
                    <Sparkles className="size-3.5" />
                    Aplicar sugestão
                  </Button>
                ) : null}
              </div>
            </div>

            {position === "2º" ? (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <CircleAlert
                    className="mt-0.5 size-5 shrink-0 text-amber-700"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-[13px] font-bold text-amber-950">
                      Concorrente assumiu a liderança
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-amber-900/80">
                      {decisionSeconds === null
                        ? "A janela de reação encerrou; você ainda pode registrar um novo lance."
                        : `Janela de decisão aberta por ${formatElapsed(decisionSeconds)}. Revise e aplique a sugestão ou envie um valor manual.`}
                    </p>
                  </div>
                </div>
                {assistedStrategy ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={sessionState !== "active"}
                    onClick={applySuggestion}
                    className="min-h-10 shrink-0 rounded-xl border-amber-300 bg-white text-[12px] font-bold text-amber-800 hover:bg-amber-100 hover:text-amber-900"
                  >
                    Recuperar liderança
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Radio className="mt-0.5 size-5 text-slate-text" aria-hidden="true" />
                  <div>
                    <p className="text-[13px] font-bold text-ink">Fluxo de decisão pronto</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                      Veja como o painel reage a uma redução de preço de outro fornecedor.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={sessionState !== "active"}
                  onClick={receiveCompetitorBid}
                  className={`${botOutlineButtonClassName} min-h-10 shrink-0 text-[12px] font-bold`}
                >
                  <Activity className="size-3.5" />
                  Simular lance concorrente
                </Button>
              </div>
            )}

            <div className="mt-4 rounded-xl border border-[#29C454]/25 bg-[#29C454]/[0.065] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="grid min-w-0 flex-1 gap-2">
                  <span className="text-[12px] font-bold text-ink">Registrar lance manual</span>
                  <Input
                    inputMode="decimal"
                    value={bidValue}
                    disabled={sessionState !== "active"}
                    onChange={(event) => {
                      setBidValue(event.target.value);
                      setBidError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleManualBid();
                    }}
                    className={botInputClassName}
                    placeholder="Ex.: 36.121,97"
                    aria-describedby={bidError ? "manual-bid-error" : undefined}
                  />
                </label>
                <Button
                  type="button"
                  disabled={sessionState !== "active" || !bidValue.trim()}
                  onClick={handleManualBid}
                  className="min-h-11 rounded-xl bg-[#18B849] px-4 text-[12px] font-bold text-white hover:bg-[#139e3e]"
                >
                  <Send className="size-4" />
                  Enviar lance
                </Button>
              </div>
              {bidError ? (
                <p
                  id="manual-bid-error"
                  role="alert"
                  className="mt-2 text-[12px] font-semibold text-rose-600"
                >
                  {bidError}
                </p>
              ) : null}
              <p className="mt-2 text-[11px] leading-relaxed text-slate-text">
                O valor deve ser menor que o lance líder atual. Ação disponível apenas com a sessão
                ativa.
              </p>
            </div>
            <p aria-live="polite" className="mt-3 min-h-5 text-[12px] font-semibold text-[#15943a]">
              {notice}
            </p>
          </CardShell>
        </div>

        <div className="order-3 min-w-0 xl:order-3 xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:[contain:size]">
          <Tabs
            value={detailsTab}
            onValueChange={setDetailsTab}
            className="xl:flex xl:min-h-0 xl:flex-1 xl:flex-col"
          >
            <TabsList className={`${botTabsListClassName} grid h-12 w-full grid-cols-3`}>
              <TabsTrigger value="itens" className={`${botTabsTriggerClassName} min-w-0 px-2`}>
                Itens
              </TabsTrigger>
              <TabsTrigger
                value="classificacao"
                className={`${botTabsTriggerClassName} min-w-0 px-2`}
              >
                Classificação
              </TabsTrigger>
              <TabsTrigger value="timeline" className={`${botTabsTriggerClassName} min-w-0 px-2`}>
                Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="itens" className="mt-4 xl:min-h-0 xl:flex-1">
              <CardShell
                eyebrow="Disputa"
                title="Itens em disputa"
                className="xl:h-full"
                bodyClassName={`min-h-0 p-0 ${itemCount > 1 ? "overflow-y-auto overscroll-contain" : "overflow-visible"}`}
              >
                <DisputeItemsTable
                  items={liveItems}
                  visual="dash2"
                  activeItemNumber={activeItemNumber}
                  participatingItemNumbers={participatingItemNumbers}
                  {...(participatingItems.length > 1 ? { onItemSelect: setActiveItemNumber } : {})}
                />
              </CardShell>
            </TabsContent>

            <TabsContent value="classificacao" className="mt-4 xl:min-h-0 xl:flex-1">
              <CardShell
                eyebrow="Ranking"
                title="Classificação dos fornecedores"
                description="Posições atualizadas a cada lance. A melhor oferta assume a liderança do item."
                className="xl:h-full"
                bodyClassName="min-h-0 overflow-y-auto overscroll-contain p-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-[#29C454]/[0.045] px-4 py-2.5 sm:px-5">
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold text-[#15943a]">
                    <Radio className="size-3.5 motion-safe:animate-pulse" aria-hidden="true" />
                    Ranking ao vivo
                  </span>
                  <p aria-live="polite" className="text-[11px] font-medium text-slate-text">
                    {latestRankingChange
                      ? `${latestRankingChange.supplier}: ${latestRankingChange.movementLabel}`
                      : "Aguardando o próximo lance"}
                  </p>
                </div>
                <SupplierRankingTable rows={rankingRows} visual="dash2" />
              </CardShell>
            </TabsContent>

            <TabsContent value="timeline" className="mt-4 xl:min-h-0 xl:flex-1">
              <CardShell
                eyebrow="Histórico"
                title="Timeline da sessão"
                description="Eventos mais recentes no topo. A demonstração reproduz uma sessão completa em cadência acelerada."
                className="xl:h-full"
                bodyClassName="flex min-h-0 flex-col overflow-hidden p-0"
              >
                <div className="flex flex-col gap-3 border-b border-hairline bg-[#29C454]/[0.045] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#29C454]/15 text-[#15943a]">
                      <Radio className="size-4 animate-pulse" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-navy">
                        {timelineCursor >= sessionTimeline.length
                          ? "Sessão demonstrativa concluída"
                          : timelinePlaybackPaused
                            ? "Simulação pausada"
                            : "Eventos chegando em tempo real"}
                      </p>
                      <p aria-live="polite" className="text-[11px] text-slate-text">
                        {timeline.length} de {sessionTimeline.length} acontecimentos registrados
                      </p>
                    </div>
                  </div>
                  <div className="flex min-h-10 flex-wrap gap-2 sm:justify-end">
                    {timelineCursor < sessionTimeline.length ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={botOutlineButtonClassName}
                        onClick={() => setTimelinePlaybackPaused((paused) => !paused)}
                      >
                        {timelinePlaybackPaused ? (
                          <Play className="size-3.5" aria-hidden="true" />
                        ) : (
                          <Pause className="size-3.5" aria-hidden="true" />
                        )}
                        {timelinePlaybackPaused ? "Retomar" : "Pausar"}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={botOutlineButtonClassName}
                        onClick={restartTimelinePlayback}
                      >
                        <RefreshCcw className="size-3.5" aria-hidden="true" />
                        Reproduzir de novo
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={botOutlineButtonClassName}
                      onClick={showCompleteTimeline}
                    >
                      Ver sessão completa
                    </Button>
                  </div>
                </div>
                <DisputeTimelineList events={timeline} className="min-h-0 flex-1" />
              </CardShell>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <DisputeCommunicationsSheet
        open={communicationsOpen}
        onOpenChange={setCommunicationsOpen}
        tenderId={dispute.id}
        tenderTitle={dispute.object}
        messages={teamMessages}
        draft={teamMessageDraft}
        onDraftChange={setTeamMessageDraft}
        onSend={sendTeamMessage}
        portal={liveSession?.portal ?? "Portal de compras"}
      />
    </>
  );
}

function ResultStep({
  label,
  detail,
  complete = false,
  active = false,
}: {
  label: string;
  detail: string;
  complete?: boolean;
  active?: boolean;
}) {
  return (
    <li
      className={`rounded-xl border p-3 ${complete ? "border-[#29C454]/20 bg-[#29C454]/[0.07]" : active ? "border-amber-200 bg-amber-50/80" : "border-hairline bg-white"}`}
    >
      <span
        className={`grid size-6 place-items-center rounded-full text-[11px] font-bold ${complete ? "bg-[#18B849] text-white" : active ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-text"}`}
      >
        {complete ? <CheckCircle2 className="size-3.5" aria-hidden="true" /> : "•"}
      </span>
      <p className="mt-2 text-[12px] font-bold text-ink">{label}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-text">{detail}</p>
    </li>
  );
}

function ResultDatum({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-white px-3 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-text">{label}</p>
      <p className={`tnum mt-1 text-[15px] font-bold ${emphasize ? "text-[#15943a]" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}

function DisputeCommunicationsSheet({
  open,
  onOpenChange,
  tenderId,
  tenderTitle,
  messages,
  draft,
  onDraftChange,
  onSend,
  portal,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenderId: string;
  tenderTitle: string;
  messages: TeamMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  portal: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-hairline bg-white p-0 sm:w-[29rem] sm:max-w-[29rem]"
      >
        <SheetHeader className="border-b border-hairline px-5 py-5 pr-12 text-left">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#15943a]">
            Colaboração da disputa
          </p>
          <SheetTitle className="text-[18px] font-bold tracking-[-0.02em] text-ink">
            Comunicações
          </SheetTitle>
          <SheetDescription className="text-[12px] leading-relaxed text-slate-text">
            O chat interno apoia decisões da equipe. A comunicação oficial do portal fica separada e
            nunca é enviada pela LicitaBase.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="equipe" className="flex min-h-0 flex-1 flex-col px-4 pt-4">
          <TabsList className={`${botTabsListClassName} grid h-11 w-full grid-cols-3`}>
            <TabsTrigger value="equipe" className={botTabsTriggerClassName}>
              Chat da equipe
            </TabsTrigger>
            <TabsTrigger value="anotacoes" className={botTabsTriggerClassName}>
              Anotações
            </TabsTrigger>
            <TabsTrigger value="portal" className={botTabsTriggerClassName}>
              Portal oficial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipe" className="mt-4 flex min-h-0 flex-1 flex-col">
            <div className="mb-3 rounded-xl border border-[#29C454]/20 bg-[#29C454]/[0.055] px-3 py-2.5">
              <p className="text-[12px] font-bold text-ink">Canal interno da operação</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-text">
                Registre contexto e decisões. Esta demonstração não envia mensagens para canais
                externos.
              </p>
            </div>
            <div
              className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pb-4 pr-1"
              role="log"
              aria-label="Mensagens do chat da equipe"
              aria-live="polite"
            >
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`rounded-xl border p-3 ${message.mine ? "ml-8 border-[#29C454]/25 bg-[#29C454]/[0.07]" : "mr-5 border-hairline bg-slate-50/70"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[12px] font-bold text-ink">{message.author}</p>
                    <time className="shrink-0 text-[10px] font-medium text-slate-text">
                      {message.time}
                    </time>
                  </div>
                  <p className="mt-0.5 text-[10px] font-semibold text-[#15943a]">{message.role}</p>
                  <p className="mt-2 text-[12px] leading-relaxed text-slate-text">
                    {message.content}
                  </p>
                </article>
              ))}
            </div>
            <div className="border-t border-hairline py-4">
              <label className="grid gap-2">
                <span className="text-[12px] font-bold text-ink">
                  Registrar decisão ou contexto
                </span>
                <Textarea
                  value={draft}
                  onChange={(event) => onDraftChange(event.target.value)}
                  placeholder="Ex.: validação comercial concluída; seguir com o item 3."
                  className="min-h-20 resize-none rounded-xl border-hairline text-[12px]"
                />
              </label>
              <Button
                type="button"
                disabled={!draft.trim()}
                onClick={onSend}
                className="mt-3 min-h-11 w-full rounded-xl bg-[#18B849] text-[12px] font-bold text-white hover:bg-[#139e3e]"
              >
                <Send className="size-4" aria-hidden="true" />
                Registrar no chat da equipe
              </Button>
            </div>
          </TabsContent>

          <TabsContent
            value="anotacoes"
            className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4"
          >
            <AnnotationThread
              tenderId={tenderId}
              tenderTitle={tenderTitle}
              context={{ type: "dispute", label: "Sala de disputa" }}
              className="border-0 bg-transparent p-0 shadow-none"
            />
          </TabsContent>

          <TabsContent value="portal" className="mt-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <p className="text-[13px] font-bold text-amber-950">
                Leitura oficial ainda não conectada
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-amber-900/80">
                Mensagens do pregoeiro e esclarecimentos precisam vir diretamente do {portal}.
                Quando a integração for disponibilizada pelo backend, elas aparecerão aqui com
                origem, horário e vínculo com a sessão.
              </p>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-hairline bg-slate-50/70 p-4">
              <p className="text-[12px] font-bold text-ink">Sem mensagens oficiais para exibir</p>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                Nenhum conteúdo é inventado nesta área. Use o portal oficial até a integração estar
                ativa.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
