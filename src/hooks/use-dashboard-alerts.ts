import { useEffect, useSyncExternalStore } from "react";
import { toast } from "sonner";
import {
  canShowPlatformNotification,
  getNotificationPreferences,
  type NotificationPreferenceKey,
} from "@/lib/notification-preferences";

export type DashboardAlert = {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  tone: "green" | "blue" | "orange";
  unread: boolean;
  isNewArrival?: boolean;
  preference?: NotificationPreferenceKey;
};

let alerts: DashboardAlert[] = [
  {
    id: "opportunity-match",
    title: "Nova oportunidade aderente",
    description: "ComprasNet · match em cálculo",
    timeLabel: "há 8 min",
    tone: "green",
    unread: false,
    preference: "Novas oportunidades compatíveis",
  },
  {
    id: "active-dispute",
    title: "Disputa atualizada",
    description: "Pregão 845/2026 · ganhando",
    timeLabel: "há 18 min",
    tone: "blue",
    unread: false,
    preference: "Mudança de posição em disputa",
  },
  {
    id: "portal-sync",
    title: "Portal sincronizado",
    description: "ComprasNet conectado com sucesso",
    timeLabel: "há 27 min",
    tone: "green",
    unread: false,
    preference: "Bot em ação ou com atenção",
  },
];

const listeners = new Set<() => void>();
const deliveredMockAlertIds = new Set<string>();
let alertsRevision = 0;
let cachedAlertsSnapshot: DashboardAlert[] = alerts;
let cachedSnapshotKey = "";

const mockAlertFeed: Array<{ delay: number; alert: DashboardAlert }> = [
  {
    delay: 2000,
    alert: {
      id: "mock-live-opportunity",
      title: "Nova licitação publicada",
      description: "ComprasNet · equipamentos de informática em SP",
      timeLabel: "agora",
      tone: "green",
      unread: true,
      preference: "Novas oportunidades compatíveis",
    },
  },
  {
    delay: 4000,
    alert: {
      id: "mock-deadline-update",
      title: "Prazo atualizado",
      description: "PE 310/2026 · propostas até amanhã, 14h",
      timeLabel: "agora",
      tone: "orange",
      unread: true,
      preference: "Prazo de proposta próximo",
    },
  },
  {
    delay: 6000,
    alert: {
      id: "mock-bid-monitoring",
      title: "Novo lance monitorado",
      description: "Pregão 845/2026 · sua posição permanece em 1º",
      timeLabel: "agora",
      tone: "blue",
      unread: true,
      preference: "Mudança de posição em disputa",
    },
  },
];

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onPreferencesUpdated = (event: Event) => {
    const key = (event as CustomEvent<{ key?: string }>).detail?.key;
    if (key === "notification-channels" || key === "operation-notifications") listener();
  };
  const onStorage = (event: StorageEvent) => {
    if (
      event.key === "licitabase:account:notification-channels" ||
      event.key === "licitabase:account:operation-notifications"
    ) {
      listener();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("licitabase:account-updated", onPreferencesUpdated);
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("licitabase:account-updated", onPreferencesUpdated);
      window.removeEventListener("storage", onStorage);
    }
  };
}

function getSnapshot() {
  const { channels, operation } = getNotificationPreferences();
  const preferenceKey = `${channels.platform}:${notificationPreferenceKey(operation)}`;
  const snapshotKey = `${alertsRevision}:${preferenceKey}`;

  if (snapshotKey === cachedSnapshotKey) return cachedAlertsSnapshot;

  cachedSnapshotKey = snapshotKey;
  cachedAlertsSnapshot = channels.platform
    ? alerts.filter((alert) => !alert.preference || operation[alert.preference] !== false)
    : [];
  return cachedAlertsSnapshot;
}

function notificationPreferenceKey(operation: Record<NotificationPreferenceKey, boolean>) {
  return Object.entries(operation)
    .sort(([first], [second]) => first.localeCompare(second, "pt-BR"))
    .map(([key, enabled]) => `${key}:${enabled}`)
    .join("|");
}

export function publishDashboardAlert(alert: Omit<DashboardAlert, "id"> & { id?: string }) {
  if (!canShowPlatformNotification(alert.preference)) return false;

  const nextAlert: DashboardAlert = {
    ...alert,
    id: alert.id ?? `alert-${Date.now()}`,
    isNewArrival: true,
  };
  alerts = [nextAlert, ...alerts.filter((item) => item.id !== nextAlert.id)];
  alertsRevision += 1;
  listeners.forEach((listener) => listener());
  return true;
}

export function markDashboardAlertRead(id: string) {
  const target = alerts.find((alert) => alert.id === id);
  if (!target?.unread) return;

  alerts = alerts.map((alert) => (alert.id === id ? { ...alert, unread: false } : alert));
  alertsRevision += 1;
  listeners.forEach((listener) => listener());
}

export function markAllDashboardAlertsRead() {
  if (!alerts.some((alert) => alert.unread)) return;

  alerts = alerts.map((alert) => ({ ...alert, unread: false }));
  alertsRevision += 1;
  listeners.forEach((listener) => listener());
}

export function useMockDashboardAlertFeed(onOpenNotificationCenter: () => void) {
  useEffect(() => {
    const timers = mockAlertFeed
      .filter(({ alert }) => !deliveredMockAlertIds.has(alert.id))
      .map(({ delay, alert }) =>
        window.setTimeout(() => {
          if (deliveredMockAlertIds.has(alert.id)) return;

          deliveredMockAlertIds.add(alert.id);
          const shouldShowAlert = publishDashboardAlert(alert);
          if (!shouldShowAlert) return;

          toast.success(alert.title, {
            description: alert.description,
            duration: 6500,
            action: {
              label: "Ver alerta",
              onClick: onOpenNotificationCenter,
            },
          });
        }, delay),
      );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [onOpenNotificationCenter]);
}

export function useDashboardAlerts() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
