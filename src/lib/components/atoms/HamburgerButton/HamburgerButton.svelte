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
