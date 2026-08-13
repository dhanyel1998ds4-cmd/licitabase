import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUp, Bell, Sparkles } from "lucide-react";
import { BrandPattern } from "@/components/brand/BrandMarks";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { markDashboardAlertRead, useDashboardAlerts } from "@/hooks/use-dashboard-alerts";
import { openAlicitanteAssistant } from "@/lib/alicitante-events";
import { cn } from "@/lib/utils";

const alertToneClasses = {
  green: "bg-[#29C454]",
  blue: "bg-blue-500",
  orange: "bg-orange-500",
} as const;

export function SidebarUtilityCards({ collapsed }: { collapsed: boolean }) {
  const alerts = useDashboardAlerts();
  const unreadCount = alerts.filter((alert) => alert.unread).length;
  const alertListRef = useRef<HTMLDivElement>(null);
  const alertFeedContentRef = useRef<HTMLDivElement>(null);
  const atTopRef = useRef(true);
  const preserveScrollRef = useRef(false);
  const lastContentHeightRef = useRef(0);
  const previousAlertCountRef = useRef(alerts.length);
  const previousLatestAlertIdRef = useRef(alerts[0]?.id);
  const preserveTimerRef = useRef<number | null>(null);
  const [pendingNewCount, setPendingNewCount] = useState(0);
  const latestAlertId = alerts[0]?.id;

  useEffect(() => {
    const content = alertFeedContentRef.current;
    if (!content) return;

    lastContentHeightRef.current = content.getBoundingClientRect().height;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const nextHeight = entry.contentRect.height;
      const delta = nextHeight - lastContentHeightRef.current;

      if (preserveScrollRef.current && delta > 0 && alertListRef.current) {
        alertListRef.current.scrollTop += delta;
      }

      lastContentHeightRef.current = nextHeight;
    });

    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (previousLatestAlertIdRef.current === latestAlertId) return;

    const additions = Math.max(1, alerts.length - previousAlertCountRef.current);
    const list = alertListRef.current;

    if (atTopRef.current) {
      preserveScrollRef.current = false;
      if (list) list.scrollTop = 0;
      setPendingNewCount(0);
    } else {
      preserveScrollRef.current = true;
      setPendingNewCount((current) => current + additions);

      if (preserveTimerRef.current) window.clearTimeout(preserveTimerRef.current);
      preserveTimerRef.current = window.setTimeout(() => {
        preserveScrollRef.current = false;
      }, 700);
    }

    previousAlertCountRef.current = alerts.length;
    previousLatestAlertIdRef.current = latestAlertId;
  }, [alerts.length, latestAlertId]);

  useEffect(
    () => () => {
      if (preserveTimerRef.current) window.clearTimeout(preserveTimerRef.current);
    },
    [],
  );

  const handleAlertScroll = () => {
    const isAtTop = (alertListRef.current?.scrollTop ?? 0) <= 8;
    atTopRef.current = isAtTop;
    if (isAtTop) setPendingNewCount(0);
  };

  const revealNewAlerts = () => {
    preserveScrollRef.current = false;
    atTopRef.current = true;
    setPendingNewCount(0);
    alertListRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (collapsed) {
    return (
      <div className="mt-auto flex flex-col items-center gap-2 pt-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="relative grid size-11 place-items-center rounded-xl border border-hairline bg-white text-navy shadow-sm"
              tabIndex={0}
              aria-label={`${unreadCount} alertas recentes`}
            >
              <Bell className="size-[19px]" strokeWidth={1.8} aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full border-2 border-[#F8FAFC] bg-[#29C454] px-1 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            Alertas em tempo real
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => openAlicitanteAssistant()}
              aria-label="Conversar com a Alicitante"
              className="overflow-hidden rounded-xl border border-[#29C454]/25 bg-brand-tint shadow-sm transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
            >
              <img
                src="/images/alicitante-assistant.png"
                alt=""
                className="size-11 object-cover object-top"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            Conversar com a Alicitante
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="mt-auto space-y-4 pt-6">
      <section
        className="min-h-[276px] rounded-[22px] border border-hairline bg-white p-4 shadow-sm"
        aria-label="Alertas recentes"
      >
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-brand-tint text-brand-strong">
            <Bell className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-[14px] font-extrabold text-navy">Alertas</h3>
            <p className="text-[11px] font-medium text-slate-text">Atualizações em tempo real</p>
          </div>
          <span
            className={cn(
              "grid min-h-7 min-w-7 place-items-center rounded-full px-1.5 text-[10px] font-extrabold",
              unreadCount > 0 ? "animate-pulse bg-[#29C454] text-white" : "bg-page text-slate-text",
            )}
          >
            {unreadCount}
          </span>
        </div>

        <div className="relative mt-3">
          {pendingNewCount > 0 && (
            <button
              type="button"
              onClick={revealNewAlerts}
              className="absolute left-1/2 top-1 z-20 inline-flex min-h-8 -translate-x-1/2 items-center gap-1.5 rounded-full border border-[#29C454]/30 bg-white px-3 text-[9.5px] font-extrabold text-brand-strong shadow-[0_6px_18px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
              aria-label={`${pendingNewCount} ${pendingNewCount === 1 ? "novo alerta" : "novos alertas"}. Voltar ao topo`}
            >
              <ArrowUp className="size-3" strokeWidth={2.2} aria-hidden="true" />
              {pendingNewCount} {pendingNewCount === 1 ? "nova atualização" : "novas atualizações"}
            </button>
          )}

          <div
            ref={alertListRef}
            onScroll={handleAlertScroll}
            className="max-h-[172px] overflow-y-auto overscroll-contain pr-1 [scrollbar-color:rgba(100,116,139,0.25)_transparent] [scrollbar-width:thin]"
            aria-live="polite"
            aria-relevant="additions"
          >
            <div ref={alertFeedContentRef} className="space-y-1">
              {alerts.map((alert) => (
                <div key={alert.id} className={cn(alert.isNewArrival && "alert-cascade-enter")}>
                  <button
                    type="button"
                    onClick={() => markDashboardAlertRead(alert.id)}
                    className={cn(
                      "flex min-h-[58px] w-full gap-2 rounded-xl px-2 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#29C454]",
                      alert.unread ? "bg-brand-tint/65 hover:bg-brand-tint" : "hover:bg-page",
                    )}
                  >
                    <span className="relative mt-1.5 flex size-2 shrink-0">
                      {alert.unread && (
                        <span
                          className={cn(
                            "absolute inline-flex size-full animate-ping rounded-full opacity-35",
                            alertToneClasses[alert.tone],
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "relative inline-flex size-2 rounded-full",
                          alertToneClasses[alert.tone],
                        )}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-[11px] font-bold text-navy">
                          {alert.title}
                        </span>
                        {alert.unread && (
                          <span className="shrink-0 rounded-full bg-[#29C454] px-1.5 py-0.5 text-[7.5px] font-extrabold uppercase tracking-wide text-white">
                            Novo
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block truncate text-[9.5px] font-medium text-slate-text">
                        {alert.description}
                      </span>
                    </span>
                    <time className="shrink-0 text-[8.5px] font-semibold text-slate-text">
                      {alert.timeLabel}
                    </time>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 border-t border-hairline pt-3 text-[10px] font-semibold text-brand-strong">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#29C454] opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-[#29C454]" />
          </span>
          Atualizações em tempo real
        </div>
      </section>

      <section className="group relative isolate min-h-[200px] overflow-hidden rounded-[22px] border border-[#29C454]/35 bg-[#F0FFF5] p-4 shadow-[0_10px_30px_rgba(19,155,69,0.12)] transition-all hover:border-[#29C454]/55 hover:shadow-[0_14px_36px_rgba(19,155,69,0.18)]">
        <BrandPattern className="absolute -bottom-12 -right-10 -z-10 size-48 opacity-90" />

        <div className="absolute inset-y-0 right-0 z-0 w-[48%] overflow-hidden">
          <BrandPattern className="absolute -bottom-8 -right-10 size-40 opacity-70" />
          <div className="absolute inset-x-4 bottom-1 h-10 rounded-full bg-[#14A944]/25 blur-xl" />
          <img
            src="/images/alicitante-card.png"
            alt="Alicitante, assistente virtual do Licitabase"
            className="relative z-0 h-full w-full object-cover [object-position:52%_7%] transition-transform duration-300 group-hover:scale-[1.025]"
          />
        </div>

        <div className="relative z-20 max-w-[112px]">
          <div className="flex items-center gap-1.5 text-brand-strong">
            <Sparkles className="size-4" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.08em]">IA Licitabase</span>
          </div>
          <h3 className="mt-2 text-[20px] font-extrabold tracking-tight text-navy">Alicitante</h3>
          <p className="mt-1.5 text-[11px] font-medium leading-[1.5] text-slate-text">
            Sua copiloto para oportunidades e editais.
          </p>
          <button
            type="button"
            onClick={() => openAlicitanteAssistant()}
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-[#29C454] px-3.5 text-[11px] font-bold text-white shadow-[0_6px_16px_rgba(19,155,69,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#22AD49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
          >
            Conversar
            <Sparkles className="size-3" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
