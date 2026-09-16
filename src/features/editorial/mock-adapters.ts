import { editorialArticlesFixture } from "@/features/editorial/fixtures";
import type {
  DraftGenerationResult,
  DraftProvider,
  EditorialBrief,
  EditorialRepository,
  EditorialStatus,
} from "@/features/editorial/types";

/**
 * Adapters demonstrativos. Substitua estas implementações pelas integrações
 * reais no backoffice definitivo, mantendo as interfaces em types.ts.
 */
export function createMockEditorialRepository(): EditorialRepository {
  let articles = [...editorialArticlesFixture];

  return {
    async listArticles() {
      return articles;
    },
    async updateStatus(id: string, status: EditorialStatus) {
      articles = articles.map((article) => (article.id === id ? { ...article, status } : article));
    },
  };
}

export const mockDraftProvider: DraftProvider = {
  async generate(brief: EditorialBrief): Promise<DraftGenerationResult> {
    await new Promise((resolve) => window.setTimeout(resolve, 650));

    const normalizedSlug = brief.primaryKeyword
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return {
      suggestedTitle: `Como avaliar ${brief.primaryKeyword} antes de decidir participar`,
      suggestedSlug: normalizedSlug || "novo-artigo-licitacao",
      metaDescription: `Entenda como avaliar ${brief.primaryKeyword} com contexto antes de preparar uma proposta para licitação.`,
      outline: [
        "O que verificar antes de decidir participar",
        "Como reunir evidências do edital e da operação",
        "Quando uma oportunidade deve seguir para proposta",
        "Próximos passos para registrar a decisão",
      ],
      suggestedInternalLinks: brief.internalLinks
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean),
      reviewNotes: [
        "Validar qualquer referência a exigência legal com fonte oficial.",
        "Confirmar se o CTA corresponde à oferta disponível no momento da publicação.",
        "Revisar links internos para garantir que apontem apenas para posts publicados.",
      ],
    };
  },
};
