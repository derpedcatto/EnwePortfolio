<script>
  import "../styles/main.css";
  import favicon from "$lib/assets/favicon.svg";

  import Header from "$lib/components/layout/Header.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="layout">
  <Header />

  <main>
    {@render children()}
  </main>
</div>
