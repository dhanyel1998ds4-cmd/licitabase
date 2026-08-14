import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  FileText,
  MapPin,
  Save,
  UserRound,
} from "lucide-react";
import { Panel } from "@/components/dash2/Panel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { newOpportunities } from "@/lib/new-opportunities-fixtures";
import { useOpportunityTriage } from "@/hooks/use-opportunity-triage";

const proposalSteps = ["Dados gerais", "Itens e valores", "Declarações", "Revisão"];

function useParticipation(licitacaoId: string) {
  const { triage, saveProposal, sendProposal } = useOpportunityTriage();
  const opportunity = useMemo(
    () => newOpportunities.find((item) => item.id === licitacaoId),
    [licitacaoId],
  );
  const record = triage[licitacaoId];
  const isAvailable = Boolean(opportunity && record?.decision === "interested");
  return { opportunity, record, isAvailable, saveProposal, sendProposal };
}

function NotFoundParticipation() {
  return (
    <div className="grid min-h-0 flex-1 place-items-center px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <Panel className="max-w-md p-6 text-center sm:p-7">
        <CircleAlert className="mx-auto size-7 text-amber-600" />
        <h1 className="mt-3 text-[19px] font-extrabold text-ink">Licitação não está na operação</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-text">
          Marque uma oportunidade como interessante antes de preparar a proposta.
        </p>
        <Button
          asChild
          className="mt-5 min-h-11 rounded-xl bg-[#18B849] text-white hover:bg-[#139e3e]"
        >
          <Link to="/dash2/oportunidades/novas">Ver oportunidades</Link>
        </Button>
      </Panel>
    </div>
  );
}

export function ParticipationDetailsPage({ licitacaoId }: { licitacaoId: string }) {
  const { opportunity, record, isAvailable } = useParticipation(licitacaoId);
  if (!opportunity || !record || !isAvailable) return <NotFoundParticipation />;

  const proposalStarted = record.stage === "proposal";
  const inDispute = record.stage === "dispute";

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="space-y-5 sm:space-y-6">
        <Link
          to="/dash2/operacao/minhas-licitacoes"
          className="inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-[12px] font-bold text-slate-text hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          <ArrowLeft className="size-4" />
          Minhas licitações
        </Link>

        <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-extrabold text-amber-700">
                {inDispute
                  ? "Em disputa"
                  : proposalStarted
                    ? "Proposta em preparação"
                    : "Em análise"}
              </span>
              <span className="text-[11px] font-bold text-brand-strong">
                {opportunity.matchScore ?? "—"}% aderência
              </span>
            </div>
            <h1 className="mt-3 max-w-4xl text-[24px] font-extrabold leading-tight tracking-[-0.025em] text-ink sm:text-[30px]">
              {opportunity.title}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-[13px] text-slate-text">
              <MapPin className="size-4 shrink-0" />
              {opportunity.agency} · {opportunity.state}
            </p>
          </div>
          <Button
            asChild
            className="min-h-11 shrink-0 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
          >
            {inDispute ? (
              <Link
                to="/dash2/operacao/minhas-licitacoes/$licitacaoId/disputa"
                params={{ licitacaoId }}
              >
                Acompanhar disputa
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <Link
                to="/dash2/operacao/minhas-licitacoes/$licitacaoId/proposta"
                params={{ licitacaoId }}
              >
                {proposalStarted ? "Editar proposta" : "Preparar proposta"}
                <ArrowRight className="size-4" />
              </Link>
            )}
          </Button>
        </header>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.8fr)]">
          <div className="space-y-5">
            <Panel className="p-4 sm:p-5">
              <h2 className="text-[15px] font-extrabold text-ink">Resumo da participação</h2>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-text">
                {opportunity.description}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Datum label="Valor estimado" value={opportunity.estimatedValue} />
                <Datum label="Plataforma" value={opportunity.platform} />
                <Datum label="Itens" value={String(opportunity.items.length)} />
              </div>
            </Panel>

            <Panel className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-extrabold text-ink">
                  Pendências antes da proposta
                </h2>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-extrabold text-amber-700">
                  1 atenção
                </span>
              </div>
              <div className="mt-4 divide-y divide-hairline">
                <CheckRow
                  done
                  label="Dados da empresa revisados"
                  detail="CNPJ e representante responsáveis pela proposta."
                />
                <CheckRow
                  done={Boolean(record.note)}
                  label="Anotação de análise"
                  detail={record.note ?? "Registre orientações para a equipe antes de avançar."}
                />
                <CheckRow
                  label="Revisar requisitos técnicos"
                  detail="Confirmar a garantia e os quantitativos do edital."
                />
              </div>
            </Panel>
          </div>

          <aside className="space-y-5">
            <Panel className="p-4 sm:p-5">
              <div className="flex items-center gap-2 text-ink">
                <CalendarDays className="size-4 text-brand-strong" />
                <h2 className="text-[14px] font-extrabold">Próximo prazo</h2>
              </div>
              <p className="mt-4 text-[22px] font-extrabold tracking-[-0.025em] text-ink">
                {opportunity.openingDate}
              </p>
              <p className="mt-1 text-[12px] text-slate-text">
                {opportunity.openingTime
                  ? `Disputa às ${opportunity.openingTime}`
                  : "Horário a confirmar"}
              </p>
            </Panel>
            <Panel className="p-4 sm:p-5">
              <div className="flex items-center gap-2 text-ink">
                <UserRound className="size-4 text-brand-strong" />
                <h2 className="text-[14px] font-extrabold">Responsável</h2>
              </div>
              <p className="mt-3 text-[13px] font-bold text-ink">Você</p>
              <p className="mt-1 text-[12px] text-slate-text">Preparação e revisão da proposta</p>
            </Panel>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function ProposalEditorPage({ licitacaoId }: { licitacaoId: string }) {
  const { opportunity, record, isAvailable, saveProposal, sendProposal } =
    useParticipation(licitacaoId);
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [form, setForm] = useState(() => ({
    companyName: record?.proposal?.companyName ?? "Sua empresa",
    validityDays: record?.proposal?.validityDays ?? "60",
    deliveryTerms: record?.proposal?.deliveryTerms ?? "30 dias após a ordem de fornecimento",
    totalValue: record?.proposal?.totalValue ?? opportunity?.estimatedValue ?? "",
    declarationAccepted: record?.proposal?.declarationAccepted ?? false,
  }));

  useEffect(() => {
    if (!isAvailable || !opportunity || saved || record?.stage === "dispute") return;
    const timer = window.setTimeout(() => saveProposal(licitacaoId, form), 550);
    return () => window.clearTimeout(timer);
  }, [form, isAvailable, licitacaoId, opportunity, record?.stage, saveProposal, saved]);

  if (!opportunity || !record || !isAvailable) return <NotFoundParticipation />;

  const canContinue =
    step === 0
      ? Boolean(form.companyName && form.validityDays && form.deliveryTerms)
      : step === 2
        ? form.declarationAccepted
        : true;
  const isReview = step === proposalSteps.length - 1;
  const isSent = record.stage === "dispute";

  function updateField<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function saveAndMove() {
    saveProposal(licitacaoId, form, true);
    setSaved(true);
  }

  function confirmSend() {
    sendProposal(licitacaoId);
    setSendOpen(false);
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="mx-auto w-full max-w-5xl space-y-5 sm:space-y-6">
        <Link
          to="/dash2/operacao/minhas-licitacoes/$licitacaoId"
          params={{ licitacaoId }}
          className="inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-[12px] font-bold text-slate-text hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          <ArrowLeft className="size-4" />
          Detalhes da participação
        </Link>
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] font-bold text-brand-strong">Proposta</p>
            <h1 className="mt-1 text-[24px] font-extrabold tracking-[-0.02em] text-ink sm:text-[28px]">
              Preparar proposta
            </h1>
            <p className="mt-2 text-[13px] text-slate-text">{opportunity.title}</p>
          </div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-text">
            <Save className="size-4 text-brand-strong" />
            {saved ? "Proposta salva" : "Rascunho salvo automaticamente"}
          </p>
        </header>
        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav aria-label="Etapas da proposta" className="lg:sticky lg:top-5 lg:self-start">
            <ol className="flex gap-2 overflow-x-auto lg:flex-col">
              {proposalSteps.map((label, index) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => setStep(index)}
                    className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-left text-[12px] font-bold transition-colors ${index === step ? "bg-brand-tint text-brand-strong" : index < step ? "text-brand-strong hover:bg-white" : "text-slate-text hover:bg-white"}`}
                  >
                    <span
                      className={`grid size-6 place-items-center rounded-full text-[10px] ${index === step ? "bg-[#18B849] text-white" : index < step ? "bg-[#dff7e7] text-brand-strong" : "bg-slate-100 text-slate-text"}`}
                    >
                      {index < step ? <CheckCircle2 className="size-3.5" /> : index + 1}
                    </span>
                    {label}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <Panel className="overflow-hidden p-0">
            <div className="p-5 sm:p-6">
              <h2 className="text-[18px] font-extrabold text-ink">{proposalSteps[step]}</h2>
              <p className="mt-2 text-[13px] text-slate-text">
                {step === 0
                  ? "Defina as condições comerciais que acompanharão a proposta."
                  : step === 1
                    ? "Confira o valor de referência antes de encaminhar para revisão."
                    : step === 2
                      ? "Confirme as declarações necessárias para esta participação."
                      : "Revise o rascunho antes de movê-lo para propostas."}
              </p>
              <ProposalStep
                step={step}
                form={form}
                opportunity={opportunity}
                onChange={updateField}
              />
            </div>
            <footer className="flex items-center justify-between border-t border-hairline bg-slate-50/60 px-5 py-4 sm:px-6">
              <Button
                type="button"
                variant="ghost"
                disabled={step === 0}
                onClick={() => setStep((current) => current - 1)}
                className="min-h-11 rounded-xl text-[12px] font-bold text-slate-text"
              >
                Voltar
              </Button>
              {isReview && !isSent ? (
                <Button
                  type="button"
                  disabled={!form.declarationAccepted}
                  onClick={record.stage === "proposal" ? () => setSendOpen(true) : saveAndMove}
                  className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
                >
                  {record.stage === "proposal" ? "Enviar proposta" : "Salvar proposta"}
                  {record.stage === "proposal" ? (
                    <ArrowRight className="size-4" />
                  ) : (
                    <Save className="size-4" />
                  )}
                </Button>
              ) : !isReview ? (
                <Button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep((current) => current + 1)}
                  className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
                >
                  Continuar
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <span />
              )}
            </footer>
          </Panel>
        </div>
        {saved && !isSent ? (
          <Panel className="flex flex-col gap-3 border-[#18B849]/25 bg-brand-tint/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-[14px] font-extrabold text-ink">
                Proposta salva e movida para Propostas.
              </p>
              <p className="mt-1 text-[12px] text-slate-text">
                Continue a revisão ou acompanhe o estágio da operação.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="min-h-11 shrink-0 rounded-xl border-[#18B849]/35 text-[12px] font-bold text-brand-strong"
            >
              <Link to="/dash2/operacao/minhas-licitacoes">Ver propostas</Link>
            </Button>
          </Panel>
        ) : null}
        {isSent ? (
          <Panel className="flex flex-col gap-3 border-[#18B849]/25 bg-brand-tint/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-[14px] font-extrabold text-ink">Proposta enviada com sucesso.</p>
              <p className="mt-1 text-[12px] text-slate-text">
                Comprovante {record.submission?.receipt ?? "em processamento"}. Acompanhe os
                próximos movimentos da sessão.
              </p>
            </div>
            <Button
              asChild
              className="min-h-11 shrink-0 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
            >
              <Link
                to="/dash2/operacao/minhas-licitacoes/$licitacaoId/disputa"
                params={{ licitacaoId }}
              >
                Ir para disputa
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Panel>
        ) : null}
      </div>
      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent className="rounded-2xl border-hairline p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-[19px] font-extrabold text-ink">
              Confirmar envio da proposta
            </DialogTitle>
            <DialogDescription className="text-[13px] leading-relaxed text-slate-text">
              Depois do envio, a proposta seguirá para a sessão de disputa e ficará registrada na
              sua operação.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-hairline bg-slate-50/60 p-4 text-[13px]">
            <p className="font-extrabold text-ink">{opportunity.title}</p>
            <p className="mt-2 text-slate-text">
              Valor total: <span className="font-bold text-ink">{form.totalValue}</span>
            </p>
            <p className="mt-1 text-slate-text">
              Validade: <span className="font-bold text-ink">{form.validityDays} dias</span>
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSendOpen(false)}
              className="min-h-11 rounded-xl text-[12px] font-bold"
            >
              Revisar novamente
            </Button>
            <Button
              type="button"
              onClick={confirmSend}
              className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
            >
              Enviar proposta
              <ArrowRight className="size-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function DisputeSessionPage({ licitacaoId }: { licitacaoId: string }) {
  const { opportunity, record, isAvailable } = useParticipation(licitacaoId);
  if (!opportunity || !record || !isAvailable || record.stage !== "dispute") {
    return <NotFoundParticipation />;
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="mx-auto w-full max-w-5xl space-y-5 sm:space-y-6">
        <Link
          to="/dash2/operacao/minhas-licitacoes"
          className="inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-[12px] font-bold text-slate-text hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          <ArrowLeft className="size-4" />
          Minhas licitações
        </Link>
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[12px] font-bold text-brand-strong">Sessão de disputa</p>
            <h1 className="mt-1 text-[24px] font-extrabold tracking-[-0.02em] text-ink sm:text-[28px]">
              Em disputa
            </h1>
            <p className="mt-2 text-[13px] text-slate-text">{opportunity.title}</p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-brand-tint px-3 py-1.5 text-[11px] font-extrabold text-brand-strong">
            Proposta enviada
          </span>
        </header>
        <div className="grid gap-5 lg:grid-cols-3">
          <Panel className="p-4 sm:p-5">
            <CalendarDays className="size-5 text-brand-strong" />
            <p className="mt-4 text-[12px] font-bold text-slate-text">Início da sessão</p>
            <p className="mt-1 text-[17px] font-extrabold text-ink">{opportunity.openingDate}</p>
            <p className="mt-1 text-[12px] text-slate-text">
              {opportunity.openingTime ? `às ${opportunity.openingTime}` : "Horário a confirmar"}
            </p>
          </Panel>
          <Panel className="p-4 sm:p-5">
            <UserRound className="size-5 text-brand-strong" />
            <p className="mt-4 text-[12px] font-bold text-slate-text">Posição atual</p>
            <p className="mt-1 text-[17px] font-extrabold text-ink">Aguardando abertura</p>
            <p className="mt-1 text-[12px] text-slate-text">
              A classificação será exibida assim que o portal iniciar a sessão.
            </p>
          </Panel>
          <Panel className="p-4 sm:p-5">
            <SparkleMark />
            <p className="mt-4 text-[12px] font-bold text-slate-text">Estratégia</p>
            <p className="mt-1 text-[17px] font-extrabold text-ink">Acompanhamento assistido</p>
            <p className="mt-1 text-[12px] text-slate-text">
              Você define cada próximo lance com apoio da operação.
            </p>
          </Panel>
        </div>
        <Panel className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-brand-strong" />
                <h2 className="text-[15px] font-extrabold text-ink">Próxima ação</h2>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-text">
                Acesse o portal no horário da sessão para acompanhar a abertura e registrar seus
                lances.
              </p>
              <p className="mt-2 text-[12px] font-bold text-slate-text">
                Comprovante de envio:{" "}
                <span className="text-ink">{record.submission?.receipt ?? "em processamento"}</span>
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="min-h-11 shrink-0 rounded-xl border-hairline text-[12px] font-bold"
            >
              <Link to="/dash2/operacao/minhas-licitacoes/$licitacaoId" params={{ licitacaoId }}>
                Ver participação <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function SparkleMark() {
  return (
    <span className="grid size-5 place-items-center rounded-md bg-brand-tint text-[12px] font-extrabold text-brand-strong">
      ✦
    </span>
  );
}

function ProposalStep({
  step,
  form,
  opportunity,
  onChange,
}: {
  step: number;
  form: {
    companyName: string;
    validityDays: string;
    deliveryTerms: string;
    totalValue: string;
    declarationAccepted: boolean;
  };
  opportunity: (typeof newOpportunities)[number];
  onChange: <
    Key extends keyof {
      companyName: string;
      validityDays: string;
      deliveryTerms: string;
      totalValue: string;
      declarationAccepted: boolean;
    },
  >(
    key: Key,
    value: {
      companyName: string;
      validityDays: string;
      deliveryTerms: string;
      totalValue: string;
      declarationAccepted: boolean;
    }[Key],
  ) => void;
}) {
  if (step === 0)
    return (
      <div className="mt-6 grid gap-4">
        <Field label="Empresa proponente">
          <Input
            value={form.companyName}
            onChange={(event) => onChange("companyName", event.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Validade da proposta">
            <Input
              inputMode="numeric"
              value={form.validityDays}
              onChange={(event) => onChange("validityDays", event.target.value)}
            />
          </Field>
          <Field label="Prazo de entrega">
            <Input
              value={form.deliveryTerms}
              onChange={(event) => onChange("deliveryTerms", event.target.value)}
            />
          </Field>
        </div>
      </div>
    );
  if (step === 1)
    return (
      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-hairline bg-slate-50/60 p-4">
          <p className="text-[12px] font-bold text-ink">{opportunity.items[0]}</p>
          <p className="mt-2 text-[11px] text-slate-text">
            Os demais itens serão discriminados na versão de envio ao portal.
          </p>
        </div>
        <Field label="Valor total da proposta">
          <Input
            value={form.totalValue}
            onChange={(event) => onChange("totalValue", event.target.value)}
          />
        </Field>
      </div>
    );
  if (step === 2)
    return (
      <label className="mt-6 flex min-h-20 cursor-pointer items-start gap-3 rounded-xl border border-hairline bg-slate-50/60 p-4">
        <Checkbox
          checked={form.declarationAccepted}
          onCheckedChange={(checked) => onChange("declarationAccepted", checked === true)}
        />
        <span>
          <span className="block text-[13px] font-bold text-ink">
            Confirmo as declarações necessárias
          </span>
          <span className="mt-1 block text-[12px] leading-relaxed text-slate-text">
            A empresa atende às condições comerciais e técnicas registradas neste rascunho.
          </span>
        </span>
      </label>
    );
  return (
    <div className="mt-6 divide-y divide-hairline rounded-xl border border-hairline">
      <ReviewRow label="Empresa" value={form.companyName} />
      <ReviewRow label="Validade" value={`${form.validityDays} dias`} />
      <ReviewRow label="Entrega" value={form.deliveryTerms} />
      <ReviewRow label="Valor total" value={form.totalValue} />
      <ReviewRow
        label="Declarações"
        value={form.declarationAccepted ? "Confirmadas" : "Pendente"}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-[12px] font-bold text-ink">{label}</span>
      {children}
    </label>
  );
}
function Datum({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-text">{label}</p>
      <p className="mt-1 text-[13px] font-extrabold text-ink">{value}</p>
    </div>
  );
}
function CheckRow({
  done = false,
  label,
  detail,
}: {
  done?: boolean;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex gap-3 py-3 first:pt-0 last:pb-0">
      <span
        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${done ? "bg-brand-tint text-brand-strong" : "bg-amber-50 text-amber-700"}`}
      >
        {done ? <CheckCircle2 className="size-3.5" /> : <CircleAlert className="size-3.5" />}
      </span>
      <span>
        <span className="block text-[13px] font-bold text-ink">{label}</span>
        <span className="mt-0.5 block text-[12px] leading-relaxed text-slate-text">{detail}</span>
      </span>
    </div>
  );
}
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-[12px] font-bold text-slate-text">{label}</span>
      <span className="text-right text-[12px] font-bold text-ink">{value}</span>
    </div>
  );
}
