const fs = require("node:fs");
const path = require("node:path");
const { INDEXABLE_ROUTES, SITE_URL } = require("./seo-public-routes.cjs");

const publicDirectory = path.resolve(__dirname, "..", "public");
const isProduction =
  process.env.VERCEL_ENV === "production" || process.env.SEO_ENV === "production";

function xmlEscape(value) {
  return value.replace(/[<>&'\"]/g, (character) => {
    return {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    }[character];
  });
}

function canonicalUrl(routePath) {
  return new URL(routePath, SITE_URL).toString();
}

function buildSitemap() {
  const entries = INDEXABLE_ROUTES.map(({ path: routePath, lastModified }) => {
    const lastModifiedTag = lastModified ? `\n    <lastmod>${lastModified}</lastmod>` : "";
    return `  <url>\n    <loc>${xmlEscape(canonicalUrl(routePath))}</loc>${lastModifiedTag}\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

function buildRobots() {
  const indexingRule = isProduction ? "Allow: /" : "Disallow: /";
  return `User-agent: *\n${indexingRule}\n\nSitemap: ${canonicalUrl("/sitemap.xml")}\n`;
}

fs.mkdirSync(publicDirectory, { recursive: true });
fs.writeFileSync(path.join(publicDirectory, "sitemap.xml"), buildSitemap(), "utf8");
fs.writeFileSync(path.join(publicDirectory, "robots.txt"), buildRobots(), "utf8");

console.log(
  `[seo] sitemap.xml generated with ${INDEXABLE_ROUTES.length} indexable URLs; robots.txt is ${isProduction ? "indexable" : "blocked for non-production"}.`,
);
