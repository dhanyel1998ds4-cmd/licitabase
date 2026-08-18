import { createFileRoute } from "@tanstack/react-router";
import { InterestCategoriesPage } from "@/components/opportunity-discovery/InterestCategoriesPage";
import { InternalWorkspacePage } from "@/components/layout/InternalWorkspacePage";

export const Route = createFileRoute("/categorias")({
  head: () => ({ meta: [{ title: "Categorias de interesse — LicitaBase" }] }),
  component: () => (
    <InternalWorkspacePage>
      <InterestCategoriesPage />
    </InternalWorkspacePage>
  ),
});
