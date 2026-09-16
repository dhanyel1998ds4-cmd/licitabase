const requiredBaseUrl = process.env.SEO_BASE_URL;

if (!requiredBaseUrl) {
  console.error("[seo] Set SEO_BASE_URL, for example: SEO_BASE_URL=http://127.0.0.1:4191 npm run seo:smoke");
  process.exit(1);
}

const baseUrl = requiredBaseUrl.replace(/\/$/, "");
const checks = [
  { path: "/blog", status: 200, canonical: "/blog" },
  {
    path: "/blog/documentos-necessarios-para-licitacao",
    status: 200,
    canonical: "/blog/documentos-necessarios-para-licitacao",
    contains: '"@type":"BlogPosting"',
  },
  { path: "/blog/nao-existe", status: 404 },
  { path: "/lp", status: 200, canonical: "/lp" },
  { path: "/dash2", status: 200, robots: "noindex, nofollow" },
  { path: "/bot-lances", status: 200, robots: "noindex, nofollow" },
  { path: "/obrigado", status: 200, robots: "noindex, nofollow" },
  { path: "/obrigado-assinatura", status: 200, robots: "noindex, nofollow" },
  { path: "/2", status: 200, robots: "noindex, nofollow" },
  { path: "/2/index.html", status: 200, robots: "noindex, nofollow" },
  { path: "/robots.txt", status: 200, contains: "Sitemap:" },
  { path: "/sitemap.xml", status: 200, contains: "<urlset" },
];

function htmlHasCanonical(html, expectedPath) {
  const expectedUrl = `https://licitabase.vercel.app${expectedPath}`;
  const escaped = expectedUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`<link[^>]+rel=["']canonical["'][^>]+href=["']${escaped}["']`, "i").test(html);
}

function htmlHasRobots(html, expectedValue) {
  const escaped = expectedValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`<meta[^>]+name=["']robots["'][^>]+content=["']${escaped}["']`, "i").test(html);
}

async function run() {
  const failures = [];

  for (const check of checks) {
    const response = await fetch(`${baseUrl}${check.path}`, { redirect: "manual" });
    const body = await response.text();

    if (response.status !== check.status) {
      failures.push(`${check.path}: expected ${check.status}, received ${response.status}.`);
    }
    if (check.canonical && !htmlHasCanonical(body, check.canonical)) {
      failures.push(`${check.path}: canonical ${check.canonical} is missing or incorrect.`);
    }
    if (check.robots && !htmlHasRobots(body, check.robots)) {
      failures.push(`${check.path}: robots=${check.robots} is missing.`);
    }
    if (check.contains && !body.includes(check.contains)) {
      failures.push(`${check.path}: expected content was not rendered.`);
    }
  }

  if (failures.length) {
    console.error("[seo] Smoke test failed:\n- " + failures.join("\n- "));
    process.exit(1);
  }

  console.log(`[seo] ${checks.length} HTTP SEO smoke checks passed for ${baseUrl}.`);
}

run().catch((error) => {
  console.error("[seo] Smoke test failed unexpectedly:", error);
  process.exit(1);
});
