import { useEffect, useMemo, useRef, useState } from "react";
import { AtSign, Check, Paperclip, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  formatAnnotationDate,
  type AnnotationContext,
  type AnnotationStatus,
  useAnnotations,
} from "@/hooks/use-annotations";

const mentionOptions = ["Ana — comercial", "Rafael — técnico", "Equipe da proposta"];

function statusLabel(status: AnnotationStatus) {
  if (status === "resolved") return "Resolvida";
  if (status === "archived") return "Arquivada";
  return "Em aberto";
}

export function AnnotationThread({
  tenderId,
  tenderTitle,
  context,
  legacyNote,
  className,
}: {
  tenderId: string;
  tenderTitle: string;
  context?: AnnotationContext;
  legacyNote?: string | undefined;
  className?: string;
}) {
  const { addAnnotation, annotationsForTender, setStatus } = useAnnotations();
  const [draft, setDraft] = useState("");
  const [mentions, setMentions] = useState<string[]>([]);
  const [attachment, setAttachment] = useState<{ name: string; size: number } | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const annotations = annotationsForTender(tenderId);

  useEffect(() => {
    if (!legacyNote?.trim() || annotations.some((annotation) => annotation.content === legacyNote))
      return;
    addAnnotation({
      tenderId,
      tenderTitle,
      content: legacyNote,
      context: context ?? { type: "tender", label: "Participação" },
    });
  }, [addAnnotation, annotations, context, legacyNote, tenderId, tenderTitle]);

  const openCount = useMemo(
    () => annotations.filter((annotation) => annotation.status === "open").length,
    [annotations],
  );

  const submit = () => {
    if (!draft.trim()) return;
    addAnnotation({
      tenderId,
      tenderTitle,
      content: draft,
      ...(context ? { context } : {}),
      mentions,
      attachments: attachment
        ? [{ id: `local-${Date.now()}`, name: attachment.name, size: attachment.size }]
        : [],
    });
    setDraft("");
    setMentions([]);
    setAttachment(undefined);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold text-brand-strong">Colaboração interna</p>
          <h2 className="mt-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
            Anotações da equipe
          </h2>
          <p className="mt-1 text-[13px] text-slate-text">
            Observações privadas com histórico e vínculo ao contexto desta licitação.
          </p>
        </div>
        <span className="rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-bold text-brand-strong">
          {openCount} {openCount === 1 ? "em aberta" : "em abertas"}
        </span>
      </div>

      <div className="rounded-2xl border border-hairline bg-slate-50/70 p-4">
        <label htmlFor={`annotation-${tenderId}`} className="text-[12px] font-bold text-ink">
          Nova anotação
        </label>
        <Textarea
          id={`annotation-${tenderId}`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Registre uma decisão, pendência ou contexto para a equipe."
          className="mt-2 min-h-24 resize-y rounded-xl bg-white text-[13px]"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {mentionOptions.map((mention) => {
            const active = mentions.includes(mention);
            return (
              <button
                key={mention}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  setMentions((current) =>
                    active ? current.filter((item) => item !== mention) : [...current, mention],
                  )
                }
                className={cn(
                  "min-h-9 rounded-lg border px-2.5 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                  active
                    ? "border-[#9DE9B2] bg-brand-tint text-brand-strong"
                    : "border-hairline bg-white text-slate-text hover:text-ink",
                )}
              >
                <AtSign className="mr-1 inline size-3" />
                {mention}
              </button>
            );
          })}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) setAttachment({ name: file.name, size: file.size });
          }}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-h-9 items-center gap-2 text-[11px] text-slate-text">
            {attachment ? (
              <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1.5 font-bold text-ink">
                <Paperclip className="size-3 text-brand-strong" />
                {attachment.name}
                <button
                  type="button"
                  onClick={() => setAttachment(undefined)}
                  aria-label="Remover anexo"
                >
                  <X className="size-3" />
                </button>
              </span>
            ) : (
              "Visível apenas para a equipe."
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-11 rounded-xl border-hairline text-[12px] font-bold"
            >
              <Paperclip className="size-4" />
              Anexar
            </Button>
            <Button
              type="button"
              disabled={!draft.trim()}
              onClick={submit}
              className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-bold text-white hover:bg-[#139e3e]"
            >
              <Plus className="size-4" />
              Salvar anotação
            </Button>
          </div>
        </div>
      </div>

      {annotations.length ? (
        <div className="divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-white">
          {annotations.map((annotation) => (
            <article key={annotation.id} className="p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-tint text-[12px] font-bold text-brand-strong">
                    {annotation.author.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-ink">
                      {annotation.author.name}{" "}
                      <span className="font-medium text-slate-text">
                        · {formatAnnotationDate(annotation.updatedAt)}
                      </span>
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-slate-text">
                      {annotation.content}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setStatus(annotation.id, annotation.status === "open" ? "resolved" : "open")
                  }
                  className={cn(
                    "min-h-9 shrink-0 rounded-lg border px-2.5 text-[11px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                    annotation.status === "open"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-[#9DE9B2] bg-brand-tint text-brand-strong",
                  )}
                >
                  {annotation.status === "resolved" ? (
                    <Check className="mr-1 inline size-3" />
                  ) : null}
                  {statusLabel(annotation.status)}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 pl-0 sm:pl-12">
                {annotation.context ? (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-text">
                    {annotation.context.label}
                  </span>
                ) : null}
                {annotation.mentions.map((mention) => (
                  <span
                    key={mention}
                    className="rounded-full bg-brand-tint px-2 py-1 text-[10px] font-bold text-brand-strong"
                  >
                    @ {mention}
                  </span>
                ))}
                {annotation.attachments.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-text"
                  >
                    <Paperclip className="mr-1 inline size-3" />
                    {item.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-hairline bg-slate-50/60 px-4 py-8 text-center">
          <p className="text-[13px] font-bold text-ink">Nenhuma anotação neste contexto</p>
          <p className="mt-1 text-[12px] text-slate-text">
            Registre a primeira decisão para que a equipe possa consultá-la depois.
          </p>
        </div>
      )}
    </div>
  );
}
