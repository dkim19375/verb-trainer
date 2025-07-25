<script lang="ts">
	import { Pronoun, PronounExamples } from '$lib/types';

	const {
		pronouns,
		togglePronoun,
	}: {
		pronouns: Pronoun[];
		togglePronoun: (pronoun: Pronoun) => void;
	} = $props();
</script>

<article class="m-0 flex flex-col rounded-lg py-3">
	<h4 class="mb-1">Pronouns</h4>
	{#each Object.values(Pronoun) as pronoun (pronoun)}
		<label>
			<input
				type="checkbox"
				checked={pronouns.includes(pronoun)}
				onchange={() => togglePronoun(pronoun)} />
			{PronounExamples[pronoun]}
		</label>
	{/each}
</article>

<style>
	article {
		gap: 0.55rem;
	}
</style>
