const SITE_URL = "https://licitabase.vercel.app";

/**
 * Single source of truth for the public URLs we intentionally expose to
 * search engines. When content moves to a CMS in a later phase, this module
 * should be fed by the CMS/content model instead of being extended manually.
 */
const INDEXABLE_ROUTES = [
  { path: "/lp" },
  { path: "/blog", lastModified: "2026-08-31" },
  { path: "/blog/como-participar-de-licitacao", lastModified: "2026-08-31" },
  { path: "/blog/documentos-necessarios-para-licitacao", lastModified: "2026-08-31" },
  { path: "/blog/como-encontrar-licitacoes-abertas", lastModified: "2026-08-31" },
  { path: "/blog/como-ler-edital-licitacao", lastModified: "2026-08-31" },
  { path: "/blog/como-montar-proposta-precos-licitacao", lastModified: "2026-08-31" },
  { path: "/blog/como-participar-pregao-eletronico", lastModified: "2026-08-31" },
  { path: "/blog/como-cadastrar-empresa-para-licitacao", lastModified: "2026-08-31" },
];

const NON_INDEXABLE_PATH_PREFIXES = ["/dash2", "/bot-lances", "/obrigado", "/2"];

module.exports = {
  SITE_URL,
  INDEXABLE_ROUTES,
  NON_INDEXABLE_PATH_PREFIXES,
};
