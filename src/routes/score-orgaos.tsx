import { createFileRoute } from "@tanstack/react-router";
import { AgencyScorePage } from "@/components/intelligence/IntelligenceWorkspaces";
import { InternalWorkspacePage } from "@/components/layout/InternalWorkspacePage";

export const Route = createFileRoute("/score-orgaos")({
  head: () => ({ meta: [{ title: "Score dos órgãos — LicitaBase" }] }),
  component: () => (
    <InternalWorkspacePage>
      <AgencyScorePage />
    </InternalWorkspacePage>
  ),
});
