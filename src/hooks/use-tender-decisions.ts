import { useCallback, useEffect, useState } from "react";

export type TenderDecision = "favorite" | "later" | "interested" | "discarded";
export type TenderDecisions = Record<string, TenderDecision>;

const storageKey = "licitabase:tender-decisions";
const eventName = "licitabase:tender-decisions-change";
let memoryDecisions: TenderDecisions = {};

function readDecisions(): TenderDecisions {
  if (typeof window === "undefined") return memoryDecisions;

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "{}");
    if (value && typeof value === "object" && !Array.isArray(value)) {
      memoryDecisions = value as TenderDecisions;
    }
  } catch {
    // O estado em memória mantém a interação funcional em contextos sem storage.
  }

  return memoryDecisions;
}

function writeDecisions(next: TenderDecisions) {
  memoryDecisions = next;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // A persistência entre recargas é opcional em contextos restritos.
  }
  window.dispatchEvent(new Event(eventName));
}

export function useTenderDecisions() {
  const [decisions, setDecisions] = useState<TenderDecisions>(readDecisions);

  useEffect(() => {
    const sync = () => setDecisions(readDecisions());
    window.addEventListener(eventName, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(eventName, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const decide = useCallback((tenderId: string, decision: TenderDecision | null) => {
    const current = readDecisions();
    const next = { ...current };
    if (decision) next[tenderId] = decision;
    else delete next[tenderId];
    setDecisions(next);
    writeDecisions(next);
  }, []);

  return { decisions, decide };
}
