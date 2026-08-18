import type { ReactNode } from "react";
import { Panel } from "@/components/dash2/Panel";

export type HowItWorksStep = {
  title: string;
  description: string;
};

type PageHowItWorksProps = {
  title: string;
  description: string;
  steps: readonly HowItWorksStep[];
  action?: ReactNode;
  className?: string;
};

/**
 * Orientação contextual de uma página interna. Sempre fica após o cabeçalho,
 * antes dos filtros, abas ou dados que representam o trabalho da pessoa.
 */
export function PageHowItWorks({
  title,
  description,
  steps,
  action,
  className,
}: PageHowItWorksProps) {
  return (
    <aside aria-label="Como funciona esta página" className={className}>
      <Panel className="overflow-hidden p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
              Como funciona
            </p>
            <h2 className="mt-1 text-[16px] font-extrabold text-ink sm:text-[17px]">{title}</h2>
            <p className="mt-1 max-w-3xl text-[12px] leading-relaxed text-slate-text">
              {description}
            </p>
          </div>
          {action ? <div className="shrink-0 [&>*]:min-h-11">{action}</div> : null}
        </div>

        <ol className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex min-w-0 gap-3 rounded-xl border border-hairline bg-[#FBFDFC] p-3.5"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#E8F8ED] text-[10px] font-extrabold text-[#15863a]">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-extrabold text-ink">{step.title}</p>
                <p className="mt-1 text-[10.5px] leading-relaxed text-slate-text">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Panel>
    </aside>
  );
}
