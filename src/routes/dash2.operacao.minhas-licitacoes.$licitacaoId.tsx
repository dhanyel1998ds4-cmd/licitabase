import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { ParticipationDetailsPage } from "@/components/operations/ParticipationPages";

export const Route = createFileRoute("/dash2/operacao/minhas-licitacoes/$licitacaoId")({
  head: () => ({ meta: [{ title: "Participação — LicitaBase" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
  }),
  component: ParticipationRoute,
});

function ParticipationRoute() {
  const location = useLocation();
  const { tab } = Route.useSearch();
  const { licitacaoId } = Route.useParams();
  const isDetails =
    !location.pathname.endsWith("/proposta") && !location.pathname.endsWith("/disputa");
  if (!isDetails) return <Outlet />;
  return <ParticipationDetailsPage licitacaoId={licitacaoId} initialTab={tab} />;
}
