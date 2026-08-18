import { createFileRoute, Outlet } from "@tanstack/react-router";
import { InternalWorkspacePage } from "@/components/layout/InternalWorkspacePage";

export const Route = createFileRoute("/categorias")({
  head: () => ({ meta: [{ title: "Categorias de interesse — LicitaBase" }] }),
  component: () => (
    <InternalWorkspacePage>
      <Outlet />
    </InternalWorkspacePage>
  ),
});
