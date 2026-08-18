import { createFileRoute } from "@tanstack/react-router";
import { IntelligenceReportsPage } from "@/components/intelligence/IntelligenceWorkspaces";
import { InternalWorkspacePage } from "@/components/layout/InternalWorkspacePage";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — LicitaBase" }] }),
  component: () => (
    <InternalWorkspacePage>
      <IntelligenceReportsPage />
    </InternalWorkspacePage>
  ),
});
