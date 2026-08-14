import { createFileRoute } from "@tanstack/react-router";
import { TenderCollectionsPage } from "@/components/tender-search/TenderCollectionsPage";

export const Route = createFileRoute("/dash2/oportunidades/favoritos")({
  head: () => ({ meta: [{ title: "Favoritos — LicitaBase" }] }),
  component: () => <TenderCollectionsPage decision="favorite" title="Favoritos" />,
});
