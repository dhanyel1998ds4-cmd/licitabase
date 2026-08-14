const {
  chromium,
} = require("C:/Users/Rent e Clean/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const issues = [];

  for (const viewport of [
    { name: "desktop-wide", width: 1920, height: 1080 },
    { name: "desktop", width: 1440, height: 900 },
    { name: "notebook", width: 1366, height: 768 },
    { name: "tablet", width: 1024, height: 768 },
    { name: "tablet-portrait", width: 768, height: 1024 },
    { name: "mobile-wide", width: 430, height: 932 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport });
    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) {
        issues.push(`${viewport.name}: console: ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => issues.push(`${viewport.name}: pageerror: ${error.message}`));

    await page.goto("http://127.0.0.1:5173/dash2/licitacoes/buscar", {
      waitUntil: "networkidle",
    });
    await page.getByRole("heading", { name: "Buscar licitações", exact: true }).waitFor();
    await page.getByRole("heading", { name: "Comece definindo o que procura" }).waitFor();

    if (await page.getByRole("heading", { name: "Resultados", exact: true }).count()) {
      issues.push(`${viewport.name}: resultados exibidos antes de uma busca explícita`);
    }

    const initialBodyWidth = await page.evaluate(() => document.body.scrollWidth);
    if (initialBodyWidth > viewport.width) {
      issues.push(`${viewport.name}: overflow inicial ${initialBodyWidth}px > ${viewport.width}px`);
    }

    if (viewport.name === "desktop") {
      await page.screenshot({
        path: "artifacts/tender-search-desktop-initial.png",
        fullPage: false,
      });

      const normalInput = page.getByLabel("Adicionar termos à pesquisa normal");
      await normalInput.fill("computador + 512 GB + i5");
      await normalInput.press("Enter");
      await page.getByText("Termos da pesquisa (3)").waitFor();
      await page.getByRole("button", { name: "Buscar", exact: true }).click();
      await page.getByText("Pregão 512/2026", { exact: true }).waitFor();
      await page.getByRole("heading", { name: "Selecione uma licitação" }).waitFor();

      if (await page.getByLabel("Pré-visualização da licitação selecionada").count()) {
        issues.push("desktop: uma licitação foi selecionada automaticamente");
      }

      await page
        .getByRole("button", { name: /^Visualizar / })
        .first()
        .click();
      await page.getByLabel("Pré-visualização da licitação selecionada").waitFor();

      await page.getByRole("button", { name: "Salvar filtro" }).click();
      await page.getByRole("dialog").waitFor();
      await page.getByRole("dialog").getByRole("button", { name: "Salvar filtro" }).click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });

      await page.getByRole("button", { name: "Busca inteligente" }).click();
      if (await page.getByRole("heading", { name: "Resultados", exact: true }).count()) {
        issues.push("desktop: resultados permaneceram visíveis em uma nova busca inteligente");
      }
      await page.getByRole("button", { name: "Interpretar busca" }).click();
      await page.getByText("Entendi sua busca").waitFor();
      await page.screenshot({
        path: "artifacts/tender-search-desktop-intelligent-review.png",
        fullPage: false,
      });
      await page.getByRole("button", { name: "Buscar oportunidades" }).click();
      await page.getByRole("heading", { name: "Resultados", exact: true }).waitFor();
      await page.getByRole("heading", { name: "Selecione uma licitação" }).waitFor();
    }

    if (viewport.name === "mobile") {
      await page.screenshot({
        path: "artifacts/tender-search-mobile-initial.png",
        fullPage: false,
      });
      await page.getByRole("button", { name: /Mais filtros/ }).click();
      await page.getByRole("heading", { name: "Mais filtros", exact: true }).waitFor();
      await page.waitForTimeout(350);
      await page.screenshot({
        path: "artifacts/tender-search-mobile-advanced-filters.png",
        fullPage: false,
      });
      await page.locator("#filter-process-advanced").fill("845/2026");
      await page.getByRole("button", { name: /Aplicar e buscar/ }).click();
      await page.getByRole("heading", { name: "Resultados", exact: true }).waitFor();
      await page
        .getByRole("button", { name: /^Visualizar / })
        .first()
        .click();
      await page.getByRole("button", { name: "Voltar aos resultados" }).waitFor();
      await page.waitForTimeout(450);
      await page.screenshot({
        path: "artifacts/tender-search-mobile-detail.png",
        fullPage: false,
      });
      await page.getByRole("button", { name: "Voltar aos resultados" }).click();
      await page
        .getByRole("button", { name: /^Visualizar / })
        .first()
        .waitFor();
    }

    const finalBodyWidth = await page.evaluate(() => document.body.scrollWidth);
    if (finalBodyWidth > viewport.width) {
      issues.push(
        `${viewport.name}: overflow após interação ${finalBodyWidth}px > ${viewport.width}px`,
      );
    }

    await page.screenshot({
      path: `artifacts/tender-search-${viewport.name}.png`,
      fullPage: false,
    });
    console.log(
      `${viewport.name}: ${viewport.width}x${viewport.height}; initial=${initialBodyWidth}; final=${finalBodyWidth}`,
    );
    await page.close();
  }

  await browser.close();
  if (issues.length) {
    console.error(issues.join("\n"));
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
