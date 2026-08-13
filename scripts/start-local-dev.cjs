const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");
const { spawn } = require("node:child_process");

const host = process.argv[2] || "127.0.0.1";
const port = Number(process.argv[3] || 5173);
const projectRoot = path.resolve(__dirname, "..");

function isListening() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(500);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => resolve(false));
  });
}

function cleanEnvironment() {
  const entries = new Map();
  for (const [key, value] of Object.entries(process.env)) {
    entries.set(key.toLowerCase(), [key.toLowerCase() === "path" ? "Path" : key, value]);
  }
  return Object.fromEntries(entries.values());
}

(async () => {
  if (await isListening()) {
    console.log(`Servidor já ativo em http://${host}:${port}`);
    return;
  }

  const logDirectory = path.join(projectRoot, ".codex-logs");
  fs.mkdirSync(logDirectory, { recursive: true });
  const stdout = fs.openSync(path.join(logDirectory, `vite-${port}.out.log`), "a");
  const stderr = fs.openSync(path.join(logDirectory, `vite-${port}.err.log`), "a");
  const vite = path.join(projectRoot, "node_modules", "vite", "bin", "vite.js");

  const child = spawn(process.execPath, [vite, "--host", host, "--port", String(port)], {
    cwd: projectRoot,
    detached: true,
    windowsHide: true,
    stdio: ["ignore", stdout, stderr],
    env: cleanEnvironment(),
  });
  child.unref();

  for (let attempt = 0; attempt < 30; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (await isListening()) {
      console.log(`Servidor iniciado em http://${host}:${port} (PID ${child.pid})`);
      return;
    }
  }

  throw new Error(`O servidor não abriu a porta ${port}. Consulte .codex-logs/vite-${port}.err.log.`);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
