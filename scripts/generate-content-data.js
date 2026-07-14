// Build-time content data generator.
//
// Produces two files in src/lib/generated/ (gitignored, regenerated each build):
//   - search-index.json  : minimal per-project records for the Fuse.js client search
//   - placeholders.json   : { <image ref>: { hash, width, height } } — base64
//                           thumbhash for blur-up plus intrinsic dimensions so
//                           <Image> can reserve space and avoid layout shift.
//
// Incremental: refs already present in the previous placeholders.json are
// reused without refetching, so `npm run dev` is fast and works offline once
// primed. Pass `--force` (npm run generate -- --force) to refetch everything.
// CI has no previous output, so deploy builds always regenerate from scratch.
//
// Media lives in Cloudflare R2; image refs in frontmatter are resolved against
// PUBLIC_MEDIA_URL (the R2 custom domain) unless already absolute. The script
// is fault-tolerant: missing content, a missing PUBLIC_MEDIA_URL, or a failed
// fetch warns and continues rather than breaking the build.

import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';
import { rgbaToThumbHash } from 'thumbhash';
import { buildSearchRecord } from '../src/lib/content/searchRecord.js';
import { planPlaceholderWork } from './lib/placeholderPlan.js';

const ROOT = process.cwd();
const PROJECTS_DIR = path.join(ROOT, 'content', 'projects');
const TAGS_DIR = path.join(ROOT, 'content', 'data', 'tags');
const OUT_DIR = path.join(ROOT, 'src', 'lib', 'generated');
const MEDIA_BASE = (process.env.PUBLIC_MEDIA_URL ?? '').replace(/\/$/, '');
const FORCE = process.argv.includes('--force');

async function readMarkdownDir(dir) {
  if (!existsSync(dir)) return [];
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md'));
  const entries = [];
  for (const file of files) {
    const raw = await readFile(path.join(dir, file), 'utf8');
    entries.push({ slug: file.replace(/\.md$/, ''), data: matter(raw).data });
  }
  return entries;
}

async function readTagTitles() {
  const tags = await readMarkdownDir(TAGS_DIR);
  return Object.fromEntries(tags.map(({ slug, data }) => [slug, data.title ?? slug]));
}

function collectImageRefs(project) {
  const refs = [];
  if (typeof project.thumbnail === 'string') refs.push(project.thumbnail);
  if (Array.isArray(project.gallery)) {
    for (const item of project.gallery) {
      const img = typeof item === 'string' ? item : item?.image;
      if (typeof img === 'string') refs.push(img);
    }
  }
  return refs;
}

function toAbsoluteUrl(ref) {
  if (/^https?:\/\//.test(ref)) return ref;
  if (!MEDIA_BASE) return null;
  return `${MEDIA_BASE}/${ref.replace(/^\//, '')}`;
}

async function readPreviousPlaceholders() {
  try {
    const raw = await readFile(path.join(OUT_DIR, 'placeholders.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

async function placeholderFor(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());
  const image = sharp(input);
  const { width, height } = await image.metadata();
  const { data, info } = await image
    .resize(100, 100, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const hash = rgbaToThumbHash(info.width, info.height, data);
  return { hash: Buffer.from(hash).toString('base64'), width, height };
}

async function run() {
  const [projects, tagTitles, previous] = await Promise.all([
    readMarkdownDir(PROJECTS_DIR),
    readTagTitles(),
    readPreviousPlaceholders(),
  ]);

  const searchIndex = projects.map(({ data }) => buildSearchRecord(data, tagTitles));

  const refs = [...new Set(projects.flatMap(({ data }) => collectImageRefs(data)))];
  const { reused, toFetch } = planPlaceholderWork(refs, previous, FORCE);

  const placeholders = { ...reused };
  for (const ref of toFetch) {
    const url = toAbsoluteUrl(ref);
    if (!url) {
      console.warn(`[content-data] no PUBLIC_MEDIA_URL set — skipping placeholder for "${ref}"`);
      continue;
    }
    try {
      placeholders[ref] = await placeholderFor(url);
    } catch (err) {
      console.warn(`[content-data] could not hash ${url}: ${err.message}`);
    }
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(
    path.join(OUT_DIR, 'search-index.json'),
    `${JSON.stringify(searchIndex, null, 2)}\n`
  );
  await writeFile(
    path.join(OUT_DIR, 'placeholders.json'),
    `${JSON.stringify(placeholders, null, 2)}\n`
  );

  console.log(
    `[content-data] ${searchIndex.length} project(s) indexed; placeholders: ` +
      `${Object.keys(reused).length} reused, ${toFetch.length} fetched` +
      (FORCE ? ' (forced)' : '')
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
