import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Note = CollectionEntry<'notes'>;

const sortKey = (p: Project) =>
  p.data.ongoing ? Number.MAX_SAFE_INTEGER : (p.data.end ?? p.data.start).getTime();

/** 所有非草稿專案：進行中的在最前，其餘依結束時間由新到舊 */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => !data.draft);
  return all.sort(
    (a, b) => sortKey(b) - sortKey(a) || b.data.start.getTime() - a.data.start.getTime(),
  );
}

/** 首頁精選：依 order 排序，同順序再依時間 */
export async function getFeatured(): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((p) => p.data.featured).sort((a, b) => a.data.order - b.data.order);
}

export async function getNotes(): Promise<Note[]> {
  const all = await getCollection('notes', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

const ym = (d: Date) => `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

export function formatPeriod(p: Project['data']): string {
  if (p.ongoing) return `${ym(p.start)} — now`;
  if (!p.end || ym(p.end) === ym(p.start)) return ym(p.start);
  return `${ym(p.start)} — ${ym(p.end)}`;
}

export const formatDate = (d: Date) =>
  `${ym(d)}.${String(d.getUTCDate()).padStart(2, '0')}`;

/** 專案的 GitHub 網址；private repo 不公開連結 */
export const repoUrl = (p: Project['data']) =>
  p.repo && p.visibility === 'public' ? `https://github.com/${p.repo}` : undefined;
