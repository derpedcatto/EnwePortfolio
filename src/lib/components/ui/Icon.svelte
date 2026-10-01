<script lang="ts" module>
  import type { Component } from "svelte";

  const icons = import.meta.glob<Component>("$lib/assets/icons/*.svg", {
    query: "?component",
    import: "default",
    eager: true,
  });

  const byName = Object.fromEntries(
    Object.entries(icons).map(([path, icon]) => [
      path.split("/").pop()!.replace(".svg", ""),
      icon,
    ]),
  ) as Record<IconName, Component>;

  export type IconName = "navarrow";
</script>

<script lang="ts">
  let {
    name,
    className,
  }: {
    name: IconName;
    className?: string;
  } = $props();

  const Icon = $derived(byName[name]);
</script>

<span class={className}>
  <Icon />
</span>

<style>
  @layer components {
    span {
      display: inline-flex;
      width: var(--font-size-base);
      height: var(--font-size-base);
    }
  }
</style>
