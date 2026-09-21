<script>
  /** @type {import('./$types').PageProps} */
  let { data } = $props();
</script>

<h1>Main Page</h1>

<ul>
  {#each data.categories as category (category.slug)}
    <li>{category.order} — {category.title} {category.parent ? `(parent: ${category.parent})` : ""}</li>
  {/each}
</ul>
