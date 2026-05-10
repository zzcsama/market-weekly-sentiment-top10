const state = {
  data: null,
  currentMarket: "cn"
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

function renderMarket(marketKey) {
  if (!state.data) return;

  const market = state.data.markets[marketKey] || state.data.markets.cn;
  const items = Array.isArray(market.items) ? market.items.slice(0, 10) : [];
  state.currentMarket = marketKey;

  document.documentElement.style.setProperty("--accent", market.accent || "#ff4d5e");
  const soft = marketKey === "us" ? "rgba(76, 201, 240, 0.2)" : "rgba(255, 77, 94, 0.2)";
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
        ? `<p class="ai-comment"><span>DeepSeek 评价</span>${item.aiComment}</p>`
        : "";
      return `
        <article class="row-card">
          <div class="rank">${item.rank}</div>
          <div class="stock-name">
            <strong>${item.name || item.symbol}</strong>
            <span>${item.symbol || ""}</span>
          </div>
          <div class="text-stack">
            <p class="summary">${item.summary || ""}</p>
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
