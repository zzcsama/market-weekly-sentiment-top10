const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "data", "sentiment.json"), "utf8"));

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHANNEL;
const pageUrl = process.env.PUBLIC_PAGE_URL || "https://zzcsama.github.io/market-weekly-sentiment-top10/";

if (!token) {
  throw new Error("Missing TELEGRAM_BOT_TOKEN");
}

if (!chatId) {
  throw new Error("Missing TELEGRAM_CHAT_ID or TELEGRAM_CHANNEL");
}

function topNames(market) {
  return data.markets[market].items
    .slice(0, 3)
    .map((item) => `${item.rank}. ${item.name}(${item.symbol})`)
    .join("  ");
}

function caption() {
  return [
    `一周市场情绪 Top 10`,
    `周期：${data.period.label}`,
    ``,
    `A 股前三：${topNames("cn")}`,
    `美股前三：${topNames("us")}`,
    ``,
    `网页：${pageUrl}`,
    `仅反映公开讨论热度，不构成投资建议。`
  ].join("\n");
}

async function uploadPhoto(photoPath, text) {
  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("caption", text);
  form.append("photo", new Blob([fs.readFileSync(photoPath)]), path.basename(photoPath));

  const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: "POST",
    body: form
  });
  if (!response.ok) {
    throw new Error(`Telegram sendPhoto failed: ${response.status} ${await response.text()}`);
  }
}

(async () => {
  await uploadPhoto(path.join(root, "outputs", "market-sentiment-cn.png"), caption());
  await uploadPhoto(path.join(root, "outputs", "market-sentiment-us.png"), `一周美股热评 Top 10\n${pageUrl}`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
