import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Download,
  FileSearch,
  FileText,
  Gauge,
  GitCompareArrows,
  Landmark,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { InternalPageState, InternalStatusNotice } from "@/components/dash2/InternalPageState";
import { PageContextHeader } from "@/components/dash2/PageContextHeader";
import { PageHowItWorks } from "@/components/dash2/PageHowItWorks";
import { Panel, PanelHeader } from "@/components/dash2/Panel";
import { useResizableColumns } from "@/components/dash2/ResizableColumns";
import { ResourceListGridHeader } from "@/components/dash2/ResourceList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAnnotations } from "@/hooks/use-annotations";

type MetricProps = {
  label: string;
  value: string;
  detail: string;
  icon: typeof Gauge;
  tone?: "green" | "blue" | "amber";
};

function Metric({ label, value, detail, icon: Icon, tone = "green" }: MetricProps) {
  const tones = {
    green: "bg-brand-tint text-brand-strong",
    blue: "bg-[#EEF4FF] text-[#3269D8]",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <Panel className="p-4 sm:p-5">
      <span className={cn("grid size-9 place-items-center rounded-xl", tones[tone])}>
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <p className="mt-3 text-[11px] font-bold text-slate-text">{label}</p>
      <p className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-ink">{value}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-text">{detail}</p>
    </Panel>
  );
}

function Evidence({
  title,
  detail,
  tone = "neutral",
}: {
  title: string;
  detail: string;
  tone?: "neutral" | "warning" | "good";
}) {
  const tones = {
    neutral: "border-hairline bg-white text-slate-text",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    good: "border-[#BDEEC9] bg-[#F2FCF5] text-[#176C36]",
  };
  return (
    <div className={cn("rounded-xl border p-3", tones[tone])}>
      <p className="text-[12px] font-extrabold text-ink">{title}</p>
      <p className="mt-1 text-[11px] leading-relaxed">{detail}</p>
    </div>
  );
}

const tenders = [
  {
    id: "845",
    label: "Pregão 845/2026 · Prefeitura Municipal de Guarulhos",
    title: "Aquisição de computadores, monitores e periféricos",
    agency: "Prefeitura Municipal de Guarulhos — SP",
    deadline: "22 ago 2026 · 17h",
    value: "R$ 42.496,67",
  },
  {
    id: "310",
    label: "Pregão 310/2026 · ESP-Centro de Energia Nuclear",
    title: "Ata para aquisição de insumos laboratoriais",
    agency: "ESP-Centro de Energia Nuclear na Agricultura",
    deadline: "24 ago 2026 · 14h",
    value: "R$ 8.045,45",
  },
];

export function TenderXrayPage() {
  const [tenderId, setTenderId] = useState(tenders[0]!.id);
  const [tab, setTab] = useState("resumo");
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const [pipelineStage, setPipelineStage] = useState("Em análise");
  const [responsible, setResponsible] = useState("Jussefer");
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [pipelineNote, setPipelineNote] = useState("");
  const { addAnnotation } = useAnnotations();
  const tender = tenders.find((item) => item.id === tenderId) ?? tenders[0]!;

  const toggleAction = (action: string) => {
    setCompletedActions((current) =>
      current.includes(action) ? current.filter((item) => item !== action) : [...current, action],
    );
  };

  const addToPipeline = () => {
    if (pipelineNote.trim()) {
      addAnnotation({
        tenderId: tender.id,
        tenderTitle: tender.title,
        content: pipelineNote,
        context: { type: "xray", label: "Raio-X" },
      });
    }
    setPipelineNote("");
    setPipelineOpen(false);
    toast.success("Licitação adicionada ao pipeline", {
      description: `${tender.title} foi encaminhada para ${pipelineStage.toLowerCase()}.`,
    });
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageContextHeader
        context="intelligence"
        contextLabel="RAIO-X"
        title="Raio-X do edital"
        description="Transforme exigências, prazos e riscos do edital em uma decisão rastreável para a equipe."
        actions={
          <Button
            type="button"
            onClick={() => setPipelineOpen(true)}
            className="min-h-11 bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
          >
            <Plus className="size-4" /> Adicionar ao pipeline
          </Button>
        }
      />

      <Panel className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-tint text-brand-strong">
              <FileSearch className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                Fonte da análise
              </p>
              <p className="mt-1 text-[15px] font-extrabold text-ink">
                Escolha uma licitação para investigar
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-text">
                A análise mantém vínculo com o edital e identifica a origem de cada evidência.
              </p>
            </div>
          </div>
          <label className="grid min-w-0 gap-1.5 text-[12px] font-bold text-ink lg:w-[480px]">
            Licitação selecionada
            <select
              value={tenderId}
              onChange={(event) => setTenderId(event.target.value)}
              className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[12px] font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#29C454]"
            >
              {tenders.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Panel>

      <Panel className="overflow-hidden border-[#BDEEC9]">
        <div className="grid gap-5 p-4 sm:p-5 lg:p-6 xl:grid-cols-[minmax(0,1fr)_310px] xl:items-center">
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
              {tender.agency}
            </p>
            <h2 className="mt-2 max-w-4xl text-[22px] font-extrabold tracking-[-0.03em] text-ink sm:text-[26px]">
              {tender.title}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-text">
              <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-page px-3">
                <CalendarClock className="size-3.5 text-brand-strong" /> Propostas até{" "}
                {tender.deadline}
              </span>
              <span className="inline-flex min-h-8 items-center rounded-full bg-page px-3">
                Valor estimado {tender.value}
              </span>
              <span className="inline-flex min-h-8 items-center rounded-full bg-[#EEF4FF] px-3 text-[#2455B6]">
                Pregão eletrônico
              </span>
              <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-page px-3">
                <FileSearch className="size-3.5 text-brand-strong" /> Atualizado há 8 min
              </span>
            </div>
          </div>
          <div className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-2xl border border-[#BDEEC9] bg-[#F2FCF5] p-4">
            <span className="grid size-[76px] place-items-center rounded-full border-[7px] border-[#18B849] bg-white text-center text-[24px] font-extrabold tracking-[-0.04em] text-ink">
              84<span className="text-[11px] text-brand-strong">%</span>
            </span>
            <div>
              <p className="text-[16px] font-extrabold text-ink">Boa aderência</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-text">
                O objeto é compatível com termos e categorias acompanhadas pela operação.
              </p>
              <p className="mt-2 text-[11px] font-extrabold text-brand-strong">
                4 dias úteis para decidir
              </p>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
        <Metric
          label="Aderência"
          value="84%"
          detail="Objeto alinhado aos termos acompanhados."
          icon={Target}
        />
        <Metric
          label="Exigências críticas"
          value="3"
          detail="Uma pendência pode bloquear o envio."
          icon={ShieldAlert}
          tone="amber"
        />
        <Metric
          label="Prazo útil"
          value="4 dias"
          detail="Janela para validar documentos e preço."
          icon={CalendarClock}
          tone="blue"
        />
        <Metric
          label="Evidências"
          value="18"
          detail="Trechos do edital e anexos vinculados."
          icon={FileSearch}
        />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-xl border border-hairline bg-white p-1 sm:grid-cols-5">
          {(
            [
              ["resumo", "Resumo"],
              ["requisitos", "Requisitos"],
              ["itens", "Itens e lotes"],
              ["prazos", "Prazos"],
              ["riscos", "Riscos e evidências"],
            ] as Array<[string, string]>
          ).map(([value, label]) => (
            <TabsTrigger key={value} value={value} className="min-h-10 px-3 text-[12px] font-bold">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="resumo">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
            <Panel className="p-4 sm:p-5">
              <PanelHeader
                icon={<Sparkles className="size-4" />}
                title="Recomendação operacional"
                subtitle="A decisão é assistida, mas cada ponto continua verificável antes de enviar a proposta."
              />
              <div className="mt-4 grid gap-4 rounded-2xl border border-[#BDEEC9] bg-[#F2FCF5] p-4 sm:grid-cols-[minmax(0,1fr)_150px] sm:p-5">
                <div>
                  <p className="text-[16px] font-extrabold text-ink">
                    Avançar para composição de proposta
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                    O objeto está alinhado à operação. Antes do envio, confirme a validade da
                    certidão estadual.
                  </p>
                </div>
                <div className="rounded-xl bg-white/80 p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                    Confiança
                  </p>
                  <p className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-ink">
                    84/100
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#DFF6E6]">
                    <span className="block h-full w-[84%] rounded-full bg-[#18B849]" />
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  [
                    "Objeto compatível",
                    "Monitor, SSD e computador aparecem entre os termos acompanhados.",
                    "good",
                  ],
                  ["Habilitação", "Certidão estadual vence antes do prazo de proposta.", "warning"],
                  [
                    "Competição esperada",
                    "Histórico do órgão mostra 6,4 fornecedores em processos similares.",
                    "neutral",
                  ],
                  [
                    "Comprovação",
                    "18 trechos extraídos de edital, termo de referência e anexos.",
                    "neutral",
                  ],
                ].map(([title, detail, tone]) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setTab(title === "Habilitação" ? "requisitos" : "riscos")}
                    className="text-left focus-visible:outline-2 focus-visible:outline-[#29C454]"
                  >
                    <Evidence
                      title={title ?? ""}
                      detail={detail ?? ""}
                      tone={tone as "neutral" | "warning" | "good"}
                    />
                  </button>
                ))}
              </div>
            </Panel>
            <Panel className="p-4 sm:p-5">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                Plano de ação
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                Resolva a única pendência de alto impacto antes do envio.
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Confirmar certidão estadual",
                  "Definir responsável pela proposta",
                  "Comparar preço de referência",
                ].map((action, index) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => toggleAction(action)}
                    aria-pressed={completedActions.includes(action)}
                    className={cn(
                      "flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 text-left text-[12px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-[#29C454]",
                      completedActions.includes(action)
                        ? "border-[#BDEEC9] bg-[#F2FCF5] text-brand-strong"
                        : "border-hairline text-ink hover:bg-page",
                    )}
                  >
                    {completedActions.includes(action) ? (
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#18B849] text-white">
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                      </span>
                    ) : (
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-[10px] text-brand-strong">
                        {index + 1}
                      </span>
                    )}
                    {action}
                    <ChevronRight className="ml-auto size-4 text-slate-text" />
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-text" aria-live="polite">
                {completedActions.length} de 3 ações concluídas nesta análise.
              </p>
              <Link
                to="/documentos"
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-[12px] font-extrabold text-brand-strong focus-visible:outline-2 focus-visible:outline-[#29C454]"
              >
                Abrir documentos da operação <ArrowRight className="size-4" />
              </Link>
            </Panel>
          </div>
        </TabsContent>
        <TabsContent value="requisitos">
          <RequirementsPanel />
        </TabsContent>
        <TabsContent value="itens">
          <EvidenceList
            title="Itens e lotes"
            items={[
              'Item 1 · Computador com monitor 24" e SSD 512GB',
              "Garantia mínima de 36 meses",
              "Entrega em até 30 dias após emissão da ordem",
            ]}
          />
        </TabsContent>
        <TabsContent value="prazos">
          <EvidenceList
            title="Prazos do processo"
            items={[
              "20 ago · data limite para solicitar esclarecimentos",
              `22 ago · ${tender.deadline.split(" · ")[1] ?? "17h"} · encerramento das propostas`,
              "26 ago · sessão pública prevista",
            ]}
          />
        </TabsContent>
        <TabsContent value="riscos">
          <EvidenceList
            title="Riscos e evidências"
            warning
            items={[
              "Certidão estadual precisa ser renovada antes da apresentação",
              "Prazo de entrega é restrito e requer confirmação logística",
              "Cada ponto possui link para a seção original do edital",
            ]}
          />
        </TabsContent>
      </Tabs>

      <Panel className="overflow-hidden">
        <details className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[12px] font-extrabold text-ink marker:content-none sm:px-5">
            <span className="flex items-center gap-2">
              <CircleHelp className="size-4 text-brand-strong" aria-hidden="true" /> Como funciona o
              Raio-X
            </span>
            <ChevronRight
              className="size-4 text-slate-text transition-transform group-open:rotate-90"
              aria-hidden="true"
            />
          </summary>
          <div className="grid gap-3 border-t border-hairline p-4 sm:grid-cols-3 sm:p-5">
            <Evidence
              title="1. Selecione o edital"
              detail="Abra uma oportunidade relevante para a operação."
            />
            <Evidence
              title="2. Revise evidências"
              detail="Valide requisitos, itens, prazos e riscos no contexto de origem."
            />
            <Evidence
              title="3. Encaminhe a decisão"
              detail="Adicione ao pipeline e distribua as próximas ações para a equipe."
            />
          </div>
        </details>
      </Panel>

      <Dialog open={pipelineOpen} onOpenChange={setPipelineOpen}>
        <DialogContent className="w-[calc(100%_-_2rem)] max-w-xl rounded-2xl border-hairline bg-white p-5 sm:p-6">
          <DialogHeader>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
              Encaminhar oportunidade
            </p>
            <DialogTitle className="text-[20px] font-extrabold tracking-[-0.025em] text-ink">
              Adicionar ao pipeline
            </DialogTitle>
            <DialogDescription className="text-[12px] leading-relaxed text-slate-text">
              Escolha o próximo estágio e deixe a decisão visível para quem vai conduzir a proposta.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-[#BDEEC9] bg-[#F2FCF5] p-3">
            <p className="text-[12px] font-extrabold text-ink">{tender.title}</p>
            <p className="mt-1 text-[11px] text-slate-text">
              {tender.agency} · propostas até {tender.deadline}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="xray-stage" className="text-[12px] font-bold text-ink">
                Estágio inicial
              </Label>
              <select
                id="xray-stage"
                value={pipelineStage}
                onChange={(event) => setPipelineStage(event.target.value)}
                className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[12px] font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#29C454]"
              >
                <option>Em análise</option>
                <option>Preparar proposta</option>
                <option>Aguardar decisão</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="xray-owner" className="text-[12px] font-bold text-ink">
                Responsável
              </Label>
              <select
                id="xray-owner"
                value={responsible}
                onChange={(event) => setResponsible(event.target.value)}
                className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[12px] font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#29C454]"
              >
                <option>Jussefer</option>
                <option>Comercial</option>
                <option>Operações</option>
              </select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="xray-note" className="text-[12px] font-bold text-ink">
              Contexto para a equipe <span className="font-medium text-slate-text">(opcional)</span>
            </Label>
            <Textarea
              id="xray-note"
              value={pipelineNote}
              onChange={(event) => setPipelineNote(event.target.value)}
              placeholder="Ex.: validar certidão estadual antes de iniciar a composição."
              className="min-h-20 rounded-xl border-hairline text-[12px]"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPipelineOpen(false)}
              className="min-h-11"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={addToPipeline}
              className="min-h-11 bg-[#18B849] text-white hover:bg-[#139e3e]"
            >
              Adicionar ao pipeline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RequirementsPanel() {
  const requirements = [
    {
      title: "Regularidade fiscal estadual",
      detail: "Certidão estadual válida na data de abertura da proposta.",
      source: "Edital · item 8.2.3",
      deadline: "Validar até 20 ago",
      status: "Pendente",
      tone: "warning" as const,
    },
    {
      title: "Capacidade técnica compatível",
      detail: "Atestado para fornecimento de equipamentos de TI e suporte.",
      source: "Termo de referência · item 6.4",
      deadline: "Responsável: Comercial",
      status: "Em revisão",
      tone: "neutral" as const,
    },
    {
      title: "Composição da proposta",
      detail: "Preço, garantia mínima e prazo de entrega precisam estar consistentes.",
      source: "Edital · itens 4.1 e 9.3",
      deadline: "Antes do envio",
      status: "Pronto para iniciar",
      tone: "good" as const,
    },
  ];

  return (
    <Panel className="overflow-hidden">
      <PanelHeader
        icon={<ClipboardCheck className="size-4" />}
        title="Requisitos de habilitação"
        subtitle="Cada exigência mantém o vínculo com a fonte e o responsável pela confirmação."
        className="p-4 sm:p-5"
      />
      <div className="border-t border-hairline">
        <div className="hidden grid-cols-[minmax(0,1fr)_160px_150px_130px] gap-4 bg-page/45 px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-text xl:grid">
          <span>Exigência</span>
          <span>Origem</span>
          <span>Próxima decisão</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-hairline">
          {requirements.map((requirement) => (
            <button
              key={requirement.title}
              type="button"
              onClick={() =>
                toast.info("Origem da exigência", {
                  description: `${requirement.source} · ${requirement.detail}`,
                })
              }
              className="grid w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-page focus-visible:outline-2 focus-visible:outline-[#29C454] sm:px-5 xl:grid-cols-[minmax(0,1fr)_160px_150px_130px] xl:items-center xl:gap-4"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-extrabold text-ink">{requirement.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-text">
                  {requirement.detail}
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-text">
                {requirement.source}
              </span>
              <span className="text-[11px] font-bold text-ink">{requirement.deadline}</span>
              <span
                className={cn(
                  "w-fit rounded-full px-2.5 py-1 text-[10px] font-extrabold",
                  requirement.tone === "warning"
                    ? "bg-amber-50 text-amber-700"
                    : requirement.tone === "good"
                      ? "bg-[#E8F8ED] text-brand-strong"
                      : "bg-[#EEF4FF] text-[#2455B6]",
                )}
              >
                {requirement.status}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function EvidenceList({
  title,
  items,
  warning = false,
}: {
  title: string;
  items: string[];
  warning?: boolean;
}) {
  return (
    <Panel className="p-4 sm:p-5">
      <PanelHeader
        icon={warning ? <AlertTriangle className="size-4" /> : <FileText className="size-4" />}
        title={title}
        subtitle="Leitura estruturada do edital. Abra a origem para confirmar o contexto completo."
      />
      <div className="mt-4 divide-y divide-hairline">
        {items.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => toast.info("Evidência do edital", { description: item })}
            className="flex min-h-12 w-full items-center gap-3 py-3 text-left text-[12px] font-semibold text-ink hover:text-brand-strong focus-visible:outline-2 focus-visible:outline-[#29C454]"
          >
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-lg text-[10px] font-extrabold",
                warning ? "bg-amber-50 text-amber-700" : "bg-brand-tint text-brand-strong",
              )}
            >
              {index + 1}
            </span>
            <span className="min-w-0 flex-1">{item}</span>
            <span className="text-[10px] font-bold text-slate-text">Ver origem</span>
            <ChevronRight className="size-4 text-slate-text" />
          </button>
        ))}
      </div>
    </Panel>
  );
}

type AgencySignal = "Previsível" | "Atenção a prazos" | "Amostra limitada";

type Agency = {
  id: string;
  name: string;
  cnpj: string;
  municipality: string;
  uf: string;
  score: number;
  volume: string;
  processes: number;
  activity: string;
  signal: AgencySignal;
  profile: "ME/EPP" | "Demais";
  category: "Equipamentos de TI" | "Serviços de tecnologia" | "Manutenção predial";
  compatibility: string;
  competition: string;
  averageDeadline: string;
  behavior: string;
  detail: string;
};

const agencies: Agency[] = [
  {
    id: "guarulhos",
    name: "Prefeitura Municipal de Guarulhos",
    cnpj: "46.319.000/0001-50",
    municipality: "Guarulhos",
    uf: "SP",
    score: 82,
    volume: "R$ 28,4 mi",
    processes: 86,
    activity: "há 8 min",
    signal: "Previsível",
    profile: "Demais",
    category: "Equipamentos de TI",
    compatibility: "86% · TI e periféricos",
    competition: "6,4 fornecedores",
    averageDeadline: "12 dias",
    behavior: "Janelas estáveis após abertura",
    detail: "Boa recorrência, janela estável e perfil próximo às categorias da operação.",
  },
  {
    id: "energia",
    name: "ESP-Centro de Energia Nuclear na Agricultura",
    cnpj: "00.038.174/0001-43",
    municipality: "Piracicaba",
    uf: "SP",
    score: 74,
    volume: "R$ 9,1 mi",
    processes: 33,
    activity: "ontem",
    signal: "Atenção a prazos",
    profile: "ME/EPP",
    category: "Serviços de tecnologia",
    compatibility: "74% · software e suporte",
    competition: "4,1 fornecedores",
    averageDeadline: "7 dias",
    behavior: "Mudanças próximas ao prazo final",
    detail: "Volume compatível, com janela de resposta mais sensível que a média.",
  },
  {
    id: "vitoria",
    name: "Vitória Câmara Municipal",
    cnpj: "27.538.900/0001-12",
    municipality: "Vitória",
    uf: "ES",
    score: 67,
    volume: "R$ 4,8 mi",
    processes: 19,
    activity: "há 2 dias",
    signal: "Amostra limitada",
    profile: "ME/EPP",
    category: "Manutenção predial",
    compatibility: "69% · manutenção e serviços",
    competition: "3,2 fornecedores",
    averageDeadline: "10 dias",
    behavior: "Histórico insuficiente para padrão firme",
    detail: "Há sinais de aderência, mas o histórico ainda é limitado para uma decisão firme.",
  },
  {
    id: "campinas",
    name: "Prefeitura Municipal de Campinas",
    cnpj: "51.885.242/0001-40",
    municipality: "Campinas",
    uf: "SP",
    score: 88,
    volume: "R$ 42,7 mi",
    processes: 117,
    activity: "há 4 h",
    signal: "Previsível",
    profile: "Demais",
    category: "Equipamentos de TI",
    compatibility: "91% · equipamentos e software",
    competition: "7,2 fornecedores",
    averageDeadline: "14 dias",
    behavior: "Compras recorrentes e documentação consistente",
    detail: "Alto volume e comportamento de compras consistente no recorte analisado.",
  },
  {
    id: "niteroi",
    name: "Prefeitura Municipal de Niterói",
    cnpj: "28.521.748/0001-59",
    municipality: "Niterói",
    uf: "RJ",
    score: 79,
    volume: "R$ 16,2 mi",
    processes: 58,
    activity: "há 1 dia",
    signal: "Previsível",
    profile: "ME/EPP",
    category: "Serviços de tecnologia",
    compatibility: "81% · nuvem e suporte",
    competition: "5,7 fornecedores",
    averageDeadline: "11 dias",
    behavior: "Boa previsibilidade no último ano",
    detail: "Aderência consistente para serviços de tecnologia e operação digital.",
  },
  {
    id: "goiania",
    name: "Prefeitura Municipal de Goiânia",
    cnpj: "01.612.092/0001-23",
    municipality: "Goiânia",
    uf: "GO",
    score: 71,
    volume: "R$ 12,6 mi",
    processes: 41,
    activity: "há 6 h",
    signal: "Atenção a prazos",
    profile: "Demais",
    category: "Manutenção predial",
    compatibility: "72% · operação e manutenção",
    competition: "5,1 fornecedores",
    averageDeadline: "8 dias",
    behavior: "Prazos variam por modalidade",
    detail: "Potencial relevante, mas exige confirmação de cronograma antes de priorizar.",
  },
];

const agencyResizableColumns = [
  { id: "location", width: 170, min: 150, max: 260 },
  { id: "score", width: 118, min: 108, max: 180 },
  { id: "signal", width: 175, min: 150, max: 250 },
  { id: "compatibility", width: 175, min: 150, max: 280 },
  { id: "actions", width: 174, min: 156, max: 240 },
];

function scoreTone(score: number) {
  if (score >= 80) return "bg-brand-tint text-brand-strong";
  if (score >= 70) return "bg-[#EEF4FF] text-[#2455B6]";
  return "bg-amber-50 text-amber-700";
}

function SignalBadge({ signal }: { signal: AgencySignal }) {
  const tone =
    signal === "Previsível"
      ? "bg-[#E8F8ED] text-brand-strong"
      : signal === "Atenção a prazos"
        ? "bg-amber-50 text-amber-700"
        : "bg-[#EEF4FF] text-[#2455B6]";
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold",
        tone,
      )}
    >
      {signal}
    </span>
  );
}

function AgencyProfileCard({
  agency,
  compared,
  onToggleCompare,
}: {
  agency: Agency;
  compared: boolean;
  onToggleCompare: () => void;
}) {
  return (
    <Panel className="overflow-hidden p-4 sm:p-5">
      <PanelHeader
        icon={<Landmark className="size-4" />}
        title={`Perfil de ${agency.name}`}
        subtitle="O score apoia a decisão; fatores, origem e atualização permanecem verificáveis."
      />
      <div className="mt-4 grid gap-4 rounded-2xl border border-[#BDEEC9] bg-[#F2FCF5] p-4">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "grid size-14 shrink-0 place-items-center rounded-2xl text-[20px] font-extrabold",
              scoreTone(agency.score),
            )}
          >
            {agency.score}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[13px] font-extrabold text-ink">{agency.signal}</p>
              <SignalBadge signal={agency.signal} />
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-text">{agency.detail}</p>
          </div>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#DFF6E6]">
          <span
            className="block h-full rounded-full bg-[#18B849]"
            style={{ width: `${agency.score}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <Evidence
          title="Previsibilidade"
          detail={`${agency.averageDeadline} em média · ${agency.behavior}.`}
          tone="good"
        />
        <Evidence title="Concorrência" detail={`Média de ${agency.competition} por processo.`} />
        <Evidence
          title="Volume compatível"
          detail={`${agency.volume} homologados no recorte de 24 meses.`}
        />
        <Evidence title="Categorias recorrentes" detail={agency.category} />
      </div>

      <div className="mt-4 rounded-xl border border-hairline bg-page/55 p-3">
        <p className="text-[11px] font-extrabold text-ink">Última oportunidade compatível</p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-text">
          Aquisição relacionada a {agency.category.toLocaleLowerCase("pt-BR")}, atualizada{" "}
          {agency.activity}.
        </p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <Button
          asChild
          variant="outline"
          className="min-h-11 justify-between rounded-xl text-[11px] font-extrabold"
        >
          <Link to="/dash2/licitacoes/buscar">
            Ver oportunidades <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="min-h-11 justify-between rounded-xl text-[11px] font-extrabold"
        >
          <Link to="/raio-x">
            Abrir Raio-X <FileSearch className="size-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="min-h-11 justify-between rounded-xl text-[11px] font-extrabold"
        >
          <Link to="/concorrentes">
            Ver concorrentes <TrendingUp className="size-4" />
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onToggleCompare}
          aria-pressed={compared}
          className={cn(
            "min-h-11 justify-between rounded-xl text-[11px] font-extrabold",
            compared && "border-[#BDEEC9] bg-[#F2FCF5] text-brand-strong",
          )}
        >
          {compared ? "Remover da comparação" : "Comparar órgão"}
          <GitCompareArrows className="size-4" />
        </Button>
      </div>
    </Panel>
  );
}

function AgencyComparisonPanel({ agencies: compared }: { agencies: Agency[] }) {
  if (compared.length < 2) {
    return (
      <Panel className="p-4 sm:p-5">
        <PanelHeader
          icon={<GitCompareArrows className="size-4" />}
          title="Comparar órgãos"
          subtitle="Selecione até três perfis para comparar sem alterar a busca."
        />
        <p className="mt-4 rounded-xl bg-page/60 p-3 text-[11px] leading-relaxed text-slate-text">
          Escolha mais {2 - compared.length} {compared.length === 0 ? "órgãos" : "órgão"} para abrir
          a comparação.
        </p>
      </Panel>
    );
  }

  return (
    <Panel className="overflow-hidden p-4 sm:p-5">
      <PanelHeader
        icon={<GitCompareArrows className="size-4" />}
        title={`${compared.length} órgãos em comparação`}
        subtitle="O recorte não altera os filtros nem a lista principal."
      />
      <div className="mt-4 space-y-3">
        {compared.map((agency) => (
          <article key={agency.id} className="rounded-xl border border-hairline bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-[12px] font-extrabold text-ink">{agency.name}</p>
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-lg text-[11px] font-extrabold",
                  scoreTone(agency.score),
                )}
              >
                {agency.score}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
              <span className="rounded-lg bg-page px-2 py-1.5 text-slate-text">
                {agency.volume}
              </span>
              <span className="rounded-lg bg-page px-2 py-1.5 text-slate-text">
                {agency.competition}
              </span>
              <span className="rounded-lg bg-page px-2 py-1.5 text-slate-text">
                Prazo: {agency.averageDeadline}
              </span>
              <span className="rounded-lg bg-page px-2 py-1.5 text-slate-text">
                {agency.compatibility}
              </span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function AgencyScorePage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(agencies[0]!.id);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "activity" | "volume" | "competition">("score");
  const [filters, setFilters] = useState({
    uf: "all",
    score: "all",
    signal: "all",
    category: "all",
    profile: "all",
  });
  const { gridTemplateColumns: agencyGridTemplateColumns, getResizeHandleProps } =
    useResizableColumns({
      storageKey: "licitabase:agency-score:columns.v2",
      columns: agencyResizableColumns,
    });
  const filtered = useMemo(() => {
    const normalizedQuery = query.toLocaleLowerCase("pt-BR").trim();
    const scoreMatches = (agency: Agency) =>
      filters.score === "all" ||
      (filters.score === "high" && agency.score >= 80) ||
      (filters.score === "medium" && agency.score >= 70 && agency.score < 80) ||
      (filters.score === "attention" && agency.score < 70);
    const value = agencies.filter((agency) => {
      const searchTarget = `${agency.name} ${agency.cnpj} ${agency.municipality}`.toLocaleLowerCase(
        "pt-BR",
      );
      return (
        (!normalizedQuery || searchTarget.includes(normalizedQuery)) &&
        (filters.uf === "all" || agency.uf === filters.uf) &&
        (filters.signal === "all" || agency.signal === filters.signal) &&
        (filters.category === "all" || agency.category === filters.category) &&
        (filters.profile === "all" || agency.profile === filters.profile) &&
        scoreMatches(agency)
      );
    });
    return value.sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "volume") return b.processes - a.processes;
      if (sortBy === "competition")
        return Number.parseFloat(b.competition) - Number.parseFloat(a.competition);
      return a.activity.localeCompare(b.activity, "pt-BR");
    });
  }, [filters, query, sortBy]);
  const selected = agencies.find((agency) => agency.id === selectedId) ?? agencies[0]!;
  const compared = agencies.filter((agency) => compareIds.includes(agency.id));
  const activeFilters = Object.values(filters).filter((value) => value !== "all").length;
  const clearFilters = () => {
    setQuery("");
    setFilters({ uf: "all", score: "all", signal: "all", category: "all", profile: "all" });
  };
  const toggleCompare = (id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length === 3) {
        toast.info("Limite de comparação atingido", {
          description: "Remova um órgão antes de selecionar outro.",
        });
        return current;
      }
      return [...current, id];
    });
  };
  const selectAgency = (id: string, openMobile = false) => {
    setSelectedId(id);
    setMobileProfileOpen(openMobile);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageContextHeader
        context="intelligence"
        contextLabel="INTELIGÊNCIA"
        title="Score dos Órgãos"
        description="Priorize órgãos com maior potencial para sua operação."
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => setMethodologyOpen(true)}
            className="min-h-11 rounded-xl text-[12px] font-bold"
          >
            <CircleHelp className="size-4" /> Como calculamos
          </Button>
        }
      />

      <InternalStatusNotice
        state="stale"
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success("Atualização concluída", {
                description: "A cobertura e a atividade dos órgãos foram atualizadas.",
              })
            }
          >
            Atualizar agora
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
        <Metric
          label="Órgãos analisados"
          value="1.284"
          detail="Histórico disponível nos últimos 24 meses."
          icon={Landmark}
        />
        <Metric
          label="Perfis compatíveis"
          value="126"
          detail="Relacionados às categorias priorizadas."
          icon={Target}
          tone="blue"
        />
        <Metric
          label="Com atenção"
          value="18"
          detail="Prazo variável ou amostra limitada."
          icon={AlertTriangle}
          tone="amber"
        />
        <Metric
          label="Comparação"
          value={`${compareIds.length}/3`}
          detail="Selecione até três perfis para decidir."
          icon={GitCompareArrows}
        />
      </div>

      <PageHowItWorks
        title="Compare o contexto antes de escolher onde investigar"
        description="O Score organiza sinais de compra, mas a decisão continua verificável no histórico e no edital de cada oportunidade."
        steps={[
          {
            title: "Encontre um órgão",
            description: "Pesquise pelo nome, CNPJ, município ou aplique filtros.",
          },
          {
            title: "Leia os sinais",
            description: "Veja score, previsibilidade e compatibilidade com a operação.",
          },
          {
            title: "Aprofunde a decisão",
            description: "Abra oportunidades, concorrentes ou o Raio-X do edital.",
          },
        ]}
      />

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <Panel className="overflow-hidden">
          <div className="border-b border-hairline p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                  Pesquisa e comparação
                </p>
                <h2 className="mt-1 text-[18px] font-extrabold text-ink">
                  Órgãos relevantes para sua operação
                </h2>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                  Abra um perfil para entender fatores, origem dos dados e próximas oportunidades.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] xl:w-[620px]">
                <div className="relative min-w-0">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-text"
                    aria-hidden="true"
                  />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar órgão, CNPJ ou município"
                    className="min-h-11 rounded-xl border-hairline pl-9 text-[12px]"
                    aria-label="Buscar órgão, CNPJ ou município"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFiltersOpen(true)}
                  className="min-h-11 rounded-xl text-[11px] font-bold"
                >
                  <SlidersHorizontal className="size-4" /> Filtros
                  {activeFilters ? ` · ${activeFilters}` : ""}
                </Button>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                  className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[11px] font-bold text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#29C454]"
                  aria-label="Ordenar órgãos"
                >
                  <option value="score">Maior score</option>
                  <option value="activity">Atividade recente</option>
                  <option value="volume">Maior volume</option>
                  <option value="competition">Concorrência</option>
                </select>
              </div>
            </div>
          </div>

          {filtered.length ? (
            <div className="divide-y divide-hairline">
              <ResourceListGridHeader
                gridTemplateColumns={agencyGridTemplateColumns}
                className="px-0 py-0"
              >
                <div className="relative px-5 py-3">
                  Órgão
                  <button
                    {...getResizeHandleProps("location")}
                    aria-label="Redimensionar coluna Localidade e atividade"
                  />
                </div>
                <div className="relative border-l border-hairline px-4 py-3">
                  Localidade e atividade
                  <button
                    {...getResizeHandleProps("score")}
                    aria-label="Redimensionar coluna Score"
                  />
                </div>
                <div className="relative border-l border-hairline px-4 py-3 text-center">
                  Score
                  <button
                    {...getResizeHandleProps("signal")}
                    aria-label="Redimensionar coluna Sinal"
                  />
                </div>
                <div className="relative border-l border-hairline px-4 py-3">
                  Sinal
                  <button
                    {...getResizeHandleProps("compatibility")}
                    aria-label="Redimensionar coluna Compatibilidade"
                  />
                </div>
                <div className="relative border-l border-hairline px-4 py-3">
                  Compatibilidade
                  <button
                    {...getResizeHandleProps("actions")}
                    aria-label="Redimensionar coluna Ações"
                  />
                </div>
                <div className="border-l border-hairline px-4 py-3 text-right">Ações</div>
              </ResourceListGridHeader>
              {filtered.map((agency) => {
                const selectedRow = agency.id === selectedId;
                const comparedRow = compareIds.includes(agency.id);
                return (
                  <article
                    key={agency.id}
                    className={cn(
                      "p-4 transition-colors hover:bg-page/[0.42] sm:p-5 xl:p-0",
                      selectedRow && "bg-[#F2FCF5]",
                    )}
                  >
                    <div
                      className="grid min-w-0 gap-4 xl:items-center xl:gap-0"
                      style={{ gridTemplateColumns: agencyGridTemplateColumns }}
                    >
                      <button
                        type="button"
                        onClick={() => selectAgency(agency.id)}
                        className="min-w-0 text-left focus-visible:outline-2 focus-visible:outline-[#29C454] xl:px-5 xl:py-5"
                        aria-label={`Abrir perfil de ${agency.name}`}
                      >
                        <p className="truncate text-[13px] font-extrabold text-ink">
                          {agency.name}
                        </p>
                        <p className="mt-1 truncate text-[11px] text-slate-text">
                          {agency.cnpj} · {agency.category}
                        </p>
                      </button>
                      <div className="hidden border-l border-hairline px-4 py-5 xl:block">
                        <p className="text-[12px] font-bold text-ink">
                          {agency.municipality} · {agency.uf}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-text">
                          {agency.processes} processos · atividade {agency.activity}
                        </p>
                      </div>
                      <div className="hidden border-l border-hairline px-4 py-5 xl:grid xl:place-items-center">
                        <span
                          className={cn(
                            "grid size-10 place-items-center rounded-xl text-[13px] font-extrabold",
                            scoreTone(agency.score),
                          )}
                        >
                          {agency.score}
                        </span>
                      </div>
                      <div className="hidden border-l border-hairline px-4 py-5 xl:block">
                        <SignalBadge signal={agency.signal} />
                      </div>
                      <div className="hidden border-l border-hairline px-4 py-5 xl:block">
                        <p className="text-[11px] font-extrabold text-ink">
                          {agency.compatibility}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-text">
                          {agency.volume} homologados
                        </p>
                      </div>
                      <div className="hidden border-l border-hairline px-4 py-5 xl:flex xl:items-center xl:justify-end xl:gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => selectAgency(agency.id)}
                          className="h-9 rounded-lg px-3 text-[10px] font-bold"
                        >
                          Perfil
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => toggleCompare(agency.id)}
                          aria-pressed={comparedRow}
                          className={cn(
                            "h-9 rounded-lg px-3 text-[10px] font-bold",
                            comparedRow && "border-[#BDEEC9] bg-[#E8F8ED] text-brand-strong",
                          )}
                        >
                          {comparedRow ? "Selecionado" : "Comparar"}
                        </Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 xl:hidden">
                        <span
                          className={cn(
                            "grid size-9 place-items-center rounded-xl text-[12px] font-extrabold",
                            scoreTone(agency.score),
                          )}
                        >
                          {agency.score}
                        </span>
                        <SignalBadge signal={agency.signal} />
                        <span className="text-[11px] font-bold text-slate-text">
                          {agency.compatibility}
                        </span>
                        <div className="ml-auto flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => selectAgency(agency.id, true)}
                            className="h-10 rounded-lg px-3 text-[11px] font-bold"
                          >
                            Perfil
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => toggleCompare(agency.id)}
                            aria-pressed={comparedRow}
                            className={cn(
                              "h-10 rounded-lg px-3 text-[11px] font-bold",
                              comparedRow && "border-[#BDEEC9] bg-[#E8F8ED] text-brand-strong",
                            )}
                          >
                            {comparedRow ? "Selecionado" : "Comparar"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="p-4 sm:p-5">
              <InternalPageState
                state="empty"
                title="Nenhum órgão encontrado"
                description="Ajuste o termo de busca ou limpe os filtros aplicados."
                action={
                  <Button type="button" variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                }
              />
            </div>
          )}
        </Panel>

        <aside className="hidden xl:grid xl:grid-cols-2 xl:gap-5 2xl:block 2xl:space-y-5">
          <AgencyProfileCard
            agency={selected}
            compared={compareIds.includes(selected.id)}
            onToggleCompare={() => toggleCompare(selected.id)}
          />
          <AgencyComparisonPanel agencies={compared} />
        </aside>
      </div>

      <Sheet open={mobileProfileOpen} onOpenChange={setMobileProfileOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[88dvh] overflow-y-auto rounded-t-2xl border-hairline bg-white p-4 sm:max-w-none sm:p-5"
          overlayClassName="bg-slate-950/30"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="text-[17px] font-extrabold text-ink">Perfil do órgão</SheetTitle>
            <SheetDescription className="text-[12px] text-slate-text">
              Leia os fatores antes de abrir uma oportunidade ou comparar perfis.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <AgencyProfileCard
              agency={selected}
              compared={compareIds.includes(selected.id)}
              onToggleCompare={() => toggleCompare(selected.id)}
            />
          </div>
          <div className="mt-4">
            <AgencyComparisonPanel agencies={compared} />
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent className="w-[calc(100%_-_2rem)] max-w-2xl rounded-2xl border-hairline bg-white p-5 sm:p-6">
          <DialogHeader>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
              Refinar ranking
            </p>
            <DialogTitle className="text-[20px] font-extrabold text-ink">
              Filtros de órgãos
            </DialogTitle>
            <DialogDescription className="text-[12px] leading-relaxed text-slate-text">
              Os filtros reduzem a lista; a comparação continua preservada.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-[12px] font-bold text-ink">
              UF
              <select
                value={filters.uf}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, uf: event.target.value }))
                }
                className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[12px] font-semibold"
              >
                <option value="all">Todas as UFs</option>
                <option>SP</option>
                <option>ES</option>
                <option>RJ</option>
                <option>GO</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-[12px] font-bold text-ink">
              Faixa de score
              <select
                value={filters.score}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, score: event.target.value }))
                }
                className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[12px] font-semibold"
              >
                <option value="all">Todas as faixas</option>
                <option value="high">80 a 100 · priorizar</option>
                <option value="medium">70 a 79 · analisar</option>
                <option value="attention">Abaixo de 70 · atenção</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-[12px] font-bold text-ink">
              Sinal
              <select
                value={filters.signal}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, signal: event.target.value }))
                }
                className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[12px] font-semibold"
              >
                <option value="all">Todos os sinais</option>
                <option>Previsível</option>
                <option>Atenção a prazos</option>
                <option>Amostra limitada</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-[12px] font-bold text-ink">
              Categoria
              <select
                value={filters.category}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, category: event.target.value }))
                }
                className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[12px] font-semibold"
              >
                <option value="all">Todas as categorias</option>
                <option>Equipamentos de TI</option>
                <option>Serviços de tecnologia</option>
                <option>Manutenção predial</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-[12px] font-bold text-ink sm:col-span-2">
              Porte
              <select
                value={filters.profile}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, profile: event.target.value }))
                }
                className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[12px] font-semibold"
              >
                <option value="all">Todos os portes</option>
                <option>ME/EPP</option>
                <option>Demais</option>
              </select>
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Limpar
            </Button>
            <Button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="bg-[#18B849] text-white hover:bg-[#139e3e]"
            >
              Aplicar filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={methodologyOpen} onOpenChange={setMethodologyOpen}>
        <DialogContent className="w-[calc(100%_-_2rem)] max-w-2xl rounded-2xl border-hairline bg-white p-5 sm:p-6">
          <DialogHeader>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
              Metodologia transparente
            </p>
            <DialogTitle className="text-[20px] font-extrabold text-ink">
              Como calculamos o score
            </DialogTitle>
            <DialogDescription className="text-[12px] leading-relaxed text-slate-text">
              O score prioriza onde investigar; ele não substitui a leitura do edital nem uma
              decisão humana.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                [
                  "Compatibilidade",
                  "Aderência às categorias, itens e regiões priorizadas pela operação.",
                ],
                ["Volume", "Histórico financeiro relevante no recorte disponível."],
                [
                  "Concorrência",
                  "Quantidade e recorrência de fornecedores em processos similares.",
                ],
                [
                  "Previsibilidade",
                  "Estabilidade de datas, padrões de compra e mudanças no processo.",
                ],
                [
                  "Qualidade da amostra",
                  "Quantidade, atualidade e cobertura dos dados disponíveis.",
                ],
              ] as [string, string][]
            ).map(([title, description]) => (
              <Evidence key={title} title={title} detail={description} />
            ))}
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
            Período analisado: últimos 24 meses. Última atualização há 6 minutos. Órgãos com poucos
            processos recebem o sinal “Amostra limitada”.
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setMethodologyOpen(false)}
              className="bg-[#18B849] text-white hover:bg-[#139e3e]"
            >
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const reportCards = [
  {
    id: "pipeline",
    title: "Funil da operação",
    description: "Conversão, prazos e gargalos por etapa.",
    value: "42 oportunidades",
    icon: Target,
  },
  {
    id: "coverage",
    title: "Cobertura de oportunidades",
    description: "Categorias, regiões e fontes com maior aderência.",
    value: "84% aderente",
    icon: TrendingUp,
  },
  {
    id: "bot",
    title: "Desempenho do Bot",
    description: "Sessões, posição, lances e resultado consolidado.",
    value: "11 sessões",
    icon: Gauge,
  },
  {
    id: "documents",
    title: "Documentos e pendências",
    description: "Validades, uso em propostas e itens críticos.",
    value: "3 pendências",
    icon: FileText,
  },
];

const reportResizableColumns = [
  { id: "processes", width: 160, min: 130, max: 240 },
  { id: "duration", width: 170, min: 140, max: 260 },
];

export function IntelligenceReportsPage() {
  const [activeId, setActiveId] = useState(reportCards[0]!.id);
  const [view, setView] = useState("insights");
  const { gridTemplateColumns: reportGridTemplateColumns, getResizeHandleProps } =
    useResizableColumns({
      storageKey: "licitabase:reports:columns",
      columns: reportResizableColumns,
    });
  const report = reportCards.find((item) => item.id === activeId) ?? reportCards[0]!;
  return (
    <div className="space-y-5 sm:space-y-6">
      <PageContextHeader
        context="intelligence"
        contextLabel="ANÁLISES GERENCIAIS"
        title="Relatórios"
        description="Consolide desempenho, gargalos e resultados da operação em decisões compartilháveis."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                toast.success("Relatório agendado", {
                  description: "O resumo será enviado toda segunda-feira às 8h.",
                })
              }
            >
              Agendar envio
            </Button>
            <Button
              type="button"
              onClick={() =>
                toast.success("Exportação preparada", {
                  description: "O arquivo CSV está pronto para download.",
                })
              }
              className="bg-[#18B849] text-white hover:bg-[#139e3e]"
            >
              <Download className="size-4" /> Exportar
            </Button>
          </>
        }
      />
      <PageHowItWorks
        title="Compartilhe a leitura certa da operação"
        description="Escolha um recorte, verifique os indicadores e exporte ou agende a versão que cada pessoa precisa acompanhar."
        steps={[
          {
            title: "Escolha o recorte",
            description: "Alterne entre relatórios sem perder o contexto do período.",
          },
          {
            title: "Investigue os dados",
            description: "Leia tendências e listas que sustentam cada indicador.",
          },
          {
            title: "Distribua o resultado",
            description: "Exporte ou agende o resumo para a equipe responsável.",
          },
        ]}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {reportCards.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={cn(
                "rounded-2xl border p-4 text-left shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-colors focus-visible:outline-2 focus-visible:outline-[#29C454] sm:p-5",
                activeId === item.id
                  ? "border-[#BDEEC9] bg-[#F2FCF5]"
                  : "border-hairline bg-white hover:bg-page",
              )}
            >
              <span className="grid size-9 place-items-center rounded-xl bg-brand-tint text-brand-strong">
                <Icon className="size-4" />
              </span>
              <p className="mt-3 text-[13px] font-extrabold text-ink">{item.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-text">{item.description}</p>
              <p className="mt-3 text-[12px] font-extrabold text-brand-strong">{item.value}</p>
            </button>
          );
        })}
      </div>
      <Panel className="overflow-hidden">
        <div className="border-b border-hairline p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                Relatório selecionado
              </p>
              <h2 className="mt-1 text-[18px] font-extrabold text-ink">{report.title}</h2>
              <p className="mt-1 text-[12px] text-slate-text">
                Período: 01–18 ago 2026 · Atualizado hoje às 10:42
              </p>
            </div>
            <select className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[12px] font-bold text-ink">
              <option>Últimos 30 dias</option>
              <option>Este trimestre</option>
              <option>Personalizado</option>
            </select>
          </div>
        </div>
        <Tabs value={view} onValueChange={setView}>
          <TabsList className="m-4 h-auto w-[calc(100%_-_2rem)] justify-start rounded-xl border border-hairline bg-page/45 p-1 sm:m-5 sm:w-[calc(100%_-_2.5rem)]">
            <TabsTrigger value="insights" className="min-h-10 flex-1 text-[12px] font-bold">
              Indicadores
            </TabsTrigger>
            <TabsTrigger value="table" className="min-h-10 flex-1 text-[12px] font-bold">
              Dados em tabela
            </TabsTrigger>
          </TabsList>
          <TabsContent value="insights" className="mt-0 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric
                label="Resultado"
                value="+18%"
                detail="Melhora em relação ao período anterior."
                icon={TrendingUp}
              />
              <Metric
                label="Principal gargalo"
                value="2,4 dias"
                detail="Tempo médio na composição da proposta."
                icon={CalendarClock}
                tone="amber"
              />
              <Metric
                label="Decisões"
                value="31"
                detail="Oportunidades classificadas pela equipe."
                icon={ClipboardCheck}
                tone="blue"
              />
            </div>
            <div className="mt-5 rounded-2xl border border-hairline bg-page/45 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-brand-strong" />
                <p className="text-[13px] font-extrabold text-ink">Leitura do período</p>
              </div>
              <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-slate-text">
                A operação avançou mais oportunidades para proposta, mas os processos com
                documentação pendente levaram em média 1,2 dia a mais. Priorize a renovação de
                certidões antes da próxima janela de disputa.
              </p>
              <Link
                to="/documentos"
                className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-extrabold text-brand-strong"
              >
                Ver pendências em documentos <ArrowRight className="size-4" />
              </Link>
            </div>
          </TabsContent>
          <TabsContent value="table" className="mt-0 p-4 sm:p-5">
            <div className="divide-y divide-hairline rounded-xl border border-hairline">
              <ResourceListGridHeader
                gridTemplateColumns={reportGridTemplateColumns}
                className="px-3 py-3"
              >
                <span className="relative">
                  Etapa
                  <button
                    {...getResizeHandleProps("processes")}
                    aria-label="Redimensionar largura da coluna Processos"
                  />
                </span>
                <span className="relative text-right">
                  Processos
                  <button
                    {...getResizeHandleProps("duration")}
                    aria-label="Redimensionar largura da coluna Tempo médio"
                  />
                </span>
                <span className="text-right">Tempo médio</span>
              </ResourceListGridHeader>
              {[
                ["Em análise", "14", "2,1 dias"],
                ["Propostas", "9", "1,6 dias"],
                ["Em disputa", "3", "0,8 dia"],
                ["Finalizadas", "5", "3,4 dias"],
              ].map(([stage, count, duration]) => (
                <div
                  key={stage}
                  className="flex flex-col gap-2 p-3 text-[12px] xl:grid xl:items-center"
                  style={{ gridTemplateColumns: reportGridTemplateColumns }}
                >
                  <span className="font-extrabold text-ink">{stage}</span>
                  <span className="font-bold text-ink xl:text-right">{count} processos</span>
                  <span className="text-slate-text xl:text-right">{duration} em média</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Panel>
    </div>
  );
}
