/**
 * Public, fictional demo data for the landing page showcase.
 * Reuses the same TypeScript shapes as the Bot de Lances dashboard module.
 * Contains no customer data, tokens, workspace ids or authenticated responses.
 */
import {
  bidBotActiveConfig,
  bidBotSummary,
  disputeBotConfig,
  disputeItems,
  disputePerformance,
  disputeRanking,
  disputeTimeline,
  disputes,
  type Dispute,
} from "@/lib/bid-bot-fixtures";

export const bidBotMarketingDemoData = {
  overview: {
    metrics: bidBotSummary,
    activeConfig: bidBotActiveConfig,
    disputes: disputes.slice(0, 5) as Dispute[],
    counts: { todas: 200, ativas: 11, aguardando: 156, pausadas: 19, finalizadas: 14 },
  },
  dispute: {
    header: {
      title:
        "Aquisição de computadores com monitor e placa de vídeo offboard para Secretaria de Habitação.",
      agency: "Prefeitura Municipal de Guarulhos - SP",
      uasg: "986477",
      notice: "Pregão 845/2026",
      status: "Ativa" as const,
    },
    performance: disputePerformance,
    botConfig: disputeBotConfig,
    items: disputeItems,
  },
  ranking: {
    item: 'Item 1 — Computador com monitor 24"',
    ourPosition: "5º lugar",
    ourBid: disputePerformance.ourBid,
    bestBid: disputePerformance.bestBid,
    rows: disputeRanking.slice(0, 6),
  },
  timeline: {
    events: disputeTimeline.slice(0, 5),
  },
  operationalSummary: [
    { value: "11", label: "Bots ativos", hint: "Em operação agora", tone: "brand" as const },
    { value: "4", label: "Disputas em andamento", hint: "Sessão pública aberta", tone: "navy" as const },
    { value: "2", label: "Aguardando ação", hint: "Exigem atenção", tone: "warn" as const },
    { value: "62%", label: "Taxa de sucesso", hint: "Últimos 30 dias", tone: "info" as const },
  ],
};

export type BidBotMarketingDemoData = typeof bidBotMarketingDemoData;
