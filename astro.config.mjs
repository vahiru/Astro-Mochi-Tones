import { defineConfig } from 'astro/config';
import lit from '@astrojs/lit';

// https://astro.build/config

export default defineConfig({
  site: 'http://localhost:4321',
  markdown: {
    shikiConfig: {
      // 启用双主题
      // 'github-light' 对应亮色模式
      // 'github-dark' 对应暗色模式 (或者 dracula, material-theme-ocean 等)
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // 必须设置为 true，才能生成 css 变量控制颜色
      wrap: true,
    },
  },
});