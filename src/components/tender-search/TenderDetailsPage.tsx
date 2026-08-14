import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ExternalLink,
  FileText,
  MapPin,
  Send,
  Star,
  Store,
  Target,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/dash2/Panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tenders } from "@/components/tender-search/TenderSearchPage";
import { useTenderDecisions, type TenderDecision } from "@/hooks/use-tender-decisions";
import { cn } from "@/lib/utils";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function decisionLabel(decision?: TenderDecision) {
  switch (decision) {
    case "favorite":
      return "Favorita";
    case "later":
      return "Ver depois";
    case "interested":
      return "Na operação";
    case "discarded":
      return "Descartada";
    default:
      return "";
  }
}

export function TenderDetailsPage({ tenderId }: { tenderId: string }) {
  const tender = tenders.find((item) => item.id === tenderId);
  const { decisions, decide } = useTenderDecisions();
  const [tab, setTab] = useState("overview");

  if (!tender) {
    return (
      <div className="grid min-h-0 flex-1 place-items-center px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
        <Panel className="max-w-lg p-5 text-center sm:p-6">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600">
            <CircleAlert className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-[18px] font-extrabold text-ink">Licitação não encontrada</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-text">
            Este resultado pode ter sido removido ou o link não está mais disponível.
          </p>
          <Button
            asChild
            className="mt-5 h-11 rounded-xl bg-[#18B849] text-white hover:bg-[#139E3E]"
          >
            <Link to="/dash2/licitacoes/buscar">Voltar para a busca</Link>
          </Button>
        </Panel>
      </div>
    );
  }

  const decision = decisions[tender.id];
  const updateDecision = (next: TenderDecision | null) => {
    const previous = decision;
    decide(tender.id, next);

    if (next === "discarded") {
      toast("Oportunidade descartada", {
        description: "Ela foi removida da sua fila de análise.",
        action: { label: "Desfazer", onClick: () => decide(tender.id, previous ?? null) },
      });
      return;
    }

    const messages: Record<Exclude<TenderDecision, "discarded">, string> = {
      favorite: "Adicionada aos favoritos.",
      later: "Salva para você revisar depois.",
      interested: "Licitação adicionada à sua operação.",
    };
    if (next) toast.success(messages[next]);
  };

  const items =
    tender.category === "Equipamentos de TI"
      ? [
          "Notebook 15,6” Full HD, antirreflexo",
          "Processador Intel Core i5 de 13ª geração ou superior",
          "Memória RAM de 16 GB e SSD NVMe de 512 GB",
          "Windows 11 Pro, Wi-Fi 6 e Bluetooth 5.2",
          "Garantia on-site de 36 meses",
        ]
      : tender.specifications;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="space-y-5 sm:space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            asChild
            variant="ghost"
            className="min-h-11 rounded-xl px-2 text-[12px] font-bold text-ink hover:bg-white"
          >
            <Link to="/dash2/licitacoes/buscar">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Voltar para resultados
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            {decision ? (
              <span className="rounded-full bg-brand-tint px-3 py-1.5 text-[11px] font-extrabold text-brand-strong">
                {decisionLabel(decision)}
              </span>
            ) : null}
            <span
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] font-extrabold",
                tender.status === "Aberto"
                  ? "bg-[#EAF2FF] text-[#215EC9]"
                  : "bg-orange-50 text-orange-600",
              )}
            >
              {tender.status}
            </span>
          </div>
        </div>

        <header className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-tint px-2.5 py-1 text-[10px] font-extrabold text-brand-strong">
                {tender.modality}
              </span>
              <span className="text-[12px] font-bold text-slate-text">{tender.code}</span>
              <span className="rounded-full border border-hairline bg-white px-2.5 py-1 text-[10px] font-bold text-slate-text">
                {tender.platform}
              </span>
            </div>
            <h1 className="mt-3 max-w-5xl text-[23px] font-extrabold leading-tight tracking-[-0.025em] text-ink sm:text-[28px]">
              {tender.title}
            </h1>
            <p className="mt-3 text-[14px] font-medium leading-relaxed text-slate-text">
              {tender.agency} · {tender.city}/{tender.state}
            </p>
          </div>
          <Panel className="p-4 sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-text">
              Aderência estimada
            </p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <p className="text-[36px] font-extrabold leading-none text-[#20B94C]">
                {tender.match}%
              </p>
              <Target className="mb-1 size-5 text-brand-strong" aria-hidden="true" />
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-text">
              Compatível com suas categorias, histórico e produtos cadastrados.
            </p>
          </Panel>
        </header>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-5">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="h-auto max-w-full justify-start gap-1 overflow-x-auto rounded-xl border border-hairline bg-white p-1">
                <TabsTrigger value="overview" className="min-h-10 shrink-0 text-[12px] font-bold">
                  Visão geral
                </TabsTrigger>
                <TabsTrigger value="items" className="min-h-10 shrink-0 text-[12px] font-bold">
                  Itens
                </TabsTrigger>
                <TabsTrigger value="documents" className="min-h-10 shrink-0 text-[12px] font-bold">
                  Documentos
                </TabsTrigger>
                <TabsTrigger
                  value="requirements"
                  className="min-h-10 shrink-0 text-[12px] font-bold"
                >
                  Requisitos
                </TabsTrigger>
                <TabsTrigger value="history" className="min-h-10 shrink-0 text-[12px] font-bold">
                  Histórico
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-5">
                <Panel className="p-4 sm:p-5">
                  <h2 className="text-[16px] font-extrabold text-ink">Resumo da oportunidade</h2>
                  <p className="mt-3 text-[13px] leading-relaxed text-slate-text">
                    {tender.title} O processo é conduzido pela plataforma {tender.platform}, na
                    modalidade {tender.modality.toLocaleLowerCase("pt-BR")}.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailItem icon={Building2} label="Órgão" value={tender.agency} />
                    <DetailItem icon={Store} label="Plataforma" value={tender.platform} />
                    <DetailItem
                      icon={MapPin}
                      label="Localização"
                      value={`${tender.city} · ${tender.state}`}
                    />
                    <DetailItem icon={CalendarDays} label="Abertura" value={tender.opening} />
                    <DetailItem
                      icon={Clock3}
                      label="Propostas até"
                      value={tender.proposalDeadline}
                    />
                    <DetailItem
                      icon={Target}
                      label="Valor estimado"
                      value={currency.format(tender.value)}
                    />
                  </div>
                </Panel>
                <Panel className="border-[#29C454]/25 bg-[linear-gradient(100deg,#F0FCF4,#FFFFFF)] p-4 sm:p-5">
                  <div className="flex gap-3">
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-brand-strong"
                      aria-hidden="true"
                    />
                    <div>
                      <h2 className="text-[15px] font-extrabold text-[#176C36]">
                        Por que esta licitação combina com sua empresa
                      </h2>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-text">
                        Sua empresa possui itens e categorias compatíveis. O prazo permite
                        preparação e a estimativa está dentro da faixa de oportunidades priorizadas.
                      </p>
                    </div>
                  </div>
                </Panel>
              </TabsContent>

              <TabsContent value="items">
                <Panel className="p-4 sm:p-5">
                  <h2 className="text-[16px] font-extrabold text-ink">Itens e especificações</h2>
                  <ul className="mt-4 space-y-3">
                    {items.map((item, index) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-xl border border-hairline bg-page/35 p-3 text-[13px] leading-relaxed text-slate-text"
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-brand-tint text-[11px] font-extrabold text-brand-strong">
                          {index + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Panel>
              </TabsContent>

              <TabsContent value="documents">
                <DocumentPanel />
              </TabsContent>
              <TabsContent value="requirements">
                <RequirementsPanel />
              </TabsContent>
              <TabsContent value="history">
                <HistoryPanel />
              </TabsContent>
            </Tabs>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-0">
            <Panel className="p-4 sm:p-5">
              <h2 className="text-[15px] font-extrabold text-ink">
                Decidir sobre esta oportunidade
              </h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-slate-text">
                Registre sua decisão para manter a fila e a operação organizadas.
              </p>
              <div className="mt-4 grid gap-2">
                <Button
                  type="button"
                  onClick={() => updateDecision("interested")}
                  className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139E3E]"
                >
                  <Send className="size-4" aria-hidden="true" />
                  Tenho interesse
                </Button>
                {decision === "interested" ? (
                  <Button
                    asChild
                    variant="outline"
                    className="min-h-11 rounded-xl border-[#29C454]/35 text-[12px] font-extrabold text-brand-strong"
                  >
                    <Link to="/dash2/operacao/minhas-licitacoes">Ver na operação</Link>
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => updateDecision(decision === "favorite" ? null : "favorite")}
                  className="min-h-11 rounded-xl border-hairline text-[12px] font-extrabold"
                >
                  <Star
                    className={cn(
                      "size-4",
                      decision === "favorite" && "fill-brand text-brand-strong",
                    )}
                    aria-hidden="true"
                  />
                  {decision === "favorite" ? "Remover favorito" : "Favoritar"}
                </Button>
                {decision === "favorite" ? (
                  <Button
                    asChild
                    variant="outline"
                    className="min-h-11 rounded-xl border-[#29C454]/35 text-[12px] font-extrabold text-brand-strong"
                  >
                    <Link to="/dash2/oportunidades/favoritos">Ver favoritos</Link>
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => updateDecision("later")}
                  className="min-h-11 rounded-xl border-hairline text-[12px] font-extrabold"
                >
                  <Bookmark className="size-4" aria-hidden="true" />
                  Ver depois
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => updateDecision("discarded")}
                  className="min-h-11 rounded-xl text-[12px] font-extrabold text-slate-text hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  Descartar
                </Button>
              </div>
            </Panel>
            <Panel className="p-4 sm:p-5">
              <h2 className="text-[14px] font-extrabold text-ink">Próximos prazos</h2>
              <dl className="mt-3 divide-y divide-hairline text-[12px]">
                <div className="flex justify-between gap-3 py-2.5 first:pt-0">
                  <dt className="text-slate-text">Propostas</dt>
                  <dd className="text-right font-bold text-ink">{tender.proposalDeadline}</dd>
                </div>
                <div className="flex justify-between gap-3 py-2.5">
                  <dt className="text-slate-text">Disputa</dt>
                  <dd className="text-right font-bold text-ink">{tender.disputeAt}</dd>
                </div>
              </dl>
            </Panel>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-page/35 p-3">
      <Icon className="size-4 text-brand-strong" aria-hidden="true" />
      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.07em] text-slate-text">
        {label}
      </p>
      <p className="mt-1 text-[12px] font-bold leading-snug text-ink">{value}</p>
    </div>
  );
}

function DocumentPanel() {
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-extrabold text-ink">Documentos disponíveis</h2>
          <p className="mt-1 text-[13px] text-slate-text">
            Edital, anexos e arquivos de referência do processo.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="min-h-11 rounded-xl border-hairline text-[12px] font-bold"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Abrir portal
        </Button>
      </div>
      <div className="mt-4 space-y-2">
        {["Edital e anexos", "Termo de referência", "Modelo de proposta"].map((file) => (
          <div
            key={file}
            className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-hairline px-3"
          >
            <span className="flex items-center gap-2 text-[13px] font-bold text-ink">
              <FileText className="size-4 text-brand-strong" aria-hidden="true" />
              {file}
            </span>
            <Button
              type="button"
              variant="ghost"
              className="min-h-10 text-[11px] font-bold text-brand-strong"
            >
              Ver
            </Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function RequirementsPanel() {
  return (
    <Panel className="p-4 sm:p-5">
      <h2 className="text-[16px] font-extrabold text-ink">Requisitos identificados</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          "Documentação fiscal válida",
          "Atestado de capacidade técnica",
          "Garantia mínima de 36 meses",
          "Entrega conforme cronograma",
        ].map((item) => (
          <div
            key={item}
            className="flex gap-2 rounded-xl border border-hairline p-3 text-[13px] font-medium text-slate-text"
          >
            <CheckCircle2 className="size-4 shrink-0 text-brand-strong" aria-hidden="true" />
            {item}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function HistoryPanel() {
  return (
    <Panel className="p-4 sm:p-5">
      <h2 className="text-[16px] font-extrabold text-ink">Histórico do processo</h2>
      <ol className="mt-4 space-y-4 border-l border-hairline pl-4">
        {[
          ["Publicação do edital", "05 ago 2026"],
          ["Atualização de documentos", "11 ago 2026"],
          ["Abertura da sessão", "23 ago 2026"],
        ].map(([title, date]) => (
          <li key={title} className="relative text-[13px]">
            <span className="absolute -left-[21px] top-1 size-2 rounded-full bg-brand" />
            <p className="font-bold text-ink">{title}</p>
            <p className="mt-0.5 text-slate-text">{date}</p>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
