<script>
	import favicon from '$lib/assets/favicon.svg';
	import '../styles/main.scss';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
