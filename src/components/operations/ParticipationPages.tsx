import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Clock3,
  FileCheck2,
  FileText,
  History,
  MapPin,
  PackageCheck,
  Save,
  ShieldAlert,
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { newOpportunities, type NewOpportunity } from "@/lib/new-opportunities-fixtures";
import { disputes, getLiveDisputeItems } from "@/lib/bid-bot-fixtures";
import { useOpportunityTriage } from "@/hooks/use-opportunity-triage";
import { AnnotationThread } from "@/components/annotations/AnnotationThread";
import { OfficialTenderCommunications } from "@/components/communications/OfficialTenderCommunications";

const proposalSteps = ["Dados gerais", "Itens e valores", "Declarações", "Revisão"];

function useParticipation(licitacaoId: string) {
  const { triage, saveProposal, sendProposal } = useOpportunityTriage();
  const opportunity = useMemo((): NewOpportunity | undefined => {
    const savedOpportunity = newOpportunities.find((item) => item.id === licitacaoId);
    if (savedOpportunity) return savedOpportunity;

    const botDispute = disputes.find((item) => item.id === licitacaoId);
    if (!botDispute) return undefined;

    const stateMatch = botDispute.agency.match(
      /\b(AC|AL|AM|AP|BA|CE|DF|ES|GO|MA|MG|MS|MT|PA|PB|PE|PI|PR|RJ|RN|RO|RR|RS|SC|SE|SP|TO)\b/,
    );
    return {
      id: botDispute.id,
      title: `${botDispute.notice} — ${botDispute.object}`,
      agency: botDispute.agency,
      openingDate: botDispute.date,
      estimatedValue: botDispute.estimatedValue,
      platform: "ComprasNet",
      state: stateMatch?.[1] ?? "—",
      category: "Tecnologia",
      description: botDispute.object,
      items: getLiveDisputeItems(botDispute.id).map((item) => item.description),
      matchScore: 84,
      isDemo: true,
    };
  }, [licitacaoId]);
  const botDispute = disputes.find((item) => item.id === licitacaoId);
  const record =
    triage[licitacaoId] ??
    (botDispute
      ? {
          decision: "interested" as const,
          stage: botDispute.status === "Ativa" ? "dispute" : ("analysis" as const),
          decidedAt: "2026-08-21T09:00:00.000Z",
        }
      : undefined);
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

export function ParticipationDetailsPage({
  licitacaoId,
  initialTab,
}: {
  licitacaoId: string;
  initialTab?: string;
}) {
  const { opportunity, record, isAvailable } = useParticipation(licitacaoId);
  const [tab, setTab] = useState(initialTab ?? "visao-geral");
  if (!opportunity || !record || !isAvailable) return <NotFoundParticipation />;

  const proposalStarted = record.stage === "proposal";
  const inDispute = record.stage === "dispute";
  const portalIdentifier =
    opportunity.platform === "ComprasNet" ? "UASG 986477" : "Processo do portal";
  const stageLabel = inDispute
    ? "Em disputa"
    : proposalStarted
      ? "Proposta em preparação"
      : "Em análise";

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
                {stageLabel}
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
              {opportunity.agency} · {opportunity.state} · {portalIdentifier}
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

        <Panel className="overflow-hidden p-0">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-hairline bg-white p-2">
              <ParticipationTab value="visao-geral" label="Visão geral" />
              <ParticipationTab value="edital" label="Edital e documentos" />
              <ParticipationTab value="itens" label="Itens" />
              <ParticipationTab value="proposta" label="Proposta" />
              <ParticipationTab value="comunicacoes" label="Comunicações" />
              <ParticipationTab value="anotacoes" label="Anotações" />
              <ParticipationTab value="historico" label="Histórico" />
            </TabsList>

            <TabsContent value="visao-geral" className="m-0 p-4 sm:p-5">
              <ParticipationOverview
                opportunity={opportunity}
                note={record.note}
                stageLabel={stageLabel}
              />
            </TabsContent>
            <TabsContent value="edital" className="m-0 p-4 sm:p-5">
              <ParticipationDocuments opportunity={opportunity} />
            </TabsContent>
            <TabsContent value="itens" className="m-0 p-4 sm:p-5">
              <ParticipationItems items={opportunity.items} />
            </TabsContent>
            <TabsContent value="proposta" className="m-0 p-4 sm:p-5">
              <ParticipationProposal
                proposal={record.proposal}
                receipt={record.submission?.receipt}
                licitacaoId={licitacaoId}
              />
            </TabsContent>
            <TabsContent value="comunicacoes" className="m-0 p-4 sm:p-5">
              <ParticipationCommunications tenderId={licitacaoId} portal={opportunity.platform} />
            </TabsContent>
            <TabsContent value="anotacoes" className="m-0 p-4 sm:p-5">
              <AnnotationThread
                tenderId={licitacaoId}
                tenderTitle={opportunity.title}
                legacyNote={record.note}
                context={{ type: "tender", label: stageLabel }}
              />
            </TabsContent>
            <TabsContent value="historico" className="m-0 p-4 sm:p-5">
              <ParticipationHistory stageLabel={stageLabel} openingDate={opportunity.openingDate} />
            </TabsContent>
          </Tabs>
        </Panel>
      </div>
    </div>
  );
}

function ParticipationTab({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger value={value} className="min-h-10 shrink-0 px-3 text-[12px] font-bold">
      {label}
    </TabsTrigger>
  );
}

function ParticipationOverview({
  opportunity,
  note,
  stageLabel,
}: {
  opportunity: NonNullable<ReturnType<typeof useParticipation>["opportunity"]>;
  note?: string | undefined;
  stageLabel: string;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.8fr)]">
      <div className="space-y-5">
        <div>
          <p className="text-[12px] font-bold text-brand-strong">Visão geral</p>
          <h2 className="mt-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
            Contexto e próximos passos
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-text">
            {opportunity.description}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Datum label="Valor estimado" value={opportunity.estimatedValue} />
          <Datum label="Plataforma" value={opportunity.platform} />
          <Datum label="Itens" value={String(opportunity.items.length)} />
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-700" />
            <div>
              <p className="text-[13px] font-bold text-ink">Pendência que exige revisão</p>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                Confirme os requisitos técnicos e a validade da certidão estadual antes de enviar a
                proposta.
              </p>
            </div>
          </div>
        </div>
      </div>
      <aside className="space-y-4">
        <Datum label="Etapa atual" value={stageLabel} />
        <Datum label="Próximo prazo" value={opportunity.openingDate} />
        <Datum label="Responsável" value="Você · preparação e revisão" />
        <div className="rounded-xl border border-hairline bg-slate-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-slate-text">
            Última anotação
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-ink">
            {note ?? "Nenhuma orientação interna registrada."}
          </p>
        </div>
      </aside>
    </div>
  );
}

function ParticipationDocuments({ opportunity }: { opportunity: { platform: string } }) {
  const groups = [
    {
      title: "Edital e anexos do órgão",
      icon: FileText,
      description: "Edital, termo de referência e anexos publicados no portal.",
      count: "4 arquivos",
    },
    {
      title: "Documentos da empresa",
      icon: FileCheck2,
      description: "Certidões e comprovações vinculadas à habilitação.",
      count: "3 vinculados",
    },
    {
      title: "Anexos da proposta",
      icon: ClipboardList,
      description: "Arquivos que serão enviados ou já foram enviados na proposta.",
      count: "0 anexos",
    },
  ];
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[12px] font-bold text-brand-strong">Documentação</p>
        <h2 className="mt-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
          Documentos com origem identificada
        </h2>
        <p className="mt-2 text-[13px] text-slate-text">
          Os arquivos do órgão, da empresa e da proposta ficam separados para evitar uso indevido.
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {groups.map(({ title, icon: Icon, description, count }) => (
          <div key={title} className="rounded-2xl border border-hairline bg-white p-4 shadow-sm">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-tint text-brand-strong">
              <Icon className="size-4" />
            </span>
            <h3 className="mt-4 text-[13px] font-bold text-ink">{title}</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-text">{description}</p>
            <p className="mt-4 text-[12px] font-bold text-brand-strong">{count}</p>
          </div>
        ))}
      </div>
      <p className="rounded-xl border border-dashed border-hairline bg-slate-50 p-3 text-[12px] text-slate-text">
        Origem demonstrativa: {opportunity.platform}. A sincronização de anexos reais será conectada
        pelo backend.
      </p>
    </div>
  );
}

function ParticipationItems({ items }: { items: string[] }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[12px] font-bold text-brand-strong">Itens e lotes</p>
        <h2 className="mt-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
          Escopo da participação
        </h2>
        <p className="mt-2 text-[13px] text-slate-text">
          Confirme o que será cotado antes de compor a proposta.
        </p>
      </div>
      <div className="divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline">
        {items.map((item, index) => (
          <div
            key={item}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-tint text-[12px] font-bold text-brand-strong">
                {index + 1}
              </span>
              <p className="text-[13px] font-semibold leading-relaxed text-ink">{item}</p>
            </div>
            <span className="inline-flex w-fit shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
              <PackageCheck className="size-3" />
              Participando
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParticipationProposal({
  proposal,
  receipt,
  licitacaoId,
}: {
  proposal?:
    | { companyName: string; totalValue: string; validityDays: string; updatedAt: string }
    | undefined;
  receipt?: string | undefined;
  licitacaoId: string;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-bold text-brand-strong">Proposta</p>
          <h2 className="mt-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
            Registro consultável da proposta
          </h2>
          <p className="mt-2 text-[13px] text-slate-text">
            A edição acontece em um fluxo próprio; aqui fica o registro para consulta.
          </p>
        </div>
        <Button asChild variant="outline" className="min-h-11 rounded-xl text-[12px] font-bold">
          <Link
            to="/dash2/operacao/minhas-licitacoes/$licitacaoId/proposta"
            params={{ licitacaoId }}
          >
            Abrir proposta
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Datum label="Empresa" value={proposal?.companyName ?? "Rascunho não iniciado"} />
        <Datum label="Valor informado" value={proposal?.totalValue ?? "A compor"} />
        <Datum label="Validade" value={proposal ? `${proposal.validityDays} dias` : "A definir"} />
      </div>
      <div className="rounded-xl border border-hairline bg-slate-50 p-4 text-[12px] text-slate-text">
        {receipt
          ? `Proposta enviada. Comprovante: ${receipt}.`
          : "Nenhuma proposta enviada ao portal nesta demonstração."}
      </div>
    </div>
  );
}

function ParticipationCommunications({ tenderId, portal }: { tenderId: string; portal: string }) {
  return (
    <OfficialTenderCommunications tenderId={tenderId} portal={portal} />
  );
}

function ParticipationHistory({
  stageLabel,
  openingDate,
}: {
  stageLabel: string;
  openingDate: string;
}) {
  const entries = [
    ["Oportunidade adicionada à operação", "Aderência e contexto registrados."],
    ["Análise iniciada", "Responsável definido para a participação."],
    [stageLabel, `Próximo marco previsto para ${openingDate}.`],
  ];
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[12px] font-bold text-brand-strong">Rastreabilidade</p>
        <h2 className="mt-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
          Histórico da participação
        </h2>
        <p className="mt-2 text-[13px] text-slate-text">
          Eventos que explicam como a oportunidade avançou dentro da sua operação.
        </p>
      </div>
      <ol className="space-y-0">
        {entries.map(([title, detail], index) => (
          <li
            key={title}
            className="relative flex gap-3 border-l border-hairline pb-5 pl-5 last:pb-0"
          >
            <span className="absolute -left-2 top-0 grid size-4 place-items-center rounded-full bg-brand-tint text-brand-strong">
              <History className="size-2.5" />
            </span>
            <div>
              <p className="text-[13px] font-bold text-ink">{title}</p>
              <p className="mt-1 text-[12px] text-slate-text">{detail}</p>
              <p className="mt-1 text-[11px] text-slate-text">
                Evento {index + 1} · dados demonstrativos
              </p>
            </div>
          </li>
        ))}
      </ol>
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
