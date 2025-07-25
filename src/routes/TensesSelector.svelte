<script lang="ts">
	import { Tense, TenseDisplayNames, TenseExamples } from '$lib/types';
	const {
		tenses,
		toggleTense,
	}: {
		tenses: Tense[];
		toggleTense: (pronoun: Tense) => void;
	} = $props();
</script>

<article class="m-0 flex flex-col rounded-lg">
	<h4>Tenses</h4>
	<div class="flex flex-row flex-wrap">
		{#each Object.values(Tense) as tense, index (tense)}
			<div class="tense-div flex h-13.5 items-center gap-2 pl-6">
				<input
					type="checkbox"
					checked={tenses.includes(tense)}
					onchange={() => toggleTense(tense)}
					id={`tense-${index}`} />
				<div class="flex flex-col">
					<label class="mb-0" for={`tense-${index}`}
						>{TenseDisplayNames[tense]}</label>
					<label
						class="mb-0.5 text-sm leading-5 text-gray-500"
						for={`tense-${index}`}>{TenseExamples[tense]}</label>
				</div>
			</div>
		{/each}
	</div>
</article>

<style>
	.tense-div {
		flex-basis: 33%;
		flex-grow: 1;
		--border-config: 3px solid
			color-mix(in srgb, var(--pico-secondary) 15%, transparent);
		border-top: var(--border-config);
		border-right: var(--border-config);
	}
	.tense-div:nth-child(n) {
		--border-radius: 0.4rem;
	}
	.tense-div:first-child {
		border-top-left-radius: var(--border-radius);
	}
	.tense-div:nth-child(3n + 1) {
		border-left: var(--border-config);
	}
	.tense-div:nth-child(3) {
		border-top-right-radius: var(--border-radius);
	}
	.tense-div:last-child {
		border-bottom: var(--border-config);
		border-bottom-left-radius: var(--border-radius);
		border-bottom-right-radius: var(--border-radius);
	}
</style>
