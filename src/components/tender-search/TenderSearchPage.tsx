import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Building2,
  CalendarDays,
  Check,
  CircleCheckBig,
  ChevronDown,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  FileSearch,
  Filter,
  LoaderCircle,
  MapPin,
  MinusCircle,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  Target,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  criterionSearchValues,
  getSearchVariants,
  getTermEquivalents,
  interpretTenderSearchIntent,
  normalizeTenderSearchTerm,
  parseSearchTerms,
  type IntelligentCriterion,
  type SearchMatchMode,
  type SearchTerm,
} from "@/lib/tender-search-intelligence";
import { cn } from "@/lib/utils";

type SearchMode = "normal" | "intelligent";

type Tender = {
  id: string;
  code: string;
  modality: "Pregão" | "Concorrência";
  platform: string;
  title: string;
  agency: string;
  city: string;
  state: string;
  opening: string;
  value: number;
  match: number;
  status: "Aberto" | "Encerra em 2 dias";
  category: string;
  specifications: string[];
  attention?: string;
};

type SearchFilters = {
  keyword: string;
  agency: string;
  process: string;
  state: string;
  city: string;
  modalities: string[];
  categories: string[];
  platforms: string[];
  favoritesOnly: boolean;
  highPotential: boolean;
  hasCatmat: boolean;
  hideClosed: boolean;
  minValue: string;
  maxValue: string;
};

const tenders: Tender[] = [
  {
    id: "pe-845-2026",
    code: "Pregão 845/2026",
    modality: "Pregão",
    platform: "ComprasNet",
    title:
      "Aquisição de notebooks para atendimento às unidades administrativas, com garantia e suporte técnico.",
    agency: "Prefeitura Municipal de São Paulo",
    city: "São Paulo",
    state: "SP",
    opening: "23/08/2026 09:00",
    value: 1_250_000,
    match: 92,
    status: "Aberto",
    category: "Equipamentos de TI",
    specifications: ["Notebook", "Intel Core i5", "SSD de 512 GB", "Garantia de 36 meses"],
    attention: "O edital exige garantia mínima de 36 meses.",
  },
  {
    id: "pe-512-2026",
    code: "Pregão 512/2026",
    modality: "Pregão",
    platform: "ComprasNet",
    title: "Aquisição de notebooks para a Secretaria de Finanças e unidades descentralizadas.",
    agency: "Prefeitura Municipal de São Paulo",
    city: "São Paulo",
    state: "SP",
    opening: "28/08/2026 10:00",
    value: 950_000,
    match: 90,
    status: "Aberto",
    category: "Equipamentos de TI",
    specifications: ["Computador portátil", "Processador i5", "Armazenamento SSD 512GB"],
  },
  {
    id: "pe-499-2026",
    code: "Pregão 499/2026",
    modality: "Pregão",
    platform: "ComprasNet",
    title: "Registro de preços para notebooks e acessórios de informática.",
    agency: "Prefeitura Municipal de São Paulo",
    city: "São Paulo",
    state: "SP",
    opening: "27/08/2026 09:30",
    value: 1_800_000,
    match: 88,
    status: "Aberto",
    category: "Equipamentos de TI",
    specifications: ["Laptop", "Core i5", "Unidade de estado sólido de 512 GB"],
  },
  {
    id: "pe-732-2026",
    code: "Pregão 732/2026",
    modality: "Pregão",
    platform: "Licitanet",
    title:
      "Registro de preços para aquisição de material de expediente e suprimentos corporativos.",
    agency: "Secretaria de Educação do Estado de São Paulo",
    city: "São Paulo",
    state: "SP",
    opening: "21/08/2026 10:00",
    value: 680_000,
    match: 85,
    status: "Aberto",
    category: "Material de escritório",
    specifications: ["Suprimentos corporativos", "Material de expediente"],
  },
  {
    id: "cp-018-2026",
    code: "Concorrência 018/2026",
    modality: "Concorrência",
    platform: "PNCP",
    title: "Contratação de serviços de engenharia, limpeza e conservação predial.",
    agency: "Universidade Estadual de Campinas",
    city: "Campinas",
    state: "SP",
    opening: "20/09/2026 09:30",
    value: 3_200_000,
    match: 78,
    status: "Encerra em 2 dias",
    category: "Manutenção predial",
    specifications: ["Limpeza e conservação", "Serviços de engenharia"],
  },
  {
    id: "pe-204-2026",
    code: "Pregão 204/2026",
    modality: "Pregão",
    platform: "Portal de Compras Públicas",
    title: "Fornecimento de produtos para limpeza a seco e higienização de estofados.",
    agency: "Prefeitura Municipal de Santos",
    city: "Santos",
    state: "SP",
    opening: "30/08/2026 14:00",
    value: 420_000,
    match: 91,
    status: "Aberto",
    category: "Limpeza e conservação",
    specifications: ["Higienização a seco", "Produto para estofados", "Sofás e poltronas"],
  },
];

const initialFilters: SearchFilters = {
  keyword: "",
  agency: "",
  process: "",
  state: "",
  city: "",
  modalities: [],
  categories: [],
  platforms: [],
  favoritesOnly: false,
  highPotential: false,
  hasCatmat: false,
  hideClosed: false,
  minValue: "",
  maxValue: "",
};

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function parseFilterCurrency(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;
  return /,\d{2}\s*$/.test(value) ? Number(digits) / 100 : Number(digits);
}

function toggleArrayValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function getActiveFilterLabels(filters: SearchFilters) {
  const labels: string[] = [];
  if (filters.keyword) labels.push(`Palavra-chave: ${filters.keyword}`);
  if (filters.agency) labels.push(`Órgão: ${filters.agency}`);
  if (filters.process) labels.push(`Processo: ${filters.process}`);
  if (filters.state) labels.push(filters.state);
  if (filters.city) labels.push(filters.city);
  filters.modalities.forEach((item) => labels.push(`Modalidade: ${item}`));
  filters.categories.forEach((item) => labels.push(`Categoria: ${item}`));
  filters.platforms.forEach((item) => labels.push(`Plataforma: ${item}`));
  if (filters.favoritesOnly) labels.push("Apenas favoritos");
  if (filters.highPotential) labels.push("Alto potencial");
  if (filters.hasCatmat) labels.push("Com código CATMAT");
  if (filters.hideClosed) labels.push("Abertos");
  if (filters.minValue)
    labels.push(`Valor mínimo: ${moneyFormatter.format(parseFilterCurrency(filters.minValue))}`);
  if (filters.maxValue)
    labels.push(`Valor máximo: ${moneyFormatter.format(parseFilterCurrency(filters.maxValue))}`);
  return labels;
}

function FilterCheck({
  id,
  label,
  count,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  count?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex min-h-9 items-center gap-2.5">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        className="size-[17px] rounded-[5px] border-slate-300 data-[state=checked]:border-[#21B84B] data-[state=checked]:bg-[#21B84B]"
      />
      <Label
        htmlFor={id}
        className="min-w-0 flex-1 cursor-pointer text-[12px] font-semibold text-ink"
      >
        {label}
      </Label>
      {count ? <span className="text-[10.5px] font-medium text-slate-text">{count}</span> : null}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      data-tender-filter-section
      className="border-b border-hairline py-0 pb-4 last:border-b-0"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink">{title}</h3>
        <ChevronDown className="size-3.5 rotate-180 text-slate-text" aria-hidden="true" />
      </div>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function FiltersPanel({
  filters,
  onChange,
  onClear,
  onApply,
  compact = false,
}: {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onClear: () => void;
  onApply: () => void;
  compact?: boolean;
}) {
  const update = <Key extends keyof SearchFilters>(key: Key, value: SearchFilters[Key]) =>
    onChange({ ...filters, [key]: value });
  const filterCount = getActiveFilterLabels(filters).length;

  return (
    <div className={cn("flex min-h-0 flex-col bg-white", compact ? "h-full" : "rounded-[20px]")}>
      <div className="flex items-center justify-between border-b border-hairline px-4 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-brand-tint text-brand-strong">
            <SlidersHorizontal className="size-[17px]" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[14px] font-extrabold text-ink">Filtros</h2>
            <p className="text-[10.5px] font-medium text-slate-text">Refine sua busca</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="min-h-10 rounded-lg px-2 text-[11px] font-bold text-brand-strong hover:bg-brand-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          Limpar
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4">
        <FilterSection title="Essenciais">
          <div>
            <Label
              htmlFor="filter-keyword"
              className="mb-1.5 block text-[10.5px] font-bold text-slate-text"
            >
              Palavra-chave
            </Label>
            <Input
              id="filter-keyword"
              value={filters.keyword}
              onChange={(event) => update("keyword", event.target.value)}
              placeholder="Ex.: TI, software, obras"
              className="h-10 rounded-xl border-hairline bg-page/40 text-[12px] shadow-none focus-visible:border-[#29C454] focus-visible:ring-[#29C454]/20"
            />
          </div>
          <div>
            <Label
              htmlFor="filter-agency"
              className="mb-1.5 block text-[10.5px] font-bold text-slate-text"
            >
              Órgão ou entidade
            </Label>
            <Input
              id="filter-agency"
              value={filters.agency}
              onChange={(event) => update("agency", event.target.value)}
              placeholder="Selecione ou digite"
              className="h-10 rounded-xl border-hairline bg-page/40 text-[12px] shadow-none focus-visible:border-[#29C454] focus-visible:ring-[#29C454]/20"
            />
          </div>
          <div>
            <Label
              htmlFor="filter-process"
              className="mb-1.5 block text-[10.5px] font-bold text-slate-text"
            >
              Número do processo
            </Label>
            <Input
              id="filter-process"
              value={filters.process}
              onChange={(event) => update("process", event.target.value)}
              placeholder="Ex.: 845/2026"
              className="h-10 rounded-xl border-hairline bg-page/40 text-[12px] shadow-none focus-visible:border-[#29C454] focus-visible:ring-[#29C454]/20"
            />
          </div>
        </FilterSection>

        <FilterSection title="Localização">
          <div>
            <Label className="mb-1.5 block text-[10.5px] font-bold text-slate-text">
              Estado (UF)
            </Label>
            <Select
              value={filters.state || "all"}
              onValueChange={(value) => update("state", value === "all" ? "" : value)}
            >
              <SelectTrigger className="h-10 rounded-xl border-hairline bg-page/40 text-[12px] shadow-none focus:ring-[#29C454]/20">
                <SelectValue placeholder="Todos os estados" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="SP">São Paulo (SP)</SelectItem>
                <SelectItem value="MG">Minas Gerais (MG)</SelectItem>
                <SelectItem value="PR">Paraná (PR)</SelectItem>
                <SelectItem value="RS">Rio Grande do Sul (RS)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-[10.5px] font-bold text-slate-text">
              Município
            </Label>
            <Select
              value={filters.city || "all"}
              onValueChange={(value) => update("city", value === "all" ? "" : value)}
            >
              <SelectTrigger className="h-10 rounded-xl border-hairline bg-page/40 text-[12px] shadow-none focus:ring-[#29C454]/20">
                <SelectValue placeholder="Todos os municípios" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Todos os municípios</SelectItem>
                <SelectItem value="São Paulo">São Paulo</SelectItem>
                <SelectItem value="Campinas">Campinas</SelectItem>
                <SelectItem value="Guarulhos">Guarulhos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FilterSection>

        <FilterSection title="Modalidade">
          {(
            [
              ["Pregão", "231.456"],
              ["Concorrência", "48.231"],
              ["Dispensa", "31.987"],
              ["Tomada de preços", "8.765"],
            ] as const
          ).map(([label, count]) => (
            <FilterCheck
              key={label}
              id={`modality-${label}`}
              label={label}
              count={count}
              checked={filters.modalities.includes(label)}
              onCheckedChange={() =>
                update("modalities", toggleArrayValue(filters.modalities, label))
              }
            />
          ))}
        </FilterSection>

        <FilterSection title="Categoria">
          {[
            "Equipamentos de TI",
            "Saúde e medicamentos",
            "Construção civil",
            "Manutenção predial",
          ].map((label) => (
            <FilterCheck
              key={label}
              id={`category-${label}`}
              label={label}
              checked={filters.categories.includes(label)}
              onCheckedChange={() =>
                update("categories", toggleArrayValue(filters.categories, label))
              }
            />
          ))}
        </FilterSection>

        <FilterSection title="Sinais de oportunidade">
          <FilterCheck
            id="high-potential"
            label="Alto potencial de lucro"
            checked={filters.highPotential}
            onCheckedChange={(checked) => update("highPotential", checked)}
          />
          <FilterCheck
            id="has-catmat"
            label="Com código CATMAT"
            checked={filters.hasCatmat}
            onCheckedChange={(checked) => update("hasCatmat", checked)}
          />
          <FilterCheck
            id="hide-closed"
            label="Ocultar encerradas"
            checked={filters.hideClosed}
            onCheckedChange={(checked) => update("hideClosed", checked)}
          />
        </FilterSection>
      </div>

      <div className="border-t border-hairline bg-white p-4">
        <Button
          type="button"
          onClick={onApply}
          className="h-11 w-full rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white shadow-none hover:bg-[#139E3E]"
        >
          Aplicar filtros{filterCount ? ` (${filterCount})` : ""}
        </Button>
        <p className="mt-2 text-center text-[10px] font-medium text-slate-text">
          {filterCount ? `${filterCount} critérios selecionados` : "Nenhum filtro selecionado"}
        </p>
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remover filtro ${label}`}
      className="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full border border-[#BFD5F3] bg-[#EEF5FF] px-3 text-[10.5px] font-bold text-[#385579] transition-colors hover:border-[#8FB5E7] hover:bg-[#E6F0FD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
    >
      <span className="max-w-[230px] truncate">{label}</span>
      <X className="size-3" aria-hidden="true" />
    </button>
  );
}

function SearchTermChip({ term, onRemove }: { term: SearchTerm; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remover termo ${term.value}`}
      className={cn(
        "inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-[11px] font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
        term.kind === "exclude"
          ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
          : "border-[#29C454]/25 bg-brand-tint text-brand-strong hover:bg-[#DDF8E5]",
      )}
    >
      {term.kind === "exclude" ? (
        <MinusCircle className="size-3.5" aria-hidden="true" />
      ) : term.exact ? (
        <span aria-hidden="true">“ ”</span>
      ) : (
        <Check className="size-3.5" aria-hidden="true" />
      )}
      <span>{term.value}</span>
      <X className="size-3" aria-hidden="true" />
    </button>
  );
}

function NormalSearchBuilder({
  input,
  terms,
  matchMode,
  includeEquivalents,
  onInputChange,
  onAddTerms,
  onRemoveTerm,
  onMatchModeChange,
  onEquivalentsChange,
}: {
  input: string;
  terms: SearchTerm[];
  matchMode: SearchMatchMode;
  includeEquivalents: boolean;
  onInputChange: (value: string) => void;
  onAddTerms: () => void;
  onRemoveTerm: (id: string) => void;
  onMatchModeChange: (value: SearchMatchMode) => void;
  onEquivalentsChange: (checked: boolean) => void;
}) {
  const equivalents = useMemo(
    () =>
      terms
        .filter((term) => term.kind === "include")
        .flatMap((term) => getTermEquivalents(term.value))
        .filter((value, index, values) => values.indexOf(value) === index),
    [terms],
  );

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-[18px] border border-hairline bg-white p-2.5 sm:p-4">
      <div className="relative min-w-0">
        <Search
          className="pointer-events-none absolute left-3.5 top-6 size-[17px] -translate-y-1/2 text-slate-text"
          aria-hidden="true"
        />
        <Input
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAddTerms();
            }
          }}
          placeholder="Digite um termo e pressione Enter"
          aria-label="Adicionar termos à pesquisa normal"
          className="h-12 rounded-[14px] border-hairline bg-white pl-10 pr-12 text-[12.5px] shadow-none focus-visible:border-[#29C454] focus-visible:ring-[#29C454]/20 sm:text-[13px]"
        />
        <button
          type="button"
          onClick={onAddTerms}
          aria-label="Adicionar termo"
          className="absolute right-1.5 top-1.5 grid size-9 place-items-center rounded-xl bg-brand-tint text-brand-strong transition-colors hover:bg-[#DDF8E5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-1.5 truncate px-1 text-[9.5px] font-medium text-slate-text sm:mt-2 sm:whitespace-normal sm:text-[10.5px]">
        Ex.: notebook + 512 GB + i5 · use aspas para expressões exatas e “-” para excluir.
      </p>

      {terms.length ? (
        <div className="mt-4 rounded-[16px] border border-hairline bg-page/45 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.07em] text-slate-text">
              Termos da pesquisa ({terms.length})
            </p>
            <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-bold text-slate-text shadow-sm">
              {matchMode === "all" ? "Todos obrigatórios" : "Qualquer termo"}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {terms.map((term, index) => (
              <div key={term.id} className="flex items-center gap-2">
                {index > 0 && term.kind === "include" ? (
                  <span className="text-[9px] font-extrabold uppercase text-slate-text">
                    {matchMode === "all" ? "E" : "OU"}
                  </span>
                ) : null}
                <SearchTermChip term={term} onRemove={() => onRemoveTerm(term.id)} />
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 border-t border-hairline pt-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <div>
              <p className="text-[10.5px] font-extrabold text-ink">Correspondência</p>
              <RadioGroup
                value={matchMode}
                onValueChange={(value) => onMatchModeChange(value as SearchMatchMode)}
                className="mt-2 flex flex-wrap gap-4"
              >
                <label className="flex min-h-9 cursor-pointer items-center gap-2 text-[10.5px] font-bold text-ink">
                  <RadioGroupItem value="all" className="border-[#29C454] text-brand-strong" />
                  Todos os termos
                </label>
                <label className="flex min-h-9 cursor-pointer items-center gap-2 text-[10.5px] font-bold text-ink">
                  <RadioGroupItem value="any" className="border-[#29C454] text-brand-strong" />
                  Qualquer termo
                </label>
              </RadioGroup>
            </div>
            <div className="rounded-xl border border-[#29C454]/15 bg-white px-3 py-2.5">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span>
                  <span className="block text-[10.5px] font-extrabold text-ink">
                    Incluir termos equivalentes
                  </span>
                  <span className="mt-0.5 block text-[9.5px] font-medium text-slate-text">
                    Amplia sem alterar seus critérios.
                  </span>
                </span>
                <Switch
                  checked={includeEquivalents}
                  onCheckedChange={onEquivalentsChange}
                  className="data-[state=checked]:bg-[#20B94C]"
                />
              </label>
            </div>
          </div>

          {includeEquivalents && equivalents.length ? (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#EEF5FF] px-3 py-2.5 text-[#385579]">
              <Sparkles className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              <p className="text-[9.5px] font-semibold leading-relaxed">
                Também pesquisando: {equivalents.slice(0, 7).join(", ")}
                {equivalents.length > 7 ? ` e mais ${equivalents.length - 7}` : ""}.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function EssentialSearchFilters({
  filters,
  onChange,
}: {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}) {
  const updateSingleChoice = (field: "platforms" | "modalities" | "categories", value: string) =>
    onChange({ ...filters, [field]: value === "all" ? [] : [value] });

  return (
    <div className="mt-2.5 grid min-w-0 grid-cols-2 gap-2 rounded-[16px] border border-hairline bg-page/35 p-2.5 sm:grid-cols-4 sm:p-3">
      <div className="min-w-0">
        <Label className="mb-1.5 block text-[9.5px] font-bold text-slate-text">Plataforma</Label>
        <Select
          value={filters.platforms[0] ?? "all"}
          onValueChange={(value) => updateSingleChoice("platforms", value)}
        >
          <SelectTrigger className="h-10 w-full min-w-0 rounded-xl border-hairline bg-white text-[10.5px] shadow-none">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="ComprasNet">ComprasNet</SelectItem>
            <SelectItem value="Licitanet">Licitanet</SelectItem>
            <SelectItem value="Portal de Compras Públicas">Portal de Compras Públicas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-0">
        <Label className="mb-1.5 block text-[9.5px] font-bold text-slate-text">Estado</Label>
        <Select
          value={filters.state || "all"}
          onValueChange={(value) => onChange({ ...filters, state: value === "all" ? "" : value })}
        >
          <SelectTrigger className="h-10 w-full min-w-0 rounded-xl border-hairline bg-white text-[10.5px] shadow-none">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="SP">São Paulo</SelectItem>
            <SelectItem value="MG">Minas Gerais</SelectItem>
            <SelectItem value="PR">Paraná</SelectItem>
            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="hidden min-w-0 sm:block">
        <Label className="mb-1.5 block text-[9.5px] font-bold text-slate-text">Modalidade</Label>
        <Select
          value={filters.modalities[0] ?? "all"}
          onValueChange={(value) => updateSingleChoice("modalities", value)}
        >
          <SelectTrigger className="h-10 w-full min-w-0 rounded-xl border-hairline bg-white text-[10.5px] shadow-none">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Pregão">Pregão</SelectItem>
            <SelectItem value="Concorrência">Concorrência</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="hidden min-w-0 sm:block">
        <Label className="mb-1.5 block text-[9.5px] font-bold text-slate-text">Categoria</Label>
        <Select
          value={filters.categories[0] ?? "all"}
          onValueChange={(value) => updateSingleChoice("categories", value)}
        >
          <SelectTrigger className="h-10 w-full min-w-0 rounded-xl border-hairline bg-white text-[10.5px] shadow-none">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Equipamentos de TI">Equipamentos de TI</SelectItem>
            <SelectItem value="Limpeza e conservação">Limpeza e conservação</SelectItem>
            <SelectItem value="Construção civil">Construção civil</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function IntelligentCriteriaReview({
  criteria,
  onRemove,
  onConfirm,
  onEdit,
}: {
  criteria: IntelligentCriterion[];
  onRemove: (id: string) => void;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="mt-3 rounded-[16px] border border-[#29C454]/25 bg-white p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-brand-tint text-brand-strong">
              <Check className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[12px] font-extrabold text-ink">Entendi sua busca</h3>
              <p className="text-[9.5px] font-medium text-slate-text">
                Revise os critérios antes de pesquisar. Nada é aplicado silenciosamente.
              </p>
            </div>
          </div>
        </div>
        <span className="self-start rounded-full bg-brand-tint px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.06em] text-brand-strong">
          {criteria.length} identificados
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {criteria.map((item) => (
          <div
            key={item.id}
            className="flex min-h-[58px] items-start gap-2 rounded-xl border border-hairline bg-page/45 px-3 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[8.5px] font-extrabold uppercase tracking-[0.06em] text-slate-text">
                {item.label}
              </p>
              <p className="mt-1 text-[10.5px] font-extrabold leading-snug text-ink">
                {item.value}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`Remover critério ${item.label}: ${item.value}`}
              className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-text hover:bg-white hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-hairline pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          className="h-10 rounded-xl border-hairline px-4 text-[10.5px] font-extrabold shadow-none"
        >
          Editar descrição
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={!criteria.length}
          className="h-10 rounded-xl bg-[#18B849] px-4 text-[10.5px] font-extrabold text-white shadow-none hover:bg-[#139E3E]"
        >
          <Search className="size-3.5" aria-hidden="true" />
          Buscar oportunidades
        </Button>
      </div>
    </div>
  );
}

function SearchWelcomeState({
  mode,
  onQuickSearch,
  onExploreAll,
}: {
  mode: SearchMode;
  onQuickSearch: (term: string) => void;
  onExploreAll: () => void;
}) {
  if (mode === "intelligent") {
    return (
      <section className="grid gap-3 border-t border-hairline bg-page/35 p-3 py-4 sm:grid-cols-3 sm:p-5">
        {[
          ["Entende sinônimos", "Reconhece variações e termos relacionados automaticamente."],
          ["Combina requisitos", "Conecta objeto, especificações, local, valor e período."],
          ["Permite excluir termos", "Você revisa e remove qualquer critério interpretado."],
        ].map(([title, description]) => (
          <div key={title} className="rounded-2xl border border-hairline bg-white p-4">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-tint text-brand-strong">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <h2 className="mt-3 text-[12px] font-extrabold text-ink">{title}</h2>
            <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-slate-text">
              {description}
            </p>
          </div>
        ))}
      </section>
    );
  }

  const quickSearches = [
    "Notebooks em SP",
    "Serviços de limpeza",
    "Obras públicas",
    "Medicamentos",
  ];

  return (
    <section
      aria-labelledby="search-welcome-heading"
      className="border-t border-hairline bg-page/25 p-3 py-4 sm:p-5"
    >
      <div className="rounded-2xl border border-[#29C454]/20 bg-white px-4 py-5 text-center sm:px-6 sm:py-7">
        <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-brand-tint text-brand-strong">
          <FileSearch className="size-5" aria-hidden="true" />
        </span>
        <h2
          id="search-welcome-heading"
          className="mt-3 text-[16px] font-extrabold text-ink sm:text-[18px]"
        >
          Comece definindo o que procura
        </h2>
        <p className="mx-auto mt-1.5 max-w-xl text-[10.5px] font-medium leading-relaxed text-slate-text sm:text-[11.5px]">
          Informe um termo, selecione filtros ou escolha uma sugestão rápida para encontrar
          oportunidades alinhadas ao seu negócio.
        </p>
        <div className="mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center">
          {quickSearches.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onQuickSearch(item)}
              className="min-h-10 min-w-0 rounded-full border border-hairline bg-white px-2 text-[9.5px] font-bold text-ink transition-colors hover:border-[#29C454]/35 hover:bg-brand-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454] sm:px-3.5 sm:text-[10.5px]"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-hairline bg-white p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-tint text-brand-strong">
              <Clock3 className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[12px] font-extrabold text-ink">Buscas recentes</h3>
              <p className="text-[9.5px] font-medium text-slate-text">
                Suas últimas pesquisas aparecerão aqui.
              </p>
            </div>
          </div>
          <p className="mt-3 rounded-xl bg-page px-3 py-2.5 text-[10px] font-semibold text-slate-text">
            Nenhuma busca realizada nesta sessão.
          </p>
        </div>
        <div className="rounded-2xl border border-hairline bg-white p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-tint text-brand-strong">
              <Bookmark className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[12px] font-extrabold text-ink">Filtros salvos</h3>
              <p className="text-[9.5px] font-medium text-slate-text">
                Acesse rapidamente suas buscas recorrentes.
              </p>
            </div>
          </div>
          <p className="mt-3 rounded-xl bg-page px-3 py-2.5 text-[10px] font-semibold text-slate-text">
            Nenhum filtro salvo nesta demonstração.
          </p>
        </div>
      </div>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={onExploreAll}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-[11px] font-extrabold text-brand-strong hover:bg-brand-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
        >
          Explorar todas as licitações
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function TenderResultCard({
  tender,
  selected,
  onSelect,
  onFavorite,
  evidence,
  intelligent,
}: {
  tender: Tender;
  selected: boolean;
  onSelect: () => void;
  onFavorite: () => void;
  evidence: string[];
  intelligent: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[16px] border bg-white transition-all",
        selected
          ? "border-hairline bg-white sm:border-[#29C454] sm:bg-[linear-gradient(110deg,rgba(236,252,241,0.9),rgba(255,255,255,1))] sm:shadow-[0_10px_28px_rgba(24,184,73,0.08)]"
          : "border-hairline hover:border-[#29C454]/35 hover:shadow-[0_10px_24px_rgba(15,23,42,0.05)]",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`Visualizar ${tender.code}`}
        className="block w-full p-3 pr-11 text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#29C454] sm:p-4 sm:pr-12"
      >
        <div className="flex min-w-0 gap-2.5 sm:gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-[#29C454]/15 bg-brand-tint text-brand-strong sm:size-10">
            <Store className="size-4 sm:size-[18px]" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
              <span className="shrink-0 rounded-full bg-brand-tint px-2 py-1 text-[8.5px] font-extrabold text-brand-strong sm:px-2.5 sm:text-[9px]">
                {tender.modality}
              </span>
              <span className="shrink-0 text-[9px] font-bold text-slate-text sm:text-[9.5px]">
                {tender.code}
              </span>
              <span className="hidden truncate rounded-full border border-hairline bg-page px-2 py-1 text-[8.5px] font-bold text-slate-text min-[410px]:inline sm:inline">
                {tender.category}
              </span>
            </div>
            <div className="mt-1.5 grid min-w-0 gap-1.5 sm:mt-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-2">
              <div className="min-w-0">
                <p className="text-[9px] font-semibold text-slate-text sm:text-[9.5px]">
                  {tender.platform}
                </p>
                <h3 className="mt-1 line-clamp-2 text-[12px] font-extrabold leading-[1.35] text-ink sm:mt-1.5 sm:text-[13px] sm:leading-[1.45]">
                  {tender.title}
                </h3>
              </div>
              <div className="flex items-end justify-between gap-3 sm:block sm:text-right">
                <p className="text-[12px] font-extrabold text-ink sm:text-[12.5px]">
                  {moneyFormatter.format(tender.value)}
                </p>
                <p className="text-[8px] font-semibold text-slate-text sm:mt-0.5 sm:text-[8.5px]">
                  Valor estimado
                </p>
              </div>
            </div>
            <div className="mt-2 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-x-2 text-[9px] font-semibold text-slate-text sm:mt-2.5 sm:flex sm:flex-wrap sm:gap-x-3 sm:gap-y-1.5 sm:text-[9.5px]">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate sm:max-w-[230px]">{tender.agency}</span>
              </span>
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <MapPin className="size-3.5" aria-hidden="true" />
                {tender.city} · {tender.state}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                <span className="sm:hidden">{tender.opening.split(" ")[0]}</span>
                <span className="hidden sm:inline">{tender.opening}</span>
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-hairline pt-2.5 sm:mt-3 sm:items-end">
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[9px] font-extrabold",
                  tender.status === "Aberto"
                    ? "bg-[#EAF2FF] text-[#215EC9]"
                    : "bg-orange-50 text-orange-600",
                )}
              >
                {tender.status}
              </span>
              <span className="inline-flex items-center gap-2.5">
                <span className="text-right">
                  <span className="block text-[16px] font-extrabold leading-none text-[#20B94C] sm:text-[18px]">
                    {tender.match}%
                  </span>
                  <span className="mt-1 block text-[7.5px] font-bold uppercase tracking-[0.06em] text-slate-text">
                    aderência
                  </span>
                </span>
                <span className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-[#29C454]/25 bg-brand-tint px-3 text-[9.5px] font-extrabold text-brand-strong shadow-sm sm:bg-white sm:text-ink">
                  <span className="sm:hidden">Ver detalhes</span>
                  <ArrowRight className="size-3.5 sm:size-4" aria-hidden="true" />
                </span>
              </span>
            </div>
            {intelligent && evidence.length ? (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {evidence.slice(0, 1).map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[8.5px] font-bold text-[#1E7640] shadow-sm"
                  >
                    <Check className="size-3" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={onFavorite}
        aria-label={`Favoritar ${tender.code}`}
        className="absolute right-1.5 top-1.5 grid size-9 place-items-center rounded-xl text-slate-text transition-colors hover:bg-white hover:text-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454] sm:right-2.5 sm:top-2.5"
      >
        <Star className="size-4" aria-hidden="true" />
      </button>
    </article>
  );
}

function DetailMeta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-slate-text" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[8.5px] font-bold uppercase tracking-[0.05em] text-slate-text">
          {label}
        </p>
        <p className="mt-1 text-[10px] font-bold leading-snug text-ink">{value}</p>
      </div>
    </div>
  );
}

function MobileDetailSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-[16px] border border-hairline bg-white md:hidden"
    >
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-[11.5px] font-extrabold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454] [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          className="size-4 shrink-0 text-slate-text transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="border-t border-hairline px-4 py-3">{children}</div>
    </details>
  );
}

function TenderDetailPreview({ tender }: { tender: Tender }) {
  const itemDetails =
    tender.category === "Equipamentos de TI"
      ? [
          "Notebook 15,6” Full HD (1920x1080), antirreflexo",
          "Processador Intel Core i5 13ª geração ou superior",
          "Memória RAM: 16 GB DDR4 ou superior",
          "Armazenamento: SSD 512 GB NVMe",
          "Sistema Operacional: Windows 11 Pro (64 bits)",
          "Conectividade: Wi-Fi 6, Bluetooth 5.2",
          "Garantia: 36 meses on-site",
        ]
      : tender.specifications;
  const requirements = [
    "Edital e anexos",
    "Termo de referência",
    "Modelo de proposta",
    "Minuta do contrato",
    "Declaração de habilitação",
    "Documentos de habilitação jurídica",
    "Certidões fiscais e trabalhistas",
    "Atestado de capacidade técnica",
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5 xl:px-5 2xl:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[17px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[19px]">
                {tender.code} — {tender.title.replace(/\.$/, "")}
              </h2>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[9px] font-extrabold",
                  tender.status === "Aberto"
                    ? "bg-[#EAF2FF] text-[#215EC9]"
                    : "bg-orange-50 text-orange-600",
                )}
              >
                {tender.status}
              </span>
              <button
                type="button"
                aria-label={`Favoritar ${tender.code}`}
                onClick={() => toast.success(`${tender.code} foi adicionado aos favoritos.`)}
                className="grid size-9 place-items-center rounded-xl text-slate-text hover:bg-brand-tint hover:text-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
              >
                <Star className="size-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-[10.5px] font-medium leading-relaxed text-slate-text">
              {tender.title}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[25px] font-extrabold leading-none text-[#20B94C]">
              {tender.match}%
            </p>
            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.08em] text-slate-text">
              aderência
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 border-y border-hairline py-4 sm:mt-5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-6">
          <DetailMeta icon={Building2} label="Órgão" value={tender.agency} />
          <DetailMeta icon={Store} label="Plataforma" value={tender.platform} />
          <DetailMeta
            icon={MapPin}
            label="Localização"
            value={`${tender.city} · ${tender.state}`}
          />
          <DetailMeta icon={CalendarDays} label="Abertura" value={tender.opening} />
          <DetailMeta icon={Clock3} label="Recebimento de propostas" value="Até 22/08/2026 17:00" />
          <DetailMeta
            icon={Target}
            label="Valor estimado"
            value={moneyFormatter.format(tender.value)}
          />
        </div>

        <div className="mt-4 space-y-2.5 md:hidden">
          <MobileDetailSection title="Itens principais" defaultOpen>
            <ul className="space-y-2 text-[10px] font-medium leading-relaxed text-slate-text">
              {itemDetails.slice(0, 5).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-[7px] size-1 shrink-0 rounded-full bg-brand-strong" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg text-[10px] font-extrabold text-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
            >
              Ver todos os itens
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          </MobileDetailSection>
          <MobileDetailSection title="Prazos da licitação">
            <dl className="divide-y divide-hairline text-[9.5px]">
              {[
                ["Publicação do edital", "05/08/2026"],
                ["Abertura da sessão pública", tender.opening],
                ["Recebimento de propostas", "Até 22/08/2026 17:00"],
                ["Impugnações", "Até 18/08/2026 17:00"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 py-2.5 first:pt-0"
                >
                  <dt className="font-medium text-slate-text">{label}</dt>
                  <dd className="text-right font-bold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </MobileDetailSection>
          <MobileDetailSection title="Documentos e requisitos">
            <div className="grid gap-2">
              {requirements.slice(0, 5).map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 text-[9.5px] font-medium text-slate-text"
                >
                  <CircleCheckBig
                    className="size-3.5 shrink-0 text-brand-strong"
                    aria-hidden="true"
                  />
                  {item}
                </span>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-3 h-10 w-full rounded-xl border-hairline px-4 text-[9.5px] font-extrabold shadow-none"
            >
              <FileText className="size-3.5" aria-hidden="true" />
              Ver todos os documentos
            </Button>
          </MobileDetailSection>
        </div>

        <div className="mt-4 hidden gap-3 md:grid lg:grid-cols-2">
          <section className="rounded-[16px] border border-hairline bg-white p-4 py-0">
            <h3 className="pt-4 text-[11.5px] font-extrabold text-ink">Itens principais</h3>
            <ul className="mt-3 space-y-1.5 pb-3 text-[9.5px] font-medium leading-relaxed text-slate-text">
              {itemDetails.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-[7px] size-1 shrink-0 rounded-full bg-brand-strong" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mb-4 inline-flex min-h-9 items-center gap-1.5 rounded-lg text-[9.5px] font-extrabold text-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
            >
              Ver mais itens e especificações
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </button>
          </section>

          <section className="rounded-[16px] border border-hairline bg-white p-4 py-0">
            <h3 className="pt-4 text-[11.5px] font-extrabold text-ink">Prazos</h3>
            <dl className="mt-3 divide-y divide-hairline pb-4 text-[9.5px]">
              {[
                ["Publicação do edital", "05/08/2026"],
                ["Abertura da sessão pública", tender.opening],
                ["Recebimento de propostas", "Até 22/08/2026 17:00"],
                ["Impugnações", "Até 18/08/2026 17:00"],
                ["Pedidos de esclarecimentos", "Até 18/08/2026 17:00"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 py-2.5 first:pt-0"
                >
                  <dt className="font-medium text-slate-text">{label}</dt>
                  <dd className="text-right font-bold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section className="mt-3 hidden rounded-[16px] border border-hairline bg-white p-4 py-0 md:block">
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-[11.5px] font-extrabold text-ink">Documentos e requisitos</h3>
              <div className="mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                {requirements.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 text-[9.5px] font-medium text-slate-text"
                  >
                    <CircleCheckBig
                      className="size-3.5 shrink-0 text-brand-strong"
                      aria-hidden="true"
                    />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 shrink-0 rounded-xl border-hairline px-4 text-[9.5px] font-extrabold shadow-none"
            >
              <FileText className="size-3.5" aria-hidden="true" />
              Ver documentos
            </Button>
          </div>
        </section>

        <section className="mt-3 rounded-[16px] border border-[#29C454]/25 bg-[linear-gradient(100deg,#F0FCF4,#F8FEFA)] p-4 py-0">
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#20B94C] text-white shadow-sm">
              <Check className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[11.5px] font-extrabold text-[#176C36]">
                Por que combina com sua empresa
              </h3>
              <p className="mt-1 text-[9.5px] font-medium leading-relaxed text-slate-text">
                Sua empresa possui CNAE compatível, já venceu licitações similares e tem histórico
                positivo com este órgão.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 shrink-0 rounded-xl border-[#29C454]/30 bg-white px-4 text-[9.5px] font-extrabold text-brand-strong shadow-none"
            >
              Ver análise completa
              <Target className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </section>
      </div>

      <div className="grid shrink-0 grid-cols-[0.72fr_0.9fr_1.35fr] gap-1.5 border-t border-hairline bg-white p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:grid-cols-3 sm:gap-2 sm:p-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => toast.info("Abrindo o edital e seus anexos.")}
          className="h-11 rounded-xl border-hairline px-2 text-[9.5px] font-extrabold shadow-none sm:px-4 sm:text-[10.5px]"
        >
          <span className="sm:hidden">Edital</span>
          <span className="hidden sm:inline">Ver edital</span>
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => toast.info(`Detalhes completos de ${tender.code}.`)}
          className="h-11 rounded-xl border-hairline px-2 text-[9.5px] font-extrabold shadow-none sm:px-4 sm:text-[10.5px]"
        >
          <span className="sm:hidden">Detalhes</span>
          <span className="hidden sm:inline">Ver detalhes completos</span>
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          onClick={() => toast.success("Oportunidade marcada como interessante.")}
          className="h-11 rounded-xl bg-[#18B849] px-2 text-[9.5px] font-extrabold text-white shadow-none hover:bg-[#139E3E] sm:px-4 sm:text-[10.5px]"
        >
          Tenho interesse
          <Send className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

function SaveFilterDialog({
  open,
  onOpenChange,
  criteria,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  criteria: string[];
  onSaved: (name: string) => void;
}) {
  const [name, setName] = useState("Notebooks · SP · Pregão");
  const [alerts, setAlerts] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [frequency, setFrequency] = useState("daily");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Dê um nome para este filtro.");
      return;
    }
    try {
      window.localStorage.setItem(
        "licitabase:last-saved-filter",
        JSON.stringify({ name: trimmedName, alerts, favorite, frequency, criteria }),
      );
    } catch {
      // O protótipo continua funcional quando o armazenamento local estiver indisponível.
    }
    onSaved(trimmedName);
    onOpenChange(false);
    toast.success("Filtro salvo", {
      description: alerts
        ? "Você receberá atualizações sobre novas oportunidades."
        : "A busca foi adicionada aos seus filtros salvos.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-slate-950/35 backdrop-blur-[1px]"
        className="w-[calc(100%-24px)] max-w-[520px] gap-0 overflow-hidden rounded-[24px] border-hairline bg-white p-0 font-manrope shadow-[0_24px_80px_rgba(15,23,42,0.22)] max-sm:bottom-0 max-sm:top-auto max-sm:w-full max-sm:max-w-none max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-[26px]"
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-hairline px-5 py-5 text-left sm:px-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-tint text-brand-strong">
                <Bookmark className="size-[18px]" aria-hidden="true" />
              </span>
              <div>
                <DialogTitle className="text-[18px] font-extrabold text-ink">
                  Salvar filtro
                </DialogTitle>
                <DialogDescription className="mt-1 text-[11.5px] font-medium text-slate-text">
                  Reutilize esta busca e acompanhe novas oportunidades.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[65dvh] space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <div>
              <Label
                htmlFor="saved-filter-name"
                className="mb-2 block text-[11px] font-extrabold text-ink"
              >
                Nome do filtro
              </Label>
              <Input
                id="saved-filter-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 rounded-xl border-hairline text-[13px] shadow-none focus-visible:border-[#29C454] focus-visible:ring-[#29C454]/20"
              />
            </div>

            <div className="rounded-[16px] border border-hairline bg-page/45 p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="save-filter-alerts"
                  checked={alerts}
                  onCheckedChange={(value) => setAlerts(value === true)}
                  className="mt-0.5 size-[18px] rounded-[5px] border-slate-300 data-[state=checked]:bg-[#21B84B]"
                />
                <div className="min-w-0 flex-1">
                  <Label
                    htmlFor="save-filter-alerts"
                    className="cursor-pointer text-[12px] font-extrabold text-ink"
                  >
                    Receber alertas
                  </Label>
                  <p className="mt-1 text-[10.5px] font-medium leading-relaxed text-slate-text">
                    Avisar quando novas licitações compatíveis forem publicadas.
                  </p>
                  {alerts ? (
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger className="mt-3 h-10 rounded-xl border-hairline bg-white text-[12px] shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="instant">Assim que forem publicadas</SelectItem>
                        <SelectItem value="daily">Resumo diário</SelectItem>
                        <SelectItem value="weekly">Resumo semanal</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-extrabold text-ink">
                Resumo dos critérios ({criteria.length})
              </p>
              <div className="mt-2.5 flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                {criteria.length ? (
                  criteria.map((criterion) => (
                    <span
                      key={criterion}
                      className="rounded-full bg-brand-tint px-2.5 py-1.5 text-[9.5px] font-bold text-brand-strong"
                    >
                      {criterion}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] font-medium text-slate-text">
                    A busca será salva sem filtros adicionais.
                  </span>
                )}
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 border-t border-hairline pt-4">
              <Checkbox
                checked={favorite}
                onCheckedChange={(value) => setFavorite(value === true)}
                className="mt-0.5 size-[18px] rounded-[5px] border-slate-300 data-[state=checked]:bg-[#21B84B]"
              />
              <span>
                <span className="block text-[11.5px] font-extrabold text-ink">
                  Favoritar este filtro
                </span>
                <span className="mt-0.5 block text-[10.5px] font-medium text-slate-text">
                  Acesso rápido em “Filtros salvos”.
                </span>
              </span>
            </label>
          </div>

          <DialogFooter className="flex-row justify-end gap-2 border-t border-hairline bg-page/35 px-5 py-4 sm:px-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-xl px-4 text-[12px] font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-xl bg-[#18B849] px-5 text-[12px] font-extrabold text-white shadow-none hover:bg-[#139E3E]"
            >
              Salvar filtro
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TenderSearchPage() {
  const [mode, setMode] = useState<SearchMode>("normal");
  const [searchText, setSearchText] = useState("");
  const [searchTerms, setSearchTerms] = useState<SearchTerm[]>([]);
  const [activeSearchTerms, setActiveSearchTerms] = useState<SearchTerm[]>([]);
  const [matchMode, setMatchMode] = useState<SearchMatchMode>("all");
  const [activeMatchMode, setActiveMatchMode] = useState<SearchMatchMode>("all");
  const [includeEquivalents, setIncludeEquivalents] = useState(true);
  const [activeIncludeEquivalents, setActiveIncludeEquivalents] = useState(true);
  const [intelligentText, setIntelligentText] = useState(
    "Preciso encontrar notebooks com i5, SSD de pelo menos 512 GB, para a Prefeitura de São Paulo acima de R$ 500 mil, com abertura nos próximos 30 dias e que não sejam equipamentos usados.",
  );
  const [interpretedCriteria, setInterpretedCriteria] = useState<IntelligentCriterion[]>([]);
  const [appliedIntelligentCriteria, setAppliedIntelligentCriteria] = useState<
    IntelligentCriterion[]
  >([]);
  const [intelligentReviewOpen, setIntelligentReviewOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<SearchFilters>(initialFilters);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>(initialFilters);
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [savedFilterName, setSavedFilterName] = useState("");
  const [sort, setSort] = useState("relevant");
  const [aiLoading, setAiLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [mobileSearchCollapsed, setMobileSearchCollapsed] = useState(false);
  const [hasOpenedDetail, setHasOpenedDetail] = useState(false);
  const [visibleResultCount, setVisibleResultCount] = useState(4);

  const activeLabels = useMemo(() => getActiveFilterLabels(activeFilters), [activeFilters]);
  const draftLabels = useMemo(() => getActiveFilterLabels(draftFilters), [draftFilters]);
  const canRunNormalSearch = Boolean(searchText.trim() || searchTerms.length || draftLabels.length);

  const filteredTenders = useMemo(() => {
    const query = normalize(activeFilters.keyword);
    const agency = normalize(activeFilters.agency);
    const process = normalize(activeFilters.process);
    const minimum = parseFilterCurrency(activeFilters.minValue);
    const maximum = parseFilterCurrency(activeFilters.maxValue) || Number.POSITIVE_INFINITY;

    const results = tenders.filter((tender) => {
      const searchable = normalize(
        `${tender.code} ${tender.title} ${tender.agency} ${tender.city} ${tender.state} ${tender.category} ${tender.platform} ${tender.specifications.join(" ")}`,
      );
      if (query && !searchable.includes(query)) return false;
      if (agency && !normalize(tender.agency).includes(agency)) return false;
      if (process && !normalize(tender.code).includes(process)) return false;
      if (activeFilters.state && tender.state !== activeFilters.state) return false;
      if (activeFilters.city && tender.city !== activeFilters.city) return false;
      if (activeFilters.modalities.length && !activeFilters.modalities.includes(tender.modality))
        return false;
      if (activeFilters.categories.length && !activeFilters.categories.includes(tender.category))
        return false;
      if (activeFilters.platforms.length && !activeFilters.platforms.includes(tender.platform))
        return false;
      if (tender.value < minimum || tender.value > maximum) return false;
      if (activeFilters.highPotential && tender.match < 88) return false;

      if (activeSearchTerms.length) {
        const includedTerms = activeSearchTerms.filter((term) => term.kind === "include");
        const excludedTerms = activeSearchTerms.filter((term) => term.kind === "exclude");
        const matchesTerm = (term: SearchTerm) =>
          getSearchVariants(term.value, activeIncludeEquivalents).some((variant) =>
            searchable.includes(normalizeTenderSearchTerm(variant)),
          );
        if (excludedTerms.some(matchesTerm)) return false;
        if (
          includedTerms.length &&
          (activeMatchMode === "all"
            ? !includedTerms.every(matchesTerm)
            : !includedTerms.some(matchesTerm))
        )
          return false;
      }
      return true;
    });

    return [...results].sort((first, second) => {
      if (sort === "value") return second.value - first.value;
      if (sort === "recent") return first.opening.localeCompare(second.opening);
      return second.match - first.match;
    });
  }, [activeFilters, activeIncludeEquivalents, activeMatchMode, activeSearchTerms, sort]);

  const resultEvidence = useMemo(() => {
    const byTender = new Map<string, string[]>();
    filteredTenders.forEach((tender) => {
      const searchable = normalizeTenderSearchTerm(
        `${tender.title} ${tender.agency} ${tender.city} ${tender.state} ${tender.category} ${tender.specifications.join(" ")}`,
      );
      const evidence = appliedIntelligentCriteria.flatMap((item) => {
        if (item.type === "min-value")
          return tender.value >= Number(item.value)
            ? [`Acima de ${moneyFormatter.format(Number(item.value))}`]
            : [];
        if (item.type === "max-value")
          return tender.value <= Number(item.value)
            ? [`Até ${moneyFormatter.format(Number(item.value))}`]
            : [];
        if (item.type === "period") return [item.value];
        if (item.type === "exclusion") return ["Equipamento novo"];
        const matches = criterionSearchValues(item).some((value) =>
          searchable.includes(normalizeTenderSearchTerm(value)),
        );
        return matches ? [item.value] : [];
      });
      byTender.set(tender.id, evidence);
    });
    return byTender;
  }, [appliedIntelligentCriteria, filteredTenders]);

  const selectedTender = filteredTenders.find((tender) => tender.id === selectedTenderId) ?? null;

  const selectTender = (tender: Tender) => {
    toast.dismiss();
    setSelectedTenderId(tender.id);
    setHasOpenedDetail(true);
    if (window.matchMedia("(max-width: 1279px)").matches) setDetailOpen(true);
  };

  const changeMode = (nextMode: SearchMode) => {
    setMode(nextMode);
    setHasSearched(false);
    setSelectedTenderId(null);
    setHasOpenedDetail(false);
    setMobileSearchCollapsed(false);
  };

  const runQuickSearch = (label: string) => {
    const next: SearchFilters = {
      ...initialFilters,
      keyword:
        label === "Notebooks em SP"
          ? "notebook"
          : label === "Serviços de limpeza"
            ? "limpeza"
            : label === "Obras públicas"
              ? "obra"
              : "medicamento",
      state: label === "Notebooks em SP" ? "SP" : "",
    };
    setMode("normal");
    setDraftFilters(next);
    setActiveFilters(next);
    setSearchText("");
    setSearchTerms([]);
    setActiveSearchTerms([]);
    setAppliedIntelligentCriteria([]);
    setHasSearched(true);
    setSelectedTenderId(null);
    setHasOpenedDetail(false);
    setMobileSearchCollapsed(true);
    setVisibleResultCount(4);
  };

  const exploreAllTenders = () => {
    setMode("normal");
    setDraftFilters(initialFilters);
    setActiveFilters(initialFilters);
    setSearchText("");
    setSearchTerms([]);
    setActiveSearchTerms([]);
    setAppliedIntelligentCriteria([]);
    setHasSearched(true);
    setSelectedTenderId(null);
    setHasOpenedDetail(false);
    setMobileSearchCollapsed(true);
    setVisibleResultCount(4);
  };

  const totalResults = useMemo(() => {
    if (!filteredTenders.length) return 0;
    if (
      normalize(activeFilters.keyword).includes("notebook") ||
      activeSearchTerms.some((term) => normalize(term.value).includes("notebook"))
    )
      return 128;
    if (activeLabels.length > 4) return 96;
    return 42_368;
  }, [activeFilters.keyword, activeLabels.length, activeSearchTerms, filteredTenders.length]);

  const applyDraftFilters = () => {
    const nextLabels = getActiveFilterLabels(draftFilters);
    if (!nextLabels.length && !searchTerms.length) {
      toast.info("Adicione pelo menos um critério para pesquisar.");
      return;
    }
    setActiveFilters(draftFilters);
    setSearchText(draftFilters.keyword);
    setMobileSearchCollapsed(true);
    setVisibleResultCount(4);
    setMobileFiltersOpen(false);
    setHasSearched(true);
    setSelectedTenderId(null);
    setHasOpenedDetail(false);
    toast.success("Filtros aplicados", {
      description: `${getActiveFilterLabels(draftFilters).length} critérios estão ativos.`,
    });
  };

  const removeFilter = (label: string) => {
    const next = { ...activeFilters };
    if (label.startsWith("Palavra-chave:")) next.keyword = "";
    else if (label.startsWith("Órgão:")) next.agency = "";
    else if (label.startsWith("Processo:")) next.process = "";
    else if (label.startsWith("Modalidade:"))
      next.modalities = next.modalities.filter((item) => label !== `Modalidade: ${item}`);
    else if (label.startsWith("Categoria:"))
      next.categories = next.categories.filter((item) => label !== `Categoria: ${item}`);
    else if (label.startsWith("Plataforma:"))
      next.platforms = next.platforms.filter((item) => label !== `Plataforma: ${item}`);
    else if (label === next.state) next.state = "";
    else if (label === next.city) next.city = "";
    else if (label === "Apenas favoritos") next.favoritesOnly = false;
    else if (label === "Alto potencial") next.highPotential = false;
    else if (label === "Com código CATMAT") next.hasCatmat = false;
    else if (label === "Abertos") next.hideClosed = false;
    else if (label.startsWith("Valor mínimo:")) next.minValue = "";
    else if (label.startsWith("Valor máximo:")) next.maxValue = "";
    setActiveFilters(next);
    setDraftFilters(next);
  };

  const clearFilters = () => {
    const cleared: SearchFilters = {
      ...initialFilters,
      state: "",
      modalities: [],
      hideClosed: false,
    };
    setDraftFilters(cleared);
    setActiveFilters(cleared);
    setSearchText("");
    setSearchTerms([]);
    setActiveSearchTerms([]);
    setInterpretedCriteria([]);
    setAppliedIntelligentCriteria([]);
    setIntelligentReviewOpen(false);
    setMobileSearchCollapsed(false);
    setVisibleResultCount(4);
    setHasSearched(false);
    setSelectedTenderId(null);
    setHasOpenedDetail(false);
  };

  const addSearchTerms = () => {
    const parsed = parseSearchTerms(searchText);
    if (!parsed.length) return;
    setSearchTerms((current) => {
      const existing = new Set(
        current.map((term) => `${term.kind}:${normalizeTenderSearchTerm(term.value)}`),
      );
      return [
        ...current,
        ...parsed.filter(
          (term) => !existing.has(`${term.kind}:${normalizeTenderSearchTerm(term.value)}`),
        ),
      ];
    });
    setSearchText("");
  };

  const runNormalSearch = () => {
    const pendingTerms = parseSearchTerms(searchText);
    const combinedTerms = [...searchTerms];
    const existing = new Set(
      combinedTerms.map((term) => `${term.kind}:${normalizeTenderSearchTerm(term.value)}`),
    );
    pendingTerms.forEach((term) => {
      const key = `${term.kind}:${normalizeTenderSearchTerm(term.value)}`;
      if (!existing.has(key)) combinedTerms.push(term);
    });
    const next = { ...draftFilters, keyword: "" };
    setDraftFilters(next);
    setActiveFilters(next);
    setSearchTerms(combinedTerms);
    setActiveSearchTerms(combinedTerms);
    setActiveMatchMode(matchMode);
    setActiveIncludeEquivalents(includeEquivalents);
    setAppliedIntelligentCriteria([]);
    setSearchText("");
    if (!combinedTerms.length && !getActiveFilterLabels(next).length) {
      toast.info("Adicione pelo menos um termo para pesquisar.");
      return;
    }
    setMobileSearchCollapsed(true);
    setVisibleResultCount(4);
    setHasSearched(true);
    setSelectedTenderId(null);
    setHasOpenedDetail(false);
  };

  const runIntelligentSearch = () => {
    if (!intelligentText.trim()) {
      toast.error("Descreva o que você procura.");
      return;
    }
    setAiLoading(true);
    window.setTimeout(() => {
      const criteria = interpretTenderSearchIntent(intelligentText);
      setInterpretedCriteria(criteria);
      setIntelligentReviewOpen(true);
      setAiLoading(false);
      if (criteria.length) {
        toast.success("Busca interpretada", {
          description: "Revise os critérios identificados antes de pesquisar.",
        });
      } else {
        toast.info("Não identificamos critérios suficientes.", {
          description: "Tente informar objeto, especificações, local ou faixa de valor.",
        });
      }
    }, 900);
  };

  const confirmIntelligentSearch = () => {
    const objectCriteria = interpretedCriteria.filter(
      (item) => item.type === "object" || item.type === "specification",
    );
    const exclusionCriteria = interpretedCriteria.filter((item) => item.type === "exclusion");
    const nextTerms: SearchTerm[] = [
      ...objectCriteria.map((item, index) => ({
        id: `intelligent-${index}-${item.id}`,
        value:
          item.type === "specification" && /512\s*GB/i.test(item.value)
            ? "512 GB"
            : (criterionSearchValues(item)[0] ?? item.value.replace(/\s+ou equivalente$/i, "")),
        kind: "include" as const,
        exact: false,
      })),
      ...exclusionCriteria.map((item, index) => ({
        id: `intelligent-exclude-${index}-${item.id}`,
        value: item.value,
        kind: "exclude" as const,
        exact: false,
      })),
    ];
    const agency = interpretedCriteria.find((item) => item.type === "agency")?.value ?? "";
    const location = interpretedCriteria.find((item) => item.type === "location")?.value ?? "";
    const minimum = interpretedCriteria.find((item) => item.type === "min-value")?.value ?? "";
    const maximum = interpretedCriteria.find((item) => item.type === "max-value")?.value ?? "";
    const interpreted: SearchFilters = {
      ...initialFilters,
      keyword: "",
      agency,
      state: location ? "SP" : initialFilters.state,
      minValue: minimum,
      maxValue: maximum,
    };
    setDraftFilters(interpreted);
    setActiveFilters(interpreted);
    setActiveSearchTerms(nextTerms);
    setActiveMatchMode("all");
    setActiveIncludeEquivalents(true);
    setAppliedIntelligentCriteria(interpretedCriteria);
    setIntelligentReviewOpen(false);
    setMobileSearchCollapsed(true);
    setVisibleResultCount(4);
    setHasSearched(true);
    setSelectedTenderId(null);
    setHasOpenedDetail(false);
    toast.success("Critérios confirmados", {
      description: "Os resultados agora mostram as evidências de aderência.",
    });
  };

  return (
    <div
      data-tender-search-page
      className="tender-search-page min-h-0 min-w-0 w-full max-w-[100vw] flex-1 overflow-x-hidden overflow-y-auto overscroll-contain bg-[#F8FAFC] font-manrope"
    >
      <div className="min-w-0 w-full max-w-full px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <div className="flex flex-nowrap items-center gap-2 sm:gap-2.5">
              <span className="h-8 w-1 rounded-full bg-[#29C454]" aria-hidden="true" />
              <h1 className="min-w-0 whitespace-nowrap text-[22px] font-extrabold tracking-[-0.03em] text-ink min-[390px]:text-[23px] sm:text-[28px]">
                Buscar licitações
              </h1>
              <span className="hidden shrink-0 rounded-full border border-[#29C454]/15 bg-brand-tint px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.05em] text-brand-strong min-[360px]:inline-flex sm:px-2.5 sm:text-[9px] sm:tracking-[0.07em]">
                Demonstração
              </span>
            </div>
            <p className="mt-1.5 line-clamp-1 pl-3 text-[11px] font-medium text-slate-text sm:text-[13px]">
              Encontre oportunidades abertas para propostas com busca e filtros precisos.
            </p>
          </div>
          {savedFilterName ? (
            <div className="inline-flex min-h-10 items-center gap-2 self-start rounded-xl border border-[#29C454]/20 bg-brand-tint px-3 text-[10.5px] font-bold text-brand-strong sm:self-auto">
              <Check className="size-3.5" aria-hidden="true" />
              Filtro salvo: {savedFilterName}
            </div>
          ) : null}
        </header>

        <div className="mt-4 min-w-0 max-w-full overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:mt-6">
          <div className="border-b border-hairline p-2.5 sm:p-4 lg:p-5">
            <div className="inline-flex w-full rounded-[14px] border border-hairline bg-page p-1 sm:w-auto">
              <button
                type="button"
                onClick={() => changeMode("normal")}
                aria-pressed={mode === "normal"}
                className={cn(
                  "flex min-h-10 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[11px] px-2 text-[10.5px] font-extrabold transition-all sm:flex-none sm:gap-2 sm:px-4 sm:text-[11.5px]",
                  mode === "normal"
                    ? "bg-white text-ink shadow-sm"
                    : "text-slate-text hover:text-ink",
                )}
              >
                <Search className="size-4" aria-hidden="true" />
                Pesquisa normal
              </button>
              <button
                type="button"
                onClick={() => changeMode("intelligent")}
                aria-pressed={mode === "intelligent"}
                className={cn(
                  "flex min-h-10 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[11px] px-2 text-[10.5px] font-extrabold transition-all sm:flex-none sm:gap-2 sm:px-4 sm:text-[11.5px]",
                  mode === "intelligent"
                    ? "bg-white text-brand-strong shadow-sm"
                    : "text-slate-text hover:text-ink",
                )}
              >
                <Sparkles className="size-4" aria-hidden="true" />
                Busca inteligente
              </button>
            </div>
          </div>

          <div
            className={cn(
              "grid min-w-0",
              desktopFiltersOpen ? "xl:grid-cols-[250px_minmax(0,1fr)]" : "grid-cols-1",
            )}
          >
            {desktopFiltersOpen ? (
              <aside className="hidden min-h-0 border-r border-hairline bg-white xl:block">
                <div className="sticky top-0 h-[calc(100dvh-170px)] min-h-[620px]">
                  <FiltersPanel
                    filters={draftFilters}
                    onChange={setDraftFilters}
                    onClear={clearFilters}
                    onApply={applyDraftFilters}
                  />
                </div>
              </aside>
            ) : null}

            <main className="min-w-0">
              <div className="border-b border-hairline p-3 sm:p-4 lg:p-5">
                {mobileSearchCollapsed ? (
                  <div className="flex min-h-[58px] items-center justify-between gap-3 rounded-[16px] border border-[#29C454]/20 bg-brand-tint/55 px-3 md:hidden">
                    <div className="min-w-0">
                      <p className="text-[10.5px] font-extrabold text-ink">Busca aplicada</p>
                      <p className="mt-0.5 truncate text-[9.5px] font-semibold text-slate-text">
                        {mode === "normal"
                          ? `${activeSearchTerms.length || "Sem"} termos · ${activeLabels.length} filtros`
                          : `${appliedIntelligentCriteria.length} critérios inteligentes`}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMobileSearchCollapsed(false)}
                      className="h-10 shrink-0 rounded-xl border-[#29C454]/25 bg-white px-3 text-[10px] font-extrabold text-brand-strong shadow-none"
                    >
                      Editar busca
                    </Button>
                  </div>
                ) : null}

                <div className={cn(mobileSearchCollapsed && "hidden md:block")}>
                  {mode === "normal" ? (
                    <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-3">
                      <div className="min-w-0">
                        <NormalSearchBuilder
                          input={searchText}
                          terms={searchTerms}
                          matchMode={matchMode}
                          includeEquivalents={includeEquivalents}
                          onInputChange={setSearchText}
                          onAddTerms={addSearchTerms}
                          onRemoveTerm={(id) =>
                            setSearchTerms((terms) => terms.filter((term) => term.id !== id))
                          }
                          onMatchModeChange={setMatchMode}
                          onEquivalentsChange={setIncludeEquivalents}
                        />
                        {!hasSearched ? (
                          <EssentialSearchFilters
                            filters={draftFilters}
                            onChange={setDraftFilters}
                          />
                        ) : null}
                      </div>
                      <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_auto] gap-2 sm:flex sm:flex-wrap lg:max-w-[310px]">
                        <Button
                          type="button"
                          onClick={runNormalSearch}
                          disabled={!canRunNormalSearch}
                          className="h-11 rounded-[14px] bg-[#18B849] px-3 text-[11px] font-extrabold text-white shadow-none hover:bg-[#139E3E] sm:h-12 sm:px-5 sm:text-[12px]"
                        >
                          <Search className="size-4" aria-hidden="true" />
                          Buscar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setMobileFiltersOpen(true)}
                          className="h-11 rounded-[14px] border-hairline px-2 text-[10.5px] font-extrabold shadow-none sm:h-12 sm:px-3 sm:text-[11.5px] xl:hidden"
                        >
                          <Filter className="size-4" aria-hidden="true" />
                          {hasSearched ? "Filtros" : "Mais filtros"}
                          {activeLabels.length ? (
                            <span className="rounded-full bg-brand-tint px-1.5 py-0.5 text-[9px] text-brand-strong">
                              {activeLabels.length}
                            </span>
                          ) : null}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setDesktopFiltersOpen((open) => !open)}
                          className="hidden h-12 rounded-[14px] border-hairline px-3 text-[11.5px] font-extrabold shadow-none xl:inline-flex"
                        >
                          <Filter className="size-4" aria-hidden="true" />
                          {desktopFiltersOpen ? "Ocultar filtros" : "Mais filtros"}
                          {activeLabels.length ? (
                            <span className="rounded-full bg-brand-tint px-1.5 py-0.5 text-[9px] text-brand-strong">
                              {activeLabels.length}
                            </span>
                          ) : null}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setSaveDialogOpen(true)}
                          className="h-11 rounded-[14px] border-hairline px-2.5 text-[10.5px] font-extrabold shadow-none sm:h-12 sm:px-3 sm:text-[11.5px]"
                        >
                          <Bookmark className="size-4" aria-hidden="true" />
                          <span className="sm:hidden">Salvar</span>
                          <span className="hidden sm:inline">Salvar filtro</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[18px] border border-[#29C454]/25 bg-[linear-gradient(135deg,rgba(232,250,238,0.95),rgba(245,253,247,0.96))] p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <span className="hidden size-10 shrink-0 place-items-center rounded-xl bg-white text-brand-strong shadow-sm sm:grid">
                          <Sparkles className="size-[18px]" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <Label
                            htmlFor="intelligent-search"
                            className="text-[11.5px] font-extrabold text-ink"
                          >
                            Descreva o que você procura em linguagem natural
                          </Label>
                          <Textarea
                            id="intelligent-search"
                            value={intelligentText}
                            onChange={(event) => setIntelligentText(event.target.value)}
                            className="mt-2 min-h-[86px] resize-none rounded-[14px] border-[#29C454]/20 bg-white px-3.5 py-3 text-[12.5px] leading-relaxed shadow-none focus-visible:border-[#29C454] focus-visible:ring-[#29C454]/20"
                          />
                          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-brand-strong">
                              <Sparkles className="size-3.5" aria-hidden="true" />A descrição será
                              convertida em critérios que você poderá revisar.
                            </p>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                  setIntelligentText("");
                                  setInterpretedCriteria([]);
                                  setIntelligentReviewOpen(false);
                                }}
                                className="h-10 rounded-xl px-3 text-[10.5px] font-bold text-brand-strong hover:bg-white"
                              >
                                Limpar
                              </Button>
                              <Button
                                type="button"
                                onClick={runIntelligentSearch}
                                disabled={aiLoading}
                                className="h-10 flex-1 rounded-xl bg-[#18B849] px-4 text-[11px] font-extrabold text-white shadow-none hover:bg-[#139E3E] sm:flex-none"
                              >
                                {aiLoading ? (
                                  <LoaderCircle
                                    className="size-4 animate-spin"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <Sparkles className="size-4" aria-hidden="true" />
                                )}
                                {aiLoading ? "Interpretando..." : "Interpretar busca"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {intelligentReviewOpen ? (
                        <IntelligentCriteriaReview
                          criteria={interpretedCriteria}
                          onRemove={(id) =>
                            setInterpretedCriteria((criteria) =>
                              criteria.filter((criterion) => criterion.id !== id),
                            )
                          }
                          onConfirm={confirmIntelligentSearch}
                          onEdit={() => setIntelligentReviewOpen(false)}
                        />
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
                      {activeSearchTerms.map((term) => (
                        <span
                          key={`active-${term.id}`}
                          className={cn(
                            "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-[10.5px] font-bold",
                            term.kind === "exclude"
                              ? "border-red-200 bg-red-50 text-red-700"
                              : "border-[#29C454]/25 bg-brand-tint text-brand-strong",
                          )}
                        >
                          {term.kind === "exclude"
                            ? "Excluir"
                            : activeMatchMode === "all"
                              ? "E"
                              : "OU"}
                          <span>·</span>
                          {term.value}
                        </span>
                      ))}
                      {activeLabels.map((label) => (
                        <FilterChip
                          key={label}
                          label={label}
                          onRemove={() => removeFilter(label)}
                        />
                      ))}
                      {activeLabels.length || activeSearchTerms.length ? (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="min-h-8 rounded-lg px-2 text-[10.5px] font-bold text-brand-strong hover:bg-brand-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                        >
                          Limpar todos
                        </button>
                      ) : (
                        <span className="inline-flex min-h-8 items-center text-[10.5px] font-semibold text-slate-text">
                          Adicione pelo menos um critério para pesquisar.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {!hasSearched ? (
                <SearchWelcomeState
                  mode={mode}
                  onQuickSearch={runQuickSearch}
                  onExploreAll={exploreAllTenders}
                />
              ) : (
                <section aria-labelledby="search-results-heading" className="min-w-0 py-0">
                  <div className="flex flex-col gap-3 border-b border-hairline px-3 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-4 lg:px-5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2
                          id="search-results-heading"
                          className="text-[16px] font-extrabold text-ink sm:text-[17px]"
                        >
                          Resultados
                        </h2>
                        <span className="rounded-full bg-[#EEF3FF] px-2.5 py-1 text-[10px] font-extrabold text-[#35527C]">
                          {totalResults.toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <p className="mt-1 text-[10.5px] font-medium text-slate-text sm:text-[11px]">
                        Licitações que correspondem aos critérios aplicados.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="h-10 min-w-0 rounded-xl border-hairline bg-white text-[10.5px] font-bold shadow-none sm:w-[150px]">
                          <span>
                            {sort === "recent"
                              ? "Mais recentes"
                              : sort === "value"
                                ? "Maior valor"
                                : "Mais relevantes"}
                          </span>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="relevant">Mais relevantes</SelectItem>
                          <SelectItem value="recent">Mais recentes</SelectItem>
                          <SelectItem value="value">Maior valor</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          toast.success("Exportação preparada", {
                            description:
                              "Os resultados visíveis foram organizados para exportação.",
                          })
                        }
                        className="h-10 rounded-xl border-hairline px-3 text-[10.5px] font-extrabold shadow-none"
                      >
                        <Download className="size-3.5" aria-hidden="true" />
                        Exportar
                      </Button>
                    </div>
                  </div>

                  <div className="grid min-w-0 xl:grid-cols-[minmax(340px,0.82fr)_minmax(500px,1.18fr)]">
                    <div className="min-w-0 border-hairline xl:border-r">
                      {aiLoading ? (
                        <div className="m-3 grid min-h-[320px] place-items-center rounded-[18px] border border-dashed border-[#29C454]/30 bg-brand-tint/35 px-5 text-center sm:m-4">
                          <div>
                            <LoaderCircle
                              className="mx-auto size-7 animate-spin text-brand-strong"
                              aria-hidden="true"
                            />
                            <p className="mt-3 text-[13px] font-extrabold text-ink">
                              Carregando os melhores resultados...
                            </p>
                            <p className="mt-1 text-[10.5px] font-medium text-slate-text">
                              Interpretando o pedido e cruzando os critérios disponíveis.
                            </p>
                          </div>
                        </div>
                      ) : filteredTenders.length ? (
                        <div className="max-h-none space-y-2.5 overflow-y-visible p-3 sm:p-4 xl:max-h-[760px] xl:overflow-y-auto xl:overscroll-contain">
                          {!hasOpenedDetail ? (
                            <div className="flex min-h-10 items-center justify-between gap-3 rounded-xl border border-[#29C454]/20 bg-brand-tint/55 px-3 md:hidden">
                              <span className="text-[9.5px] font-bold text-[#176C36]">
                                Toque em uma licitação para ver os detalhes
                              </span>
                              <ArrowRight
                                className="size-3.5 shrink-0 text-brand-strong"
                                aria-hidden="true"
                              />
                            </div>
                          ) : null}
                          {filteredTenders.map((tender, index) => (
                            <div
                              key={tender.id}
                              className={cn(index >= visibleResultCount && "hidden md:block")}
                            >
                              <TenderResultCard
                                tender={tender}
                                selected={selectedTender?.id === tender.id}
                                onSelect={() => selectTender(tender)}
                                intelligent={
                                  mode === "intelligent" && appliedIntelligentCriteria.length > 0
                                }
                                evidence={resultEvidence.get(tender.id) ?? []}
                                onFavorite={() =>
                                  toast.success(`${tender.code} foi adicionado aos favoritos.`)
                                }
                              />
                            </div>
                          ))}
                          {visibleResultCount < filteredTenders.length ? (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setVisibleResultCount((count) => count + 4)}
                              className="h-11 w-full rounded-xl border-hairline text-[10.5px] font-extrabold shadow-none md:hidden"
                            >
                              Carregar mais{" "}
                              {Math.min(4, filteredTenders.length - visibleResultCount)}
                              resultados
                            </Button>
                          ) : null}
                        </div>
                      ) : (
                        <div className="m-3 grid min-h-[320px] place-items-center rounded-[18px] border border-dashed border-hairline bg-page/40 px-5 text-center sm:m-4">
                          <div className="max-w-sm">
                            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-slate-text shadow-sm">
                              <FileSearch className="size-5" aria-hidden="true" />
                            </span>
                            <h3 className="mt-4 text-[14px] font-extrabold text-ink">
                              Não encontrou o que procurava?
                            </h3>
                            <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-slate-text">
                              Ajuste os filtros ou simplifique a palavra-chave para ampliar os
                              resultados.
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={clearFilters}
                              className="mt-4 h-10 rounded-xl border-hairline px-4 text-[11px] font-extrabold shadow-none"
                            >
                              Limpar filtros
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedTender ? (
                      <aside
                        aria-label="Pré-visualização da licitação selecionada"
                        className="hidden min-h-[690px] min-w-0 xl:flex"
                      >
                        <TenderDetailPreview tender={selectedTender} />
                      </aside>
                    ) : (
                      <aside
                        aria-label="Selecione uma licitação para visualizar os detalhes"
                        className="hidden min-h-[690px] min-w-0 place-items-center bg-page/20 px-6 text-center xl:grid"
                      >
                        <div className="max-w-sm">
                          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-tint text-brand-strong">
                            <FileSearch className="size-6" aria-hidden="true" />
                          </span>
                          <h3 className="mt-4 text-[17px] font-extrabold text-ink">
                            Selecione uma licitação
                          </h3>
                          <p className="mt-2 text-[11px] font-medium leading-relaxed text-slate-text">
                            Escolha um resultado ao lado para visualizar órgão, itens, prazos,
                            documentos e aderência.
                          </p>
                        </div>
                      </aside>
                    )}
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>
      </div>

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent
          side="right"
          overlayClassName="bg-slate-950/35 backdrop-blur-[1px]"
          className="z-[100] h-dvh w-full max-w-full gap-0 border-l border-hairline bg-white p-0 font-manrope sm:max-w-[440px] xl:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Filtros da busca</SheetTitle>
            <SheetDescription>
              Selecione critérios para refinar as licitações encontradas.
            </SheetDescription>
          </SheetHeader>
          <FiltersPanel
            compact
            filters={draftFilters}
            onChange={setDraftFilters}
            onClear={clearFilters}
            onApply={applyDraftFilters}
          />
        </SheetContent>
      </Sheet>

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent
          side="right"
          overlayClassName="bg-slate-950/35 backdrop-blur-[1px]"
          showCloseButton={false}
          className="z-[100] flex h-dvh w-full max-w-full flex-col gap-0 border-l border-hairline bg-white p-0 font-manrope sm:max-w-[720px] xl:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Detalhes da licitação</SheetTitle>
            <SheetDescription>
              Informações da oportunidade selecionada, documentos e ações disponíveis.
            </SheetDescription>
          </SheetHeader>
          <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-hairline bg-white px-3 pt-[env(safe-area-inset-top)] sm:px-5">
            <SheetClose asChild>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-[11px] font-extrabold text-ink hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Voltar aos resultados
              </button>
            </SheetClose>
            <span className="hidden rounded-full bg-brand-tint px-2.5 py-1 text-[9px] font-extrabold text-brand-strong min-[390px]:inline-flex">
              Detalhes da licitação
            </span>
          </div>
          {selectedTender ? <TenderDetailPreview tender={selectedTender} /> : null}
        </SheetContent>
      </Sheet>

      <SaveFilterDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        criteria={activeLabels}
        onSaved={setSavedFilterName}
      />
    </div>
  );
}
