import { createFileRoute } from "@tanstack/react-router";
import { DocumentsVaultPage } from "@/components/operations/DocumentsVaultPage";
import { InternalWorkspacePage } from "@/components/layout/InternalWorkspacePage";

export const Route = createFileRoute("/documentos")({
  head: () => ({ meta: [{ title: "Documentos — LicitaBase" }] }),
  component: DocumentsRoute,
});

function DocumentsRoute() {
  return (
    <InternalWorkspacePage>
      <DocumentsVaultPage />
    </InternalWorkspacePage>
  );
}
