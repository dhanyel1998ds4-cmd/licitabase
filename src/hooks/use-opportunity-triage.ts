import { useCallback, useEffect, useState } from "react";

export type OpportunityTriageDecision = "later" | "interested" | "dismissed";
export type OpportunityPriority = "normal" | "high";
export type OpportunityStage = "analysis" | "proposal" | "dispute";

export type OpportunityProposalDraft = {
  companyName: string;
  validityDays: string;
  deliveryTerms: string;
  totalValue: string;
  declarationAccepted: boolean;
  updatedAt: string;
  savedAt?: string;
};

export type OpportunitySubmission = {
  submittedAt: string;
  receipt: string;
};

export type OpportunityTriageRecord = {
  decision: OpportunityTriageDecision;
  priority?: OpportunityPriority;
  note?: string;
  stage?: OpportunityStage;
  proposal?: OpportunityProposalDraft;
  submission?: OpportunitySubmission;
  decidedAt: string;
};

export type OpportunityTriage = Record<string, OpportunityTriageRecord>;

const storageKey = "licitabase:opportunity-triage";
const eventName = "licitabase:opportunity-triage-change";
let memoryTriage: OpportunityTriage = {};

function readTriage(): OpportunityTriage {
  if (typeof window === "undefined") return memoryTriage;

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "{}");
    if (value && typeof value === "object" && !Array.isArray(value)) {
      memoryTriage = value as OpportunityTriage;
    }
  } catch {
    // A interaÃ§Ã£o continua em memÃ³ria quando o storage nÃ£o estÃ¡ disponÃ­vel.
  }

  return memoryTriage;
}

function writeTriage(next: OpportunityTriage) {
  memoryTriage = next;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // PersistÃªncia entre recargas Ã© uma melhoria progressiva neste protÃ³tipo.
  }
  window.dispatchEvent(new Event(eventName));
}

export function useOpportunityTriage() {
  const [triage, setTriage] = useState<OpportunityTriage>(readTriage);

  useEffect(() => {
    const sync = () => setTriage(readTriage());
    sync();
    window.addEventListener(eventName, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(eventName, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const decide = useCallback(
    (
      opportunityId: string,
      decision: OpportunityTriageDecision,
      details: Pick<OpportunityTriageRecord, "priority" | "note"> = {},
    ) => {
      const next = {
        ...readTriage(),
        [opportunityId]: {
          decision,
          ...details,
          decidedAt: new Date().toISOString(),
        },
      } satisfies OpportunityTriage;
      setTriage(next);
      writeTriage(next);
    },
    [],
  );

  const undo = useCallback((opportunityId: string) => {
    const next = { ...readTriage() };
    delete next[opportunityId];
    setTriage(next);
    writeTriage(next);
  }, []);

  const saveProposal = useCallback(
    (
      opportunityId: string,
      proposal: Omit<OpportunityProposalDraft, "updatedAt" | "savedAt">,
      moveToProposal = false,
    ) => {
      const current = readTriage()[opportunityId];
      if (!current || current.decision !== "interested") return;

      const now = new Date().toISOString();
      const next = {
        ...readTriage(),
        [opportunityId]: {
          ...current,
          stage: moveToProposal ? "proposal" : (current.stage ?? "analysis"),
          proposal: {
            ...proposal,
            updatedAt: now,
            ...(moveToProposal ? { savedAt: now } : {}),
          },
        },
      } satisfies OpportunityTriage;
      setTriage(next);
      writeTriage(next);
    },
    [],
  );

  const sendProposal = useCallback((opportunityId: string) => {
    const current = readTriage()[opportunityId];
    if (!current || current.decision !== "interested" || current.stage !== "proposal") return;

    const submittedAt = new Date().toISOString();
    const next = {
      ...readTriage(),
      [opportunityId]: {
        ...current,
        stage: "dispute",
        submission: {
          submittedAt,
          receipt: `LB-${opportunityId
            .replace(/[^a-zA-Z0-9]/g, "")
            .slice(-8)
            .toUpperCase()}`,
        },
      },
    } satisfies OpportunityTriage;
    setTriage(next);
    writeTriage(next);
  }, []);

  return { triage, decide, undo, saveProposal, sendProposal };
}
