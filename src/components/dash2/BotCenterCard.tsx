import { Bot, Swords, CalendarClock, Trophy, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Panel, PanelHeader } from "./Panel";

type Metric = {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
};

const metrics: Metric[] = [
  {
    icon: Bot,
    value: "10",
    label: "Bots ativos",
    color: "emerald",
  },
  {
    icon: Swords,
    value: "2",
    label: "Disputas em andamento",
    color: "orange",
  },
  {
    icon: CalendarClock,
    value: "0",
    label: "Aguardando ação",
    color: "blue",
  },
  {
    icon: Trophy,
    value: "98%",
    label: "Sucesso hoje",
    color: "purple",
  },
];

export function BotCenterCard() {
  return (
    <Panel className="min-w-0 p-5 sm:p-6">
      <PanelHeader
        icon={
          <div className="p-1.5 bg-[#29C454]/10 rounded-lg">
            <Bot className="size-5 text-[#29C454]" strokeWidth={2} aria-hidden="true" />
          </div>
        }
        title="Bot de Lances"
        action={
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-[13px] font-bold text-[#29C454] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
          >
            Ver todas →
          </button>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-4 sm:gap-6 sm:px-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="relative space-y-2 rounded-xl border border-hairline bg-slate-50/60 p-3 text-left sm:border-0 sm:bg-transparent sm:p-0 sm:text-center"
            >
              <Icon
                className="absolute right-3 top-3 size-4 text-[#29C454]/70 sm:hidden"
                aria-hidden="true"
              />
              <p className="text-[26px] font-bold leading-none text-[#29C454] tabular-nums">
                {metric.value}
              </p>
              <p className="max-w-[90%] text-[12px] font-medium leading-snug text-slate-text sm:max-w-none">
                {metric.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#DCFCE7] bg-[#F0FDF4]/60 p-3 sm:mt-8 sm:items-center">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#DCFCE7] bg-white">
          <Zap className="size-3.5 text-[#29C454] fill-green-600" />
        </div>
        <p className="text-[13px] font-medium leading-relaxed text-[#16863A]">
          Seus bots estão configurados e operando com sucesso.
        </p>
      </div>
    </Panel>
  );
}
