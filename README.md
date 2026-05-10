# 一周市场情绪 Top 10

一个每周自动更新的双榜项目：

- 一周 A 股热评：本周市场情绪 Top 10
- 一周 美股热评：本周市场情绪 Top 10

页面会部署到 GitHub Pages，并在每周更新后截图推送到 Telegram。

## 数据规则

A 股榜单优先读取东方财富人气榜公开数据，并用排名、涨跌幅等公开字段生成情绪分和中文摘要。

美股榜单优先读取 ApeWisdom 的股票社区热度数据，用 Reddit 股票社区提及量、点赞量、排名变化等字段生成情绪分和中文摘要。

本项目只观察公开讨论热度，不构成任何投资建议。

## 每周自动化

- 每周六 09:00 北京时间：自动抓取最新榜单并提交到仓库
- 每周六 10:00 北京时间：自动截图并推送 Telegram

之所以选周六，是因为 A 股周五收盘后，美股周五收盘对应北京时间周六凌晨，这样两张榜都能覆盖完整一周。

## GitHub Secrets

推送 Telegram 前，需要在仓库的 `Settings -> Secrets and variables -> Actions` 添加：

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

如果你推送到频道，`TELEGRAM_CHAT_ID` 可以填频道用户名，例如 `@your_channel_name`。

## 本地预览

```bash
npm install
npm run update:data
npm run capture:all
python3 -m http.server 4177
```

然后打开 `http://127.0.0.1:4177/` 查看页面。

## 首次同步到 GitHub

先在 GitHub 创建空仓库，建议仓库名：

```text
market-weekly-sentiment-top10
```

然后在本地项目目录执行：

```bash
git init
git add .
git commit -m "Initial market sentiment top 10"
git branch -M main
git remote add origin https://github.com/zzcsama/market-weekly-sentiment-top10.git
git push -u origin main
```
