import {
  Search,
  TrendingUp,
  Building2,
  Radar,
  BellRing,
  BarChart3,
  Target,
  Sparkles,
  Layers,
  Plug,
  GitBranch,
  Gavel,
  Swords,
  ScanSearch,
  Users,
  Infinity as InfinityIcon,
  FileSignature,
  Network,
  UserCog,
  Headset,
} from "lucide-react";

export type BillingCycle = "monthly" | "annual";

export const pricingPlans = [
  {
    id: "essential",
    name: "Essencial",
    subtitle: "Encontre e analise oportunidades",
    description: "Para empresas que desejam estruturar a busca e o monitoramento de licitações.",
    icon: Search,
    features: [
      { text: "Busca ilimitada de licitações", icon: Radar },
      { text: "Alertas ilimitados", icon: BellRing },
      { text: "Comparação de preços com o mercado", icon: BarChart3 },
      { text: "Identificação de oportunidades com alto potencial", icon: Target },
      { text: "Alicitante, a IA para editais: até 5 consultas por dia", icon: Sparkles },
    ],
    cta: "Escolher este plano",
    featured: false,
    prices: {
      monthly: { amount: 99, billedTotal: null },
      annual: { amount: 79, billedTotal: 948 },
    },
  },
  {
    id: "professional",
    name: "Profissional",
    subtitle: "Centralize participações e automatize disputas",
    description:
      "Para empresas que já participam de licitações com frequência e precisam ganhar eficiência operacional.",
    icon: TrendingUp,
    features: [
      { text: "Tudo do plano Essencial", icon: Layers },
      { text: "Integração com ComprasNet, Licitanet e Portal de Compras Públicas", icon: Plug },
      { text: "Monitoramento das etapas da licitação", icon: GitBranch },
      { text: "Bot de lances: 1 utilização por semana", icon: Gavel },
      { text: "Inteligência de concorrentes", icon: Swords },
      { text: "Raio-X de licitações: 2 análises por semana", icon: ScanSearch },
      { text: "Acesso para até 2 membros da equipe", icon: Users },
    ],
    cta: "Escolher este plano",
    featured: true,
    badge: "MAIS ESCOLHIDO",
    prices: {
      monthly: { amount: 299, billedTotal: null },
      annual: { amount: 199, billedTotal: 2388 },
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "Automação para operações em escala",
    description:
      "Para empresas com alto volume de participações, múltiplos CNPJs ou equipes maiores.",
    icon: Building2,
    features: [
      { text: "Tudo do plano Profissional", icon: Layers },
      { text: "Bot de lances sem limite semanal", icon: InfinityIcon },
      { text: "Raio-X de licitações: até 10 análises por semana", icon: ScanSearch },
      { text: "Cadastro automático de propostas", icon: FileSignature },
      { text: "Gestão de múltiplos CNPJs", icon: Network },
      { text: "Acesso para até 5 membros da equipe", icon: UserCog },
      { text: "Atendimento dedicado com SLA", icon: Headset },
    ],
    cta: "Falar com o time",
    featured: false,
    prices: {
      monthly: { amount: 997, billedTotal: null },
      annual: { amount: 747, billedTotal: 8964 },
    },
  },
];
