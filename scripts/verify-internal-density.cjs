const {
  chromium,
} = require("C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const routes = [
  {
    path: "/dash2/licitacoes/pe-845-2026",
    heading:
      "Aquisição de notebooks para atendimento às unidades administrativas, com garantia e suporte técnico.",
  },
  { path: "/dash2/oportunidades/favoritos", heading: "Favoritos" },
  { path: "/dash2/operacao/minhas-licitacoes", heading: "Minhas licitações" },
  { path: "/dash2/licitacoes/buscar", heading: "Buscar licitações" },
  { path: "/bot-lances", heading: "Visão geral do Bot de Lances" },
  { path: "/bot-lances/disputas", heading: "Disputas" },
  {
    path: "/bot-lances/disputas/d-4",
    heading: "Prefeitura Municipal de Guarulhos - SP",
  },
  { path: "/bot-lances/monitoramento", heading: "Monitoramento" },
  { path: "/bot-lances/relatorios", heading: "Relatórios" },
  { path: "/bot-lances/historico", heading: "Histórico" },
  { path: "/bot-lances/configuracoes", heading: "Configurações" },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const issues = [];

  for (const viewport of [
    { name: "desktop", width: 1920, height: 1080 },
    { name: "notebook", width: 1366, height: 768 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    for (const route of routes) {
      const page = await browser.newPage({ viewport });
      page.on("console", (message) => {
        if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) {
          issues.push(`${viewport.name} ${route.path}: console: ${message.text()}`);
        }
      });
      page.on("pageerror", (error) =>
        issues.push(`${viewport.name} ${route.path}: pageerror: ${error.message}`),
      );

      try {
        const baseUrl = process.env.VERIFY_BASE_URL || "http://127.0.0.1:5173";
        await page.goto(`${baseUrl}${route.path}`, {
          waitUntil: "domcontentloaded",
          timeout: 20000,
        });
        await page.getByRole("heading", { name: route.heading, exact: true }).waitFor({
          timeout: 10000,
        });

        const dimensions = await page.evaluate(() => ({
          bodyWidth: document.body.scrollWidth,
          viewportWidth: window.innerWidth,
          visibleText: document.body.innerText.trim().length,
        }));
        if (dimensions.bodyWidth > dimensions.viewportWidth + 1) {
          issues.push(
            `${viewport.name} ${route.path}: overflow ${dimensions.bodyWidth}px > ${dimensions.viewportWidth}px`,
          );
        }
        if (dimensions.visibleText < 80) {
          issues.push(`${viewport.name} ${route.path}: conteúdo insuficiente`);
        }

        if (/\/disputas\/d-\d+$/.test(route.path)) {
          for (const tab of ["Itens", "Classificação", "Timeline"]) {
            await page.getByRole("tab", { name: tab, exact: true }).click();
            await page.getByRole("tab", { name: tab, exact: true }).waitFor();
          }
        }

        if (viewport.name === "desktop") {
          const name = route.path.replaceAll("/", "-").replace(/^-/, "");
          await page.screenshot({ path: `artifacts/density-${name}.png`, fullPage: false });
        }

        console.log(
          `${viewport.name} ${route.path}: ${dimensions.viewportWidth}px / body ${dimensions.bodyWidth}px`,
        );
      } catch (error) {
        issues.push(`${viewport.name} ${route.path}: ${error.message}`);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  if (issues.length) {
    console.error(issues.join("\n"));
    process.exit(1);
  }
  console.log("Internal density verification passed.");
})();
