import { createFileRoute } from "@tanstack/react-router";
import { NewOpportunitiesPage } from "@/components/opportunities/NewOpportunitiesPage";

export const Route = createFileRoute("/dash2/oportunidades/novas")({
  head: () => ({
    meta: [
      { title: "Novas oportunidades — LicitaBase" },
      {
        name: "description",
        content: "Analise e classifique novas oportunidades de licitação no LicitaBase.",
      },
    ],
  }),
  component: NewOpportunitiesPage,
});
