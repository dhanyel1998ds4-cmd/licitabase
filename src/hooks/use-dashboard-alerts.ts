import { useEffect, useSyncExternalStore } from "react";
import { toast } from "sonner";

export type DashboardAlert = {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  tone: "green" | "blue" | "orange";
  unread: boolean;
  isNewArrival?: boolean;
};

let alerts: DashboardAlert[] = [
  {
    id: "opportunity-match",
    title: "Nova oportunidade aderente",
    description: "ComprasNet · match em cálculo",
    timeLabel: "há 8 min",
    tone: "green",
    unread: false,
  },
  {
    id: "active-dispute",
    title: "Disputa atualizada",
    description: "Pregão 845/2026 · ganhando",
    timeLabel: "há 18 min",
    tone: "blue",
    unread: false,
  },
  {
    id: "portal-sync",
    title: "Portal sincronizado",
    description: "ComprasNet conectado com sucesso",
    timeLabel: "há 27 min",
    tone: "green",
    unread: false,
  },
];

const listeners = new Set<() => void>();
const deliveredMockAlertIds = new Set<string>();

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
    },
  },
];

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return alerts;
}

export function publishDashboardAlert(alert: Omit<DashboardAlert, "id"> & { id?: string }) {
  const nextAlert: DashboardAlert = {
    ...alert,
    id: alert.id ?? `alert-${Date.now()}`,
    isNewArrival: true,
  };
  alerts = [nextAlert, ...alerts.filter((item) => item.id !== nextAlert.id)];
  listeners.forEach((listener) => listener());
}

export function markDashboardAlertRead(id: string) {
  const target = alerts.find((alert) => alert.id === id);
  if (!target?.unread) return;

  alerts = alerts.map((alert) => (alert.id === id ? { ...alert, unread: false } : alert));
  listeners.forEach((listener) => listener());
}

export function markAllDashboardAlertsRead() {
  if (!alerts.some((alert) => alert.unread)) return;

  alerts = alerts.map((alert) => ({ ...alert, unread: false }));
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
          publishDashboardAlert(alert);
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
