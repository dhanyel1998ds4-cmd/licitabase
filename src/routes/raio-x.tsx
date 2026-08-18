import { createFileRoute } from "@tanstack/react-router";
import { TenderXrayPage } from "@/components/intelligence/IntelligenceWorkspaces";
import { InternalWorkspacePage } from "@/components/layout/InternalWorkspacePage";

export const Route = createFileRoute("/raio-x")({
  head: () => ({ meta: [{ title: "Raio-X do edital — LicitaBase" }] }),
  component: () => (
    <InternalWorkspacePage>
      <TenderXrayPage />
    </InternalWorkspacePage>
  ),
});
