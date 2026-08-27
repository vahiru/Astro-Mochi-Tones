# 🍡 Astro-Mochi-Tones

一个基于 Astro 框架和 Material Design 3 开发的博客主题。

## ✨ 特性

- 🎨 **Material Design 3** — 现代化的设计语言
- 🌙 **深色/浅色模式** — 自动适应系统主题
- 📱 **响应式设计** — 完美适配移动端
- 💬 **Waline 评论** — 简洁的评论系统
- 🔍 **全文搜索** — 快速查找内容
- 📑 **目录导航** — 文章内快速跳转
- 🏷️ **标签/分类** — 内容组织管理

---

## 🚀 快速开始

### 安装

```bash
# 使用 pnpm (推荐)
pnpm add astro-mochi-tones

# 或使用 npm
npm install astro-mochi-tones
```

### 配置

```ts
// astro.config.ts
import { defineConfig } from "astro/config";
import MochiTones from "astro-mochi-tones";

export default defineConfig({
  site: 'https://your-site.com/',
  integrations: [
    MochiTones({
      config: {
        title: "My Blog",
        description: "My awesome blog",
      },
      pages: {},
      overrides: {},
    }),
  ],
});
```

---

## 📁 项目结构

```
your-blog/
├── src/
│   ├── assets/
│   │   └── images/        # 文章图片 (会被自动生成多尺寸 WebP)
│   ├── content/
│   │   └── blog/          # 你的文章 (Markdown/MDX)
│   └── pages/             # 自定义页面 (可覆盖主题页面)
├── public/                # 原样发布的静态资源 (favicon、社交预览图等)
└── astro.config.ts        # 配置文件
```

### 图片放哪里

封面和正文图片一律按 `/images/xxx.jpg` 引用，主题会按这个顺序解析：

1. `src/assets/images/xxx.jpg` —— 命中则交给 `astro:assets`，按实际显示尺寸
   生成多档 WebP 并输出 `srcset`。列表页 120px 的缩略图只会下载 180/360px 的版本。
2. 没命中则当作 `public/images/xxx.jpg` 原样输出 `<img>`。

也就是说，把图片从 `public/images/` 移到 `src/assets/images/` 就能获得优化，
**不需要改动任何文章**。需要固定地址的图（社交预览图）留在 `public/` 即可。

---

## ✍️ 写文章

在 `src/content/blog/` 目录创建 `.md` 或 `.mdx` 文件：

```md
---
title: "我的第一篇文章"
date: 2025-01-01
description: "这是文章描述"
tags: ["日记", "技术"]
categories: ["博客"]
cover: "/images/cover.jpg"   # 可选
draft: false                 # 草稿状态
---

正文内容...
```

---

## ⚙️ 配置项

| 配置项 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `title` | string | ✅ | 网站标题 |
| `description` | string | ❌ | 网站描述 |

---

## 🎨 自定义

### 覆盖页面

在你的 `src/pages/` 目录创建同名页面可以覆盖主题默认页面。

### 新增图标

主题自托管的是 Material Symbols Rounded 的**字形子集**（完整可变字体有 5.1 MB，
子集后约 73 KB，见 `src/assets/fonts/`）。用到列表之外的新图标时，它不会显示，
需要把图标名补进 `scripts/fetch-fonts.sh` 的 `ICONS` 列表并重新生成：

```bash
bash scripts/fetch-fonts.sh
```

### 覆盖组件

使用 `overrides` 配置项可以替换主题组件：

```ts
MochiTones({
  config: { ... },
  overrides: {
    components: {
      Footer: './src/components/MyFooter.astro',
    },
  },
})
```

---

## 📜 许可证

[GPL-3.0](./LICENSE)

---

## 🔗 相关链接

- [在线演示](https://vahiru.is-cute.cat/)
- [GitHub 仓库](https://github.com/vahiru/Astro-Mochi-Tones)
- [问题反馈](https://github.com/vahiru/Astro-Mochi-Tones/issues)
