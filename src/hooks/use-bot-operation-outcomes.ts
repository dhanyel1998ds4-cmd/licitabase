import { useCallback, useEffect, useState } from "react";

export type BotOutcomeDisposition = "post-dispute" | "adjudicated" | "lost";

export type BotOperationOutcome = {
  disputeId: string;
  disposition: BotOutcomeDisposition;
  finalBid: string;
  position: string;
  bids: number;
  closedAt: string;
  finalizedAt?: string;
  postDispute?: {
    fiscalDocuments: boolean;
    technicalDocuments: boolean;
    proposalConfirmed: boolean;
    diligence: "none" | "pending" | "answered";
    appealIntent: boolean;
  };
};

export type BotOperationOutcomes = Record<string, BotOperationOutcome>;

const storageKey = "licitabase:bot-operation-outcomes";
const eventName = "licitabase:bot-operation-outcomes-change";
let memoryOutcomes: BotOperationOutcomes = {};

function readOutcomes(): BotOperationOutcomes {
  if (typeof window === "undefined") return memoryOutcomes;

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "{}");
    if (value && typeof value === "object" && !Array.isArray(value)) {
      memoryOutcomes = value as BotOperationOutcomes;
    }
  } catch {
    // O fluxo continua em memória quando o armazenamento não está disponível.
  }

  return memoryOutcomes;
}

function writeOutcomes(next: BotOperationOutcomes) {
  memoryOutcomes = next;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // A persistência entre recargas é progressiva no protótipo.
  }
  window.dispatchEvent(new Event(eventName));
}

export function useBotOperationOutcomes() {
  const [outcomes, setOutcomes] = useState<BotOperationOutcomes>(readOutcomes);

  useEffect(() => {
    const sync = () => setOutcomes(readOutcomes());
    sync();
    window.addEventListener(eventName, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(eventName, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const openPostDispute = useCallback(
    (outcome: Omit<BotOperationOutcome, "disposition" | "closedAt" | "finalizedAt">) => {
      const next = {
        ...readOutcomes(),
        [outcome.disputeId]: {
          ...outcome,
          disposition: "post-dispute" as const,
          closedAt: new Date().toISOString(),
        },
      } satisfies BotOperationOutcomes;
      setOutcomes(next);
      writeOutcomes(next);
    },
    [],
  );

  const finalizeOutcome = useCallback(
    (disputeId: string, disposition: Extract<BotOutcomeDisposition, "adjudicated" | "lost">) => {
      const current = readOutcomes()[disputeId];
      if (!current) return;
      const next = {
        ...readOutcomes(),
        [disputeId]: {
          ...current,
          disposition,
          finalizedAt: new Date().toISOString(),
        },
      } satisfies BotOperationOutcomes;
      setOutcomes(next);
      writeOutcomes(next);
    },
    [],
  );

  const updatePostDispute = useCallback(
    (disputeId: string, patch: Partial<NonNullable<BotOperationOutcome["postDispute"]>>) => {
      const current = readOutcomes()[disputeId];
      if (!current) return;
      const next = {
        ...readOutcomes(),
        [disputeId]: {
          ...current,
          postDispute: {
            fiscalDocuments: false,
            technicalDocuments: false,
            proposalConfirmed: false,
            diligence: "none" as const,
            appealIntent: false,
            ...current.postDispute,
            ...patch,
          },
        },
      } satisfies BotOperationOutcomes;
      setOutcomes(next);
      writeOutcomes(next);
    },
    [],
  );

  return { outcomes, openPostDispute, finalizeOutcome, updatePostDispute };
}
