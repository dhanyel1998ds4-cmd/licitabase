import type { ReactNode } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileWarning,
  LockKeyhole,
  PlugZap,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { Panel } from "@/components/dash2/Panel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type InternalPageStateKind =
  "loading" | "empty" | "error" | "forbidden" | "plan" | "unavailable";

type StateCopy = {
  icon: typeof Sparkles;
  iconClassName: string;
  title: string;
  description: string;
};

const stateCopy: Record<Exclude<InternalPageStateKind, "loading">, StateCopy> = {
  empty: {
    icon: Sparkles,
    iconClassName: "bg-brand-tint text-brand-strong",
    title: "Ainda não há nada por aqui",
    description: "Quando houver novos registros, eles aparecerão nesta área.",
  },
  error: {
    icon: CircleAlert,
    iconClassName: "bg-red-50 text-red-600",
    title: "Não foi possível carregar esta área",
    description:
      "Tente novamente. Se o problema persistir, verifique sua conexão ou fale com o suporte.",
  },
  forbidden: {
    icon: LockKeyhole,
    iconClassName: "bg-amber-50 text-amber-700",
    title: "Você não tem acesso a este conteúdo",
    description: "Peça a um administrador do workspace para revisar suas permissões.",
  },
  plan: {
    icon: PlugZap,
    iconClassName: "bg-violet-50 text-violet-700",
    title: "Este recurso não está incluído no seu plano",
    description: "Atualize o plano para liberar esta capacidade para o seu workspace.",
  },
  unavailable: {
    icon: FileWarning,
    iconClassName: "bg-slate-100 text-slate-text",
    title: "Este recurso está indisponível no momento",
    description: "Preservamos seus dados. Tente novamente em alguns instantes.",
  },
};

export function InternalPageState({
  state,
  title,
  description,
  action,
  className,
}: {
  state: InternalPageStateKind;
  title?: string | undefined;
  description?: string | undefined;
  action?: ReactNode | undefined;
  className?: string | undefined;
}) {
  if (state === "loading") return <InternalPageLoading className={className} />;

  const copy = stateCopy[state];
  const Icon = copy.icon;
  return (
    <Panel
      className={cn("grid min-h-[320px] place-items-center p-5 text-center sm:p-6", className)}
    >
      <div className="max-w-sm">
        <span
          className={cn("mx-auto grid size-14 place-items-center rounded-2xl", copy.iconClassName)}
        >
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-[18px] font-extrabold text-ink">{title ?? copy.title}</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-text">
          {description ?? copy.description}
        </p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </Panel>
  );
}

export function InternalPageLoading({ className }: { className?: string | undefined }) {
  return (
    <Panel
      className={cn("p-4 sm:p-5", className)}
      aria-busy="true"
      aria-label="Carregando conteúdo"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-56 max-w-[70vw]" />
        </div>
        <Skeleton className="h-11 w-28 rounded-xl" />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="mt-3 h-32 rounded-xl" />
      <span className="sr-only">Carregando conteúdo</span>
    </Panel>
  );
}

export type InternalStatusKind = "success" | "offline" | "updating" | "stale";

const noticeCopy: Record<
  InternalStatusKind,
  { icon: typeof CheckCircle2; className: string; title: string; description: string }
> = {
  success: {
    icon: CheckCircle2,
    className: "border-[#29C454]/25 bg-brand-tint/60 text-[#176C36]",
    title: "Alterações salvas",
    description: "As informações já estão disponíveis para a equipe.",
  },
  offline: {
    icon: WifiOff,
    className: "border-amber-200 bg-amber-50 text-amber-800",
    title: "Você está sem conexão",
    description:
      "Os dados exibidos podem não estar atualizados. Ações online estão temporariamente indisponíveis.",
  },
  updating: {
    icon: RefreshCw,
    className: "border-[#3269D8]/20 bg-[#EEF4FF] text-[#2455B6]",
    title: "Atualizando informações",
    description:
      "Você pode continuar consultando os dados enquanto buscamos a versão mais recente.",
  },
  stale: {
    icon: Clock3,
    className: "border-slate-200 bg-slate-50 text-slate-text",
    title: "Dados podem estar desatualizados",
    description:
      "A última sincronização não foi concluída. Atualize antes de tomar uma decisão crítica.",
  },
};

export function InternalStatusNotice({
  state,
  action,
  className,
}: {
  state: InternalStatusKind;
  action?: ReactNode | undefined;
  className?: string | undefined;
}) {
  const copy = noticeCopy[state];
  const Icon = copy.icon;
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between",
        copy.className,
        className,
      )}
      role="status"
    >
      <div className="flex gap-3">
        <Icon
          className={cn("mt-0.5 size-5 shrink-0", state === "updating" && "animate-spin")}
          aria-hidden="true"
        />
        <div>
          <p className="text-[13px] font-extrabold text-ink">{copy.title}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-slate-text">{copy.description}</p>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onDiscard,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscard: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[calc(100%_-_32px)] rounded-2xl sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Descartar alterações não salvas?</AlertDialogTitle>
          <AlertDialogDescription>
            Suas mudanças serão perdidas. Você pode continuar editando para revisar antes de sair.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continuar editando</AlertDialogCancel>
          <AlertDialogAction
            className="bg-rose-600 text-white hover:bg-rose-700"
            onClick={onDiscard}
          >
            Descartar alterações
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
