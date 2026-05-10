const state = {
  data: null,
  currentMarket: "cn"
};

const LOGO_DOMAINS = {
  "300750": "catl.com",
  "600519": "moutaichina.com",
  "002594": "byd.com",
  "300308": "innolight.com",
  "601138": "fii-foxconn.com",
  "300059": "eastmoney.com",
  "603259": "wuxiapptec.com",
  "601127": "seres.cn",
  "688981": "smics.com",
  "601899": "zijinmining.com",
  "000858": "wuliangye.com.cn",
  "601318": "pingan.cn",
  "600036": "cmbchina.com",
  "000333": "midea.com",
  "600276": "hengrui.com",
  "000651": "gree.com",
  "600887": "yili.com",
  "601012": "longi.com",
  "600030": "citics.com",
  "600900": "ctg.com.cn",
  NVDA: "nvidia.com",
  TSLA: "tesla.com",
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  AMD: "amd.com",
  META: "meta.com",
  GOOGL: "abc.xyz",
  GOOG: "abc.xyz",
  PLTR: "palantir.com",
  AMZN: "amazon.com",
  COIN: "coinbase.com",
  RDDT: "reddit.com",
  NFLX: "netflix.com",
  GME: "gamestop.com",
  AMC: "amctheatres.com",
  HOOD: "robinhood.com",
  MSTR: "strategy.com",
  BABA: "alibabagroup.com",
  AVGO: "broadcom.com",
  ORCL: "oracle.com",
  CRM: "salesforce.com",
  INTC: "intel.com",
  QCOM: "qualcomm.com",
  SHOP: "shopify.com",
  UBER: "uber.com",
  DIS: "disney.com",
  PYPL: "paypal.com",
  SNOW: "snowflake.com"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function formatDateTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function initialMarket() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("market");
  return value === "us" ? "us" : "cn";
}

function changeClass(value) {
  if (!value) return "";
  if (String(value).trim().startsWith("-")) return "down";
  if (String(value).trim().startsWith("+")) return "up";
  return "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function logoInitial(item) {
  const value = item.symbol || item.name || "?";
  return escapeHtml(String(value).trim().slice(0, 2).toUpperCase());
}

function logoMarkup(item) {
  const symbol = String(item.symbol || "").toUpperCase();
  const domain = item.logoDomain || LOGO_DOMAINS[symbol];
  const logoUrl = item.logoUrl || (domain ? `https://geticon.dev/?url=${encodeURIComponent(domain)}` : "");
  const fallback = `<span class="logo-fallback-text">${logoInitial(item)}</span>`;
  if (!logoUrl) {
    return `<div class="brand-logo logo-fallback">${fallback}</div>`;
  }
  return `
    <div class="brand-logo" data-fallback="${logoInitial(item)}">
      <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(item.name || item.symbol || "公司")} logo" loading="lazy" />
      ${fallback}
    </div>
  `;
}

function renderMarket(marketKey) {
  if (!state.data) return;

  const market = state.data.markets[marketKey] || state.data.markets.cn;
  const items = Array.isArray(market.items) ? market.items.slice(0, 10) : [];
  state.currentMarket = marketKey;

  const accent = market.accent || (marketKey === "us" ? "#8fb9ff" : "#df7a63");
  document.documentElement.style.setProperty("--accent", accent);
  const soft = marketKey === "us" ? "rgba(143, 185, 255, 0.16)" : "rgba(223, 122, 99, 0.16)";
  document.documentElement.style.setProperty("--accent-soft", soft);

  $$(".market-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.market === marketKey);
  });

  $("#period").textContent = state.data.period?.label || "--";
  $("#marketLabel").textContent = market.label || "";
  $("#marketTitle").textContent = market.subtitle || "本周市场情绪 Top 10";
  $("#sourceText").textContent = market.source || "公开数据";
  $("#countStat").textContent = String(items.length);
  $("#scoreStat").textContent = items[0] ? String(items[0].score) : "--";
  $("#updateStat").textContent = market.aiStatus || market.updatedLabel || "已更新";
  $("#generatedAt").textContent = `生成时间 ${formatDateTime(state.data.generatedAt)}`;
  $("#disclaimer").textContent = state.data.disclaimer || "本榜单仅用于观察市场情绪，不构成投资建议。";

  $("#leaderboard").innerHTML = items
    .map((item) => {
      const change = item.change ? `<span class="change ${changeClass(item.change)}">${item.change}</span>` : "";
      const aiComment = item.aiComment
        ? `<p class="ai-comment"><span>DeepSeek 评价</span>${escapeHtml(item.aiComment)}</p>`
        : "";
      return `
        <article class="row-card">
          <div class="rank">${item.rank}</div>
          <div class="stock-identity">
            ${logoMarkup(item)}
            <div class="stock-name">
              <strong>${escapeHtml(item.name || item.symbol)}</strong>
              <span>${escapeHtml(item.symbol || "")}</span>
            </div>
          </div>
          <div class="text-stack">
            <p class="summary">${escapeHtml(item.summary || "")}</p>
            ${aiComment}
          </div>
          <div class="metric-box">
            <span class="score">${item.score ?? "--"}</span>
            <span class="metric">${item.metric || "热度"}</span>
            ${change}
          </div>
        </article>
      `;
    })
    .join("");

  $$(".brand-logo img").forEach((image) => {
    image.addEventListener("error", () => {
      image.closest(".brand-logo")?.classList.add("logo-fallback");
      image.remove();
    });
  });
}

async function boot() {
  state.currentMarket = initialMarket();

  $$(".market-tab").forEach((tab) => {
    tab.addEventListener("click", () => renderMarket(tab.dataset.market));
  });

  try {
    const response = await fetch("data/sentiment.json", { cache: "no-store" });
    state.data = await response.json();
    renderMarket(state.currentMarket);
  } catch (error) {
    $("#leaderboard").innerHTML = `<article class="row-card"><p class="summary">数据加载失败，请稍后刷新页面。</p></article>`;
    console.error(error);
  }
}

boot();
