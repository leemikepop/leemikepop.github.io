#!/usr/bin/env node
/**
 * 從 GitHub repo 產生專案頁草稿。
 *
 *   npm run new:project                 列出還沒加進網站的 repo
 *   npm run new:project -- <repo>       用 leemikepop/<repo> 建立草稿
 *   npm run new:project -- owner/repo   用其他 owner 的 repo（例如有貢獻的 fork 來源）
 *
 * 產生的檔案在 src/content/projects/<slug>.md，預設 draft: true，
 * 補完內容、確認分類後把 draft 改成 false 才會出現在網站上。
 *
 * 讀 private repo 需要 token：會依序使用環境變數 GITHUB_TOKEN，或 `gh auth token`。
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OWNER = 'leemikepop';
const DIR = join(import.meta.dirname, '..', 'src', 'content', 'projects');
const CATEGORIES = ['android-security', 'systems', 'ai', 'app', 'coursework'];

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execFileSync('gh', ['auth', 'token'], { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return undefined;
  }
}

const TOKEN = token();

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'portfolio-scaffolder',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${path} → ${res.status} ${res.statusText}`);
  return res.json();
}

/** 已經寫進網站的 repo（從每個 md 的 repo: 欄位讀出） */
function existingRepos() {
  const set = new Set();
  for (const f of readdirSync(DIR)) {
    const m = readFileSync(join(DIR, f), 'utf8').match(/^repo:\s*(\S+)/m);
    if (m) set.add(m[1].toLowerCase());
  }
  return set;
}

const ym = (iso) => iso.slice(0, 7);
const yamlStr = (s) => JSON.stringify(s ?? '');

async function listMissing() {
  const repos = [];
  for (let page = 1; ; page++) {
    const batch = await gh(
      TOKEN
        ? `/user/repos?affiliation=owner&per_page=100&page=${page}&sort=pushed`
        : `/users/${OWNER}/repos?per_page=100&page=${page}&sort=pushed`,
    );
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  const have = existingRepos();
  const missing = repos.filter((r) => !have.has(r.full_name.toLowerCase()));
  console.log(`還沒加進網站的 repo（${missing.length} / ${repos.length}）：\n`);
  for (const r of missing) {
    const flags = [r.private ? 'private' : 'public', r.fork ? 'fork' : ''].filter(Boolean).join(', ');
    console.log(
      `  ${r.name.padEnd(36)} ${(r.language ?? '-').padEnd(18)} ${ym(r.pushed_at)}  (${flags})`,
    );
  }
  console.log('\n新增：npm run new:project -- <repo>');
}

async function scaffold(arg) {
  const full = arg.includes('/') ? arg : `${OWNER}/${arg}`;
  const r = await gh(`/repos/${full}`);
  const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const file = join(DIR, `${slug}.md`);
  if (existsSync(file)) {
    console.error(`已存在：${file}`);
    process.exit(1);
  }

  const tags = [...new Set([r.language, ...(r.topics ?? [])].filter(Boolean))];
  const fm = [
    '---',
    `title: ${yamlStr(r.name)}`,
    `summary: ${yamlStr(r.description || 'TODO: one sentence on what problem this solves')}`,
    `# 分類可選：${CATEGORIES.join(' | ')}`,
    'category: systems',
    `tags: [${tags.map(yamlStr).join(', ')}]`,
    `start: ${ym(r.created_at)}`,
    `end: ${ym(r.pushed_at)}`,
    '# 仍在進行就刪掉 end 並改成 ongoing: true',
    'ongoing: false',
    `repo: ${r.full_name}`,
    `visibility: ${r.private ? 'private' : 'public'}`,
    ...(r.fork ? ['fork: true'] : []),
    ...(r.homepage ? ['links:', '  - label: Demo', `    url: ${r.homepage}`] : []),
    'featured: false',
    'draft: true',
    '---',
    '',
    '## Background',
    '',
    'TODO: Why did you build this? What problem does it solve?',
    '',
    '## What I did',
    '',
    'TODO: Your part of the work and the key technical decisions.',
    '',
    '## Outcome',
    '',
    'TODO: Measurable results — awards, users, performance numbers.',
    '',
  ].join('\n');

  writeFileSync(file, fm, 'utf8');
  console.log(`已建立草稿：src/content/projects/${slug}.md`);
  console.log('補完內容後把 draft 改成 false，再用 npm run dev 預覽。');
}

const arg = process.argv[2];
(arg ? scaffold(arg) : listMissing()).catch((e) => {
  console.error(e.message);
  process.exit(1);
});
