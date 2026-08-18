import { createFileRoute } from "@tanstack/react-router";
import { CategoryStateResultsPage } from "@/components/opportunity-discovery/CategoryDiscoveryDetails";

export const Route = createFileRoute("/categorias/$categoryId/estado/$stateId")({
  head: ({ params }) => ({
    meta: [{ title: `Oportunidades em ${params.stateId.toUpperCase()} — LicitaBase` }],
  }),
  component: CategoryStateRoute,
});

function CategoryStateRoute() {
  const { categoryId, stateId } = Route.useParams();
  return <CategoryStateResultsPage categoryId={categoryId} stateId={stateId} />;
}
