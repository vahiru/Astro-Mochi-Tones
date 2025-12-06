---
title: "Hello World! 欢迎来到我的新博客"
date: 2025-11-26
description: "基于 Astro 和 Material Design 3 重构的全新博客。"
cover: "/images/helloworld.jpg"
tags: ["Astro", "Material Design", "Life"]
categories: ["随笔"]
draft: false
---

欢迎来到我的新家！🏠

经过一番折腾，我终于将博客从 Halo 迁移到了 **Astro**。

## 为什么选择 Astro？

以前在使用halo的时候为了在线编辑和文章管理，着实是为它操心了不少。所以这次换到astro也算是一次新的尝试吧。相信静态博客能让我少操不少心

## 排版样式展示

这个主题是我第一次编写astro主题，但我还是挺满意的）

### 1. 代码高亮

得益于 Astro 内置的 **Shiki**，代码高亮在构建时就完成了，无需运行时的 JS。而且我还加上了双主题支持：

```typescript
// 这是一个 TypeScript 示例
interface User {
  name: string;
  id: number;
}

class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

const user: User = new UserAccount("Murphy", 1);
console.log(user);
````

### 2\. 引用样式

MD3 风格的引用块，带有圆角和强调色：

> “设计不仅仅是外观和感觉，设计就是它是如何工作的。”  
> — Steve Jobs

### 3\. 列表展示

  * ✅ **动态色彩**：根据壁纸自动生成配色方案。
  * ✅ **响应式布局**：桌面端 Navigation Rail，移动端 Modal Drawer。
  * ✅ **极致性能**：Lighthouse 跑分接近满分。

## 接下来...

我会在这里分享更多关于：

1.  一些我的技术经验
3.  生活随笔与碎碎念

感谢你的访问，希望能在这里与你产生共鸣！🚀

