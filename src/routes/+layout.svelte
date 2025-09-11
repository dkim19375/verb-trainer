<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import { browser } from '$app/environment';
	import { UmamiAnalytics } from '@lukulent/svelte-umami';

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

<UmamiAnalytics
	websiteID="7403fd4a-bc5d-425a-95d5-695eb1f60a5d"
	srcURL="https://umami.dkim19375.me/cool_info.js" />

{@render children()}
