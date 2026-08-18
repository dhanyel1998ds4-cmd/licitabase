import { createFileRoute } from "@tanstack/react-router";
import { InterestCategoriesPage } from "@/components/opportunity-discovery/InterestCategoriesPage";

export const Route = createFileRoute("/categorias/")({
  component: InterestCategoriesPage,
});
