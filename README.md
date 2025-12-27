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
│   ├── content/
│   │   └── blog/          # 你的文章 (Markdown/MDX)
│   └── pages/             # 自定义页面 (可覆盖主题页面)
├── public/                # 静态资源
└── astro.config.ts        # 配置文件
```

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
