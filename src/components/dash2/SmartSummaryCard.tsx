import { Lightbulb, CheckCircle2 } from "lucide-react";
import { Panel, PanelHeader, ArrowLink } from "./Panel";

const insights = [
  "2 oportunidades com alto potencial identificadas hoje.",
  "O órgão Prefeitura de Joinville retomou o volume de licitações.",
  "Seu bot venceu 9 disputas nas últimas 24h.",
];

export function SmartSummaryCard() {
  return (
    <Panel className="min-w-0 p-5">
      <PanelHeader
        icon={<Lightbulb className="size-[22px]" strokeWidth={1.8} aria-hidden="true" />}
        title="Resumo inteligente"
      />
      <ul className="mt-4 space-y-2">
        {insights.map((text) => (
          <li
            key={text}
            className="flex items-start gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-hairline hover:bg-slate-50/50"
          >
            <div className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#29C454]/10/50">
              <div className="size-1.5 rounded-full bg-[#29C454]" />
            </div>
            <span className="text-[13px] font-medium leading-tight text-ink-soft">{text}</span>
          </li>
        ))}
      </ul>
      <ArrowLink className="mt-4">Ver insights completos</ArrowLink>
    </Panel>
  );
}
