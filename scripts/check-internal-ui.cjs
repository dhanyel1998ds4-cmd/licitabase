const fs = require("node:fs");
const path = require("node:path");
const routes = require("./internal-routes.manifest.cjs");

const missing = routes.filter(({ file }) => !fs.existsSync(path.resolve(process.cwd(), file)));
if (missing.length) {
  console.error(
    `Rotas internas ausentes no manifesto: ${missing.map(({ file }) => file).join(", ")}`,
  );
  process.exit(1);
}

console.log(`${routes.length} rotas internas registradas.`);
