import { createFileRoute } from "@tanstack/react-router";
import { IntegrationsPage } from "@/components/management/IntegrationsPage";
import { InternalWorkspacePage } from "@/components/layout/InternalWorkspacePage";

export const Route = createFileRoute("/integracoes")({
  head: () => ({ meta: [{ title: "Integrações — LicitaBase" }] }),
  component: () => (
    <InternalWorkspacePage>
      <IntegrationsPage />
    </InternalWorkspacePage>
  ),
});
