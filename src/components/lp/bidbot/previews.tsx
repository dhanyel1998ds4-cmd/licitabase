import type { ReactNode } from "react";
import {
  Bot,
  Boxes,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Gavel,
  Radio,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingDown,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { bidBotMarketingDemoData as demo } from "@/lib/bid-bot-marketing-demo";
import { cn } from "@/lib/utils";

type MetricTone = "brand" | "navy" | "warn" | "info";

function PreviewSurface({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("bidbot-preview-surface custom-scrollbar", className)}>{children}</div>;
}

function PreviewHeader({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <header className="bidbot-preview__header">
      <div className="bidbot-preview__header-copy">
        <p className="bidbot-preview__eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
        {description ? <p className="bidbot-preview__description">{description}</p> : null}
      </div>
      {aside ? <div className="bidbot-preview__header-aside">{aside}</div> : null}
    </header>
  );
}

function PreviewStatus({ children, tone = "brand" }: { children: ReactNode; tone?: MetricTone }) {
  return (
    <span className={cn("bidbot-preview__status", `bidbot-preview__status--${tone}`)}>
      <span aria-hidden="true" />
      {children}
    </span>
  );
}

function PreviewMetric({
  label,
  value,
  icon: Icon,
  tone = "navy",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: MetricTone;
}) {
  return (
    <div className={cn("bidbot-preview__metric", `bidbot-preview__metric--${tone}`)}>
      <span className="bidbot-preview__metric-icon">
        <Icon aria-hidden="true" />
      </span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function PreviewConfigList({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="bidbot-preview__config-list">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const OVERVIEW_ICONS = [Gavel, Radio, Zap, Boxes] as const;

export function BidBotOverviewPreview() {
  const { metrics, activeConfig, disputes } = demo.overview;
  const latestDispute = disputes[0]!;

  return (
    <PreviewSurface>
      <PreviewHeader
        eyebrow="Bot de Lances"
        title="Visão geral"
        description="Acompanhe a operação do robô em tempo real."
        aside={<PreviewStatus>11 ativas</PreviewStatus>}
      />

      <div className="bidbot-preview__body">
        <div className="bidbot-preview__metrics bidbot-preview__metrics--overview">
          {metrics.slice(0, 4).map((metric, index) => {
            const Icon = OVERVIEW_ICONS[index] ?? Sparkles;
            return (
              <PreviewMetric
                key={metric.label}
                label={metric.label}
                value={metric.value}
                icon={Icon}
                tone={index === 1 ? "brand" : index === 2 ? "info" : "navy"}
              />
            );
          })}
        </div>

        <section className="bidbot-preview__card" aria-labelledby="bidbot-active-config-title">
          <div className="bidbot-preview__section-heading">
            <div>
              <p>Automação</p>
              <h4 id="bidbot-active-config-title">Configuração ativa</h4>
            </div>
            <span className="bidbot-preview__verified">
              <CheckCircle2 aria-hidden="true" /> Ativa
            </span>
          </div>
          <PreviewConfigList rows={activeConfig.slice(0, 3)} />
        </section>

        <section className="bidbot-preview__card bidbot-preview__card--compact">
          <div className="bidbot-preview__section-heading">
            <div>
              <p>Fila do robô</p>
              <h4>Próxima disputa</h4>
            </div>
            <PreviewStatus tone="warn">Aguardando</PreviewStatus>
          </div>
          <div className="bidbot-preview__dispute-row">
            <span className="bidbot-preview__dispute-icon">
              <Bot aria-hidden="true" />
            </span>
            <div>
              <strong>{latestDispute.agency}</strong>
              <span>{latestDispute.object}</span>
            </div>
            <ChevronRight aria-hidden="true" />
          </div>
        </section>
      </div>
    </PreviewSurface>
  );
}

export function BidDisputeDetailPreview() {
  const { header, performance, items } = demo.dispute;
  const item = items[0]!;

  return (
    <PreviewSurface>
      <PreviewHeader
        eyebrow={`${header.uasg} · ${header.notice}`}
        title={header.agency}
        description={header.title}
        aside={<PreviewStatus>Em andamento</PreviewStatus>}
      />

      <div className="bidbot-preview__body">
        <div className="bidbot-preview__automation-strip">
          <span className="bidbot-preview__automation-icon">
            <Bot aria-hidden="true" />
          </span>
          <div>
            <strong>Bot operando</strong>
            <span>Monitoramento automático a cada 20s</span>
          </div>
          <span className="bidbot-preview__pulse" aria-hidden="true" />
        </div>

        <div className="bidbot-preview__metrics bidbot-preview__metrics--dispute">
          <PreviewMetric label="Posição" value={performance.position} icon={Trophy} tone="brand" />
          <PreviewMetric label="Nosso lance" value={performance.ourBid} icon={CircleDollarSign} />
          <PreviewMetric
            label="Desconto"
            value={performance.discount}
            icon={TrendingDown}
            tone="warn"
          />
          <PreviewMetric
            label="Lances dados"
            value={String(performance.bidsGiven)}
            icon={Gavel}
            tone="info"
          />
        </div>

        <section className="bidbot-preview__card bidbot-preview__item-card">
          <div className="bidbot-preview__section-heading">
            <div>
              <p>Item em disputa</p>
              <h4>Item {item.number}</h4>
            </div>
            <span className="bidbot-preview__verified">
              <Radio aria-hidden="true" /> Ao vivo
            </span>
          </div>

          <p className="bidbot-preview__item-description">{item.description}</p>

          <div className="bidbot-preview__item-values">
            <div>
              <span>Melhor lance</span>
              <strong>{item.bestBid}</strong>
            </div>
            <div>
              <span>Próximo evento</span>
              <strong>{item.nextEvent}</strong>
            </div>
          </div>

          <div className="bidbot-preview__item-footer">
            <span>
              <CheckCircle2 aria-hidden="true" /> Ganhando
            </span>
            <span>{item.checks}</span>
          </div>
        </section>
      </div>
    </PreviewSurface>
  );
}

export function BidRankingPreview() {
  const { item, ourPosition, ourBid, bestBid, rows } = demo.ranking;

  return (
    <PreviewSurface>
      <PreviewHeader
        eyebrow="Ranking ao vivo"
        title={item}
        description="Sua posição atualizada a cada novo lance."
        aside={<PreviewStatus>Atualizando</PreviewStatus>}
      />

      <div className="bidbot-preview__ranking-summary">
        <div>
          <span>Posição</span>
          <strong>{ourPosition}</strong>
        </div>
        <div>
          <span>Nosso lance</span>
          <strong>{ourBid}</strong>
        </div>
        <div>
          <span>Melhor valor</span>
          <strong>{bestBid}</strong>
        </div>
      </div>

      <div className="bidbot-preview__ranking" role="table" aria-label="Ranking de fornecedores">
        <div className="bidbot-preview__ranking-head" role="row">
          <span role="columnheader">Posição</span>
          <span role="columnheader">Fornecedor</span>
          <span role="columnheader">Lance</span>
        </div>
        <div className="bidbot-preview__ranking-body" role="rowgroup">
          {rows.slice(0, 5).map((row) => (
            <div
              key={row.pos}
              role="row"
              className={cn("bidbot-preview__ranking-row", row.you && "is-current")}
            >
              <span role="cell" className="bidbot-preview__position">
                {row.pos}º
              </span>
              <span role="cell" className="bidbot-preview__supplier">
                <strong>{row.supplier}</strong>
                <small>{row.you ? "Sua empresa" : `${row.uf} · ${row.type}`}</small>
              </span>
              <span role="cell" className="bidbot-preview__bid">
                {row.bid}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PreviewSurface>
  );
}

function timelineTone(kind: string) {
  if (kind === "Nosso lance") return "brand";
  if (kind === "Preço caiu") return "warn";
  if (kind === "Monitorando") return "info";
  return "navy";
}

export function BidTimelinePreview() {
  const visibleEvents = demo.timeline.events
    .filter((_, index, events) => index < 3 || index === events.length - 1)
    .slice(0, 4);

  return (
    <PreviewSurface>
      <PreviewHeader
        eyebrow="Histórico da disputa"
        title="Timeline da sessão"
        description="Eventos registrados pelo robô em ordem cronológica."
        aside={<PreviewStatus>Ao vivo</PreviewStatus>}
      />

      <ol className="bidbot-preview__timeline">
        {visibleEvents.map((event) => {
          const tone = timelineTone(event.kind);
          return (
            <li key={`${event.time}-${event.event}`}>
              <div className="bidbot-preview__timeline-time">
                <Timer aria-hidden="true" />
                <span>{event.time}</span>
              </div>
              <span
                className={cn(
                  "bidbot-preview__timeline-dot",
                  `bidbot-preview__timeline-dot--${tone}`,
                )}
                aria-hidden="true"
              />
              <div className="bidbot-preview__timeline-content">
                <div>
                  <strong>{event.event}</strong>
                  <span>{event.value}</span>
                </div>
                <p>{event.detail}</p>
                <small>{event.status}</small>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="bidbot-preview__timeline-footer">
        <ShieldCheck aria-hidden="true" />
        <span>Todos os eventos ficam registrados para auditoria.</span>
      </div>
    </PreviewSurface>
  );
}

export function BidBotOperationalSummaryPreview() {
  return (
    <PreviewSurface className="bidbot-preview-surface--summary">
      <p className="bidbot-preview__summary-label">Resumo operacional</p>
      <div className="bidbot-preview__summary-grid">
        {demo.operationalSummary.map((metric, index) => (
          <PreviewMetric
            key={metric.label}
            label={metric.label}
            value={metric.value}
            icon={OVERVIEW_ICONS[index] ?? Sparkles}
            tone={metric.tone}
          />
        ))}
      </div>
    </PreviewSurface>
  );
}
