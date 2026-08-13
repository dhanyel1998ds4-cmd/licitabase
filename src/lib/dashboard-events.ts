export const OPEN_DASHBOARD_NOTIFICATIONS_EVENT = "licitabase:open-dashboard-notifications";
export const OPEN_USER_ACCOUNT_MENU_EVENT = "licitabase:open-user-account-menu";

export function openDashboardNotifications() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_DASHBOARD_NOTIFICATIONS_EVENT));
}

export function openUserAccountMenu() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_USER_ACCOUNT_MENU_EVENT));
}
