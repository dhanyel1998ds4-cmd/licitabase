import { createFileRoute } from "@tanstack/react-router";
import { TenderDetailsPage } from "@/components/tender-search/TenderDetailsPage";

export const Route = createFileRoute("/dash2/licitacoes/$licitacaoId")({
  head: () => ({ meta: [{ title: "Detalhes da licitação — LicitaBase" }] }),
  component: TenderDetailsRoute,
});

function TenderDetailsRoute() {
  const { licitacaoId } = Route.useParams();
  return <TenderDetailsPage tenderId={licitacaoId} />;
}
