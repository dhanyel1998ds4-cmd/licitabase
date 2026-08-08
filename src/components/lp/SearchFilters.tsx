import { Filter, Search, Info, TrendingUp, ChevronRight, MousePointer2, CheckCircle2 } from "lucide-react";
import { AppButton } from "./AppButton";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

export function SearchFilters() {
  const [sphere, setSphere] = useState("Federal");
  const [modalities, setModalities] = useState(["Pregão"]);
  const [region, setRegion] = useState("Sudeste");
  const [value, setValue] = useState([10000, 1500000]);

  const toggleModality = (mod: string) => {
    setModalities(prev => 
      prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]
    );
  };

  const handleClear = () => {
    setSphere("Federal");
    setModalities(["Pregão"]);
    setRegion("Sudeste");
    setValue([10000, 1500000]);
  };

  // Lógica dinâmica demonstrativa para os resultados
  const estimatedResultsLabel = useMemo(() => {
    let base = 12450;
    
    // Simular redução baseada em filtros
    if (sphere !== "Federal") base *= 0.7;
    base *= (modalities.length / 6) * 1.5;
    if (region !== "Sudeste") base *= 0.6;
    
    // Valor estimado (range proporcional)
    const rangeSize = ((value?.[1] ?? 1500000) - (value?.[0] ?? 10000)) / 5000000;
    base *= Math.max(0.1, rangeSize);

    const formatted = (base / 1000).toFixed(1);
    return `${formatted.replace('.', ',')} mil`;
  }, [sphere, modalities, region, value]);

  const filtersList = [
    "Estado", "Município", "Modalidade", "Categoria", "Órgão público",
    "Valor estimado", "Data de publicação", "Prazo para propostas",
    "Data da disputa", "Esfera governamental", "Plataforma",
    "Potencial de margem"
  ];

  const histogramData = [
    8, 12, 22, 35, 28, 18, 12, 22, 32, 45, 55, 42, 28, 22, 18, 12, 18, 28, 42, 55, 65, 50, 38, 32, 22, 18, 12, 8
  ];

  return (
    <section 
      id="oportunidades" 
      className="opportunities-section bg-white relative overflow-hidden py-[clamp(88px,8vw,144px)] px-6"
      style={{
        background: 'radial-gradient(circle at 82% 46%, rgba(34, 197, 94, 0.055), transparent 32%), #ffffff'
      }}
      aria-labelledby="opportunities-title"
    >
      <div className="mx-auto w-[min(1380px,100%)] grid grid-cols-1 lg:grid-cols-[minmax(360px,0.84fr)_minmax(600px,1.16fr)] items-center gap-[clamp(64px,7vw,120px)]">
        
        {/* COLUNA ESQUERDA — COPY */}
        <div className="opportunities-section__content">
          <h2 
            id="opportunities-title"
            className="text-navy font-bold leading-[0.98] tracking-[-0.052em] text-balance mb-0"
            style={{ fontSize: 'clamp(52px, 4.7vw, 76px)', maxWidth: '580px' }}
          >
            Encontre oportunidades compatíveis com <span className="text-brand">o seu negócio</span>
          </h2>
          
          <p className="mt-[34px] text-muted-foreground text-lg leading-[1.65] max-w-[570px]">
            Navegue por setor ou combine mais de 15 filtros para chegar às licitações com maior aderência à sua empresa.
          </p>
          
          <ul className="mt-10 grid grid-cols-2 gap-y-4 gap-x-8">
            {filtersList.map((filter) => (
              <li key={filter} className="flex items-center gap-2.5 text-base font-semibold text-navy/80">
                <CheckCircle2 className="w-5 h-5 text-brand shrink-0" aria-hidden="true" />
                {filter}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <AppButton 
              variant="primary" 
              size="lg"
              className="px-10 h-14 text-lg"
              onClick={() => window.location.href = '/explorar'}
            >
              <Search className="w-5 h-5 mr-2" aria-hidden="true" />
              Buscar licitações grátis
            </AppButton>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-brand" aria-hidden="true" />
              Sem cartão. Sem compromisso.
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA — PAINEL DEMONSTRATIVO */}
        <div className="opportunities-section__visual">
          <div 
            className="filter-preview-shell relative p-[clamp(28px,3vw,44px)] rounded-[36px] border border-border"
            style={{
              background: 'radial-gradient(circle at 55% 45%, rgba(34, 197, 94, 0.08), transparent 55%), rgba(248, 251, 250, 0.92)'
            }}
          >
            <div 
              className="filter-preview-panel bg-white/96 border border-slate-300/80 rounded-[24px] overflow-hidden shadow-[0_26px_60px_rgba(15,23,42,0.08),0_6px_18px_rgba(15,23,42,0.035),inset_0_1px_0_rgba(255,255,255,0.95)]"
            >
              <header className="px-8 pt-8 pb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                    <Filter className="w-5 h-5 text-brand" />
                  </div>
                  <h3 className="text-xl font-extrabold text-navy">Filtrar oportunidades</h3>
                </div>
                <button 
                  onClick={handleClear}
                  className="text-[11px] font-extrabold text-muted-foreground hover:text-navy uppercase tracking-widest transition-colors"
                >
                  Limpar filtros
                </button>
              </header>

              <div className="px-8 pb-10 space-y-9">
                {/* ESFERA */}
                <fieldset>
                  <legend className="flex items-center gap-1.5 mb-4">
                    <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest">Esfera</span>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/50" />
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    {['Federal', 'Estadual', 'Municipal', 'Distrito Federal'].map((item) => (
                      <button 
                        key={item}
                        onClick={() => setSphere(item)}
                        aria-pressed={sphere === item}
                        className={cn(
                          "px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-160",
                          sphere === item 
                            ? "bg-brand/5 border-brand text-brand shadow-[0_2px_8px_-2px_rgba(41,196,84,0.12)]" 
                            : "bg-white border-slate-200 text-navy/60 hover:border-brand/30 hover:text-brand"
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* MODALIDADE */}
                <fieldset>
                  <legend className="flex items-center gap-1.5 mb-4">
                    <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest">Modalidade</span>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/50" />
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    {['Pregão', 'Concorrência', 'Dispensa', 'Inexigibilidade', 'Concurso', 'Outras'].map((item) => (
                      <button 
                        key={item}
                        onClick={() => toggleModality(item)}
                        aria-pressed={modalities.includes(item)}
                        className={cn(
                          "px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-160",
                          modalities.includes(item)
                            ? "bg-brand/5 border-brand text-brand shadow-[0_2px_8px_-2px_rgba(41,196,84,0.12)]" 
                            : "bg-white border-slate-200 text-navy/60 hover:border-brand/30 hover:text-brand"
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* REGIÃO */}
                <fieldset>
                  <legend className="flex items-center gap-1.5 mb-4">
                    <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest">Região</span>
                    <Info className="w-3.5 h-3.5 text-muted-foreground/50" />
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    {['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'].map((item) => (
                      <button 
                        key={item}
                        onClick={() => setRegion(item)}
                        aria-pressed={region === item}
                        className={cn(
                          "px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-160",
                          region === item 
                            ? "bg-brand/5 border-brand text-brand shadow-[0_2px_8px_-2px_rgba(41,196,84,0.12)]" 
                            : "bg-white border-slate-200 text-navy/60 hover:border-brand/30 hover:text-brand"
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* VALOR ESTIMADO */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest">Valor Estimado (R$)</span>
                      <Info className="w-3.5 h-3.5 text-muted-foreground/50" />
                    </div>
                    <button className="flex items-center gap-1.5 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest hover:text-navy">
                      Modo Avançado
                      <ChevronRight className="w-3 h-3 rotate-90" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 relative">
                       <input 
                         type="text" 
                         readOnly 
                         value={`R$ ${(value?.[0] || 0).toLocaleString('pt-BR')},00`}
                         className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-navy"
                       />
                       <MousePointer2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                    </div>
                    <div className="w-3 h-[2px] bg-slate-200"></div>
                    <div className="flex-1 relative">
                       <input 
                         type="text" 
                         readOnly 
                         value={`R$ ${(value?.[1] || 0).toLocaleString('pt-BR')},00`}
                         className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-navy"
                       />
                       <MousePointer2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                    </div>
                  </div>

                  <div className="relative px-2">
                    <div className="flex items-end justify-between h-8 mb-[-4px] opacity-10 px-1">
                      {histogramData.map((h, i) => (
                        <div key={i} style={{ height: `${h}%` }} className="w-[3px] bg-brand rounded-full"></div>
                      ))}
                    </div>
                    <Slider 
                      value={value}
                      onValueChange={(val) => setValue(val as [number, number])}
                      max={5000000} 
                      step={10000} 
                      className="relative z-10"
                    />
                    <div className="flex justify-between mt-4">
                      <span className="text-[11px] font-extrabold text-navy/40 uppercase tracking-widest">R$ 0</span>
                      <span className="text-[11px] font-extrabold text-navy/40 uppercase tracking-widest">R$ 5.000.000+</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ESTIMATED RESULTS BAR */}
              <div 
                className="bg-slate-50/50 border-t border-slate-100 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                aria-live="polite"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest mb-0.5">Resultados estimados</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-navy tracking-tight">{estimatedResultsLabel}</span>
                      <span className="text-sm font-bold text-muted-foreground">licitações</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href = '/explorar'}
                  className="flex items-center gap-2 px-1 text-brand hover:text-brand-strong transition-all group font-black tracking-tight"
                >
                  <span className="text-sm">Visualizar prévia</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Background pattern dots or lines could go here */}
          </div>
        </div>
      </div>
    </section>
  );
}
