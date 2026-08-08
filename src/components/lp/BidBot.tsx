import { useEffect, useRef, useState } from "react";
import { BidBotMarketingCopy } from "./bidbot/BidBotMarketingCopy";
import BidBotProductComposition from "./bidbot/BidBotProductComposition";

export function BidBot() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="bot-de-lances" className="lp-bidbot-section">
      <div className="lp-bidbot-section__ambient" aria-hidden="true" />
      <div className="lp-bidbot-section__container">
        <div className="lp-bidbot-section__content">
          <BidBotMarketingCopy />
        </div>
        <div className="lp-bidbot-section__visual" ref={ref}>
          {visible ? <BidBotProductComposition /> : <div className="bidbot-skeleton" aria-hidden="true" />}
        </div>
      </div>
    </section>
  );
}
