import { useMemo, useState } from "react";
import {
  BellRing,
  Check,
  ChevronRight,
  CirclePause,
  Filter,
  MapPin,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Tags,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dash2/Panel";
import { InternalPageState } from "@/components/dash2/InternalPageState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type InterestCategory = {
  id: string;
  name: string;
  description: string;
  terms: string[];
  excludedTerms: string[];
  regions: string[];
  matches: number;
  lastMatch: string;
  alertFrequency: "Imediato" | "Resumo diário" | "Pausado";
  active: boolean;
};

const suggestedCategories = [
  {
    name: "Equipamentos de TI",
    description: "Computadores, monitores, periféricos e infraestrutura.",
    terms: ["notebook", "monitor", "computador"],
  },
  {
    name: "Serviços de tecnologia",
    description: "Software, suporte, nuvem e serviços especializados.",
    terms: ["software", "suporte técnico", "desenvolvimento"],
  },
  {
    name: "Material de escritório",
    description: "Suprimentos, mobiliário e itens de expediente.",
    terms: ["papel", "mobiliário", "material de expediente"],
  },
  {
    name: "Manutenção predial",
    description: "Reparos, conservação e serviços de infraestrutura.",
    terms: ["manutenção", "conservação", "reparo"],
  },
];

const initialCategories: InterestCategory[] = [
  {
    id: "ti",
    name: "Equipamentos de TI",
    description: "Produtos e componentes usados pela operação da Iridia.",
    terms: ["notebook", "monitor", "SSD", "computador"],
    excludedTerms: ["locação"],
    regions: ["MG", "SP", "GO"],
    matches: 86,
    lastMatch: "há 8 min",
    alertFrequency: "Imediato",
    active: true,
  },
  {
    id: "servicos",
    name: "Serviços de tecnologia",
    description: "Demandas por software, sustentação e transformação digital.",
    terms: ["software", "desenvolvimento", "suporte técnico"],
    excludedTerms: [],
    regions: ["MG", "SP"],
    matches: 34,
    lastMatch: "há 42 min",
    alertFrequency: "Resumo diário",
    active: true,
  },
  {
    id: "escritorio",
    name: "Material de escritório",
    description: "Categoria em revisão para a próxima operação.",
    terms: ["material de expediente", "mobiliário"],
    excludedTerms: [],
    regions: ["MG"],
    matches: 12,
    lastMatch: "ontem, 16:25",
    alertFrequency: "Pausado",
    active: false,
  },
];

const statusCopy = {
  Imediato: "bg-[#E8F8ED] text-[#15863a] border-[#BDEEC9]",
  "Resumo diário": "bg-blue-50 text-blue-700 border-blue-100",
  Pausado: "bg-slate-100 text-slate-600 border-slate-200",
};

function CategoryEditor({
  category,
  onClose,
  onSave,
}: {
  category?: InterestCategory | undefined;
  onClose: () => void;
  onSave: (category: InterestCategory) => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [term, setTerm] = useState("");
  const [terms, setTerms] = useState<string[]>(category?.terms ?? []);
  const [regions, setRegions] = useState<string[]>(category?.regions ?? ["MG"]);
  const [frequency, setFrequency] = useState<InterestCategory["alertFrequency"]>(
    category?.alertFrequency === "Pausado"
      ? "Resumo diário"
      : (category?.alertFrequency ?? "Imediato"),
  );

  const addTerm = () => {
    const value = term.trim();
    if (
      !value ||
      terms.some((item) => item.toLocaleLowerCase("pt-BR") === value.toLocaleLowerCase("pt-BR"))
    )
      return;
    setTerms((current) => [...current, value]);
    setTerm("");
  };

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-hairline bg-white p-5 font-manrope sm:max-w-xl sm:p-6"
      >
        <SheetHeader className="pr-9 text-left">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
            Inteligência da operação
          </p>
          <SheetTitle className="text-[20px] font-extrabold tracking-[-0.02em] text-ink">
            {category ? "Editar categoria" : "Adicionar interesse"}
          </SheetTitle>
          <SheetDescription className="text-[12px] leading-relaxed text-slate-text">
            Defina o que a LicitaBase deve considerar relevante para sua empresa.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-5">
          <label className="grid gap-1.5 text-[12px] font-bold text-ink">
            Nome do interesse
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Equipamentos de TI"
              className="min-h-11 rounded-xl border-hairline text-[13px]"
            />
          </label>
          <div>
            <div className="flex items-end justify-between gap-3">
              <label className="flex-1 text-[12px] font-bold text-ink">
                Termos que devem aparecer
                <div className="mt-1.5 flex gap-2">
                  <Input
                    value={term}
                    onChange={(event) => setTerm(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addTerm();
                      }
                    }}
                    placeholder="Digite um produto, marca ou serviço"
                    className="min-h-11 rounded-xl border-hairline text-[13px]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTerm}
                    className="min-h-11 rounded-xl border-hairline px-3"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    <span className="sr-only sm:not-sr-only">Adicionar</span>
                  </Button>
                </div>
              </label>
            </div>
            <div className="mt-2 flex flex-wrap gap-2" aria-live="polite">
              {terms.map((item) => (
                <span
                  key={item}
                  className="inline-flex min-h-8 items-center gap-1 rounded-full bg-[#E8F8ED] px-2.5 text-[11px] font-bold text-[#15863a]"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => setTerms((current) => current.filter((value) => value !== item))}
                    aria-label={`Remover ${item}`}
                    className="rounded p-0.5 hover:bg-[#29C454]/15"
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <fieldset>
            <legend className="text-[12px] font-bold text-ink">Regiões prioritárias</legend>
            <p className="mt-1 text-[11px] text-slate-text">
              Você pode ampliar a cobertura depois.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["MG", "SP", "GO", "RJ", "PR", "DF"].map((state) => {
                const selected = regions.includes(state);
                return (
                  <button
                    key={state}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setRegions((current) =>
                        selected ? current.filter((item) => item !== state) : [...current, state],
                      )
                    }
                    className={cn(
                      "min-h-10 rounded-xl border px-3 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                      selected
                        ? "border-[#29C454] bg-[#E8F8ED] text-[#15863a]"
                        : "border-hairline bg-white text-slate-text hover:border-[#29C454]/45",
                    )}
                  >
                    {state}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-[12px] font-bold text-ink">Como deseja receber alertas?</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(["Imediato", "Resumo diário"] as const).map((option) => {
                const selected = frequency === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFrequency(option)}
                    className={cn(
                      "min-h-12 rounded-xl border px-3 text-left text-[12px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                      selected
                        ? "border-[#29C454] bg-[#E8F8ED] text-[#15863a]"
                        : "border-hairline bg-white text-ink hover:border-[#29C454]/45",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div className="rounded-xl border border-[#BDEEC9] bg-[#F4FCF6] p-3.5">
            <p className="text-[11px] font-extrabold text-[#15863a]">Prévia de impacto</p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
              Com esses critérios, a LicitaBase encontraria aproximadamente{" "}
              <strong className="font-extrabold text-ink">
                {Math.max(8, terms.length * 19)} oportunidades por mês
              </strong>{" "}
              para revisão.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="min-h-11 rounded-xl border-hairline"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!name.trim() || terms.length === 0}
            onClick={() =>
              onSave({
                id: category?.id ?? `category-${Date.now()}`,
                name: name.trim(),
                description:
                  category?.description ??
                  "Interesse configurado para acompanhar oportunidades relevantes.",
                terms,
                excludedTerms: category?.excludedTerms ?? [],
                regions,
                matches: category?.matches ?? Math.max(8, terms.length * 19),
                lastMatch: "ainda sem correspondências",
                alertFrequency: frequency,
                active: true,
              })
            }
            className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
          >
            <Check className="size-4" />
            Salvar interesse
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function InterestCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"todos" | "ativos" | "pausados">("todos");
  const [editor, setEditor] = useState<InterestCategory | "new" | null>(null);

  const visibleCategories = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return categories.filter((category) => {
      const matchesQuery =
        !normalized ||
        `${category.name} ${category.terms.join(" ")} ${category.regions.join(" ")}`
          .toLocaleLowerCase("pt-BR")
          .includes(normalized);
      const matchesStatus =
        status === "todos" || (status === "ativos" ? category.active : !category.active);
      return matchesQuery && matchesStatus;
    });
  }, [categories, query, status]);

  const activeCount = categories.filter((category) => category.active).length;
  const totalMatches = categories
    .filter((category) => category.active)
    .reduce((sum, category) => sum + category.matches, 0);

  const saveCategory = (next: InterestCategory) => {
    setCategories((current) =>
      current.some((category) => category.id === next.id)
        ? current.map((category) => (category.id === next.id ? next : category))
        : [next, ...current],
    );
    setEditor(null);
    toast.success("Interesse salvo", {
      description: `${next.name} já está sendo considerado nas oportunidades.`,
    });
  };

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
            Explorar licitações
          </p>
          <h1 className="mt-1 text-[24px] font-extrabold tracking-[-0.025em] text-ink sm:text-[28px]">
            Categorias de interesse
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-text">
            Configure os setores, termos e regiões que tornam uma oportunidade relevante para a sua
            operação.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setEditor("new")}
          className="min-h-11 rounded-xl bg-[#18B849] px-4 text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
        >
          <Plus className="size-4" />
          Adicionar interesse
        </Button>
      </header>

      <div className="grid gap-3 min-[480px]:grid-cols-3 sm:gap-4">
        <Metric
          label="Interesses ativos"
          value={String(activeCount)}
          detail="monitorando a operação"
          icon={<Tags className="size-4" />}
        />
        <Metric
          label="Oportunidades no mês"
          value={String(totalMatches)}
          detail="a partir dos seus critérios"
          icon={<Sparkles className="size-4" />}
          tone="brand"
        />
        <Metric
          label="Alertas configurados"
          value={`${categories.filter((category) => category.alertFrequency === "Imediato").length} imediatos`}
          detail="o restante entra no resumo diário"
          icon={<BellRing className="size-4" />}
          tone="blue"
        />
      </div>

      <Panel className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-hairline p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
              Sua configuração
            </p>
            <h2 className="mt-1 text-[17px] font-extrabold text-ink">
              O que a LicitaBase deve priorizar
            </h2>
          </div>
          <div className="flex flex-col gap-2 min-[480px]:flex-row">
            <label className="relative min-w-0 flex-1 min-[480px]:w-64">
              <span className="sr-only">Buscar categoria de interesse</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-text" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar interesse ou termo"
                className="min-h-11 rounded-xl border-hairline pl-9 text-[12px]"
              />
            </label>
            <div
              className="flex rounded-xl border border-hairline bg-slate-50 p-1"
              aria-label="Filtrar por status"
            >
              {(["todos", "ativos", "pausados"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={status === item}
                  onClick={() => setStatus(item)}
                  className={cn(
                    "min-h-9 rounded-lg px-2.5 text-[10.5px] font-extrabold capitalize transition-colors",
                    status === item
                      ? "bg-white text-ink shadow-sm"
                      : "text-slate-text hover:text-ink",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="divide-y divide-hairline">
          {visibleCategories.map((category) => (
            <article key={category.id} className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15px] font-extrabold text-ink">{category.name}</h3>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-extrabold",
                        statusCopy[category.alertFrequency],
                      )}
                    >
                      {category.alertFrequency === "Pausado" ? (
                        <CirclePause className="size-3" />
                      ) : (
                        <BellRing className="size-3" />
                      )}
                      {category.alertFrequency}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                    {category.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {category.terms.slice(0, 4).map((term) => (
                      <span
                        key={term}
                        className="rounded-full bg-[#E8F8ED] px-2.5 py-1 text-[10.5px] font-bold text-[#15863a]"
                      >
                        {term}
                      </span>
                    ))}
                    {category.terms.length > 4 ? (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10.5px] font-bold text-slate-text">
                        +{category.terms.length - 4}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[11px] sm:flex sm:items-center sm:gap-6 lg:shrink-0">
                  <div>
                    <p className="font-bold uppercase tracking-[0.08em] text-slate-text">Regiões</p>
                    <p className="mt-1 flex items-center gap-1 font-extrabold text-ink">
                      <MapPin className="size-3.5 text-brand-strong" />
                      {category.regions.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-[0.08em] text-slate-text">
                      Encontradas
                    </p>
                    <p className="mt-1 text-[16px] font-extrabold tabular-nums text-[#15863a]">
                      {category.matches}
                    </p>
                    <p className="text-[10px] text-slate-text">{category.lastMatch}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 lg:justify-end">
                  <Switch
                    checked={category.active}
                    onCheckedChange={(checked) => {
                      setCategories((current) =>
                        current.map((item) =>
                          item.id === category.id
                            ? {
                                ...item,
                                active: checked,
                                alertFrequency:
                                  checked && item.alertFrequency === "Pausado"
                                    ? "Resumo diário"
                                    : checked
                                      ? item.alertFrequency
                                      : "Pausado",
                              }
                            : item,
                        ),
                      );
                      toast.success(checked ? "Interesse ativado" : "Interesse pausado", {
                        description: category.name,
                      });
                    }}
                    aria-label={`${category.active ? "Pausar" : "Ativar"} ${category.name}`}
                    className="data-[state=checked]:bg-[#18B849]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditor(category)}
                    className="min-h-11 rounded-xl border-hairline text-[11px] font-bold"
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </Button>
                  <button
                    type="button"
                    aria-label={`Ver detalhes de ${category.name}`}
                    onClick={() => setEditor(category)}
                    className="grid size-11 place-items-center rounded-xl text-slate-text hover:bg-[#E8F8ED] hover:text-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
          {visibleCategories.length === 0 ? (
            <div className="p-4 sm:p-5">
              <InternalPageState
                state="empty"
                title="Nenhum interesse encontrado"
                description="Ajuste sua busca ou adicione uma categoria para começar a priorizar oportunidades."
                action={
                  <Button
                    type="button"
                    onClick={() => setEditor("new")}
                    className="min-h-11 rounded-xl bg-[#18B849] text-white hover:bg-[#139e3e]"
                  >
                    <Plus className="size-4" />
                    Adicionar interesse
                  </Button>
                }
              />
            </div>
          ) : null}
        </div>
      </Panel>

      <Panel className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
              Sugestões para você
            </p>
            <h2 className="mt-1 text-[16px] font-extrabold text-ink">
              Amplie sua cobertura quando fizer sentido
            </h2>
            <p className="mt-1 text-[12px] text-slate-text">
              Baseado no perfil da Iridia Soluções e nas pesquisas recentes.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              toast.info("Catálogo em preparação", {
                description: "As sugestões abaixo já podem ser adicionadas à sua configuração.",
              })
            }
            className="min-h-11 rounded-xl border-hairline text-[11px] font-bold"
          >
            <Filter className="size-4" />
            Ver catálogo
          </Button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {suggestedCategories.map((suggestion) => (
            <div
              key={suggestion.name}
              className="rounded-xl border border-hairline bg-[#FBFDFC] p-3.5"
            >
              <p className="text-[12px] font-extrabold text-ink">{suggestion.name}</p>
              <p className="mt-1 min-h-9 text-[10.5px] leading-relaxed text-slate-text">
                {suggestion.description}
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setEditor({
                    id: `suggestion-${suggestion.name}`,
                    name: suggestion.name,
                    description: suggestion.description,
                    terms: suggestion.terms,
                    excludedTerms: [],
                    regions: ["MG", "SP"],
                    matches: 0,
                    lastMatch: "ainda sem correspondências",
                    alertFrequency: "Imediato",
                    active: true,
                  })
                }
                className="mt-3 min-h-9 rounded-lg px-2 text-[10.5px] font-extrabold text-brand-strong hover:bg-[#E8F8ED]"
              >
                <Plus className="size-3.5" />
                Adicionar
              </Button>
            </div>
          ))}
        </div>
      </Panel>
      {editor ? (
        <CategoryEditor
          category={editor === "new" ? undefined : editor}
          onClose={() => setEditor(null)}
          onSave={saveCategory}
        />
      ) : null}
    </>
  );
}

function Metric({
  label,
  value,
  detail,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  tone?: "neutral" | "brand" | "blue";
}) {
  const colors =
    tone === "brand"
      ? "bg-[#E8F8ED] text-[#15863a]"
      : tone === "blue"
        ? "bg-blue-50 text-blue-700"
        : "bg-slate-100 text-slate-text";
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span className={cn("grid size-8 place-items-center rounded-lg", colors)}>{icon}</span>
        <p className="text-[11.5px] font-bold text-ink">{label}</p>
      </div>
      <p className="mt-3 text-[24px] font-extrabold leading-none tracking-[-0.025em] tabular-nums text-ink">
        {value}
      </p>
      <p className="mt-2 text-[10.5px] text-slate-text">{detail}</p>
    </Panel>
  );
}
