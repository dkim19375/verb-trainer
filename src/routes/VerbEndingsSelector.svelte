<script lang="ts">
	import { VerbEnding, VerbEndingDisplays } from '$lib/types';

	const {
		endings,
		toggleEnding,
	}: {
		endings: VerbEnding[];
		toggleEnding: (ending: VerbEnding) => void;
	} = $props();
</script>

<article class="m-0 flex flex-col rounded-lg py-3">
	<h4 class="mb-1">Endings</h4>
	{#each Object.values(VerbEnding) as ending (ending)}
		<label>
			<input
				type="checkbox"
				checked={endings.includes(ending)}
				onchange={() => toggleEnding(ending)} />
			{VerbEndingDisplays[ending]}
		</label>
	{/each}
</article>

<style>
	article {
		gap: 0.55rem;
	}
</style>
