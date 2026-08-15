export const notificationPreferenceKeys = [
  "Novas oportunidades compatíveis",
  "Prazo de proposta próximo",
  "Mudança de posição em disputa",
  "Bot em ação ou com atenção",
  "Disputa encerrada",
] as const;

export type NotificationPreferenceKey = (typeof notificationPreferenceKeys)[number];

export type NotificationChannels = {
  email: boolean;
  platform: boolean;
  whatsapp: boolean;
};

export const defaultNotificationChannels: NotificationChannels = {
  email: true,
  platform: true,
  whatsapp: false,
};

export const defaultOperationNotifications: Record<NotificationPreferenceKey, boolean> = {
  "Novas oportunidades compatíveis": true,
  "Prazo de proposta próximo": true,
  "Mudança de posição em disputa": true,
  "Bot em ação ou com atenção": true,
  "Disputa encerrada": false,
};

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem(`licitabase:account:${key}`);
    return stored ? ({ ...fallback, ...(JSON.parse(stored) as object) } as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getNotificationPreferences() {
  return {
    channels: readStoredValue("notification-channels", defaultNotificationChannels),
    operation: readStoredValue("operation-notifications", defaultOperationNotifications),
  };
}

export function canShowPlatformNotification(preference?: NotificationPreferenceKey) {
  const { channels, operation } = getNotificationPreferences();
  return channels.platform && (preference ? operation[preference] !== false : true);
}
