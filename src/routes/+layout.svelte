<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import { browser } from '$app/environment';

	const { children }: { children: Snippet<[]> } = $props();

	let isDarkMode = $state(
		window.matchMedia('(prefers-color-scheme: dark)').matches,
	);

	if (browser) {
		window
			.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', function (e: MediaQueryListEvent) {
				isDarkMode = e.matches;
			});
	}
</script>

<svelte:head>
	{#if isDarkMode}
		<meta name="darkreader-lock" />
	{/if}
</svelte:head>

{@render children()}
