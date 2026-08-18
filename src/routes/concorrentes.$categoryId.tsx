import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { CompetitorRankingPage } from "@/components/intelligence/CompetitorsPages";

export const Route = createFileRoute("/concorrentes/$categoryId")({
  component: CompetitorRankingRoute,
});

function CompetitorRankingRoute() {
  const { categoryId } = Route.useParams();
  const location = useLocation();
  return location.pathname.split("/").filter(Boolean).length > 2 ? (
    <Outlet />
  ) : (
    <CompetitorRankingPage categoryId={categoryId} />
  );
}
