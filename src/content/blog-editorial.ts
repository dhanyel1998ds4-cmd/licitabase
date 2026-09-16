export type BlogSearchIntent = "informational" | "commercial-investigation";

export type BlogEditorialProfile = {
  slug: string;
  primaryTopic: string;
  searchIntent: BlogSearchIntent;
  cluster: string;
  pillarSlug: string | null;
  secondaryQueries: readonly string[];
  entities: readonly string[];
  seoTitle: string;
  h1: string;
  canonicalPath: string;
  cta: {
    label: string;
    href: string;
  };
  author: {
    name: string;
    type: "Organization";
  };
  reviewer: {
    name: string | null;
    status: "pending-editorial-review" | "reviewed";
  };
  sources: readonly {
    label: string;
    url: string;
  }[];
  status: "published" | "draft" | "in-review";
};

const editorialDefaults = {
  author: { name: "LicitaBase", type: "Organization" as const },
  reviewer: { name: null, status: "pending-editorial-review" as const },
  sources: [],
  status: "published" as const,
};

export const blogEditorialProfiles = [
  {
    ...editorialDefaults,
    slug: "como-participar-de-licitacao",
    primaryTopic: "como participar de licitação",
    searchIntent: "informational",
    cluster: "Participação em licitações",
    pillarSlug: null,
    secondaryQueries: ["como entrar em uma licitação", "etapas da licitação", "empresa em licitações"],
    entities: ["edital", "proposta", "habilitação", "pregão eletrônico"],
    seoTitle: "Como participar de licitação: guia prático para empresas | LicitaBase",
    h1: "Como participar de licitação: guia prático para empresas",
    canonicalPath: "/blog/como-participar-de-licitacao",
    cta: { label: "Conhecer a LicitaBase", href: "/lp" },
  },
  {
    ...editorialDefaults,
    slug: "documentos-necessarios-para-licitacao",
    primaryTopic: "documentos necessários para licitação",
    searchIntent: "informational",
    cluster: "Participação em licitações",
    pillarSlug: "como-participar-de-licitacao",
    secondaryQueries: ["documentos para participar de licitação", "documentos de habilitação"],
    entities: ["edital", "certidões", "habilitação", "declarações"],
    seoTitle: "Documentos necessários para participar de uma licitação | LicitaBase",
    h1: "Documentos necessários para participar de uma licitação",
    canonicalPath: "/blog/documentos-necessarios-para-licitacao",
    cta: { label: "Ver guia principal", href: "/blog/como-participar-de-licitacao" },
  },
  {
    ...editorialDefaults,
    slug: "como-encontrar-licitacoes-abertas",
    primaryTopic: "como encontrar licitações abertas",
    searchIntent: "informational",
    cluster: "Encontrar oportunidades",
    pillarSlug: "como-participar-de-licitacao",
    secondaryQueries: ["licitações abertas", "buscar editais", "encontrar oportunidades públicas"],
    entities: ["edital", "órgão público", "categoria", "prazo"],
    seoTitle: "Como encontrar licitações abertas para sua empresa | LicitaBase",
    h1: "Como encontrar licitações abertas para sua empresa",
    canonicalPath: "/blog/como-encontrar-licitacoes-abertas",
    cta: { label: "Ver guia principal", href: "/blog/como-participar-de-licitacao" },
  },
  {
    ...editorialDefaults,
    slug: "como-ler-edital-licitacao",
    primaryTopic: "como ler um edital de licitação",
    searchIntent: "informational",
    cluster: "Análise de edital",
    pillarSlug: "como-participar-de-licitacao",
    secondaryQueries: ["analisar edital", "como entender edital", "o que verificar no edital"],
    entities: ["edital", "objeto", "habilitação", "prazo", "critério de julgamento"],
    seoTitle: "Como ler um edital de licitação antes de decidir participar | LicitaBase",
    h1: "Como ler um edital de licitação antes de decidir participar",
    canonicalPath: "/blog/como-ler-edital-licitacao",
    cta: { label: "Ver guia principal", href: "/blog/como-participar-de-licitacao" },
  },
  {
    ...editorialDefaults,
    slug: "como-montar-proposta-precos-licitacao",
    primaryTopic: "como montar proposta de preços para licitação",
    searchIntent: "informational",
    cluster: "Proposta comercial",
    pillarSlug: "como-participar-de-licitacao",
    secondaryQueries: ["proposta de preços licitação", "planilha de preços licitação"],
    entities: ["proposta", "item", "quantidade", "revisão", "edital"],
    seoTitle: "Como montar uma proposta de preços para licitação | LicitaBase",
    h1: "Como montar uma proposta de preços para licitação",
    canonicalPath: "/blog/como-montar-proposta-precos-licitacao",
    cta: { label: "Ver guia principal", href: "/blog/como-participar-de-licitacao" },
  },
  {
    ...editorialDefaults,
    slug: "como-participar-pregao-eletronico",
    primaryTopic: "como participar de pregão eletrônico",
    searchIntent: "informational",
    cluster: "Participação em licitações",
    pillarSlug: "como-participar-de-licitacao",
    secondaryQueries: ["pregão eletrônico", "etapas do pregão", "lances no pregão eletrônico"],
    entities: ["pregão eletrônico", "sessão pública", "lance", "edital"],
    seoTitle: "Como participar de pregão eletrônico: guia para empresas | LicitaBase",
    h1: "Como participar de pregão eletrônico",
    canonicalPath: "/blog/como-participar-pregao-eletronico",
    cta: { label: "Ver guia principal", href: "/blog/como-participar-de-licitacao" },
  },
  {
    ...editorialDefaults,
    slug: "como-cadastrar-empresa-para-licitacao",
    primaryTopic: "como cadastrar empresa para licitação",
    searchIntent: "informational",
    cluster: "Preparação operacional",
    pillarSlug: "como-participar-de-licitacao",
    secondaryQueries: ["cadastro em portal de compras", "credenciamento para licitação"],
    entities: ["CNPJ", "credenciamento", "portal de compras", "representante legal"],
    seoTitle: "Como cadastrar uma empresa para participar de licitação | LicitaBase",
    h1: "Como cadastrar uma empresa para participar de licitação",
    canonicalPath: "/blog/como-cadastrar-empresa-para-licitacao",
    cta: { label: "Ver guia principal", href: "/blog/como-participar-de-licitacao" },
  },
] as const satisfies readonly BlogEditorialProfile[];

export function getBlogEditorialProfile(slug: string) {
  return blogEditorialProfiles.find((profile) => profile.slug === slug);
}
