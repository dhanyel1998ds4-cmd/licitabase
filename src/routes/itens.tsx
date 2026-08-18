import { createFileRoute } from "@tanstack/react-router";
import { BidItemsPage } from "@/components/opportunity-discovery/BidItemsPage";
import { InternalWorkspacePage } from "@/components/layout/InternalWorkspacePage";

export const Route = createFileRoute("/itens")({
  head: () => ({ meta: [{ title: "Itens de licitação — LicitaBase" }] }),
  component: () => (
    <InternalWorkspacePage>
      <BidItemsPage />
    </InternalWorkspacePage>
  ),
});
