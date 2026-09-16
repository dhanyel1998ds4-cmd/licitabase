const fs = require("node:fs");
const path = require("node:path");
const {
  INDEXABLE_ROUTES,
  NON_INDEXABLE_PATH_PREFIXES,
  SITE_URL,
} = require("./seo-public-routes.cjs");

const publicDirectory = path.resolve(__dirname, "..", "public");
const sitemapPath = path.join(publicDirectory, "sitemap.xml");
const robotsPath = path.join(publicDirectory, "robots.txt");
const failures = [];

if (!fs.existsSync(sitemapPath)) {
  failures.push("Missing public/sitemap.xml. Run npm run seo:generate.");
}

if (!fs.existsSync(robotsPath)) {
  failures.push("Missing public/robots.txt. Run npm run seo:generate.");
}

if (!failures.length) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const robots = fs.readFileSync(robotsPath, "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const expectedUrls = INDEXABLE_ROUTES.map(({ path: routePath }) =>
    new URL(routePath, SITE_URL).toString(),
  );

  if (urls.length !== expectedUrls.length) {
    failures.push(`Sitemap has ${urls.length} URLs; expected ${expectedUrls.length}.`);
  }

  if (new Set(urls).size !== urls.length) {
    failures.push("Sitemap contains duplicate URLs.");
  }

  for (const url of expectedUrls) {
    if (!urls.includes(url)) failures.push(`Sitemap is missing ${url}.`);
  }

  for (const prefix of NON_INDEXABLE_PATH_PREFIXES) {
    if (urls.some((url) => new URL(url).pathname.startsWith(prefix))) {
      failures.push(`Non-indexable prefix ${prefix} was found in the sitemap.`);
    }
  }

  if (!robots.includes(`Sitemap: ${new URL("/sitemap.xml", SITE_URL).toString()}`)) {
    failures.push("robots.txt does not point to the canonical sitemap URL.");
  }

  const expectedRobotsRule =
    process.env.VERCEL_ENV === "production" || process.env.SEO_ENV === "production"
      ? "Allow: /"
      : "Disallow: /";
  if (!robots.includes(expectedRobotsRule)) {
    failures.push(`robots.txt should contain ${expectedRobotsRule} for this environment.`);
  }
}

if (failures.length) {
  console.error("[seo] Validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log("[seo] Generated sitemap and robots.txt passed validation.");
