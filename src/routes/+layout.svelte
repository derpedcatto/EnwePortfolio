<script>
	// Must come first: it declares the @layer order, and layer priority is fixed by
	// first appearance. Importing a component before this registers its `components`
	// layer ahead of `base`, inverting the cascade.
	import '../styles/main.scss';

	import favicon from '$lib/assets/favicon.svg';
	import MainLayout from '$lib/components/templates/MainLayout/MainLayout.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<MainLayout>
  {@render children()}
</MainLayout>
