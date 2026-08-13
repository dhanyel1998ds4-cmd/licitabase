import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  markAllDashboardAlertsRead,
  markDashboardAlertRead,
  useDashboardAlerts,
  useMockDashboardAlertFeed,
  type DashboardAlert,
} from "@/hooks/use-dashboard-alerts";
import { OPEN_DASHBOARD_NOTIFICATIONS_EVENT } from "@/lib/dashboard-events";
import { cn } from "@/lib/utils";

const alertToneClasses: Record<DashboardAlert["tone"], string> = {
  green: "bg-[#29C454]",
  blue: "bg-blue-500",
  orange: "bg-orange-500",
};

export function DashboardNotifications() {
  const [open, setOpen] = useState(false);
  const alerts = useDashboardAlerts();
  const unreadCount = alerts.reduce((count, alert) => count + Number(alert.unread), 0);
  const openNotificationCenter = useCallback(() => setOpen(true), []);

  useMockDashboardAlertFeed(openNotificationCenter);

  useEffect(() => {
    window.addEventListener(OPEN_DASHBOARD_NOTIFICATIONS_EVENT, openNotificationCenter);
    return () =>
      window.removeEventListener(OPEN_DASHBOARD_NOTIFICATIONS_EVENT, openNotificationCenter);
  }, [openNotificationCenter]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Notificações: ${unreadCount} não lidas`}
          className="relative grid size-11 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          <Bell className="size-[20px]" strokeWidth={1.8} aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute right-0.5 top-0.5 grid min-h-5 min-w-5 animate-pulse place-items-center rounded-full border-2 border-white bg-[#29C454] px-1 text-[8px] font-extrabold leading-none text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        collisionPadding={12}
        className="z-[110] w-[min(390px,calc(100vw-24px))] overflow-hidden rounded-[22px] border-hairline bg-white p-0 font-manrope shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <div className="flex items-start gap-3 border-b border-hairline px-5 py-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-tint text-brand-strong">
            <Bell className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-extrabold text-navy">Notificações</h2>
            <p className="mt-0.5 text-[11px] font-medium text-slate-text">
              {unreadCount > 0
                ? `${unreadCount} atualizações não lidas`
                : "Tudo atualizado por aqui"}
            </p>
          </div>
          <button
            type="button"
            onClick={markAllDashboardAlertsRead}
            disabled={unreadCount === 0}
            className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl px-2.5 text-[10.5px] font-bold text-brand-strong transition-colors hover:bg-brand-tint disabled:cursor-default disabled:text-slate-300 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
          >
            <CheckCheck className="size-4" aria-hidden="true" />
            Marcar lidas
          </button>
        </div>

        <div className="max-h-[min(58vh,460px)] overflow-y-auto p-2 [scrollbar-color:rgba(100,116,139,0.25)_transparent] [scrollbar-width:thin]">
          {alerts.map((alert) => (
            <button
              key={alert.id}
              type="button"
              onClick={() => markDashboardAlertRead(alert.id)}
              className={cn(
                "flex min-h-[68px] w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#29C454]",
                alert.unread ? "bg-brand-tint/75 hover:bg-brand-tint" : "hover:bg-page",
              )}
            >
              <span className="relative mt-1 flex size-3 shrink-0 items-center justify-center">
                {alert.unread && (
                  <span
                    className={cn(
                      "absolute size-3 animate-ping rounded-full opacity-25",
                      alertToneClasses[alert.tone],
                    )}
                  />
                )}
                <span
                  className={cn("relative size-2 rounded-full", alertToneClasses[alert.tone])}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[12.5px] font-bold text-navy">{alert.title}</span>
                  {alert.unread && (
                    <span className="shrink-0 rounded-full bg-[#29C454] px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wide text-white">
                      Novo
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-[10.5px] font-medium leading-relaxed text-slate-text">
                  {alert.description}
                </span>
              </span>
              <time className="mt-0.5 shrink-0 text-[9px] font-semibold text-slate-text">
                {alert.timeLabel}
              </time>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-hairline bg-page/60 px-5 py-3 text-[10px] font-semibold text-brand-strong">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#29C454] opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-[#29C454]" />
          </span>
          Demonstração com atualizações mockadas em tempo real
        </div>
      </PopoverContent>
    </Popover>
  );
}
