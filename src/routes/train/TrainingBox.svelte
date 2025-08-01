<script lang="ts">
	import type { Pronoun, Tense, VerbData } from '$lib/types';
	import ConjugationsTable from './ConjugationsTable.svelte';
	import TrainingVerbInfo from './TrainingVerbInfo.svelte';
	import TrainingVerbInputArea from './TrainingVerbInputArea.svelte';
	import autoAnimate from '@formkit/auto-animate';

	const {
		currentVerb,
		currentTense,
		currentPronoun,
		currentPronounExample,
		verbDisplay,
		verbDisplayAlt,
		nextVerb,
		gotIncorrect,
		showConjugations,
	}: {
		currentVerb: VerbData;
		currentTense: Tense;
		currentPronoun: Pronoun;
		currentPronounExample: string;
		verbDisplay: string;
		verbDisplayAlt: string;
		nextVerb: (firstTry: boolean) => void;
		gotIncorrect: () => void;
		showConjugations: boolean;
	} = $props();
</script>

<div
	class="flex h-full flex-1 flex-col items-center justify-center"
	use:autoAnimate={{ duration: 200 }}>
	<TrainingVerbInfo
		{currentTense}
		{currentPronounExample}
		{verbDisplay}
		{verbDisplayAlt} />
	<hr class="my-6 w-120" />
	{#if showConjugations}
		<div>
			<ConjugationsTable {currentVerb} {currentTense} />
		</div>
	{:else}
		<TrainingVerbInputArea
			{currentVerb}
			{currentTense}
			{currentPronoun}
			{nextVerb}
			{gotIncorrect} />
	{/if}
</div>
