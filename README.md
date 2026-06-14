# 未来鹅 FutureGoose · 大学生 AI 求职成长陪伴 Demo

> 一只来自腾讯、懂行业也懂学生的 AI 伙伴，陪你从大一走到 Offer。

「未来鹅」是一个面向中国在校大学生（大一到大四 / 研究生）的 **AI 求职成长陪伴产品 Demo**。
它不是一个校招信息站，而是一位会主动共情、帮你拆解方向、陪你准备面试的"学长 / 学姐"型 AI 智能体。

## ✨ 它能做什么

- 🪿 **AI 陪伴对话** — 跟「未来鹅」聊职业规划、实习、简历、面试、鹅厂岗位
- 🎓 **年级识别** — 首次进入选择年级（大一大二大三大四/研究生），自动切换欢迎语和推荐问题
- 🎯 **成长时间轴** — 4 阶段可视化（认知期 → 探索期 → 实习期 → 求职期），点击看 AI 建议
- 🪪 **鹅厂小知识卡** — 对话中 AI 主动推送岗位介绍、T/S 族、培养体系、校招 Tips
- 💙 **情绪安抚** — 当你表达焦虑/迷茫时，AI 优先共情，再给具体建议
- 💾 **本地持久化** — 年级、对话历史、API 配置全部存在 `localStorage`，无后端依赖

## 🧱 技术栈

- **Vue 3** + **Vite 5**
- **TDesign Vue Next**（UI 组件库，主色用鹅厂蓝 `#0077ff`）
- **OpenAI 兼容 API**（支持 OpenAI / DeepSeek / 智谱 / 腾讯混元 / 自部署 等任意兼容服务）
- 无后端 / 无数据库，对话历史用 `localStorage` 存储

## 🚀 本地运行

```bash
# 1. 安装依赖（需要 Node.js >= 18）
npm install

# 2. 启动开发服务器
npm run dev

# 浏览器打开 http://localhost:5173 即可
```

> 即使不配置 API Key，Demo 也能用 — 系统会自动走「本地 Mock 回复」，
> 让你看到完整的 UI 体验。

## ⚙️ 配置 API Key（让「未来鹅」真正"活"起来）

1. 启动后点击右上角 **「⚙️ 接入 AI」**
2. 填入：
   - **API Base URL** — 默认 `https://api.openai.com/v1`，可换成任何 OpenAI 兼容地址
   - **API Key** — 形如 `sk-xxxxxxxx`
   - **模型名称** — 例如 `gpt-3.5-turbo`、`gpt-4o-mini`、`deepseek-chat` 等
3. 点击保存

> 🔒 配置仅保存在你的浏览器 `localStorage` 中，不会上传到任何服务器。

### 兼容示例

| 服务 | baseUrl 例子 | 模型名例子 |
| --- | --- | --- |
| OpenAI | `https://api.openai.com/v1` | `gpt-3.5-turbo` / `gpt-4o-mini` |
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` |
| 智谱 GLM | `https://open.bigmodel.cn/api/paas/v4` | `glm-4-flash` |
| 腾讯混元 | `https://api.hunyuan.tencent.com/v1` | `hunyuan-pro` |

> DeepSeek / 智谱 / 混元 都可以使用 OpenAI SDK 协议，baseUrl 注意带上 `/v1` 或 `/v4` 等版本段。

## 🌐 部署到公网

### 方式一：Vercel（推荐，最快）

```bash
npm i -g vercel
vercel
```

或者在 Vercel 网页上直接 Import Git 仓库，会自动识别 Vite 项目并部署。

### 方式二：Netlify

```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### 方式三：GitHub Pages

1. 在 `vite.config.js` 中设置 `base: '/仓库名/'`
2. `npm run build` 后把 `dist/` 内容推送到 `gh-pages` 分支
3. 开启 GitHub Pages

> 因为是纯前端 SPA，部署到任何静态托管服务（Vercel / Netlify / Cloudflare Pages / 腾讯 EdgeOne Pages）都 OK。

## 🗂 项目结构

```
future-goose/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.js
    ├── App.vue
    ├── styles/
    │   └── global.css
    ├── data/
    │   ├── gooseKnowledge.js   # 年级 / 时间轴 / 知识卡 mock 数据
    │   └── systemPrompt.js     # 未来鹅人设 system prompt
    ├── utils/
    │   ├── storage.js          # localStorage 工具
    │   └── markdown.js         # 极简 markdown 渲染
    ├── composables/
    │   └── useChat.js          # LLM 调用（OpenAI 兼容）+ 本地 mock
    └── components/
        ├── GradePicker.vue     # 年级选择弹窗
        ├── SettingsDialog.vue  # API 设置弹窗
        ├── GrowthTimeline.vue  # 成长时间轴
        ├── KnowledgeDeck.vue   # 知识卡清单
        ├── KnowledgeCard.vue   # 单张知识卡
        └── ChatPanel.vue       # 核心聊天面板
```

## 🤖 未来鹅 system prompt（完整文本）

完整的 system prompt 在 [`src/data/systemPrompt.js`](./src/data/systemPrompt.js)，
你可以直接修改它来调整 AI 的行为、语气、推送策略。

## 🪿 一些体验设计的小心思

- **不灌鸡汤**：当用户表达焦虑时，AI 先共情，再给 1-2 条具体建议
- **不抢话**：回复默认 3-6 句，绝不写论文
- **会玩鹅厂梗**：偶尔自嘲"加班鹅"，但不每句话都玩
- **知识卡节制推送**：用 `[KNOWLEDGE:xxx]` 标记，规则上每 3 轮才允许 1 张
- **年级联动**：所有欢迎语、推荐问题、mock 回复都跟年级绑定

## 🛡 注意事项

- 这是 **Demo**，不是商业产品。Mock 回复是「写死的剧本」，真实 AI 表现取决于你接入的模型。
- 真实 LLM 不会泄露你的 API Key 给别人 — 浏览器中调用只在跨域允许的前提下工作；如果你部署到公网，建议给 API 加一层后端代理（不要让 Key 暴露在前端）。

## 📜 License

MIT
