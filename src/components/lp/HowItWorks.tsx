import { CheckCircle2, Target, BarChart3, ListChecks, ArrowRight } from "lucide-react";
import { AppButton } from "./AppButton";


export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-sunken">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-navy leading-tight">
            Pare de procurar edital por edital
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Configure os critérios importantes para sua empresa e use o Licitabase para encontrar, selecionar e acompanhar oportunidades com mais consistência.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 p-1 px-4 bg-white rounded-full shadow-sm border border-border text-sm font-bold text-navy">
             <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
             "Menos tempo filtrando oportunidades. Mais tempo preparando propostas competitivas."
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Target, title: "Defina o que procura", text: "Selecione categorias, regiões, modalidades, valores e outros critérios importantes para sua operação." },
            { icon: BarChart3, title: "Receba novas oportunidades", text: "O Licitabase monitora as publicações e organiza oportunidades alinhadas aos critérios configurados." },
            { icon: ListChecks, title: "Monte seu pipeline", text: "Analise, aprove ou descarte oportunidades e acompanhe as melhores até a disputa." },
          ].map((step, index) => (
            <div key={index} className="relative p-8 bg-white rounded-[32px] border border-border shadow-raised hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-brand-tint flex items-center justify-center text-brand mb-6 shadow-sm shadow-brand/10">
                <step.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-navy">{step.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <AppButton 
            variant="primary" 
            size="lg"
            iconRight={<ArrowRight className="app-button__icon app-button__icon--right" />}
            className="min-w-[320px]"
            onClick={() => window.location.href = '/signup'}
          >
            Criar conta grátis
          </AppButton>

          <p className="mt-3 text-sm text-[#667085]">Crie sua conta gratuitamente e configure seus primeiros critérios.</p>
        </div>
      </div>
    </section>
  );
}
