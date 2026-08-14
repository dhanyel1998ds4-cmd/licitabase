import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
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
  name?: string;
  email?: string;
  password?: string;
  terms?: string;
};

type AuthMode = "login" | "recover" | "signup";

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

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]">
      <path
        fill="#4285F4"
        d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.2c1.9-1.8 3.1-4.4 3.1-7.5Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.6c-.9.6-2 .9-3.5.9-2.7 0-5-1.8-5.8-4.3H2.9v2.7A10 10 0 0 0 12 22Z"
      />
      <path fill="#FBBC05" d="M6.2 13.6a6 6 0 0 1 0-3.7V7.2H2.9a10 10 0 0 0 0 9.1l3.3-2.7Z" />
      <path
        fill="#EA4335"
        d="M12 6.1c1.5 0 2.9.5 3.9 1.5l2.9-2.9C17 3 14.7 2 12 2A10 10 0 0 0 2.9 7.2l3.3 2.7C7 7.9 9.3 6.1 12 6.1Z"
      />
    </svg>
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

function validate(
  mode: AuthMode,
  name: string,
  email: string,
  password: string,
  terms: boolean,
): FieldErrors {
  const errors: FieldErrors = {};
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    errors.email = "Informe seu e-mail.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    errors.email = "Digite um e-mail válido.";
  }

  if (mode !== "recover" && !password) {
    errors.password = "Informe sua senha.";
  }

  if (mode === "signup" && !name.trim()) errors.name = "Informe seu nome.";
  if (mode === "signup" && !terms) errors.terms = "Aceite os termos para criar sua conta.";

  return errors;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
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
    const nextErrors = validate(mode, name, email, password, terms);
    setErrors(nextErrors);
    setAuthNotice("");

    if (Object.keys(nextErrors).length > 0) return;

    if (mode === "recover") {
      setAuthNotice("Enviamos as instruções de recuperação para seu e-mail.");
      return;
    }
    setAuthNotice(
      mode === "signup"
        ? "Conta criada. Vamos configurar seu workspace..."
        : "Acesso validado. Preparando seu workspace...",
    );
    window.setTimeout(() => navigate({ to: "/onboarding" }), 350);
  };

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrors({});
    setAuthNotice("");
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
                  <h2 id="login-title">
                    {mode === "login"
                      ? "Bem-vindo de volta"
                      : mode === "recover"
                        ? "Recupere sua senha"
                        : "Crie sua conta"}
                  </h2>
                  <p>
                    {mode === "login"
                      ? "Entre na sua conta para continuar"
                      : mode === "recover"
                        ? "Enviaremos um link seguro para o seu e-mail"
                        : "Comece configurando seu workspace de licitações"}
                  </p>
                </header>

                <form
                  key={mode}
                  className="auth-split-form auth-split-form--swap"
                  noValidate
                  onSubmit={handleSubmit}
                >
                  {mode === "signup" ? (
                    <div className="auth-split-field">
                      <label htmlFor="signup-name">Nome</label>
                      <div
                        className="auth-split-input"
                        data-invalid={errors.name ? "true" : undefined}
                      >
                        <input
                          id="signup-name"
                          name="name"
                          autoComplete="name"
                          placeholder="Seu nome completo"
                          value={name}
                          onChange={(event) => {
                            setName(event.target.value);
                            clearFieldError("name");
                          }}
                        />
                      </div>
                      {errors.name ? (
                        <p className="auth-split-field__error" role="alert">
                          {errors.name}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
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

                  {mode === "signup" ? (
                    <label className="flex items-start gap-2 text-[11.5px] leading-relaxed text-slate-text">
                      <input
                        type="checkbox"
                        checked={terms}
                        onChange={(event) => {
                          setTerms(event.target.checked);
                          clearFieldError("terms");
                        }}
                        className="mt-0.5 size-4 accent-[#18B849]"
                      />
                      Aceito os termos de uso e a política de privacidade.
                    </label>
                  ) : null}
                  {errors.terms ? (
                    <p className="auth-split-field__error" role="alert">
                      {errors.terms}
                    </p>
                  ) : null}

                  {mode !== "recover" ? (
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
                        <p
                          id="login-password-error"
                          className="auth-split-field__error"
                          role="alert"
                        >
                          {errors.password}
                        </p>
                      )}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    className="app-button app-button--md app-button--primary app-button--full-width auth-split-submit"
                  >
                    <span>
                      {mode === "login"
                        ? "Entrar"
                        : mode === "recover"
                          ? "Enviar link"
                          : "Criar conta"}
                    </span>
                    <ArrowRight
                      className="app-button__icon app-button__icon--right auth-split-submit__icon"
                      aria-hidden="true"
                    />
                  </button>

                  <div className="flex items-center justify-between gap-3 text-[12px] font-semibold">
                    {mode === "login" ? (
                      <>
                        <button
                          type="button"
                          className="text-brand-strong hover:underline"
                          onClick={() => changeMode("recover")}
                        >
                          Esqueci minha senha
                        </button>
                        <button
                          type="button"
                          className="text-brand-strong hover:underline"
                          onClick={() => changeMode("signup")}
                        >
                          Criar conta
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="mx-auto text-brand-strong hover:underline"
                        onClick={() => changeMode("login")}
                      >
                        Voltar para entrar
                      </button>
                    )}
                  </div>

                  {mode !== "recover" ? (
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 text-[10.5px] font-semibold text-slate-text before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200">
                        ou continue com
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setAuthNotice(
                            "A autenticação com Google será aberta quando o provedor OAuth estiver conectado.",
                          )
                        }
                        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-[12px] font-bold text-ink transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                      >
                        <GoogleMark />
                        {mode === "login" ? "Entrar com Google" : "Cadastrar com Google"}
                      </button>
                    </div>
                  ) : null}

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
