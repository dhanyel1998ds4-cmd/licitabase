import { createFileRoute } from "@tanstack/react-router";
import { thankYouSearchSchema } from "@/lib/thank-you-search";
import { ThankYouPage } from "./obrigado";

export const Route = createFileRoute("/obrigado-assinatura")({
  validateSearch: thankYouSearchSchema,
  head: () => ({
    title: "Assinatura confirmada | LicitaBase",
    meta: [
      {
        name: "description",
        content:
          "Confirmação da assinatura LicitaBase e próximos passos para começar sua operação.",
      },
      { property: "og:title", content: "Assinatura confirmada | LicitaBase" },
      {
        property: "og:description",
        content: "Sua assinatura foi confirmada. Configure sua operação na LicitaBase.",
      },
    ],
  }),
  component: ThankYouSubscriptionPage,
});

function ThankYouSubscriptionPage() {
  return <ThankYouPage search={Route.useSearch()} />;
}
