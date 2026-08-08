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
              <div className="footer-brand__social">
                <a href="#" className="social-icon" aria-label="LinkedIn">
                  <Linkedin className="size-4" />
                </a>
                <a href="#" className="social-icon" aria-label="YouTube">
                  <Youtube className="size-4" />
                </a>
                <a href="#" className="social-icon" aria-label="Email">
                  <Mail className="size-4" />
                </a>
              </div>
            </div>

            {/* Links Sections */}
            <div className="footer-links">
              <div className="footer-group">
                <div className="footer-group__header">
                  <div className="footer-group__icon">
                    <LayoutGrid className="size-4" />
                  </div>
                  <h4 className="footer-group__title">Plataforma</h4>
                </div>
                <ul className="footer-group__list">
                  <li>
                    <a href="#" className="footer-link">
                      Buscar licitações
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Categorias
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Itens e preços
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Concorrentes
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Bot de lances
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Planos
                    </a>
                  </li>
                </ul>
              </div>

              <div className="footer-group">
                <div className="footer-group__header">
                  <div className="footer-group__icon">
                    <Zap className="size-4" />
                  </div>
                  <h4 className="footer-group__title">Recursos</h4>
                </div>
                <ul className="footer-group__list">
                  <li>
                    <a href="#" className="footer-link">
                      Alertas de oportunidades
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Leitura de editais com IA
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Comparação de preços
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Gestão de prazos
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Integrações
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Pipeline de licitações
                    </a>
                  </li>
                </ul>
              </div>

              <div className="footer-group">
                <div className="footer-group__header">
                  <div className="footer-group__icon">
                    <User className="size-4" />
                  </div>
                  <h4 className="footer-group__title">Empresa</h4>
                </div>
                <ul className="footer-group__list">
                  <li>
                    <a href="#" className="footer-link">
                      Entrar
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Criar conta
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Central de ajuda
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Termos de uso
                    </a>
                  </li>
                  <li>
                    <a href="#" className="footer-link">
                      Política de privacidade
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom__legal">
              <div className="legal-icon">
                <Zap className="size-3 text-primary fill-primary/20" />
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
