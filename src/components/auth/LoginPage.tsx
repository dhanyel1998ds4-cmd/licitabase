import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BellRing,
  Bot,
  ChartNoAxesCombined,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandMarks";
import "./LoginPage.css";

type FieldErrors = {
  email?: string;
  password?: string;
};

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Search,
    title: "Busca inteligente",
    description: "Mais de 15 filtros para encontrar licitações do seu setor.",
  },
  {
    icon: BellRing,
    title: "Alertas em tempo real",
    description: "Receba notificações quando novas oportunidades forem publicadas.",
  },
  {
    icon: Bot,
    title: "Bot de lances automáticos",
    description: "Automatize sua operação nas principais plataformas de disputa.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Detecção de alto potencial",
    description: "Compare oportunidades com uma base de 400 mil+ registros públicos.",
  },
];

function BrandOutline({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 320"
      className={`auth-split-outline ${className}`}
      fill="none"
    >
      <path d="M48 270V94L136 36V184H286L214 270H48Z" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function BrandGeometry() {
  return (
    <div className="auth-split-geometry" aria-hidden="true">
      <BrandOutline className="auth-split-outline--brand-back" />
      <BrandOutline className="auth-split-outline--brand-middle" />
      <BrandOutline className="auth-split-outline--brand-front" />
      <BrandOutline className="auth-split-outline--brand-highlight" />
      <span className="auth-split-geometry__dot auth-split-geometry__dot--one" />
      <span className="auth-split-geometry__dot auth-split-geometry__dot--two" />
    </div>
  );
}

function LightGeometry() {
  return (
    <div className="auth-split-light-geometry" aria-hidden="true">
      <BrandOutline className="auth-split-outline--light-top" />
      <BrandOutline className="auth-split-outline--light-bottom" />
    </div>
  );
}

function AuthFeature({ icon: Icon, title, description }: Feature) {
  return (
    <li className="auth-split-feature">
      <span className="auth-split-feature__icon">
        <Icon className="size-[22px]" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
    </li>
  );
}

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    errors.email = "Informe seu e-mail.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    errors.email = "Digite um e-mail válido.";
  }

  if (!password) {
    errors.password = "Informe sua senha.";
  }

  return errors;
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [authNotice, setAuthNotice] = useState("");

  const clearFieldError = (field: keyof FieldErrors) => {
    setErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    setAuthNotice("");

    if (Object.keys(nextErrors).length > 0) return;

    setAuthNotice(
      "A autenticação ainda não está conectada neste ambiente. Nenhuma credencial foi enviada.",
    );
  };

  return (
    <div className="auth-split-page lp-button-system">
      <main className="auth-split-layout">
        <div className="auth-split-brand-panel">
          <BrandGeometry />

          <div className="auth-split-brand-panel__inner">
            <div className="auth-split-brand" aria-label="Licitabase">
              <BrandLogo variant="light" className="auth-split-brand-logo" />
            </div>

            <div className="auth-split-narrative">
              <h1>
                <span>Inteligência que</span>
                <span>transforma licitações</span>
              </h1>
              <p>
                O centro de comando das suas licitações. Encontre oportunidades, analise dados e
                ganhe mais com automação e análises inteligentes.
              </p>
            </div>

            <ul className="auth-split-feature-list" aria-label="Recursos da Licitabase">
              {features.map((feature) => (
                <AuthFeature key={feature.title} {...feature} />
              ))}
            </ul>

            <div className="auth-split-brand-trust">
              <ShieldCheck aria-hidden="true" />
              <p>Segurança, performance e cuidado com os dados para impulsionar seus resultados.</p>
            </div>
          </div>
        </div>

        <div className="auth-split-form-panel">
          <LightGeometry />

          <div className="auth-split-form-panel__inner">
            <div className="auth-split-card-wrapper">
              <article className="auth-split-card" aria-labelledby="login-title">
                <header className="auth-split-card__header">
                  <h2 id="login-title">Bem-vindo de volta</h2>
                  <p>Entre na sua conta para continuar</p>
                </header>

                <form className="auth-split-form" noValidate onSubmit={handleSubmit}>
                  <div className="auth-split-field">
                    <label htmlFor="login-email">E-mail</label>
                    <div
                      className="auth-split-input"
                      data-invalid={errors.email ? "true" : undefined}
                    >
                      <Mail className="auth-split-input__leading" aria-hidden="true" />
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="seu@email.com"
                        value={email}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "login-email-error" : undefined}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          clearFieldError("email");
                          setAuthNotice("");
                        }}
                      />
                    </div>
                    {errors.email && (
                      <p id="login-email-error" className="auth-split-field__error" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="auth-split-field">
                    <label htmlFor="login-password">Senha</label>
                    <div
                      className="auth-split-input"
                      data-invalid={errors.password ? "true" : undefined}
                    >
                      <LockKeyhole className="auth-split-input__leading" aria-hidden="true" />
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Digite sua senha"
                        value={password}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={errors.password ? "login-password-error" : undefined}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          clearFieldError("password");
                          setAuthNotice("");
                        }}
                      />
                      <button
                        type="button"
                        className="auth-split-password-toggle"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((current) => !current)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-[18px]" aria-hidden="true" />
                        ) : (
                          <Eye className="size-[18px]" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p id="login-password-error" className="auth-split-field__error" role="alert">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="app-button app-button--md app-button--primary app-button--full-width auth-split-submit"
                  >
                    <span>Entrar</span>
                    <ArrowRight
                      className="app-button__icon app-button__icon--right auth-split-submit__icon"
                      aria-hidden="true"
                    />
                  </button>

                  {authNotice && (
                    <div className="auth-split-notice" role="status" aria-live="polite">
                      <LockKeyhole className="size-4 shrink-0" aria-hidden="true" />
                      <p>{authNotice}</p>
                    </div>
                  )}
                </form>

                <p className="auth-split-card__footnote">
                  O acesso é destinado a contas já habilitadas no produto.
                </p>
              </article>
            </div>

            <div className="auth-split-security-note">
              <ShieldCheck aria-hidden="true" />
              <p>Segurança e privacidade para proteger os dados da sua conta.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
