import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BellRing,
  BookOpenCheck,
  Bot,
  Building2,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  FileQuestion,
  FileText,
  KeyRound,
  LifeBuoy,
  Loader2,
  LogOut,
  Mail,
  MonitorSmartphone,
  MessageCircleMore,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
  WalletCards,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { PageContextHeader } from "@/components/dash2/PageContextHeader";
import { PageHowItWorks, type HowItWorksStep } from "@/components/dash2/PageHowItWorks";
import { Panel } from "@/components/dash2/Panel";
import { useResizableColumns } from "@/components/dash2/ResizableColumns";
import { ResourceListGridHeader } from "@/components/dash2/ResourceList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { accountInvoices, type AccountInvoice } from "@/lib/account-invoices";
import {
  defaultNotificationChannels,
  defaultOperationNotifications,
  notificationPreferenceKeys,
} from "@/lib/notification-preferences";

export type AccountSection =
  "perfil" | "empresa" | "equipe" | "plano" | "seguranca" | "notificacoes" | "ajuda";

type NavigationItem = {
  id: AccountSection;
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
};

const navigationItems: NavigationItem[] = [
  {
    id: "perfil",
    label: "Meu perfil",
    description: "Dados pessoais e identidade da conta",
    to: "/dash2/configuracoes/perfil",
    icon: UserRound,
  },
  {
    id: "empresa",
    label: "Empresa e workspace",
    description: "Dados cadastrais e ambiente da equipe",
    to: "/dash2/configuracoes/empresa",
    icon: Building2,
  },
  {
    id: "equipe",
    label: "Equipe e permissões",
    description: "Membros, convites e funções",
    to: "/dash2/configuracoes/equipe",
    icon: UsersRound,
  },
  {
    id: "plano",
    label: "Plano e faturamento",
    description: "Plano, consumo e pagamentos",
    to: "/dash2/configuracoes/plano",
    icon: WalletCards,
  },
  {
    id: "seguranca",
    label: "Segurança e acesso",
    description: "Senha, sessões e proteção da conta",
    to: "/dash2/configuracoes/seguranca",
    icon: ShieldCheck,
  },
  {
    id: "notificacoes",
    label: "Preferências de notificações",
    description: "Canais e alertas da operação",
    to: "/dash2/configuracoes/notificacoes",
    icon: BellRing,
  },
  {
    id: "ajuda",
    label: "Ajuda e suporte",
    description: "Materiais e atendimento LicitaBase",
    to: "/dash2/ajuda",
    icon: LifeBuoy,
  },
];

const sectionContent: Record<
  AccountSection,
  { eyebrow: string; title: string; description: string }
> = {
  perfil: {
    eyebrow: "Conta",
    title: "Meu perfil",
    description: "Atualize os dados exibidos na sua conta e na operação.",
  },
  empresa: {
    eyebrow: "Workspace",
    title: "Empresa e workspace",
    description: "Mantenha os dados da empresa e do ambiente de trabalho atualizados.",
  },
  equipe: {
    eyebrow: "Gestão",
    title: "Equipe e permissões",
    description: "Defina quem pode acessar a operação e quais ações cada pessoa executa.",
  },
  plano: {
    eyebrow: "Assinatura",
    title: "Plano e faturamento",
    description: "Acompanhe o uso, as licenças e os documentos de cobrança do workspace.",
  },
  seguranca: {
    eyebrow: "Proteção da conta",
    title: "Segurança e acesso",
    description: "Revise credenciais, sessões ativas e camadas extras de proteção.",
  },
  notificacoes: {
    eyebrow: "Preferências",
    title: "Preferências de notificações",
    description: "Escolha como a LicitaBase deve avisar você sobre a sua operação.",
  },
  ajuda: {
    eyebrow: "Central de ajuda",
    title: "Ajuda e suporte",
    description: "Encontre orientações e fale com o time quando precisar de atendimento.",
  },
};

const sectionGuides: Record<
  AccountSection,
  { title: string; description: string; steps: readonly HowItWorksStep[] }
> = {
  perfil: {
    title: "Mantenha sua identidade de conta atualizada",
    description:
      "Seus dados pessoais ajudam a reconhecer responsáveis e manter a comunicação da operação correta.",
    steps: [
      {
        title: "Revise seus dados",
        description: "Confira nome, e-mail e informações que identificam sua conta.",
      },
      {
        title: "Atualize o necessário",
        description: "Faça alterações apenas nos campos que precisam ser corrigidos.",
      },
      {
        title: "Salve com segurança",
        description: "Confirme a atualização antes de voltar para a operação.",
      },
    ],
  },
  empresa: {
    title: "Organize o workspace que sustenta sua operação",
    description:
      "Os dados da empresa aparecem nos fluxos compartilhados e ajudam a equipe a trabalhar no contexto certo.",
    steps: [
      {
        title: "Confira o cadastro",
        description: "Revise razão social, identificação e dados do workspace.",
      },
      {
        title: "Atualize responsáveis",
        description: "Mantenha os contatos e informações operacionais corretos.",
      },
      {
        title: "Aplique à equipe",
        description: "Salve para que todos trabalhem com o mesmo contexto.",
      },
    ],
  },
  equipe: {
    title: "Dê a cada pessoa somente o acesso necessário",
    description:
      "Convide colaboradores, defina funções e mantenha a operação protegida sem travar o trabalho da equipe.",
    steps: [
      {
        title: "Convide a pessoa",
        description: "Envie o acesso para quem precisa participar do workspace.",
      },
      {
        title: "Defina a função",
        description: "Escolha permissões coerentes com a responsabilidade de cada membro.",
      },
      {
        title: "Revise os acessos",
        description: "Remova ou atualize permissões sempre que a equipe mudar.",
      },
    ],
  },
  plano: {
    title: "Acompanhe assinatura, uso e cobranças em um só lugar",
    description:
      "Consulte o plano atual, recursos consumidos e documentos de faturamento antes de qualquer mudança.",
    steps: [
      {
        title: "Confira o plano",
        description: "Veja recursos incluídos, ciclo e capacidade disponível.",
      },
      { title: "Revise o consumo", description: "Entenda o uso do workspace e possíveis limites." },
      {
        title: "Consulte as faturas",
        description: "Abra cobranças, método de pagamento e comprovantes.",
      },
    ],
  },
  seguranca: {
    title: "Proteja a conta sem dificultar o acesso legítimo",
    description:
      "Revise credenciais, sessões e camadas de proteção para reduzir riscos no workspace.",
    steps: [
      {
        title: "Atualize credenciais",
        description: "Mantenha senha e métodos de recuperação em dia.",
      },
      {
        title: "Revise sessões",
        description: "Encerre acessos que não reconhece ou não são mais necessários.",
      },
      {
        title: "Ative proteções",
        description: "Use verificações adicionais sempre que estiverem disponíveis.",
      },
    ],
  },
  notificacoes: {
    title: "Receba o que importa no canal certo",
    description:
      "Escolha quais acontecimentos merecem aviso imediato e quais podem entrar em um resumo.",
    steps: [
      { title: "Escolha os eventos", description: "Ative apenas alertas que exigem sua atenção." },
      {
        title: "Defina os canais",
        description: "Combine avisos na plataforma, e-mail e WhatsApp.",
      },
      {
        title: "Salve as preferências",
        description: "Aplique a regra e confira os próximos avisos recebidos.",
      },
    ],
  },
  ajuda: {
    title: "Encontre orientação ou fale com o suporte",
    description:
      "Pesquise materiais práticos primeiro e abra um chamado com contexto quando precisar de atendimento humano.",
    steps: [
      {
        title: "Descreva a dúvida",
        description: "Busque pelo assunto, recurso ou situação que encontrou.",
      },
      {
        title: "Siga o guia",
        description: "Abra uma orientação prática sem sair do seu contexto.",
      },
      {
        title: "Abra um chamado",
        description: "Envie o caso ao suporte se ainda precisar de ajuda.",
      },
    ],
  },
};

function useStoredState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const storageKey = `licitabase:account:${key}`;
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue: Dispatch<SetStateAction<T>> = (next) => {
    setValue((current) => {
      const resolved = typeof next === "function" ? (next as (previous: T) => T)(current) : next;

      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(resolved));
        window.dispatchEvent(
          new CustomEvent("licitabase:account-updated", { detail: { key, value: resolved } }),
        );
      }

      return resolved;
    });
  };

  return [value, setStoredValue];
}

export function AccountSettingsPage({ section }: { section: AccountSection }) {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const current = sectionContent[section];
  const selectedItem = navigationItems.find((item) => item.id === section)!;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="space-y-5 sm:space-y-6">
        <PageContextHeader
          context={section === "ajuda" ? "support" : "settings"}
          title={current.title}
          description={current.description}
          actions={
            <Button
              type="button"
              variant="outline"
              onClick={() => setNavigationOpen(true)}
              className="min-h-11 rounded-xl border-hairline bg-white text-[12px] font-bold text-ink lg:hidden"
            >
              <selectedItem.icon className="size-4 text-brand-strong" />
              {selectedItem.label}
              <ChevronRight className="size-4 text-slate-text" />
            </Button>
          }
        />

        <PageHowItWorks {...sectionGuides[section]} />

        <div className="grid items-start gap-5 lg:grid-cols-[252px_minmax(0,1fr)] lg:gap-6">
          <AccountNavigation section={section} className="hidden lg:block" />
          <div className="min-w-0">{renderSection(section)}</div>
        </div>
      </div>

      <Drawer open={navigationOpen} onOpenChange={setNavigationOpen}>
        <DrawerContent className="rounded-t-[24px] border-hairline bg-white font-manrope">
          <div className="px-5 pb-3 pt-5">
            <DrawerTitle className="text-left text-[18px] font-extrabold text-ink">
              Configurações
            </DrawerTitle>
            <DrawerDescription className="mt-1 text-left text-[12px] text-slate-text">
              Escolha uma área da sua conta.
            </DrawerDescription>
          </div>
          <AccountNavigation
            section={section}
            onNavigate={() => setNavigationOpen(false)}
            className="max-h-[65dvh] overflow-y-auto px-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function AccountNavigation({
  section,
  className,
  onNavigate,
}: {
  section: AccountSection;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <nav
      aria-label="Configurações da conta"
      className={cn(
        "rounded-2xl border border-hairline bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-3 py-3">
        <span className="grid size-10 place-items-center rounded-full bg-[#E8F8ED] text-[12px] font-extrabold text-brand-strong">
          JE
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-extrabold text-ink">Jussefer</p>
          <p className="mt-0.5 text-[11px] font-medium text-slate-text">
            Administrador · Iridia Soluções
          </p>
        </div>
      </div>
      <div className="mx-2 h-px bg-hairline" />
      <div className="py-1">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const active = item.id === section;
          const isDivider = index === 4 || index === 6;
          return (
            <div key={item.id}>
              {isDivider ? <div className="mx-2 my-1.5 h-px bg-hairline" /> : null}
              <Link
                to={item.to}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-[12.5px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                  active ? "bg-[#EAF3ED] text-ink" : "text-slate-text hover:bg-page hover:text-ink",
                )}
              >
                <Icon
                  className={cn(
                    "size-[18px] shrink-0",
                    active ? "text-brand-strong" : "text-slate-text",
                  )}
                  strokeWidth={1.8}
                />
                <span className="min-w-0 flex-1">{item.label}</span>
                {active ? (
                  <span className="size-1.5 rounded-full bg-[#29C454]" aria-hidden="true" />
                ) : null}
              </Link>
            </div>
          );
        })}
      </div>
      <div className="mx-2 h-px bg-hairline" />
      <Link
        to="/login"
        className="mt-1 flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-[12.5px] font-bold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
      >
        <LogOut className="size-[18px]" strokeWidth={1.8} />
        Sair da conta
      </Link>
    </nav>
  );
}

function renderSection(section: AccountSection) {
  switch (section) {
    case "perfil":
      return <ProfileSettings />;
    case "empresa":
      return <CompanySettings />;
    case "equipe":
      return <TeamSettings />;
    case "plano":
      return <BillingSettings />;
    case "seguranca":
      return <SecuritySettings />;
    case "notificacoes":
      return <NotificationSettings />;
    case "ajuda":
      return <SupportSettings />;
  }
}

function Field({
  label,
  hint,
  defaultValue,
  value,
  onValueChange,
  type = "text",
}: {
  label: string;
  hint?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-1.5 text-[12px] font-bold text-ink">
      {label}
      <Input
        type={type}
        {...(value === undefined ? { defaultValue } : { value })}
        onChange={(event) => onValueChange?.(event.target.value)}
        className="min-h-11 rounded-xl border-hairline bg-white text-[13px] font-medium text-ink"
      />
      {hint ? <span className="text-[11px] font-medium text-slate-text">{hint}</span> : null}
    </label>
  );
}

function SaveButton({
  label = "Salvar alterações",
  onClick,
}: {
  label?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={() => {
        onClick?.();
        toast.success("Alterações salvas", { description: "Suas preferências foram atualizadas." });
      }}
      className="min-h-11 rounded-xl bg-[#18B849] px-4 text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
    >
      <Check className="size-4" />
      {label}
    </Button>
  );
}

function ProfileSettings() {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useStoredState("profile", {
    name: "Jussefer Lopes",
    role: "Administrador",
    email: "jussefer@iridia.com.br",
    phone: "(31) 99999-0000",
    avatar: "",
  });

  return (
    <div className="space-y-5">
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-[#29C454] text-[18px] font-extrabold text-white">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Foto de perfil" className="size-full object-cover" />
            ) : (
              "JE"
            )}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[16px] font-extrabold text-ink">Foto de perfil</h2>
            <p className="mt-1 text-[12px] text-slate-text">
              Use uma imagem para ser reconhecido mais rapidamente pela equipe.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => photoInputRef.current?.click()}
            className="min-h-11 rounded-xl border-hairline text-[12px] font-bold"
          >
            <Upload className="size-4" /> Alterar foto
          </Button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = () => {
                setProfile((current) => ({ ...current, avatar: String(reader.result) }));
                toast.success("Foto atualizada", {
                  description: "A prévia foi salva neste navegador.",
                });
              };
              reader.readAsDataURL(file);
            }}
          />
        </div>
      </Panel>
      <Panel className="p-4 sm:p-5">
        <h2 className="text-[16px] font-extrabold text-ink">Dados pessoais</h2>
        <p className="mt-1 text-[12px] text-slate-text">
          Estas informações identificam você dentro da LicitaBase.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field
            label="Nome completo"
            value={profile.name}
            onValueChange={(name) => setProfile((current) => ({ ...current, name }))}
          />
          <Field
            label="Cargo"
            value={profile.role}
            onValueChange={(role) => setProfile((current) => ({ ...current, role }))}
          />
          <Field
            label="E-mail"
            value={profile.email}
            onValueChange={(email) => setProfile((current) => ({ ...current, email }))}
            hint="Alterações de e-mail exigem confirmação."
            type="email"
          />
          <Field
            label="Telefone"
            value={profile.phone}
            onValueChange={(phone) => setProfile((current) => ({ ...current, phone }))}
          />
        </div>
        <div className="mt-5 flex justify-end">
          <SaveButton />
        </div>
      </Panel>
    </div>
  );
}

function CompanySettings() {
  const [company, setCompany] = useStoredState("company", {
    legalName: "Iridia Soluções Ltda.",
    publicName: "Iridia Soluções",
    cnpj: "12.345.678/0001-90",
    segment: "Tecnologia e serviços",
  });

  return (
    <div className="space-y-5">
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-extrabold text-ink">Workspace atual</h2>
            <p className="mt-1 text-[12px] text-slate-text">
              Ambiente compartilhado pela operação da Iridia Soluções.
            </p>
          </div>
          <span className="rounded-full bg-[#E8F8ED] px-2.5 py-1 text-[11px] font-extrabold text-brand-strong">
            Workspace ativo
          </span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric label="Membros" value="3 pessoas" />
          <Metric label="Plano" value="Profissional" />
          <Metric label="Criado em" value="Ago 2026" />
        </div>
      </Panel>
      <Panel className="p-4 sm:p-5">
        <h2 className="text-[16px] font-extrabold text-ink">Dados da empresa</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field
            label="Razão social"
            value={company.legalName}
            onValueChange={(legalName) => setCompany((current) => ({ ...current, legalName }))}
          />
          <Field
            label="Nome público"
            value={company.publicName}
            onValueChange={(publicName) => setCompany((current) => ({ ...current, publicName }))}
          />
          <Field
            label="CNPJ"
            value={company.cnpj}
            onValueChange={(cnpj) => setCompany((current) => ({ ...current, cnpj }))}
          />
          <Field
            label="Segmento"
            value={company.segment}
            onValueChange={(segment) => setCompany((current) => ({ ...current, segment }))}
          />
        </div>
        <div className="mt-5 flex justify-end">
          <SaveButton />
        </div>
      </Panel>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-page px-3 py-3">
      <p className="text-[11px] font-semibold text-slate-text">{label}</p>
      <p className="mt-1 text-[13px] font-extrabold text-ink">{value}</p>
    </div>
  );
}

const teamListColumns = [
  { id: "role", width: 164, min: 130, max: 260 },
  { id: "access", width: 132, min: 112, max: 220 },
  { id: "actions", width: 56, min: 48, max: 96 },
];

function TeamSettings() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Analista de licitações");
  const [memberInAction, setMemberInAction] = useState<string | null>(null);
  const { gridTemplateColumns: teamGridTemplateColumns, getResizeHandleProps } =
    useResizableColumns({
      storageKey: "licitabase.team-list-widths.v1",
      columns: teamListColumns,
    });
  const [people, setPeople] = useStoredState("team", [
    {
      id: "jussefer",
      name: "Jussefer Lopes",
      email: "jussefer@iridia.com.br",
      role: "Administrador",
      status: "Você",
    },
    {
      id: "ana",
      name: "Ana Martins",
      email: "ana@iridia.com.br",
      role: "Analista de licitações",
      status: "Ativa",
    },
    {
      id: "rafael",
      name: "Rafael Costa",
      email: "rafael@iridia.com.br",
      role: "Visualizador",
      status: "Convite pendente",
    },
  ]);
  const selectedMember = people.find((member) => member.id === memberInAction) ?? null;

  const sendInvite = () => {
    const normalizedEmail = inviteEmail.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) return;

    if (people.some((person) => person.email === normalizedEmail)) {
      toast.error("Esta pessoa já tem acesso", {
        description: "Use as ações da pessoa para ajustar a permissão ou reenviar o convite.",
      });
      return;
    }

    const name = normalizedEmail.split("@")[0]?.replace(/[._-]/g, " ") || "Novo membro";
    setPeople((current) => [
      ...current,
      {
        id: `invite-${Date.now()}`,
        name: name.replace(/\b\w/g, (letter) => letter.toUpperCase()),
        email: normalizedEmail,
        role: inviteRole,
        status: "Convite pendente",
      },
    ]);
    setInviteEmail("");
    setInviteOpen(false);
    toast.success("Convite enviado", {
      description: "A pessoa receberá um e-mail para entrar no workspace.",
    });
  };

  return (
    <div className="space-y-5">
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[16px] font-extrabold text-ink">Pessoas do workspace</h2>
            <p className="mt-1 text-[12px] text-slate-text">
              {people.length} acessos vinculados à operação.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white"
          >
            <Plus className="size-4" />
            Convidar pessoa
          </Button>
        </div>
        <div className="mt-4 divide-y divide-hairline">
          <ResourceListGridHeader
            gridTemplateColumns={teamGridTemplateColumns}
            className="px-1 py-3"
          >
            <span className="relative">
              Pessoa
              <button
                {...getResizeHandleProps("role")}
                aria-label="Redimensionar largura da coluna Função"
              />
            </span>
            <span className="relative">
              Função
              <button
                {...getResizeHandleProps("access")}
                aria-label="Redimensionar largura da coluna Acesso"
              />
            </span>
            <span className="relative">
              Acesso
              <button
                {...getResizeHandleProps("actions")}
                aria-label="Redimensionar largura da coluna Ações"
              />
            </span>
            <span className="text-right">Ações</span>
          </ResourceListGridHeader>
          {people.map(({ id, name, email, role, status }) => (
            <div
              key={email}
              className="flex flex-col gap-3 py-3 first:pt-0 sm:flex-row sm:items-center xl:grid xl:grid-cols-none xl:py-4"
              style={{ gridTemplateColumns: teamGridTemplateColumns }}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 xl:flex-none">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#E8F8ED] text-[11px] font-extrabold text-brand-strong">
                  {(name ?? "")
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-extrabold text-ink">{name}</p>
                  <p className="truncate text-[11px] text-slate-text">{email}</p>
                </div>
              </div>
              <p className="text-[12px] font-semibold text-slate-text">{role}</p>
              <span
                className={cn(
                  "w-fit rounded-full px-2 py-1 text-[10px] font-extrabold",
                  status === "Convite pendente"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-[#E8F8ED] text-brand-strong",
                )}
              >
                {status}
              </span>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMemberInAction(id)}
                className="size-10 rounded-xl p-0"
                aria-label={`Ações para ${name}`}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </Panel>
      <AlertDialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <AlertDialogContent className="rounded-2xl border-hairline bg-white font-manrope">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[18px] font-extrabold text-ink">
              Convidar pessoa
            </AlertDialogTitle>
            <AlertDialogDescription>
              O convite dará acesso ao workspace Iridia Soluções.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Field
            label="E-mail da pessoa"
            type="email"
            value={inviteEmail}
            onValueChange={setInviteEmail}
          />
          <div className="grid gap-1.5 text-[12px] font-bold text-ink">
            Função no workspace
            <div className="flex flex-wrap gap-2">
              {["Administrador", "Analista de licitações", "Visualizador"].map((role) => (
                <button
                  key={role}
                  type="button"
                  aria-pressed={inviteRole === role}
                  onClick={() => setInviteRole(role)}
                  className={cn(
                    "min-h-10 rounded-lg border px-3 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                    inviteRole === role
                      ? "border-[#8DE3A5] bg-[#ECF9F0] text-brand-strong"
                      : "border-hairline bg-white text-slate-text hover:bg-page",
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-11 rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={!inviteEmail.trim().includes("@")}
              onClick={sendInvite}
              className="min-h-11 rounded-xl bg-[#18B849] text-white hover:bg-[#139e3e]"
            >
              Enviar convite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={Boolean(selectedMember)}
        onOpenChange={(open) => !open && setMemberInAction(null)}
      >
        <AlertDialogContent className="rounded-2xl border-hairline bg-white font-manrope">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[18px] font-extrabold text-ink">
              Gerenciar acesso
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedMember ? `${selectedMember.name} - ${selectedMember.email}` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedMember?.status === "Convite pendente" ? (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                toast.success("Convite reenviado", {
                  description: `Um novo acesso foi enviado para ${selectedMember.email}.`,
                })
              }
              className="min-h-11 rounded-xl border-hairline text-[12px] font-bold"
            >
              Reenviar convite
            </Button>
          ) : null}
          {selectedMember && selectedMember.status !== "Você" ? (
            <div className="grid gap-2">
              <p className="text-[12px] font-bold text-ink">Alterar função</p>
              <div className="flex flex-wrap gap-2">
                {["Administrador", "Analista de licitações", "Visualizador"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    aria-pressed={selectedMember.role === role}
                    onClick={() => {
                      setPeople((current) =>
                        current.map((person) =>
                          person.id === selectedMember.id ? { ...person, role } : person,
                        ),
                      );
                      toast.success("Função atualizada", { description: `${role} aplicado.` });
                    }}
                    className={cn(
                      "min-h-10 rounded-lg border px-3 text-[11px] font-bold",
                      selectedMember.role === role
                        ? "border-[#8DE3A5] bg-[#ECF9F0] text-brand-strong"
                        : "border-hairline text-slate-text",
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-11 rounded-xl">Concluir</AlertDialogCancel>
            {selectedMember && selectedMember.status !== "Você" ? (
              <AlertDialogAction
                onClick={() => {
                  setPeople((current) =>
                    current.filter((person) => person.id !== selectedMember.id),
                  );
                  toast.success("Acesso removido", {
                    description: "A pessoa não acessa mais o workspace.",
                  });
                }}
                className="min-h-11 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 className="size-4" /> Remover acesso
              </AlertDialogAction>
            ) : null}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

type BillingCycle = "monthly" | "annual";

const subscriptionPlans = [
  {
    name: "Essencial",
    monthly: 99,
    annualMonthly: 79,
    annualTotal: "R$ 948",
    users: "1 usuário",
    featured: false,
    features: [
      "Busca e alertas ilimitados",
      "Comparação de preços",
      "5 consultas/dia à Alicitante",
    ],
  },
  {
    name: "Profissional",
    monthly: 299,
    annualMonthly: 199,
    annualTotal: "R$ 2.388",
    users: "2 usuários",
    featured: true,
    features: [
      "Integrações com portais e monitoramento",
      "Bot de lances: 1 utilização/semana",
      "Raio-X: 2 análises/semana",
    ],
  },
  {
    name: "Enterprise",
    monthly: 997,
    annualMonthly: 747,
    annualTotal: "R$ 8.964",
    users: "5 usuários",
    featured: false,
    features: [
      "Bot de lances ilimitado",
      "Propostas automáticas e múltiplos CNPJs",
      "SLA e atendimento dedicado",
    ],
  },
] as const;

function BillingSettings() {
  const [cycle, setCycle] = useStoredState<BillingCycle>("billing-cycle", "monthly");
  const [currentPlanName, setCurrentPlanName] = useStoredState("billing-plan", "Profissional");
  const currentPlan =
    subscriptionPlans.find((plan) => plan.name === currentPlanName) ?? subscriptionPlans[1];
  const currentPrice = cycle === "monthly" ? currentPlan.monthly : currentPlan.annualMonthly;

  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden">
        <div className="bg-[#ECF9F0] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-brand-strong">
                Plano atual
              </p>
              <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
                <h2 className="text-[22px] font-extrabold text-ink">{currentPlan.name}</h2>
                <p className="whitespace-nowrap text-[16px] font-extrabold text-ink">
                  R$ {currentPrice.toLocaleString("pt-BR")}/mês
                </p>
              </div>
              <p className="mt-1 text-[12px] text-slate-text">
                {cycle === "monthly"
                  ? "Cobrança mensal, sem fidelidade."
                  : `Cobrado anualmente: ${currentPlan.annualTotal}.`}
              </p>
            </div>
            <div
              role="group"
              aria-label="Ciclo de cobrança"
              className="flex min-h-11 w-full rounded-xl border border-[#BDEEC9] bg-white/80 p-1 sm:w-auto"
            >
              <BillingCycleButton active={cycle === "monthly"} onClick={() => setCycle("monthly")}>
                Mensal
              </BillingCycleButton>
              <BillingCycleButton active={cycle === "annual"} onClick={() => setCycle("annual")}>
                Anual −17%
              </BillingCycleButton>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <p className="text-[12px] text-slate-text">
              Inclui integrações, monitoramento das etapas e 1 utilização semanal do Bot de Lances.
            </p>
            <a
              href={`/planos/comparar?ciclo=${cycle}`}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#18B849] px-4 text-[12px] font-extrabold text-white transition-colors hover:bg-[#139e3e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
            >
              Comparar planos
            </a>
          </div>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
          <Metric label="Licenças em uso" value="2 de 2" />
          <Metric label="Bot de Lances" value="1 utilização/semana" />
          <Metric label="Próxima cobrança" value="14 set 2026" />
        </div>
      </Panel>
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[16px] font-extrabold text-ink">Planos LicitaBase</h2>
            <p className="mt-1 text-[12px] text-slate-text">
              Valores e benefícios idênticos aos exibidos na comparação de planos.
            </p>
          </div>
          <p className="text-[11px] font-bold text-brand-strong">
            {cycle === "annual" ? "Economia de até 17% no anual" : "Valores mensais"}
          </p>
        </div>
        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {subscriptionPlans.map((plan) => {
            const price = cycle === "monthly" ? plan.monthly : plan.annualMonthly;
            const isCurrent = plan.name === currentPlan.name;

            return (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-xl border p-4",
                  isCurrent ? "border-[#8DE3A5] bg-[#F3FCF5]" : "border-hairline bg-white",
                )}
              >
                {plan.featured ? (
                  <span className="absolute -top-2.5 left-3 rounded-full bg-[#18B849] px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.06em] text-white">
                    Mais escolhido
                  </span>
                ) : null}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[15px] font-extrabold text-ink">{plan.name}</h3>
                    <p className="mt-1 text-[11px] text-slate-text">{plan.users}</p>
                  </div>
                  {isCurrent ? (
                    <span className="rounded-full bg-[#DFF7E6] px-2 py-1 text-[10px] font-extrabold text-brand-strong">
                      Atual
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 whitespace-nowrap text-[22px] font-extrabold tracking-[-0.02em] text-ink">
                  R$ {price.toLocaleString("pt-BR")}
                  <span className="ml-1 text-[11px] font-semibold text-slate-text">/mês</span>
                </p>
                {cycle === "annual" ? (
                  <p className="mt-1 text-[10.5px] font-medium text-slate-text">
                    Cobrado anualmente: {plan.annualTotal}
                  </p>
                ) : (
                  <p className="mt-1 text-[10.5px] font-medium text-slate-text">Cobrança mensal</p>
                )}
                <ul className="mt-4 space-y-2 border-t border-hairline pt-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2 text-[11px] leading-snug text-slate-text"
                    >
                      <Check className="mt-0.5 size-3.5 shrink-0 text-brand-strong" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent}
                  onClick={() => {
                    setCurrentPlanName(plan.name);
                    toast.success("Plano atualizado", {
                      description: `${plan.name} será aplicado à próxima cobrança em ${
                        cycle === "monthly" ? "14 set 2026" : "14 ago 2027"
                      }.`,
                    });
                  }}
                  className={cn(
                    "mt-4 min-h-11 w-full rounded-xl text-[12px] font-extrabold",
                    isCurrent
                      ? "border-hairline bg-white text-slate-text"
                      : "bg-[#18B849] text-white hover:bg-[#139e3e]",
                  )}
                >
                  {isCurrent ? "Plano atual" : `Escolher ${plan.name}`}
                </Button>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-extrabold text-ink">Faturas recentes</h2>
            <p className="mt-1 text-[12px] text-slate-text">Documentos de cobrança do workspace.</p>
          </div>
          <CreditCard className="size-5 text-brand-strong" />
        </div>
        <div className="mt-4 divide-y divide-hairline">
          {accountInvoices.map((invoice) => (
            <Invoice key={invoice.id} invoice={invoice} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function BillingCycleButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-9 flex-1 rounded-lg px-3 text-[11px] font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
        active ? "bg-white text-ink shadow-sm" : "text-slate-text hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function Invoice({ invoice }: { invoice: AccountInvoice }) {
  return (
    <Link
      to="/dash2/configuracoes/faturas/$invoiceId"
      params={{ invoiceId: invoice.id }}
      className="flex items-center gap-3 py-3 transition-colors hover:bg-[#F7FCF8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
      aria-label={`Visualizar fatura de ${invoice.reference}`}
    >
      <FileText className="size-4 text-slate-text" />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold text-ink">{invoice.reference}</p>
        <p className="text-[11px] text-slate-text">Fatura do plano {invoice.plan}</p>
      </div>
      <p className="whitespace-nowrap text-[13px] font-extrabold text-ink">{invoice.value}</p>
      <span className="rounded-full bg-[#E8F8ED] px-2 py-1 text-[10px] font-extrabold text-brand-strong">
        Paga
      </span>
      <ChevronRight className="size-4 text-slate-text" />
    </Link>
  );
}

function SecuritySettings() {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useStoredState("two-factor", false);
  const [sessions, setSessions] = useStoredState("sessions", [
    {
      id: "current",
      icon: "desktop",
      title: "Chrome - Windows",
      meta: "Belo Horizonte, MG - Agora",
      current: true,
    },
    {
      id: "iphone",
      icon: "mobile",
      title: "Safari - iPhone",
      meta: "Belo Horizonte, MG - ontem às 19:42",
      current: false,
    },
  ]);
  const passwordIsValid =
    currentPassword.length > 0 && newPassword.length >= 8 && newPassword === passwordConfirmation;

  return (
    <div className="space-y-5">
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-extrabold text-ink">Senha de acesso</h2>
            <p className="mt-1 text-[12px] text-slate-text">Última atualização há 68 dias.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPasswordOpen(true)}
            className="min-h-11 rounded-xl border-hairline text-[12px] font-bold"
          >
            <KeyRound className="size-4" />
            Alterar senha
          </Button>
        </div>
      </Panel>
      <Panel className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-extrabold text-ink">Verificação em duas etapas</h2>
            <p className="mt-1 text-[12px] text-slate-text">
              Adicione uma camada de proteção ao acesso da conta.
            </p>
          </div>
          <Toggle
            label="2FA"
            enabled={twoFactorEnabled}
            onChange={(enabled) => {
              setTwoFactorEnabled(enabled);
              toast.success(enabled ? "2FA ativado" : "2FA desativado", {
                description: enabled
                  ? "A próxima entrada solicitará uma segunda confirmação."
                  : "Sua conta volta a usar apenas a senha.",
              });
            }}
          />
        </div>
      </Panel>
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-extrabold text-ink">Sessões ativas</h2>
            <p className="mt-1 text-[12px] text-slate-text">
              Dispositivos que acessaram sua conta recentemente.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setLogoutOpen(true)}
            className="min-h-11 rounded-xl border-red-200 text-[12px] font-bold text-red-600 hover:bg-red-50"
          >
            Encerrar demais sessões
          </Button>
        </div>
        {sessions.map((session) => (
          <Session
            key={session.id}
            icon={session.icon === "desktop" ? MonitorSmartphone : Smartphone}
            title={session.title}
            meta={session.meta}
            current={session.current}
            onEnd={() => {
              setSessions((current) => current.filter((item) => item.id !== session.id));
              toast.success("Sessão encerrada", { description: "O dispositivo foi desconectado." });
            }}
          />
        ))}
      </Panel>
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent className="rounded-2xl border-hairline bg-white font-manrope">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[18px] font-extrabold text-ink">
              Encerrar demais sessões?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você continuará conectado neste dispositivo; os demais acessos precisarão entrar
              novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-11 rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setSessions((current) => current.filter((session) => session.current));
                toast.success("Sessões encerradas", {
                  description: "Os outros dispositivos foram desconectados.",
                });
              }}
              className="min-h-11 rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              Encerrar sessões
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <AlertDialogContent className="rounded-2xl border-hairline bg-white font-manrope">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[18px] font-extrabold text-ink">
              Alterar senha
            </AlertDialogTitle>
            <AlertDialogDescription>
              Use ao menos 8 caracteres e mantenha esta senha em segurança.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-3">
            <Field
              label="Senha atual"
              type="password"
              value={currentPassword}
              onValueChange={setCurrentPassword}
            />
            <Field
              label="Nova senha"
              type="password"
              value={newPassword}
              onValueChange={setNewPassword}
              hint="Mínimo de 8 caracteres."
            />
            <Field
              label="Confirmar nova senha"
              type="password"
              value={passwordConfirmation}
              onValueChange={setPasswordConfirmation}
              {...(passwordConfirmation && passwordConfirmation !== newPassword
                ? { hint: "As senhas não coincidem." }
                : {})}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-11 rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={!passwordIsValid}
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setPasswordConfirmation("");
                toast.success("Senha atualizada", {
                  description: "Use a nova senha no próximo acesso à conta.",
                });
              }}
              className="min-h-11 rounded-xl bg-[#18B849] text-white hover:bg-[#139e3e]"
            >
              Atualizar senha
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Session({
  icon: Icon,
  title,
  meta,
  current = false,
  onEnd,
}: {
  icon: LucideIcon;
  title: string;
  meta: string;
  current?: boolean;
  onEnd?: () => void;
}) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-xl border border-hairline bg-page p-3">
      <span className="grid size-9 place-items-center rounded-full bg-white text-slate-text">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-extrabold text-ink">{title}</p>
        <p className="text-[11px] text-slate-text">{meta}</p>
      </div>
      {current ? (
        <span className="rounded-full bg-[#E8F8ED] px-2 py-1 text-[10px] font-extrabold text-brand-strong">
          Esta sessão
        </span>
      ) : (
        <Button
          type="button"
          variant="ghost"
          onClick={onEnd}
          className="min-h-9 rounded-lg text-[11px] font-bold text-red-600"
        >
          Encerrar
        </Button>
      )}
    </div>
  );
}

function Toggle({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <Switch
      checked={enabled}
      aria-label={label}
      onCheckedChange={onChange}
      className="data-[state=checked]:bg-[#18B849] data-[state=unchecked]:bg-slate-200"
    />
  );
}

function NotificationSettings() {
  const [channels, setChannels] = useStoredState(
    "notification-channels",
    defaultNotificationChannels,
  );
  const preferences = notificationPreferenceKeys;
  const [operationPreferences, setOperationPreferences] = useStoredState(
    "operation-notifications",
    defaultOperationNotifications,
  );
  return (
    <div className="space-y-5">
      <Panel className="p-4 sm:p-5">
        <h2 className="text-[16px] font-extrabold text-ink">Canais de aviso</h2>
        <p className="mt-1 text-[12px] text-slate-text">Controle onde os alertas podem chegar.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(
            [
              ["email", "E-mail", Mail],
              ["platform", "Na plataforma", BellRing],
              ["whatsapp", "WhatsApp", Smartphone],
            ] as const
          ).map(([key, label, Icon]) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-xl border border-hairline p-3"
            >
              <span className="grid size-9 place-items-center rounded-full bg-[#E8F8ED] text-brand-strong">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1 text-[12px] font-bold text-ink">{label}</span>
              <Switch
                checked={channels[key]}
                aria-label={label}
                onCheckedChange={(checked) =>
                  setChannels((current) => ({ ...current, [key]: checked }))
                }
                className="data-[state=checked]:bg-[#18B849] data-[state=unchecked]:bg-slate-200"
              />
            </div>
          ))}
        </div>
      </Panel>
      <Panel className="p-4 sm:p-5">
        <h2 className="text-[16px] font-extrabold text-ink">Alertas da operação</h2>
        <div className="mt-3 divide-y divide-hairline">
          {preferences.map((preference) => (
            <div key={preference} className="flex min-h-14 items-center gap-3 py-2">
              <span className="min-w-0 flex-1 text-[12.5px] font-bold text-ink">{preference}</span>
              <Toggle
                label={preference}
                enabled={operationPreferences[preference]}
                onChange={(enabled) =>
                  setOperationPreferences((current) => ({ ...current, [preference]: enabled }))
                }
              />
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <SaveButton label="Salvar preferências" />
        </div>
      </Panel>
    </div>
  );
}

type SupportTicket = {
  id: string;
  subject: string;
  status: string;
  topic: string;
  priority: string;
  createdAt: string;
  message: string;
};

const supportGuides = [
  {
    title: "Primeiros passos",
    description: "Configure sua empresa, interesses e alertas iniciais.",
    detail:
      "Comece pelo onboarding, confirme as categorias que sua empresa atende e revise os alertas. Em poucos minutos a visão geral passa a priorizar oportunidades relevantes.",
    articles: 8,
    icon: Sparkles,
    color: "bg-[#E8F8ED] text-brand-strong",
  },
  {
    title: "Buscar licitações",
    description: "Use filtros, salve pesquisas e acompanhe prazos.",
    detail:
      "Combine órgão, região, modalidade e palavras-chave. Salve a busca quando ela representar uma rotina da operação para receber novas oportunidades automaticamente.",
    articles: 12,
    icon: Search,
    color: "bg-[#EEF4FF] text-[#3269D8]",
  },
  {
    title: "Bot de Lances",
    description: "Entenda estratégia, limites, pausas e sessões ao vivo.",
    detail:
      "Defina decremento, preço piso e intervalo entre lances antes de ativar a estratégia. Durante a sessão, acompanhe a posição e pause o bot sempre que precisar revisar uma decisão.",
    articles: 14,
    icon: Bot,
    color: "bg-[#F1ECFF] text-[#7652D9]",
  },
  {
    title: "Propostas e documentos",
    description: "Organize arquivos e prepare o envio com segurança.",
    detail:
      "Centralize anexos por licitação e confirme o prazo antes do envio. Documentos com pendências continuam identificados para que nenhuma etapa passe despercebida.",
    articles: 9,
    icon: FileText,
    color: "bg-[#FFF4E8] text-[#E96A16]",
  },
  {
    title: "Plano e cobrança",
    description: "Consulte consumo, pagamentos e suas faturas.",
    detail:
      "Em Plano e faturamento você encontra o ciclo, os recursos incluídos, as faturas emitidas e o método de pagamento utilizado em cada cobrança.",
    articles: 7,
    icon: CreditCard,
    color: "bg-[#FFF1F0] text-[#E64D3D]",
  },
  {
    title: "Conta e acesso",
    description: "Gerencie pessoas, permissões e proteção da conta.",
    detail:
      "Use funções e permissões para manter cada pessoa com o acesso necessário. Ative a verificação em duas etapas para reforçar a proteção do workspace.",
    articles: 10,
    icon: ShieldCheck,
    color: "bg-[#EAF7F5] text-[#11836F]",
  },
];

function SupportSettings() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [topic, setTopic] = useState("Operação e licitações");
  const [priority, setPriority] = useState("Normal");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [tickets, setTickets] = useStoredState("support-tickets", [] as SupportTicket[]);
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const visibleGuides = supportGuides.filter((guide) =>
    `${guide.title} ${guide.description}`.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
  );
  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId);
  const selectedGuideDetail = supportGuides.find((guide) => guide.title === selectedGuide);

  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden p-0">
        <div className="border-b border-hairline bg-[linear-gradient(115deg,#F6FCF8_0%,#FFFFFF_48%,#F3F9F5_100%)] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-brand-strong">
                <BookOpenCheck className="size-4" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.1em]">
                  Base de conhecimento
                </span>
              </div>
              <h2 className="mt-2 text-[19px] font-extrabold tracking-[-0.02em] text-ink">
                Encontre a resposta certa para a sua operação
              </h2>
              <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-slate-text">
                Pesquise guias práticos ou abra um chamado já com o contexto do seu workspace.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setSupportOpen(true)}
              className="min-h-11 shrink-0 rounded-xl bg-[#18B849] px-4 text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
            >
              <MessageCircleMore className="size-4" /> Abrir chamado
            </Button>
          </div>
          <label className="relative mt-5 block">
            <span className="sr-only">Pesquisar na central de ajuda</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-text" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Busque por bot, proposta, fatura, acesso..."
              className="min-h-12 rounded-xl border-hairline bg-white pl-10 pr-4 text-[13px] font-medium shadow-sm placeholder:text-slate-text"
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Bot de Lances", "Propostas", "Plano", "Acesso"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSearch(item)}
                className="min-h-8 rounded-full border border-[#C7EED2] bg-white px-3 text-[10.5px] font-bold text-brand-strong transition-colors hover:bg-[#EAF8EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="grid divide-y divide-hairline lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <SupportQuickAction
            icon={LifeBuoy}
            title="Falar com suporte"
            description="Abra uma solicitação e acompanhe as atualizações aqui."
            action="Abrir chamado"
            onClick={() => setSupportOpen(true)}
          />
          <SupportQuickAction
            icon={Sparkles}
            title="Pergunte à Alicitante"
            description="Use a IA para orientar os próximos passos na plataforma."
            action="Conversar"
            onClick={() =>
              toast.info("Alicitante disponível", {
                description: "Abra o assistente pelo botão no topo da tela.",
              })
            }
          />
          <div className="flex items-start gap-3 p-4 sm:p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#E8F8ED] text-brand-strong">
              <Wifi className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-extrabold text-ink">Status da plataforma</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-text">
                Todos os sistemas operando normalmente.
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] font-bold text-brand-strong">
                <span className="size-1.5 rounded-full bg-[#18B849]" />
                Atualizado agora
              </span>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Panel className="p-4 sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                Explore por assunto
              </p>
              <h2 className="mt-1 text-[16px] font-extrabold text-ink">Guias mais procurados</h2>
            </div>
            <span className="text-[11px] font-bold text-slate-text">
              {visibleGuides.length} áreas encontradas
            </span>
          </div>
          {visibleGuides.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {visibleGuides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <button
                    type="button"
                    key={guide.title}
                    onClick={() => setSelectedGuide(guide.title)}
                    className="group flex min-h-28 items-start gap-3 rounded-xl border border-hairline bg-white p-3.5 text-left transition-colors hover:border-[#29C454]/45 hover:bg-[#F8FDF9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                  >
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl",
                        guide.color,
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-[12.5px] font-extrabold text-ink">{guide.title}</span>
                        <ChevronRight className="size-4 shrink-0 text-slate-text transition-transform group-hover:translate-x-0.5" />
                      </span>
                      <span className="mt-1 block text-[11px] leading-relaxed text-slate-text">
                        {guide.description}
                      </span>
                      <span className="mt-2 block text-[10.5px] font-bold text-brand-strong">
                        {guide.articles} artigos
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-hairline bg-page p-5 text-center">
              <FileQuestion className="mx-auto size-5 text-slate-text" />
              <p className="mt-2 text-[12px] font-extrabold text-ink">Nenhum guia encontrado</p>
              <p className="mt-1 text-[11px] text-slate-text">
                Tente outro termo ou envie uma solicitação ao suporte.
              </p>
            </div>
          )}
          {selectedGuideDetail ? (
            <SupportGuide
              guide={selectedGuideDetail}
              onClose={() => setSelectedGuide(null)}
              onOpenTicket={() => setSupportOpen(true)}
            />
          ) : null}
        </Panel>
        <Panel className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                Atendimento
              </p>
              <h2 className="mt-1 text-[16px] font-extrabold text-ink">Chamados recentes</h2>
            </div>
            <span className="rounded-full bg-[#E8F8ED] px-2.5 py-1 text-[10px] font-extrabold text-brand-strong">
              {tickets.length} aberto{tickets.length === 1 ? "" : "s"}
            </span>
          </div>
          {tickets.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-hairline bg-page p-5 text-center">
              <MessageCircleMore className="mx-auto size-6 text-brand-strong" />
              <p className="mt-3 text-[13px] font-extrabold text-ink">Nenhum chamado aberto</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-text">
                Quando precisar, nossa equipe ficará por aqui.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSupportOpen(true)}
                className="mt-4 min-h-10 rounded-xl border-hairline text-[11px] font-bold"
              >
                Abrir chamado
              </Button>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-hairline">
              {tickets.slice(0, 4).map((ticket) => (
                <button
                  type="button"
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className="flex w-full items-center gap-3 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#E8F8ED] text-brand-strong">
                    <LifeBuoy className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-extrabold text-ink">
                      {ticket.subject}
                    </span>
                    <span className="mt-0.5 block text-[10.5px] text-slate-text">
                      {ticket.createdAt ?? "agora"} · {ticket.topic ?? "Suporte"}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-slate-text" />
                </button>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {selectedTicket ? (
        <Panel className="border-[#BDEEC9] bg-[#FBFEFC] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#E8F8ED] px-2.5 py-1 text-[10px] font-extrabold text-brand-strong">
                  {selectedTicket.status}
                </span>
                <span className="text-[10.5px] font-bold text-slate-text">
                  {selectedTicket.topic ?? "Suporte"} · prioridade{" "}
                  {(selectedTicket.priority ?? "Normal").toLocaleLowerCase("pt-BR")}
                </span>
              </div>
              <h2 className="mt-2 text-[16px] font-extrabold text-ink">{selectedTicket.subject}</h2>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-text">
                {selectedTicket.message ?? "Sua solicitação foi recebida e está em análise."}
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-slate-text">
                <Clock3 className="size-4 text-brand-strong" />
                Recebido {selectedTicket.createdAt ?? "agora"}. A equipe responderá nesta central.
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedTicketId(null)}
              className="min-h-10 shrink-0 rounded-xl border-hairline text-[11px] font-bold"
            >
              Fechar detalhes
            </Button>
          </div>
        </Panel>
      ) : null}

      <AlertDialog open={supportOpen} onOpenChange={setSupportOpen}>
        <AlertDialogContent className="max-h-[calc(100dvh-2rem)] max-w-[calc(100%_-_2rem)] overflow-y-auto rounded-2xl border-hairline bg-white font-manrope sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[18px] font-extrabold text-ink">
              Abrir chamado
            </AlertDialogTitle>
            <AlertDialogDescription>
              Envie o contexto da sua operação para encaminharmos ao time certo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-[12px] font-bold text-ink">
              Assunto do atendimento
              <select
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[13px] font-medium text-ink outline-none focus:border-[#29C454]"
              >
                <option>Operação e licitações</option>
                <option>Bot de Lances</option>
                <option>Proposta e documentos</option>
                <option>Plano e cobrança</option>
                <option>Conta e acesso</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-[12px] font-bold text-ink">
              Prioridade
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="min-h-11 rounded-xl border border-hairline bg-white px-3 text-[13px] font-medium text-ink outline-none focus:border-[#29C454]"
              >
                <option>Normal</option>
                <option>Alta</option>
                <option>Crítica</option>
              </select>
            </label>
          </div>
          <Field label="Assunto" value={subject} onValueChange={setSubject} />
          <label className="grid gap-1.5 text-[12px] font-bold text-ink">
            Mensagem
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-28 rounded-xl border border-hairline px-3 py-2.5 text-[13px] font-medium outline-none focus:border-[#29C454]"
              placeholder="Conte o que aconteceu e como podemos ajudar."
            />
          </label>
          <div className="flex items-start gap-2 rounded-xl bg-page p-3 text-[11px] leading-relaxed text-slate-text">
            <FileText className="mt-0.5 size-4 shrink-0 text-brand-strong" />
            <span>
              O chamado será enviado com seu workspace{" "}
              <strong className="font-extrabold text-ink">Iridia Soluções</strong> e o contexto da
              sua conta. Anexos estarão disponíveis com a integração do atendimento.
            </span>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-11 rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={!subject.trim() || !message.trim()}
              onClick={() => {
                const ticket = {
                  id: `ticket-${Date.now()}`,
                  subject: subject.trim(),
                  status: "Recebido",
                  topic,
                  priority,
                  createdAt: "agora",
                  message: message.trim(),
                };
                setTickets((current) => [ticket, ...current]);
                setSubject("");
                setMessage("");
                setSupportOpen(false);
                setSelectedTicketId(ticket.id);
                toast.success("Solicitação enviada", {
                  description: "O acompanhamento ficará disponível nesta central.",
                });
              }}
              className="min-h-11 rounded-xl bg-[#18B849] text-white hover:bg-[#139e3e]"
            >
              <Send className="size-4" />
              Enviar solicitação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SupportQuickAction({
  icon: Icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[132px] items-start gap-3 p-4 text-left transition-colors hover:bg-[#F8FDF9] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#29C454] sm:p-5"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#E8F8ED] text-brand-strong">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-extrabold text-ink">{title}</span>
        <span className="mt-1 block text-[11px] leading-relaxed text-slate-text">
          {description}
        </span>
        <span className="mt-3 inline-flex items-center gap-1 text-[10.5px] font-extrabold text-brand-strong">
          {action}
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </button>
  );
}

function SupportGuide({
  guide,
  onClose,
  onOpenTicket,
}: {
  guide: (typeof supportGuides)[number];
  onClose: () => void;
  onOpenTicket: () => void;
}) {
  return (
    <div className="mt-4 rounded-xl border border-[#BDEEC9] bg-[#F5FCF7] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
            Guia rápido · {guide.articles} artigos
          </p>
          <h3 className="mt-1 text-[15px] font-extrabold text-ink">{guide.title}</h3>
          <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-slate-text">
            {guide.detail}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="min-h-9 shrink-0 rounded-lg px-2 text-[11px] font-bold text-brand-strong"
        >
          Fechar
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() =>
            toast.success("Guia salvo", {
              description: "Ele ficará disponível nas suas recomendações.",
            })
          }
          className="min-h-10 rounded-xl bg-[#18B849] text-[11px] font-extrabold text-white hover:bg-[#139e3e]"
        >
          <BookOpenCheck className="size-4" />
          Abrir artigos
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onOpenTicket}
          className="min-h-10 rounded-xl border-hairline text-[11px] font-bold"
        >
          <LifeBuoy className="size-4" />
          Ainda preciso de ajuda
        </Button>
      </div>
    </div>
  );
}
