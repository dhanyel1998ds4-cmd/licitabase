import { createFileRoute } from "@tanstack/react-router";
import { SavedTenderFiltersPage } from "@/components/tender-search/SavedTenderFiltersPage";

export const Route = createFileRoute("/dash2/licitacoes/filtros-salvos")({
  head: () => ({
    meta: [
      { title: "Filtros salvos — LicitaBase" },
      { name: "description", content: "Gerencie buscas salvas e alertas de novas licitações." },
    ],
  }),
  component: SavedTenderFiltersPage,
});
