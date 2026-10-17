# TianDoHome · 冬草空间站

一个使用 Vue3 编写的天冬氨酸个人网站。整体风格极简、扁平，支持多语言、滚动入场动画，并且把**几乎所有站点配置集中在一个 JSON 文件里**，无需修改组件代码即可完成个性化。

> 本项目已开源，采用 [MIT License](./LICENSE)。

## ✨ 特性

- ⚙️ **配置驱动**：站点信息、主题、导航、友链、项目、联系方式、图片资源均集中在 [`src/config/website.json`](./src/config/website.json)
- 🎨 **主题可配**：主色、文字色、圆角、动效节奏等都可在配置文件中调整，无需改 CSS
- 🌏 **多语言**：内置简体中文 / 繁體中文 / English，新增语言只需放入一个 JSON
- 🖼️ **横幅可配**：内置 Banner 配置区块，替换图片与叠加文案即可
- 🎵 **音乐小组件**：基于 NeteaseCloudMusicApi 的导航栏歌单播放器，支持封面、歌单、进度、上下首与异常自动跳过，切换页面不中断播放
- 🎬 **丝滑动效**：基于 `animate.css` + 滚动进入视口的 `v-reveal` 指令
- 📱 **响应式布局**：移动端与桌面端均有适配
- 🧩 **组件化**：Vue 3 `<script setup>` / Options API 混合，结构清晰易扩展
- 🚀 **零后端**：纯静态站点，可部署到任意静态托管平台

## 🛠 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | [Vue 3](https://vuejs.org/) |
| 构建工具 | [Vite 5](https://vitejs.dev/) |
| 路由 | [Vue Router 4](https://router.vuejs.org/) |
| 国际化 | [Vue I18n 11](https://vue-i18n.intlify.dev/) |
| 动画 | [animate.css](https://animate.style/) |
| 包管理 | [pnpm](https://pnpm.io/) |
| 代码规范 | ESLint + Prettier |

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm（推荐）或 npm / yarn

### 安装与运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器（默认 http://localhost:5173）
pnpm dev

# 生产构建，产物输出到 dist/
pnpm build

# 本地预览构建产物
pnpm preview
```

### 其他命令

```bash
pnpm lint     # ESLint 检查并自动修复
pnpm format   # Prettier 格式化 src/
```

## ⚙️ 配置说明

全站配置集中在 **[`src/config/website.json`](./src/config/website.json)**。修改后保存即可（开发模式下支持热更新）。

### 1. 站点信息 `site`

```jsonc
"site": {
  "htmlLang": "zh-CN",        // <html lang> 语言
  "favicon": "/favicon.ico",  // 站点图标
  "titleKey": "website.title",// 浏览器标题使用的 i18n key
  "defaultLocale": "zh",      // 默认语言
  "fallbackLocale": "zh",     // 兜底语言
  "locales": [                // 语言列表（下拉框中显示）
    { "code": "zh", "name": "简体中文" }
  ]
}
```

> 站点名称、标语、版权等**需要随语言变化**的文案，保存在 [`src/i18n/locales/`](./src/i18n/locales) 下的语言包中（`website` 字段）。

### 2. 主题 `theme`

```jsonc
"theme": {
  "themeColor": "#4a6293",   // 主色
  "textColor": "#474440",    // 正文色
  "backgroundColor": "#ffffff",
  "borderRadius": "10px",    // 全局圆角
  "durationBase": "0.35s",   // 常规过渡时长
  "durationSlow": "0.5s"     // 入场/显现时长
}
```

启动时由 [`src/config/index.js`](./src/config/index.js) 的 `applyTheme()` 写入根元素 CSS 变量，CSS 中通过 `var(--theme-color)` 等引用。

### 3. 资源 `assets`

站点 Logo、头像、页面背景、404 插图、菜单/语言图标等图片路径。图片放在 [`public/`](./public) 目录下，使用以 `/` 开头的绝对路径即可。

### 4. 横幅 `banner`

```jsonc
"banner": {
  "enabled": true,                          // 是否启用横幅
  "image": "/img/banner/cat_text.webp",     // 横幅图片
  "alt": "Banner",
  "overlays": [                             // 叠加在横幅上的文案
    {
      "text": "The sun goes to cross the Western sea,\nleaving its last salutation to the East.",
      "top": "10px",
      "left": "10px",
      "hideOnMobile": false                 // 移动端是否隐藏
    }
  ]
}
```

**横幅放置位置**：将你的横幅图片放入 [`public/img/banner/`](./public/img/banner)，然后在 `banner.image` 中填写路径即可。
若 `enabled` 为 `false` 或 `image` 留空，则不显示横幅。

### 5. 导航栏 `navbar`

```jsonc
"navbar": [
  { "id": "home",  "nameKey": "navbar.home",  "path": "/",                 "type": "internal", "menuOnly": false },
  { "id": "blog",  "nameKey": "navbar.blog",  "path": "https://blog.xxx",  "type": "external", "menuOnly": false }
]
```

- `type`：`internal` 站内路由 / `external` 站外链接
- `menuOnly`：为 `true` 时只出现在展开菜单中，不出现在底部导航条上
- `nameKey`：导航名称对应的 i18n key

### 6. 关于页 `about`

`about.sections` 为区块数组，每个区块包含标题、卡片类型和条目列表：

```jsonc
{
  "id": "activeProjects",
  "card": "showlist",              // "organization" 或 "showlist"
  "titleKey": "title.activeProjects",
  "subtitleKey": "title.activeProjectsSub",
  "items": [
    {
      "titleKey": "about.sarLabTitle",     // 也可直接写 "title": "xxx"
      "contentKey": "about.sarLabContent", // 也可直接写 "content": "xxx"
      "logo": "/img/logo/sarlab_logo.svg",
      "link": "https://sarlab.cosh.work"
    }
  ]
}
```

### 7. 联系页 `contact` / 友链 `friend`

- `contact.links[]`：`title`、`link`、`logo`、`descKey`（或直接写 `desc`）
- `friend.links[]`：`title`、`content`、`logo`、`link`；`friend.shuffle` 控制是否随机排序

### 8. 其他

| 配置项 | 说明 |
| --- | --- |
| `donate.image` | 打赏页收款码图片 |
| `organization.avatars` | 组织卡片上的装饰头像列表 |
| `features.moeCounter` | 萌萌计数器，`enabled` 控制开关，`src` 为计数图片地址 |

### 9. 音乐 `music`

音乐播放器是内嵌在底部导航栏中的小组件，仅支持**歌单**模式，填写歌单 ID 即可：

```jsonc
"music": {
  "apiBase": "https://music.loxi.work", // NeteaseCloudMusicApi 地址
  "playlistId": "3778678",              // 网易云歌单 ID
  "level": "standard",                  // 音质：standard / higher / exhigh 等
  "limit": 1000                         // 最大读取曲目数
}
```

播放地址会在切换到歌曲时按需请求；不可播放或加载失败的歌曲会自动跳过。

## 🌏 新增一门语言

1. 在 [`src/i18n/locales/`](./src/i18n/locales) 下新建 `<code>.json`（可复制 `zh.json` 翻译）；
2. 在 `website.json` 的 `site.locales` 中加入 `{ "code": "<code>", "name": "语言名" }`。

语言包由 `import.meta.glob` 自动加载，无需改动其它代码。

## 📁 目录结构

```
TianDoHome/
├─ public/                  # 静态资源（直接按路径访问）
│  ├─ font/                 # 字体
│  ├─ img/
│  │  ├─ banner/            # ★ 横幅图片放置处
│  │  ├─ DoNG/              # 站点插画 / Logo / 头像
│  │  ├─ icon/              # 菜单、语言等图标
│  │  └─ logo/              # 组织 / 社交平台 Logo
│  ├─ favicon.ico
│  └─ vercel.json           # Vercel 部署改写规则
├─ src/
│  ├─ config/
│  │  ├─ website.json       # ★ 全站配置（唯一配置源）
│  │  └─ index.js           # 配置加载 + 主题/站点信息应用
│  ├─ i18n/
│  │  ├─ locales/           # 各语言文案
│  │  └─ i18n.js            # i18n 实例（自动加载语言包）
│  ├─ api/
│  │  └─ music.js           # 歌单 / 曲目 / 播放地址接口
│  ├─ router/index.js       # 路由
│  ├─ components/
│  │  ├─ UI/                # Navbar / Title / SelLang / MusicPlayer
│  │  ├─ Organization.vue   # 组织卡片
│  │  └─ ShowList.vue       # 通用列表卡片
│  ├─ views/                # Home / About / Contact / Donate / Friend / NotFound
│  ├─ assets/main.css       # 全局样式与字体
│  ├─ App.vue
│  └─ main.js               # 入口（应用主题与站点信息）
├─ index.html
├─ vite.config.js
└─ package.json
```

## 🚢 部署

构建产物为纯静态文件（`dist/`），可部署到 Vercel、Netlify、GitHub Pages、Cloudflare Pages 等任意静态托管。

- **Vercel**：直接导入仓库即可，[`public/vercel.json`](./public/vercel.json) 已配置 SPA 路由改写（所有路径回退到 `index.html`）。
- **其他平台**：请确保配置了 **SPA 回退**（把未匹配的路径重写到 `/index.html`），否则刷新子路由会 404。

## 🤝 贡献

欢迎提交 Issue 与 Pull Request：

1. Fork 本仓库并新建分支：`git checkout -b feat/your-feature`
2. 提交改动：`git commit -m "feat: ..."`
3. 推送分支并创建 Pull Request

提交前建议执行 `pnpm lint` 和 `pnpm build` 确保通过。

## ⚠️ 声明

本项目代码以 [MIT License](./LICENSE) 开源，但**网站所使用的图像资源（原创 OC）均为天冬氨酸个人所有，不得他人使用**。如需使用，请先取得授权。

## 📄 许可证

本项目代码基于 [MIT License](./LICENSE) 开源。
