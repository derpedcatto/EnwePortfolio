<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<h1>Main Page</h1>

<ul>
  {#each data.categories as category (category.slug)}
    <li>
      {category.title}
      {#if category.children.length > 0}
        <ul>
          {#each category.children as child (child.slug)}
            <li>{child.title}</li>
          {/each}
        </ul>
      {/if}
    </li>
  {/each}
</ul>
