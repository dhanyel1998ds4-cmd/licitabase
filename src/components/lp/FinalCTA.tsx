import { AppButton } from "./AppButton";
import { ArrowRight, Search, Sparkles, Target, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusPill } from "@/components/bot/StatusPill";

export function FinalCTA() {
  return (
    <section 
      id="cta-final" 
      className="final-cta" 
      aria-labelledby="final-cta-title"
    >
      <div className="final-cta__glow-wrapper">
        <div className="final-cta__panel">
          
          {/* Lado Esquerdo: Argumento de Conversão */}
          <div className="final-cta__content">
            <div className="final-cta__eyebrow">
              <Sparkles className="size-4 text-white" aria-hidden="true" />
              <span>Tudo que sua empresa precisa, em um só lugar</span>
            </div>

            <h2 id="final-cta-title" className="final-cta__title">
              Transforme licitações em um processo mais previsível
            </h2>

            <div className="final-cta__benefit">
              <div className="final-cta__benefit-icon border border-white/30 bg-white/10">
                <Target className="size-3.5" />
              </div>
              <p>
                Encontre oportunidades compatíveis com sua empresa, organize as participações e automatize etapas da operação em um só lugar.
              </p>
            </div>

            <div className="final-cta__benefit">
              <div className="final-cta__benefit-icon border border-white/30 bg-white/10">
                <Zap className="size-3.5" />
              </div>
              <p>
                Crie sua conta e configure seus primeiros critérios em poucos minutos.
              </p>
            </div>

            <div className="final-cta__actions mt-10 flex flex-col sm:flex-row gap-4">
              <AppButton 
                variant="light-pricing" 
                size="lg" 
                className="min-w-[240px] shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                iconRight={<ArrowRight className="app-button__icon--right" />}
                onClick={() => window.location.href = '/signup'}
              >
                Criar conta grátis
              </AppButton>
              <AppButton 
                variant="dark" 
                size="lg"
                className="min-w-[240px]"
                iconLeft={<Search className="size-4" />}
                onClick={() => window.location.href = '/explorar'}
              >
                Buscar licitações grátis
              </AppButton>
            </div>

            <div className="final-cta__trust">
              <ShieldCheck className="size-4 text-white/60" />
              <span>Dados oficiais do PNCP</span>
              <span className="opacity-40" aria-hidden="true">•</span>
              <span>Cobertura nacional</span>
              <span className="opacity-40" aria-hidden="true">•</span>
              <span>Conta gratuita para começar</span>
            </div>
          </div>

          {/* Lado Direito: Visual do Produto */}
          <div className="final-cta__visual">
            <div className="final-preview-container">
              {/* Dots/Decoração de Fundo */}
              <div className="final-preview-decoration overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
                  <circle cx="200" cy="200" r="180" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                  <circle cx="200" cy="200" r="120" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
                  <defs>
                    <pattern id="cta-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="white" fillOpacity="0.2" />
                    </pattern>
                  </defs>
                  <rect width="400" height="400" fill="url(#cta-dots)" />
                </svg>
              </div>

              {/* Card Flutuante Superior: Métrica */}
              <div className="final-preview-metric final-preview-card p-4 transition-transform hover:scale-105 duration-500">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Oportunidades encontradas</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-white leading-none">1.248</span>
                  <span className="text-[10px] font-bold text-[#32d26a] bg-[#32d26a]/10 border border-[#32d26a]/20 px-1.5 py-0.5 rounded-md mb-0.5">+32% ↗</span>
                </div>
                <p className="text-[10px] text-white/40 mt-1">Atualizado hoje</p>
              </div>

              {/* Painel Principal: Licitações Compatíveis */}
              <div className="final-preview-main final-preview-card overflow-hidden">
                <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
                  <span className="text-sm font-bold text-white tracking-tight">Licitações compatíveis</span>
                  <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Search className="size-4 text-white/40" />
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {[
                    { agency: "Prefeitura Municipal • SP", value: "R$ 186.500", status: "Nova" },
                    { agency: "Câmara Municipal • RJ", value: "R$ 42.800", status: "Nova" },
                    { agency: "Sec. de Educação • MG", value: "R$ 914.200", status: "Nova" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-white/5 transition-all duration-300">
                      <div className="size-10 rounded-full bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center">
                        <Target className="size-4 text-white/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="h-2.5 w-32 bg-white/20 rounded-full mb-3" />
                        <div className="h-2 w-20 bg-white/10 rounded-full" />
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="text-xs font-bold text-white leading-tight mb-2">{item.value}</p>
                        <span className="text-[10px] font-bold text-[#32d26a] bg-[#32d26a]/10 border border-[#32d26a]/20 px-2 py-0.5 rounded-full">{item.status}</span>
                      </div>
                      <ArrowRight className="size-3.5 text-white/20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Flutuante Inferior: Critérios */}
              <div className="final-preview-saved final-preview-card p-4 transition-transform hover:scale-105 duration-500">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="size-3.5 text-[#32d26a]" />
                  <span className="text-[11px] font-bold text-white">Critérios salvos</span>
                </div>
                <p className="text-[10px] text-white/60 font-medium">3 perfis ativos</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
