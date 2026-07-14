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
        position: relative;
        z-index: 100;
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
