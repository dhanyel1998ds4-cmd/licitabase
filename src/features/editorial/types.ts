export const editorialStatuses = [
  "draft",
  "in_review",
  "approved",
  "scheduled",
  "published",
  "archived",
] as const;

export type EditorialStatus = (typeof editorialStatuses)[number];

export type EditorialArticle = {
  id: string;
  title: string;
  slug: string;
  category: string;
  cluster: string;
  primaryKeyword: string;
  searchIntent: "informational" | "commercial";
  status: EditorialStatus;
  updatedAt: string;
  owner: string;
  seoScore: number;
  scheduledFor?: string;
};

export type EditorialBrief = {
  topic: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  searchIntent: "informational" | "commercial";
  audience: string;
  internalLinks: string;
  sourceRequirements: string;
  callToAction: string;
};

export type DraftGenerationResult = {
  suggestedTitle: string;
  suggestedSlug: string;
  metaDescription: string;
  outline: readonly string[];
  suggestedInternalLinks: readonly string[];
  reviewNotes: readonly string[];
};

export type EditorialRepository = {
  listArticles(): Promise<readonly EditorialArticle[]>;
  updateStatus(id: string, status: EditorialStatus): Promise<void>;
};

export type DraftProvider = {
  generate(brief: EditorialBrief): Promise<DraftGenerationResult>;
};
