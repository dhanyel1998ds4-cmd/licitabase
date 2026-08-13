import { useEffect, useState } from "react";
import { createFileRoute, Link, useSearch, useNavigate } from "@tanstack/react-router";
import {
  Check,
  ArrowLeft,
  Info,
  Scale,
  ShieldCheck,
  Zap,
  BrainCircuit,
  Users2,
  Headphones,
  Star,
  ChevronRight,
  TrendingUp,
  Search,
  Building2,
  X,
} from "lucide-react";
import { Header } from "@/components/lp/Header";
import { Footer } from "@/components/lp/Footer";
import { AppButton } from "@/components/lp/AppButton";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { pricingPlans, type BillingCycle } from "@/lib/pricing-data";

const compareSearchSchema = z.object({
  ciclo: z.enum(["monthly", "annual"]).catch("monthly"),
});

export const Route = createFileRoute("/planos/comparar")({
  validateSearch: compareSearchSchema,
  head: () => ({
    title: "Comparar planos e recursos | Licitabase",
    meta: [
      {
        name: "description",
        content:
          "Compare os planos Essencial, Profissional e Enterprise do Licitabase, incluindo preços, recursos, limites, automações e suporte.",
      },
      { property: "og:title", content: "Comparar planos e recursos | Licitabase" },
      {
        property: "og:description",
        content: "Compare os planos Essencial, Profissional e Enterprise do Licitabase.",
      },
    ],
  }),
  component: ComparePlansPage,
});

const featureCategories = [
  {
    id: "search",
    name: "1. Busca e monitoramento",
    description: "Encontre e acompanhe oportunidades",
    icon: ShieldCheck,
    features: [
      {
        name: "Busca ilimitada de licitações",
        essential: true,
        professional: true,
        enterprise: true,
        info: "Acesse todas as licitações públicas em tempo real.",
      },
      {
        name: "Alertas ilimitados",
        essential: true,
        professional: true,
        enterprise: true,
        info: "Receba notificações imediatas sobre novas oportunidades.",
      },
      {
        name: "Comparação de preços com o mercado",
        essential: true,
        professional: true,
        enterprise: true,
      },
      {
        name: "Oportunidades com alto potencial",
        essential: true,
        professional: true,
        enterprise: true,
      },
      {
        name: "Alicitante (IA): consultas/dia",
        essential: "5 consultas/dia",
        professional: "5 consultas/dia",
        enterprise: "5 consultas/dia",
      },
    ],
  },
  {
    id: "integrations",
    name: "2. Integrações e participação",
    description: "Conecte sua operação e participe com facilidade",
    icon: Zap,
    features: [
      {
        name: "Integração com ComprasNet, Licitanet e Portal de Compras Públicas",
        essential: false,
        professional: true,
        enterprise: true,
      },
      {
        name: "Monitoramento das etapas da licitação",
        essential: false,
        professional: true,
        enterprise: true,
      },
    ],
  },
  {
    id: "automation",
    name: "3. Automação e produtividade",
    description: "Automatize tarefas e ganhe escala",
    icon: Zap,
    features: [
      {
        name: "Bot de lances",
        essential: false,
        professional: "1 utiliz./semana",
        enterprise: "Ilimitado",
      },
      {
        name: "Cadastro automático de propostas",
        essential: false,
        professional: false,
        enterprise: true,
      },
      {
        name: "Gestão de múltiplos CNPJs",
        essential: false,
        professional: false,
        enterprise: true,
      },
    ],
  },
  {
    id: "intelligence",
    name: "4. Inteligência e análises",
    description: "Dados estratégicos para vencer",
    icon: BrainCircuit,
    features: [
      {
        name: "Inteligência de concorrentes",
        essential: false,
        professional: true,
        enterprise: true,
      },
      {
        name: "Raio-X de editais",
        essential: false,
        professional: "2 análises/semana",
        enterprise: "10 análises/semana",
      },
    ],
  },
  {
    id: "team",
    name: "5. Equipe e gestão",
    description: "Controle total da sua equipe de licitação",
    icon: Users2,
    features: [
      {
        name: "Membros da equipe",
        essential: "1 usuário",
        professional: "2 usuários",
        enterprise: "5 usuários",
      },
    ],
  },
  {
    id: "support",
    name: "6. Suporte e atendimento",
    description: "Apoio especializado em cada etapa",
    icon: Headphones,
    features: [
      {
        name: "Atendimento dedicado com SLA",
        essential: false,
        professional: false,
        enterprise: true,
      },
    ],
  },
];

function ComparePlansPage() {
  const { ciclo } = useSearch({ from: "/planos/comparar" });
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(ciclo);
  const [activePlanMobile, setActivePlanMobile] = useState<string>("professional");
  const activePlan = pricingPlans.find((plan) => plan.id === activePlanMobile) ?? pricingPlans[1]!;

  useEffect(() => {
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, ciclo: billingCycle }),
      replace: true,
    });
  }, [billingCycle, navigate]);

  const renderValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <div className="flex justify-center" aria-label="Incluído">
          <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-[#32d26a] to-[#22b55e] flex items-center justify-center shadow-[0_2px_8px_rgba(50,210,106,0.35)] ring-1 ring-white/20">
            <Check
              size={13}
              className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]"
              strokeWidth={4}
            />
          </div>
        </div>
      ) : (
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-500 ring-1 ring-red-100"
          aria-label="Não incluído"
        >
          <X size={16} strokeWidth={2.8} />
        </div>
      );
    }
    return (
      <span className="text-slate-700 font-semibold text-[14px] text-center block">{value}</span>
    );
  };

  const formatCurrency = (value: number) => {
    return `R$ ${new Intl.NumberFormat("pt-BR").format(value)}`;
  };

  return (
    <div className="flex flex-col w-full font-manrope bg-[#f0f4f8] min-h-screen text-[#0f172a]">
      <Header forceSolid />

      <main className="pt-32 pb-20 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Back Link */}
          <div className="flex mb-6">
            <Link
              to="/lp"
              hash="planos"
              className="flex items-center gap-2 text-slate-500 hover:text-[#32d26a] transition-colors font-semibold text-sm group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Voltar para os planos</span>
            </Link>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 text-[#0f172a] leading-tight">
            Comparar todos os recursos dos planos
          </h1>
          <p className="text-slate-500 text-center max-w-2xl mx-auto mb-10 text-base md:text-lg">
            Escolha o plano ideal para a realidade da sua empresa. Todos os recursos, limites e
            benefícios organizados para facilitar sua decisão.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-12 md:mb-16">
            <div className="pricing-toggle" role="group" aria-label="Período de cobrança">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={cn(billingCycle === "monthly" && "active")}
                aria-pressed={billingCycle === "monthly"}
              >
                Mensal
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={cn("pricing-toggle__annual-btn", billingCycle === "annual" && "active")}
                aria-pressed={billingCycle === "annual"}
              >
                <span>Anual</span>
                <span className="pricing-toggle__saving uppercase">Economize até 17%</span>
              </button>
            </div>
          </div>

          {/* Desktop Matrix */}
          <div className="hidden md:block bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden mb-12">
            {/* Table Header (Sticky) */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-b border-slate-100 sticky top-0 md:top-[88px] z-30 bg-white shadow-sm">
              <div className="p-8 border-r border-slate-100 bg-slate-50/30 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#32d26a]/10 flex items-center justify-center shrink-0">
                    <Scale className="text-[#32d26a]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Compare lado a lado</h3>
                    <p className="text-slate-400 text-[11px] leading-tight">
                      Dados completos para decisão.
                    </p>
                  </div>
                </div>
              </div>

              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "p-6 relative flex flex-col items-center text-center",
                    plan.id !== "enterprise" && "border-r border-slate-100",
                    plan.featured
                      ? "bg-white shadow-[0_0_20px_rgba(50,210,106,0.15)] ring-2 ring-[#32d26a] ring-inset z-10 rounded-t-2xl"
                      : "bg-white",
                  )}
                >
                  {plan.badge && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#32d26a] text-white text-[9px] font-bold px-3 py-0.5 rounded-b-lg flex items-center gap-1 whitespace-nowrap">
                      <Star size={8} fill="white" />
                      {plan.badge}
                    </div>
                  )}
                  <h4 className="text-base font-bold mb-1">{plan.name}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-400 text-xs font-semibold">R$</span>
                    <span className="text-2xl font-black text-[#0f172a]">
                      {plan.prices[billingCycle].amount}
                    </span>
                    <span className="text-slate-400 text-[10px] font-medium">/mês</span>
                  </div>
                  {billingCycle === "annual" && plan.prices.annual.billedTotal && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Cobrado anualmente: {formatCurrency(plan.prices.annual.billedTotal)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Matrix Categories - ALWAYS EXPANDED */}
            <div className="divide-y divide-slate-100">
              {featureCategories.map((category) => (
                <div key={category.id} className="bg-white">
                  {/* Category Header (Non-clickable) */}
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] p-6 items-center bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#32d26a] text-white shadow-sm">
                        <category.icon size={20} />
                      </div>
                      <div>
                        <h5 className="font-bold text-[#0f172a] text-base">{category.name}</h5>
                        <p className="text-slate-400 text-xs font-medium">{category.description}</p>
                      </div>
                    </div>
                    <div className="col-span-3" />
                  </div>

                  {/* Feature Rows */}
                  <div className="animate-in fade-in duration-300">
                    {category.features.map((feature) => (
                      <div
                        key={feature.name}
                        className="grid grid-cols-[1.5fr_1fr_1fr_1fr] px-6 py-4 border-t border-slate-50 group/row"
                      >
                        <div className="flex items-center gap-2 pl-14 pr-4">
                          <span className="text-slate-600 text-[13px] font-medium">
                            {feature.name}
                          </span>
                          {"info" in feature && (
                            <div className="group/info relative cursor-help">
                              <Info size={14} className="text-slate-300 hover:text-slate-400" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-20">
                                {feature.info}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center">
                          {renderValue(feature.essential)}
                        </div>
                        <div className="flex items-center justify-center bg-[#32d26a]/5">
                          {renderValue(feature.professional)}
                        </div>
                        <div className="flex items-center justify-center">
                          {renderValue(feature.enterprise)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Table Footer (Action Bar) */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-t border-slate-100 bg-white p-6 items-center">
              <div className="pl-6">
                <p className="text-slate-500 text-sm font-medium">
                  Escolha seu plano e comece hoje.
                </p>
              </div>

              {pricingPlans.map((plan) => (
                <div key={plan.id} className="px-3">
                  <AppButton
                    variant={
                      plan.id === "professional"
                        ? "primary"
                        : plan.id === "enterprise"
                          ? "dark"
                          : "secondary"
                    }
                    size="sm"
                    fullWidth
                    onClick={() => (window.location.href = "/signup")}
                  >
                    {plan.cta}
                  </AppButton>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Plan Selector (Tabs) - Still useful for mobile layout but features always open */}
          <div className="md:hidden mb-12">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="flex border-b border-slate-100" role="tablist" aria-label="Planos">
                {pricingPlans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    role="tab"
                    aria-selected={activePlanMobile === plan.id}
                    onClick={() => setActivePlanMobile(plan.id)}
                    className={cn(
                      "flex-1 py-4 px-2 text-center transition-all relative",
                      activePlanMobile === plan.id
                        ? "bg-slate-50 text-[#0f172a]"
                        : "bg-white text-slate-400 hover:text-slate-600",
                    )}
                  >
                    <span className="text-sm font-bold block">{plan.name}</span>
                    <span className="text-[13px] font-medium block">
                      R$ {plan.prices[billingCycle].amount}/mês
                    </span>
                    {activePlanMobile === plan.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#32d26a]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#32d26a]/10 flex items-center justify-center">
                    {activePlanMobile === "essential" && (
                      <Search className="text-[#32d26a]" size={20} />
                    )}
                    {activePlanMobile === "professional" && (
                      <TrendingUp className="text-[#32d26a]" size={20} />
                    )}
                    {activePlanMobile === "enterprise" && (
                      <Building2 className="text-[#32d26a]" size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{activePlan.name}</h3>
                    <p className="text-sm font-semibold text-slate-600">
                      R$ {activePlan.prices[billingCycle].amount}/mês
                    </p>
                    {billingCycle === "annual" && activePlan.prices.annual.billedTotal ? (
                      <p className="mt-0.5 text-xs text-slate-500">
                        Cobrado anualmente: {formatCurrency(activePlan.prices.annual.billedTotal)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-8">
                  {featureCategories.map((category) => (
                    <div key={category.id}>
                      <div className="flex items-center gap-2 mb-4">
                        <category.icon size={16} className="text-[#32d26a]" />
                        <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400">
                          {category.name}
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {category.features.map((feature) => {
                          const val =
                            activePlanMobile === "essential"
                              ? feature.essential
                              : activePlanMobile === "professional"
                                ? feature.professional
                                : feature.enterprise;
                          return (
                            <div
                              key={feature.name}
                              className="flex items-center justify-between gap-4 text-sm py-2 border-b border-slate-100 last:border-0"
                            >
                              <span className="text-slate-600">{feature.name}</span>
                              <div>{renderValue(val)}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <AppButton
                    variant={
                      activePlanMobile === "professional"
                        ? "primary"
                        : activePlanMobile === "enterprise"
                          ? "dark"
                          : "secondary"
                    }
                    fullWidth
                    onClick={() => (window.location.href = "/signup")}
                  >
                    {activePlan.cta}
                  </AppButton>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Help Block */}
          <div className="flex justify-center mt-12 mb-8">
            <Link
              to="/lp"
              hash="planos"
              className="flex items-center gap-2 text-[#0f172a] hover:text-[#32d26a] transition-all font-bold text-sm bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm hover:shadow-md"
            >
              <div className="w-6 h-6 rounded-full bg-[#32d26a]/10 flex items-center justify-center">
                <Scale size={14} className="text-[#32d26a]" />
              </div>
              <span>Ainda em dúvida? Falar com um especialista</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
