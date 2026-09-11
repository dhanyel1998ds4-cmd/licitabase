import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MailCheck, Radar, Settings2, Sparkles } from "lucide-react";
import { z } from "zod";
import { Header } from "@/components/lp/Header";
import { pricingPlans } from "@/lib/pricing-data";

const thankYouSearchSchema = z.object({
  plano: z.string().optional().catch(undefined),
  plan: z.string().optional().catch(undefined),
  ciclo: z.string().optional().catch(undefined),
  billing: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/obrigado")({
  validateSearch: thankYouSearchSchema,
  head: () => ({
    title: "Compra confirmada | LicitaBase",
    meta: [
      {
        name: "description",
        content:
          "Confirmação da assinatura LicitaBase e próximos passos para começar sua operação.",
      },
      { property: "og:title", content: "Compra confirmada | LicitaBase" },
      {
        property: "og:description",
        content: "Sua assinatura foi confirmada. Configure sua operação na LicitaBase.",
      },
    ],
  }),
  component: ThankYouPage,
});

const planAliases: Record<string, string> = {
  essencial: "essential",
  profissional: "professional",
};

const nextSteps = [
  {
    number: "01",
    title: "Acesse sua conta",
    description: "Entre com o e-mail usado na contratação para ativar seu acesso.",
    icon: ArrowRight,
  },
  {
    number: "02",
    title: "Configure sua operação",
    description: "Cadastre a empresa, os segmentos e as regiões de interesse.",
    icon: Settings2,
  },
  {
    number: "03",
    title: "Encontre oportunidades",
    description: "Crie alertas e acompanhe licitações alinhadas ao seu negócio.",
    icon: Radar,
  },
];

function ThankYouPage() {
  const { plano, plan, ciclo, billing } = Route.useSearch();
  const requestedPlan = (plano ?? plan ?? "professional").trim().toLowerCase();
  const planId = planAliases[requestedPlan] ?? requestedPlan;
  const activePlan =
    pricingPlans.find((pricingPlan) => pricingPlan.id === planId) ?? pricingPlans[1]!;
  const requestedBilling = (ciclo ?? billing ?? "monthly").trim().toLowerCase();
  const isAnnual = ["annual", "anual", "yearly"].includes(requestedBilling);
  const price = activePlan.prices[isAnnual ? "annual" : "monthly"];
  const formattedPrice = new Intl.NumberFormat("pt-BR").format(price.amount);

  return (
    <div className="min-h-screen bg-[#f5f8f6] font-manrope text-[#10281d]">
      <Header forceSolid />

      <main className="relative overflow-hidden px-4 pb-16 pt-30 sm:px-6 sm:pb-20 lg:px-8">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[680px] bg-[radial-gradient(circle_at_76%_12%,rgba(45,196,84,0.19),transparent_28rem),radial-gradient(circle_at_17%_8%,rgba(66,186,108,0.1),transparent_27rem)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl pt-14 sm:pt-18">
          <section
            className="grid overflow-hidden rounded-[2rem] border border-[#d8e7dc] bg-[#062d20] shadow-[0_24px_70px_rgba(9,55,35,0.18)] lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.75fr)]"
            aria-labelledby="thank-you-title"
          >
            <div className="px-6 py-10 sm:px-10 sm:py-13 lg:px-12 lg:py-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#66e188]/30 bg-[#42d96a]/12 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#a9f4ba]">
                <span className="grid size-5 place-items-center rounded-full bg-[#42d96a] text-[#073323]">
                  <Check className="size-3.5" strokeWidth={3.5} aria-hidden="true" />
                </span>
                Pagamento confirmado
              </div>

              <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.14em] text-[#62df82]">
                Boas-vindas à LicitaBase
              </p>
              <h1
                id="thank-you-title"
                className="mt-3 max-w-xl text-4xl font-extrabold tracking-[-0.065em] text-white sm:text-5xl lg:text-[3.7rem] lg:leading-[1.01]"
              >
                Tudo certo. Sua operação começa agora.
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#b7cabe] sm:text-base">
                Sua assinatura foi confirmada. Acesse a plataforma para configurar sua operação e
                começar a encontrar as melhores oportunidades.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/dash2"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#42d96a] px-5 text-sm font-extrabold text-[#083221] shadow-[0_12px_28px_rgba(40,217,92,0.22)] transition hover:-translate-y-0.5 hover:bg-[#62e986] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Acessar minha conta
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/planos/comparar"
                  search={{ ciclo: isAnnual ? "annual" : "monthly" }}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-5 text-sm font-extrabold text-white transition hover:border-[#62df82]/70 hover:bg-white/7 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Ver detalhes dos planos
                </Link>
              </div>
            </div>

            <aside className="m-5 flex flex-col justify-between rounded-[1.45rem] border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.11),rgba(255,255,255,0.035))] p-6 sm:m-7 sm:p-7 lg:m-8 lg:p-8">
              <div>
                <div className="flex items-center justify-between gap-3 text-xs font-bold text-[#d3e3d8]">
                  <span>Resumo da contratação</span>
                  <span className="rounded-full border border-[#5ee27e]/30 bg-[#44d96a]/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#74eb90]">
                    Aprovado
                  </span>
                </div>

                <div className="mt-10">
                  <p className="text-xs font-medium text-[#a6bbae]">Plano contratado</p>
                  <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.055em] text-white">
                    {activePlan.name}
                  </h2>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#b0c5b8]">
                    {activePlan.subtitle}
                  </p>
                </div>

                <dl className="mt-9 grid grid-cols-2 gap-4 border-y border-white/12 py-5">
                  <div>
                    <dt className="text-[11px] font-medium text-[#9db3a5]">Valor</dt>
                    <dd className="mt-1 text-base font-extrabold tracking-[-0.03em] text-white">
                      R$ {formattedPrice}/mês
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-medium text-[#9db3a5]">Cobrança</dt>
                    <dd className="mt-1 text-base font-extrabold tracking-[-0.03em] text-white">
                      {isAnnual ? "Anual" : "Mensal"}
                    </dd>
                  </div>
                </dl>
              </div>

              <p className="mt-7 flex items-start gap-2 text-xs leading-5 text-[#acc2b4]">
                <MailCheck className="mt-0.5 size-4 shrink-0 text-[#71e990]" aria-hidden="true" />
                Você receberá os detalhes da assinatura no e-mail informado na compra.
              </p>
            </aside>
          </section>

          <section className="mt-14 sm:mt-18" aria-labelledby="next-steps-title">
            <div className="max-w-xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#1da74a]">
                Próximos passos
              </p>
              <h2
                id="next-steps-title"
                className="mt-2 text-3xl font-extrabold tracking-[-0.055em] text-[#10281d] sm:text-4xl"
              >
                Comece em poucos minutos
              </h2>
            </div>

            <ol className="mt-7 grid overflow-hidden rounded-3xl border border-[#d8e7dc] bg-[#d8e7dc] sm:grid-cols-3 sm:gap-px">
              {nextSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <li key={step.number} className="flex min-h-44 flex-col bg-white p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-xs font-extrabold text-[#21ad4e]">
                        {step.number}
                      </span>
                      <span className="grid size-8 place-items-center rounded-lg bg-[#ecf9ef] text-[#1fb24e]">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="mt-7">
                      <h3 className="text-base font-extrabold tracking-[-0.035em] text-[#173226]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#6b8174]">{step.description}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <aside className="mt-4 flex flex-col gap-4 rounded-2xl border border-[#baecca] bg-[#eaf8ee] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#22b850] shadow-sm">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold tracking-[-0.025em] text-[#1b3d2a]">
                Um perfil completo gera alertas mais relevantes.
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#557362]">
                Informe seus produtos, regiões e termos de interesse ao configurar a conta.
              </p>
            </div>
            <Link
              to="/dash2"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-extrabold text-[#14943d] transition hover:text-[#087c2d] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#168f3b]"
            >
              Começar agora
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </main>

      <footer className="border-t border-[#d9e7dc] px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs font-medium text-[#6d8376] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} LicitaBase</span>
          <Link to="/lp" hash="planos" className="font-bold text-[#238e47] hover:underline">
            Precisa de ajuda?
          </Link>
        </div>
      </footer>
    </div>
  );
}
