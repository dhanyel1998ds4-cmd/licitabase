import { Share2, ShieldCheck, Target, Zap } from "lucide-react";
import { AppButton } from "@/components/lp/AppButton";

const BOT_BENEFITS = [
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
    <div className="lp-bidbot-copy">
      <div className="lp-bidbot-copy__eyebrow">
        <span aria-hidden="true" />
        Bot de Lances
      </div>

      <h2 id="bidbot-title" className="lp-bidbot-copy__title">
        <span className="text-white">Seus lances continuam</span>{" "}
        <span className="lp-bidbot-copy__highlight">mesmo quando sua atenção</span>{" "}
        <span className="text-white">está em outras oportunidades.</span>
      </h2>

      <p className="lp-bidbot-copy__lead">
        O bot do Licitabase monitora a sala de disputa, identifica o início da etapa competitiva e
        executa a estratégia configurada por você.
      </p>

      <div className="lp-bidbot-copy__control-note">
        <span className="lp-bidbot-copy__control-icon">
          <ShieldCheck aria-hidden="true" />
        </span>
        <div>
          <p>Você define as regras. O bot opera dentro dos limites configurados.</p>
          <span>Segurança, conformidade e performance.</span>
        </div>
      </div>

      <ul className="lp-bidbot-benefits">
        {BOT_BENEFITS.map((item) => (
          <li key={item.title} className="lp-bidbot-benefit">
            <span className="lp-bidbot-benefit__icon">
              <item.icon aria-hidden="true" />
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <strong>{item.hint}</strong>
          </li>
        ))}
      </ul>

      <div className="lp-bidbot-copy__actions">
        <AppButton
          variant="primary"
          size="md"
          responsiveFull
          onClick={() => {
            window.location.href = "/bot-lances";
          }}
        >
          Conhecer o bot de lances
        </AppButton>
        <AppButton
          variant="secondary"
          size="md"
          responsiveFull
          onClick={() => document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" })}
        >
          Ver planos com automação
        </AppButton>
      </div>

      <ul className="lp-bidbot-copy__trust-list">
        <li>
          <ShieldCheck aria-hidden="true" /> Infraestrutura segura
        </li>
        <li aria-hidden="true">•</li>
        <li>Conformidade LGPD</li>
        <li aria-hidden="true">•</li>
        <li>Auditoria completa</li>
      </ul>
    </div>
  );
}
