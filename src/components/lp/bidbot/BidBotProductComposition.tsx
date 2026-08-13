import { useState, type KeyboardEvent } from "react";
import { Gavel, History, LayoutDashboard, Trophy, type LucideIcon } from "lucide-react";
import { ProductPreviewFrame } from "./ProductPreviewFrame";
import {
  BidBotOverviewPreview,
  BidDisputeDetailPreview,
  BidRankingPreview,
  BidTimelinePreview,
} from "./previews";
import { cn } from "@/lib/utils";

const SCREENS = [
  {
    id: "detail",
    label: "Disputa principal",
    mobileLabel: "Disputa",
    icon: Gavel,
    node: <BidDisputeDetailPreview />,
  },
  {
    id: "overview",
    label: "Visão geral",
    mobileLabel: "Visão geral",
    icon: LayoutDashboard,
    node: <BidBotOverviewPreview />,
  },
  {
    id: "ranking",
    label: "Ranking de fornecedores",
    mobileLabel: "Ranking",
    icon: Trophy,
    node: <BidRankingPreview />,
  },
  {
    id: "timeline",
    label: "Timeline da sessão",
    mobileLabel: "Timeline",
    icon: History,
    node: <BidTimelinePreview />,
  },
] as const;

type ScreenId = (typeof SCREENS)[number]["id"];

function BidBotConnectionLayer() {
  return (
    <svg
      className="bidbot-connections"
      viewBox="0 0 1000 680"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
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

  const selectMobileScreen = (id: ScreenId, moveFocus = false) => {
    setMobileScreen(id);
    if (moveFocus) {
      window.requestAnimationFrame(() => document.getElementById(`bidbot-tab-${id}`)?.focus());
    }
  };

  const handleMobileTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentId: ScreenId) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const currentIndex = SCREENS.findIndex((screen) => screen.id === currentId);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + SCREENS.length) % SCREENS.length;
    const nextScreen = SCREENS[nextIndex];
    if (nextScreen) selectMobileScreen(nextScreen.id, true);
  };

  const activeMobileScreen = SCREENS.find((screen) => screen.id === mobileScreen)!;
  const activeMobileIndex = SCREENS.findIndex((screen) => screen.id === mobileScreen);

  return (
    <>
      {/* Desktop / tablet composition with hierarchical stacking */}
      <div className="bidbot-composition hidden md:block" aria-live="polite">
        <BidBotConnectionLayer />

        {/* Layer 1: Overview - Top Back Right */}
        <ProductPreviewFrame
          label="Visão geral do Bot de Lances"
          className={cn(
            "bidbot-composition__overview",
            front === "overview" && "bidbot-composition--front",
          )}
          scale={0.85}
          active={front === "overview"}
          onSelect={bring("overview")}
        >
          <BidBotOverviewPreview />
        </ProductPreviewFrame>

        {/* Layer 2: Ranking - Mid Right */}
        <ProductPreviewFrame
          label="Classificação dos fornecedores"
          className={cn(
            "bidbot-composition__ranking",
            front === "ranking" && "bidbot-composition--front",
          )}
          scale={0.82}
          active={front === "ranking"}
          onSelect={bring("ranking")}
        >
          <BidRankingPreview />
        </ProductPreviewFrame>

        {/* Layer 3: Timeline - Bottom Right */}
        <ProductPreviewFrame
          label="Timeline da disputa"
          className={cn(
            "bidbot-composition__timeline",
            front === "timeline" && "bidbot-composition--front",
          )}
          scale={0.8}
          active={front === "timeline"}
          onSelect={bring("timeline")}
        >
          <BidTimelinePreview />
        </ProductPreviewFrame>

        {/* Layer 0: Primary Preview - DISPUTA PRINCIPAL */}
        <ProductPreviewFrame
          label="Detalhe da disputa principal"
          className={cn(
            "bidbot-composition__detail",
            front === "detail" && "bidbot-composition--front",
          )}
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
      <div className="bidbot-mobile md:hidden">
        <div
          className="bidbot-mobile__tabs no-scrollbar"
          role="tablist"
          aria-label="Telas do Bot de Lances"
        >
          {SCREENS.map((s) => {
            const Icon = s.icon as LucideIcon;
            return (
              <button
                key={s.id}
                id={`bidbot-tab-${s.id}`}
                type="button"
                role="tab"
                aria-selected={mobileScreen === s.id}
                aria-controls={`bidbot-panel-${s.id}`}
                tabIndex={mobileScreen === s.id ? 0 : -1}
                onClick={() => selectMobileScreen(s.id)}
                onKeyDown={(event) => handleMobileTabKeyDown(event, s.id)}
                className={cn(
                  "bidbot-mobile__tab",
                  mobileScreen === s.id ? "bidbot-mobile__tab--active" : "bidbot-mobile__tab--idle",
                )}
              >
                <span className="bidbot-mobile__tab-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span>{s.mobileLabel}</span>
              </button>
            );
          })}
        </div>
        <div className="bidbot-mobile__context" aria-hidden="true">
          <span>Explore a interface</span>
          <span>
            {activeMobileIndex + 1} de {SCREENS.length}
          </span>
        </div>
        <div
          id={`bidbot-panel-${mobileScreen}`}
          role="tabpanel"
          aria-labelledby={`bidbot-tab-${mobileScreen}`}
          aria-live="polite"
          className="bidbot-mobile__panel"
        >
          {activeMobileScreen.node}
        </div>
      </div>
    </>
  );
}
