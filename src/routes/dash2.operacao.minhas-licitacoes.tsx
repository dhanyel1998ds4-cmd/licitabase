import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { OperationPipelinePage } from "@/components/operations/OperationPipelinePage";

export const Route = createFileRoute("/dash2/operacao/minhas-licitacoes")({
  head: () => ({ meta: [{ title: "Minhas licitações — LicitaBase" }] }),
  component: OperationRoute,
});

function OperationRoute() {
  const location = useLocation();
  const isIndex = location.pathname === "/dash2/operacao/minhas-licitacoes";
  return isIndex ? <OperationPipelinePage /> : <Outlet />;
}
