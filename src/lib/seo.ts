export const SEO_SITE_URL = "https://licitabase.vercel.app";

export const noIndexNoFollow = {
  name: "robots",
  content: "noindex, nofollow",
} as const;

export function seoCanonical(pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(normalizedPath, SEO_SITE_URL).toString();
}

type PageSeoInput = {
  title: string;
  description: string;
  canonicalPath: string;
  imagePath?: string;
  imageAlt?: string;
  kind?: "article" | "website";
  publishedAt?: string;
  modifiedAt?: string;
  robots?: typeof noIndexNoFollow;
};

type BlogPostingInput = {
  title: string;
  description: string;
  canonicalPath: string;
  imagePath: string;
  publishedAt: string;
  modifiedAt: string;
  section: string;
  keywords?: readonly string[];
};

export function createPageSeo({
  title,
  description,
  canonicalPath,
  imagePath,
  imageAlt,
  kind = "website",
  publishedAt,
  modifiedAt,
  robots,
}: PageSeoInput) {
  const canonical = seoCanonical(canonicalPath);
  const image = imagePath ? seoCanonical(imagePath) : undefined;
  const meta = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: kind },
    { property: "og:url", content: canonical },
    { property: "og:site_name", content: "LicitaBase" },
    ...(image
      ? [
          { property: "og:image", content: image },
          ...(imageAlt ? [{ property: "og:image:alt", content: imageAlt }] : []),
          { name: "twitter:image", content: image },
        ]
      : []),
    ...(kind === "article" && publishedAt
      ? [{ property: "article:published_time", content: publishedAt }]
      : []),
    ...(kind === "article" && modifiedAt
      ? [{ property: "article:modified_time", content: modifiedAt }]
      : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    ...(robots ? [robots] : []),
  ];

  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
  };
}

export function createBlogPostingSchema({
  title,
  description,
  canonicalPath,
  imagePath,
  publishedAt,
  modifiedAt,
  section,
  keywords,
}: BlogPostingInput) {
  const canonical = seoCanonical(canonicalPath);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: canonical,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    inLanguage: "pt-BR",
    datePublished: publishedAt,
    dateModified: modifiedAt,
    articleSection: section,
    image: seoCanonical(imagePath),
    ...(keywords?.length ? { keywords: [...keywords] } : {}),
    author: { "@type": "Organization", name: "LicitaBase", url: SEO_SITE_URL },
    publisher: { "@type": "Organization", name: "LicitaBase", url: SEO_SITE_URL },
  };
}

export function createBreadcrumbListSchema(
  items: ReadonlyArray<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: seoCanonical(path),
    })),
  };
}
