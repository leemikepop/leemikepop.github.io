// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://leemikepop.github.io',
  trailingSlash: 'ignore',
  markdown: {
    // 用 unified（remark / rehype）處理 Markdown，才能支援 $...$ 與 $$...$$ 數學式
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      // 程式碼區塊同時輸出淺色與深色配色，由 CSS 依主題切換
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      wrap: false,
    },
  },
});
