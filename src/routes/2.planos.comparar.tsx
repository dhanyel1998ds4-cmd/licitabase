import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/2/planos/comparar")({
  head: () => ({
    title: "Comparar planos — Licitabase",
    meta: [
      {
        name: "description",
        content:
          "Compare preços, limites e recursos dos planos Essencial, Profissional e Enterprise do Licitabase.",
      },
    ],
  }),
  component: AlternativePricingComparison,
});

function AlternativePricingComparison() {
  return (
    <iframe
      className="block h-screen w-full border-0 bg-[#04050e]"
      src="/2/planos/comparar/index.html"
      title="Comparação de planos da segunda versão da landing page"
    />
  );
}
