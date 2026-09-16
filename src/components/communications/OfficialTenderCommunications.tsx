import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BellRing,
  ChevronRight,
  Clock3,
  FileQuestion,
  MessageSquareText,
  Paperclip,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CommunicationKind = "aviso" | "mensagem" | "esclarecimento" | "impugnacao";

type OfficialCommunication = {
  id: string;
  kind: CommunicationKind;
  title: string;
  summary: string;
  origin: string;
  occurredAt: string;
  deadline?: string;
  attachment?: string;
  unread?: boolean;
};

const communicationMeta: Record<
  CommunicationKind,
  { label: string; icon: typeof BellRing; tone: string; iconTone: string }
> = {
  aviso: {
    label: "Aviso oficial",
    icon: BellRing,
    tone: "border-blue-200 bg-blue-50 text-blue-800",
    iconTone: "bg-blue-100 text-blue-700",
  },
  mensagem: {
    label: "Mensagem do pregoeiro",
    icon: MessageSquareText,
    tone: "border-violet-200 bg-violet-50 text-violet-800",
    iconTone: "bg-violet-100 text-violet-700",
  },
  esclarecimento: {
    label: "Esclarecimento",
    icon: FileQuestion,
    tone: "border-amber-200 bg-amber-50 text-amber-800",
    iconTone: "bg-amber-100 text-amber-700",
  },
  impugnacao: {
    label: "Impugnação",
    icon: ShieldAlert,
    tone: "border-rose-200 bg-rose-50 text-rose-800",
    iconTone: "bg-rose-100 text-rose-700",
  },
};

const demonstrationCommunications: OfficialCommunication[] = [
  {
    id: "official-message-1",
    kind: "mensagem",
    title: "Pregoeiro solicita confirmação de leitura",
    summary:
      "Confirme, no portal, que a equipe tomou ciência da retificação publicada para os itens de informática.",
    origin: "Compras.gov.br · Pregoeiro",
    occurredAt: "Hoje, 10:24",
    deadline: "Responder até hoje, 16:00",
    unread: true,
  },
  {
    id: "official-notice-1",
    kind: "aviso",
    title: "Retificação do termo de referência",
    summary:
      "O prazo de propostas foi atualizado e a versão revisada do termo de referência está disponível.",
    origin: "Compras.gov.br · Aviso do processo",
    occurredAt: "Hoje, 09:48",
    attachment: "Retificação do termo de referência.pdf",
    unread: true,
  },
  {
    id: "official-clarification-1",
    kind: "esclarecimento",
    title: "Resposta a pedido de esclarecimento nº 02",
    summary:
      "O órgão esclarece os critérios de compatibilidade técnica e confirma a aceitação de documentação equivalente.",
    origin: "Compras.gov.br · Órgão responsável",
    occurredAt: "Ontem, 16:32",
    attachment: "Resposta ao esclarecimento nº 02.pdf",
  },
  {
    id: "official-challenge-1",
    kind: "impugnacao",
    title: "Impugnação recebida no processo",
    summary:
      "Foi registrada uma impugnação de terceiro. Acompanhe a decisão do órgão antes de tomar uma decisão comercial.",
    origin: "Compras.gov.br · Processo",
    occurredAt: "Ontem, 14:05",
    deadline: "Julgamento previsto até 22 ago",
  },
];

const filters: Array<{ id: "todas" | CommunicationKind; label: string }> = [
  { id: "todas", label: "Todas" },
  { id: "mensagem", label: "Pregoeiro" },
  { id: "aviso", label: "Avisos" },
  { id: "esclarecimento", label: "Esclarecimentos" },
  { id: "impugnacao", label: "Impugnações" },
];

export function OfficialTenderCommunications({
  tenderId,
  portal = "Portal oficial",
  compact = false,
  className,
}: {
  tenderId: string;
  portal?: string;
  compact?: boolean;
  className?: string;
}) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("todas");
  const visibleCommunications = useMemo(
    () =>
      demonstrationCommunications.filter((item) => filter === "todas" || item.kind === filter),
    [filter],
  );
  const entries = compact ? visibleCommunications.slice(0, 3) : visibleCommunications;

  return (
    <div className={cn("space-y-4", className)}>
      <div className={cn("flex gap-3", compact ? "items-start" : "items-start justify-between gap-4")}>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-strong">
            Comunicação oficial
          </p>
          <h2 className={cn("mt-1 font-bold tracking-[-0.02em] text-ink", compact ? "text-[15px]" : "text-[20px]")}>
            Avisos e mensagens do portal
          </h2>
          <p className={cn("mt-1 leading-relaxed text-slate-text", compact ? "text-[11px]" : "text-[13px]")}>
            {compact
              ? `Leitura vinculada ao ${portal}. Nunca confunda esta área com o chat interno.`
              : `Centralize avisos, mensagens do pregoeiro, impugnações e esclarecimentos vinculados à licitação no ${portal}.`}
          </p>
        </div>
        {!compact ? (
          <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800">
            Demonstração
          </span>
        ) : null}
      </div>

      <div className="rounded-xl border border-amber-200/80 bg-amber-50/65 px-3 py-2.5">
        <p className="text-[12px] font-bold text-amber-950">Leitura demonstrativa do portal</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-amber-900/80">
          Até a integração ser entregue pelo backend, os dados abaixo simulam a experiência e não representam mensagens oficiais reais.
        </p>
      </div>

      {!compact ? (
        <div className="flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Filtrar comunicações oficiais">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={cn(
                "min-h-10 shrink-0 rounded-lg px-3 text-[12px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#29C454]/35",
                filter === item.id
                  ? "bg-[#29C454] text-white"
                  : "border border-hairline bg-white text-slate-text hover:bg-[#29C454]/[0.06] hover:text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-white">
        {entries.map((item) => {
          const meta = communicationMeta[item.kind];
          const Icon = meta.icon;
          return (
            <article key={item.id} className="relative flex gap-3 p-3 sm:p-4">
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", meta.iconTone)}>
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold", meta.tone)}>
                    {meta.label}
                  </span>
                  {item.unread ? (
                    <span className="rounded-full bg-[#29C454]/12 px-2 py-0.5 text-[10px] font-bold text-[#117633]">
                      Novo
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-1.5 text-[13px] font-bold leading-snug text-ink">{item.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-text">{item.summary}</p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-text">
                  <span>{item.origin}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="size-3" aria-hidden="true" />
                    {item.occurredAt}
                  </span>
                  {item.deadline ? <span className="font-semibold text-amber-800">{item.deadline}</span> : null}
                  {item.attachment ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-brand-strong">
                      <Paperclip className="size-3" aria-hidden="true" />
                      {item.attachment}
                    </span>
                  ) : null}
                </div>
              </div>
              {!compact ? <ChevronRight className="mt-3 size-4 shrink-0 text-slate-text" aria-hidden="true" /> : null}
            </article>
          );
        })}
      </div>

      {compact ? (
        <Button asChild variant="outline" className="min-h-11 w-full rounded-xl text-[12px] font-bold">
          <Link
            to="/dash2/operacao/minhas-licitacoes/$licitacaoId"
            params={{ licitacaoId: tenderId }}
            search={{ tab: "comunicacoes" }}
          >
            Ver histórico completo da licitação
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
