// ▼▼▼▼▼ 必须包含这一行！ ▼▼▼▼▼
import { defineCollection, z } from 'astro:content';
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // 1. 标题
    title: z.string(),
    
    // 2. 日期 (兼容 Hexo 的字符串日期 "2025-09-02")
    date: z.coerce.date(),
    
    // 3. 封面图
    cover: z.string().optional(),
    
    // 4. 其他字段
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    
    // 5. 草稿状态
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  'blog': blogCollection,
};