import { createFileRoute } from "@tanstack/react-router";
import { ProposalEditorPage } from "@/components/operations/ParticipationPages";

export const Route = createFileRoute("/dash2/operacao/minhas-licitacoes/$licitacaoId/proposta")({
  head: () => ({ meta: [{ title: "Preparar proposta — LicitaBase" }] }),
  component: ProposalRoute,
});

function ProposalRoute() {
  const { licitacaoId } = Route.useParams();
  return <ProposalEditorPage licitacaoId={licitacaoId} />;
}
