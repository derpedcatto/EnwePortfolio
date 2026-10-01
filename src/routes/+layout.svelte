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

  <main>
    {@render children()}
  </main>
</div>

<style>
  @layer layout {
    .layout {
      display: flex;
      flex-direction: column;

      @media (--lg) {
        flex-direction: row;
        justify-content: center;
      }
    }

    main {
      max-width: var(--layout-content);
      margin-inline: var(--layout-gutter);

      @media (--lg) {
        flex: 0 1 var(--layout-content);
        padding-block: var(--space-6);
      }
    }
  }
</style>
