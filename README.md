# 一周市场周报

一个每周自动更新的市场周报项目：

- A 股周报：本周要点、指数表现、板块轮动、热门股票、下周关注
- 美股周报：本周要点、指数表现、板块轮动、热门股票、下周关注

页面会部署到 GitHub Pages，并在每周更新后截图推送到 Telegram。

页面地址：<https://zzcsama.github.io/market-weekly-sentiment-top10/>

## 数据规则

A 股榜单优先读取东方财富人气榜公开数据，并用排名、涨跌幅等公开字段生成情绪分和中文摘要。

美股榜单优先读取 ApeWisdom 的股票社区热度数据，用 Reddit 股票社区提及量、点赞量、排名变化等字段生成情绪分和中文摘要。

如果配置了 DeepSeek API Key，更新流程会为每只上榜股票生成一条“本周情况评价”。评价只用于描述市场情绪和公开讨论焦点，不提供投资建议。

页面采用白底蓝色信息图风格，并会根据股票代码匹配企业官网域名，通过 geticon.dev 加载企业高清 logo；匹配不到时会自动显示股票代码字母兜底。

本项目只观察公开讨论热度，不构成任何投资建议。

## 每周自动化

- 每周六 09:00 北京时间：自动抓取最新榜单并提交到仓库
- 每周六 10:00 北京时间：自动截图并推送 Telegram

之所以选周六，是因为 A 股周五收盘后，美股周五收盘对应北京时间周六凌晨，这样两张榜都能覆盖完整一周。

## GitHub Secrets

推送 Telegram 前，需要在仓库的 `Settings -> Secrets and variables -> Actions` 添加：

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `DEEPSEEK_API_KEY`

如果你推送到频道，`TELEGRAM_CHAT_ID` 可以填频道用户名，例如 `@your_channel_name`。

## 本地预览

```bash
npm install
npm run update:data
npm run capture:all
python3 -m http.server 4177
```

然后打开 `http://127.0.0.1:4177/` 查看页面。
