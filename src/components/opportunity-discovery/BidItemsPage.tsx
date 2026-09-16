import { useMemo, useState } from "react";
import {
  Bookmark,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  Filter,
  MapPin,
  Package,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dash2/Panel";
import { InternalPageState, InternalStatusNotice } from "@/components/dash2/InternalPageState";
import { PageContextHeader } from "@/components/dash2/PageContextHeader";
import { PageHowItWorks } from "@/components/dash2/PageHowItWorks";
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

type BidItem = {
  id: string;
  name: string;
  highlight: string;
  category: string;
  tender: string;
  tenderId: string;
  agency: string;
  city: string;
  state: string;
  quantity: string;
  unitPrice: string;
  total: string;
  deadline: string;
  status: "Aberta" | "Encerra em breve" | "Nova";
  match: number;
  published: string;
};

const bidItemsResultColumns = [
  { id: "quantity", width: 118, min: 104, max: 190 },
  { id: "estimated", width: 152, min: 132, max: 240 },
  { id: "deadline", width: 136, min: 116, max: 210 },
  { id: "match", width: 116, min: 102, max: 180 },
  { id: "actions", width: 108, min: 100, max: 132 },
];

const bidItems: BidItem[] = [
  {
    id: "monitor-24",
    name: "Monitor 24 polegadas com painel IPS e resolução Full HD",
    highlight: "Monitor · tela LED · HDMI",
    category: "Equipamentos de TI",
    tender: "Pregão 845/2026",
    tenderId: "pe-845-2026",
    agency: "Prefeitura Municipal de Guarulhos",
    city: "Guarulhos",
    state: "SP",
    quantity: "120 unidades",
    unitPrice: "R$ 1.248,00",
    total: "R$ 149.760,00",
    deadline: "22 ago · 17h",
    status: "Nova",
    match: 96,
    published: "há 8 min",
  },
  {
    id: "notebook-i5",
    name: "Notebook corporativo com processador Intel Core i5 e SSD de 512 GB",
    highlight: "Notebook · garantia de 36 meses",
    category: "Equipamentos de TI",
    tender: "Pregão 845/2026",
    tenderId: "pe-845-2026",
    agency: "Prefeitura Municipal de Guarulhos",
    city: "Guarulhos",
    state: "SP",
    quantity: "85 unidades",
    unitPrice: "R$ 4.980,00",
    total: "R$ 423.300,00",
    deadline: "22 ago · 17h",
    status: "Nova",
    match: 93,
    published: "há 8 min",
  },
  {
    id: "switch",
    name: "Switch gerenciável de 24 portas com suporte a VLAN",
    highlight: "Rede · gerenciamento · PoE",
    category: "Equipamentos de TI",
    tender: "Pregão 310/2026",
    tenderId: "pe-310-2026",
    agency: "ESP — Centro de Energia Nuclear na Agricultura",
    city: "Piracicaba",
    state: "SP",
    quantity: "12 unidades",
    unitPrice: "R$ 3.450,00",
    total: "R$ 41.400,00",
    deadline: "19 ago · 14h",
    status: "Encerra em breve",
    match: 88,
    published: "há 38 min",
  },
  {
    id: "suporte",
    name: "Serviço de sustentação e suporte técnico especializado em software",
    highlight: "Software · atendimento remoto · SLA",
    category: "Serviços de tecnologia",
    tender: "Concorrência 091/2026",
    tenderId: "cp-091-2026",
    agency: "Secretaria de Administração de Minas Gerais",
    city: "Belo Horizonte",
    state: "MG",
    quantity: "24 meses",
    unitPrice: "R$ 18.600,00",
    total: "R$ 446.400,00",
    deadline: "28 ago · 10h",
    status: "Aberta",
    match: 84,
    published: "hoje, 09:18",
  },
  {
    id: "desenvolvimento",
    name: "Desenvolvimento e manutenção evolutiva de sistema de gestão",
    highlight: "Desenvolvimento · fábrica de software",
    category: "Serviços de tecnologia",
    tender: "Pregão 771/2026",
    tenderId: "pe-771-2026",
    agency: "Prefeitura Municipal de Uberlândia",
    city: "Uberlândia",
    state: "MG",
    quantity: "1 serviço",
    unitPrice: "R$ 980.000,00",
    total: "R$ 980.000,00",
    deadline: "02 set · 09h",
    status: "Aberta",
    match: 78,
    published: "ontem",
  },
];

const statusTone = {
  Nova: "border-[#BDEEC9] bg-[#E8F8ED] text-[#15863a]",
  Aberta: "border-blue-100 bg-blue-50 text-blue-700",
  "Encerra em breve": "border-amber-200 bg-amber-50 text-amber-700",
};

function ItemDetail({
  item,
  saved,
  onSave,
  onClose,
}: {
  item: BidItem;
  saved: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-hairline bg-white p-0 font-manrope sm:max-w-lg"
        showCloseButton={false}
      >
        <div className="sticky top-0 z-10 border-b border-hairline bg-white px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3 pr-9">
            <div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
                Detalhe do item
              </p>
              <SheetTitle className="mt-1 text-[18px] font-extrabold leading-tight text-ink">
                {item.name}
              </SheetTitle>
              <SheetDescription className="mt-1 text-[11px] text-slate-text">
                {item.tender} · publicação {item.published}
              </SheetDescription>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhe"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-xl text-slate-text hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="rounded-2xl border border-[#BDEEC9] bg-[#F4FCF6] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] font-extrabold text-[#15863a]">
                {item.match}% compatível com a operação
              </span>
              <Sparkles className="size-4 text-brand-strong" />
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-slate-text">
              Correspondência identificada pelos seus interesses em{" "}
              <strong className="font-extrabold text-ink">{item.category}</strong> e pelos termos do
              objeto.
            </p>
          </div>
          <InfoBlock
            icon={<Package className="size-4" />}
            label="Especificação encontrada"
            value={item.highlight}
          />
          <div className="grid grid-cols-2 gap-3">
            <InfoBlock label="Quantidade" value={item.quantity} />
            <InfoBlock label="Valor unitário" value={item.unitPrice} />
            <InfoBlock label="Valor estimado" value={item.total} />
            <InfoBlock label="Prazo de propostas" value={item.deadline} emphasis />
          </div>
          <InfoBlock
            icon={<Building2 className="size-4" />}
            label="Órgão comprador"
            value={item.agency}
            detail={`${item.city} · ${item.state}`}
          />
          <div className="rounded-xl border border-hairline p-3.5">
            <p className="text-[11px] font-extrabold text-ink">Próximo passo sugerido</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-text">
              Abra a licitação completa para validar documentos, exigências e todos os itens do lote
              antes de decidir.
            </p>
          </div>
          <div className="grid gap-2">
            <Button
              type="button"
              onClick={() =>
                toast.success("Licitação aberta", {
                  description: "O detalhe completo será exibido na rota da licitação.",
                })
              }
              className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
            >
              <ExternalLink className="size-4" />
              Abrir licitação completa
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onSave}
              className="min-h-11 rounded-xl border-hairline text-[12px] font-bold"
            >
              <Bookmark className={cn("size-4", saved && "fill-[#18B849] text-[#18B849]")} />
              {saved ? "Item salvo" : "Salvar item"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoBlock({
  icon,
  label,
  value,
  detail,
  emphasis = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  detail?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-hairline bg-white p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-text">
        {icon}
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 break-words text-[12px] font-extrabold leading-snug text-ink",
          emphasis && "text-[#15863a]",
        )}
      >
        {value}
      </p>
      {detail ? <p className="mt-1 text-[10.5px] text-slate-text">{detail}</p> : null}
    </div>
  );
}

export function BidItemsPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<BidItem | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const { gridTemplateColumns: bidItemsGridTemplateColumns, getResizeHandleProps } =
    useResizableColumns({
      // A versão anterior agrupava três dados na coluna de quantidade. Uma nova
      // chave evita reutilizar larguras persistidas daquele layout incorreto.
      storageKey: "licitabase.bid-items-result-widths.v2",
      columns: bidItemsResultColumns,
    });

  const results = useMemo(() => {
    const normalized = submittedQuery.trim().toLocaleLowerCase("pt-BR");
    return bidItems.filter((item) => {
      const matchesQuery =
        !normalized ||
        `${item.name} ${item.highlight} ${item.category} ${item.agency}`
          .toLocaleLowerCase("pt-BR")
          .includes(normalized);
      const matchesCategory = category === "Todas" || item.category === category;
      const matchesUrgent =
        !onlyUrgent || item.status === "Encerra em breve" || item.status === "Nova";
      return matchesQuery && matchesCategory && matchesUrgent;
    });
  }, [category, onlyUrgent, submittedQuery]);

  const search = () => setSubmittedQuery(query.trim());
  const saveItem = (id: string) =>
    setSavedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  const activeFilterCount = Number(category !== "Todas") + Number(onlyUrgent);

  return (
    <>
      <PageContextHeader
        context="explore"
        title="Itens de licitação"
        description="Pesquise produtos e serviços, compare contexto e abra a licitação certa sem perder sua busca."
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              toast.success("Busca salva", {
                description:
                  "Você receberá alertas quando novos itens atenderem a estes critérios.",
              })
            }
            className="min-h-11 rounded-xl border-hairline text-[12px] font-bold"
          >
            <Bookmark className="size-4" />
            Salvar busca
          </Button>
        }
      />

      <PageHowItWorks
        title="Encontre o item certo antes de abrir o edital"
        description="Use termos de produto ou serviço para comparar quantidade, preço unitário, órgão e prazo sem perder o contexto da busca."
        steps={[
          {
            title: "Busque o produto",
            description: "Informe um item, marca, serviço ou especificação.",
          },
          {
            title: "Refine o contexto",
            description: "Use filtros para reduzir categoria e itens urgentes.",
          },
          {
            title: "Abra a licitação",
            description: "Compare o resultado e siga para o edital compatível.",
          },
        ]}
      />

      <Panel className="overflow-hidden">
        <div className="bg-[linear-gradient(115deg,#F4FCF6_0%,#FFFFFF_52%,#F6FBF7_100%)] p-4 sm:p-5">
          <label className="block">
            <span className="sr-only">Buscar produto ou serviço</span>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-text" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") search();
                  }}
                  placeholder="Ex.: monitor 24, notebook, suporte técnico..."
                  className="min-h-12 rounded-xl border-hairline bg-white pl-10 text-[13px] font-medium shadow-sm"
                />
              </div>
              <Button
                type="button"
                onClick={search}
                className="min-h-12 rounded-xl bg-[#18B849] px-4 text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
              >
                <Search className="size-4" />
                Buscar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFiltersOpen(true)}
                className="min-h-12 rounded-xl border-hairline text-[12px] font-bold"
              >
                <SlidersHorizontal className="size-4" />
                Filtros{activeFilterCount ? ` · ${activeFilterCount}` : ""}
              </Button>
            </div>
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="mr-1 py-1 text-[10.5px] font-bold text-slate-text">Experimente:</span>
            {["monitor", "notebook", "software", "suporte técnico"].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  setSubmittedQuery(term);
                }}
                className="min-h-8 rounded-full border border-[#C7EED2] bg-white px-3 text-[10.5px] font-bold text-brand-strong transition-colors hover:bg-[#E8F8ED] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
        {submittedQuery ? (
          <div className="flex flex-col gap-3 border-t border-hairline px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-[#E8F8ED] text-brand-strong">
                <Sparkles className="size-4" />
              </span>
              <p className="min-w-0 text-[12px] text-slate-text">
                <strong className="font-extrabold text-ink">
                  {results.length} itens encontrados
                </strong>{" "}
                para <span className="font-bold text-ink">“{submittedQuery}”</span>
              </p>
            </div>
            <p className="text-[10.5px] font-medium text-slate-text">
              Dados atualizados há poucos minutos
            </p>
          </div>
        ) : null}
      </Panel>

      {!submittedQuery ? (
        <InternalPageState
          state="empty"
          title="Comece por um produto ou serviço"
          description="Pesquise por uma necessidade da sua empresa. Você poderá refinar por categoria, prazo, região e órgão."
          action={
            <Button
              type="button"
              onClick={() => {
                setQuery("monitor");
                setSubmittedQuery("monitor");
              }}
              className="min-h-11 rounded-xl bg-[#18B849] text-white hover:bg-[#139e3e]"
            >
              <Search className="size-4" />
              Ver um exemplo
            </Button>
          }
        />
      ) : (
        <>
          <InternalStatusNotice state="updating" className="py-3" />
          <Panel className="overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-hairline p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                  Resultados compatíveis
                </p>
                <h2 className="mt-1 text-[17px] font-extrabold text-ink">
                  Itens para analisar agora
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F8ED] px-2.5 py-1.5 text-[10.5px] font-extrabold text-[#15863a]">
                <Check className="size-3.5" />
                Ordenado por aderência
              </span>
            </div>
            <ResourceListGridHeader
              gridTemplateColumns={bidItemsGridTemplateColumns}
              className="px-5 py-3"
            >
              <span className="relative">
                Item / contexto
                <button
                  {...getResizeHandleProps("quantity")}
                  aria-label="Redimensionar largura da coluna Quantidade"
                />
              </span>
              <span className="relative text-right">
                Quantidade
                <button
                  {...getResizeHandleProps("estimated")}
                  aria-label="Redimensionar largura da coluna Valor estimado"
                />
              </span>
              <span className="relative text-right">
                Estimado
                <button
                  {...getResizeHandleProps("deadline")}
                  aria-label="Redimensionar largura da coluna Prazo"
                />
              </span>
              <span className="relative text-right">
                Prazo
                <button
                  {...getResizeHandleProps("match")}
                  aria-label="Redimensionar largura da coluna Aderência"
                />
              </span>
              <span className="relative text-right">
                Aderência
                <button
                  {...getResizeHandleProps("actions")}
                  aria-label="Redimensionar largura da coluna Ações"
                />
              </span>
              <span className="text-right">Ações</span>
            </ResourceListGridHeader>
            <div className="divide-y divide-hairline">
              {results.map((item) => (
                <article
                  key={item.id}
                  className="group p-4 transition-colors hover:bg-[#FBFDFC] sm:p-5"
                >
                  <div
                    className="flex flex-col gap-4 xl:grid xl:items-center"
                    style={{ gridTemplateColumns: bidItemsGridTemplateColumns }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full border px-2 py-1 text-[10px] font-extrabold",
                            statusTone[item.status],
                          )}
                        >
                          {item.status}
                        </span>
                        <span className="text-[10.5px] font-bold text-slate-text">
                          {item.category}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelected(item)}
                        className="mt-2 block max-w-full text-left text-[14px] font-extrabold leading-snug text-ink hover:text-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                      >
                        {item.name}
                      </button>
                      <p className="mt-1 text-[11.5px] text-slate-text">{item.highlight}</p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[10.5px] font-medium text-slate-text">
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="size-3.5 text-brand-strong" />
                          {item.agency}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5 text-brand-strong" />
                          {item.city} · {item.state}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="size-3.5 text-brand-strong" />
                          {item.tender}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 text-[11px] xl:text-right">
                      <p className="font-bold uppercase tracking-[0.07em] text-slate-text xl:hidden">
                        Quantidade
                      </p>
                      <p className="mt-1 font-extrabold text-ink xl:mt-0">{item.quantity}</p>
                    </div>
                    <div className="min-w-0 text-[11px] xl:text-right">
                      <p className="font-bold uppercase tracking-[0.07em] text-slate-text xl:hidden">
                        Estimado
                      </p>
                      <p className="mt-1 whitespace-nowrap font-extrabold tabular-nums text-ink xl:mt-0">
                        {item.total}
                      </p>
                    </div>
                    <div className="min-w-0 text-[11px] xl:text-right">
                      <p className="font-bold uppercase tracking-[0.07em] text-slate-text xl:hidden">
                        Prazo
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1 whitespace-nowrap font-extrabold text-amber-700 xl:mt-0">
                        <Clock3 className="size-3.5" />
                        {item.deadline}
                      </p>
                    </div>
                    <div className="min-w-0 xl:text-right">
                      <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-slate-text xl:hidden">
                        Aderência
                      </p>
                      <span className="rounded-full bg-[#E8F8ED] px-2 py-1 text-[10px] font-extrabold text-[#15863a]">
                        {item.match}% aderente
                      </span>
                    </div>
                    <div className="flex items-center justify-start gap-2 xl:justify-end">
                      <button
                        type="button"
                        aria-label={`${savedIds.includes(item.id) ? "Remover" : "Salvar"} ${item.name}`}
                        onClick={() => saveItem(item.id)}
                        className={cn(
                          "grid size-11 place-items-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                          savedIds.includes(item.id)
                            ? "border-[#BDEEC9] bg-[#E8F8ED] text-brand-strong"
                            : "border-hairline bg-white text-slate-text hover:border-[#29C454]/45 hover:text-brand-strong",
                        )}
                      >
                        <Bookmark
                          className={cn("size-4", savedIds.includes(item.id) && "fill-current")}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelected(item)}
                        className="grid size-11 place-items-center rounded-xl text-slate-text transition-colors hover:bg-[#E8F8ED] hover:text-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {results.length === 0 ? (
                <div className="p-4 sm:p-5">
                  <InternalPageState
                    state="empty"
                    title="Nenhum item corresponde a esses critérios"
                    description="Remova um filtro ou experimente um termo mais amplo para descobrir oportunidades relacionadas."
                    action={
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCategory("Todas");
                          setOnlyUrgent(false);
                          setQuery("");
                          setSubmittedQuery("");
                        }}
                        className="min-h-11 rounded-xl border-hairline"
                      >
                        Limpar busca
                      </Button>
                    }
                  />
                </div>
              ) : null}
            </div>
          </Panel>
        </>
      )}

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-hairline bg-white p-5 font-manrope sm:max-w-md"
        >
          <SheetHeader className="pr-8 text-left">
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
              Refinar resultado
            </p>
            <SheetTitle className="text-[19px] font-extrabold text-ink">
              Filtros de itens
            </SheetTitle>
            <SheetDescription className="text-[12px] leading-relaxed text-slate-text">
              Use apenas critérios que ajudem a decidir a próxima oportunidade.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-5">
            <fieldset>
              <legend className="text-[12px] font-bold text-ink">Categoria</legend>
              <div className="mt-2 grid gap-2">
                {["Todas", "Equipamentos de TI", "Serviços de tecnologia"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={category === option}
                    onClick={() => setCategory(option)}
                    className={cn(
                      "min-h-11 rounded-xl border px-3 text-left text-[12px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                      category === option
                        ? "border-[#29C454] bg-[#E8F8ED] text-[#15863a]"
                        : "border-hairline bg-white text-ink hover:border-[#29C454]/45",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-xl border border-hairline p-3">
              <span>
                <span className="block text-[12px] font-extrabold text-ink">
                  Priorizar prazo próximo
                </span>
                <span className="mt-1 block text-[10.5px] text-slate-text">
                  Novas publicações ou prazo em breve
                </span>
              </span>
              <input
                type="checkbox"
                checked={onlyUrgent}
                onChange={(event) => setOnlyUrgent(event.target.checked)}
                className="size-5 accent-[#18B849]"
              />
            </label>
            <div className="rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-text">
              Regiões, órgão, faixa de valor e modalidade serão aplicados assim que houver dados
              conectados para esta pesquisa.
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCategory("Todas");
                setOnlyUrgent(false);
              }}
              className="min-h-11 flex-1 rounded-xl border-hairline text-[11px] font-bold"
            >
              Limpar
            </Button>
            <Button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="min-h-11 flex-1 rounded-xl bg-[#18B849] text-[11px] font-extrabold text-white hover:bg-[#139e3e]"
            >
              <Filter className="size-4" />
              Aplicar filtros
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      {selected ? (
        <ItemDetail
          item={selected}
          saved={savedIds.includes(selected.id)}
          onSave={() => saveItem(selected.id)}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </>
  );
}
