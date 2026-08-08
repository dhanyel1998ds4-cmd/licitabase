import { Share2, ShieldCheck, Target, Zap } from "lucide-react";
import { AppButton } from "@/components/lp/AppButton";

const benefits = [
  {
    icon: Target,
    title: "Estratégias sob seu controle",
    text: "Configure decremento fixo, percentual ou preço-alvo e defina um piso absoluto ou percentual.",
    hint: "Defina a estratégia antes da disputa começar.",
  },
  {
    icon: Zap,
    title: "Entrada automática",
    text: "Quando a etapa competitiva começa, o bot acessa a sala e inicia a estratégia configurada.",
    hint: "Menos dependência de acompanhamento manual contínuo.",
  },
  {
    icon: Share2,
    title: "Plataformas integradas",
    text: "Utilize o bot no ComprasNet, Licitanet e Portal de Compras Públicas.",
    hint: "BNC Compras e BLL Compras em desenvolvimento.",
  },
];

export function BidBotMarketingCopy() {
  return (
    <div className="flex flex-col items-start">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#29C454]/30 bg-[#29C454]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
        <span className="size-1.5 rounded-full bg-[#29C454]" aria-hidden="true" />
        Bot de Lances
      </div>

      <h2 className="mt-8 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05] tracking-tight">
        <span className="text-white">Seus lances continuam</span>{" "}
        <span className="text-[#29C454]">mesmo quando sua atenção</span> <span className="text-white">está em outras oportunidades.</span>
      </h2>

      <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
        O bot do Licitabase monitora a sala de disputa, identifica o início da etapa competitiva e executa a
        estratégia configurada por você.
      </p>

      <div className="mt-8 flex w-full items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5">
          <ShieldCheck className="size-5 text-[#29C454]" aria-hidden="true" />
        </span>
        <div>
          <p className="text-base font-bold leading-snug text-white">
            Você define as regras. O bot opera dentro dos limites configurados.
          </p>
          <p className="mt-1 text-sm font-medium text-white">Segurança, conformidade e performance.</p>
        </div>
      </div>

      <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
        {benefits.map((item) => (
          <div key={item.title} className="flex flex-col gap-3">
            <span className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/5">
              <item.icon size={18} className="text-[#29C454]" aria-hidden="true" />
            </span>
            <h3 className="text-sm font-bold leading-snug text-white">{item.title}</h3>
            <p className="text-xs leading-relaxed text-white/60">{item.text}</p>
            <p className="text-xs font-medium leading-relaxed text-white/80">{item.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <AppButton
          variant="primary"
          size="md"
          className="w-full sm:w-auto"
          onClick={() => {
            window.location.href = "/bot-de-lances";
          }}
        >
          Conhecer o bot de lances
        </AppButton>
        <AppButton
          variant="secondary"
          size="md"
          className="w-full sm:w-auto"
          onClick={() => document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" })}
        >
          Ver planos com automação
        </AppButton>
      </div>

      <ul className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-wider text-white/40">
        <li className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5" aria-hidden="true" /> Infraestrutura segura
        </li>
        <li aria-hidden="true">•</li>
        <li>Conformidade LGPD</li>
        <li aria-hidden="true">•</li>
        <li>Auditoria completa</li>
      </ul>
    </div>
  );
}
