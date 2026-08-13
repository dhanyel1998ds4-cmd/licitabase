import type { LucideIcon } from "lucide-react";
import { ArrowRight, BarChart3, ListChecks, Target } from "lucide-react";
import { AppButton } from "./AppButton";

type OperationStep = {
  id: string;
  icon: LucideIcon;
  title: string;
  text: string;
};

const OPERATION_STEPS: OperationStep[] = [
  {
    id: "criteria",
    icon: Target,
    title: "Defina o que procura",
    text: "Selecione categorias, regiões, modalidades, valores e os demais critérios importantes para sua operação.",
  },
  {
    id: "monitoring",
    icon: BarChart3,
    title: "Receba novas oportunidades",
    text: "O Licitabase monitora as publicações e organiza as oportunidades alinhadas aos critérios configurados.",
  },
  {
    id: "pipeline",
    icon: ListChecks,
    title: "Monte seu pipeline",
    text: "Analise, priorize ou descarte oportunidades e acompanhe as melhores até a disputa.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="lp-how-it-works" aria-labelledby="how-it-works-title">
      <div className="lp-how-it-works__container">
        <header className="lp-how-it-works__header">
          <h2 id="how-it-works-title">Pare de procurar edital por edital</h2>
          <p>
            Configure os critérios importantes para sua empresa e use o Licitabase para encontrar,
            selecionar e acompanhar oportunidades com mais consistência.
          </p>
          <blockquote>
            <span aria-hidden="true" />
            “Menos tempo filtrando oportunidades. Mais tempo preparando propostas competitivas.”
          </blockquote>
        </header>

        <ol className="lp-how-it-works__grid">
          {OPERATION_STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <li key={step.id} className="lp-operation-step">
                <div className="lp-operation-step__topline">
                  <span className="lp-operation-step__icon" aria-hidden="true">
                    <Icon size={26} />
                  </span>
                  <span className="lp-operation-step__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            );
          })}
        </ol>

        <div className="lp-how-it-works__action">
          <AppButton
            variant="primary"
            size="lg"
            iconRight={<ArrowRight aria-hidden="true" />}
            onClick={() => window.location.assign("/signup")}
          >
            Criar conta grátis
          </AppButton>
          <p>Crie sua conta gratuitamente e configure seus primeiros critérios.</p>
        </div>
      </div>
    </section>
  );
}
