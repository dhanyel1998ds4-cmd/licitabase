import { createFileRoute } from "@tanstack/react-router";
import { InvoicePage } from "@/components/account/InvoicePage";

export const Route = createFileRoute("/dash2/configuracoes/faturas/$invoiceId")({
  head: () => ({ meta: [{ title: "Fatura — LicitaBase" }] }),
  component: InvoiceRoute,
});

function InvoiceRoute() {
  const { invoiceId } = Route.useParams();
  return <InvoicePage invoiceId={invoiceId} />;
}
