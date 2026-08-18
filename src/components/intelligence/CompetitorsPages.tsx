import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Filter,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { PageContextHeader } from "@/components/dash2/PageContextHeader";
import { PageHowItWorks } from "@/components/dash2/PageHowItWorks";
import { InternalPageState } from "@/components/dash2/InternalPageState";
import { Panel } from "@/components/dash2/Panel";
import { useResizableColumns } from "@/components/dash2/ResizableColumns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Competitor = {
  id: string;
  name: string;
  document: string;
  size: "ME" | "EPP" | "Demais";
  wins: number;
  value: number;
  latestWin: string;
  movement: number;
  states: string[];
  categories: string[];
  discount: number;
  items: { name: string; count: number; value: number }[];
};

type Category = {
  id: string;
  name: string;
  description: string;
  companies: number;
  value: string;
  trend: string;
};

type InsightMetric = {
  label: string;
  value: string;
  Icon: LucideIcon;
  description: string;
};

const competitorRankingColumns = [
  { id: "size", width: 90, min: 72, max: 150 },
  { id: "wins", width: 110, min: 90, max: 180 },
  { id: "value", width: 138, min: 112, max: 250 },
  { id: "movement", width: 138, min: 112, max: 240 },
  { id: "action", width: 36, min: 32, max: 72 },
];

const categories: Category[] = [
  {
    id: "aquisicao-licencas",
    name: "Aquisição de licenças",
    description: "Softwares, licenças e direitos de uso.",
    companies: 493,
    value: "R$ 1,2 bi",
    trend: "+18%",
  },
  {
    id: "servicos-ti",
    name: "Serviços de TI",
    description: "Desenvolvimento, suporte e sustentação.",
    companies: 385,
    value: "R$ 947 mi",
    trend: "+12%",
  },
  {
    id: "equipamentos-ti",
    name: "Equipamentos de TI",
    description: "Computadores, redes e infraestrutura.",
    companies: 271,
    value: "R$ 816 mi",
    trend: "+9%",
  },
  {
    id: "manutencao-predial",
    name: "Manutenção predial",
    description: "Conservação, reparos e infraestrutura.",
    companies: 328,
    value: "R$ 724 mi",
    trend: "+7%",
  },
  {
    id: "construcao-civil",
    name: "Construção civil",
    description: "Obras, projetos e serviços técnicos.",
    companies: 442,
    value: "R$ 2,1 bi",
    trend: "+15%",
  },
  {
    id: "saude-medicamentos",
    name: "Saúde e medicamentos",
    description: "Medicamentos, materiais e assistência.",
    companies: 516,
    value: "R$ 1,8 bi",
    trend: "+10%",
  },
  {
    id: "veiculos-transporte",
    name: "Veículos e transporte",
    description: "Frotas, peças e mobilidade.",
    companies: 239,
    value: "R$ 639 mi",
    trend: "+6%",
  },
  {
    id: "educacao-capacitacao",
    name: "Educação e capacitação",
    description: "Cursos, treinamento e conteúdo.",
    companies: 164,
    value: "R$ 218 mi",
    trend: "+4%",
  },
  {
    id: "alimentacao-refeicao",
    name: "Alimentação e refeição",
    description: "Gêneros, refeições e serviços de alimentação.",
    companies: 213,
    value: "R$ 612 mi",
    trend: "+8%",
  },
  {
    id: "eventos-producoes-artisticas",
    name: "Eventos e produções artísticas",
    description: "Estrutura, cultura e produção de eventos.",
    companies: 146,
    value: "R$ 188 mi",
    trend: "+5%",
  },
  {
    id: "equipamentos-medico-hospitalares",
    name: "Equipamentos médico-hospitalares",
    description: "Aparelhos, insumos e infraestrutura assistencial.",
    companies: 307,
    value: "R$ 1,1 bi",
    trend: "+11%",
  },
  {
    id: "servicos-limpeza",
    name: "Serviços de limpeza",
    description: "Higienização, conservação e apoio operacional.",
    companies: 189,
    value: "R$ 356 mi",
    trend: "+6%",
  },
  {
    id: "energia-utilidades",
    name: "Energia e utilidades",
    description: "Energia, água, gás e serviços essenciais.",
    companies: 174,
    value: "R$ 534 mi",
    trend: "+9%",
  },
  {
    id: "consultoria",
    name: "Consultoria",
    description: "Assessoria especializada e projetos técnicos.",
    companies: 162,
    value: "R$ 408 mi",
    trend: "+7%",
  },
  {
    id: "material-escritorio",
    name: "Material de escritório",
    description: "Expediente, papelaria e suprimentos administrativos.",
    companies: 141,
    value: "R$ 219 mi",
    trend: "+3%",
  },
  {
    id: "mobiliario",
    name: "Mobiliário",
    description: "Móveis corporativos, escolares e hospitalares.",
    companies: 127,
    value: "R$ 247 mi",
    trend: "+4%",
  },
  {
    id: "meio-ambiente-sustentabilidade",
    name: "Meio ambiente e sustentabilidade",
    description: "Gestão ambiental, resíduos e soluções sustentáveis.",
    companies: 118,
    value: "R$ 286 mi",
    trend: "+8%",
  },
  {
    id: "agropecuaria-insumos-rurais",
    name: "Agropecuária e insumos rurais",
    description: "Insumos, equipamentos e serviços do campo.",
    companies: 109,
    value: "R$ 201 mi",
    trend: "+5%",
  },
  {
    id: "telecomunicacoes",
    name: "Telecomunicações",
    description: "Conectividade, links, telefonia e equipamentos.",
    companies: 98,
    value: "R$ 331 mi",
    trend: "+6%",
  },
  {
    id: "vigilancia-seguranca",
    name: "Vigilância e segurança",
    description: "Monitoramento, vigilância patrimonial e controle.",
    companies: 93,
    value: "R$ 274 mi",
    trend: "+4%",
  },
  {
    id: "combustiveis-lubrificantes",
    name: "Combustíveis e lubrificantes",
    description: "Abastecimento de frota, óleos e derivados.",
    companies: 86,
    value: "R$ 518 mi",
    trend: "+2%",
  },
  {
    id: "desenvolvimento-software",
    name: "Desenvolvimento de software",
    description: "Produtos digitais, sistemas e evolução tecnológica.",
    companies: 154,
    value: "R$ 462 mi",
    trend: "+13%",
  },
];

const competitors: Competitor[] = [
  {
    id: "niva-tecnologia",
    name: "Niva Tecnologia da Informação Ltda",
    document: "09.053.350/0001-90",
    size: "Demais",
    wins: 38,
    value: 38_495_911,
    latestWin: "18 ago 2026",
    movement: 3,
    states: ["SP", "MG", "PR"],
    categories: ["Aquisição de licenças", "Serviços de TI"],
    discount: 12.4,
    items: [
      { name: "Licenciamento Microsoft e Azure", count: 17, value: 18_131_131 },
      { name: "SaaS e sustentação", count: 10, value: 5_034_506 },
      { name: "Consultoria TIC", count: 6, value: 1_890_000 },
    ],
  },
  {
    id: "govfacil",
    name: "GovFácil Gestão & Tecnologia Ltda",
    document: "41.886.613/0001-55",
    size: "ME",
    wins: 26,
    value: 37_920_697,
    latestWin: "13 ago 2026",
    movement: 7,
    states: ["SP", "GO"],
    categories: ["Aquisição de licenças", "Educação e capacitação"],
    discount: 9.8,
    items: [
      { name: "Sistemas de gestão pública", count: 12, value: 14_654_100 },
      { name: "Treinamento de usuários", count: 8, value: 6_310_482 },
    ],
  },
  {
    id: "brasofware",
    name: "Brasoftware Informática Ltda",
    document: "57.142.978/0001-05",
    size: "Demais",
    wins: 7,
    value: 24_328_088,
    latestWin: "21 abr 2026",
    movement: 2,
    states: ["SP", "MG", "RJ", "DF"],
    categories: ["Aquisição de licenças", "Equipamentos de TI"],
    discount: 10.5,
    items: [
      { name: "Licenciamento de direitos permanentes", count: 17, value: 18_131_131 },
      { name: "Software como serviço — SaaS", count: 10, value: 5_034_506 },
      { name: "Curso profissionalizante", count: 8, value: 206_564 },
    ],
  },
  {
    id: "columbia-storage",
    name: "Columbia Storage Integração de Sistemas Ltda",
    document: "58.652.678/0001-39",
    size: "Demais",
    wins: 19,
    value: 30_897_971,
    latestWin: "07 abr 2026",
    movement: -1,
    states: ["SP", "RS"],
    categories: ["Equipamentos de TI", "Serviços de TI"],
    discount: 8.1,
    items: [
      { name: "Armazenamento e backup", count: 11, value: 14_960_000 },
      { name: "Infraestrutura de rede", count: 6, value: 7_800_000 },
    ],
  },
  {
    id: "prodesp",
    name: "Companhia de Processamento de Dados do Estado de São Paulo",
    document: "62.577.929/0001-35",
    size: "Demais",
    wins: 38,
    value: 19_978_082,
    latestWin: "20 maio 2026",
    movement: 5,
    states: ["SP"],
    categories: ["Serviços de TI", "Aquisição de licenças"],
    discount: 6.4,
    items: [
      { name: "Sustentação de plataformas", count: 22, value: 12_600_000 },
      { name: "Serviços de dados", count: 9, value: 4_200_000 },
    ],
  },
  {
    id: "extreme-digital",
    name: "Extreme Digital Consultoria e Representações Ltda",
    document: "14.139.773/0001-68",
    size: "EPP",
    wins: 14,
    value: 14_680_000,
    latestWin: "14 abr 2026",
    movement: 4,
    states: ["DF", "MG"],
    categories: ["Serviços de TI", "Aquisição de licenças"],
    discount: 11.7,
    items: [
      { name: "Desenvolvimento de software", count: 8, value: 8_900_000 },
      { name: "Licenças corporativas", count: 5, value: 3_400_000 },
    ],
  },
];

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function categoryFromId(id: string) {
  return categories.find((category) => category.id === id) ?? categories[0]!;
}

function CompanyLogo({ name }: { name: string }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-tint text-[12px] font-extrabold text-brand-strong">
      {name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")}
    </span>
  );
}

export function CompetitorsHomePage() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase("pt-BR");
  const suggestedCompanies = competitors
    .filter((company) =>
      `${company.name} ${company.document}`.toLocaleLowerCase("pt-BR").includes(normalized),
    )
    .slice(0, 3);
  const visibleCategories = categories.filter((category) =>
    `${category.name} ${category.description}`.toLocaleLowerCase("pt-BR").includes(normalized),
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageContextHeader
        context="intelligence"
        title="Concorrentes"
        description="Entenda quem vence, em quais categorias e onde sua operação pode reagir melhor."
      />
      <PageHowItWorks
        title="Encontre padrões antes de reagir à concorrência"
        description="Comece por uma categoria ou empresa para transformar vitórias públicas em contexto comercial para a sua operação."
        steps={[
          {
            title: "Escolha um recorte",
            description: "Pesquise uma empresa ou selecione a categoria que deseja acompanhar.",
          },
          {
            title: "Leia o ranking",
            description: "Compare vitórias, valores e movimentos dos fornecedores relevantes.",
          },
          {
            title: "Monitore o perfil",
            description:
              "Abra uma empresa para acompanhar novos sinais e oportunidades relacionadas.",
          },
        ]}
      />
      <Panel className="overflow-hidden">
        <div className="border-b border-hairline bg-[linear-gradient(135deg,rgba(232,250,238,0.82),rgba(255,255,255,0.96))] p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
                Mapa competitivo
              </p>
              <h2 className="mt-1 text-[19px] font-extrabold tracking-[-0.025em] text-ink">
                Comece pela categoria ou por uma empresa
              </h2>
              <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-slate-text">
                A escolha abre um ranking com contexto, não apenas uma lista de fornecedores.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-text">
              <CalendarDays className="size-3.5" />
              Atualizado hoje, 09:40
            </span>
          </div>
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-text" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busque uma empresa, CNPJ ou categoria"
              className="h-12 rounded-xl border-hairline bg-white pl-10 text-[13px] shadow-none"
              aria-label="Buscar empresa, CNPJ ou categoria"
            />
          </div>
        </div>
        {normalized && suggestedCompanies.length ? (
          <div className="border-b border-hairline p-3 sm:p-4">
            <p className="px-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-text">
              Empresas encontradas
            </p>
            <div className="mt-2 grid gap-2 lg:grid-cols-3">
              {suggestedCompanies.map((company) => (
                <Link
                  key={company.id}
                  to="/concorrentes/$categoryId/$companyId"
                  params={{ categoryId: "aquisicao-licencas", companyId: company.id }}
                  className="flex min-h-11 items-center gap-3 rounded-xl border border-hairline bg-white p-3 transition-colors hover:border-[#29C454]/35 hover:bg-brand-tint/30 focus-visible:outline-2 focus-visible:outline-[#29C454]"
                >
                  <CompanyLogo name={company.name} />
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] font-extrabold text-ink">
                      {company.name}
                    </span>
                    <span className="block text-[10px] text-slate-text">{company.document}</span>
                  </span>
                  <ChevronRight className="ml-auto size-4 text-slate-text" />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-extrabold text-ink">Categorias para explorar</h2>
              <p className="mt-1 text-[12px] text-slate-text">
                Selecione uma área para abrir o ranking de fornecedores.
              </p>
            </div>
            <span className="hidden rounded-full bg-page px-2.5 py-1 text-[10px] font-bold text-slate-text sm:inline">
              {visibleCategories.length} de {categories.length}
            </span>
          </div>
          {visibleCategories.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {visibleCategories.map((category) => (
                <Link
                  key={category.id}
                  to="/concorrentes/$categoryId"
                  params={{ categoryId: category.id }}
                  className="group rounded-2xl border border-hairline bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-[#29C454]/35 hover:shadow-[0_8px_22px_rgba(24,184,73,0.10)] focus-visible:outline-2 focus-visible:outline-[#29C454]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-brand-tint text-brand-strong">
                      <Trophy className="size-[18px]" />
                    </span>
                    <span className="rounded-full bg-[#EEF4FF] px-2 py-1 text-[10px] font-extrabold text-[#2455B6]">
                      {category.trend}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[14px] font-extrabold text-ink">{category.name}</h3>
                  <p className="mt-1 min-h-9 text-[11px] leading-relaxed text-slate-text">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-[11px]">
                    <span className="font-bold text-slate-text">{category.companies} empresas</span>
                    <span className="font-extrabold text-brand-strong">
                      {category.value} <ArrowRight className="ml-1 inline size-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <InternalPageState
              state="empty"
              title="Nenhuma categoria encontrada"
              description="Tente outro termo ou procure diretamente pelo CNPJ da empresa."
              className="mt-4"
            />
          )}
        </div>
      </Panel>
    </div>
  );
}

export function CompetitorRankingPage({ categoryId }: { categoryId: string }) {
  const category = categoryFromId(categoryId);
  const [period, setPeriod] = useState("90");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<"value" | "wins" | "growth">("value");
  const { gridTemplateColumns: rankingGridTemplateColumns, getResizeHandleProps } =
    useResizableColumns({
      storageKey: "licitabase.competitors-ranking-widths.v1",
      columns: competitorRankingColumns,
      leadingColumn: "52px minmax(220px, 1fr)",
    });
  const [stateFilter, setStateFilter] = useState<string | null>(null);
  const [onlyGrowing, setOnlyGrowing] = useState(false);
  const ordered = useMemo(
    () =>
      competitors
        .filter((company) => !stateFilter || company.states.includes(stateFilter))
        .filter((company) => !onlyGrowing || company.movement > 0)
        .sort((a, b) =>
          sort === "wins"
            ? b.wins - a.wins
            : sort === "growth"
              ? b.movement - a.movement
              : b.value - a.value,
        ),
    [onlyGrowing, sort, stateFilter],
  );
  return (
    <div className="space-y-5 sm:space-y-6">
      <PageContextHeader
        context="intelligence"
        title={`Ranking · ${category.name}`}
        description="Compare fornecedores vencedores e abra o perfil certo sem perder o recorte da categoria."
        actions={
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="min-h-11 border-hairline bg-white text-[12px] font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Últimos 12 meses</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setFilterOpen(true)}
              className="border-hairline text-[12px] font-bold"
            >
              <Filter className="size-4" />
              Filtros
            </Button>
          </div>
        }
      />
      <PageHowItWorks
        title="Compare fornecedores dentro da mesma disputa"
        description="Use período, estado e ordenação para separar presença recorrente de resultado pontual antes de abrir o perfil de uma empresa."
        steps={[
          {
            title: "Ajuste o período",
            description: "Defina a janela que torna a comparação relevante.",
          },
          {
            title: "Ordene o ranking",
            description: "Priorize vitórias, valor homologado ou crescimento.",
          },
          {
            title: "Abra o perfil",
            description: "Confira itens fornecidos e histórico antes de monitorar.",
          },
        ]}
      />
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {(
          [
            {
              label: "Fornecedores ativos",
              value: `${category.companies}`,
              Icon: Building2,
              description: "no recorte selecionado",
            },
            {
              label: "Valor homologado",
              value: category.value,
              Icon: CircleDollarSign,
              description: "nas vitórias consultadas",
            },
            {
              label: "Maior avanço",
              value: "+7 posições",
              Icon: TrendingUp,
              description: "nos últimos 90 dias",
            },
          ] satisfies InsightMetric[]
        ).map(({ label, value, Icon: MetricIcon, description }) => {
          return (
            <Panel key={String(label)} className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-brand-tint text-brand-strong">
                  <MetricIcon className="size-[18px]" />
                </span>
                <p className="text-[12px] font-extrabold text-ink">{label}</p>
              </div>
              <p className="mt-4 text-[24px] font-extrabold tracking-[-0.03em] text-ink">{value}</p>
              <p className="mt-1 text-[11px] text-slate-text">{description}</p>
            </Panel>
          );
        })}
      </div>
      <Panel className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-hairline p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
              {category.name}
            </p>
            <h2 className="mt-1 text-[18px] font-extrabold text-ink">Quem está vencendo agora</h2>
          </div>
          <Tabs value={sort} onValueChange={(value) => setSort(value as typeof sort)}>
            <TabsList className="h-10 rounded-xl border border-hairline bg-page/60 p-1">
              <TabsTrigger value="value" className="min-h-8 text-[10px] font-bold">
                Maior valor
              </TabsTrigger>
              <TabsTrigger value="wins" className="min-h-8 text-[10px] font-bold">
                Vitórias
              </TabsTrigger>
              <TabsTrigger value="growth" className="min-h-8 text-[10px] font-bold">
                Em alta
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="hidden min-w-0 xl:block">
          <div
            className="grid gap-3 border-b border-hairline bg-page/45 px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.07em] text-slate-text"
            style={{ gridTemplateColumns: rankingGridTemplateColumns }}
          >
            <span>#</span>
            <span className="relative">
              Empresa
              <button
                {...getResizeHandleProps("size")}
                aria-label="Redimensionar largura da coluna Porte"
              />
            </span>
            <span className="relative">
              Porte
              <button
                {...getResizeHandleProps("wins")}
                aria-label="Redimensionar largura da coluna Vitórias"
              />
            </span>
            <span className="relative text-right">
              Vitórias
              <button
                {...getResizeHandleProps("value")}
                aria-label="Redimensionar largura da coluna Valor"
              />
            </span>
            <span className="relative text-right">
              Valor
              <button
                {...getResizeHandleProps("movement")}
                aria-label="Redimensionar largura da coluna Movimento"
              />
            </span>
            <span className="relative text-right">
              Movimento
              <button
                {...getResizeHandleProps("action")}
                aria-label="Redimensionar largura da coluna Ações"
              />
            </span>
            <span />
          </div>
          {ordered.map((company, index) => (
            <Link
              key={company.id}
              to="/concorrentes/$categoryId/$companyId"
              params={{ categoryId, companyId: company.id }}
              className="grid items-center gap-3 border-b border-hairline px-5 py-4 transition-colors hover:bg-brand-tint/25 focus-visible:outline-2 focus-visible:outline-[#29C454]"
              style={{ gridTemplateColumns: rankingGridTemplateColumns }}
            >
              <span
                className={cn(
                  "text-[14px] font-extrabold",
                  index < 3 ? "text-brand-strong" : "text-ink",
                )}
              >
                {index + 1}
              </span>
              <span className="flex min-w-0 items-center gap-3">
                <CompanyLogo name={company.name} />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-extrabold text-ink">
                    {company.name}
                  </span>
                  <span className="block text-[10px] text-slate-text">{company.document}</span>
                </span>
              </span>
              <span className="w-fit rounded-full bg-page px-2 py-1 text-[10px] font-bold text-slate-text">
                {company.size}
              </span>
              <span className="text-right text-[13px] font-extrabold text-ink">{company.wins}</span>
              <span className="text-right text-[12px] font-extrabold text-brand-strong">
                {currency.format(company.value)}
              </span>
              <span
                className={cn(
                  "flex justify-end gap-1 text-[11px] font-bold",
                  company.movement >= 0 ? "text-brand-strong" : "text-rose-600",
                )}
              >
                {company.movement >= 0 ? (
                  <TrendingUp className="size-3.5" />
                ) : (
                  <TrendingDown className="size-3.5" />
                )}
                {company.movement >= 0 ? "+" : ""}
                {company.movement} posições
              </span>
              <ChevronRight className="size-4 text-slate-text" />
            </Link>
          ))}
        </div>
        <div className="divide-y divide-hairline xl:hidden">
          {ordered.map((company, index) => (
            <Link
              key={company.id}
              to="/concorrentes/$categoryId/$companyId"
              params={{ categoryId, companyId: company.id }}
              className="block p-4 transition-colors hover:bg-brand-tint/25 focus-visible:outline-2 focus-visible:outline-[#29C454]"
            >
              <div className="flex items-start gap-3">
                <span className="mt-2 text-[14px] font-extrabold text-brand-strong">
                  {index + 1}
                </span>
                <CompanyLogo name={company.name} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-extrabold text-ink">{company.name}</span>
                  <span className="mt-0.5 block text-[10px] text-slate-text">
                    {company.document} · {company.size}
                  </span>
                  <span className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                    <span>
                      <b className="block text-[13px] text-ink">{company.wins}</b>vitórias
                    </span>
                    <span>
                      <b className="block truncate text-[12px] text-brand-strong">
                        {currency.format(company.value)}
                      </b>
                      valor
                    </span>
                    <span>
                      <b
                        className={cn(
                          "block text-[13px]",
                          company.movement >= 0 ? "text-brand-strong" : "text-rose-600",
                        )}
                      >
                        {company.movement >= 0 ? "+" : ""}
                        {company.movement}
                      </b>
                      posições
                    </span>
                  </span>
                </span>
                <ChevronRight className="mt-3 size-4 text-slate-text" />
              </div>
            </Link>
          ))}
        </div>
      </Panel>
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent className="w-full max-w-none bg-white sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Refinar ranking</SheetTitle>
            <SheetDescription>
              Os filtros afetam somente esta categoria e ficam preservados ao abrir uma empresa.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-[12px] font-extrabold text-ink">Presença por UF</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[null, "SP", "MG", "DF", "GO"].map((state) => {
                  const active = stateFilter === state;
                  return (
                    <button
                      key={state ?? "all"}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setStateFilter(state)}
                      className={cn(
                        "min-h-11 rounded-xl border px-3 text-[12px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-[#29C454]",
                        active
                          ? "border-[#29C454] bg-brand-tint text-brand-strong"
                          : "border-hairline bg-white text-slate-text hover:bg-page",
                      )}
                    >
                      {state ?? "Todas"}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              aria-pressed={onlyGrowing}
              onClick={() => setOnlyGrowing((current) => !current)}
              className={cn(
                "flex min-h-11 w-full items-center justify-between rounded-xl border px-3 text-left text-[12px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-[#29C454]",
                onlyGrowing
                  ? "border-[#29C454] bg-brand-tint text-brand-strong"
                  : "border-hairline bg-white text-ink hover:bg-page",
              )}
            >
              Mostrar apenas empresas em alta
              <TrendingUp className="size-4" />
            </button>
            <Button
              className="w-full bg-[#18B849] text-white hover:bg-[#139E3E]"
              onClick={() => {
                setFilterOpen(false);
                toast.success("Ranking atualizado", {
                  description: "O recorte está pronto para análise.",
                });
              }}
            >
              <Check className="size-4" />
              Aplicar filtros
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function CompetitorProfilePage({
  categoryId,
  companyId,
}: {
  categoryId: string;
  companyId: string;
}) {
  const category = categoryFromId(categoryId);
  const company = competitors.find((item) => item.id === companyId) ?? competitors[0]!;
  const [monitored, setMonitored] = useState(false);
  const [tab, setTab] = useState("overview");
  const history = Array.from({ length: 7 }, (_, index) => ({
    tender: `Aquisição e contratação de ${company.items[index % company.items.length]!.name.toLocaleLowerCase()}`,
    agency: [
      "Prefeitura Municipal de São Paulo",
      "Ministério da Saúde",
      "Tribunal de Contas do Estado",
      "Universidade Federal de Minas Gerais",
    ][index % 4]!,
    state: company.states[index % company.states.length]!,
    value: Math.round(company.value / (index + 7)),
    date: `${18 - index} ago 2026`,
  }));
  return (
    <div className="space-y-5 sm:space-y-6">
      <Link
        to="/concorrentes/$categoryId"
        params={{ categoryId }}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-[12px] font-bold text-slate-text transition-colors hover:bg-page hover:text-ink focus-visible:outline-2 focus-visible:outline-[#29C454]"
      >
        <ArrowLeft className="size-4" />
        Voltar ao ranking de {category.name}
      </Link>
      <PageContextHeader
        context="intelligence"
        title={company.name}
        description={`CNPJ ${company.document} · ${company.size} · presença em ${company.states.join(", ")}`}
        actions={
          <Button
            variant={monitored ? "outline" : "default"}
            onClick={() => {
              setMonitored((current) => !current);
              toast.success(monitored ? "Monitoramento removido" : "Concorrente monitorado", {
                description: monitored
                  ? "Você não receberá novas atualizações desta empresa."
                  : "Avisaremos sobre novas vitórias e movimentações relevantes.",
              });
            }}
            className={cn(
              "text-[12px] font-extrabold",
              monitored
                ? "border-[#29C454]/30 text-brand-strong"
                : "bg-[#18B849] text-white hover:bg-[#139E3E]",
            )}
          >
            {monitored ? (
              <>
                <Check className="size-4" />
                Monitorando
              </>
            ) : (
              <>
                <Bell className="size-4" />
                Monitorar concorrente
              </>
            )}
          </Button>
        }
      />
      <PageHowItWorks
        title="Entenda onde esta empresa é mais forte"
        description="O perfil reúne categorias, itens e vitórias para ajudar a equipe a identificar concorrência recorrente sem concluir nada automaticamente."
        steps={[
          {
            title: "Veja o panorama",
            description: "Confira presença, valor e concentração por categoria.",
          },
          {
            title: "Explore as vitórias",
            description: "Abra o histórico para entender órgão, objeto e data.",
          },
          {
            title: "Ative monitoramento",
            description: "Receba sinais sobre novas movimentações que merecem atenção.",
          },
        ]}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(
          [
            {
              label: "Vitórias",
              value: String(company.wins),
              Icon: Trophy,
              description: "no recorte analisado",
            },
            {
              label: "Valor homologado",
              value: currency.format(company.value),
              Icon: CircleDollarSign,
              description: "em contratos vencidos",
            },
            {
              label: "Desconto médio",
              value: `${company.discount}%`,
              Icon: TrendingDown,
              description: "sobre a estimativa",
            },
            {
              label: "Presença",
              value: `${company.states.length} UFs`,
              Icon: MapPin,
              description: company.states.join(" · "),
            },
          ] satisfies InsightMetric[]
        ).map(({ label, value, Icon: MetricIcon, description }) => {
          return (
            <Panel key={String(label)} className="p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-xl bg-brand-tint text-brand-strong">
                  <MetricIcon className="size-4" />
                </span>
                <p className="text-[11px] font-extrabold text-ink">{label}</p>
              </div>
              <p className="mt-4 truncate text-[21px] font-extrabold tracking-[-0.03em] text-ink">
                {value}
              </p>
              <p className="mt-1 text-[10.5px] text-slate-text">{description}</p>
            </Panel>
          );
        })}
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid h-11 w-full grid-cols-3 rounded-xl border border-hairline bg-page/60 p-1 sm:w-[520px]">
          <TabsTrigger value="overview" className="min-h-9 text-[11px] font-bold">
            Visão geral
          </TabsTrigger>
          <TabsTrigger value="history" className="min-h-9 text-[11px] font-bold">
            Vitórias
          </TabsTrigger>
          <TabsTrigger value="compare" className="min-h-9 text-[11px] font-bold">
            Comparar
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {tab === "overview" ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
          <Panel className="overflow-hidden">
            <div className="border-b border-hairline p-4 sm:p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
                Leitura rápida
              </p>
              <h2 className="mt-1 text-[18px] font-extrabold text-ink">
                Onde esta empresa é mais forte
              </h2>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
              {company.items.map((item) => (
                <div key={item.name} className="rounded-xl border border-hairline bg-page/45 p-4">
                  <p className="text-[12px] font-extrabold leading-snug text-ink">{item.name}</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <span>
                      <b className="block text-[17px] text-brand-strong">{item.count}</b>
                      <small className="text-[10px] text-slate-text">vitórias</small>
                    </span>
                    <span className="text-right text-[11px] font-bold text-ink">
                      {currency.format(item.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="p-4 sm:p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
              Insight LicitaBase
            </p>
            <h2 className="mt-1 text-[18px] font-extrabold text-ink">Sinal competitivo</h2>
            <div className="mt-4 rounded-2xl border border-[#29C454]/20 bg-brand-tint/55 p-4">
              <Sparkles className="size-5 text-brand-strong" />
              <p className="mt-3 text-[13px] font-extrabold leading-relaxed text-ink">
                {company.name.split(" ")[0]} concentra vitórias em{" "}
                {company.items[0]!.name.toLocaleLowerCase()}.
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-text">
                Acompanhe novas publicações nesta categoria e compare seu ticket médio antes de
                decidir disputar.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-slate-text">
              <ShieldCheck className="size-4 text-brand-strong" />
              Dados públicos, última leitura hoje
            </div>
          </Panel>
        </div>
      ) : null}
      {tab === "history" ? (
        <Panel className="overflow-hidden">
          <div className="border-b border-hairline p-4 sm:p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
              Histórico
            </p>
            <h2 className="mt-1 text-[18px] font-extrabold text-ink">Vitórias recentes</h2>
          </div>
          <div className="divide-y divide-hairline">
            {history.map((record, index) => (
              <div
                key={`${record.tender}-${index}`}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-extrabold text-ink">{record.tender}</p>
                  <p className="mt-1 text-[11px] text-slate-text">
                    {record.agency} · {record.state} · {record.date}
                  </p>
                </div>
                <p className="text-[13px] font-extrabold text-brand-strong">
                  {currency.format(record.value)}
                </p>
                <ChevronRight className="hidden size-4 text-slate-text sm:block" />
              </div>
            ))}
          </div>
        </Panel>
      ) : null}
      {tab === "compare" ? (
        <Panel className="p-4 sm:p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
            Comparação inicial
          </p>
          <h2 className="mt-1 text-[18px] font-extrabold text-ink">
            Sua operação × {company.name.split(" ").slice(0, 2).join(" ")}
          </h2>
          <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-slate-text">
            A comparação detalhada depende dos dados da sua operação. Esta leitura inicial mostra os
            pontos de sobreposição mais relevantes.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Categorias em comum", company.categories.join(" · ")],
              ["Regiões com sobreposição", company.states.slice(0, 2).join(" · ")],
              ["Ação recomendada", "Monitorar próximos editais"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-hairline bg-page/45 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-text">
                  {label}
                </p>
                <p className="mt-2 text-[13px] font-extrabold leading-relaxed text-ink">{value}</p>
              </div>
            ))}
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
