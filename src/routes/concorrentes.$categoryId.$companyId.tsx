import { createFileRoute } from "@tanstack/react-router";
import { CompetitorProfilePage } from "@/components/intelligence/CompetitorsPages";

export const Route = createFileRoute("/concorrentes/$categoryId/$companyId")({
  component: CompetitorProfileRoute,
});

function CompetitorProfileRoute() {
  const { categoryId, companyId } = Route.useParams();
  return <CompetitorProfilePage categoryId={categoryId} companyId={companyId} />;
}
