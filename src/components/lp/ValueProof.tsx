import type { LucideIcon } from "lucide-react";
import { ArrowRight, BarChart3, Globe2, Search, SlidersHorizontal } from "lucide-react";
import { AppButton } from "./AppButton";

type ValueMetric = {
  id: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

const VALUE_METRICS: ValueMetric[] = [
  {
    id: "opportunities",
    value: "963 mil+",
    description: "Licitações disponíveis para pesquisa em oportunidades de todo o Brasil.",
    icon: Search,
  },
  {
    id: "coverage",
    value: "Cobertura nacional",
    description:
      "Pesquise oportunidades por estado, município, órgão e outros critérios relevantes.",
    icon: Globe2,
  },
  {
    id: "filters",
    value: "Filtros combináveis",
    description: "Combine critérios e salve as buscas que sua equipe utiliza com frequência.",
    icon: SlidersHorizontal,
  },
  {
    id: "records",
    value: "400 mil+",
    description: "Use referências de compras públicas para apoiar sua análise de preços.",
    icon: BarChart3,
  },
];

function ValueSectionPattern() {
  return (
    <svg
      className="lp-value-proof__pattern"
      viewBox="0 0 1400 760"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M-100,300 C200,250 400,450 700,300 C1000,150 1200,350 1540,300"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <path
        d="M-50,150 C300,250 600,50 900,200 C1200,350 1400,150 1600,250"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function ValueMetricCard({ metric }: { metric: ValueMetric }) {
  const Icon = metric.icon;

  return (
    <li className="lp-value-card">
      <span className="lp-value-card__status" aria-hidden="true" />
      <span className="lp-value-card__icon" aria-hidden="true">
        <Icon size={28} />
      </span>
      <strong className="lp-value-card__value">{metric.value}</strong>
      <span className="lp-value-card__divider" aria-hidden="true" />
      <p>{metric.description}</p>
    </li>
  );
}

export function ValueProof() {
  return (
    <section id="prova-de-valor" className="lp-value-proof" aria-labelledby="value-section-title">
      <div className="lp-value-proof__frame">
        <div className="lp-value-proof__glow" aria-hidden="true" />

        <div className="lp-value-proof__panel">
          <ValueSectionPattern />

          <div className="lp-value-proof__content">
            <header className="lp-value-proof__header">
              <h2 id="value-section-title">
                Uma operação de licitações mais simples, organizada e{" "}
                <span>
                  previsível
                  <i aria-hidden="true" />
                </span>
              </h2>
              <p>
                Do primeiro filtro à sala de disputa, o Licitabase centraliza as etapas que mais
                consomem tempo da sua equipe.
              </p>
            </header>

            <ul className="lp-value-proof__grid">
              {VALUE_METRICS.map((metric) => (
                <ValueMetricCard key={metric.id} metric={metric} />
              ))}
            </ul>

            <div className="lp-value-proof__action">
              <AppButton
                variant="primary"
                size="lg"
                iconRight={<ArrowRight aria-hidden="true" />}
                onClick={() => window.location.assign("/signup")}
              >
                Começar agora gratuitamente
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
