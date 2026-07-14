<script>
  import HamburgerMenu from "$lib/components/molecules/HamburgerMenu/HamburgerMenu.svelte";
</script>

<header>
  <HamburgerMenu>
    {#snippet brand()}
      <div class="identity">
        <h3>Anna Yaroshevych</h3>

        <small class="subtitle">3d artist</small>
      </div>
    {/snippet}

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
  </HamburgerMenu>
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
        padding: 40px 60px 0;
        border-right: 1px solid var(--color-elements);
      }

      .identity {
        display: flex;
        flex-direction: row;
        gap: 10px;

        @include from(sm) {
          flex-direction: column;
          gap: 5px;
        }
      }

      h3 {
        text-transform: lowercase;
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

        @include until(sm) {
          display: flex;
          align-items: center;
          padding-top: 5px;
        }
      }
    }
  }
</style>
