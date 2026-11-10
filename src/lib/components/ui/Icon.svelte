<script lang="ts" module>
  import type { Component } from "svelte";

  const icons = import.meta.glob<Component>("#lib/assets/icons/*.svg", {
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

  export type IconName =
    | "navarrow"
    | "envelope-light"
    | "telegram-logo-light"
    | "artstation"
    | "linkedin-logo-light";

  export type IconVariant = "navarrow" | "header";
</script>

<script lang="ts">
  let {
    name,
    variant,
    className,
  }: {
    name: IconName;
    variant: IconVariant;
    className?: string;
  } = $props();

  const Icon = $derived(byName[name]);
</script>

<span class={className} data-variant={variant}>
  <Icon />
</span>

<style>
  @layer components {
    span {
      --icon-size: var(--font-size-base);

      display: inline-flex;
      width: var(--icon-size);
      height: var(--icon-size);

      &[data-variant="header"] {
        --icon-size: var(--font-size-2xl);
      }
    }
  }
</style>
