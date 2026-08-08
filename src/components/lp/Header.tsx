import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Search } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandMarks";
import { cn } from "@/lib/utils";
import { AppButton } from "./AppButton";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('bot-de-lances'); // Default active as per reference

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getSection = () => document.getElementById('prova-de-valor');

    const update = () => {
      const section = getSection();
      if (!section) return;
      const top = section.getBoundingClientRect().top;
      // Vidro só a partir do momento em que a seção "Uma operação de licitações
      // mais simples..." encosta no topo (altura do header ~ 90px).
      setIsPastHero(top <= 90);
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);


  return (
    <header 
      className={cn(
        "lp-header fixed top-0 left-0 right-0 z-[60] flex justify-center pt-6 px-6 transition-all duration-300 bg-transparent overflow-visible",
        isScrolled && "pt-3"
      )}
    >
      {/* Ambient Lighting Layer */}
      <div 
        className="lp-header__ambient absolute inset-0 z-0 pointer-events-none opacity-40 blur-[40px]" 
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(41, 196, 84, 0.08), transparent 70%)'
        }}
      />

      <nav 
        className={cn(
          "lp-header__panel relative z-10 flex items-center justify-between w-full max-w-[1500px] min-h-[82px] px-8 py-0 rounded-full transition-all duration-300",
          "border border-white/10 bg-[#0A0C10]/20",
          isScrolled && "min-h-[70px]",
          isPastHero && "min-h-[70px] bg-[#0A0C10]/72 border-white/20 backdrop-blur-[28px] backdrop-saturate-150"
        )}
        style={{
          backgroundImage: isPastHero
            ? 'linear-gradient(145deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03) 45%, rgba(41,196,84,0.04))'
            : 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01) 45%, rgba(41,196,84,0.02))',
          boxShadow: isPastHero
            ? '0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(255,255,255,0.05)'
            : '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(255,255,255,0.03)',
        }}
        aria-label="Navegação principal"
      >
        {/* Reflexo superior do vidro */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/10 to-transparent"
          aria-hidden="true"
        />

        {/* Logotipo */}
        <div className="lp-header__brand flex items-center">
          <a href="/" className="transition-transform active:scale-95">
            <BrandLogo variant="light" className="scale-90 origin-left" />
          </a>
        </div>

        {/* Navegação Central */}
        <div className="lp-header__nav hidden lg:flex items-center justify-center gap-1">
          {[
            { id: 'busca', label: 'Buscar licitações' },
            { id: 'recursos', label: 'Funcionalidades' },
            { id: 'bot-de-lances', label: 'Bot de lances' },
            { id: 'planos', label: 'Planos' },
            { id: 'faq', label: 'Perguntas frequentes' }
          ].map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setActiveSection(link.id)}
              className={cn(
                "relative flex items-center justify-center min-h-[48px] px-8 text-sm font-semibold tracking-wide transition-all duration-200",
                activeSection === link.id ? "text-white" : "text-gray-400 hover:text-white"
              )}
            >
              {link.label}
              {activeSection === link.id && (
                <div 
                  className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-4 h-[3px] bg-[#29C454] rounded-full shadow-[0_0_8px_rgba(41,196,84,0.6)]" 
                  aria-hidden="true"
                />
              )}
            </a>
          ))}
        </div>

        {/* Ações da Direita */}
        <div className="lp-header__actions flex items-center gap-3">
          <AppButton 
            variant="secondary" 
            size="md"
            className="hidden lg:flex min-w-[120px]"
            onClick={() => window.location.href = '/login'}
          >
            Entrar
          </AppButton>
          
          <AppButton 
            variant="primary" 
            size="md"
            iconRight={<ArrowRight className="app-button__icon app-button__icon--right" />}
            onClick={() => window.location.href = '/signup'}
          >
            <span className="hidden sm:inline">Criar conta grátis</span>
          </AppButton>



          {/* Mobile Menu Trigger */}
          <button 
            className="lg:hidden flex items-center justify-center w-[48px] h-[48px] rounded-[16px] border border-white/10 text-white/90 hover:bg-white/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu Popover */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-3 mx-0 bg-[#0A0C10] border border-white/10 rounded-3xl p-6 flex flex-col gap-5 shadow-2xl animate-in fade-in slide-in-from-top-2 z-[70]">
            <a href="#busca" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-400 hover:text-gray-200">Buscar licitações</a>
            <a href="#recursos" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-400 hover:text-gray-200">Funcionalidades</a>
            <a href="#bot-de-lances" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-400 hover:text-gray-200">Bot de lances</a>
            <a href="#planos" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-400 hover:text-gray-200">Planos</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium text-gray-400 hover:text-gray-200">Perguntas frequentes</a>
            <div className="h-px bg-white/5 my-1" />
            <a href="/login" className="text-base font-semibold text-white">Entrar</a>
          </div>
        )}
      </nav>

      {/* Indicador luminoso central na borda inferior do viewport (opcional, based on prompt) */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-[#29C454]/20 blur-[2px] rounded-full pointer-events-none" 
        aria-hidden="true" 
      />
    </header>
  );
}
