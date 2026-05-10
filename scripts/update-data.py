#!/usr/bin/env python3
import json
import math
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "sentiment.json"
SNAPSHOT_DIR = ROOT / "data" / "snapshots"
CN_LIMIT = 10
US_LIMIT = 10
TZ = timezone(timedelta(hours=8))
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com").rstrip("/")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-v4-flash")
US_EXCLUDED_SYMBOLS = {
    "SPY",
    "QQQ",
    "VOO",
    "VTI",
    "DIA",
    "IWM",
    "TQQQ",
    "SQQQ",
    "USO",
    "GLD",
    "SLV",
    "XLK",
    "XLF",
    "XLE",
    "ARKK",
}


def now_shanghai() -> datetime:
    return datetime.now(TZ)


def week_period(today: datetime) -> Dict[str, str]:
    start = today.date() - timedelta(days=today.weekday())
    end = start + timedelta(days=6)
    return {
        "label": f"{start:%Y/%m/%d} - {end:%Y/%m/%d}",
        "start": f"{start:%Y-%m-%d}",
        "end": f"{end:%Y-%m-%d}",
    }


def load_existing() -> Dict[str, Any]:
    if DATA_FILE.exists():
        with DATA_FILE.open("r", encoding="utf-8") as fh:
            return json.load(fh)
    return {}


def to_float(value: Any) -> Optional[float]:
    if value is None:
        return None
    text = str(value).replace("%", "").replace(",", "").strip()
    if not text or text in {"-", "--", "nan", "None"}:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def to_int(value: Any, default: int = 0) -> int:
    num = to_float(value)
    if num is None or math.isnan(num):
        return default
    return int(num)


def pick(row: Dict[str, Any], names: List[str], default: Any = None) -> Any:
    for name in names:
        if name in row and row[name] not in (None, ""):
            return row[name]
    return default


def pct_text(value: Optional[float]) -> str:
    if value is None:
        return ""
    sign = "+" if value > 0 else ""
    return f"{sign}{value:.2f}%"


def build_cn_summary(rank: int, change: Optional[float], metric: str) -> str:
    if change is None:
        return f"东方财富人气榜第 {rank}，本周讨论热度较高，市场关注度集中在短期情绪变化。"
    direction = "上涨" if change > 0 else "回落" if change < 0 else "横盘"
    return f"东方财富人气榜第 {rank}，股价本周{direction} {abs(change):.2f}%，{metric}带动讨论热度升温。"


def compact_item(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "rank": item.get("rank"),
        "symbol": item.get("symbol"),
        "name": item.get("name"),
        "score": item.get("score"),
        "metric": item.get("metric"),
        "change": item.get("change"),
        "summary": item.get("summary"),
    }


def clean_ai_comment(value: Any) -> str:
    text = str(value or "").replace("\n", " ").strip()
    return text[:120]


def apply_deepseek_comments(
    markets: Dict[str, List[Dict[str, Any]]],
    period: Dict[str, str],
) -> Dict[str, str]:
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        return {"cn": "未配置 DeepSeek", "us": "未配置 DeepSeek"}

    prompt_payload = {
        "period": period,
        "markets": {
            "cn": [compact_item(item) for item in markets["cn"]],
            "us": [compact_item(item) for item in markets["us"]],
        },
    }
    prompt = (
        "请根据以下公开市场热度榜数据，为每只股票生成一条中文本周评价。"
        "要求：只描述本周市场情绪、讨论焦点、波动原因或关注点；"
        "不要写买入、卖出、持有、加仓、减仓、目标价等投资建议；"
        "每条 26 到 46 个汉字；严格输出 JSON，格式为 "
        '{"cn":{"代码":"评价"},"us":{"代码":"评价"}}。\n\n'
        f"{json.dumps(prompt_payload, ensure_ascii=False)}"
    )

    try:
        response = requests.post(
            f"{DEEPSEEK_BASE_URL}/chat/completions",
            timeout=45,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": DEEPSEEK_MODEL,
                "messages": [
                    {
                        "role": "system",
                        "content": "你是谨慎的市场情绪周报编辑，只做公开信息解读，不提供投资建议。",
                    },
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.2,
                "max_tokens": 1800,
                "response_format": {"type": "json_object"},
                "thinking": {"type": "disabled"},
                "stream": False,
            },
        )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        comments = json.loads(content)
        for market_key, items in markets.items():
            market_comments = comments.get(market_key, {})
            for item in items:
                comment = clean_ai_comment(market_comments.get(str(item.get("symbol"))))
                if comment:
                    item["aiComment"] = comment
        return {"cn": "DeepSeek 评价已生成", "us": "DeepSeek 评价已生成"}
    except Exception as exc:
        print(f"DeepSeek analysis failed: {exc}")
        return {"cn": "DeepSeek 评价失败", "us": "DeepSeek 评价失败"}


def fetch_cn_items() -> List[Dict[str, Any]]:
    try:
        import akshare as ak
    except ImportError as exc:
        raise RuntimeError("akshare is not installed") from exc

    frame = ak.stock_hot_rank_em()
    rows = frame.to_dict(orient="records")
    items: List[Dict[str, Any]] = []

    for index, row in enumerate(rows[:CN_LIMIT], start=1):
        rank = to_int(pick(row, ["当前排名", "排名", "序号", "排行"], index), index)
        symbol = str(pick(row, ["代码", "证券代码", "股票代码"], "")).strip()
        name = str(pick(row, ["股票名称", "名称", "证券简称"], symbol)).strip()
        change = to_float(pick(row, ["涨跌幅", "最新涨跌幅", "涨幅", "今日涨跌幅"]))
        hot_value = pick(row, ["人气值", "排名变化", "热度"], None)
        metric = f"人气榜第 {rank}" if hot_value is None else f"人气 {hot_value}"
        score = round(max(50, 110 - rank * 4) + min(abs(change or 0) * 1.2, 12))

        items.append(
            {
                "rank": index,
                "symbol": symbol,
                "name": name,
                "score": min(99, score),
                "metric": metric,
                "change": pct_text(change),
                "summary": build_cn_summary(rank, change, "人气排名"),
            }
        )

    if len(items) < CN_LIMIT:
        raise RuntimeError("not enough cn market rows")
    return items


def fetch_us_items() -> List[Dict[str, Any]]:
    url = os.getenv("APEWISDOM_URL", "https://apewisdom.io/api/v1.0/filter/all-stocks/page/1")
    response = requests.get(url, timeout=25, headers={"User-Agent": "market-weekly-sentiment-top10/1.0"})
    response.raise_for_status()
    payload = response.json()
    rows = payload.get("results") or payload.get("data") or []
    if not isinstance(rows, list):
        raise RuntimeError("unexpected ApeWisdom payload")

    items: List[Dict[str, Any]] = []
    for raw_index, row in enumerate(rows, start=1):
        rank = to_int(pick(row, ["rank", "current_rank"], raw_index), raw_index)
        symbol = str(pick(row, ["ticker", "symbol"], "")).upper().strip()
        if not symbol or symbol in US_EXCLUDED_SYMBOLS:
            continue
        name = str(pick(row, ["name", "company_name"], symbol)).strip()
        mentions = to_int(pick(row, ["mentions", "mention_count", "mentions_24h"], 0), 0)
        upvotes = to_int(pick(row, ["upvotes", "upvote_count"], 0), 0)
        previous = to_int(pick(row, ["rank_24h_ago", "previous_rank"], rank), rank)
        rank_delta = previous - rank
        score = round(max(55, 105 - rank * 4) + min(math.log10(max(mentions, 1)) * 8, 18))
        move = "上升" if rank_delta > 0 else "回落" if rank_delta < 0 else "持平"
        metric = f"{mentions:,} mentions" if mentions else "社区热度"

        items.append(
            {
                "rank": len(items) + 1,
                "symbol": symbol,
                "name": name,
                "score": min(99, score),
                "metric": metric,
                "change": f"排名{move}",
                "summary": f"Reddit 股票社区热度第 {rank}，本期提及 {mentions:,} 次、点赞 {upvotes:,} 次，讨论排名较前期{move}。",
            }
        )
        if len(items) >= US_LIMIT:
            break

    if len(items) < US_LIMIT:
        raise RuntimeError("not enough us market rows")
    return items


def fallback_items(existing: Dict[str, Any], market_key: str) -> List[Dict[str, Any]]:
    markets = existing.get("markets", {})
    items = markets.get(market_key, {}).get("items", [])
    if not items:
        raise RuntimeError(f"missing fallback data for {market_key}")
    return items[:10]


def market_block(
    existing: Dict[str, Any],
    key: str,
    fetched: Optional[List[Dict[str, Any]]],
    status: str,
    ai_status: str,
) -> Dict[str, Any]:
    previous = existing.get("markets", {}).get(key, {})
    return {
        "label": previous.get("label", "一周 A 股热评" if key == "cn" else "一周 美股热评"),
        "subtitle": "本周市场情绪 Top 10",
        "source": "东方财富人气榜 / 公开市场数据" if key == "cn" else "ApeWisdom / Reddit 股票社区热度",
        "updatedLabel": status,
        "aiStatus": ai_status,
        "accent": "#ff4d5e" if key == "cn" else "#4cc9f0",
        "items": fetched or fallback_items(existing, key),
    }


def main() -> None:
    existing = load_existing()
    today = now_shanghai()
    period = week_period(today)

    statuses = {}
    try:
        cn_items = fetch_cn_items()
        statuses["cn"] = "自动更新完成"
    except Exception as exc:
        print(f"A-share fetch failed: {exc}")
        cn_items = fallback_items(existing, "cn")
        statuses["cn"] = "取数失败，保留上期"

    try:
        us_items = fetch_us_items()
        statuses["us"] = "自动更新完成"
    except Exception as exc:
        print(f"US fetch failed: {exc}")
        us_items = fallback_items(existing, "us")
        statuses["us"] = "取数失败，保留上期"

    ai_statuses = apply_deepseek_comments({"cn": cn_items, "us": us_items}, period)

    payload = {
        "generatedAt": today.isoformat(),
        "period": period,
        "site": {
            "title": "一周市场情绪 Top 10",
            "description": "A 股与美股的每周讨论热度榜。仅用于观察市场情绪，不构成投资建议。",
        },
        "markets": {
            "cn": market_block(existing, "cn", cn_items, statuses["cn"], ai_statuses["cn"]),
            "us": market_block(existing, "us", us_items, statuses["us"], ai_statuses["us"]),
        },
        "disclaimer": "本榜单仅反映公开数据中的市场讨论热度和情绪变化，不构成任何投资建议。",
    }

    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
    with DATA_FILE.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    snapshot = SNAPSHOT_DIR / f"{today:%Y-%m-%d}.json"
    with snapshot.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    print(f"Updated {DATA_FILE}")


if __name__ == "__main__":
    main()
