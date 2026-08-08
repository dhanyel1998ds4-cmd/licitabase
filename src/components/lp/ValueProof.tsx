import React from "react";
import { Search, Globe2, SlidersHorizontal, BarChart3, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppButton } from "./AppButton";

// --- Sub-componentes ---

const ValueSectionPattern = () => (
  <svg
    className="absolute inset-0 z-0 w-full h-full opacity-[0.12] pointer-events-none"
    viewBox="0 0 1400 760"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M-100,300 C200,250 400,450 700,300 C1000,150 1200,350 1540,300"
      stroke="#29C454"
      strokeWidth="1"
      strokeDasharray="4 4"
    />
    <path
      d="M-50,150 C300,250 600,50 900,200 C1200,350 1400,150 1600,250"
      stroke="#29C454"
      strokeWidth="0.5"
    />
  </svg>
);

const ValueMetricCard = ({ value, description, icon: Icon }: { value: string; description: string; icon: any }) => (
  <div className="relative min-h-[328px] p-[28px_26px_30px] bg-white/82 border border-[#e2e8f0] rounded-[22px] shadow-[0_18px_42px_rgba(15,23,42,0.07),inset_0_1px_0_rgba(255,255,255,0.95)] flex flex-col items-start text-left group transition-all duration-300 hover:-translate-y-1">
    <div className="absolute top-[28px] right-[28px] w-2 h-2 bg-[#29c454] rounded-full shadow-[0_0_0_3px_rgba(41,196,84,0.09),0_0_12px_rgba(41,196,84,0.2)]" aria-hidden="true" />
    
    <div className="grid place-items-center w-[70px] h-[70px] text-[#29c454] bg-white/94 border border-[rgba(41,196,84,0.12)] rounded-full shadow-[0_12px_28px_rgba(15,23,42,0.08),0_0_24px_rgba(41,196,84,0.06)]">
      <Icon size={28} />
    </div>

    <div className="mt-[38px] text-[#0f172a] text-2xl sm:text-3xl font-bold leading-tight tracking-tight tabular-nums">
      {value}
    </div>
    
    <div className="w-[34px] h-[3.5px] mt-[20px] bg-gradient-to-r from-transparent via-[#29c454] to-transparent rounded-full" />
    
    <p className="max-w-[240px] mt-[30px] text-[#64748b] text-sm leading-relaxed font-normal">
      {description}
    </p>
  </div>
);

const ValueMetricsGrid = () => {
  const valueMetrics = [
    {
      id: "opportunities",
      value: "963 mil+",
      description: "Licitações disponíveis para pesquisa. Base preparada para busca em oportunidades de todo o Brasil.",
      icon: Search,
    },
    {
      id: "coverage",
      value: "Cobertura nacional",
      description: "Oportunidades publicadas por órgãos de todo o Brasil. Pesquise por estado, município, órgão e outros critérios.",
      icon: Globe2,
    },
    {
      id: "filters",
      value: "15+ filtros",
      description: "Mais precisão para encontrar oportunidades aderentes ao seu negócio. Combine filtros e salve as buscas que sua equipe usa com frequência.",
      icon: SlidersHorizontal,
    },
    {
      id: "records",
      value: "400 mil+",
      description: "Base para comparação de preços em compras públicas. Use referências de mercado para apoiar sua análise.",
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px] w-full max-w-[1240px] mt-[64px] mx-auto">
      {valueMetrics.map((metric) => (
        <ValueMetricCard key={metric.id} {...metric} />
      ))}
    </div>
  );
};

const ValueSectionHeader = () => (
  <div className="relative z-10 flex flex-col items-center text-center">
    <h2 
      id="value-section-title"
      className="max-w-[940px] mx-auto text-[#0f172a] font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.06] tracking-tight text-balance"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      Uma operação de licitações mais simples, organizada e{" "}
      <span className="relative inline-block">
        previsível
        <span 
          className="absolute left-[1%] right-[-1%] bottom-[-5px] h-[4px] rounded-full bg-gradient-to-r from-[rgba(41,196,84,0.42)] via-[#29c454] to-[rgba(41,196,84,0.46)] rotate-[0.4deg]"
          aria-hidden="true"
        />
      </span>
    </h2>

    <p className="max-w-[790px] mx-auto mt-[30px] text-[#64748b] text-lg font-normal leading-relaxed">
      Do primeiro filtro à sala de disputa, o Licitabase centraliza as etapas que mais consomem tempo da sua equipe.
    </p>
  </div>
);

export function ValueProof() {
  return (
    <section
      id="prova-de-valor"
      className="relative w-full overflow-visible py-[110px] px-7 bg-[#020307]"
      aria-labelledby="value-section-title"
    >
      <div className="relative w-full max-w-[1420px] mx-auto overflow-visible">
        {/* Camada de Glow Estrutural (z-index 0) */}
        <div 
          className="absolute z-0 -inset-x-[46px] -inset-y-[52px] bottom-[-62px] overflow-visible pointer-events-none"
          aria-hidden="true"
        >
          {/* Halo Geral */}
          <div className="absolute inset-0 blur-[26px] opacity-100" style={{
            background: `
              radial-gradient(ellipse 58% 22% at 50% 4%, rgba(76, 255, 116, 0.72) 0%, rgba(41, 196, 84, 0.46) 18%, rgba(41, 196, 84, 0.22) 38%, rgba(41, 196, 84, 0.08) 58%, transparent 78%),
              radial-gradient(ellipse 12% 64% at 2% 50%, rgba(41, 196, 84, 0.32) 0%, rgba(41, 196, 84, 0.13) 45%, transparent 76%),
              radial-gradient(ellipse 12% 64% at 98% 50%, rgba(41, 196, 84, 0.32) 0%, rgba(41, 196, 84, 0.13) 45%, transparent 76%),
              radial-gradient(ellipse 54% 15% at 50% 97%, rgba(41, 196, 84, 0.30) 0%, rgba(41, 196, 84, 0.13) 44%, transparent 78%)
            `
          }} />

          {/* Lens Flare Superior */}
          <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-[min(880px,66%)] h-[108px] -translate-y-[42%] blur-[18px]" style={{
            background: `radial-gradient(ellipse at center, rgba(230, 255, 234, 0.98) 0%, rgba(117, 255, 145, 0.92) 5%, rgba(64, 255, 104, 0.65) 14%, rgba(41, 196, 84, 0.35) 32%, rgba(41, 196, 84, 0.13) 56%, transparent 78%)`
          }}>
            <div className="absolute top-[48%] left-1/2 -translate-x-1/2 w-full h-[3px] -translate-y-1/2 blur-[2px]" style={{
              background: `linear-gradient(90deg, transparent, rgba(70, 255, 111, 0.24) 16%, rgba(135, 255, 158, 0.92) 50%, rgba(70, 255, 111, 0.24) 84%, transparent)`
            }} />
          </div>

          {/* Luzes Laterais */}
          <div className="absolute top-[18%] bottom-[14%] left-2 w-[90px] -translate-x-1/2 blur-[22px]" style={{
            background: `radial-gradient(ellipse at center, rgba(68, 255, 108, 0.48), rgba(41, 196, 84, 0.18) 42%, transparent 74%)`
          }} />
          <div className="absolute top-[18%] bottom-[14%] right-2 w-[90px] translate-x-1/2 blur-[22px]" style={{
            background: `radial-gradient(ellipse at center, rgba(68, 255, 108, 0.48), rgba(41, 196, 84, 0.18) 42%, transparent 74%)`
          }} />

          {/* Luz Inferior */}
          <div className="absolute left-1/2 bottom-2 w-[62%] h-[80px] -translate-x-1/2 translate-y-1/2 blur-[22px]" style={{
            background: `radial-gradient(ellipse at center, rgba(63, 255, 104, 0.42), rgba(41, 196, 84, 0.16) 44%, transparent 76%)`
          }} />
        </div>

        {/* Painel Branco Elevado (z-index 2) */}
        <div 
          className="relative z-10 min-h-[760px] p-[72px_72px_64px] rounded-[32px] overflow-hidden sm:p-[72px_72px_64px] p-6"
          style={{
            background: `
              radial-gradient(circle at 50% 100%, rgba(41, 196, 84, 0.035), transparent 42%),
              #ffffff
            `,
            border: '1.5px solid rgba(83, 226, 115, 0.48)',
            boxShadow: `
              inset 0 1px 0 rgba(255, 255, 255, 0.96),
              0 0 0 1px rgba(255, 255, 255, 0.30),
              0 24px 64px rgba(0, 0, 0, 0.24)
            `
          }}
        >
          {/* Contorno Luminoso Adicional (Borda interna) */}
          <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{
            boxShadow: `
              inset 0 1px 0 rgba(90, 255, 126, 0.24),
              inset 1px 0 0 rgba(41, 196, 84, 0.10),
              inset -1px 0 0 rgba(41, 196, 84, 0.10)
            `
          }} />

          <div className="relative z-20">
            <ValueSectionPattern />
            <ValueSectionHeader />
            <ValueMetricsGrid />
            
            <div className="flex justify-center mt-[60px]">
              <AppButton 
                variant="primary" 
                size="lg" 
                iconRight={<ArrowRight className="app-button__icon app-button__icon--right" />}
                className="min-w-[320px]"
                onClick={() => window.location.href = '/signup'}
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

