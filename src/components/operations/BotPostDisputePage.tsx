import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  FileCheck2,
  Gavel,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dash2/Panel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { disputes } from "@/lib/bid-bot-fixtures";
import { useBotOperationOutcomes } from "@/hooks/use-bot-operation-outcomes";

type PostDisputeKey = "fiscalDocuments" | "technicalDocuments" | "proposalConfirmed";

const defaultPostDispute = {
  fiscalDocuments: false,
  technicalDocuments: false,
  proposalConfirmed: false,
  diligence: "none" as const,
  appealIntent: false,
};

export function BotPostDisputePage({ disputeId }: { disputeId: string }) {
  const dispute = disputes.find((item) => item.id === disputeId);
  const { outcomes, finalizeOutcome, updatePostDispute } = useBotOperationOutcomes();
  const outcome = outcomes[disputeId];

  if (!dispute || !outcome) return <PostDisputeUnavailable disputeId={disputeId} />;

  const postDispute = { ...defaultPostDispute, ...outcome.postDispute };
  const isWon = outcome.position === "1º";
  const isFinalized = outcome.disposition !== "post-dispute";
  const documentsReady =
    postDispute.fiscalDocuments && postDispute.technicalDocuments && postDispute.proposalConfirmed;
  const completedChecks = [
    postDispute.fiscalDocuments,
    postDispute.technicalDocuments,
    postDispute.proposalConfirmed,
  ].filter(Boolean).length;

  function setCheck(key: PostDisputeKey, checked: boolean) {
    updatePostDispute(disputeId, { [key]: checked });
  }

  function confirmOutcome() {
    finalizeOutcome(disputeId, isWon ? "adjudicated" : "lost");
    toast.success(isWon ? "Resultado encaminhado para adjudicação." : "Não êxito registrado.", {
      description: isWon
        ? "A participação permanece disponível para acompanhar a confirmação do órgão."
        : "O histórico da disputa foi preservado na sua operação.",
    });
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="space-y-5 sm:space-y-6">
        <Link
          to="/dash2/operacao/minhas-licitacoes"
          className="inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-[12px] font-bold text-slate-text hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Minhas licitações
        </Link>

        <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${isFinalized ? (outcome.disposition === "adjudicated" ? "bg-brand-tint text-brand-strong" : "bg-slate-100 text-slate-text") : "bg-amber-50 text-amber-700"}`}
              >
                {isFinalized
                  ? outcome.disposition === "adjudicated"
                    ? "Adjudicada"
                    : "Não êxito"
                  : "Pós-disputa"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#29C454]/25 bg-white px-2.5 py-1 text-[10px] font-extrabold text-brand-strong">
                <Bot className="size-3.5" aria-hidden="true" />
                Bot de Lances
              </span>
              <span className="text-[11px] font-bold text-slate-text">{dispute.notice}</span>
            </div>
            <h1 className="mt-3 max-w-5xl text-[24px] font-extrabold leading-tight tracking-[-0.025em] text-ink sm:text-[30px]">
              {dispute.object}
            </h1>
            <p className="mt-3 text-[13px] text-slate-text">
              {dispute.agency} · UASG {dispute.uasg}
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="min-h-11 shrink-0 rounded-xl border-hairline text-[12px] font-bold"
          >
            <Link to="/bot-lances/disputas/$disputeId" params={{ disputeId }}>
              Ver sala de disputa
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </header>

        <Panel
          className={`p-4 sm:p-5 ${isFinalized ? "border-[#29C454]/25 bg-[linear-gradient(110deg,#F0FCF4,#FFFFFF)]" : "border-amber-200 bg-[linear-gradient(110deg,#FFF9EC,#FFFFFF)]"}`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-3">
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-xl ${isFinalized ? "bg-brand-tint text-brand-strong" : "bg-amber-100 text-amber-700"}`}
              >
                {isFinalized ? (
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                ) : (
                  <ClipboardCheck className="size-5" aria-hidden="true" />
                )}
              </span>
              <div>
                <h2 className="text-[15px] font-extrabold text-ink">
                  {isFinalized
                    ? outcome.disposition === "adjudicated"
                      ? "Resultado confirmado para adjudicação"
                      : "Resultado encerrado sem êxito"
                    : "Conferência operacional pendente"}
                </h2>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                  {isFinalized
                    ? "O desfecho e as informações da sessão estão registrados na operação."
                    : "Valide a classificação, a documentação e eventuais movimentos do órgão antes de concluir."}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-hairline rounded-xl border border-hairline bg-white text-center">
              <Metric
                label="Posição final"
                value={outcome.position}
                tone={isWon ? "brand" : "ink"}
              />
              <Metric label="Último lance" value={outcome.finalBid} />
              <Metric label="Lances" value={String(outcome.bids)} />
            </div>
          </div>
        </Panel>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
          <div className="space-y-5">
            <Panel className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[16px] font-extrabold text-ink">
                    Classificação e habilitação
                  </h2>
                  <p className="mt-1 text-[12px] text-slate-text">
                    Checklist que antecede a confirmação do resultado.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-text">
                  {completedChecks}/3 conferidos
                </span>
              </div>
              <div className="mt-4 divide-y divide-hairline">
                <CheckItem
                  checked={postDispute.fiscalDocuments}
                  disabled={isFinalized}
                  label="Documentação fiscal válida"
                  detail="Certidões e regularidade revisadas pela equipe."
                  onChange={(checked) => setCheck("fiscalDocuments", checked)}
                />
                <CheckItem
                  checked={postDispute.technicalDocuments}
                  disabled={isFinalized}
                  label="Habilitação técnica conferida"
                  detail="Atestados e requisitos técnicos compatíveis com o edital."
                  onChange={(checked) => setCheck("technicalDocuments", checked)}
                />
                <CheckItem
                  checked={postDispute.proposalConfirmed}
                  disabled={isFinalized}
                  label="Proposta e valor final confirmados"
                  detail="Último lance e condições comerciais conferidos na ata."
                  onChange={(checked) => setCheck("proposalConfirmed", checked)}
                />
              </div>
            </Panel>

            <Panel className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#EEF4FF] text-[#3269D8]">
                  <Scale className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-[16px] font-extrabold text-ink">Diligências e recursos</h2>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                    Registre o que ainda depende do órgão ou da sua equipe.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-[12px] font-bold text-ink">
                  Situação da diligência
                  <select
                    value={postDispute.diligence}
                    disabled={isFinalized}
                    onChange={(event) =>
                      updatePostDispute(disputeId, {
                        diligence: event.target.value as "none" | "pending" | "answered",
                      })
                    }
                    className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[12px] font-medium text-ink outline-none transition-colors focus:border-[#29C454]"
                  >
                    <option value="none">Sem diligência</option>
                    <option value="pending">Aguardando resposta</option>
                    <option value="answered">Respondida</option>
                  </select>
                </label>
                <label className="flex min-h-11 items-center gap-3 self-end rounded-xl border border-hairline px-3 text-[12px] font-bold text-ink">
                  <Checkbox
                    checked={postDispute.appealIntent}
                    disabled={isFinalized}
                    onCheckedChange={(checked) =>
                      updatePostDispute(disputeId, { appealIntent: checked === true })
                    }
                  />
                  Há intenção de recurso
                </label>
              </div>
            </Panel>

            <Panel className="p-4 sm:p-5">
              <h2 className="text-[16px] font-extrabold text-ink">Histórico do resultado</h2>
              <ol className="mt-4 space-y-4 border-l border-hairline pl-4">
                <HistoryItem
                  title="Sessão de disputa encerrada"
                  detail={`Bot registrou ${outcome.bids} lances e o último lance de ${outcome.finalBid}.`}
                />
                <HistoryItem
                  title="Resultado disponibilizado para conferência"
                  detail="A participação entrou na etapa de pós-disputa da sua operação."
                />
                {isFinalized ? (
                  <HistoryItem
                    title={
                      outcome.disposition === "adjudicated"
                        ? "Encaminhado para adjudicação"
                        : "Não êxito registrado"
                    }
                    detail={
                      outcome.finalizedAt
                        ? `Desfecho registrado em ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(outcome.finalizedAt))}.`
                        : "Desfecho registrado na operação."
                    }
                    complete
                  />
                ) : null}
              </ol>
            </Panel>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-0 xl:self-start">
            <Panel className="p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <Gavel className="size-4 text-brand-strong" aria-hidden="true" />
                <h2 className="text-[14px] font-extrabold text-ink">Próximo encaminhamento</h2>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-text">
                {isFinalized
                  ? outcome.disposition === "adjudicated"
                    ? "Acompanhe a adjudicação e a eventual homologação no histórico operacional."
                    : "Mantenha os registros para análise de resultado e aprendizado da operação."
                  : isWon
                    ? "Depois da conferência, registre o resultado para seguir à adjudicação."
                    : "Confirme a classificação para fechar esta participação sem êxito."}
              </p>
              {!isFinalized ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      disabled={isWon && !documentsReady}
                      className="mt-4 min-h-11 w-full rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
                    >
                      {isWon ? (
                        <Gavel className="size-4" aria-hidden="true" />
                      ) : (
                        <CircleAlert className="size-4" aria-hidden="true" />
                      )}
                      {isWon ? "Confirmar para adjudicação" : "Registrar não êxito"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[calc(100%_-_32px)] rounded-2xl sm:max-w-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {isWon ? "Confirmar resultado para adjudicação?" : "Registrar não êxito?"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {isWon
                          ? "A classificação, documentos e proposta conferidos serão registrados como resultado da operação."
                          : "A disputa deixará a fila de pós-disputa e permanecerá disponível em Finalizadas."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Revisar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-[#18B849] text-white hover:bg-[#139e3e]"
                        onClick={confirmOutcome}
                      >
                        Confirmar resultado
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}
              {isWon && !documentsReady && !isFinalized ? (
                <p className="mt-3 text-[11px] leading-relaxed text-amber-700">
                  Conclua os três itens de habilitação para liberar o encaminhamento.
                </p>
              ) : null}
            </Panel>

            <Panel className="p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-strong" aria-hidden="true" />
                <h2 className="text-[14px] font-extrabold text-ink">Dados da sessão</h2>
              </div>
              <dl className="mt-3 divide-y divide-hairline text-[12px]">
                <DetailRow label="Sessão" value={dispute.date} />
                <DetailRow label="Itens" value={String(dispute.items)} />
                <DetailRow label="Valor estimado" value={dispute.estimatedValue} />
                <DetailRow
                  label="Encerrada"
                  value={new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(outcome.closedAt))}
                />
              </dl>
            </Panel>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PostDisputeUnavailable({ disputeId }: { disputeId: string }) {
  return (
    <div className="grid min-h-0 flex-1 place-items-center px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <Panel className="max-w-md p-5 text-center sm:p-6">
        <CircleAlert className="mx-auto size-7 text-amber-600" aria-hidden="true" />
        <h1 className="mt-3 text-[19px] font-extrabold text-ink">Resultado ainda não disponível</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-text">
          Encerre a sessão do bot para iniciar a conferência de pós-disputa.
        </p>
        <Button
          asChild
          className="mt-5 min-h-11 rounded-xl bg-[#18B849] text-white hover:bg-[#139e3e]"
        >
          <Link to="/bot-lances/disputas/$disputeId" params={{ disputeId }}>
            Abrir sala de disputa
          </Link>
        </Button>
      </Panel>
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "brand" | "ink";
}) {
  return (
    <div className="min-w-[92px] px-3 py-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.07em] text-slate-text">{label}</p>
      <p
        className={`tnum mt-1 text-[13px] font-extrabold ${tone === "brand" ? "text-brand-strong" : "text-ink"}`}
      >
        {value}
      </p>
    </div>
  );
}

function CheckItem({
  checked,
  disabled,
  label,
  detail,
  onChange,
}: {
  checked: boolean;
  disabled: boolean;
  label: string;
  detail: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-16 cursor-pointer items-start gap-3 py-3 first:pt-0 last:pb-0">
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onChange(value === true)}
        className="mt-0.5"
      />
      <span>
        <span className="block text-[13px] font-bold text-ink">{label}</span>
        <span className="mt-1 block text-[12px] leading-relaxed text-slate-text">{detail}</span>
      </span>
    </label>
  );
}

function HistoryItem({
  title,
  detail,
  complete = false,
}: {
  title: string;
  detail: string;
  complete?: boolean;
}) {
  return (
    <li className="relative">
      <span
        className={`absolute -left-[21px] top-1 grid size-3 place-items-center rounded-full ${complete ? "bg-[#18B849]" : "bg-slate-300"}`}
      >
        {complete ? <CheckCircle2 className="size-2.5 text-white" aria-hidden="true" /> : null}
      </span>
      <p className="text-[13px] font-bold text-ink">{title}</p>
      <p className="mt-1 text-[12px] leading-relaxed text-slate-text">{detail}</p>
    </li>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <dt className="text-slate-text">{label}</dt>
      <dd className="text-right font-bold text-ink">{value}</dd>
    </div>
  );
}
