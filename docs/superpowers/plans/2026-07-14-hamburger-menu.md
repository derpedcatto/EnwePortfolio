# Hamburger Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a functional (not visually polished) mobile hamburger menu to `Header.svelte`: below the `sm` breakpoint, a toggle button shows/hides a full-screen nav overlay; desktop's existing always-visible sidebar is untouched.

**Architecture:** A new self-contained `HamburgerButton` atom (icon toggle, no app knowledge) is rendered inside `Header.svelte`. `Header.svelte` owns a single `$state` boolean (`menuOpen`), wraps its existing nav markup in a container that CSS shows/hides based on that state (mobile only), and adds Escape-to-close, body-scroll-lock, and close-on-navigate behavior.

**Tech Stack:** Svelte 5 (runes: `$props`, `$state`, `$effect`), SvelteKit `$app/navigation` (`afterNavigate`), Sass with the project's `until()`/`from()` breakpoint mixins (auto-injected, never `@use` manually).

## Global Constraints

- Mobile only: hamburger button and overlay behavior apply below the `sm` breakpoint (`until(sm)`). Desktop (`from(sm)`) sidebar behavior must not change.
- No changes to `NavLink` or `NavList` — both remain empty stubs. Reuse the existing plain `<li>` markup from `Header.svelte` as-is, just wrapped for show/hide.
- Do not manually `@use "abstracts"` in any `<style lang="scss">` block — it's auto-injected project-wide (`vite.config.js`), a second load errors.
- Styling is functional-only, not pixel-matched to the mockup — per explicit user request.
- No new devDependencies. This repo's only test runner (`vitest.config.js`) is configured for plain Node, pure-logic tests (`environment: 'node'`, `src/**/*.test.js`) — there is no component-testing setup (`@testing-library/svelte`, jsdom, etc.) anywhere in the repo. Adding one is out of scope for this feature; verification is manual, via the dev server, matching the spec (`docs/superpowers/specs/2026-07-14-hamburger-menu-design.md`, "Testing / verification").
- Match existing code style seen in `Header.svelte` / `MainLayout.svelte`: double-quoted strings, semicolons, 2-space indent, `@layer components` wrapping all component styles.
- Colors/timing must come from existing CSS custom properties (`--color-text`, `--color-bg`, `--color-elements`, `--transition-duration`, `--gutter`, etc. — defined in `derpe-scss-base`'s `base/_theme.scss`) — never hardcode hex values.

---

### Task 1: `HamburgerButton` atom

**Files:**
- Create: `src/lib/components/atoms/HamburgerButton/HamburgerButton.svelte`

**Interfaces:**
- Produces: default-exported Svelte component `HamburgerButton` with props:
  - `open` (boolean, default `false`)
  - `onclick` (function, called with the native click event — no args are read by the component itself)
  - Renders `<button type="button" class="hamburger-button" class:is-open={open} aria-expanded={open} aria-label="Open menu"|"Close menu" onclick={onclick}>` containing three `<span class="bar">` elements.
  - Hides itself at `from(sm)` via its own internal CSS (`display: none`) — consumers don't need to hide it separately.

This is a leaf component with no dependency on Task 2; Task 2 depends on this one (imports and renders it).

- [ ] **Step 1: Create the component file**

```svelte
<script>
  let { open = false, onclick } = $props();
</script>

<button
  type="button"
  class="hamburger-button"
  class:is-open={open}
  aria-label={open ? "Close menu" : "Open menu"}
  aria-expanded={open}
  onclick={onclick}
>
  <span class="bar"></span>
  <span class="bar"></span>
  <span class="bar"></span>
</button>

<style lang="scss">
  @layer components {
    .hamburger-button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      width: 32px;
      height: 32px;
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;

      @include from(sm) {
        display: none;
      }

      .bar {
        width: 100%;
        height: 2px;
        background-color: var(--color-text);
        transition:
          transform var(--transition-duration),
          opacity var(--transition-duration);
      }

      &.is-open {
        .bar:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .bar:nth-child(2) {
          opacity: 0;
        }

        .bar:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
      }
    }
  }
</style>
```

Save this as `src/lib/components/atoms/HamburgerButton/HamburgerButton.svelte` (new directory).

- [ ] **Step 2: Sanity-check the file in isolation**

This component has no consumer yet, so Vite won't compile it until Task 2 imports it — there's nothing runnable to check standalone (no Storybook/isolated component runner in this repo). Just re-read the file and confirm:
- The three props (`open`, `onclick`) match the interface above exactly (Task 2 will call it with these exact names).
- No `@use "abstracts"` line was added (it's auto-injected; see Global Constraints).

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/atoms/HamburgerButton/HamburgerButton.svelte
git commit -m "feat: add HamburgerButton atom"
```

---

### Task 2: Wire the menu into `Header.svelte`

**Files:**
- Modify: `src/lib/components/organisms/Header/Header.svelte` (full file — current content shown below)

**Interfaces:**
- Consumes: `HamburgerButton` from Task 1 — `<HamburgerButton open={boolean} onclick={function} />`.
- Produces: nothing consumed elsewhere yet (`Header` is a leaf in the component tree, only used by `MainLayout.svelte`, which needs no changes).

Current file content (for reference — this whole file is being replaced):

```svelte
<header>
  <div>
    <h3>anna yaroshevych</h3>
    <small class="subtitle">3d artist</small>
  </div>

  <nav class="primary-nav">
    <ul>
      <li>selected works</li>
      <li>props</li>
      <li>textures</li>
      <li>various</li>
    </ul>

    <ul>
      <li>about me</li>
      <li>contacts</li>
    </ul>
  </nav>

  <nav class="social-nav">
    <ul>
      <li>ArtStation</li>
      <li>Instagram</li>
      <li>Mail</li>
    </ul>
  </nav>
</header>

<style lang="scss">
  @layer components {
    header {
      @include until(sm) {
        border-bottom: 1px solid var(--color-elements);
      }

      @include from(sm) {
        position: sticky;
        top: 0;
        left: 0;
        width: 320px;
        height: 100vh;
        overflow-y: auto;
        z-index: 100;
        padding: 0 60px;
        border-right: 1px solid var(--color-elements);
      }

      h3 {
        word-spacing: normal;

        @include from(sm) {
          word-spacing: 100vw;
        }
      }

      .subtitle {
        color: var(--color-text-muted);
        font-weight: 400;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
    }
  }
</style>
```

- [ ] **Step 1: Replace `Header.svelte` with the menu-aware version**

```svelte
<script>
  import { afterNavigate } from "$app/navigation";
  import HamburgerButton from "$lib/components/atoms/HamburgerButton/HamburgerButton.svelte";

  let menuOpen = $state(false);

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  function handleKeydown(event) {
    if (event.key === "Escape" && menuOpen) {
      closeMenu();
    }
  }

  $effect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  });

  afterNavigate(() => {
    closeMenu();
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<header>
  <div class="header__top">
    <div>
      <h3>anna yaroshevych</h3>
      <small class="subtitle">3d artist</small>
    </div>

    <HamburgerButton open={menuOpen} onclick={toggleMenu} />
  </div>

  <div class="nav-panel" class:is-open={menuOpen}>
    <nav class="primary-nav">
      <ul>
        <li>selected works</li>
        <li>props</li>
        <li>textures</li>
        <li>various</li>
      </ul>

      <ul>
        <li>about me</li>
        <li>contacts</li>
      </ul>
    </nav>

    <nav class="social-nav">
      <ul>
        <li>ArtStation</li>
        <li>Instagram</li>
        <li>Mail</li>
      </ul>
    </nav>
  </div>
</header>

<style lang="scss">
  @layer components {
    header {
      @include until(sm) {
        border-bottom: 1px solid var(--color-elements);
      }

      @include from(sm) {
        position: sticky;
        top: 0;
        left: 0;
        width: 320px;
        height: 100vh;
        overflow-y: auto;
        z-index: 100;
        padding: 0 60px;
        border-right: 1px solid var(--color-elements);
      }

      h3 {
        word-spacing: normal;

        @include from(sm) {
          word-spacing: 100vw;
        }
      }

      .subtitle {
        color: var(--color-text-muted);
        font-weight: 400;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
    }

    .header__top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      @include until(sm) {
        padding: 16px var(--gutter);
      }
    }

    .nav-panel {
      @include until(sm) {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 99;
        overflow-y: auto;
        padding: 16px var(--gutter);
        background-color: var(--color-bg);

        &.is-open {
          display: block;
        }
      }
    }
  }
</style>
```

Overwrite the full contents of `src/lib/components/organisms/Header/Header.svelte` with the above.

- [ ] **Step 2: Start the dev server**

Run: `npm run dev`
Expected: server starts with no compile errors printed in the terminal (this also runs `predev`'s content generator first — that's expected and unrelated to this change).

- [ ] **Step 3: Verify desktop is unchanged**

In a browser, open the dev server URL at a viewport width at or above the `sm` breakpoint (check the breakpoint value in `node_modules/derpe-scss-base/styles/abstracts/_config.scss` if unsure — resize well above typical tablet width, e.g. 1280px, to be safe).
Expected:
- The sidebar nav (title, "selected works" / "props" / "textures" / "various", "about me" / "contacts", social links) is visible exactly as before, with no hamburger icon showing anywhere.

- [ ] **Step 4: Verify mobile collapsed state**

Resize the browser (or use device toolbar) to a narrow width, e.g. 375px.
Expected:
- Only the title block and a hamburger icon (3 bars) are visible at the top.
- The nav content (selected works, props, textures, various, about me, contacts, ArtStation, Instagram, Mail) is not visible.

- [ ] **Step 5: Verify mobile open state**

Click the hamburger icon.
Expected:
- The icon morphs into an X.
- A full-screen overlay appears showing all nav content (both `<nav>` lists).
- The page behind it does not scroll (try scrolling — background content should stay put).

- [ ] **Step 6: Verify Escape closes the menu**

With the menu open, press the `Escape` key.
Expected: the overlay closes, the icon morphs back to the hamburger bars, and page scroll is restored (scrolling the page now works again).

- [ ] **Step 7: Verify clicking the button again closes the menu**

Reopen the menu by clicking the hamburger icon, then click it again (now showing as an X).
Expected: the overlay closes and the icon reverts to the hamburger bars.

- [ ] **Step 8: Run the existing test suite to confirm no regressions**

Run: `npm run test`
Expected: PASS (this change doesn't touch anything covered by `wsrv.test.js` or `searchRecord.test.js`, so this just confirms nothing else broke).

- [ ] **Step 9: Commit**

```bash
git add src/lib/components/organisms/Header/Header.svelte
git commit -m "feat: add mobile hamburger menu to Header"
```
