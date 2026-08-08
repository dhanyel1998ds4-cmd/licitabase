import { 
  HeartPulse, 
  Building2, 
  Construction, 
  Truck, 
  Utensils, 
  GraduationCap, 
  Ticket, 
  BriefcaseMedical, 
  Monitor, 
  Code2, 
  Cloud, 
  Pencil, 
  Brush, 
  ShieldCheck, 
  BriefcaseBusiness, 
  RadioTower 
} from "lucide-react";
import { cn } from "@/lib/utils";

const sectorIcons: Record<string, any> = {
  "Saúde e medicamentos": HeartPulse,
  "Manutenção predial": Building2,
  "Construção civil": Construction,
  "Veículos e transporte": Truck,
  "Alimentação e refeições": Utensils,
  "Educação e capacitação": GraduationCap,
  "Eventos e produções artísticas": Ticket,
  "Equipamentos médico-hospitalares": BriefcaseMedical,
  "Equipamentos de informática": Monitor,
  "Desenvolvimento de software": Code2,
  "Serviços de tecnologia": Cloud,
  "Material de escritório": Pencil,
  "Serviços de limpeza": Brush,
  "Vigilância e segurança": ShieldCheck,
  "Consultoria": BriefcaseBusiness,
  "Telecomunicações": RadioTower,
};

export function Categories() {
  const categories = [
    { name: "Saúde e medicamentos", count: 12450 },
    { name: "Manutenção predial", count: 8720 },
    { name: "Construção civil", count: 15340 },
    { name: "Veículos e transporte", count: 6210 },
    { name: "Alimentação e refeições", count: 9180 },
    { name: "Educação e capacitação", count: 5430 },
    { name: "Eventos e produções artísticas", count: 4290 },
    { name: "Equipamentos médico-hospitalares", count: 7340 },
    { name: "Equipamentos de informática", count: 6890 },
    { name: "Desenvolvimento de software", count: 3210 },
    { name: "Serviços de tecnologia", count: 11200 },
    { name: "Material de escritório", count: 8950 },
    { name: "Serviços de limpeza", count: 6470 },
    { name: "Vigilância e segurança", count: 5980 },
    { name: "Consultoria", count: 4120 },
    { name: "Telecomunicações", count: 3780 },
  ];

  return (
    <section className="sectors-section relative overflow-hidden px-6 py-[clamp(88px,8vw,132px)] bg-gradient-to-b from-[#fbfcfd] to-[#f7f9fb]">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_50%_12%,rgba(34,197,94,0.025),transparent_30%)] pointer-events-none" />
      
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="sectors-section__header text-center max-w-[880px] mx-auto mb-[clamp(48px,5vw,66px)]">
          <h2 className="text-navy font-bold leading-[1.04] tracking-[-0.045em] text-balance" style={{ fontSize: 'clamp(44px, 4.3vw, 64px)' }}>
            Licitações para diferentes áreas de atuação
          </h2>
          <p className="mt-5 text-[#64748B] text-lg leading-[1.55]">
            Explore oportunidades organizadas por setor.
          </p>
          <span className="sectors-section__accent block w-[52px] h-[3px] bg-brand rounded-full mx-auto mt-[18px]" />
        </div>

        <div className="sectors-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[clamp(26px,2.5vw,42px)] gap-y-[clamp(24px,2.3vw,36px)]">
          {categories.map((cat, index) => {
            const Icon = sectorIcons[cat.name] || BriefcaseBusiness;
            return (
              <a 
                href={`/explorar?categoria=${encodeURIComponent(cat.name)}`}
                key={index} 
                className="sector-card group relative min-h-[140px] bg-gradient-to-br from-white/98 to-slate-50/92 border border-slate-200/72 rounded-[24px] shadow-[0_14px_32px_rgba(15,23,42,0.055),0_4px_10px_rgba(15,23,42,0.025),inset_0_1px_0_rgba(255,255,255,0.95)] transition-all duration-300 hover:-translate-y-[3px] hover:border-brand/30 hover:shadow-[0_18px_38px_rgba(15,23,42,0.075),0_7px_16px_rgba(34,197,94,0.05),inset_0_1px_0_rgba(255,255,255,0.98)] no-underline outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4"
              >
                <div className="sector-card__link flex items-center gap-5 p-[22px_24px] h-full">
                  <div className="sector-card__icon flex-none w-16 h-16 rounded-full bg-gradient-to-br from-white to-slate-50 border border-slate-200/70 shadow-[5px_5px_12px_rgba(15,23,42,0.06),-5px_-5px_12px_rgba(255,255,255,0.95)] grid place-items-center text-navy transition-all duration-300 group-hover:text-brand group-hover:border-brand/18 group-hover:bg-brand/5">
                    <Icon strokeWidth={1.8} size={28} aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[17px] font-bold text-navy leading-[1.25] tracking-[-0.018em] m-0 group-hover:text-brand transition-colors">
                      {cat.name}
                    </h3>
                    <span className="sector-card__indicator block w-[18px] h-[2px] bg-brand rounded-full my-2 transition-all duration-300 group-hover:w-[30px]" />
                    <p className="text-[#64748B] text-[15px] leading-[1.42] m-0">
                      {new Intl.NumberFormat("pt-BR").format(cat.count)} oportunidades disponíveis
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
