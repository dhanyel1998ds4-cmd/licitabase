import { useState } from "react";
import {
  Search,
  ChevronDown,
  LayoutGrid,
  MapPin,
  Building2,
  DollarSign,
  Monitor,
  ArrowRight,
} from "lucide-react";
import { AppButton } from "./AppButton";

export function Hero() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <section className="lp-hero bg-[#010103] pt-32 pb-20 overflow-hidden flex flex-col items-center">
      <div className="lp-hero__body w-[min(1280px,calc(100%-40px))] mx-auto text-center flex flex-col items-center">
        {/* 1. Ilustração Completa (Fluxo normal) */}
        <div className="lp-hero__visual relative w-[min(700px,58vw)] mt-[28px] mb-[28px] z-[1]">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(41,196,84,0.15),transparent_70%)] blur-[100px] pointer-events-none" />
          <img
            src="/licitabase-integracoes.png"
            alt="Integrações LicitaBase"
            width={1664}
            height={945}
            fetchPriority="high"
            className="block w-full h-auto object-contain"
          />
        </div>

        {/* 2. Headline Reorganizada */}
        <h1 className="lp-hero__title flex flex-col items-center w-full max-w-[1180px] mx-auto mb-6 text-[#f8fafc] text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-[-0.05em] text-center text-wrap-balance">
          <span className="block xl:whitespace-nowrap">
            Encontre as <strong className="text-[#29C454] font-inherit">licitações certas.</strong>{" "}
            Analise mais rápido.
          </span>
          <span className="block xl:whitespace-nowrap">Dispute com mais controle.</span>
        </h1>

        {/* 4. Texto de Apoio */}
        <p className="lp-hero__description max-w-[760px] mx-auto mb-10 text-lg sm:text-xl text-slate-400 font-medium leading-relaxed">
          Monitore oportunidades em todo o Brasil, receba licitações alinhadas ao seu negócio e
          organize sua operação em um só lugar.
        </p>

        {/* 5. Painel de Busca Principal */}
        <div className="tender-search-panel w-[min(1040px,100%)] mx-auto bg-white/5 border border-white/10 rounded-[32px] p-2 md:p-3 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col gap-3">
            {/* Input Principal */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center bg-white/5 border border-white/10 rounded-2xl p-1.5 md:p-2">
              <div className="flex flex-1 items-center px-4 py-3 md:py-0">
                <Search className="w-5 h-5 text-white/40 mr-4 shrink-0" />
                <input
                  type="text"
                  placeholder="Busque por produto, serviço, órgão ou palavra-chave"
                  className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none text-base font-medium"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <AppButton
                variant="search"
                size="md"
                iconLeft={<Search className="app-button__icon" />}
                className="w-full md:w-auto md:min-w-[240px]"
              >
                Buscar licitações grátis
              </AppButton>
            </div>

            {/* Filtros Rápidos */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <FilterButton icon={<LayoutGrid size={16} />} label="Categoria" />
              <FilterButton icon={<MapPin size={16} />} label="Estado" />
              <FilterButton icon={<Building2 size={16} />} label="Órgão" />
              <FilterButton icon={<DollarSign size={16} />} label="Valor estimado" />
              <FilterButton icon={<Monitor size={16} />} label="Plataforma" />
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 1279px) {
          .lp-hero__title span {
            white-space: normal;
          }
          .lp-hero__title {
            font-size: clamp(44px, 4vw, 56px);
          }
        }
        @media (max-width: 1023px) {
          .lp-hero__visual {
            width: min(520px, 80vw);
          }
          .lp-hero__title {
            font-size: clamp(38px, 4.5vw, 48px);
          }
          .tender-search-panel .grid-cols-2 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 767px) {
          .lp-hero__visual {
            width: min(400px, 90vw);
          }
          .lp-hero__title {
            font-size: clamp(34px, 8vw, 42px);
          }
          .tender-search-panel .grid {
            grid-template-columns: 1fr;
          }
        }
      `,
        }}
      />
    </section>
  );
}

function FilterButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center justify-between px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
      <div className="flex items-center gap-3">
        <span className="text-white/40 group-hover:text-[#29C454] transition-colors">{icon}</span>
        <span className="text-sm font-medium text-white/70">{label}</span>
      </div>
      <ChevronDown size={14} className="text-white/20" />
    </button>
  );
}
