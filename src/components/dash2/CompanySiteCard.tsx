import { Building2, Search, ArrowRight } from "lucide-react";
import { Panel, PanelHeader } from "./Panel";

const monitored = [
  { name: "Alpha Construções Ltda.", status: "Ativa", cnpj: "12.345.678/0001-90" },
  { name: "Inova Soluções e Serviços", status: "Ativa", cnpj: "23.456.789/0001-01" },
  { name: "Global Tech Comércio Ltda.", status: "Ativa", cnpj: "34.567.890/0001-12" },
];

export function CompanySiteCard() {
  return (
    <Panel className="flex min-w-0 flex-col p-5 sm:p-6">
      <PanelHeader
        icon={
          <div className="p-1.5 bg-[#29C454]/10 rounded-lg">
            <Building2 className="size-5 text-[#29C454]" strokeWidth={2} aria-hidden="true" />
          </div>
        }
        title="Site de Empresas"
        subtitle="Monitore empresas, acompanhe movimentos e descubra novas oportunidades de negócio."
      />

      <div className="mt-5 flex flex-col gap-5 sm:mt-6 sm:gap-6">
        <label className="relative block">
          <span className="sr-only">Buscar empresa por nome ou CNPJ</span>
          <input
            type="search"
            placeholder="Buscar empresa por nome ou CNPJ..."
            className="h-12 w-full rounded-xl border border-hairline bg-slate-50/50 pl-4 pr-12 text-[14px] font-medium text-ink placeholder:text-slate-text transition-all focus:border-[#29C454] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#29C454]/10"
          />
          <Search
            className="pointer-events-none absolute right-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-text"
            aria-hidden="true"
          />
        </label>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-ink">Empresas monitoradas</h3>
            <button
              type="button"
              className="inline-flex min-h-11 items-center rounded-lg px-2 text-[13px] font-bold text-[#29C454] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
            >
              Ver todas →
            </button>
          </div>

          <div className="divide-y divide-hairline border-y border-hairline">
            {monitored.map((company) => (
              <div
                key={company.name}
                className="group grid min-w-0 grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 px-1 py-3.5 transition-colors hover:bg-slate-50/50"
              >
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#29C454]/10 text-[12px] font-bold text-[#29C454]">
                  {company.name.charAt(0)}
                  {company.name.split(" ")[1]?.charAt(0) || ""}
                </div>

                <div className="min-w-0">
                  <p className="line-clamp-2 text-[14px] font-bold leading-snug text-ink">
                    {company.name}
                  </p>
                  <p className="mt-1 truncate text-[12px] font-medium text-slate-text sm:hidden">
                    CNPJ {company.cnpj}
                  </p>
                </div>

                <div className="flex min-w-0 items-center gap-2 sm:gap-4">
                  <span className="hidden whitespace-nowrap text-[12px] font-medium text-slate-text sm:inline">
                    CNPJ {company.cnpj}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md bg-[#29C454]/10 px-2 py-1 text-[12px] font-bold text-[#29C454]">
                      {company.status}
                    </span>
                    <ArrowRight
                      className="size-4 text-slate-300 transition-colors group-hover:text-green-500"
                      aria-hidden="true"
                    />
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
