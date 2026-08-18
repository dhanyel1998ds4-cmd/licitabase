import { createFileRoute, Outlet } from "@tanstack/react-router";
import { InternalWorkspacePage } from "@/components/layout/InternalWorkspacePage";

export const Route = createFileRoute("/concorrentes")({
  head: () => ({ meta: [{ title: "Concorrentes — LicitaBase" }] }),
  component: () => (
    <InternalWorkspacePage>
      <Outlet />
    </InternalWorkspacePage>
  ),
});
