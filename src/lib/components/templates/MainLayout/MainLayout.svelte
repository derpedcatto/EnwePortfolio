<script>
  import Header from "$lib/components/organisms/Header/Header.svelte";

  let {children} = $props();
</script>

<div class="layout">
  <Header/>

  <main class="layout__content content-grid">
    {@render children()}

    <h2>Main</h2>
  </main>
</div>

<style lang="scss">
  @layer components {
    .layout {
      display: flex;
      flex-direction: column;

      @include from(sm) {
        flex-direction: row;
      }
    }
  }
</style>
