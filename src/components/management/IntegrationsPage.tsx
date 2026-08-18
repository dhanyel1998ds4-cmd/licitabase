import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  ExternalLink,
  PlugZap,
  RefreshCw,
  Search,
  ShieldCheck,
  Unplug,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { InternalPageState, InternalStatusNotice } from "@/components/dash2/InternalPageState";
import { PageContextHeader } from "@/components/dash2/PageContextHeader";
import { PageHowItWorks } from "@/components/dash2/PageHowItWorks";
import { Panel, PanelHeader } from "@/components/dash2/Panel";
import { useResizableColumns } from "@/components/dash2/ResizableColumns";
import { ResourceListGridHeader } from "@/components/dash2/ResourceList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type IntegrationState = "active" | "attention" | "available";

type Integration = {
  id: string;
  name: string;
  kind: string;
  description: string;
  state: IntegrationState;
  lastSync: string;
  scope: string;
  records: string;
};

const integrations: Integration[] = [
  {
    id: "compras",
    name: "Compras.gov.br",
    kind: "Portal oficial",
    description: "Leitura de oportunidades, prazos e documentos públicos.",
    state: "active",
    lastSync: "Há 4 min",
    scope: "Oportunidades e eventos",
    records: "1.248 leituras",
  },
  {
    id: "pncp",
    name: "PNCP",
    kind: "Fonte oficial",
    description: "Atualização diária de editais e documentos publicados.",
    state: "active",
    lastSync: "Hoje, 10:42",
    scope: "Editais e anexos",
    records: "4.826 editais",
  },
  {
    id: "licitanet",
    name: "Licitanet",
    kind: "Portal de compras",
    description: "Acompanhe processos vinculados à sua operação.",
    state: "attention",
    lastSync: "Há 2 h",
    scope: "Sessões e propostas",
    records: "Última tentativa falhou",
  },
  {
    id: "bnc",
    name: "BNC Compras",
    kind: "Portal de compras",
    description: "Disponível quando o plano e a credencial permitirem a conexão.",
    state: "available",
    lastSync: "Ainda não conectado",
    scope: "Consulta de disponibilidade",
    records: "Recurso disponível",
  },
];

const stateCopy = {
  active: { label: "Conectada", className: "bg-[#E8F8ED] text-brand-strong", icon: CheckCircle2 },
  attention: { label: "Atenção", className: "bg-amber-50 text-amber-700", icon: CircleAlert },
  available: { label: "Disponível", className: "bg-[#EEF4FF] text-[#2455B6]", icon: PlugZap },
};

const integrationResizableColumns = [
  { id: "scope", width: 190, min: 160, max: 340 },
  { id: "updated", width: 180, min: 160, max: 300 },
  { id: "actions", width: 200, min: 160, max: 280 },
];

export function IntegrationsPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Integration | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const { gridTemplateColumns: integrationGridTemplateColumns, getResizeHandleProps } =
    useResizableColumns({
      storageKey: "licitabase:integrations:columns",
      columns: integrationResizableColumns,
    });
  const visible = useMemo(
    () =>
      integrations.filter((integration) =>
        `${integration.name} ${integration.kind}`
          .toLocaleLowerCase("pt-BR")
          .includes(query.toLocaleLowerCase("pt-BR")),
      ),
    [query],
  );

  const connect = (integration: Integration) => {
    setConnecting(integration.id);
    window.setTimeout(() => {
      setConnecting(null);
      toast.success("Teste de conexão concluído", {
        description: `${integration.name} está pronto para a próxima etapa.`,
      });
    }, 700);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageContextHeader
        context="management"
        contextLabel="GESTÃO DA OPERAÇÃO"
        title="Integrações"
        description="Conecte fontes autorizadas e acompanhe a saúde das leituras que alimentam sua operação."
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              toast.success("Sincronização iniciada", {
                description: "As conexões ativas serão verificadas em segundo plano.",
              })
            }
          >
            <RefreshCw className="size-4" /> Sincronizar tudo
          </Button>
        }
      />
      <PageHowItWorks
        title="Conecte fontes e acompanhe a qualidade das leituras"
        description="As integrações mostram o que cada portal alimenta, a data da última leitura e quando algo precisa ser revisado."
        steps={[
          {
            title: "Escolha a fonte",
            description: "Veja o escopo antes de conectar uma integração autorizada.",
          },
          {
            title: "Conecte com segurança",
            description: "Conclua a autorização no fluxo do portal e teste a conexão.",
          },
          {
            title: "Acompanhe a saúde",
            description: "Gerencie falhas e sincronize antes de tomar decisões com dados antigos.",
          },
        ]}
      />
      <InternalStatusNotice
        state="updating"
        action={
          <span className="text-[11px] font-bold text-[#2455B6]">Última atualização há 4 min</span>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <IntegrationMetric
          label="Conectadas"
          value="2"
          detail="Fontes alimentando a operação"
          tone="green"
        />
        <IntegrationMetric
          label="Exigem atenção"
          value="1"
          detail="Uma leitura precisa ser revisada"
          tone="amber"
        />
        <IntegrationMetric
          label="Dados processados"
          value="6.074"
          detail="No período selecionado"
          tone="blue"
        />
        <IntegrationMetric
          label="Cobertura"
          value="3 portais"
          detail="Fontes oficiais e conectadas"
          tone="green"
        />
      </div>
      <Panel className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-hairline p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
              Conexões do workspace
            </p>
            <h2 className="mt-1 text-[17px] font-extrabold text-ink">Fontes, saúde e permissões</h2>
            <p className="mt-1 text-[12px] text-slate-text">
              Credenciais são tratadas apenas dentro do fluxo de conexão autorizado.
            </p>
          </div>
          <div className="relative w-full lg:w-[360px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-text" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-11 rounded-xl border-hairline pl-9"
              placeholder="Buscar portal ou fonte"
              aria-label="Buscar integração"
            />
          </div>
        </div>
        {visible.length ? (
          <div className="divide-y divide-hairline">
            <ResourceListGridHeader
              gridTemplateColumns={integrationGridTemplateColumns}
              className="px-5 py-3"
            >
              <span className="relative">
                Integração
                <button
                  {...getResizeHandleProps("scope")}
                  aria-label="Redimensionar largura da coluna Escopo"
                />
              </span>
              <span className="relative">
                Escopo
                <button
                  {...getResizeHandleProps("updated")}
                  aria-label="Redimensionar largura da coluna Atualização"
                />
              </span>
              <span className="relative">
                Atualização
                <button
                  {...getResizeHandleProps("actions")}
                  aria-label="Redimensionar largura da coluna Ações"
                />
              </span>
              <span className="text-right">Ações</span>
            </ResourceListGridHeader>
            {visible.map((integration) => {
              const copy = stateCopy[integration.state];
              const Icon = copy.icon;
              return (
                <div
                  key={integration.id}
                  className="flex flex-col gap-4 p-4 transition-colors hover:bg-page/[0.42] sm:p-5 xl:grid xl:items-center"
                  style={{ gridTemplateColumns: integrationGridTemplateColumns }}
                >
                  <div className="flex min-w-0 gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-tint text-brand-strong">
                      <PlugZap className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-[14px] font-extrabold text-ink">
                          {integration.name}
                        </p>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-extrabold",
                            copy.className,
                          )}
                        >
                          <Icon className="size-3" />
                          {copy.label}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                        {integration.description}
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-3 xl:hidden">
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-text">
                            Escopo
                          </p>
                          <p className="mt-1 text-[12px] font-bold text-ink">{integration.scope}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-text">
                            Atualização
                          </p>
                          <p className="mt-1 text-[12px] font-bold text-ink">
                            {integration.lastSync}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-text">{integration.records}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-text">
                      Escopo
                    </p>
                    <p className="mt-1 text-[12px] font-bold text-ink">{integration.scope}</p>
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-text">
                      Atualização
                    </p>
                    <p className="mt-1 text-[12px] font-bold text-ink">{integration.lastSync}</p>
                    <p className="mt-1 text-[10px] text-slate-text">{integration.records}</p>
                  </div>
                  <div className="flex items-center gap-2 xl:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelected(integration)}
                      className="min-h-11"
                    >
                      Gerenciar
                    </Button>
                    {integration.state !== "active" ? (
                      <Button
                        type="button"
                        size="sm"
                        disabled={connecting === integration.id}
                        onClick={() => connect(integration)}
                        className="min-h-11 bg-[#18B849] text-white hover:bg-[#139e3e]"
                      >
                        {connecting === integration.id ? "Testando" : "Conectar"}
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <InternalPageState
              state="empty"
              title="Nenhuma integração encontrada"
              description="Tente outro termo ou limpe a busca para ver todas as fontes disponíveis."
            />
          </div>
        )}
      </Panel>
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel className="p-4 sm:p-5">
          <PanelHeader
            icon={<ShieldCheck className="size-4" />}
            title="Segurança e permissões"
            subtitle="Administre acessos por fonte sem revelar segredos em telas de consulta."
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Info
              title="Acesso administrativo"
              description="Somente administradores podem conectar, pausar ou remover uma fonte."
              icon={ShieldCheck}
            />
            <Info
              title="Origem identificada"
              description="Busca, Raio-X e Score exibem data e fonte de cada informação."
              icon={Clock3}
            />
          </div>
        </Panel>
        <Panel className="p-4 sm:p-5">
          <PanelHeader
            icon={<Wifi className="size-4" />}
            title="Quando uma fonte falhar"
            subtitle="A operação não perde contexto: o último dado válido permanece identificado."
          />
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-[12px] font-extrabold text-amber-800">
              Licitanet precisa de atenção
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800">
              A última leitura falhou. Revise a credencial ou teste a conexão antes de usar esse
              dado como atual.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelected(integrations[2]!)}
              className="mt-3 border-amber-200 bg-white text-amber-800"
            >
              Revisar conexão
            </Button>
          </div>
        </Panel>
      </div>
      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-hairline p-5 sm:max-w-md"
        >
          <SheetHeader>
            <SheetTitle>{selected?.name ?? "Integração"}</SheetTitle>
            <SheetDescription>{selected?.description}</SheetDescription>
          </SheetHeader>
          {selected ? (
            <div className="mt-6 space-y-5">
              <div className="rounded-xl border border-hairline bg-page/45 p-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                  Estado da conexão
                </p>
                <p className="mt-2 text-[16px] font-extrabold text-ink">
                  {stateCopy[selected.state].label}
                </p>
                <p className="mt-1 text-[12px] text-slate-text">
                  Última leitura: {selected.lastSync}
                </p>
              </div>
              <div>
                <p className="text-[12px] font-extrabold text-ink">Etapas de gestão</p>
                <ol className="mt-3 space-y-3">
                  {[
                    "Revisar autorização e escopo",
                    "Testar comunicação com a fonte",
                    "Confirmar dados recebidos",
                  ].map((step, index) => (
                    <li key={step} className="flex gap-3 text-[12px] text-slate-text">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-tint text-[10px] font-extrabold text-brand-strong">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <Button
                type="button"
                onClick={() => connect(selected)}
                disabled={connecting === selected.id}
                className="w-full bg-[#18B849] text-white hover:bg-[#139e3e]"
              >
                {connecting === selected.id ? "Testando conexão…" : "Testar conexão"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  toast.info("Conexão pausada", {
                    description: "Nenhuma nova leitura será iniciada até você reativar a fonte.",
                  })
                }
              >
                <Unplug className="size-4" /> Pausar integração
              </Button>
              <a
                href="https://www.gov.br/compras"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-[12px] font-extrabold text-brand-strong"
              >
                Abrir portal da fonte <ExternalLink className="size-4" />
              </a>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function IntegrationMetric({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "green" | "blue" | "amber";
}) {
  const colors = {
    green: "bg-brand-tint text-brand-strong",
    blue: "bg-[#EEF4FF] text-[#3269D8]",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <Panel className="p-4 sm:p-5">
      <span className={cn("grid size-9 place-items-center rounded-xl", colors[tone])}>
        <PlugZap className="size-4" />
      </span>
      <p className="mt-3 text-[11px] font-bold text-slate-text">{label}</p>
      <p className="mt-1 text-[22px] font-extrabold tracking-[-0.03em] text-ink">{value}</p>
      <p className="mt-1 text-[11px] text-slate-text">{detail}</p>
    </Panel>
  );
}

function Info({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof ShieldCheck;
}) {
  return (
    <div className="rounded-xl border border-hairline p-3">
      <Icon className="size-4 text-brand-strong" />
      <p className="mt-2 text-[12px] font-extrabold text-ink">{title}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-text">{description}</p>
    </div>
  );
}
