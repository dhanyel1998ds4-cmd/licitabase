export type BidBotStatusTone = "brand" | "info" | "warn" | "neutral";

export function disputeStatusTone(status: string): BidBotStatusTone {
  if (status === "Ativa") return "brand";
  if (status === "Aguardando") return "warn";
  if (status === "Finalizada") return "info";
  return "neutral";
}
