import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { CategoryDiscoveryPage } from "@/components/opportunity-discovery/CategoryDiscoveryDetails";

export const Route = createFileRoute("/categorias/$categoryId")({
  head: ({ params }) => ({
    meta: [{ title: `${params.categoryId} — Categorias de interesse | LicitaBase` }],
  }),
  component: CategoryRoute,
});

function CategoryRoute() {
  const { categoryId } = Route.useParams();
  const location = useLocation();
  return location.pathname.includes("/estado/") ? (
    <Outlet />
  ) : (
    <CategoryDiscoveryPage categoryId={categoryId} />
  );
}
