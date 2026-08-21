import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Plus, Save, Search } from "lucide-react";
import {
  InternalPageState,
  InternalStatusNotice,
  UnsavedChangesDialog,
  type InternalPageStateKind,
  type InternalStatusKind,
} from "@/components/dash2/InternalPageState";
import { Panel } from "@/components/dash2/Panel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  formatAnnotationDate,
  useAnnotations,
  type AnnotationStatus,
} from "@/hooks/use-annotations";
import { newOpportunities } from "@/lib/new-opportunities-fixtures";
import { cn } from "@/lib/utils";

const previewStates = [
  "default",
  "loading",
  "error",
  "forbidden",
  "plan",
  "unavailable",
  "success",
  "offline",
  "updating",
  "stale",
  "dirty",
] as const;
type NotesPreviewState = (typeof previewStates)[number];

export const Route = createFileRoute("/dash2/operacao/anotacoes")({
  validateSearch: (search: Record<string, unknown>) => ({
    state: previewStates.includes(search["state"] as NotesPreviewState)
      ? (search["state"] as NotesPreviewState)
      : "default",
  }),
  head: () => ({ meta: [{ title: "Minhas anotações — LicitaBase" }] }),
  component: NotesPage,
});

function NotesPage() {
  const { state } = Route.useSearch();
  const fullPageStates: InternalPageStateKind[] = [
    "loading",
    "error",
    "forbidden",
    "plan",
    "unavailable",
  ];
  const noticeStates: InternalStatusKind[] = ["success", "offline", "updating", "stale"];

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="space-y-5 sm:space-y-6">
        <NotesWorkspaceHeader disabled={fullPageStates.includes(state as InternalPageStateKind)} />

        {fullPageStates.includes(state as InternalPageStateKind) ? (
          <InternalPageState
            state={state as InternalPageStateKind}
            title={state === "loading" ? undefined : "Não foi possível abrir suas anotações"}
            description={
              state === "error"
                ? "Tente novamente para recuperar as observações vinculadas às licitações."
                : undefined
            }
            action={
              state === "error" ? (
                <Button
                  type="button"
                  className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
                >
                  Tentar novamente
                </Button>
              ) : undefined
            }
          />
        ) : state === "dirty" ? (
          <NotesDirtyPreview />
        ) : (
          <>
            {noticeStates.includes(state as InternalStatusKind) ? (
              <InternalStatusNotice
                state={state as InternalStatusKind}
                action={
                  state === "stale" || state === "offline" ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-10 rounded-xl border-current/20 bg-white/70 text-[11px] font-bold text-ink"
                    >
                      Atualizar agora
                    </Button>
                  ) : undefined
                }
              />
            ) : null}
            <NotesWorkspace />
          </>
        )}
      </div>
    </div>
  );
}

function NotesWorkspaceHeader({ disabled }: { disabled: boolean }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[12px] font-bold text-brand-strong">Minha operação</p>
        <h1 className="mt-1 text-[24px] font-extrabold tracking-[-0.02em] text-ink sm:text-[28px]">
          Minhas anotações
        </h1>
        <p className="mt-2 text-[13px] text-slate-text">
          Centralize observações e decisões vinculadas às suas licitações.
        </p>
      </div>
      <NotesCreateAction disabled={disabled} />
    </header>
  );
}

function NotesCreateAction({ disabled }: { disabled: boolean }) {
  const { addAnnotation } = useAnnotations();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [tenderId, setTenderId] = useState(newOpportunities[0]?.id ?? "");
  const selectedTender = newOpportunities.find((item) => item.id === tenderId);

  const save = () => {
    if (!draft.trim() || !selectedTender) return;
    addAnnotation({
      tenderId: selectedTender.id,
      tenderTitle: selectedTender.title,
      content: draft,
      context: { type: "tender", label: "Anotação geral" },
    });
    setDraft("");
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e] disabled:opacity-60"
      >
        <Plus className="size-4" />
        Nova anotação
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-0 sm:rounded-2xl">
          <DialogHeader className="border-b border-hairline px-5 py-5">
            <DialogTitle className="text-[18px] font-bold text-ink">
              Nova anotação interna
            </DialogTitle>
            <DialogDescription className="text-[13px] text-slate-text">
              Escolha a licitação e registre uma decisão privada para a equipe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-5 py-5">
            <label className="grid gap-2 text-[12px] font-bold text-ink">
              Licitação vinculada
              <select
                value={tenderId}
                onChange={(event) => setTenderId(event.target.value)}
                className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[13px] font-medium text-ink outline-none focus:border-[#29C454]"
              >
                {newOpportunities.map((opportunity) => (
                  <option key={opportunity.id} value={opportunity.id}>
                    {opportunity.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-[12px] font-bold text-ink">
              Anotação
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ex.: confirmar a documentação fiscal antes de preparar a proposta."
                className="min-h-28 resize-y rounded-xl text-[13px]"
              />
            </label>
          </div>
          <div className="flex flex-wrap justify-end gap-2 border-t border-hairline px-5 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="min-h-11 rounded-xl border-hairline text-[12px] font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={!draft.trim() || !selectedTender}
              onClick={save}
              className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-bold text-white hover:bg-[#139e3e]"
            >
              <Save className="size-4" /> Salvar anotação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function NotesWorkspace() {
  const { annotations, setStatus } = useAnnotations();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | AnnotationStatus>("all");
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return annotations.filter((annotation) => {
      const matchesFilter = filter === "all" || annotation.status === filter;
      const matchesQuery =
        !normalized ||
        `${annotation.content} ${annotation.tenderTitle} ${annotation.author.name}`
          .toLocaleLowerCase("pt-BR")
          .includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }, [annotations, filter, query]);

  if (!annotations.length) {
    return (
      <InternalPageState
        state="empty"
        title="Nenhuma anotação registrada"
        description="As anotações criadas durante a análise e a participação aparecerão aqui para consulta."
        action={
          <Button
            asChild
            variant="outline"
            className="min-h-11 rounded-xl border-hairline text-[12px] font-bold text-ink"
          >
            <Link to="/dash2/operacao/minhas-licitacoes">Ver minhas licitações</Link>
          </Button>
        }
      />
    );
  }

  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-hairline p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[12px] font-bold text-brand-strong">Registro da operação</p>
          <h2 className="mt-1 text-[18px] font-bold text-ink">Decisões e pendências registradas</h2>
          <p className="mt-1 text-[12px] text-slate-text">
            Cada anotação permanece vinculada à licitação e ao contexto em que foi criada.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-text" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar anotação"
              className="min-h-11 rounded-xl border-hairline pl-9 text-[13px]"
            />
          </div>
          <div className="grid grid-cols-3 rounded-xl bg-slate-100 p-1 text-[11px] font-bold">
            {(["all", "open", "resolved"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  "min-h-9 rounded-lg px-2 transition-colors",
                  filter === item
                    ? "bg-white text-ink shadow-sm"
                    : "text-slate-text hover:text-ink",
                )}
              >
                {item === "all" ? "Todas" : item === "open" ? "Abertas" : "Resolvidas"}
              </button>
            ))}
          </div>
        </div>
      </div>
      {visible.length ? (
        <div className="divide-y divide-hairline">
          {visible.map((annotation) => (
            <article
              key={annotation.id}
              className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-tint px-2 py-1 text-[10px] font-bold text-brand-strong">
                    {annotation.context?.label ?? "Licitação"}
                  </span>
                  <span className="text-[11px] font-medium text-slate-text">
                    {annotation.author.name} · {formatAnnotationDate(annotation.updatedAt)}
                  </span>
                </div>
                <h3 className="mt-2 truncate text-[13px] font-bold text-ink">
                  {annotation.tenderTitle}
                </h3>
                <p className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-slate-text">
                  {annotation.content}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setStatus(annotation.id, annotation.status === "open" ? "resolved" : "open")
                }
                className={cn(
                  "min-h-10 rounded-xl border px-3 text-[11px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                  annotation.status === "open"
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-[#9DE9B2] bg-brand-tint text-brand-strong",
                )}
              >
                {annotation.status === "resolved" ? <Check className="mr-1 inline size-3" /> : null}
                {annotation.status === "open" ? "Em aberta" : "Resolvida"}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-[13px] font-bold text-ink">Nenhum resultado encontrado</p>
          <p className="mt-1 text-[12px] text-slate-text">
            Ajuste a busca ou o filtro para consultar outras anotações.
          </p>
        </div>
      )}
    </Panel>
  );
}

function NotesDirtyPreview() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState("Confirmar os documentos técnicos antes da próxima etapa.");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-extrabold text-amber-700">
              Rascunho não salvo
            </span>
            <h2 className="mt-3 text-[18px] font-extrabold text-ink">Nova anotação</h2>
            <p className="mt-1 text-[12px] text-slate-text">
              Exemplo do estado de confirmação de saída com alterações pendentes.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDialogOpen(true)}
            className="min-h-11 rounded-xl border-hairline text-[12px] font-bold"
          >
            Voltar sem salvar
          </Button>
        </div>
        <label className="mt-5 grid gap-2 text-[12px] font-bold text-ink">
          Anotação
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="min-h-32 resize-y rounded-xl border border-hairline bg-white px-3 py-3 text-[13px] font-medium leading-relaxed text-ink outline-none focus:border-[#29C454]"
          />
        </label>
        <Button
          type="button"
          disabled={!draft.trim()}
          className="mt-4 min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
        >
          <Save className="size-4" />
          Salvar anotação
        </Button>
      </Panel>
      <UnsavedChangesDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onDiscard={() =>
          navigate({ to: "/dash2/operacao/anotacoes", search: { state: "default" } })
        }
      />
    </>
  );
}
