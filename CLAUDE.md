# EnwePortfolio

Static portfolio site for a 3D artist. SvelteKit (Svelte 5, runes) + Sveltia CMS, prerendered to static files and hosted on Cloudflare Pages.

## Stack

- **SvelteKit** with `adapter-static` (SPA fallback `404.html`), fully prerendered (`src/routes/+layout.js`).
- **Sveltia CMS** at `static/admin/` — Git-backed content, edited in-browser. The CMS script is **version-pinned** in `static/admin/index.html`; bump deliberately.
- **Sass** for styling (`src/styles/`).
- **Vitest** for unit tests (`npm run test`).
- **Deploys**: Cloudflare Pages builds from Git (build command `npm run build`, output `build/`). There is intentionally no CI workflow in the repo.

## Media architecture (important)

- **Content** (markdown/YAML) lives in the Git repo under `content/`.
- **Media** (images + video) lives in **Cloudflare R2**, NOT the repo. Configured in `static/admin/config.yml` under `media_libraries.cloudflare_r2`. Sveltia optimizes images in-browser (WebP, q85, max 2560px) before upload.
- **Image delivery**: `src/lib/images/Image.svelte` builds **wsrv.nl** URLs (`wsrv.js`) for on-demand resizing → responsive AVIF/WebP `<picture>` with inline thumbhash blur-up. Intrinsic width/height come from the placeholder entry, so images reserve space (no layout shift).
- **Video**: short loops/≤1min clips served directly from R2; longer videos → external YouTube links.

## Build-time generation

`scripts/generate-content-data.js` runs in `prebuild`/`predev` and writes gitignored `src/lib/generated/`:
- `search-index.json` — minimal per-project records for Fuse.js search (`src/lib/content/searchRecord.js`); tag slugs are resolved to display titles from `content/data/tags`.
- `placeholders.json` — `{ <image ref>: { hash, width, height } }`: base64 thumbhash + intrinsic dimensions per image.

**Incremental**: refs already in the previous `placeholders.json` are reused without refetching (`scripts/lib/placeholderPlan.js`); `npm run generate -- --force` refetches everything. Requires `PUBLIC_MEDIA_URL` env (R2 custom domain) to generate placeholders; without it, builds still succeed but skip them.

## Layout

```
content/            # Markdown/YAML content (committed)
src/lib/images/     # Image component + wsrv URL builders
src/lib/content/    # Content normalization for search
src/lib/generated/  # Build output (gitignored)
src/routes/         # Pages
src/styles/         # Sass
scripts/            # Build-time generators
static/admin/       # Sveltia CMS config + entry
```

## Commands

- `npm run dev` — dev server (runs generator first)
- `npm run build` — prerender to `build/` (runs generator first)
- `npm run test` — Vitest
- `npm run generate` — regenerate search index + placeholders (`-- --force` to refetch all images)
