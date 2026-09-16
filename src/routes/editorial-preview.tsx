import { createFileRoute } from "@tanstack/react-router";
import { EditorialBackofficePrototype } from "@/features/editorial/EditorialBackofficePrototype";
import { noIndexNoFollow } from "@/lib/seo";

/**
 * Referência navegável para validar o futuro backoffice editorial. Não há
 * autenticação, IA, persistência ou publicação conectadas neste protótipo.
 */
export const Route = createFileRoute("/editorial-preview")({
  head: () => ({
    meta: [{ title: "Protótipo editorial — LicitaBase" }, noIndexNoFollow],
  }),
  component: EditorialPreviewRoute,
});

function EditorialPreviewRoute() {
  return <EditorialBackofficePrototype />;
}
