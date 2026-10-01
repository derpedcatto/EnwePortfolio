<script>
  import "../styles/main.css";
  import favicon from "$lib/assets/favicon.svg?url";

  import Header from "$lib/components/layout/Header.svelte";

  let { children, data } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="layout">
  <Header navItems={data.navItems} contactsData={data.contacts} />

  <div class="content">
    <main>
      {@render children()}
    </main>

    <footer>
      <span>
        Website designed by <a
          href="https://github.com/derpedcatto/EnwePortfolio"
          rel="external noreferrer noopener"
          target="_blank">derpedcatto</a
        >.
      </span>

      <br />

      <span>© 2026 Anna Yaroshevych. All rights reserved.</span>
    </footer>
  </div>
</div>

<style>
  @layer layout {
    .layout {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;

      @media (--lg) {
        flex-direction: row;
        justify-content: center;
      }

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        max-width: var(--layout-content);
        margin-inline: var(--layout-gutter);

        @media (--lg) {
          flex: 0 1 var(--layout-content);
          padding-block: var(--space-6);
        }

        main {
          flex: 1;
        }

        footer {
          font-family: var(--font-family-heading);
          font-size: var(--font-size-sm);
          margin-block: var(--space-6);
          text-align: center;
          text-wrap: pretty;

          @media (--lg) {
            margin-bottom: 0;
          }

          br {
            @media (--md) {
              display: none;
            }
          }
        }
      }
    }
  }
</style>
