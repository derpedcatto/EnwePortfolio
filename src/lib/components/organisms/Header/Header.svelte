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