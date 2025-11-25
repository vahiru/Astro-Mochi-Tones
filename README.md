# 🍡 Astro-Mochi-Tones

> 一个基于 **Astro** 和 **Material Design 3** 构建的静态博客主题。

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF6C0C.svg)](https://astro.build/)
[![Demo](https://img.shields.io/badge/Live-Demo-success)](https://vahiru.is-cute.cat)

---

## 👀 预览

✨ **在线演示：** [vahiru.is-cute.cat](https://vahiru.is-cute.cat)

**Mochi Tones** (麻糬色调) 将 MD3 的 **动态色彩** 和 **圆润几何** 完美融入静态博客。采用纯静态生成配合客户端 Web Components，在保证极速加载的同时，提供原生 App 般的丝滑交互体验。

---

## ✨ 核心特性

* **🎨 纯正 Material Design 3**：集成 Google 官方 `@material/web` 组件库，拥有完美的波纹点击效果和物理动效。
* **⚡ 极致性能**：全站静态生成 HTML，配合 Client-side Hydration 加载组件，首屏秒开，SEO 友好。
* **💬 零门槛评论**：集成 **Waline** 评论系统，支持匿名、邮箱登录，无需 GitHub 账号也能畅所欲言。
* **🌈 动态主题引擎**：内置色彩提取算法，支持用户自定义主题色)，一键生成全站配色方案。
* **📱 响应式设计**：
    * **桌面端**：标准的 Navigation Rail (侧边导航轨) + Grid 布局。
    * **移动端**：沉浸式 Navigation Drawer (侧滑抽屉) + App Bar。
* **📦 迁移友好**：特别优化了 Frontmatter 解析逻辑，**Hexo / Hugo 用户可直接复用原有的 Markdown 文件**。
* **🔍 本地即时搜索**：集成 Fuse.js，无需后端即可实现极速模糊搜索。

---

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone [https://github.com/你的用户名/Astro-Mochi-Tones.git](https://github.com/你的用户名/Astro-Mochi-Tones.git) my-blog
cd my-blog
````

### 2\. 安装依赖

```bash
npm install
```

### 3\. 本地运行

```bash
npm run dev
```

访问 `http://localhost:4321` 即可预览。

-----

## ⚙️ 配置指南

### 1\. 基础配置

编辑 `astro.config.mjs`，修改你的站点域名：

```javascript
export default defineConfig({
  site: '[https://你的域名.com](https://你的域名.com)',
  // ...
});
```

### 2\. 配置评论系统 (Waline)

本项目默认使用 Waline。您需要自行部署后端（推荐使用 Vercel + LeanCloud 免费部署）。

1.  **获取 ServerURL**：部署完成后，你会获得一个地址，例如 `https://your-app.vercel.app`。
2.  **修改配置**：打开 `src/components/Waline.astro` 文件。
3.  **替换地址**：
    ```javascript
    const waline = init({
      el: '#waline',
      serverURL: '[https://你的-waline-地址.vercel.app](https://你的-waline-地址.vercel.app)', // <--- 替换这里
      // ...
    });
    ```

### 3\. 写文章

在 `src/content/blog/` 目录下创建 Markdown 文件。格式兼容 Hexo：

```yaml
---
title: "我的第一篇文章"
date: 2025-11-26
cover: "/images/cover.jpg"  # (可选) 封面图，放在 public 目录
tags: ["Life", "Tech"]      # (可选) 标签
categories: ["随笔"]        # (可选) 分类
description: "摘要..."      # (可选)
draft: false                # (可选) 是否为草稿
---
```

### 4\. 自定义菜单与链接

  * **导航菜单**：修改 `src/components/NavRail.astro` 中的 `navItems` 数组。
  * **友情链接**：修改 `src/data/friends.ts`。
  * **关于页面**：修改 `src/pages/about.astro`。

-----

## 🚢 构建与部署

生成静态文件（输出到 `dist/` 目录）：

```bash
npm run build
```

你可以直接将 `dist` 文件夹部署到 **GitHub Pages**、**Cloudflare Pages** 或 **Vercel**。

> **注意**：请确保你的部署平台配置为 **Static Site / HTML** 托管模式。

-----

## 📜 许可证

本项目遵循 **GNU GPLv3** 开源协议。

你可以自由使用、修改和分发本主题，但如果你基于本主题修改并发布，你的修改版本也必须开源。

*Made with ❤️ by Vahiru*

```
