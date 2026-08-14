import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bookmark, FileSearch, MapPin, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/dash2/Panel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tenders } from "@/components/tender-search/TenderSearchPage";
import { useTenderDecisions, type TenderDecision } from "@/hooks/use-tender-decisions";
import { newOpportunities } from "@/lib/new-opportunities-fixtures";
import { useOpportunityTriage } from "@/hooks/use-opportunity-triage";

const labels: Record<TenderDecision, string> = {
  favorite: "Favoritos",
  later: "Ver depois",
  interested: "Na operação",
  discarded: "Descartadas",
};
const icons = { favorite: Star, later: Bookmark, interested: Send, discarded: FileSearch };

export function TenderCollectionsPage({
  decision: initialDecision,
  title: titleOverride,
}: {
  decision: TenderDecision;
  title?: string;
}) {
  const { decisions, decide } = useTenderDecisions();
  const { triage, undo: undoTriage } = useOpportunityTriage();
  const [decision, setDecision] = useState<TenderDecision>(initialDecision);
  const Icon = icons[decision];
  const selected = tenders.filter((tender) => decisions[tender.id] === decision);
  const laterOpportunities =
    decision === "later"
      ? newOpportunities.filter((opportunity) => triage[opportunity.id]?.decision === "later")
      : [];
  const title = titleOverride ?? labels[decision];

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="space-y-5 sm:space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-bold text-brand-strong">
              {initialDecision === "interested" ? "Minha operação" : "Explorar licitações"}
            </p>
            <h1 className="mt-1 text-[24px] font-extrabold tracking-[-0.02em] text-ink sm:text-[28px]">
              {title}
            </h1>
            <p className="mt-2 text-[13px] text-slate-text">
              {decision === "interested"
                ? "Oportunidades que já entraram na sua operação."
                : "Oportunidades salvas durante sua análise."}
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="min-h-11 rounded-xl border-hairline text-[12px] font-bold"
          >
            <Link to="/dash2/licitacoes/buscar">Buscar licitações</Link>
          </Button>
        </header>
        {initialDecision === "favorite" ? (
          <Tabs value={decision} onValueChange={(value) => setDecision(value as TenderDecision)}>
            <TabsList className="h-auto max-w-full justify-start gap-1 overflow-x-auto rounded-xl border border-hairline bg-white p-1">
              <TabsTrigger value="favorite" className="min-h-10 shrink-0 text-[12px] font-bold">
                Favoritos
              </TabsTrigger>
              <TabsTrigger value="later" className="min-h-10 shrink-0 text-[12px] font-bold">
                Ver depois
              </TabsTrigger>
            </TabsList>
          </Tabs>
        ) : null}
        {selected.length || laterOpportunities.length ? (
          <div className="grid gap-3">
            {selected.map((tender) => (
              <Panel key={tender.id} className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-tint text-brand-strong">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-text">{tender.code}</span>
                      <span className="rounded-full bg-brand-tint px-2 py-1 text-[10px] font-extrabold text-brand-strong">
                        {tender.match}% aderência
                      </span>
                    </div>
                    <h2 className="mt-1.5 text-[15px] font-extrabold leading-snug text-ink">
                      {tender.title}
                    </h2>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-slate-text">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {tender.agency} · {tender.city}/{tender.state}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="min-h-11 rounded-xl border-hairline text-[12px] font-bold"
                    >
                      <Link to="/dash2/licitacoes/$licitacaoId" params={{ licitacaoId: tender.id }}>
                        Ver detalhes
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => decide(tender.id, null)}
                      className="min-h-11 rounded-xl text-[12px] font-bold text-slate-text"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </Panel>
            ))}
            {laterOpportunities.map((opportunity) => (
              <Panel key={opportunity.id} className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-tint text-brand-strong">
                    <Bookmark className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-text">
                        {opportunity.id}
                      </span>
                      <span className="rounded-full bg-brand-tint px-2 py-1 text-[10px] font-extrabold text-brand-strong">
                        {opportunity.matchScore ?? "—"}% aderência
                      </span>
                    </div>
                    <h2 className="mt-1.5 text-[15px] font-extrabold leading-snug text-ink">
                      {opportunity.title}
                    </h2>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-slate-text">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {opportunity.agency} · {opportunity.state}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="min-h-11 rounded-xl border-hairline text-[12px] font-bold"
                    >
                      <Link to="/dash2/oportunidades/novas">Abrir oportunidade</Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => undoTriage(opportunity.id)}
                      className="min-h-11 rounded-xl text-[12px] font-bold text-slate-text"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        ) : (
          <Panel className="grid min-h-[320px] place-items-center p-5 text-center sm:p-6">
            <div className="max-w-sm">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-tint text-brand-strong">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[18px] font-extrabold text-ink">
                Nenhuma oportunidade em {labels[decision].toLocaleLowerCase("pt-BR")}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-text">
                Use a busca para analisar uma licitação e salvar sua decisão aqui.
              </p>
              <Button
                asChild
                className="mt-5 min-h-11 rounded-xl bg-[#18B849] text-white hover:bg-[#139E3E]"
              >
                <Link to="/dash2/licitacoes/buscar">Ir para a busca</Link>
              </Button>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
