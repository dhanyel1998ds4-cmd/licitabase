import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandMarks";
import { cn } from "@/lib/utils";
import { AppButton } from "./AppButton";

const NAV_LINKS = [
  { id: "busca", label: "Buscar licitações" },
  { id: "recursos", label: "Funcionalidades" },
  { id: "bot-de-lances", label: "Bot de lances" },
  { id: "planos", label: "Planos" },
  { id: "faq", label: "Perguntas frequentes" },
] as const;

interface HeaderProps {
  forceSolid?: boolean;
}

export function Header({ forceSolid = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("busca");

  useEffect(() => {
    let animationFrame: number | null = null;

    const updateHeaderState = () => {
      if (animationFrame !== null) return;

      animationFrame = window.requestAnimationFrame(() => {
        const valueProof = document.getElementById("prova-de-valor");
        setIsScrolled(window.scrollY > 24);
        setIsPastHero(Boolean(valueProof && valueProof.getBoundingClientRect().top <= 90));

        const activationLine = Math.min(180, window.innerHeight * 0.28);
        const currentSection = NAV_LINKS.map((link) => ({
          id: link.id,
          top:
            document.getElementById(link.id)?.getBoundingClientRect().top ??
            Number.POSITIVE_INFINITY,
        }))
          .filter((section) => section.top <= activationLine)
          .sort((left, right) => right.top - left.top)[0];
        setActiveSection(currentSection?.id ?? NAV_LINKS[0].id);
        animationFrame = null;
      });
    };

    window.addEventListener("scroll", updateHeaderState, { passive: true });
    window.addEventListener("resize", updateHeaderState);
    updateHeaderState();

    return () => {
      window.removeEventListener("scroll", updateHeaderState);
      window.removeEventListener("resize", updateHeaderState);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={cn("lp-header", isScrolled && "lp-header--scrolled")}>
      <div className="lp-header__ambient" aria-hidden="true" />

      <nav
        className={cn(
          "lp-header__panel",
          isScrolled && "lp-header__panel--compact",
          (forceSolid || isPastHero) && "lp-header__panel--solid",
        )}
        aria-label="Navegação principal"
      >
        <div className="lp-header__reflection" aria-hidden="true" />

        <a
          href="/lp"
          className="lp-header__brand"
          aria-label="Ir para a página inicial da Licitabase"
        >
          <BrandLogo variant="light" className="lp-header__logo" />
        </a>

        <div className="lp-header__nav hidden xl:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={forceSolid ? `/lp#${link.id}` : `#${link.id}`}
              onClick={() => setActiveSection(link.id)}
              className={cn(
                "lp-header__nav-link",
                activeSection === link.id && "lp-header__nav-link--active",
              )}
            >
              {link.label}
              {activeSection === link.id ? (
                <span className="lp-header__active-indicator" aria-hidden="true" />
              ) : null}
            </a>
          ))}
        </div>

        <div className="lp-header__actions">
          <AppButton
            variant="secondary"
            size="md"
            className="hidden min-w-[112px] xl:flex"
            onClick={() => window.location.assign("/login")}
          >
            Entrar
          </AppButton>

          <AppButton
            variant="primary"
            size="md"
            className="lp-header__signup hidden xl:inline-flex"
            iconRight={<ArrowRight aria-hidden="true" />}
            aria-label="Criar conta grátis"
            onClick={() => window.location.assign("/signup")}
          >
            <span className="lp-header__cta-full">Criar conta grátis</span>
            <span className="lp-header__cta-short">Começar</span>
          </AppButton>

          <button
            type="button"
            className="lp-header__menu-trigger xl:hidden"
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-controls="lp-mobile-navigation"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div id="lp-mobile-navigation" className="lp-header__mobile-menu xl:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={forceSolid ? `/lp#${link.id}` : `#${link.id}`}
                onClick={closeMobileMenu}
              >
                {link.label}
              </a>
            ))}
            <div className="lp-header__mobile-divider" />
            <a href="/login" onClick={closeMobileMenu} className="lp-header__mobile-login">
              Entrar
            </a>
            <a href="/signup" onClick={closeMobileMenu} className="lp-header__mobile-signup">
              <span>Começar</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        ) : null}
      </nav>

      <div className="lp-header__edge-light" aria-hidden="true" />
    </header>
  );
}
