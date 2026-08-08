import { Building2, Search, ArrowRight } from "lucide-react";
import { Panel, PanelHeader } from "./Panel";
import { cn } from "@/lib/utils";

const monitored = [
  { name: "Alpha Construções Ltda.", status: "Ativa", cnpj: "12.345.678/0001-90" },
  { name: "Inova Soluções e Serviços", status: "Ativa", cnpj: "23.456.789/0001-01" },
  { name: "Global Tech Comércio Ltda.", status: "Ativa", cnpj: "34.567.890/0001-12" },
];

export function CompanySiteCard() {
  return (
    <Panel className="flex min-w-0 flex-col p-6">
      <PanelHeader
        icon={
          <div className="p-1.5 bg-[#29C454]/10 rounded-lg">
            <Building2 className="size-5 text-[#29C454]" strokeWidth={2} aria-hidden="true" />
          </div>
        }
        title="Site de Empresas"
        subtitle="Monitore empresas, acompanhe movimentos e descubra novas oportunidades de negócio."
      />

      <div className="mt-6 flex flex-col gap-6">
        <label className="relative block">
          <span className="sr-only">Buscar empresa por nome ou CNPJ</span>
          <input
            type="search"
            placeholder="Buscar empresa por nome ou CNPJ..."
            className="h-12 w-full rounded-xl border border-hairline bg-slate-50/50 pl-4 pr-12 text-[13.5px] font-medium text-ink placeholder:text-slate-text transition-all focus:bg-white focus:border-[#29C454] focus:outline-none focus:ring-4 focus:ring-[#29C454]/10"
          />
          <Search
            className="pointer-events-none absolute right-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-text"
            aria-hidden="true"
          />
        </label>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-ink">Empresas monitoradas</h3>
            <button className="text-[12px] font-bold text-[#29C454] hover:opacity-80 transition-opacity">Ver todas →</button>
          </div>

          <div className="divide-y divide-hairline border-y border-hairline">
            {monitored.map((company) => (
              <div key={company.name} className="flex items-center justify-between py-3 px-1 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-[#29C454]/10 flex items-center justify-center text-[11px] font-bold text-[#29C454]">
                    {company.name.charAt(0)}{company.name.split(' ')[1]?.charAt(0) || ''}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-ink">{company.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-[11px] font-medium text-slate-text uppercase tracking-tighter">CNPJ {company.cnpj}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#29C454] bg-[#29C454]/10 px-2 py-0.5 rounded-md">Ativa</span>
                    <ArrowRight className="size-3.5 text-slate-300 group-hover:text-green-500 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
