export const pageContextLabels = {
  overview: "Visão geral",
  explore: "Explorar licitações",
  operation: "Minha operação",
  bot: "Bot de lances",
  intelligence: "Inteligência",
  management: "Gestão",
  settings: "Configurações",
  support: "Central de ajuda",
} as const;

export type PageContext = keyof typeof pageContextLabels;
