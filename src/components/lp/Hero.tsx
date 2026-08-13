import { useState, type ReactNode } from "react";
import {
  Building2,
  ChevronDown,
  DollarSign,
  LayoutGrid,
  MapPin,
  Monitor,
  Search,
} from "lucide-react";
import { AppButton } from "./AppButton";

const QUICK_FILTERS = [
  { icon: <LayoutGrid size={18} />, label: "Categoria" },
  { icon: <MapPin size={18} />, label: "Estado" },
  { icon: <Building2 size={18} />, label: "Órgão" },
  { icon: <DollarSign size={18} />, label: "Valor estimado" },
  { icon: <Monitor size={18} />, label: "Plataforma" },
] as const;

export function Hero() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <section id="busca" className="lp-hero" aria-labelledby="hero-title">
      <div className="lp-hero__body">
        <div className="lp-hero__visual">
          <div className="lp-hero__visual-glow" aria-hidden="true" />
          <img
            src="/licitabase-integracoes.png"
            alt="Rede de integrações da Licitabase com plataformas de licitação"
            width={1664}
            height={945}
            fetchPriority="high"
            decoding="async"
            sizes="(max-width: 599px) 88vw, (max-width: 1023px) 74vw, 620px"
          />
        </div>

        <h1 id="hero-title" className="lp-hero__title">
          <span>
            Encontre as <strong>licitações certas.</strong>
          </span>
          <span>Analise mais rápido.</span>
          <span>Dispute com mais controle.</span>
        </h1>

        <p className="lp-hero__description">
          Monitore oportunidades em todo o Brasil, receba licitações alinhadas ao seu negócio e
          organize sua operação em um só lugar.
        </p>

        <div className="tender-search-panel" aria-label="Busca rápida de licitações">
          <div className="tender-search-panel__content">
            <div className="tender-search-panel__search-row">
              <div className="tender-search-panel__input-wrap">
                <Search aria-hidden="true" />
                <input
                  type="search"
                  aria-label="Buscar licitações"
                  placeholder="Busque por produto, serviço, órgão ou palavra-chave"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
              </div>
              <AppButton
                type="button"
                variant="search"
                size="md"
                iconLeft={<Search aria-hidden="true" />}
                className="tender-search-panel__submit"
              >
                Buscar licitações grátis
              </AppButton>
            </div>

            <div className="tender-search-panel__filters">
              {QUICK_FILTERS.map((filter) => (
                <FilterButton key={filter.label} icon={filter.icon} label={filter.label} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="tender-search-panel__filter"
      aria-label={`Filtrar por ${label}`}
    >
      <span className="tender-search-panel__filter-label">
        <span className="tender-search-panel__filter-icon" aria-hidden="true">
          {icon}
        </span>
        <span>{label}</span>
      </span>
      <ChevronDown size={16} aria-hidden="true" />
    </button>
  );
}
