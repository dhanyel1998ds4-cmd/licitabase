import { CheckCircle2 } from "lucide-react";

const BENEFITS = [
  {
    id: "fit",
    title: "Mais aderência",
    text: "Use filtros e alertas para reduzir o tempo gasto com licitações que não combinam com sua operação.",
    detail: "Concentre energia nas oportunidades que fazem sentido.",
  },
  {
    id: "analysis",
    title: "Análise mais ágil",
    text: "Consulte dados, preços, concorrentes e informações do edital em um só ambiente.",
    detail: "Reduza a troca de ferramentas durante a análise.",
  },
  {
    id: "deadlines",
    title: "Prazos sob controle",
    text: "Centralize datas importantes, disputas próximas e oportunidades que exigem atenção.",
    detail: "Saiba com clareza o que precisa acontecer primeiro.",
  },
  {
    id: "capacity",
    title: "Mais capacidade",
    text: "Automatize tarefas repetitivas e acompanhe mais oportunidades sem ampliar o trabalho manual na mesma proporção.",
    detail: "Escale a operação com mais organização.",
  },
] as const;

export function Benefits() {
  return (
    <section id="beneficios" className="lp-benefits" aria-labelledby="benefits-title">
      <div className="lp-benefits__container">
        <header className="lp-benefits__header">
          <h2 id="benefits-title">Mais oportunidades não precisam significar mais trabalho</h2>
          <p>
            Dê mais clareza ao trabalho da equipe e mantenha as etapas importantes organizadas, da
            busca até a disputa.
          </p>
        </header>

        <ul className="lp-benefits__grid">
          {BENEFITS.map((benefit) => (
            <li key={benefit.id} className="lp-benefit-card">
              <span className="lp-benefit-card__icon" aria-hidden="true">
                <CheckCircle2 size={26} />
              </span>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
              <strong>
                <CheckCircle2 size={17} aria-hidden="true" />
                {benefit.detail}
              </strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
