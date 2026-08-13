import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Filter,
  Info,
  MousePointer2,
  Search,
  TrendingUp,
} from "lucide-react";
import { AppButton } from "./AppButton";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const FILTERS = [
  "Estado",
  "Município",
  "Modalidade",
  "Categoria",
  "Órgão público",
  "Valor estimado",
  "Data de publicação",
  "Prazo para propostas",
  "Data da disputa",
  "Esfera governamental",
  "Plataforma",
  "Potencial de margem",
] as const;

const SPHERES = ["Federal", "Estadual", "Municipal", "Distrito Federal"] as const;
const MODALITIES = [
  "Pregão",
  "Concorrência",
  "Dispensa",
  "Inexigibilidade",
  "Concurso",
  "Outras",
] as const;
const REGIONS = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"] as const;
const HISTOGRAM_DATA = [
  8, 12, 22, 35, 28, 18, 12, 22, 32, 45, 55, 42, 28, 22, 18, 12, 18, 28, 42, 55, 65, 50, 38, 32, 22,
  18, 12, 8,
] as const;

export function SearchFilters() {
  const [sphere, setSphere] = useState("Federal");
  const [modalities, setModalities] = useState(["Pregão"]);
  const [region, setRegion] = useState("Sudeste");
  const [value, setValue] = useState([10000, 1500000]);

  const toggleModality = (mod: string) => {
    setModalities((previous) =>
      previous.includes(mod) ? previous.filter((item) => item !== mod) : [...previous, mod],
    );
  };

  const handleClear = () => {
    setSphere("");
    setModalities([]);
    setRegion("");
    setValue([0, 5000000]);
  };

  // Lógica dinâmica demonstrativa para os resultados
  const estimatedResultsLabel = useMemo(() => {
    let base = 12450;

    // Simular redução baseada em filtros
    if (sphere && sphere !== "Federal") base *= 0.7;
    if (modalities.length > 0) base *= (modalities.length / 6) * 1.5;
    if (region && region !== "Sudeste") base *= 0.6;

    // Valor estimado (range proporcional)
    const rangeSize = ((value?.[1] ?? 1500000) - (value?.[0] ?? 10000)) / 5000000;
    base *= Math.max(0.1, rangeSize);

    const formatted = (base / 1000).toFixed(1);
    return `${formatted.replace(".", ",")} mil`;
  }, [sphere, modalities, region, value]);

  return (
    <section
      id="oportunidades"
      className="opportunities-section"
      aria-labelledby="opportunities-title"
    >
      <div className="opportunities-section__layout">
        {/* COLUNA ESQUERDA — COPY */}
        <div className="opportunities-section__content">
          <h2 id="opportunities-title">
            Encontre oportunidades compatíveis com <span className="text-brand">o seu negócio</span>
          </h2>

          <p className="opportunities-section__lead">
            Navegue por setor ou combine diferentes filtros para chegar às licitações com maior
            aderência à sua empresa.
          </p>

          <ul className="opportunities-section__filter-list">
            {FILTERS.map((filter) => (
              <li key={filter}>
                <CheckCircle2 className="w-5 h-5 text-brand shrink-0" aria-hidden="true" />
                {filter}
              </li>
            ))}
          </ul>

          <div className="opportunities-section__actions">
            <AppButton
              variant="primary"
              size="lg"
              responsiveFull
              iconLeft={<Search className="w-5 h-5" aria-hidden="true" />}
              className="px-10 text-lg"
              onClick={() => (window.location.href = "/explorar")}
            >
              Buscar licitações grátis
            </AppButton>
            <div className="opportunities-section__assurance">
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
              background:
                "radial-gradient(circle at 55% 45%, rgba(34, 197, 94, 0.08), transparent 55%), rgba(248, 251, 250, 0.92)",
            }}
          >
            <div className="filter-preview-panel bg-white/96 border border-slate-300/80 rounded-[24px] overflow-hidden shadow-[0_26px_60px_rgba(15,23,42,0.08),0_6px_18px_rgba(15,23,42,0.035),inset_0_1px_0_rgba(255,255,255,0.95)]">
              <header className="filter-preview-panel__header">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                    <Filter className="w-5 h-5 text-brand" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-extrabold text-navy">Filtrar oportunidades</h3>
                </div>
                <button onClick={handleClear} type="button" className="filter-preview-clear">
                  Limpar filtros
                </button>
              </header>

              <div className="px-8 pb-10 space-y-9">
                {/* ESFERA */}
                <fieldset>
                  <legend className="flex items-center gap-1.5 mb-4">
                    <span className="filter-preview-label">Esfera</span>
                    <Info className="w-4 h-4 text-muted-foreground/50" aria-hidden="true" />
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    {SPHERES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSphere(item)}
                        aria-pressed={sphere === item}
                        className={cn(
                          "filter-preview-chip",
                          sphere === item
                            ? "bg-brand/5 border-brand text-brand shadow-[0_2px_8px_-2px_rgba(41,196,84,0.12)]"
                            : "bg-white border-slate-200 text-navy/60 hover:border-brand/30 hover:text-brand",
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
                    <span className="filter-preview-label">Modalidade</span>
                    <Info className="w-4 h-4 text-muted-foreground/50" aria-hidden="true" />
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    {MODALITIES.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleModality(item)}
                        aria-pressed={modalities.includes(item)}
                        className={cn(
                          "filter-preview-chip",
                          modalities.includes(item)
                            ? "bg-brand/5 border-brand text-brand shadow-[0_2px_8px_-2px_rgba(41,196,84,0.12)]"
                            : "bg-white border-slate-200 text-navy/60 hover:border-brand/30 hover:text-brand",
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
                    <span className="filter-preview-label">Região</span>
                    <Info className="w-4 h-4 text-muted-foreground/50" aria-hidden="true" />
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    {REGIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setRegion(item)}
                        aria-pressed={region === item}
                        className={cn(
                          "filter-preview-chip",
                          region === item
                            ? "bg-brand/5 border-brand text-brand shadow-[0_2px_8px_-2px_rgba(41,196,84,0.12)]"
                            : "bg-white border-slate-200 text-navy/60 hover:border-brand/30 hover:text-brand",
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* VALOR ESTIMADO */}
                <div>
                  <div className="filter-preview-value-header">
                    <div className="flex items-center gap-1.5">
                      <span className="filter-preview-label">Valor estimado (R$)</span>
                      <Info className="w-4 h-4 text-muted-foreground/50" aria-hidden="true" />
                    </div>
                    <span className="filter-preview-advanced">
                      Modo Avançado
                      <ChevronRight className="w-4 h-4 rotate-90" aria-hidden="true" />
                    </span>
                  </div>

                  <div className="filter-preview-values">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        readOnly
                        value={`R$ ${(value?.[0] || 0).toLocaleString("pt-BR")},00`}
                        aria-label="Valor mínimo estimado"
                        className="filter-preview-input"
                      />
                      <MousePointer2
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="w-3 h-[2px] bg-slate-200"></div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        readOnly
                        value={`R$ ${(value?.[1] || 0).toLocaleString("pt-BR")},00`}
                        aria-label="Valor máximo estimado"
                        className="filter-preview-input"
                      />
                      <MousePointer2
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div className="relative px-2">
                    <div className="flex items-end justify-between h-8 mb-[-4px] opacity-10 px-1">
                      {HISTOGRAM_DATA.map((h, index) => (
                        <div
                          key={`${index}-${h}`}
                          style={{ height: `${h}%` }}
                          className="w-[3px] bg-brand rounded-full"
                        />
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
                      <span className="filter-preview-scale-label">R$ 0</span>
                      <span className="filter-preview-scale-label">R$ 5.000.000+</span>
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
                    <TrendingUp className="w-6 h-6 text-brand" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="filter-preview-results-label">Resultados estimados</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-navy tracking-tight">
                        {estimatedResultsLabel}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground">licitações</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => (window.location.href = "/explorar")}
                  className="filter-preview-cta group"
                >
                  <span className="text-base">Visualizar prévia</span>
                  <ChevronRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
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
