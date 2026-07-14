# EnwePortfolio

Static portfolio site for a 3D artist. SvelteKit (Svelte 5, runes) + Sveltia CMS, prerendered to static files and hosted on Cloudflare Pages.

## Stack

- **SvelteKit** with `adapter-cloudflare`, fully prerendered (`src/routes/+layout.js`).
- **Sveltia CMS** at `static/admin/` — Git-backed content, edited in-browser. The CMS script is **version-pinned** in `static/admin/index.html`; bump deliberately.
- **Sass** for styling (`src/styles/`) — see Styling below.
- **Vitest** for unit tests (`npm run test`).
- **Deploys**: Cloudflare Pages builds from Git (build command `npm run build`, output **`.svelte-kit/cloudflare/`**). There is intentionally no CI workflow in the repo.

## Styling

- Design tokens, mixins, and type helpers come from **`derpe-scss-base`** (installed from GitHub, `dependencies`). Its `exports` map is `"./*": "./styles/*"`, so subpaths omit `styles/`: use `derpe-scss-base/abstracts`, **not** `derpe-scss-base/styles/abstracts`.
- `src/styles/_abstracts.scss` is the project's token config: it `@forward`s the library's abstracts `with (...)` the site's `$colors` and `$font-stack`. **Edit tokens here.**
- `vite.config.js` injects `@use "abstracts" as *` into every SCSS file (via `additionalData` + a `loadPaths` entry for `src/styles`). Tokens/mixins are therefore already in scope in every `.scss` file and every `<style lang="scss">` block — **never `@use` abstracts manually**, a second load errors.
- `$colors` roles are `(light, dark)` pairs; `base/_theme.scss` emits them as `light-dark()` custom properties. The site is light-only, so both slots hold the same value.
- `postcss.config.cjs` runs `postcss-preset-env` (polyfills `light-dark()`), so `postcss` + `postcss-preset-env` are required devDependencies.

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
src/styles/         # Sass (_abstracts.scss = token config, main.scss = entry)
scripts/            # Build-time generators
static/admin/       # Sveltia CMS config + entry
```

## Commands

- `npm run dev` — dev server (runs generator first)
- `npm run build` — prerender to `.svelte-kit/cloudflare/` (runs generator first)
- `npm run test` — Vitest
- `npm run generate` — regenerate search index + placeholders (`-- --force` to refetch all images)
