<script lang="ts">
	import { goto } from '$app/navigation';
	import HeaderLeftSection from '$lib/components/HeaderLeftSection.svelte';

	const { verbsAmount }: { verbsAmount: number } = $props();
</script>

<article>
	<div class="mx-auto flex h-8 max-w-5xl items-center justify-between">
		<HeaderLeftSection />

		<div class="flex items-center gap-5">
			<span>{verbsAmount} Verb{verbsAmount == 1 ? '' : 's'}</span>
			<button
				class="h-10 w-20 text-base leading-0"
				onclick={() => goto('/train')}
				disabled={verbsAmount <= 0}>Start</button>
		</div>
	</div>
</article>
