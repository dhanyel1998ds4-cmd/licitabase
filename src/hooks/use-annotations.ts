import { useCallback, useEffect, useMemo, useState } from "react";

export type AnnotationStatus = "open" | "resolved" | "archived";

export type AnnotationContext = {
  type: "tender" | "item" | "document" | "proposal" | "pipeline" | "dispute" | "xray";
  label: string;
};

export type AnnotationAttachment = {
  id: string;
  name: string;
  size: number;
};

export type Annotation = {
  id: string;
  tenderId: string;
  tenderTitle: string;
  content: string;
  author: { name: string; initials: string };
  createdAt: string;
  updatedAt: string;
  status: AnnotationStatus;
  context?: AnnotationContext;
  mentions: string[];
  attachments: AnnotationAttachment[];
};

export type CreateAnnotationInput = {
  tenderId: string;
  tenderTitle: string;
  content: string;
  context?: AnnotationContext;
  mentions?: string[];
  attachments?: AnnotationAttachment[];
};

const storageKey = "licitabase:annotations";
const eventName = "licitabase:annotations-change";
let memoryAnnotations: Annotation[] = [];

function readAnnotations(): Annotation[] {
  if (typeof window === "undefined") return memoryAnnotations;

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    if (Array.isArray(value)) memoryAnnotations = value as Annotation[];
  } catch {
    // A interface continua utilizável em memória quando o storage não está disponível.
  }

  return memoryAnnotations;
}

function writeAnnotations(next: Annotation[]) {
  memoryAnnotations = next;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // A persistência local é progressiva neste protótipo; o backend substituirá esta camada.
  }
  window.dispatchEvent(new Event(eventName));
}

function newId() {
  return `annotation-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatAnnotationDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function useAnnotations() {
  const [annotations, setAnnotations] = useState<Annotation[]>(readAnnotations);

  useEffect(() => {
    const sync = () =>
      setAnnotations([...readAnnotations()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
    sync();
    window.addEventListener(eventName, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(eventName, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addAnnotation = useCallback((input: CreateAnnotationInput) => {
    const now = new Date().toISOString();
    const annotation: Annotation = {
      id: newId(),
      tenderId: input.tenderId,
      tenderTitle: input.tenderTitle,
      content: input.content.trim(),
      author: { name: "Jussefer", initials: "JE" },
      createdAt: now,
      updatedAt: now,
      status: "open",
      ...(input.context ? { context: input.context } : {}),
      mentions: input.mentions ?? [],
      attachments: input.attachments ?? [],
    };
    const next = [annotation, ...readAnnotations()];
    setAnnotations(next);
    writeAnnotations(next);
    return annotation;
  }, []);

  const setStatus = useCallback((id: string, status: AnnotationStatus) => {
    const now = new Date().toISOString();
    const next = readAnnotations().map((annotation) =>
      annotation.id === id ? { ...annotation, status, updatedAt: now } : annotation,
    );
    setAnnotations(next);
    writeAnnotations(next);
  }, []);

  const annotationsForTender = useCallback(
    (tenderId: string) => annotations.filter((annotation) => annotation.tenderId === tenderId),
    [annotations],
  );

  return useMemo(
    () => ({ annotations, addAnnotation, setStatus, annotationsForTender }),
    [addAnnotation, annotations, annotationsForTender, setStatus],
  );
}
