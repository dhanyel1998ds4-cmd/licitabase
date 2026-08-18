export type SavedTenderFilter = {
  id: string;
  name: string;
  query: string;
  criteria: string[];
  categories: string[];
  regions: string[];
  alertFrequency: "instant" | "daily" | "weekly" | "off";
  enabled: boolean;
  newMatches: number;
  lastRun: string;
  createdAt: string;
};

export const SAVED_TENDER_FILTERS_STORAGE_KEY = "licitabase:saved-tender-filters";
export const ACTIVE_TENDER_FILTER_STORAGE_KEY = "licitabase:active-saved-tender-filter";

export const defaultSavedTenderFilters: SavedTenderFilter[] = [
  {
    id: "ti-sudeste-prioritario",
    name: "TI prioritária · Sudeste",
    query: "notebook monitor SSD computador",
    criteria: ["Pregão eletrônico", "Aderência mínima 85%", "Até R$ 1,5 mi"],
    categories: ["Equipamentos de TI", "Serviços de TI"],
    regions: ["SP", "MG", "RJ"],
    alertFrequency: "instant",
    enabled: true,
    newMatches: 18,
    lastRun: "há 8 min",
    createdAt: "08 ago 2026",
  },
  {
    id: "software-sustentacao",
    name: "Software e sustentação",
    query: "software desenvolvimento suporte técnico",
    criteria: ["Propostas nos próximos 15 dias", "Aderência mínima 75%"],
    categories: ["Serviços de TI"],
    regions: ["SP", "MG"],
    alertFrequency: "daily",
    enabled: true,
    newMatches: 7,
    lastRun: "há 42 min",
    createdAt: "03 ago 2026",
  },
  {
    id: "infraestrutura-pausada",
    name: "Infraestrutura e manutenção",
    query: "manutenção predial conservação reparos",
    criteria: ["Valor acima de R$ 100 mil", "Novas publicações"],
    categories: ["Manutenção predial", "Construção civil"],
    regions: ["MG"],
    alertFrequency: "off",
    enabled: false,
    newMatches: 0,
    lastRun: "ontem, 16:25",
    createdAt: "29 jul 2026",
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function readSavedTenderFilters() {
  if (!canUseStorage()) return defaultSavedTenderFilters;

  try {
    const value = window.localStorage.getItem(SAVED_TENDER_FILTERS_STORAGE_KEY);
    if (!value) return defaultSavedTenderFilters;
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as SavedTenderFilter[]) : defaultSavedTenderFilters;
  } catch {
    return defaultSavedTenderFilters;
  }
}

export function writeSavedTenderFilters(filters: SavedTenderFilter[]) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(SAVED_TENDER_FILTERS_STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // O protótipo continua disponível quando o armazenamento local não puder ser usado.
  }
}

export function setActiveSavedTenderFilter(filter: SavedTenderFilter) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(ACTIVE_TENDER_FILTER_STORAGE_KEY, JSON.stringify(filter));
  } catch {
    // A navegação para a busca continua possível mesmo sem persistência local.
  }
}

export function consumeActiveSavedTenderFilter() {
  if (!canUseStorage()) return null;
  try {
    const value = window.localStorage.getItem(ACTIVE_TENDER_FILTER_STORAGE_KEY);
    window.localStorage.removeItem(ACTIVE_TENDER_FILTER_STORAGE_KEY);
    return value ? (JSON.parse(value) as SavedTenderFilter) : null;
  } catch {
    return null;
  }
}
