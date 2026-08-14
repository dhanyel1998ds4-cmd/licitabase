import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { NotebookPen, Plus, Save } from "lucide-react";
import {
  InternalPageState,
  InternalStatusNotice,
  UnsavedChangesDialog,
  type InternalPageStateKind,
  type InternalStatusKind,
} from "@/components/dash2/InternalPageState";
import { Panel } from "@/components/dash2/Panel";
import { Button } from "@/components/ui/button";

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
        <NotesHeader disabled={fullPageStates.includes(state as InternalPageStateKind)} />

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
          </>
        )}
      </div>
    </div>
  );
}

function NotesHeader({ disabled }: { disabled: boolean }) {
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
      <Button
        type="button"
        disabled={disabled}
        className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white disabled:opacity-60"
      >
        <Plus className="size-4" />
        Nova anotação
      </Button>
    </header>
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
