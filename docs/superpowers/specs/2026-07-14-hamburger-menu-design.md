# Hamburger menu for Header — design

## Purpose

`Header.svelte` currently renders all nav content unconditionally. On desktop
(`from(sm)`) it's a permanent sticky sidebar; on mobile (`until(sm)`) the same
content is just shown inline below the title, with no way to collapse it.
This adds a functional (not polished) hamburger toggle for mobile, matching
the provided mockup: collapsed state shows title + hamburger icon; open state
replaces the view with a full-screen nav overlay with a close (X) icon in the
same button.

Styling is intentionally minimal — the user will refine visuals later. This
pass is about correct structure and behavior.

## Scope

- Mobile only (`until(sm)`). Desktop's always-visible sidebar nav is
  untouched — the hamburger button is not rendered/visible at `from(sm)`.
- No changes to `NavLink` or `NavList` (both currently empty stub files) —
  the existing plain `<li>` nav markup in Header.svelte is reused as-is,
  just wrapped so it can be shown/hidden. Building out those components is
  out of scope here.

## Components

### New atom: `atoms/HamburgerButton/HamburgerButton.svelte`

Presentational toggle button, no knowledge of nav content or app state.

- Props: `open` (boolean), `onclick` (function).
- Renders a 3-bar icon; a CSS class driven by `open` morphs it into an X.
- `aria-label` ("Open menu" / "Close menu") and `aria-expanded={open}` for
  basic accessibility.

### `organisms/Header/Header.svelte` changes

- `let menuOpen = $state(false)` — local state; only Header needs it today.
- Renders `<HamburgerButton open={menuOpen} onclick={() => menuOpen = !menuOpen} />`.
  Hidden via CSS at `from(sm)`.
- The existing `<nav class="primary-nav">` and `<nav class="social-nav">`
  are wrapped in a container. Mobile CSS hides that container by default and
  shows it full-screen (fixed, covers viewport) when `menuOpen` is true.
  At `from(sm)`, the container is always visible regardless of `menuOpen`
  (desktop behavior unchanged).
- `$effect` on `menuOpen`: sets `document.body.style.overflow = "hidden"`
  while open, restores it when closed or on unmount (body scroll lock).
- `svelte:window onkeydown` — closes the menu on Escape when open.
- `afterNavigate` (from `$app/navigation`) closes the menu on route change.
  Note: the repo currently has only one route (`src/routes/+page.svelte`),
  so this cannot be exercised or verified in the browser yet. It's still
  correct SvelteKit code and will start working once more routes exist.

## Data flow

Single boolean (`menuOpen`), owned and consumed entirely within
`Header.svelte`. `HamburgerButton` is stateless and controlled via props —
no stores, no prop drilling, since nothing else in the tree needs this state
right now.

## Out of scope / explicitly deferred

- Visual polish (matching mockup spacing/typography/colors exactly).
- Wiring real navigation links (`NavLink`/`NavList` implementation).
- Focus trapping inside the open overlay.
- Any behavior beyond open/close, Escape-to-close, scroll lock, and
  close-on-navigate.

## Testing / verification

No unit-test surface here (this is UI interaction, not the kind of pure
logic the existing Vitest suite covers, e.g. `wsrv.test.js`). Verification
is manual: run the dev server, resize below the `sm` breakpoint, confirm
open/close via click, Escape, and that body scroll locks while open.
