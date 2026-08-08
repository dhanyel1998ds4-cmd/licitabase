import { Bot, Swords, CalendarClock, Trophy, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Panel, PanelHeader } from "./Panel";
import { cn } from "@/lib/utils";

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
    <Panel className="min-w-0 p-6">
      <PanelHeader
        icon={
          <div className="p-1.5 bg-[#29C454]/10 rounded-lg">
            <Bot className="size-5 text-[#29C454]" strokeWidth={2} aria-hidden="true" />
          </div>
        }
        title="Bot de Lances"
        action={<button className="text-[12px] font-bold text-[#29C454] hover:opacity-80 transition-opacity">Ver todas →</button>}
      />

      <div className="mt-8 grid grid-cols-4 gap-6 px-4">
        {metrics.map((m) => (
          <div key={m.label} className="text-center space-y-2">
            <p className="text-[26px] font-bold text-[#29C454] tabular-nums leading-none">{m.value}</p>
            <p className="text-[11px] font-medium text-slate-text leading-tight">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-[#F0FDF4]/60 border border-[#DCFCE7] rounded-xl p-3 flex items-center gap-3">
        <div className="size-6 rounded-lg bg-white border border-[#DCFCE7] flex items-center justify-center">
          <Zap className="size-3.5 text-[#29C454] fill-green-600" />
        </div>
        <p className="text-[12px] font-medium text-[#29C454]">Seus bots estão configurados e operando com sucesso.</p>
      </div>
    </Panel>
  );
}
