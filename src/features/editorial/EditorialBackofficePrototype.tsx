import { useMemo, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FilePenLine,
  FileText,
  FolderLock,
  Link2,
  LoaderCircle,
  LockKeyhole,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Panel, PanelHeader } from "@/components/dash2/Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { emptyBriefFixture, editorialArticlesFixture } from "@/features/editorial/fixtures";
import { mockDraftProvider } from "@/features/editorial/mock-adapters";
import type {
  DraftGenerationResult,
  EditorialArticle,
  EditorialBrief,
  EditorialStatus,
} from "@/features/editorial/types";
import { cn } from "@/lib/utils";

type WorkspaceView = "library" | "briefing" | "preview";
type StatusFilter = "all" | EditorialStatus;

const statusInfo: Record<EditorialStatus, { label: string; className: string; dot: string }> = {
  draft: {
    label: "Rascunho",
    className: "border-slate-200 bg-slate-50 text-slate-600",
    dot: "bg-slate-400",
  },
  in_review: {
    label: "Em revisão",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  approved: {
    label: "Aprovado",
    className: "border-sky-200 bg-sky-50 text-sky-700",
    dot: "bg-sky-500",
  },
  scheduled: {
    label: "Agendado",
    className: "border-violet-200 bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },
  published: {
    label: "Publicado",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-[#18B849]",
  },
  archived: {
    label: "Arquivado",
    className: "border-slate-200 bg-slate-100 text-slate-500",
    dot: "bg-slate-400",
  },
};

const filterOptions: readonly { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "draft", label: "Rascunhos" },
  { id: "in_review", label: "Em revisão" },
  { id: "scheduled", label: "Agendados" },
  { id: "published", label: "Publicados" },
];

const seoChecklist = [
  "Título, slug e meta description únicos",
  "Intenção de busca definida no briefing",
  "Links apontam apenas para posts publicados",
  "Fontes oficiais revisadas quando aplicável",
  "CTA conectado a uma próxima ação relevante",
] as const;

export function EditorialBackofficePrototype() {
  const [view, setView] = useState<WorkspaceView>("library");
  const [articles, setArticles] = useState<EditorialArticle[]>([...editorialArticlesFixture]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [brief, setBrief] = useState<EditorialBrief>(emptyBriefFixture);
  const [generatedDraft, setGeneratedDraft] = useState<DraftGenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(editorialArticlesFixture[2]?.id ?? "");

  const visibleArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

    return articles.filter((article) => {
      const matchesStatus = statusFilter === "all" || article.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        [article.title, article.primaryKeyword, article.cluster, article.slug]
          .join(" ")
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [articles, query, statusFilter]);

  const selectedArticle =
    articles.find((article) => article.id === selectedArticleId) ?? articles[0] ?? null;

  const statusCounts = useMemo(() => {
    return articles.reduce<Record<EditorialStatus, number>>(
      (counts, article) => ({ ...counts, [article.status]: counts[article.status] + 1 }),
      { draft: 0, in_review: 0, approved: 0, scheduled: 0, published: 0, archived: 0 },
    );
  }, [articles]);

  const updateBrief = <Key extends keyof EditorialBrief>(key: Key, value: EditorialBrief[Key]) => {
    setBrief((current) => ({ ...current, [key]: value }));
  };

  const generateDraft = async () => {
    if (!brief.topic.trim() || !brief.primaryKeyword.trim()) {
      toast.error("Informe o tema e a palavra-chave principal antes de gerar o rascunho.");
      return;
    }

    setIsGenerating(true);
    try {
      const draft = await mockDraftProvider.generate(brief);
      setGeneratedDraft(draft);
      setView("preview");
      toast.success("Rascunho demonstrativo gerado. Nenhum dado foi enviado ou publicado.");
    } finally {
      setIsGenerating(false);
    }
  };

  const moveReviewArticleToApproved = () => {
    if (generatedDraft || !selectedArticle || selectedArticle.status !== "in_review") return;
    setArticles((current) =>
      current.map((article) =>
        article.id === selectedArticle.id ? { ...article, status: "approved" } : article,
      ),
    );
    toast.success("Status alterado apenas neste protótipo local.");
  };

  return (
    <div className="min-h-screen bg-[#f6f8f7] font-manrope text-ink">
      <header className="border-b border-[#174432] bg-[#062d20] text-white">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#18B849] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]">
              <FilePenLine className="size-4" strokeWidth={2.4} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9ed5af]">
                LicitaBase · demonstração navegável
              </p>
              <h1 className="truncate text-[16px] font-extrabold tracking-[-0.02em] text-white sm:text-[18px]">
                Backoffice editorial
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-bold text-[#d8f6e0]">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            <span>Protótipo · dados demonstrativos</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
        <div className="space-y-5 sm:space-y-6">
          <Panel className="overflow-hidden border-[#cfead7] bg-[linear-gradient(118deg,#ffffff_0%,#ffffff_58%,#edf9f0_100%)]">
            <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_330px] xl:items-end xl:gap-8 xl:p-6">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#ccefd5] bg-[#f3fcf5] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#16823b]">
                  <span className="size-1.5 rounded-full bg-[#18B849]" aria-hidden="true" />
                  Operação editorial
                </p>
                <h2 className="mt-3 max-w-3xl text-[27px] font-extrabold tracking-[-0.04em] text-ink sm:text-[34px]">
                  Briefing, revisão e publicação com controle humano.
                </h2>
                <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-text sm:text-[14px]">
                  Centralize a decisão editorial antes de um conteúdo chegar ao blog. Esta
                  referência demonstra a arquitetura do CMS futuro — sem IA, dados persistidos ou
                  publicação real.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-hairline bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-text">
                    Dados demonstrativos
                  </span>
                  <span className="rounded-lg border border-hairline bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-text">
                    Publicação sempre revisada
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-[#bde9ca] bg-white/90 p-4 shadow-[0_12px_24px_-20px_rgba(5,76,39,0.42)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                      Prioridade da fila
                    </p>
                    <p className="mt-1 text-[15px] font-extrabold tracking-tight text-ink">
                      {statusCounts.in_review} conteúdo aguardando revisão
                    </p>
                  </div>
                  <span className="grid size-9 place-items-center rounded-xl bg-[#eaf9ee] text-[#18B849]">
                    <ClipboardCheck className="size-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-text">
                  Fatos, intenção, fontes e links precisam ser validados antes de aprovar.
                </p>
                <Button
                  type="button"
                  onClick={() => setView("briefing")}
                  className="mt-4 min-h-11 w-fit rounded-xl bg-[#18B849] px-4 text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
                >
                  <Plus className="size-4" /> Novo briefing
                </Button>
              </div>
            </div>
          </Panel>

          <WorkflowStepper activeView={view} onNavigate={setView} />

          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryMetric
              label="Em revisão"
              value={statusCounts.in_review}
              description="Aguardando validação humana"
              tone="amber"
              icon={ClipboardCheck}
            />
            <SummaryMetric
              label="Prontos para a fila"
              value={statusCounts.approved + statusCounts.scheduled}
              description="Aprovados ou programados"
              tone="brand"
              icon={CalendarClock}
            />
            <SummaryMetric
              label="Publicados"
              value={statusCounts.published}
              description="Visíveis no blog e indexáveis"
              tone="ink"
              icon={CheckCircle2}
            />
          </div>

          <Tabs value={view} onValueChange={(value) => setView(value as WorkspaceView)}>
            <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-xl border border-hairline bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:w-auto">
              <TabsTrigger
                value="library"
                className="min-h-10 rounded-lg px-3 text-[12px] font-bold"
              >
                Biblioteca
              </TabsTrigger>
              <TabsTrigger
                value="briefing"
                className="min-h-10 rounded-lg px-3 text-[12px] font-bold"
              >
                Criar briefing
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="min-h-10 rounded-lg px-3 text-[12px] font-bold"
              >
                Revisar conteúdo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="mt-5 sm:mt-6">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-6">
                <Panel className="min-w-0">
                  <PanelHeader
                    icon={<FileText className="size-4" />}
                    title="Conteúdos em operação"
                    subtitle="Filtro, status e responsabilidade são dados demonstrativos."
                  />
                  <div className="border-t border-hairline p-4 sm:p-5">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="relative w-full lg:max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-text" />
                        <Input
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Buscar título, cluster ou palavra-chave"
                          aria-label="Buscar conteúdo editorial"
                          className="min-h-11 rounded-xl border-hairline pl-9 text-[12px]"
                        />
                      </div>
                      <div
                        className="flex gap-1 overflow-x-auto pb-1 lg:pb-0"
                        aria-label="Filtrar por status"
                      >
                        {filterOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setStatusFilter(option.id)}
                            className={cn(
                              "min-h-9 shrink-0 rounded-lg px-2.5 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                              statusFilter === option.id
                                ? "bg-[#eaf9ee] text-[#12843b]"
                                : "text-slate-text hover:bg-slate-50 hover:text-ink",
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-xl border border-hairline">
                      <div className="hidden grid-cols-[minmax(250px,1.35fr)_minmax(150px,.8fr)_120px_42px] gap-4 border-b border-hairline bg-slate-50/70 px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-text md:grid">
                        <span>Conteúdo</span>
                        <span>Cluster e intenção</span>
                        <span>Estado</span>
                        <span className="sr-only">Ação</span>
                      </div>
                      {visibleArticles.length ? (
                        <div className="divide-y divide-hairline">
                          {visibleArticles.map((article) => (
                            <ArticleRow
                              key={article.id}
                              article={article}
                              selected={article.id === selectedArticleId}
                              onSelect={() => {
                                setGeneratedDraft(null);
                                setSelectedArticleId(article.id);
                                setView("preview");
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="px-5 py-12 text-center">
                          <Search className="mx-auto size-5 text-slate-300" aria-hidden="true" />
                          <p className="mt-3 text-[13px] font-bold text-ink">
                            Nenhum conteúdo encontrado
                          </p>
                          <p className="mt-1 text-[12px] text-slate-text">
                            Ajuste sua busca ou remova o filtro para ver os dados simulados.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Panel>

                <ReviewQueuePanel
                  article={articles.find((article) => article.status === "in_review") ?? null}
                  onReview={(article) => {
                    setGeneratedDraft(null);
                    setSelectedArticleId(article.id);
                    setView("preview");
                  }}
                  onStartBriefing={() => setView("briefing")}
                />
              </div>
            </TabsContent>

            <TabsContent value="briefing" className="mt-5 sm:mt-6">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-6">
                <Panel className="min-w-0">
                  <PanelHeader
                    icon={<ClipboardCheck className="size-4" />}
                    title="Defina o briefing antes de criar o rascunho"
                    subtitle="A futura IA receberá esse contexto no servidor e devolverá somente uma base para revisão humana."
                    action={
                      <span className="rounded-full border border-[#ccefd5] bg-[#f3fcf5] px-2.5 py-1 text-[10px] font-extrabold text-[#16823b]">
                        Etapa 1 de 3
                      </span>
                    }
                  />
                  <div className="grid gap-4 border-t border-hairline p-4 sm:grid-cols-2 sm:p-5">
                    <div className="sm:col-span-2">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                        1. Direcionamento de busca
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                        Comece pela pergunta que o prospect pesquisaria e pelo resultado útil que o
                        conteúdo precisa entregar.
                      </p>
                    </div>
                    <FormField label="Tema" className="sm:col-span-2">
                      <Input
                        value={brief.topic}
                        onChange={(event) => updateBrief("topic", event.target.value)}
                        className="min-h-11 rounded-xl text-[13px]"
                      />
                    </FormField>
                    <FormField label="Palavra-chave principal">
                      <Input
                        value={brief.primaryKeyword}
                        onChange={(event) => updateBrief("primaryKeyword", event.target.value)}
                        className="min-h-11 rounded-xl text-[13px]"
                      />
                    </FormField>
                    <FormField label="Intenção de busca">
                      <select
                        value={brief.searchIntent}
                        onChange={(event) =>
                          updateBrief(
                            "searchIntent",
                            event.target.value as EditorialBrief["searchIntent"],
                          )
                        }
                        className="min-h-11 w-full rounded-xl border border-input bg-white px-3 text-[13px] text-ink outline-none focus:border-[#29C454] focus:ring-1 focus:ring-[#29C454]"
                      >
                        <option value="informational">Informacional</option>
                        <option value="commercial">Comercial</option>
                      </select>
                    </FormField>
                    <div className="border-t border-hairline pt-4 sm:col-span-2">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                        2. Contexto e escopo editorial
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                        Dê à equipe e ao rascunho os limites necessários para manter a pauta útil,
                        precisa e conectada à jornada do leitor.
                      </p>
                    </div>
                    <FormField label="Palavras-chave secundárias" className="sm:col-span-2">
                      <Textarea
                        value={brief.secondaryKeywords}
                        onChange={(event) => updateBrief("secondaryKeywords", event.target.value)}
                        className="min-h-20 resize-y rounded-xl text-[13px]"
                      />
                    </FormField>
                    <FormField label="Público" className="sm:col-span-2">
                      <Textarea
                        value={brief.audience}
                        onChange={(event) => updateBrief("audience", event.target.value)}
                        className="min-h-20 resize-y rounded-xl text-[13px]"
                      />
                    </FormField>
                    <FormField
                      label="Links internos que podem ser sugeridos"
                      className="sm:col-span-2"
                    >
                      <Input
                        value={brief.internalLinks}
                        onChange={(event) => updateBrief("internalLinks", event.target.value)}
                        className="min-h-11 rounded-xl text-[13px]"
                      />
                    </FormField>
                    <div className="border-t border-hairline pt-4 sm:col-span-2">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                        3. Regras antes da revisão
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                        Registre fontes, restrições e a próxima ação desejada. A aprovação humana
                        continua obrigatória depois da geração.
                      </p>
                    </div>
                    <FormField label="Fontes ou requisitos de revisão" className="sm:col-span-2">
                      <Textarea
                        value={brief.sourceRequirements}
                        onChange={(event) => updateBrief("sourceRequirements", event.target.value)}
                        className="min-h-20 resize-y rounded-xl text-[13px]"
                      />
                    </FormField>
                    <FormField label="CTA proposto" className="sm:col-span-2">
                      <Textarea
                        value={brief.callToAction}
                        onChange={(event) => updateBrief("callToAction", event.target.value)}
                        className="min-h-20 resize-y rounded-xl text-[13px]"
                      />
                    </FormField>
                    <div className="flex flex-col gap-3 rounded-xl border border-[#ccefd5] bg-[#f5fcf7] p-3.5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-xl text-[11px] leading-relaxed text-slate-text">
                        <strong className="font-extrabold text-[#16823b]">
                          Ambiente de demonstração.
                        </strong>{" "}
                        A geração abaixo é local e simulada: não há chamada de IA, armazenamento ou
                        publicação.
                      </p>
                      <Button
                        type="button"
                        onClick={generateDraft}
                        disabled={isGenerating}
                        className="min-h-11 shrink-0 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
                      >
                        {isGenerating ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                          <Sparkles className="size-4" />
                        )}
                        {isGenerating ? "Gerando mock…" : "Gerar rascunho simulado"}
                      </Button>
                    </div>
                  </div>
                </Panel>

                <SecurityBoundaryPanel />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-5 sm:mt-6">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-6">
                <Panel className="min-w-0">
                  <PanelHeader
                    icon={<FilePenLine className="size-4" />}
                    title={
                      generatedDraft
                        ? "Rascunho gerado para revisão"
                        : "Preview de conteúdo selecionado"
                    }
                    subtitle={
                      generatedDraft
                        ? "Resultado demonstrativo da interface DraftProvider."
                        : "Selecione um item da biblioteca para simular a etapa de revisão."
                    }
                    action={
                      <span className="rounded-full border border-[#ccefd5] bg-[#f3fcf5] px-2.5 py-1 text-[10px] font-extrabold text-[#16823b]">
                        Etapa 3 de 4
                      </span>
                    }
                  />
                  <div className="border-t border-hairline p-4 sm:p-5">
                    {generatedDraft ? (
                      <GeneratedDraftPreview draft={generatedDraft} />
                    ) : selectedArticle ? (
                      <ExistingArticlePreview article={selectedArticle} />
                    ) : (
                      <div className="py-14 text-center text-[13px] text-slate-text">
                        Selecione um conteúdo na biblioteca editorial.
                      </div>
                    )}
                  </div>
                </Panel>

                <div className="space-y-5">
                  <Panel className="min-w-0">
                    <PanelHeader
                      icon={<CheckCircle2 className="size-4" />}
                      title="Checklist antes de aprovar"
                      subtitle="Obrigatório no CMS definitivo."
                    />
                    <div className="space-y-3 border-t border-hairline p-4 sm:p-5">
                      {seoChecklist.map((item) => (
                        <div
                          key={item}
                          className="flex gap-2.5 text-[12px] leading-relaxed text-slate-text"
                        >
                          <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#e7f8ec] text-[#18B849]">
                            <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </Panel>

                  <Panel
                    className={cn("min-w-0", generatedDraft && "border-[#ccefd5] bg-[#f7fcf8]")}
                  >
                    <div className="p-4 sm:p-5">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                        Próxima decisão
                      </p>
                      <h3 className="mt-1 text-[16px] font-extrabold tracking-tight text-ink">
                        {generatedDraft
                          ? "Rascunho ainda precisa de revisão"
                          : "Aprovação continua humana"}
                      </h3>
                      <p className="mt-2 text-[12px] leading-relaxed text-slate-text">
                        {generatedDraft
                          ? "A geração não libera publicação. No CMS real, este rascunho seria salvo, atribuído a uma pessoa revisora e auditado antes de qualquer agendamento."
                          : "Esta ação altera apenas um status simulado no navegador. No backoffice real, aprovação exigirá permissão, auditoria e persistência no servidor."}
                      </p>
                      {generatedDraft ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setGeneratedDraft(null);
                            setView("library");
                          }}
                          className="mt-4 min-h-11 w-full rounded-xl border-[#b9ebc6] text-[12px] font-extrabold text-[#16823b] hover:bg-[#effbf2]"
                        >
                          Voltar para a biblioteca <ArrowRight className="size-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={moveReviewArticleToApproved}
                          disabled={!selectedArticle || selectedArticle.status !== "in_review"}
                          className="mt-4 min-h-11 w-full rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e] disabled:bg-slate-200 disabled:text-slate-500"
                        >
                          <CheckCircle2 className="size-4" /> Aprovar no mock
                        </Button>
                      )}
                    </div>
                  </Panel>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function WorkflowStepper({
  activeView,
  onNavigate,
}: {
  activeView: WorkspaceView;
  onNavigate: (view: WorkspaceView) => void;
}) {
  const steps: { view: WorkspaceView; label: string; detail: string; icon: LucideIcon }[] = [
    {
      view: "briefing",
      label: "1. Briefing",
      detail: "Defina o direcionamento",
      icon: ClipboardCheck,
    },
    { view: "briefing", label: "2. Rascunho", detail: "Gere uma base revisável", icon: Bot },
    { view: "preview", label: "3. Revisão", detail: "Valide SEO e fatos", icon: CheckCircle2 },
    {
      view: "library",
      label: "4. Publicação",
      detail: "Programe após aprovar",
      icon: CalendarClock,
    },
  ];

  const activeStep = activeView === "briefing" ? 0 : activeView === "preview" ? 2 : 3;

  return (
    <nav
      aria-label="Etapas do fluxo editorial"
      className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
    >
      <div className="grid grid-cols-2 gap-px bg-hairline sm:grid-cols-4">
        {steps.map(({ view, label, detail, icon: Icon }, index) => {
          const isActive = index === activeStep;
          const isComplete = index < activeStep;

          return (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(view)}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "group flex min-h-[78px] items-center gap-3 bg-white px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#29C454] sm:px-4",
                isActive ? "bg-[#f1fbf4]" : "bg-white hover:bg-slate-50",
              )}
            >
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-xl border",
                  isActive
                    ? "border-[#b9ebc6] bg-[#18B849] text-white"
                    : isComplete
                      ? "border-[#ccefd5] bg-[#ecfaef] text-[#18B849]"
                      : "border-hairline bg-slate-50 text-slate-text",
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-[11px] font-extrabold",
                    isActive ? "text-[#12843b]" : "text-ink",
                  )}
                >
                  {label}
                </span>
                <span className="mt-0.5 block truncate text-[10px] text-slate-text">{detail}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function SummaryMetric({
  label,
  value,
  description,
  tone,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  tone: "amber" | "brand" | "ink";
  icon: LucideIcon;
}) {
  const colors = {
    amber: "text-amber-600",
    brand: "text-[#18B849]",
    ink: "text-ink",
  };

  return (
    <Panel className="min-w-0">
      <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div>
          <p className="text-[11px] font-bold text-slate-text">{label}</p>
          <p className={cn("mt-1 text-[26px] font-extrabold tracking-[-0.04em]", colors[tone])}>
            {value}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-text">{description}</p>
        </div>
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-text">
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </Panel>
  );
}

function ArticleRow({
  article,
  selected,
  onSelect,
}: {
  article: EditorialArticle;
  selected: boolean;
  onSelect: () => void;
}) {
  const status = statusInfo[article.status];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "grid w-full gap-3 px-4 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#29C454] md:grid-cols-[minmax(250px,1.35fr)_minmax(150px,.8fr)_120px_42px] md:items-center md:gap-4",
        selected ? "bg-[#f2fcf5]" : "bg-white hover:bg-slate-50/70",
      )}
    >
      <div className="min-w-0">
        <p className="truncate text-[13px] font-extrabold tracking-tight text-ink">
          {article.title}
        </p>
        <p className="mt-1 truncate text-[11px] text-slate-text">
          /{article.slug} · atualizado {article.updatedAt}
        </p>
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-bold text-ink">{article.cluster}</p>
        <p className="mt-1 truncate text-[11px] text-slate-text">{article.primaryKeyword}</p>
      </div>
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold",
          status.className,
        )}
      >
        <span className={cn("size-1.5 rounded-full", status.dot)} aria-hidden="true" />
        {status.label}
      </span>
      <span className="hidden items-center justify-self-end gap-1 text-[11px] font-extrabold text-[#16823b] md:inline-flex">
        {article.status === "in_review" ? "Revisar" : "Abrir"}
        <ChevronRight className="size-3.5" aria-hidden="true" />
      </span>
    </button>
  );
}

function ReviewQueuePanel({
  article,
  onReview,
  onStartBriefing,
}: {
  article: EditorialArticle | null;
  onReview: (article: EditorialArticle) => void;
  onStartBriefing: () => void;
}) {
  const status = article ? statusInfo[article.status] : null;

  return (
    <Panel className="min-w-0">
      <PanelHeader
        icon={<ClipboardCheck className="size-4" />}
        title="Próxima revisão"
        subtitle="Priorize decisões antes de criar novos conteúdos."
        action={
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold text-amber-700">
            {article ? "1 pendência" : "Fila limpa"}
          </span>
        }
      />
      <div className="border-t border-hairline p-4 sm:p-5">
        {article && status ? (
          <>
            <div className="rounded-xl border border-[#f3dba6] bg-[#fffaf0] p-3.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-extrabold",
                  status.className,
                )}
              >
                <span className={cn("size-1.5 rounded-full", status.dot)} aria-hidden="true" />
                {status.label}
              </span>
              <p className="mt-3 text-[13px] font-extrabold leading-snug tracking-tight text-ink">
                {article.title}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[10px]">
                <div>
                  <dt className="font-bold text-slate-text">Responsável</dt>
                  <dd className="mt-0.5 font-extrabold text-ink">{article.owner}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-text">SEO atual</dt>
                  <dd className="mt-0.5 font-extrabold text-ink">{article.seoScore}/100</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-bold text-slate-text">Foco de busca</dt>
                  <dd className="mt-0.5 truncate font-extrabold text-ink">
                    {article.primaryKeyword}
                  </dd>
                </div>
              </dl>
            </div>
            <Button
              type="button"
              onClick={() => onReview(article)}
              className="mt-3 min-h-11 w-full rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
            >
              Revisar conteúdo <ArrowRight className="size-4" />
            </Button>
          </>
        ) : (
          <div className="rounded-xl border border-[#ccefd5] bg-[#f3fcf5] p-4 text-center">
            <CheckCircle2 className="mx-auto size-5 text-[#18B849]" aria-hidden="true" />
            <p className="mt-2 text-[12px] font-extrabold text-ink">Nenhuma revisão pendente</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-text">
              Comece um briefing quando houver uma nova pauta prioritária.
            </p>
          </div>
        )}
        <div className="mt-4 border-t border-hairline pt-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-text">
            Regra de operação
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-text">
            Nenhuma publicação é liberada sem revisão humana registrada.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onStartBriefing}
          className="mt-4 min-h-11 w-full rounded-xl border-[#b9ebc6] text-[12px] font-extrabold text-[#16823b] hover:bg-[#effbf2]"
        >
          Criar novo briefing <Plus className="size-4" />
        </Button>
      </div>
    </Panel>
  );
}

function SecurityBoundaryPanel() {
  return (
    <Panel className="min-w-0">
      <PanelHeader
        icon={<LockKeyhole className="size-4" />}
        title="Escopo desta demonstração"
        subtitle="O que é simulado nesta referência navegável."
      />
      <div className="space-y-4 border-t border-hairline p-4 sm:p-5 text-[12px] leading-relaxed text-slate-text">
        <div className="rounded-xl border border-[#ccefd5] bg-[#f3fcf5] p-3">
          <p className="flex items-center gap-2 font-extrabold text-[#16823b]">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            Nenhuma integração está conectada
          </p>
          <p className="mt-1 text-[11px] leading-relaxed">
            Não há sessão, banco, provedor de IA, CMS ou publicação conectados aqui.
          </p>
        </div>
        <p>
          A interface pode ser navegada para validação visual, mas seus estados voltam ao padrão ao
          atualizar a página.
        </p>
        <ul className="space-y-2 text-[11px]">
          <li className="flex gap-2">
            <Check className="mt-0.5 size-3 shrink-0 text-[#18B849]" /> Artigos, métricas e fila são
            fixtures carregadas no navegador.
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 size-3 shrink-0 text-[#18B849]" /> A geração de rascunho é uma
            simulação; nenhuma IA ou chave de API é utilizada.
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 size-3 shrink-0 text-[#18B849]" /> Aprovar no mock altera
            somente o estado da tela até o próximo reload.
          </li>
        </ul>
      </div>
    </Panel>
  );
}

function FormField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("grid gap-2 text-[12px] font-bold text-ink", className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function GeneratedDraftPreview({ draft }: { draft: DraftGenerationResult }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-text">
        <span className="rounded-full bg-[#eaf9ee] px-2.5 py-1 text-[#14883e]">
          Rascunho simulado
        </span>
        <span>Slug sugerido: /{draft.suggestedSlug}</span>
      </div>
      <h3 className="mt-5 text-[25px] font-extrabold leading-tight tracking-[-0.03em] text-ink sm:text-[32px]">
        {draft.suggestedTitle}
      </h3>
      <p className="mt-3 text-[14px] leading-relaxed text-slate-text">{draft.metaDescription}</p>
      <div className="mt-6 rounded-2xl border border-hairline bg-slate-50/70 p-4 sm:p-5">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
          Estrutura sugerida
        </p>
        <ol className="mt-3 space-y-2.5">
          {draft.outline.map((item, index) => (
            <li key={item} className="flex gap-3 text-[13px] font-bold text-ink">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white text-[10px] text-[#18B849] shadow-sm">
                {index + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <DraftList
          title="Links internos sugeridos"
          icon={Link2}
          items={draft.suggestedInternalLinks}
        />
        <DraftList
          title="Pontos para revisão humana"
          icon={CheckCircle2}
          items={draft.reviewNotes}
        />
      </div>
    </div>
  );
}

function ExistingArticlePreview({ article }: { article: EditorialArticle }) {
  const status = statusInfo[article.status];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold",
            status.className,
          )}
        >
          <span className={cn("size-1.5 rounded-full", status.dot)} aria-hidden="true" />
          {status.label}
        </span>
        <span className="text-[11px] font-bold text-slate-text">SEO: {article.seoScore}/100</span>
        <span className="text-[11px] text-slate-text">Responsável: {article.owner}</span>
      </div>
      <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
        {article.category}
      </p>
      <h3 className="mt-2 text-[25px] font-extrabold leading-tight tracking-[-0.03em] text-ink sm:text-[32px]">
        {article.title}
      </h3>
      <p className="mt-3 text-[14px] leading-relaxed text-slate-text">
        Este preview usa metadados simulados da biblioteca. Na implementação real, o editor
        renderiza o conteúdo persistido e o preview público sem indexação até a publicação.
      </p>
      <div className="mt-6 grid gap-3 rounded-2xl border border-hairline bg-slate-50/70 p-4 sm:grid-cols-3">
        <PreviewFact label="Palavra-chave" value={article.primaryKeyword} />
        <PreviewFact label="Cluster" value={article.cluster} />
        <PreviewFact
          label="Intenção"
          value={article.searchIntent === "informational" ? "Informacional" : "Comercial"}
        />
      </div>
      {article.scheduledFor ? (
        <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-[12px] font-bold text-violet-700">
          <CalendarClock className="size-3.5" /> Publicação prevista para {article.scheduledFor}
        </p>
      ) : null}
    </div>
  );
}

function PreviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-text">
        {label}
      </p>
      <p className="mt-1 text-[12px] font-bold leading-snug text-ink">{value}</p>
    </div>
  );
}

function DraftList({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: LucideIcon;
  items: readonly string[];
}) {
  return (
    <div className="rounded-2xl border border-hairline p-4">
      <p className="flex items-center gap-2 text-[12px] font-extrabold text-ink">
        <Icon className="size-3.5 text-[#18B849]" /> {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.length ? (
          items.map((item) => (
            <li key={item} className="text-[11px] leading-relaxed text-slate-text">
              {item}
            </li>
          ))
        ) : (
          <li className="text-[11px] text-slate-text">Nenhuma sugestão para este briefing.</li>
        )}
      </ul>
    </div>
  );
}
