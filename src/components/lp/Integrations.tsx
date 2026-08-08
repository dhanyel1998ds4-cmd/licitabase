import { AppButton } from "./AppButton";

export function Integrations() {
  const available = ["ComprasNet", "Licitanet", "Portal de Compras Públicas"];
  const soon = ["BNC Compras", "BLL Compras"];

  return (
    <section className="py-24 bg-white relative">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-[800] tracking-tight text-navy leading-tight">
            Seus portais conectados em um mesmo ambiente
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Centralize participações e reduza o trabalho manual de acompanhar múltiplos canais de disputa.
          </p>
        </div>

        <div className="flex flex-col items-center gap-12">
           <div className="flex flex-wrap justify-center gap-8">
              {available.map((name) => (
                <div key={name} className="px-8 py-7 rounded-[24px] border border-border bg-sunken flex items-center justify-center min-w-[220px] shadow-sm hover:border-brand/30 hover:shadow-raised transition-all cursor-default group">
                   <div className="font-bold text-navy group-hover:text-brand transition-colors">{name}</div>
                </div>
              ))}
           </div>
           
           <div className="flex flex-wrap justify-center gap-8">
              {soon.map((name) => (
                <div key={name} className="px-8 py-7 rounded-[24px] border border-dashed border-border bg-white flex items-center justify-center min-w-[220px] relative overflow-hidden opacity-50">
                   <div className="font-bold text-muted-foreground">{name}</div>
                   <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-border text-[8px] font-bold text-muted-foreground uppercase">
                     Em breve
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="mt-16 text-center flex justify-center">
          <AppButton 
            variant="ghost" 
            size="md"
            className="underline underline-offset-4"
          >
            Ver como funcionam as integrações
          </AppButton>
        </div>

      </div>
    </section>
  );
}
