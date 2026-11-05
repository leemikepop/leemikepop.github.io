# leemikepop.github.io

個人作品集網站：<https://leemikepop.github.io>

以 [Astro](https://astro.build) 建置的靜態網站，push 到 `main` 後由 GitHub Actions 自動建置並部署到 GitHub Pages。

## 本機開發

需要 Node.js 22.23 以上。

```bash
npm install
npm run dev       # http://localhost:4321，存檔即時更新
npm run build     # 型別檢查 + 建置到 dist/（CI 也跑這個）
npm run preview   # 預覽建置結果
```

## 新增專案

### 方法一：從 GitHub repo 產生草稿（推薦）

```bash
npm run new:project                      # 列出還沒加進網站的 repo
npm run new:project -- TamperProbe-Lab   # 用 leemikepop/TamperProbe-Lab 建立草稿
```

會在 `src/content/projects/` 產生一個 `.md`，自動帶入 repo 的說明、語言、topics、建立與最後更新時間、是否 private 或 fork。
草稿預設 `draft: true`，**不會出現在網站上**。補完內容、確認分類後改成 `draft: false`。

讀 private repo 需要已登入 `gh`（`gh auth login`），或設定環境變數 `GITHUB_TOKEN`。

### 方法二：手動新增

在 `src/content/projects/` 新增 `<網址代稱>.md`，檔名就是網址：`/projects/<網址代稱>/`。

```markdown
---
title: Project name
summary: One-sentence pitch shown on the card
category: android-security   # android-security | systems | ai | app | coursework
tags: [Kotlin, C++]
start: 2025-09
end: 2026-01                 # 進行中就省略 end，改寫 ongoing: true
role: 你的角色（選填）
repo: leemikepop/xxx         # 選填
visibility: private          # private 的 repo 不會顯示連結
featured: true               # 顯示在首頁精選（選填）
order: 1                     # 精選順序，小的在前（選填）
links:                       # 其他連結（選填）
  - label: Demo
    url: https://example.com
---

## Background
## What I did
## Outcome
```

欄位格式寫錯時，`npm run build` 會直接報錯並指出是哪個檔案、哪個欄位。

### 加圖片

把圖片放在 `public/images/projects/<專案>/`，在 Markdown 裡用 `![說明](/images/projects/<專案>/xxx.png)` 引用。

## 新增筆記

在 `src/content/notes/` 新增 `.md`：

```markdown
---
title: Title
date: 2026-11-05
description: 列表上的一句話摘要（選填）
tags: [Linux, Kernel]
---
```

支援 `$...$`、`$$...$$` 數學式（KaTeX）與程式碼高亮。

## 修改個人資料與經歷

都在 [`src/data/site.ts`](src/data/site.ts)：自我介紹、focus 標籤、聯絡連結、經歷、學歷、專案分類。
履歷有更新時記得一起改。

## 結構

```text
src/
├── content/
│   ├── projects/        # 一個專案一個 .md
│   └── notes/           # 一篇筆記一個 .md
├── content.config.ts    # 專案、筆記的欄位定義
├── data/site.ts         # 個人資料、經歷、分類
├── lib/content.ts       # 排序、日期格式等共用函式
├── components/          # Header、Footer、ProjectCard
├── layouts/Base.astro   # 全站外框
├── pages/               # 路由（首頁、/projects、/notes、404）
└── styles/global.css    # 配色、字型等設計變數
scripts/new-project.mjs  # 從 GitHub repo 產生專案草稿
```

配色在 `src/styles/global.css` 最上方的 `:root` 變數，深色為預設，淺色跟隨系統或右上角切換。

## 部署

`.github/workflows/deploy.yml`：push 到 `main` 時建置並發布。
第一次使用需要到 repo 的 **Settings → Pages → Build and deployment → Source** 選 **GitHub Actions**。
