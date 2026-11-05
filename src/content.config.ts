import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categoryKeys } from './data/site';

/**
 * 專案：src/content/projects/<slug>.md
 * 欄位寫錯（例如分類拼錯、日期格式錯）時，`npm run build` 會直接報錯。
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** 卡片上的一句話介紹，盡量 80 字內 */
    summary: z.string(),
    category: z.enum(categoryKeys),
    tags: z.array(z.string()).default([]),
    /** 開始時間，可寫 2025-09 或 2025-09-01 */
    start: z.coerce.date(),
    /** 結束時間；仍在進行就省略並設 ongoing: true */
    end: z.coerce.date().optional(),
    ongoing: z.boolean().default(false),
    /** 你在專案中的角色，例如「架構設計與主要開發」 */
    role: z.string().optional(),
    /** GitHub repo，格式 owner/name */
    repo: z
      .string()
      .regex(/^[\w.-]+\/[\w.-]+$/, 'repo 要寫成 owner/name')
      .optional(),
    /** private 的 repo 不會顯示連結，只會標示 Private */
    visibility: z.enum(['public', 'private']).default('public'),
    /** fork 別人的專案（自己有貢獻）時設為 true */
    fork: z.boolean().default(false),
    links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    /** 顯示在首頁精選 */
    featured: z.boolean().default(false),
    /** 首頁精選的排列順序，數字小的在前 */
    order: z.number().default(100),
    /** 草稿不會出現在網站上 */
    draft: z.boolean().default(false),
  }),
});

/** 筆記 / 文章：src/content/notes/<slug>.md */
const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, notes };
