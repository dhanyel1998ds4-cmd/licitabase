import { createFileRoute, notFound } from "@tanstack/react-router";
import { EditorialBackofficePrototype } from "@/features/editorial/EditorialBackofficePrototype";
import { noIndexNoFollow } from "@/lib/seo";

/**
 * Referência navegável apenas em desenvolvimento. Em builds de preview e
 * produção a rota retorna 404, portanto não integra nem expõe o produto.
 */
const isLocalDevelopment = import.meta.env.DEV;

export const Route = createFileRoute("/editorial-preview")({
  beforeLoad: () => {
    if (!isLocalDevelopment) {
      throw notFound();
    }
  },
  head: () => ({
    meta: [{ title: "Referência editorial local — LicitaBase" }, noIndexNoFollow],
  }),
  component: EditorialPreviewRoute,
});

function EditorialPreviewRoute() {
  return <EditorialBackofficePrototype />;
}
