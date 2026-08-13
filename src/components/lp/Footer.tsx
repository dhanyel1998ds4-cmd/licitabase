import { BrandLogo } from "../brand/BrandMarks";
import { Linkedin, Youtube, Mail, LayoutGrid, Zap, User } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="lp-footer" aria-label="Rodapé principal">
      <div className="lp-footer__glow-wrapper">
        <div className="lp-footer__panel">
          <div className="lp-footer__main">
            {/* Brand Section */}
            <div className="footer-brand">
              <BrandLogo className="mb-8" />
              <p className="footer-brand__text">
                Monitoramento, inteligência e automação para empresas que participam de licitações
                públicas.
              </p>
              <div className="footer-brand__social" aria-label="Canais sociais em configuração">
                <span
                  className="social-icon social-icon--disabled"
                  title="LinkedIn em configuração"
                >
                  <Linkedin className="size-4" aria-hidden="true" />
                </span>
                <span className="social-icon social-icon--disabled" title="YouTube em configuração">
                  <Youtube className="size-4" aria-hidden="true" />
                </span>
                <span className="social-icon social-icon--disabled" title="E-mail em configuração">
                  <Mail className="size-4" aria-hidden="true" />
                </span>
              </div>
            </div>

            {/* Links Sections */}
            <div className="footer-links">
              <div className="footer-group">
                <div className="footer-group__header">
                  <div className="footer-group__icon">
                    <LayoutGrid className="size-4" aria-hidden="true" />
                  </div>
                  <h4 className="footer-group__title">Plataforma</h4>
                </div>
                <ul className="footer-group__list">
                  <li>
                    <a href="#oportunidades" className="footer-link">
                      Buscar licitações
                    </a>
                  </li>
                  <li>
                    <a href="#categorias" className="footer-link">
                      Categorias
                    </a>
                  </li>
                  <li>
                    <a href="#recursos" className="footer-link">
                      Itens e preços
                    </a>
                  </li>
                  <li>
                    <a href="#recursos" className="footer-link">
                      Concorrentes
                    </a>
                  </li>
                  <li>
                    <a href="#bot-de-lances" className="footer-link">
                      Bot de lances
                    </a>
                  </li>
                  <li>
                    <a href="#planos" className="footer-link">
                      Planos
                    </a>
                  </li>
                </ul>
              </div>

              <div className="footer-group">
                <div className="footer-group__header">
                  <div className="footer-group__icon">
                    <Zap className="size-4" aria-hidden="true" />
                  </div>
                  <h4 className="footer-group__title">Recursos</h4>
                </div>
                <ul className="footer-group__list">
                  <li>
                    <a href="#recursos" className="footer-link">
                      Alertas de oportunidades
                    </a>
                  </li>
                  <li>
                    <a href="#recursos" className="footer-link">
                      Leitura de editais com IA
                    </a>
                  </li>
                  <li>
                    <a href="#recursos" className="footer-link">
                      Comparação de preços
                    </a>
                  </li>
                  <li>
                    <a href="#recursos" className="footer-link">
                      Gestão de prazos
                    </a>
                  </li>
                  <li>
                    <a href="#recursos" className="footer-link">
                      Integrações
                    </a>
                  </li>
                  <li>
                    <a href="#recursos" className="footer-link">
                      Pipeline de licitações
                    </a>
                  </li>
                </ul>
              </div>

              <div className="footer-group">
                <div className="footer-group__header">
                  <div className="footer-group__icon">
                    <User className="size-4" aria-hidden="true" />
                  </div>
                  <h4 className="footer-group__title">Empresa</h4>
                </div>
                <ul className="footer-group__list">
                  <li>
                    <a href="/login" className="footer-link">
                      Entrar
                    </a>
                  </li>
                  <li>
                    <a href="/signup" className="footer-link">
                      Criar conta
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="footer-link">
                      Central de ajuda
                    </a>
                  </li>
                  <li>
                    <span className="footer-link footer-link--disabled">Termos de uso</span>
                  </li>
                  <li>
                    <span className="footer-link footer-link--disabled">
                      Política de privacidade
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom__legal">
              <div className="legal-icon">
                <Zap className="size-3 text-primary fill-primary/20" aria-hidden="true" />
              </div>
              <span>Licitabase — Monitoramento de licitações públicas</span>
            </div>
            <div className="footer-bottom__copyright">
              <span className="copyright-icon">©</span>
              <span>{year} Licitabase.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
