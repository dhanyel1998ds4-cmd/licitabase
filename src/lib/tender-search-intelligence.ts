export type SearchTermKind = "include" | "exclude";

export type SearchTerm = {
  id: string;
  value: string;
  kind: SearchTermKind;
  exact: boolean;
};

export type SearchMatchMode = "all" | "any";

export type IntelligentCriterionType =
  | "object"
  | "specification"
  | "location"
  | "agency"
  | "period"
  | "exclusion"
  | "min-value"
  | "max-value";

export type IntelligentCriterion = {
  id: string;
  type: IntelligentCriterionType;
  label: string;
  value: string;
  source: "explicit" | "equivalent";
};

type VocabularyEntry = {
  canonical: string;
  equivalents: string[];
};

const vocabulary: VocabularyEntry[] = [
  {
    canonical: "computador",
    equivalents: [
      "PC",
      "microcomputador",
      "desktop",
      "estação de trabalho",
      "equipamento de informática",
    ],
  },
  {
    canonical: "notebook",
    equivalents: ["computador portátil", "laptop", "microcomputador portátil"],
  },
  {
    canonical: "SSD",
    equivalents: ["unidade de estado sólido", "disco de estado sólido"],
  },
  {
    canonical: "512 GB",
    equivalents: ["512GB", "SSD 512", "armazenamento de 512 GB"],
  },
  {
    canonical: "Core i5",
    equivalents: ["i5", "Intel Core i5", "processador i5"],
  },
  {
    canonical: "limpeza a seco",
    equivalents: ["higienização a seco", "lavagem a seco"],
  },
  {
    canonical: "produto",
    equivalents: ["material", "insumo", "fornecimento"],
  },
  {
    canonical: "estofado",
    equivalents: ["sofá", "poltrona", "cadeira estofada", "mobiliário estofado"],
  },
];

export function normalizeTenderSearchTerm(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/\s+/g, " ")
    .trim();
}

function vocabularyEntryFor(value: string) {
  const normalizedValue = normalizeTenderSearchTerm(value);
  return vocabulary.find((entry) =>
    [entry.canonical, ...entry.equivalents].some(
      (candidate) => normalizeTenderSearchTerm(candidate) === normalizedValue,
    ),
  );
}

export function getTermEquivalents(value: string) {
  const entry = vocabularyEntryFor(value);
  if (!entry) return [];
  const normalizedValue = normalizeTenderSearchTerm(value);
  return [entry.canonical, ...entry.equivalents].filter(
    (candidate) => normalizeTenderSearchTerm(candidate) !== normalizedValue,
  );
}

export function getSearchVariants(value: string, includeEquivalents: boolean) {
  return includeEquivalents ? [value, ...getTermEquivalents(value)] : [value];
}

function createSearchTerm(rawValue: string, index: number): SearchTerm | null {
  let value = rawValue.trim();
  if (!value) return null;

  const kind: SearchTermKind = value.startsWith("-") ? "exclude" : "include";
  if (kind === "exclude") value = value.slice(1).trim();
  const exact = value.startsWith('"') && value.endsWith('"') && value.length > 2;
  if (exact) value = value.slice(1, -1).trim();
  if (!value) return null;

  return {
    id: `${Date.now()}-${index}-${normalizeTenderSearchTerm(value)}`,
    value,
    kind,
    exact,
  };
}

export function parseSearchTerms(input: string) {
  const parts: string[] = [];
  let current = "";
  let quoted = false;

  for (const character of input) {
    if (character === '"') quoted = !quoted;
    if (character === "+" && !quoted) {
      if (current.trim()) parts.push(current);
      current = "";
    } else {
      current += character;
    }
  }
  if (current.trim()) parts.push(current);

  return parts.map(createSearchTerm).filter((term): term is SearchTerm => Boolean(term));
}

function readCurrencyValue(normalizedInput: string, prefix: "acima" | "ate") {
  const pattern = new RegExp(
    `${prefix}(?:\\s+de)?\\s+(?:r\\$\\s*)?([0-9]+(?:[.,][0-9]+)?)\\s*(milhoes|milhao|mil|mi)?`,
  );
  const match = normalizedInput.match(pattern);
  if (!match?.[1]) return null;
  const rawNumber = Number(match[1].replace(".", "").replace(",", "."));
  if (!Number.isFinite(rawNumber)) return null;
  const scale = match[2];
  if (scale === "mil") return rawNumber * 1_000;
  if (scale === "mi" || scale === "milhao" || scale === "milhoes") return rawNumber * 1_000_000;
  return rawNumber;
}

function criterion(
  type: IntelligentCriterionType,
  label: string,
  value: string,
  index: number,
  source: IntelligentCriterion["source"] = "explicit",
): IntelligentCriterion {
  return { id: `${type}-${index}-${normalizeTenderSearchTerm(value)}`, type, label, value, source };
}

export function interpretTenderSearchIntent(input: string) {
  const normalizedInput = normalizeTenderSearchTerm(input);
  const criteria: IntelligentCriterion[] = [];
  const add = (
    type: IntelligentCriterionType,
    label: string,
    value: string,
    source: IntelligentCriterion["source"] = "explicit",
  ) => criteria.push(criterion(type, label, value, criteria.length, source));

  if (/notebook|laptop|computador portatil/.test(normalizedInput))
    add("object", "Objeto", "Notebook");
  else if (/computador|microcomputador|\bpc\b|desktop/.test(normalizedInput))
    add("object", "Objeto", "Computador");
  else if (/limpeza a seco|higienizacao a seco|lavagem a seco/.test(normalizedInput))
    add("object", "Objeto", "Limpeza a seco");

  if (/\bi5\b|core i5|processador i5/.test(normalizedInput))
    add("specification", "Processador", "Core i5 ou equivalente", "equivalent");
  if (/512\s*gb|ssd\s*(?:de\s*)?512/.test(normalizedInput))
    add("specification", "Armazenamento mínimo", "SSD de 512 GB");
  if (/estofado|sofa|poltrona|cadeira estofada/.test(normalizedInput))
    add("specification", "Aplicação", "Estofados", "equivalent");
  if (/produto|material|insumo/.test(normalizedInput))
    add("specification", "Tipo de contratação", "Fornecimento de produto", "equivalent");

  if (/prefeitura (?:municipal )?de sao paulo/.test(normalizedInput))
    add("agency", "Órgão", "Prefeitura Municipal de São Paulo");
  if (/sao paulo|\bsp\b/.test(normalizedInput)) add("location", "Localização", "São Paulo (SP)");
  if (/proximos? 30 dias|ultimos? 30 dias|recentemente|recentes?/.test(normalizedInput))
    add("period", "Período", "Próximos 30 dias");
  if (/nao (?:sejam? )?(?:equipamentos? )?usados?|excluir usados?/.test(normalizedInput))
    add("exclusion", "Excluir", "Equipamentos usados");

  const minimum = readCurrencyValue(normalizedInput, "acima");
  if (minimum !== null) add("min-value", "Valor mínimo", String(minimum));
  const maximum = readCurrencyValue(normalizedInput, "ate");
  if (maximum !== null) add("max-value", "Valor máximo", String(maximum));

  return criteria;
}

export function criterionSearchValues(criterion: IntelligentCriterion) {
  if (criterion.type === "object" || criterion.type === "specification") {
    const cleaned = criterion.value
      .replace(/\s+ou equivalente$/i, "")
      .replace(/^SSD de /i, "")
      .replace(/^Fornecimento de /i, "");
    return getSearchVariants(cleaned, true);
  }
  if (criterion.type === "location") return ["São Paulo", "SP"];
  if (criterion.type === "agency") return [criterion.value];
  if (criterion.type === "exclusion") return ["usado", "seminovo", "recondicionado"];
  return [];
}
