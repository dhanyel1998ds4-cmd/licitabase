import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/2")({
  head: () => ({
    title: "Licitabase | Inteligência e automação para licitações",
    meta: [
      {
        name: "description",
        content:
          "Encontre, analise e organize licitações públicas em todo o Brasil com dados oficiais, inteligência e automação.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AlternativeLandingRedirect,
});

/**
 * A segunda landing page é estática para preservar seu HTML, animações e
 * desempenho próprios. Este fallback também permite que uma navegação feita
 * pelo roteador do app abra a versão estática sem misturar os dois CSSs.
 */
function AlternativeLandingRedirect() {
  return (
    <iframe
      className="block h-screen w-full border-0 bg-[#04050e]"
      src="/2/index.html"
      title="Licitabase — segunda versão da landing page"
    />
  );
}
