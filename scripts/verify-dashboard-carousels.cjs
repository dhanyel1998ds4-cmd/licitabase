const {
  chromium,
} = require("C:/Users/Rent e Clean/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const issues = [];

  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 1024, height: 768 },
    { name: "tablet-portrait", width: 768, height: 1024 },
    { name: "mobile-wide", width: 430, height: 932 },
    { name: "mobile", width: 390, height: 844 },
    { name: "mobile-small", width: 320, height: 780 },
  ]) {
    const page = await browser.newPage({ viewport });
    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) {
        issues.push(`${viewport.name}: console: ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => issues.push(`${viewport.name}: pageerror: ${error.message}`));

    await page.goto("http://127.0.0.1:5173/dash2", { waitUntil: "networkidle" });
    await page.getByText("Licitações ganhas", { exact: true }).first().waitFor();

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    if (bodyWidth > viewport.width) {
      issues.push(`${viewport.name}: overflow ${bodyWidth}px > ${viewport.width}px`);
    }

    const nextWon = page.getByRole("button", {
      name: "Próxima página de Resultados de licitações ganhas",
    });
    const nextLive = page.getByRole("button", {
      name: "Próxima página de Licitações em andamento",
    });
    const nextPortals = page.getByRole("button", {
      name: "Próxima página de Status dos portais conectados",
    });

    if (viewport.width < 768) {
      const mobileModules = [
        {
          label: "Resultados de licitações ganhas",
          control: nextWon,
          screenshot: "won-bids",
        },
        {
          label: "Licitações em andamento",
          control: nextLive,
          screenshot: "live-bids",
        },
        {
          label: "Status dos portais conectados",
          control: nextPortals,
          screenshot: "portal-status",
        },
      ];

      for (const module of mobileModules) {
        const control = module.control;
        if ((await control.count()) !== 1) {
          issues.push(`${viewport.name}: controle mobile ausente ou duplicado`);
          continue;
        }
        await control.scrollIntoViewIfNeeded();
        await control.click();
        await page.waitForTimeout(80);
        if (!(await control.isDisabled())) {
          issues.push(`${viewport.name}: controle não avançou para a última página`);
        }

        const geometry = await page
          .locator(`[data-mobile-paged-list="${module.label}"]`)
          .evaluate((root) => {
            const viewport = root.querySelector(".overflow-hidden")?.getBoundingClientRect();
            const page = root.querySelector('[data-mobile-page="2"]')?.getBoundingClientRect();
            if (!viewport || !page) return null;
            return {
              viewportLeft: viewport.left,
              viewportRight: viewport.right,
              viewportWidth: viewport.width,
              pageLeft: page.left,
              pageRight: page.right,
              pageWidth: page.width,
              pageOverflow: Math.max(0, page.scrollWidth - page.clientWidth),
            };
          });

        if (!geometry) {
          issues.push(`${viewport.name}: geometria ausente em ${module.label}`);
        } else {
          const leftDelta = Math.abs(geometry.pageLeft - geometry.viewportLeft);
          const rightDelta = Math.abs(geometry.pageRight - geometry.viewportRight);
          const widthDelta = Math.abs(geometry.pageWidth - geometry.viewportWidth);
          if (leftDelta > 1.5 || rightDelta > 1.5 || widthDelta > 1.5) {
            issues.push(
              `${viewport.name}: página 2 desalinhada em ${module.label} ` +
                `(left=${leftDelta.toFixed(1)}, right=${rightDelta.toFixed(1)}, width=${widthDelta.toFixed(1)})`,
            );
          }
          if (geometry.pageOverflow > 1) {
            issues.push(
              `${viewport.name}: conteúdo excede a página 2 de ${module.label} em ${geometry.pageOverflow}px`,
            );
          }
        }

        await page.locator(`[data-mobile-paged-list="${module.label}"]`).scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `artifacts/${module.screenshot}-${viewport.name}-page-2.png`,
          fullPage: false,
        });
      }
    } else if ((await nextWon.count()) + (await nextLive.count()) + (await nextPortals.count())) {
      issues.push(`${viewport.name}: carrossel apareceu com largura >= 768px`);
    }

    await page.getByText("Licitações ganhas", { exact: true }).first().scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `artifacts/dashboard-modules-${viewport.name}.png`,
      fullPage: false,
    });
    console.log(`${viewport.name}: ${viewport.width}x${viewport.height}; bodyWidth=${bodyWidth}`);
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
