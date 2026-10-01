<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import { afterNavigate } from "$app/navigation";
  import type { Contacts, NavItem } from "$lib/content/types";
  // import Icon from "../ui/Icon.svelte";

  let {
    navItems,
    contactsData,
  }: { navItems: NavItem[]; contactsData: Contacts } = $props();

  /* --------------------------------- Socials -------------------------------- */
  const social = (platform: "artstation" | "linkedin" | "telegram") =>
    contactsData.socials.find((s) => s.platform === platform)?.url ?? "#";

  /* ---------------------------------- Href ---------------------------------- */
  const trim = (p: string) => p.replace(/\/+$/, "");
  const home = trim(resolve("/"));
  const activeHref = $derived.by(() => {
    const path = trim(page.url.pathname);
    let best: string | undefined;

    for (const { href } of navItems.flatMap((i) => [i, ...i.children])) {
      const h = trim(href);

      const match =
        h === home ? path === h : path === h || path.startsWith(`${h}/`);

      if (match && (best === undefined || h.length > trim(best).length)) {
        best = href;
      }
    }

    return best;
  });

  /* ---------------------------------- Menu ---------------------------------- */
  let open = $state(false);
  afterNavigate(() => (open = false));

  /* ---------------------------------- Theme --------------------------------- */
  type Theme = "light" | "dark";
  let theme = $state<Theme>();

  onMount(() => {
    theme =
      (document.documentElement.dataset.theme as Theme | undefined) ??
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  function setTheme(t: Theme) {
    theme = t;
    localStorage.setItem("theme", t);

    const apply = () => (document.documentElement.dataset.theme = t);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduced) {
      apply();
    } else {
      document.startViewTransition(apply);
    }
  }
</script>

<svelte:window onkeydown={(e) => e.key === "Escape" && (open = false)} />

<header>
  <div class="bar">
    <div class="brand">
      <a href="http:" class="brand-name">Anna Yaroshevych</a>

      <p class="brand-role">3D artist</p>
    </div>

    <button
      class="menu-toggle"
      aria-expanded={open}
      onclick={() => (open = !open)}
    >
      <span>menu</span>
    </button>
  </div>

  <div id="menu" class="menu" class:open>
    <nav aria-label="Main">
      {#snippet link(item: NavItem)}
        <a
          href={item.href}
          class:active={item.href === activeHref}
          aria-current={item.href === activeHref ? "page" : undefined}
        >
          {item.title}
        </a>
      {/snippet}

      <ul>
        {#each navItems as item (item.href)}
          <li>
            {@render link(item)}

            {#if item.children.length > 0}
              <ul>
                {#each item.children as child (child.href)}
                  <li>
                    {@render link(child)}
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>

    <div class="menu-footer">
      <address>
        <a href={`mailto:${contactsData.email}`}>Email</a>

        <a
          rel="external noreferrer noopener"
          target="_blank"
          href={social("telegram")}>Telegram</a
        >

        <a
          rel="external noreferrer noopener"
          target="_blank"
          href={social("linkedin")}>LinkedIn</a
        >

        <a
          rel="external noreferrer noopener"
          target="_blank"
          href={social("artstation")}>ArtStation</a
        >
      </address>
    </div>

    <fieldset>
      <legend>Theme</legend>

      <label>
        <input
          type="radio"
          name="theme"
          value="light"
          checked={theme === "light"}
          onchange={() => setTheme("light")}
        />
        <span>light</span>
      </label>

      <label>
        <input
          type="radio"
          name="theme"
          value="dark"
          checked={theme === "dark"}
          onchange={() => setTheme("dark")}
        />
        <span>dark</span>
      </label>
    </fieldset>
  </div>
</header>

<style>
  @layer components {
    header {
      position: sticky;
      top: 0;
      z-index: var(--zindex-sticky);
      display: flex;
      flex-direction: column;
      scrollbar-width: thin;
      padding-inline: var(--space-4);
      padding-block: var(--space-1);
      background-color: var(--color-bg);
      border-bottom: 1px solid var(--color-border-subtle);
      flex-shrink: 0;

      @media (--lg) {
        height: 100dvh;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding-right: 0;
        padding-left: var(--space-4);
        padding-block: var(--space-6);

        background-color: var(--color-bg);
      }

      .bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 3.5rem;
        flex-shrink: 0;

        @media (--lg) {
          height: auto;
        }

        .brand {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);

          font-family: var(--font-family-heading);
          line-height: var(--font-leading-tight);
          letter-spacing: var(--font-tracking-tight);

          @media (--lg) {
            margin-bottom: var(--space-6);
          }

          .brand-name {
            font-size: var(--font-size-xl);
            color: var(--color-text);
          }

          .brand-role {
            color: var(--color-text-muted);
            cursor: default;
          }
        }

        .menu-toggle {
          border-radius: 0;
          text-align: inherit;
          background: none;
          box-shadow: none;
          padding: 0;
          cursor: pointer;
          border: none;
          color: inherit;
          font: inherit;

          @media (--lg) {
            display: none;
          }
        }
      }

      .menu {
        display: none;
        position: fixed;
        inset: 3.5rem 0 0 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: var(--space-4) var(--layout-gutter);
        flex-direction: column;
        gap: 1rem;
        text-transform: lowercase;
        background-color: var(--color-bg);

        @media (--lg) {
          display: flex;
          position: static;
          inset: auto;
          overflow: visible;
          padding: 0;
          flex: 1 0 auto;
        }

        &.open {
          display: flex;
        }

        nav {
          .active {
            color: var(--color-accent);
            font-weight: var(--font-weight-semibold);
          }

          ul li {
            margin-block: var(--space-1);
          }

          > ul > li:nth-child(2) {
            margin-bottom: var(--space-6);
          }

          ul li ul {
            margin-left: var(--space-2);
            padding-left: var(--space-4);
            border-left: 1px solid var(--color-border);
            text-wrap: wrap;

            li a {
              color: var(--color-text-muted);

              &:hover {
                color: var(--color-accent-hover);
              }
            }
          }
        }

        .menu-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;

          address {
            display: grid;
            font-style: normal;

            a {
              color: var(--color-text-muted);
            }
          }
        }

        fieldset {
          display: flex;
          gap: var(--space-4);
          border: 0;
          padding: 0;
          margin: 0;

          legend {
            font-size: 0;
          }

          span {
            color: var(--color-text-muted);
            cursor: pointer;
          }

          input {
            position: absolute;
            opacity: 0;
            width: 1px;
            height: 1px;

            &:checked + span {
              color: var(--color-text);
            }

            &:focus-visible + span {
              outline: 2px solid currentColor;
              outline-offset: 2px;
            }
          }
        }
      }

      ul {
        list-style: none;
        padding: 0;
      }

      a {
        text-decoration: none;
      }
    }

    :global(html):has(.menu.open) {
      @media not (--lg) {
        overflow: hidden;
      }
    }
  }
</style>
