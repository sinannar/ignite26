// Checks the curated deck against its constraints and against the markdown source.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { announcements, chapters } from '../src/deck/content';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors: string[] = [];
const warnings: string[] = [];
const max = (what: string, text: string | undefined, n: number) => {
  if (text && text.length > n) warnings.push(`${what} is ${text.length} chars (target ≤ ${n}): "${text.slice(0, 40)}…"`);
};

// ---- source headings in news/ ----
function walk(dir: string): string[] {
  return readdirSync(dir).sort().flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : n.toLowerCase().endsWith('.md') && !n.startsWith('_') ? [p] : [];
  });
}
const sourceHeadings = new Set<string>();
const sourceChapters = new Set<string>();
for (const f of walk(join(root, 'news'))) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/^##\s+(.+?)\s*$/gm)) sourceHeadings.add(m[1]);
  for (const m of text.matchAll(/^#\s+(.+?)\s*$/gm)) sourceChapters.add(m[1]);
  for (const m of text.matchAll(/\]\(([^)]*)\)/g)) {
    const u = m[1].trim();
    if (!u) warnings.push(`${f.replace(root + '/', '')}: empty link in source`);
    else if (!/^https:\/\//.test(u)) warnings.push(`${f.replace(root + '/', '')}: malformed link in source: ${u.slice(0, 60)}`);
  }
}

// ---- rules ----
const chapterIds = new Set(chapters.map((c) => c.id));
const ids = new Set<string>();
const covered = new Set<string>();
for (const a of announcements) {
  const at = `announcement "${a.id}"`;
  if (ids.has(a.id)) errors.push(`${at}: duplicate id`);
  ids.add(a.id);
  if (!chapterIds.has(a.chapter)) errors.push(`${at}: unknown chapter "${a.chapter}"`);
  if (!sourceHeadings.has(a.source)) errors.push(`${at}: source "${a.source}" is not a ## heading in news/`);
  covered.add(a.source);
  if (!a.visuals.length) errors.push(`${at}: needs at least one visual`);
  if (!a.statuses.length) errors.push(`${at}: needs at least one status`);
  if (!a.links.length) warnings.push(`${at}: no source link`);
  for (const l of a.links) if (!/^https:\/\//.test(l.url)) errors.push(`${at}: bad link ${l.url}`);
  max(`${at} title`, a.title, 60);
  max(`${at} problem`, a.problem, 110);
  max(`${at} announced`, a.announced, 120);
  max(`${at} why`, a.why, 130);
  for (const it of a.whatsNew ?? []) { max(`${at} "${it.name}" name`, it.name, 60); max(`${at} "${it.name}" note`, it.note, 100); }
  if ((a.whatsNew?.length ?? 0) > 5) warnings.push(`${at}: whatsNew has more than 5 items`);
  for (const v of a.visuals) {
    if (v.kind === 'flow' && (v.steps.length < 3 || v.steps.length > 5)) warnings.push(`${at}: flow "${v.title}" should have 3-5 steps`);
    if (v.kind === 'grid') {
      if (v.groups.length > 6) warnings.push(`${at}: grid has more than 6 groups`);
      for (const g of v.groups) for (const it of g.items) { max(`${at} "${it.name}" name`, it.name, 60); max(`${at} "${it.name}" note`, it.note, 90); }
    }
    if (v.kind === 'flow') for (const s of v.steps) max(`${at} step "${s.label}" detail`, s.detail, 100);
  }
}
for (const c of sourceChapters) if (!chapters.some((x) => x.title === c)) warnings.push(`news/ chapter not in chapters[]: "${c}"`);
for (const c of chapters) if (!sourceChapters.has(c.title)) warnings.push(`chapter "${c.title}" has no "# ${c.title}" heading in news/`);
for (const h of sourceHeadings) if (!covered.has(h)) warnings.push(`news/ heading not covered by any slide: "${h}"`);

for (const w of warnings) console.warn(`warn   ${w}`);
for (const e of errors) console.error(`error  ${e}`);
console.log(`deck: ${announcements.length} announcements, ${chapters.length} chapters, ${warnings.length} warning(s), ${errors.length} error(s)`);
process.exit(errors.length ? 1 : 0);
