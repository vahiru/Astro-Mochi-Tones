// src/pages/search.json.ts
import { getCollection } from 'astro:content';
import striptags from 'striptags'; // 引入去标签库

export async function GET({}) {
  const posts = await getCollection('blog');
  
  const searchIndex = posts
    .filter(post => !post.data.draft)
    .map(post => {
      // 1. 移除 Markdown/HTML 标签，只保留纯文本
      // 2. 截取前 5000 个字符 (防止 JSON 文件过大，影响加载速度)
      //    通常搜不到是因为内容太长，JSON只截取摘要。
      //    这里我们保留全文的纯文本版本用于搜索。
      const cleanContent = striptags(post.body).replace(/\s+/g, ' ').trim();

      return {
        title: post.data.title,
        // 专门加一个 content 字段给搜索引擎用
        content: cleanContent, 
        description: post.data.description,
        slug: `/blog/${post.slug}`,
        date: post.data.date
      };
    });

  return new Response(JSON.stringify(searchIndex), {
    headers: { 'Content-Type': 'application/json' }
  });
}