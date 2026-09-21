<script>
  import { Header } from "$lib/components";

  let { children } = $props();
</script>

<div class="layout">
  <Header />

  <main>
    {@render children()}
  </main>
</div>
