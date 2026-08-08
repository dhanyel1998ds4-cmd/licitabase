import { useState } from "react";
import { ProductPreviewFrame } from "./ProductPreviewFrame";
import {
  BidBotOperationalSummaryPreview,
  BidBotOverviewPreview,
  BidDisputeDetailPreview,
  BidRankingPreview,
  BidTimelinePreview,
} from "./previews";
import { cn } from "@/lib/utils";

const screens = [
  { id: "detail", label: "Disputa Principal", node: <BidDisputeDetailPreview /> },
  { id: "overview", label: "Visão Geral", node: <BidBotOverviewPreview /> },
  { id: "ranking", label: "Ranking Fornecedores", node: <BidRankingPreview /> },
  { id: "timeline", label: "Timeline Sessão", node: <BidTimelinePreview /> },
] as const;

type ScreenId = (typeof screens)[number]["id"];

function BidBotConnectionLayer() {
  return (
    <svg className="bidbot-connections" viewBox="0 0 1000 680" preserveAspectRatio="none" aria-hidden="true">
      {/* Dynamic connections between layers */}
      <path d="M600 150 Q750 150 850 250" />
      <path d="M400 450 Q200 450 150 350" />
      <path d="M800 500 Q900 500 950 400" />
      <circle cx="850" cy="250" r="3" />
      <circle cx="150" cy="350" r="3" />
      <circle cx="950" cy="400" r="3" />
    </svg>
  );
}

function BidBotStageGlow() {
  return (
    <>
      <div className="bidbot-stage-glow" aria-hidden="true" />
      <div className="bidbot-stage-rings" aria-hidden="true" />
    </>
  );
}

export default function BidBotProductComposition() {
  const [front, setFront] = useState<ScreenId>("detail");
  const [mobileScreen, setMobileScreen] = useState<ScreenId>("detail");

  const bring = (id: ScreenId) => () => setFront(id);

  return (
    <>
      {/* Desktop / tablet composition with hierarchical stacking */}
      <div className="bidbot-composition hidden md:block" aria-live="polite">
        <BidBotConnectionLayer />

        {/* Layer 1: Overview - Top Back Right */}
        <ProductPreviewFrame
          label="Visão geral do Bot de Lances"
          className={cn("bidbot-composition__overview", front === "overview" && "bidbot-composition--front")}
          scale={0.85}
          active={front === "overview"}
          onSelect={bring("overview")}
        >
          <BidBotOverviewPreview />
        </ProductPreviewFrame>

        {/* Layer 2: Ranking - Mid Right */}
        <ProductPreviewFrame
          label="Classificação dos fornecedores"
          className={cn("bidbot-composition__ranking", front === "ranking" && "bidbot-composition--front")}
          scale={0.82}
          active={front === "ranking"}
          onSelect={bring("ranking")}
        >
          <BidRankingPreview />
        </ProductPreviewFrame>

        {/* Layer 3: Timeline - Bottom Right */}
        <ProductPreviewFrame
          label="Timeline da disputa"
          className={cn("bidbot-composition__timeline", front === "timeline" && "bidbot-composition--front")}
          scale={0.8}
          active={front === "timeline"}
          onSelect={bring("timeline")}
        >
          <BidTimelinePreview />
        </ProductPreviewFrame>

        {/* Layer 0: Primary Preview - DISPUTA PRINCIPAL */}
        <ProductPreviewFrame
          label="Detalhe da disputa principal"
          className={cn("bidbot-composition__detail", front === "detail" && "bidbot-composition--front")}
          featured
          scale={0.9}
          active={front === "detail"}
          onSelect={bring("detail")}
        >
          <BidDisputeDetailPreview />
        </ProductPreviewFrame>

        <BidBotStageGlow />
      </div>

      {/* Mobile: one legible screen at a time */}
      <div className="md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar" role="tablist" aria-label="Telas do Bot de Lances">
          {screens.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={mobileScreen === s.id}
              onClick={() => setMobileScreen(s.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-[12px] font-bold transition-all",
                mobileScreen === s.id
                  ? "border-brand-strong bg-brand-strong text-white shadow-lg"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div aria-live="polite" className="relative h-[560px] w-full rounded-2xl bg-white shadow-xl overflow-hidden border border-slate-100">
           {screens.find((s) => s.id === mobileScreen)!.node}
        </div>
      </div>
    </>
  );
}
