import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Radar, Settings2, Sparkles } from "lucide-react";
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
  const chargedTotal = isAnnual ? (price.billedTotal ?? price.amount * 12) : price.amount;
  const formattedChargedTotal = new Intl.NumberFormat("pt-BR").format(chargedTotal);
  const chargePeriod = isAnnual ? "/ano" : "/mês";

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

            <aside
              className="relative mx-auto my-8 w-[calc(100%_-_2.5rem)] max-w-[390px] self-center bg-[#f7f3e8] px-7 py-9 font-mono text-[#17251c] shadow-[0_28px_48px_rgba(0,0,0,0.3)] sm:my-10 sm:px-8 sm:py-10 lg:my-12"
              aria-label="Recibo da assinatura"
            >
              <div
                className="absolute -top-1 left-1 right-1 flex justify-between"
                aria-hidden="true"
              >
                {Array.from({ length: 28 }, (_, index) => (
                  <span key={index} className="size-2 rounded-full bg-[#062d20]" />
                ))}
              </div>
              <div
                className="absolute -bottom-1 left-1 right-1 flex justify-between"
                aria-hidden="true"
              >
                {Array.from({ length: 28 }, (_, index) => (
                  <span key={index} className="size-2 rounded-full bg-[#062d20]" />
                ))}
              </div>

              <header className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#506055]">
                  LicitaBase
                </p>
                <h2 className="mt-2 text-xl font-black uppercase tracking-[0.12em] text-[#17251c]">
                  Recibo
                </h2>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#66756b]">
                  Confirmação de assinatura
                </p>
              </header>

              <div className="my-5 border-t-2 border-dashed border-[#859188]" />

              <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#526157]">
                <span>Descrição</span>
                <span>Valor</span>
              </div>
              <div className="mt-3 space-y-2.5 text-[12px] leading-5 text-[#35443a]">
                <div className="flex items-start justify-between gap-3">
                  <span className="max-w-[13rem]">Assinatura {activePlan.name}</span>
                  <span className="shrink-0 font-bold">R$ {formattedPrice}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span>Cobrança {isAnnual ? "anual" : "mensal"}</span>
                  <span className="shrink-0">{chargePeriod}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span>Acesso à plataforma</span>
                  <span className="shrink-0 font-bold text-[#198546]">Liberado</span>
                </div>
              </div>

              <div className="my-5 border-t-2 border-dashed border-[#859188]" />

              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#536259]">
                    Total cobrado
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-[#6a786e]">
                    {isAnnual ? "Cobrado anualmente" : "Cobrança mensal"}
                  </p>
                </div>
                <p className="text-2xl font-black tracking-[-0.09em] text-[#17251c]">
                  R$ {formattedChargedTotal}
                </p>
              </div>

              <div className="my-5 border-t-2 border-dashed border-[#859188]" />

              <div className="space-y-1 text-[10px] font-semibold uppercase tracking-[0.055em] text-[#56645b]">
                <div className="flex justify-between gap-3">
                  <span>Status do pagamento</span>
                  <span className="font-black text-[#168542]">Aprovado</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Plano</span>
                  <span>{activePlan.name}</span>
                </div>
              </div>

              <div className="my-5 border-t-2 border-dashed border-[#859188]" />

              <p className="text-center text-[10px] font-black uppercase tracking-[0.12em] text-[#26362b]">
                Obrigado por escolher a LicitaBase
              </p>
              <div
                className="mt-5 flex h-10 items-stretch justify-center gap-px"
                aria-hidden="true"
              >
                {[
                  2, 1, 3, 1, 1, 4, 2, 1, 3, 2, 4, 1, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1,
                  3, 1, 2,
                ].map((width, index) => (
                  <span key={index} className="bg-[#17251c]" style={{ width: `${width}px` }} />
                ))}
              </div>
              <p className="mt-2 text-center text-[9px] font-semibold tracking-[0.18em] text-[#65736a]">
                LICITABASE · ASSINATURA ATIVA
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
