export type OpportunityPlatform = "ComprasNet" | "PCP" | "Licitanet";

export type NewOpportunity = {
  id: string;
  title: string;
  agency: string;
  openingDate: string;
  estimatedValue: string;
  platform: OpportunityPlatform;
  state: string;
  category: string;
  description: string;
  items: string[];
  matchScore?: number;
  successChance?: number;
  supplierCount?: number;
  agencyRisk?: "Baixo" | "Médio" | "Alto";
  similarWins?: number;
};

const sourceOpportunities = [
  {
    id: "PE 012/2025",
    title: "PE 012/2025 - Aquisição de equipamentos de informática",
    agency: "Pref. Mun. de Porto Alegre/RS",
    openingDate: "04/06/2025",
    estimatedValue: "R$ 242.872,86",
  },
  {
    id: "PE 018/2025",
    title: "PE 018/2025 - Serviços de rastreamento veicular",
    agency: "Pref. Mun. de Joinville/SC",
    openingDate: "03/06/2025",
    estimatedValue: "R$ 99.154,44",
  },
  {
    id: "PE 021/2025",
    title: "PE 021/2025 - Aquisição de servidores e storages",
    agency: "Pref. Mun. de Jundiaí/SP",
    openingDate: "04/06/2025",
    estimatedValue: "R$ 63.445,00",
  },
];

const opportunityMetadata: Array<
  Pick<NewOpportunity, "platform" | "state" | "category" | "description" | "items">
> = [
  {
    platform: "ComprasNet",
    state: "RS",
    category: "Tecnologia",
    description:
      "Oportunidade para fornecimento de equipamentos de informática conforme as especificações do processo.",
    items: ["Equipamentos de informática conforme especificações do edital."],
  },
  {
    platform: "Licitanet",
    state: "SC",
    category: "Serviços",
    description:
      "Contratação de serviço de rastreamento veicular para atendimento à operação do órgão.",
    items: ["Serviço de rastreamento veicular conforme escopo do processo."],
  },
  {
    platform: "PCP",
    state: "SP",
    category: "Tecnologia",
    description: "Oportunidade para aquisição de infraestrutura de servidores e armazenamento.",
    items: ["Servidores e storages conforme especificações do processo."],
  },
];

export const newOpportunities: NewOpportunity[] = sourceOpportunities.map((opportunity, index) => ({
  id: opportunity.id,
  title: opportunity.title,
  agency: opportunity.agency,
  openingDate: opportunity.openingDate,
  estimatedValue: opportunity.estimatedValue,
  ...opportunityMetadata[index]!,
}));

export const newOpportunitiesSummary = {
  total: 604,
  savedForLater: 0,
  favorites: 0,
  updatedLabel: "Atualizado agora",
};

export const opportunityPlatforms = [
  "Todas",
  "ComprasNet",
  "PCP",
  "Licitanet",
  "BNC",
  "BLL",
  "BBMnet",
] as const;

export type OpportunityPlatformFilter = (typeof opportunityPlatforms)[number];
