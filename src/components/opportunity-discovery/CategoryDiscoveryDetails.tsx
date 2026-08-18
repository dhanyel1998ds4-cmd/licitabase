import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BellRing,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dash2/Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type StateSummary = { id: string; name: string; opportunities: number; potential: string };

type CategoryDiscovery = {
  name: string;
  description: string;
  terms: string[];
  monthlyMatches: number;
  potential: string;
  states: StateSummary[];
};

const categories: Record<string, CategoryDiscovery> = {
  ti: {
    name: "Equipamentos de TI",
    description:
      "Oportunidades de computadores, monitores, periféricos e infraestrutura para a operação.",
    terms: ["notebook", "monitor", "SSD", "computador"],
    monthlyMatches: 86,
    potential: "R$ 4,8 mi",
    states: [
      { id: "mg", name: "Minas Gerais", opportunities: 31, potential: "R$ 1,9 mi" },
      { id: "sp", name: "São Paulo", opportunities: 24, potential: "R$ 1,5 mi" },
      { id: "go", name: "Goiás", opportunities: 12, potential: "R$ 642 mil" },
      { id: "pr", name: "Paraná", opportunities: 8, potential: "R$ 410 mil" },
      { id: "rj", name: "Rio de Janeiro", opportunities: 6, potential: "R$ 226 mil" },
      { id: "df", name: "Distrito Federal", opportunities: 5, potential: "R$ 182 mil" },
    ],
  },
  servicos: {
    name: "Serviços de tecnologia",
    description: "Demandas por software, sustentação, nuvem e transformação digital.",
    terms: ["software", "desenvolvimento", "suporte técnico"],
    monthlyMatches: 34,
    potential: "R$ 3,2 mi",
    states: [
      { id: "mg", name: "Minas Gerais", opportunities: 14, potential: "R$ 1,1 mi" },
      { id: "sp", name: "São Paulo", opportunities: 9, potential: "R$ 894 mil" },
      { id: "go", name: "Goiás", opportunities: 6, potential: "R$ 522 mil" },
      { id: "df", name: "Distrito Federal", opportunities: 5, potential: "R$ 371 mil" },
    ],
  },
  escritorio: {
    name: "Material de escritório",
    description: "Itens de expediente, mobiliário e suprimentos para ambientes corporativos.",
    terms: ["material de expediente", "mobiliário"],
    monthlyMatches: 12,
    potential: "R$ 570 mil",
    states: [
      { id: "mg", name: "Minas Gerais", opportunities: 7, potential: "R$ 312 mil" },
      { id: "sp", name: "São Paulo", opportunities: 3, potential: "R$ 181 mil" },
      { id: "go", name: "Goiás", opportunities: 2, potential: "R$ 77 mil" },
    ],
  },
};

const fallbackCategory = categories["ti"]!;

const itemTemplates = [
  {
    id: "pe-845-2026",
    title:
      "Aquisição de monitores, notebooks e computadores para modernização das unidades administrativas",
    organization: "Prefeitura Municipal de Guarulhos — SP",
    value: "R$ 428.496,67",
    deadline: "Propostas até hoje, 17h",
    match: "92% de aderência",
  },
  {
    id: "pe-310-2026",
    title: "Registro de preços para equipamentos de informática e periféricos de uso institucional",
    organization: "ESP — Centro de Energia Nuclear na Agricultura",
    value: "R$ 86.045,45",
    deadline: "Propostas até amanhã, 10h",
    match: "87% de aderência",
  },
  {
    id: "pe-077-2026",
    title:
      "Fornecimento de estações de trabalho, telas e acessórios para novos postos de atendimento",
    organization: "Vitória Câmara Municipal",
    value: "R$ 697.106,40",
    deadline: "Encerra em 3 dias",
    match: "81% de aderência",
  },
  {
    id: "pe-845-2026",
    title: "Aquisição parcelada de equipamentos para laboratórios e salas técnicas",
    organization: "Fundação de Apoio à Pesquisa do Estado de São Paulo",
    value: "R$ 184.900,00",
    deadline: "Propostas até 26 ago, 14h",
    match: "76% de aderência",
  },
];

function getCategory(categoryId: string) {
  return categories[categoryId] ?? fallbackCategory;
}

function Metric({
  label,
  value,
  detail,
  icon,
  accent = "green",
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  accent?: "green" | "blue" | "amber";
}) {
  const accents = {
    green: "bg-[#E8F8ED] text-[#15863a]",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span className={cn("grid size-8 place-items-center rounded-lg", accents[accent])}>
          {icon}
        </span>
        <p className="text-[11.5px] font-bold text-ink">{label}</p>
      </div>
      <p className="mt-3 text-[24px] font-extrabold leading-none tracking-[-0.025em] tabular-nums text-ink">
        {value}
      </p>
      <p className="mt-2 text-[10.5px] text-slate-text">{detail}</p>
    </Panel>
  );
}

export function CategoryDiscoveryPage({ categoryId }: { categoryId: string }) {
  const category = getCategory(categoryId);

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            to="/categorias"
            className="inline-flex min-h-9 items-center gap-1.5 text-[11px] font-bold text-slate-text hover:text-brand-strong"
          >
            <ArrowLeft className="size-3.5" />
            Categorias de interesse
          </Link>
          <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
            Inteligência da operação
          </p>
          <h1 className="mt-1 text-[24px] font-extrabold tracking-[-0.025em] text-ink sm:text-[28px]">
            Oportunidades em {category.name}
          </h1>
          <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-slate-text">
            {category.description} Escolha uma região para revisar apenas os editais compatíveis.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            toast.success("Alerta testado", {
              description: "A próxima oportunidade compatível será enviada.",
            })
          }
          className="min-h-11 rounded-xl border-hairline text-[12px] font-extrabold"
        >
          <BellRing className="size-4 text-brand-strong" />
          Testar alerta
        </Button>
      </header>

      <div className="grid gap-3 min-[480px]:grid-cols-3 sm:gap-4">
        <Metric
          label="Oportunidades no mês"
          value={String(category.monthlyMatches)}
          detail="com os seus critérios"
          icon={<Sparkles className="size-4" />}
        />
        <Metric
          label="Potencial estimado"
          value={category.potential}
          detail="somando os editais ativos"
          icon={<CircleDollarSign className="size-4" />}
          accent="blue"
        />
        <Metric
          label="Regiões acompanhadas"
          value={String(category.states.length)}
          detail="com oportunidades recentes"
          icon={<MapPin className="size-4" />}
          accent="amber"
        />
      </div>

      <Panel className="overflow-hidden">
        <div className="border-b border-hairline p-4 sm:p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
            Por região
          </p>
          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[17px] font-extrabold text-ink">
                Onde você quer procurar agora?
              </h2>
              <p className="mt-1 text-[12px] text-slate-text">
                Cada região preserva os mesmos termos e sua configuração de alertas.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F8ED] px-2.5 py-1.5 text-[10.5px] font-extrabold text-[#15863a]">
              <TrendingUp className="size-3.5" />
              Atualizado há 8 min
            </span>
          </div>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
          {category.states.map((state) => (
            <Link
              key={state.id}
              to="/categorias/$categoryId/estado/$stateId"
              params={{ categoryId, stateId: state.id }}
              className="group rounded-xl border border-hairline bg-[#FBFDFC] p-3.5 transition-colors hover:border-[#29C454]/50 hover:bg-[#F4FCF6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-[#E8F8ED] text-[#15863a]">
                  <MapPin className="size-4" />
                </span>
                <ChevronRight className="mt-1 size-4 text-slate-text transition-transform group-hover:translate-x-0.5 group-hover:text-brand-strong" />
              </div>
              <p className="mt-3 text-[13px] font-extrabold text-ink">{state.name}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[20px] font-extrabold leading-none tabular-nums text-[#15863a]">
                    {state.opportunities}
                  </p>
                  <p className="mt-1 text-[10.5px] text-slate-text">oportunidades</p>
                </div>
                <p className="text-right text-[11px] font-extrabold tabular-nums text-ink">
                  {state.potential}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-hairline p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
              Amostra recente
            </p>
            <h2 className="mt-1 text-[17px] font-extrabold text-ink">Oportunidades compatíveis</h2>
          </div>
          <Link
            to="/dash2/licitacoes/buscar"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-hairline px-3 text-[11px] font-extrabold text-ink hover:bg-slate-50"
          >
            <Search className="size-4" />
            Abrir busca avançada
          </Link>
        </div>
        <div className="divide-y divide-hairline">
          {itemTemplates.slice(0, 3).map((item) => (
            <OpportunityRow key={`${item.id}-${item.title}`} item={item} />
          ))}
        </div>
      </Panel>
    </>
  );
}

export function CategoryStateResultsPage({
  categoryId,
  stateId,
}: {
  categoryId: string;
  stateId: string;
}) {
  const category = getCategory(categoryId);
  const state = category.states.find((item) => item.id === stateId) ?? category.states[0]!;
  const [query, setQuery] = useState("");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const visibleItems = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    return itemTemplates.filter(
      (item, index) =>
        (!term || `${item.title} ${item.organization}`.toLocaleLowerCase("pt-BR").includes(term)) &&
        (!urgentOnly || index < 2),
    );
  }, [query, urgentOnly]);

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            to="/categorias/$categoryId"
            params={{ categoryId }}
            className="inline-flex min-h-9 items-center gap-1.5 text-[11px] font-bold text-slate-text hover:text-brand-strong"
          >
            <ArrowLeft className="size-3.5" />
            {category.name}
          </Link>
          <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
            Região selecionada
          </p>
          <h1 className="mt-1 text-[24px] font-extrabold tracking-[-0.025em] text-ink sm:text-[28px]">
            {category.name} em {state.name}
          </h1>
          <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-slate-text">
            Editais que combinam com os seus termos, prioridade e região de atendimento.
          </p>
        </div>
        <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#E8F8ED] px-3 text-[11px] font-extrabold text-[#15863a]">
          <MapPin className="size-4" />
          {state.name}
        </span>
      </header>

      <div className="grid gap-3 min-[480px]:grid-cols-3 sm:gap-4">
        <Metric
          label="Compatíveis agora"
          value={String(state.opportunities)}
          detail="publicadas ou atualizadas recentemente"
          icon={<Sparkles className="size-4" />}
        />
        <Metric
          label="Potencial da região"
          value={state.potential}
          detail="valor estimado dos editais"
          icon={<CircleDollarSign className="size-4" />}
          accent="blue"
        />
        <Metric
          label="Prazo prioritário"
          value="2"
          detail="encerram nas próximas 24 horas"
          icon={<CalendarDays className="size-4" />}
          accent="amber"
        />
      </div>

      <Panel className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-hairline p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
              Editais compatíveis
            </p>
            <h2 className="mt-1 text-[17px] font-extrabold text-ink">
              Priorize o que merece sua análise
            </h2>
          </div>
          <div className="flex flex-col gap-2 min-[480px]:flex-row">
            <label className="relative min-w-0 min-[480px]:w-72">
              <span className="sr-only">Buscar nas oportunidades</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-text" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar edital ou órgão"
                className="min-h-11 rounded-xl border-hairline pl-9 text-[12px]"
              />
            </label>
            <Button
              type="button"
              variant="outline"
              aria-pressed={urgentOnly}
              onClick={() => setUrgentOnly((current) => !current)}
              className={cn(
                "min-h-11 rounded-xl border-hairline text-[11px] font-extrabold",
                urgentOnly && "border-[#29C454] bg-[#E8F8ED] text-[#15863a]",
              )}
            >
              <SlidersHorizontal className="size-4" />
              {urgentOnly ? "Somente urgentes" : "Filtrar urgentes"}
            </Button>
          </div>
        </div>
        <div className="divide-y divide-hairline">
          {visibleItems.map((item) => (
            <OpportunityRow key={`${item.id}-${item.title}`} item={item} stateName={state.name} />
          ))}
        </div>
        {visibleItems.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[14px] font-extrabold text-ink">Nenhum edital encontrado</p>
            <p className="mt-1 text-[12px] text-slate-text">
              Remova um filtro ou use outro termo para continuar.
            </p>
          </div>
        ) : null}
      </Panel>
    </>
  );
}

function OpportunityRow({
  item,
  stateName,
}: {
  item: (typeof itemTemplates)[number];
  stateName?: string;
}) {
  return (
    <article className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#E8F8ED] px-2 py-1 text-[10px] font-extrabold text-[#15863a]">
              {item.match}
            </span>
            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
              {item.deadline}
            </span>
          </div>
          <h3 className="mt-2 text-[14px] font-extrabold leading-snug text-ink">{item.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-text">
            <Building2 className="size-3.5 shrink-0" />
            {item.organization}
            {stateName ? ` · ${stateName}` : ""}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-text">
              Valor estimado
            </p>
            <p className="mt-1 whitespace-nowrap text-[14px] font-extrabold tabular-nums text-ink">
              {item.value}
            </p>
          </div>
          <Link
            to="/dash2/licitacoes/$licitacaoId"
            params={{ licitacaoId: item.id }}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-hairline px-3 text-[11px] font-extrabold text-ink hover:border-[#29C454]/45 hover:bg-[#F4FCF6] hover:text-[#15863a]"
          >
            Abrir
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
