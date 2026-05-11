const { chromium } = require("@playwright/test");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "outputs");
const marketArg = process.argv[2] || "all";
const markets = marketArg === "all" ? ["cn", "us"] : [marketArg];

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".js") return "application/javascript; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".png") return "image/png";
  return "application/octet-stream";
}

function startServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const filePath = path.normalize(path.join(root, pathname));
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType(filePath) });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

async function captureMarket(browser, baseUrl, market) {
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1600 },
    deviceScaleFactor: 2
  });
  await page.goto(`${baseUrl}/?market=${market}`, { waitUntil: "networkidle" });
  await page.waitForSelector(".weekly-report");
  await page.screenshot({
    path: path.join(outputDir, `market-sentiment-${market}.png`),
    fullPage: true
  });
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const server = await startServer();
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const browser = await chromium.launch({ headless: true });

  try {
    for (const market of markets) {
      if (!["cn", "us"].includes(market)) {
        throw new Error(`Unknown market: ${market}`);
      }
      await captureMarket(browser, baseUrl, market);
    }
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
