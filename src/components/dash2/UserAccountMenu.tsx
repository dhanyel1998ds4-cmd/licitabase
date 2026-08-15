import {
  BellRing,
  Building2,
  ChevronDown,
  CreditCard,
  LifeBuoy,
  LogOut,
  ShieldCheck,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { forwardRef, useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OPEN_USER_ACCOUNT_MENU_EVENT } from "@/lib/dashboard-events";
import { getGlobalSearchItem } from "@/lib/global-search-catalog";
import { cn } from "@/lib/utils";

type AccountMenuItem = {
  id: string;
  icon: LucideIcon;
  label: string;
};

const accountMenuGroups = [
  ["account-profile", "company-workspace", "team-permissions", "billing-plan"],
  ["security-access", "notification-preferences"],
  ["help-support"],
] as const;

const fallbackAccountMenuItems: Record<string, Omit<AccountMenuItem, "id">> = {
  "account-profile": { icon: UserRound, label: "Meu perfil" },
  "company-workspace": { icon: Building2, label: "Empresa e workspace" },
  "team-permissions": { icon: UsersRound, label: "Equipe e permissões" },
  "billing-plan": { icon: CreditCard, label: "Plano e faturamento" },
  "security-access": { icon: ShieldCheck, label: "Segurança e acesso" },
  "notification-preferences": { icon: BellRing, label: "Preferências de notificações" },
  "help-support": { icon: LifeBuoy, label: "Ajuda e suporte" },
};

const accountMenuRoutes = {
  "account-profile": "/dash2/configuracoes/perfil",
  "company-workspace": "/dash2/configuracoes/empresa",
  "team-permissions": "/dash2/configuracoes/equipe",
  "billing-plan": "/dash2/configuracoes/plano",
  "security-access": "/dash2/configuracoes/seguranca",
  "notification-preferences": "/dash2/configuracoes/notificacoes",
  "help-support": "/dash2/ajuda",
} as const;

const menuGroups: AccountMenuItem[][] = accountMenuGroups.map((group) =>
  group.map((id) => {
    const catalogItem = getGlobalSearchItem(id);
    const fallback = fallbackAccountMenuItems[id];
    return {
      id,
      icon: catalogItem?.icon ?? fallback!.icon,
      label: catalogItem?.title ?? fallback!.label,
    };
  }),
);

type AccountIdentity = {
  name: string;
  initials: string;
  role: string;
  workspace: string;
  avatarUrl?: string;
};

const currentUser: AccountIdentity = {
  name: "Jussefer",
  initials: "JE",
  role: "Administrador",
  workspace: "Iridia Soluções",
};

function getCurrentUser() {
  if (typeof window === "undefined") return currentUser;

  try {
    const stored = window.localStorage.getItem("licitabase:account:profile");
    if (!stored) return currentUser;

    const profile = JSON.parse(stored) as Partial<{
      name: string;
      role: string;
      avatar: string;
    }>;
    const name = profile.name?.trim();

    return {
      ...currentUser,
      name: name?.split(" ")[0] || currentUser.name,
      initials:
        name
          ?.split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("") || currentUser.initials,
      role: profile.role?.trim() || currentUser.role,
      avatarUrl: profile.avatar || undefined,
    };
  } catch {
    return currentUser;
  }
}

function UserIdentity({ compact = false, user }: { compact?: boolean; user?: AccountIdentity }) {
  const [storedUser, setStoredUser] = useState(getCurrentUser);
  const identity = user ?? storedUser;

  useEffect(() => {
    const handleAccountUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string }>).detail;
      if (detail?.key === "profile") setStoredUser(getCurrentUser());
    };

    window.addEventListener("licitabase:account-updated", handleAccountUpdate);
    return () => window.removeEventListener("licitabase:account-updated", handleAccountUpdate);
  }, []);

  return (
    <div className={cn("flex min-w-0 items-center gap-3", compact && "gap-2")}>
      <Avatar
        className={cn(
          "shrink-0 border border-[#29C454]/20 bg-[#29C454]",
          compact ? "size-9" : "size-11",
        )}
      >
        {identity.avatarUrl ? (
          <AvatarImage
            src={identity.avatarUrl}
            alt={`Foto de ${identity.name}`}
            className="object-cover object-center"
          />
        ) : null}
        <AvatarFallback
          className={cn(
            "bg-[#29C454] font-bold text-white",
            compact ? "text-[12.5px]" : "text-[13px]",
          )}
        >
          {identity.initials}
        </AvatarFallback>
      </Avatar>
      <div className={cn("min-w-0 text-left", compact && "hidden md:block")}>
        <p className={cn("truncate font-bold text-ink", compact ? "text-[13px]" : "text-[15px]")}>
          {identity.name}
        </p>
        {!compact && (
          <>
            <p className="mt-0.5 text-[12px] font-medium text-slate-text">{identity.role}</p>
            <p className="mt-1 truncate text-[12.5px] font-semibold text-brand-strong">
              {identity.workspace}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const UserMenuTrigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      type="button"
      className={cn(
        "flex min-h-11 items-center gap-2 rounded-full p-1 transition-colors hover:bg-page md:pr-2",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
        className,
      )}
      aria-label="Abrir menu do usuário"
    >
      <UserIdentity compact />
      <ChevronDown className="hidden size-4 text-slate-text md:block" aria-hidden="true" />
    </button>
  ),
);
UserMenuTrigger.displayName = "UserMenuTrigger";

function MenuRow({
  item,
  mobile = false,
  onSelect,
}: {
  item: AccountMenuItem;
  mobile?: boolean;
  onSelect: () => void;
}) {
  const Icon = item.icon;

  if (mobile) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold text-ink transition-colors hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
      >
        <Icon
          className="size-[19px] shrink-0 text-slate-text"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <span>{item.label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-semibold text-ink transition-colors hover:bg-page focus:bg-page focus:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
    >
      <Icon className="size-[18px] text-slate-text" strokeWidth={1.8} aria-hidden="true" />
      <span>{item.label}</span>
    </button>
  );
}

function LogoutButton({ mobile = false, onLogout }: { mobile?: boolean; onLogout: () => void }) {
  if (mobile) {
    return (
      <button
        type="button"
        onClick={onLogout}
        className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-bold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
      >
        <LogOut className="size-[19px]" strokeWidth={1.8} aria-hidden="true" />
        <span>Sair</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      onClick={onLogout}
      className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-bold text-red-600 transition-colors hover:bg-red-50 focus:bg-red-50 focus:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
    >
      <LogOut className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
      <span>Sair</span>
    </button>
  );
}

export function UserAccountMenu() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const desktopTriggerRef = useRef<HTMLButtonElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenMenu = () => {
      if (isMobile) setDrawerOpen(true);
      else setDesktopOpen(true);
    };

    window.addEventListener(OPEN_USER_ACCOUNT_MENU_EVENT, handleOpenMenu);
    return () => window.removeEventListener(OPEN_USER_ACCOUNT_MENU_EVENT, handleOpenMenu);
  }, [isMobile]);

  useEffect(() => {
    if (!desktopOpen) return;

    const focusFrame = window.requestAnimationFrame(() => {
      desktopMenuRef.current?.querySelector<HTMLButtonElement>("[role='menuitem']")?.focus();
    });
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopOpen(false);
        desktopTriggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [desktopOpen]);

  const handleNavigation = (itemId: string) => {
    const destination = accountMenuRoutes[itemId as keyof typeof accountMenuRoutes];
    if (!destination) return;

    setDesktopOpen(false);
    setDrawerOpen(false);
    void navigate({ to: destination });
  };

  const handleLogout = () => {
    setDrawerOpen(false);
    void navigate({ to: "/login" });
  };

  if (isMobile) {
    return (
      <>
        <UserMenuTrigger onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen} />
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent className="max-h-[88dvh] rounded-t-[24px] border-hairline bg-white font-manrope">
            <div className="flex items-start justify-between gap-3 px-5 pb-4 pt-3">
              <div>
                <DrawerTitle className="sr-only">Menu do usuário</DrawerTitle>
                <DrawerDescription className="sr-only">
                  Acessos da conta, preferências e saída.
                </DrawerDescription>
                <UserIdentity />
              </div>
              <DrawerClose asChild>
                <button
                  type="button"
                  aria-label="Fechar menu do usuário"
                  className="grid size-11 shrink-0 place-items-center rounded-full text-slate-text transition-colors hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </DrawerClose>
            </div>

            <div className="overflow-y-auto px-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {menuGroups.map((group, groupIndex) => (
                <div key={group[0]!.id}>
                  {groupIndex > 0 && <div className="mx-3 my-2 h-px bg-hairline" />}
                  {group.map((item) => (
                    <MenuRow
                      key={item.id}
                      item={item}
                      mobile
                      onSelect={() => handleNavigation(item.id)}
                    />
                  ))}
                </div>
              ))}
              <div className="mx-3 my-2 h-px bg-hairline" />
              <LogoutButton mobile onLogout={handleLogout} />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      <UserMenuTrigger
        ref={desktopTriggerRef}
        aria-expanded={desktopOpen}
        aria-haspopup="menu"
        onClick={() => setDesktopOpen((current) => !current)}
      />
      {desktopOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <button
              type="button"
              aria-label="Fechar menu do usuário"
              className="fixed inset-0 z-[60] cursor-default bg-transparent"
              onClick={() => setDesktopOpen(false)}
            />
            <div
              ref={desktopMenuRef}
              role="menu"
              aria-label="Menu do usuário"
              className="fixed right-3 top-[72px] z-[70] w-[340px] animate-in rounded-2xl border border-hairline bg-white p-2 font-manrope shadow-[0_18px_50px_rgba(15,23,42,0.14)] fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 sm:right-6"
            >
              <div className="px-3 py-3">
                <UserIdentity />
              </div>
              <div className="mx-2 my-1 h-px bg-hairline" />
              {menuGroups.map((group, groupIndex) => (
                <div key={group[0]!.id}>
                  {groupIndex > 0 && <div className="mx-2 my-1 h-px bg-hairline" />}
                  {group.map((item) => (
                    <MenuRow key={item.id} item={item} onSelect={() => handleNavigation(item.id)} />
                  ))}
                </div>
              ))}
              <div className="mx-2 my-1 h-px bg-hairline" />
              <LogoutButton onLogout={handleLogout} />
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
