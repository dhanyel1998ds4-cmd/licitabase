export type OpportunityPlatform = "ComprasNet" | "PCP" | "Licitanet";

export type OpportunityProduct = {
  name: string;
  sku: string;
  compatibility: number;
  note: string;
};

export type OpportunityRequirement = {
  label: string;
  status: "Conforme" | "Atenção" | "Não identificado";
  detail: string;
};

export type OpportunityDocumentAnalysis = {
  summary: string;
  technicalRequirement: string;
  deliveryDeadline: string;
  paymentTerms: string;
  products: OpportunityProduct[];
  requirements: OpportunityRequirement[];
};

export type NewOpportunity = {
  id: string;
  title: string;
  agency: string;
  openingDate: string;
  openingTime?: string;
  estimatedValue: string;
  platform: OpportunityPlatform;
  state: string;
  category: string;
  description: string;
  items: string[];
  matchScore?: number;
  successChance?: number;
  supplierCount?: number;
  competitionLevel?: "Baixa" | "Média" | "Alta";
  agencyRisk?: "Baixo" | "Médio" | "Alto";
  similarWins?: number;
  isDemo?: boolean;
  documentAnalysis?: OpportunityDocumentAnalysis;
};

export const newOpportunities: NewOpportunity[] = [
  {
    id: "PE 90031/2026",
    title: "PE 90031/2026 — Aquisição de estações de trabalho, monitores e notebooks",
    agency: "Consórcio Intermunicipal de Serviços Públicos do Sul — RS",
    openingDate: "18/08/2026",
    openingTime: "09:00",
    estimatedValue: "R$ 684.250,00",
    platform: "ComprasNet",
    state: "RS",
    category: "Tecnologia",
    description:
      "Fornecimento de equipamentos de informática para modernização dos postos administrativos, com garantia on-site de 36 meses e entrega em lote único.",
    items: [
      "85 microcomputadores: Core i5 de 13ª geração, 16 GB DDR5, SSD NVMe 512 GB e Windows 11 Pro.",
      '85 monitores IPS de 23,8", Full HD, com HDMI, DisplayPort e ajuste de altura.',
      '10 notebooks de 14", Core i7, 16 GB, SSD 512 GB, Wi-Fi 6 e garantia on-site.',
    ],
    matchScore: 94,
    successChance: 86,
    supplierCount: 12,
    competitionLevel: "Média",
    agencyRisk: "Baixo",
    similarWins: 8,
    isDemo: true,
    documentAnalysis: {
      summary:
        "Pregão eletrônico para aquisição de 180 equipamentos de informática destinados à atualização do parque tecnológico. O julgamento será pelo menor preço por item, com exigência de garantia on-site e entrega integral no almoxarifado central.",
      technicalRequirement:
        "Equipamentos novos, TPM 2.0, certificação Energy Star ou equivalente e garantia on-site de 36 meses.",
      deliveryDeadline:
        "Até 30 dias corridos após a emissão da ordem de fornecimento, em Porto Alegre/RS.",
      paymentTerms:
        "Até 30 dias após o recebimento definitivo, aceite técnico e validação da nota fiscal.",
      products: [
        {
          name: "Estação corporativa i5 · 16 GB · SSD 512 GB",
          sku: "CAT-PC-13500-16-512",
          compatibility: 96,
          note: "Atende processador, memória, armazenamento e TPM 2.0.",
        },
        {
          name: 'Monitor IPS 23,8" Full HD ajustável',
          sku: "CAT-MON-238-IPS",
          compatibility: 93,
          note: "Compatível com conexões e ergonomia solicitadas.",
        },
        {
          name: 'Notebook corporativo 14" · i7 · 16 GB',
          sku: "CAT-NB-14-I7-16",
          compatibility: 89,
          note: "Requer confirmação da modalidade de garantia on-site.",
        },
      ],
      requirements: [
        {
          label: "Habilitação jurídica",
          status: "Conforme",
          detail: "Contrato social e alterações cadastrados.",
        },
        {
          label: "Regularidade fiscal e trabalhista",
          status: "Atenção",
          detail: "Certidão estadual vence em 6 dias.",
        },
        {
          label: "Qualificação econômico-financeira",
          status: "Conforme",
          detail: "Balanço e índices mínimos identificados.",
        },
        {
          label: "Qualificação técnica",
          status: "Atenção",
          detail: "Atestado deve comprovar ao menos 30% dos quantitativos.",
        },
        {
          label: "Regularidade do FGTS",
          status: "Conforme",
          detail: "Certificado válido no cadastro demonstrativo.",
        },
        {
          label: "Declaração do art. 7º, XXXIII",
          status: "Não identificado",
          detail: "Documento ainda não localizado no cadastro.",
        },
      ],
    },
  },
  {
    id: "PE 018/2025",
    title: "PE 018/2025 — Serviços de rastreamento veicular",
    agency: "Pref. Mun. de Joinville/SC",
    openingDate: "03/06/2025",
    estimatedValue: "R$ 99.154,44",
    platform: "Licitanet",
    state: "SC",
    category: "Serviços",
    description:
      "Contratação de serviço de rastreamento veicular para atendimento à operação do órgão.",
    items: ["Serviço de rastreamento veicular conforme escopo do processo."],
  },
  {
    id: "PE 021/2025",
    title: "PE 021/2025 — Aquisição de servidores e storages",
    agency: "Pref. Mun. de Jundiaí/SP",
    openingDate: "04/06/2025",
    estimatedValue: "R$ 63.445,00",
    platform: "PCP",
    state: "SP",
    category: "Tecnologia",
    description: "Oportunidade para aquisição de infraestrutura de servidores e armazenamento.",
    items: ["Servidores e storages conforme especificações do processo."],
  },
];

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
