import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Scale, Star } from "lucide-react";
import { AppButton } from "./AppButton";
import { cn } from "@/lib/utils";
import { pricingPlans, type BillingCycle } from "@/lib/pricing-data";

interface PlanFeature {
  text: string;
  icon: LucideIcon;
}

const PricingFeature = ({
  text,
  icon: Icon,
  featured,
}: PlanFeature & { featured?: boolean | undefined }) => (
  <li className="pricing-card__feature">
    <span
      className={cn(
        "pricing-card__feature-icon",
        featured && "pricing-card__feature-icon--featured",
      )}
    >
      <Icon aria-hidden="true" />
    </span>
    <span>{text}</span>
  </li>
);

interface PricingFeatureListProps {
  features: PlanFeature[];
  featured?: boolean | undefined;
}

const PricingFeatureList = ({ features, featured }: PricingFeatureListProps) => (
  <ul className="pricing-card__features">
    {features.map((feature) => (
      <PricingFeature key={feature.text} {...feature} featured={featured} />
    ))}
  </ul>
);

interface PricingPlanIconProps {
  icon: LucideIcon;
}

const PricingPlanIcon = ({ icon: Icon }: PricingPlanIconProps) => (
  <div className="pricing-card__icon group">
    <Icon aria-hidden="true" />
  </div>
);

interface PricingCardProps {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  features: PlanFeature[];
  cta: string;
  featured?: boolean | undefined;
  badge?: string | undefined;
  prices: {
    monthly: { amount: number; billedTotal: number | null };
  };
}

const PricingCard = ({
  id,
  name,
  subtitle,
  description,
  icon,
  features,
  cta,
  featured,
  badge,
  prices,
}: PricingCardProps) => {
  const isEnterprise = id === "enterprise";
  const currentPrice = prices.monthly;
  const formattedAmount = new Intl.NumberFormat("pt-BR").format(currentPrice.amount);

  return (
    <article className={cn("pricing-card", featured && "pricing-card--featured")}>
      {featured && badge && (
        <div className="pricing-card__badge">
          <Star size={14} fill="white" aria-hidden="true" />
          <span>{badge}</span>
        </div>
      )}

      <header className="pricing-card__heading">
        <PricingPlanIcon icon={icon} />
        <div>
          <h3>{name}</h3>
          <p>{subtitle}</p>
        </div>
      </header>

      <div className="pricing-card__divider" />

      <div className="pricing-card__price-block" aria-live="polite">
        <div className="pricing-card__price">
          <span className="pricing-card__currency">R$</span>
          <strong>{formattedAmount}</strong>
          <span className="pricing-card__period">/mês</span>
        </div>

        <p className="pricing-card__annual-charge">Cobrança mensal.</p>
      </div>

      <p className="pricing-card__audience">{description}</p>

      <PricingFeatureList features={features} featured={featured} />

      <div className="pricing-card__action">
        <AppButton
          variant={!featured && !isEnterprise ? "light-pricing" : isEnterprise ? "dark" : "primary"}
          fullWidth
          onClick={() => (window.location.href = "/signup")}
        >
          {cta}
        </AppButton>
      </div>
    </article>
  );
};

const PricingSectionHeader = () => (
  <header className="pricing-section__header">
    <h2 id="pricing-title">Escolha o nível de operação ideal para sua empresa</h2>
    <p>
      Comece estruturando sua busca e evolua para integrações e automações conforme sua operação
      crescer.
    </p>
  </header>
);

const PricingGrid = ({ children }: { children: ReactNode }) => (
  <div className="pricing-grid">{children}</div>
);

const PricingCompareLink = ({ billingCycle }: { billingCycle: BillingCycle }) => (
  <div className="flex justify-center">
    <Link
      to="/planos/comparar"
      search={{ ciclo: billingCycle }}
      className="pricing-section__compare"
    >
      <div className="pricing-section__compare-icon">
        <Scale aria-hidden="true" />
      </div>
      <span className="pricing-section__compare-label pricing-section__compare-label--desktop">
        Comparar todos os recursos dos planos
      </span>
      <span className="pricing-section__compare-label pricing-section__compare-label--mobile">
        Comparar recursos dos planos
      </span>
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  </div>
);

export function Pricing() {
  const billingCycle: BillingCycle = "monthly";

  return (
    <section id="planos" className="pricing-section" aria-labelledby="pricing-title">
      <div className="pricing-section__ambient" aria-hidden="true" />

      <div className="pricing-section__container">
        <PricingSectionHeader />

        <PricingGrid>
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </PricingGrid>

        <PricingCompareLink billingCycle={billingCycle} />
      </div>
    </section>
  );
}
