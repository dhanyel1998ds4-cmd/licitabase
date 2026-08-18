import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Topbar } from "@/components/dash2/Topbar";
import { OperationPipelinePage } from "@/components/operations/OperationPipelinePage";

export const Route = createFileRoute("/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline de licitações — LicitaBase" }] }),
  component: PipelineRoute,
});

function PipelineRoute() {
  return (
    <AppLayout contentClassName="flex h-full min-h-0 flex-col overflow-hidden bg-white p-0 font-manrope">
      <Topbar />
      <OperationPipelinePage mode="pipeline" />
    </AppLayout>
  );
}
