// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function GET(context) {
  const blog = await getCollection('blog');
  
  // 过滤草稿并按日期倒序
  const posts = blog
    .filter((post) => !post.data.draft)
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());

  return rss({
    title: "Vahiru's Blog",
    description: '猫猫的自留地',
    site: context.site,
    // 生成 RSS 项
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      
      // 🔥 核心改动：渲染全文内容
      content: sanitizeHtml(parser.render(post.body), {
        // 允许的标签：在默认基础上增加 img 标签，否则图片会被过滤掉
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        // 允许的属性：允许 img 标签的 src 和 alt 属性
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'title', 'width', 'height']
        }
      }),
    })),
    customData: `<language>zh-cn</language>`,
  });
}