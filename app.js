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
  SOXX: "ishares.com",
  SMH: "vaneck.com",
  SPY: "ssga.com",
  QQQ: "invesco.com",
  DIA: "ssga.com",
  IWM: "ishares.com"
};

const DEFAULT_REPORTS = {
  us: {
    title: "美股周报",
    kicker: "US Market Weekly",
    headline: "本周要点",
    valueLabel: "收盘价（美元）",
    keyPoints: [
      { icon: "trend", title: "科技股强势领涨", text: "纳斯达克100全周 +5.50%" },
      { icon: "chip", title: "半导体板块爆发", text: "SOXX +11.71%" },
      { icon: "balance", title: "市场分化加剧", text: "科技成长强，能源公用事业回调" },
      { icon: "trophy", title: "龙头科技股普涨", text: "TSLA +9.60%，NVDA +8.44%" }
    ],
    indices: [
      { symbol: "SPY", name: "标普500 ETF", value: "737.62", change: "+2.35%" },
      { symbol: "QQQ", name: "纳斯达克100 ETF", value: "711.23", change: "+5.50%" },
      { symbol: "DIA", name: "道琼斯工业ETF", value: "496.13", change: "+0.22%" },
      { symbol: "IWM", name: "罗素2000 ETF", value: "284.17", change: "+1.75%" }
    ],
    sectors: [
      { symbol: "SOXX", name: "半导体ETF（iShares）", change: "+11.71%" },
      { symbol: "SMH", name: "半导体ETF（VanEck）", change: "+11.13%" },
      { symbol: "XLK", name: "科技板块ETF", change: "+8.43%" },
      { symbol: "XLY", name: "可选消费ETF", change: "+1.32%" },
      { symbol: "XLB", name: "材料板块ETF", change: "+0.47%" },
      { symbol: "XLRE", name: "房地产ETF", change: "+0.20%" },
      { symbol: "XLC", name: "通信服务ETF", change: "+0.19%" },
      { symbol: "XLI", name: "工业板块ETF", change: "+0.14%" },
      { symbol: "XLP", name: "必需消费ETF", change: "+0.01%" },
      { symbol: "XLV", name: "医疗保健ETF", change: "-1.15%" },
      { symbol: "XLF", name: "金融板块ETF", change: "-1.31%" },
      { symbol: "XLU", name: "公用事业ETF", change: "-3.93%" },
      { symbol: "XLE", name: "能源板块ETF", change: "-5.35%" }
    ],
    hotStocks: [
      { symbol: "TSLA", name: "特斯拉", value: "$428.35", change: "+9.60%" },
      { symbol: "NVDA", name: "英伟达", value: "$215.20", change: "+8.44%" },
      { symbol: "AAPL", name: "苹果", value: "$293.32", change: "+4.70%" },
      { symbol: "GOOGL", name: "谷歌", value: "$400.80", change: "+3.92%" },
      { symbol: "AMZN", name: "亚马逊", value: "$272.68", change: "+1.65%" },
      { symbol: "MSFT", name: "微软", value: "$415.12", change: "+0.16%" },
      { symbol: "META", name: "Meta Platforms", value: "$609.63", change: "+0.15%" }
    ],
    earnings: [
      { symbol: "SPG", date: "5月11日", time: "盘后" },
      { symbol: "MNDY", date: "5月11日", time: "盘前" },
      { symbol: "PLUG", date: "5月11日", time: "盘后" },
      { symbol: "HIMS", date: "5月11日", time: "盘后" },
      { symbol: "SE", date: "5月12日", time: "盘前" },
      { symbol: "UAA", date: "5月12日", time: "盘前" },
      { symbol: "BABA", date: "5月13日", time: "盘前" },
      { symbol: "WIX", date: "5月13日", time: "盘前" },
      { symbol: "CSCO", date: "5月13日", time: "盘后" },
      { symbol: "AMAT", date: "5月14日", time: "盘后" }
    ],
    events: [
      { time: "5月12日 21:30", title: "核心CPI月率 / CPI月率 / CPI年率", value: "0.3% / 0.6% / 3.7%" },
      { time: "5月13日 01:00", title: "美联储主席提名投票", value: "关注政策预期" },
      { time: "5月13日 21:30", title: "核心PPI月率 / PPI月率", value: "0.3% / 0.5%" },
      { time: "5月14日 21:30", title: "核心零售销售月率 / 初请失业金人数", value: "0.6% / 20.6万" }
    ]
  },
  cn: {
    title: "A股周报",
    kicker: "China A-share Weekly",
    headline: "本周要点",
    valueLabel: "情绪分",
    keyPoints: [
      { icon: "trend", title: "新能源链关注度居前", text: "宁德时代、比亚迪维持高热" },
      { icon: "chip", title: "算力硬件继续活跃", text: "光模块与服务器链条被集中讨论" },
      { icon: "balance", title: "消费与医药分歧仍在", text: "白酒、CXO 情绪波动较明显" },
      { icon: "trophy", title: "龙头题材带动榜单", text: "AI、智能车、半导体热度靠前" }
    ],
    indices: [
      { symbol: "510300", name: "沪深300 ETF", value: "情绪稳", change: "+1.80%" },
      { symbol: "159915", name: "创业板 ETF", value: "偏强", change: "+2.70%" },
      { symbol: "512480", name: "半导体 ETF", value: "活跃", change: "+3.40%" },
      { symbol: "512880", name: "证券 ETF", value: "温和", change: "+1.20%" }
    ],
    sectors: [
      { symbol: "AI", name: "AI 算力链", change: "+6.10%" },
      { symbol: "CPO", name: "光模块", change: "+5.80%" },
      { symbol: "EV", name: "新能源车", change: "+3.20%" },
      { symbol: "Semi", name: "半导体", change: "+2.40%" },
      { symbol: "Broker", name: "券商", change: "+1.10%" },
      { symbol: "Gold", name: "黄金资源", change: "+0.90%" },
      { symbol: "Liquor", name: "白酒", change: "-1.20%" },
      { symbol: "CXO", name: "医药外包", change: "-2.60%" }
    ],
    earnings: [
      { symbol: "300750", date: "下周", time: "产业链跟踪" },
      { symbol: "002594", date: "下周", time: "销量数据" },
      { symbol: "600519", date: "下周", time: "渠道反馈" },
      { symbol: "300308", date: "下周", time: "订单变化" },
      { symbol: "688981", date: "下周", time: "产业政策" }
    ],
    events: [
      { time: "周一", title: "社融与信贷预期", value: "观察流动性" },
      { time: "周二", title: "重点行业景气跟踪", value: "AI / 新能源" },
      { time: "周三", title: "海外宏观数据外溢", value: "影响成长风格" },
      { time: "周四", title: "北向与成交额变化", value: "观察风险偏好" }
    ]
  }
};

const QUOTE_VALUES = {
  NVDA: "$215.20",
  TSLA: "$428.35",
  AAPL: "$293.32",
  MSFT: "$415.12",
  AMD: "$164.08",
  META: "$609.63",
  GOOGL: "$400.80",
  PLTR: "$132.45",
  AMZN: "$272.68",
  COIN: "$248.10"
};

const BADGE_ONLY_SYMBOLS = new Set([
  "SOXX",
  "SMH",
  "XLK",
  "XLY",
  "XLB",
  "XLRE",
  "XLC",
  "XLI",
  "XLP",
  "XLV",
  "XLF",
  "XLU",
  "XLE",
  "AI",
  "CPO",
  "EV",
  "SEMI",
  "BROKER",
  "GOLD",
  "LIQUOR",
  "CXO"
]);

const $ = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function marketKeyFromUrl() {
  const value = new URLSearchParams(window.location.search).get("market");
  return value === "cn" ? "cn" : "us";
}

function formatPeriod(period) {
  if (!period?.start || !period?.end) return period?.label || "";
  const format = (value) => {
    const date = new Date(`${value}T00:00:00+08:00`);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, "0")}月${String(date.getDate()).padStart(2, "0")}日`;
  };
  return `${format(period.start)} - ${format(period.end)}`;
}

function logoUrl(symbol) {
  const domain = LOGO_DOMAINS[String(symbol || "").toUpperCase()];
  return domain ? `https://geticon.dev/?url=${encodeURIComponent(domain)}` : "";
}

function logoMarkup(symbol, name) {
  const rawSymbol = String(symbol || "?").toUpperCase();
  const cleanSymbol = escapeHtml(rawSymbol);
  const src = logoUrl(rawSymbol);
  if (BADGE_ONLY_SYMBOLS.has(rawSymbol)) {
    return `<span class="ticker-fallback badge-${cleanSymbol.length % 6}">${cleanSymbol.slice(0, 5)}</span>`;
  }
  if (!src) {
    return `<span class="ticker-fallback badge-${cleanSymbol.length % 6}">${cleanSymbol.slice(0, 5)}</span>`;
  }
  return `<span class="logo-chip"><img src="${escapeHtml(src)}" alt="${escapeHtml(name || symbol)} logo" loading="lazy" /><b>${cleanSymbol.slice(0, 5)}</b></span>`;
}

function iconSvg(type) {
  const icons = {
    trend: '<path d="M5 28h26"/><path d="M8 24l6-7 6 4 9-12"/><path d="M23 9h6v6"/><path d="M10 28v-8M18 28v-5M26 28V13"/>',
    chip: '<rect x="9" y="9" width="18" height="18" rx="3"/><path d="M14 14h8v8h-8z"/><path d="M4 13h5M4 18h5M4 23h5M27 13h5M27 18h5M27 23h5M13 4v5M18 4v5M23 4v5M13 27v5M18 27v5M23 27v5"/>',
    balance: '<path d="M18 6v24M8 10h20M11 10l-6 10h12l-6-10ZM25 10l-6 10h12l-6-10ZM10 30h16"/>',
    trophy: '<path d="M11 7h14v6c0 6-3 10-7 10s-7-4-7-10V7Z"/><path d="M11 10H6c0 5 2 8 6 8M25 10h5c0 5-2 8-6 8M18 23v5M13 30h10"/>',
    chart: '<path d="M5 28h26"/><path d="M9 24V14M16 24V9M23 24V17M30 24V6"/><path d="M10 11l6-5 7 8 7-10"/>',
    refresh: '<path d="M28 13a10 10 0 0 0-17-5L8 11"/><path d="M8 5v6h6"/><path d="M8 23a10 10 0 0 0 17 5l3-3"/><path d="M28 31v-6h-6"/>',
    fire: '<path d="M19 31c6-2 9-6 9-12 0-6-4-10-7-13 0 5-3 7-6 10-2 2-4 5-4 8 0 5 4 8 8 7Z"/><path d="M18 30c2-2 3-4 3-6 0-2-1-4-3-6-1 3-4 5-4 8 0 2 1 4 4 4Z"/>',
    calendar: '<rect x="7" y="8" width="22" height="21" rx="3"/><path d="M12 5v6M24 5v6M7 14h22M12 19h4M20 19h4M12 24h4M20 24h4"/>',
    globe: '<circle cx="18" cy="18" r="13"/><path d="M5 18h26M18 5c4 4 6 8 6 13s-2 9-6 13M18 5c-4 4-6 8-6 13s2 9 6 13"/>',
    shield: '<path d="M18 5l11 4v8c0 7-4 12-11 15C11 29 7 24 7 17V9l11-4Z"/><path d="M13 18l3 3 7-8"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 36 36">${icons[type] || icons.chart}</svg>`;
}

function changeClass(value) {
  const text = String(value || "").trim();
  if (text.startsWith("-")) return "down";
  if (text.startsWith("+")) return "up";
  return "";
}

function arrow(value) {
  return changeClass(value) === "down" ? "▼" : "▲";
}

function reportFor(data, marketKey) {
  const defaults = DEFAULT_REPORTS[marketKey];
  const market = data.markets?.[marketKey] || {};
  const report = data.reports?.[marketKey] || {};
  const marketHotStocks = (market.items || []).slice(0, 7).map((item) => ({
    symbol: item.symbol,
    name: item.name,
    value: QUOTE_VALUES[String(item.symbol || "").toUpperCase()] || String(item.score ?? "--"),
    change: item.change || ""
  }));
  const hotStocks =
    report.hotStocks ||
    (marketKey === "us"
      ? defaults.hotStocks
      : marketHotStocks.length
        ? marketHotStocks
        : defaults.hotStocks);

  return {
    ...defaults,
    ...report,
    hotStocks,
    market,
    period: formatPeriod(data.period),
    disclaimer: data.disclaimer || "本报告仅为信息分享，不构成任何投资建议。"
  };
}

function tableRows(rows, columns) {
  return rows
    .map(
      (row) => `
        <tr>
          ${columns
            .map((column) => {
              if (column === "symbol") return `<td>${logoMarkup(row.symbol, row.name)}</td>`;
              if (column === "change") {
                return `<td class="change-cell ${changeClass(row.change)}"><span>${arrow(row.change)}</span>${escapeHtml(row.change)}</td>`;
              }
              return `<td>${escapeHtml(row[column])}</td>`;
            })
            .join("")}
        </tr>
      `
    )
    .join("");
}

function renderReport(data, marketKey) {
  const report = reportFor(data, marketKey);
  const root = $("#report");
  document.title = report.title;

  root.innerHTML = `
    <article class="weekly-report">
      <header class="report-header">
        <div>
          <p>${escapeHtml(report.kicker)}</p>
          <h1>${escapeHtml(report.title)}<span></span>${escapeHtml(report.period)}</h1>
        </div>
        <div class="market-switch" aria-label="市场切换">
          <a class="${marketKey === "us" ? "active" : ""}" href="?market=us">美股</a>
          <a class="${marketKey === "cn" ? "active" : ""}" href="?market=cn">A股</a>
        </div>
        <div class="header-chart" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i>
        </div>
      </header>

      <section class="section-title">
        <h2>${escapeHtml(report.headline)}</h2>
      </section>

      <section class="key-grid">
        ${report.keyPoints
          .map(
            (item, index) => `
              <div class="key-item">
                <div class="round-icon icon-${index + 1}">${iconSvg(item.icon)}</div>
                <p><b>${index + 1}) ${escapeHtml(item.title)}：</b>${escapeHtml(item.text)}</p>
              </div>
            `
          )
          .join("")}
      </section>

      <section class="split-grid">
        <div class="panel">
          <div class="panel-title"><h3>A. 指数表现</h3>${iconSvg("chart")}</div>
          <table>
            <thead><tr><th>代码</th><th>指数名称</th><th>收盘价</th><th>周涨跌幅</th></tr></thead>
            <tbody>${tableRows(report.indices, ["symbol", "name", "value", "change"])}</tbody>
          </table>
        </div>

        <div class="panel">
          <div class="panel-title"><h3>B. 板块轮动</h3>${iconSvg("refresh")}</div>
          <table>
            <thead><tr><th>代码</th><th>板块 / 行业 / ETF</th><th>周涨跌幅</th></tr></thead>
            <tbody>${tableRows(report.sectors, ["symbol", "name", "change"])}</tbody>
          </table>
        </div>
      </section>

      <section class="panel wide-panel">
        <div class="center-title">${iconSvg("fire")}<h3>热门股票涨跌榜</h3></div>
        <table class="hot-table">
          <thead><tr><th>代码</th><th>公司名称</th><th>${escapeHtml(report.valueLabel)}</th><th>周涨跌幅</th></tr></thead>
          <tbody>${tableRows(report.hotStocks, ["symbol", "name", "value", "change"])}</tbody>
        </table>
      </section>

      <section class="watch-panel">
        <div class="section-title watch-title">
          ${iconSvg("globe")}
          <h2>下周关注</h2>
        </div>
        <div class="watch-grid">
          <div class="panel mini-panel">
            <div class="panel-title"><h3>重要财报（美东时间）</h3>${iconSvg("calendar")}</div>
            <div class="earnings-list">
              ${report.earnings
                .map(
                  (item) => `
                    <div>
                      <b>${escapeHtml(item.symbol)}</b>
                      <span>${escapeHtml(item.date)}</span>
                      <em>${escapeHtml(item.time)}</em>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
          <div class="panel mini-panel">
            <div class="panel-title"><h3>重要经济数据（北京时间）</h3>${iconSvg("globe")}</div>
            <div class="event-list">
              ${report.events
                .map(
                  (event) => `
                    <div>
                      <time>${escapeHtml(event.time)}</time>
                      <p>${escapeHtml(event.title)}</p>
                      <strong>${escapeHtml(event.value)}</strong>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>

      <footer class="report-footer">
        ${iconSvg("shield")}
        <p>${escapeHtml(report.disclaimer)}</p>
      </footer>
    </article>
  `;

  document.querySelectorAll(".logo-chip img").forEach((image) => {
    image.addEventListener("error", () => {
      const chip = image.closest(".logo-chip");
      chip?.classList.add("logo-missing");
      image.remove();
    });
  });
}

async function boot() {
  try {
    const response = await fetch("data/sentiment.json", { cache: "no-store" });
    const data = await response.json();
    renderReport(data, marketKeyFromUrl());
  } catch (error) {
    $("#report").innerHTML = `<div class="loading-card">数据加载失败，请稍后刷新页面。</div>`;
    console.error(error);
  }
}

boot();
