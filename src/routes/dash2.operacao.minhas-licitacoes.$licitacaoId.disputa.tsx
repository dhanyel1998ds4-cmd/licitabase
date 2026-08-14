import { createFileRoute } from "@tanstack/react-router";
import { DisputeSessionPage } from "@/components/operations/ParticipationPages";

export const Route = createFileRoute("/dash2/operacao/minhas-licitacoes/$licitacaoId/disputa")({
  head: () => ({ meta: [{ title: "Em disputa — LicitaBase" }] }),
  component: DisputeRoute,
});

function DisputeRoute() {
  const { licitacaoId } = Route.useParams();
  return <DisputeSessionPage licitacaoId={licitacaoId} />;
}
