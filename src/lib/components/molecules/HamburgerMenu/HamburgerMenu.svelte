<script>
  import { afterNavigate } from "$app/navigation";
  import HamburgerButton from "$lib/components/atoms/HamburgerButton/HamburgerButton.svelte";
  import { BREAKPOINTS } from "$lib/constants/breakpoints.js";

  let { brand, children } = $props();

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

  $effect(() => {
    const query = window.matchMedia(`(min-width: ${BREAKPOINTS.sm}px)`);

    function handleChange(event) {
      if (event.matches) {
        closeMenu();
      }
    }

    query.addEventListener("change", handleChange);

    return () => {
      query.removeEventListener("change", handleChange);
    };
  });

  afterNavigate(() => {
    closeMenu();
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="hamburger-menu__top">
  {@render brand?.()}

  <HamburgerButton open={menuOpen} onclick={toggleMenu} />
</div>

<div class="hamburger-menu__panel" class:is-open={menuOpen}>
  {@render children?.()}
</div>

<style lang="scss">
  @layer components {
    .hamburger-menu {
      &__top {
        display: flex;
        align-items: center;
        justify-content: space-between;

        @include until(sm) {
          position: relative;
          z-index: 100;
          padding: 16px var(--gutter);
        }
      }

      &__panel {
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
  }
</style>
