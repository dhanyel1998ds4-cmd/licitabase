import { createFileRoute } from "@tanstack/react-router";
import { TenderSearchPage } from "@/components/tender-search/TenderSearchPage";

export const Route = createFileRoute("/dash2/licitacoes/buscar")({
  head: () => ({
    meta: [
      { title: "Buscar licitações — LicitaBase" },
      {
        name: "description",
        content: "Encontre licitações abertas por palavras-chave, filtros ou busca inteligente.",
      },
    ],
  }),
  component: TenderSearchPage,
});
