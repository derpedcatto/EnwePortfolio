<script>
  import { afterNavigate } from "$app/navigation";
  import HamburgerButton from "$lib/components/atoms/HamburgerButton/HamburgerButton.svelte";

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

  // sm breakpoint is 576px (derpe-scss-base/abstracts/_defaults.scss), matching
  // the from(sm) mixin used for desktop styles in this component's style block.
  $effect(() => {
    const query = window.matchMedia("(min-width: 576px)");

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
    .hamburger-menu__top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      @include until(sm) {
        position: relative;
        z-index: 100;
        padding: 16px var(--gutter);
      }
    }

    .hamburger-menu__panel {
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
